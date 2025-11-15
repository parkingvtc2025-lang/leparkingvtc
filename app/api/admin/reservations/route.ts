import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-client"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const vehicleId = url.searchParams.get("vehicleId")
    const format = url.searchParams.get("format")
    const hdr = req.headers
    const host = hdr.get("x-forwarded-host") ?? hdr.get("host") ?? "default"
    const siteId = host.toLowerCase()

    const col = collection(db, "reservations")
    const constraints: any[] = [where("siteId", "==", siteId)]
    if (vehicleId) constraints.push(where("vehicleId", "==", vehicleId))
    const q = query(col, ...constraints)
    const snap = await getDocs(q)

    const reservations = await Promise.all(snap.docs.map(async (d) => {
      const data = d.data() as any
      const vref = data.vehicleId ? doc(db, "vehicles", data.vehicleId) : null
      let vehicleName: string | null = null
      let vehicleCategory: string | null = null
      if (vref) {
        const vsnap = await getDoc(vref)
        if (vsnap.exists()) {
          const vdata = vsnap.data() as any
          vehicleName = vdata?.name || null
          vehicleCategory = vdata?.vehicleType || vdata?.motorization || null
        }
      }
      const toYMD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      return {
        id: d.id,
        vehicleId: data.vehicleId,
        email: data.email,
        phone: data.phone,
        from: data.from?.toDate ? toYMD(data.from.toDate()) : (data.from ?? null),
        to: data.to?.toDate ? toYMD(data.to.toDate()) : (data.to ?? null),
        status: data.status || "active",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt ?? null),
        vehicleName,
        vehicleCategory,
      }
    }))

    // sort by createdAt desc
    reservations.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())

    if (format === "csv") {
      const header = ["id","vehicleId","vehicleName","from","to","status","email","phone","createdAt"].join(",")
      const rows = reservations.map((r: any) => [r.id, r.vehicleId, sanitizeCsv(r.vehicleName), r.from, r.to, r.status, r.email, r.phone, r.createdAt].join(","))
      const csv = [header, ...rows].join("\n")
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=reservations.csv",
        }
      })
    }

    return NextResponse.json({ reservations })
  } catch (e) {
    return NextResponse.json({ error: "Failed to list reservations" }, { status: 500 })
  }
}

function sanitizeCsv(v: any) {
  if (v == null) return ""
  const s = String(v)
  if (s.includes(",") || s.includes("\n") || s.includes("\"")) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}
