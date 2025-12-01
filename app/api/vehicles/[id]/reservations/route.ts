import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-client"
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, Timestamp, where } from "firebase/firestore"

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const hdr = req.headers
    const host = hdr.get("x-forwarded-host") ?? hdr.get("host") ?? "default"
    const siteId = host.toLowerCase()
    const isDevHost = siteId.includes("localhost") || siteId.startsWith("127.0.0.1") || siteId.endsWith(".vercel.app")

    // Fetch by vehicleId and filter by site in code to include legacy docs without siteId
    const q = query(collection(db, "reservations"), where("vehicleId", "==", id))
    const snap = await getDocs(q)
    const reservations = snap.docs
      .map((d) => {
        const data = d.data() as any
        const dataSiteId = typeof data.siteId === "string" ? data.siteId.toLowerCase() : null
        const coerceDate = (v: any): Date | null => {
          if (!v) return null
          if (v instanceof Timestamp) return v.toDate()
          try { const dt = new Date(v); return isNaN(dt.getTime()) ? null : dt } catch { return null }
        }
        const fromRaw = data.from ?? data.startDate
        const toRaw = data.to ?? data.endDate
        const from: Date | null = coerceDate(fromRaw)
        const to: Date | null = coerceDate(toRaw)
        const rawStatus = (data.status || "active").toString().toLowerCase()
        const status = rawStatus === "cancelled" ? "canceled" : rawStatus
        const toYMD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
        return {
          id: d.id,
          from: from ? toYMD(from) : null,
          to: to ? toYMD(to) : null,
          status,
          _siteId: dataSiteId,
        }
      })
      // include all in dev/preview, otherwise same-site and legacy (no _siteId). Only blocking statuses should appear in calendar.
      .filter((r: any) => {
        const isSameSiteOrLegacy = isDevHost || !r._siteId || r._siteId === siteId
        const hasValidRange = !!(r.from && r.to)
        const s = String(r.status || "").toLowerCase()
        const isBlocking = s === "active" || s === "reserved" || s === "confirmed" || s === "ongoing"
        return isSameSiteOrLegacy && hasValidRange && isBlocking
      })
      .map(({ _siteId, ...r }: any) => r)

    return NextResponse.json({ reservations })
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const body = await req.json().catch(() => null)
    const lastName = body?.lastName?.toString().trim()
    const firstName = body?.firstName?.toString().trim()
    const email = body?.email?.toString().trim()
    const phone = body?.phone?.toString().trim()
    const fromRaw = body?.from
    const toRaw = body?.to

    if (!lastName || !firstName || !email || !phone || !fromRaw || !toRaw) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const parseInputDate = (v: any): Date | null => {
      if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
        const [yy, mm, dd] = v.split("-").map((s: string) => Number(s))
        return new Date(yy, mm - 1, dd)
      }
      const d = new Date(v)
      return isNaN(d.getTime()) ? null : d
    }

    const fromUnnorm = parseInputDate(fromRaw)
    const toUnnorm = parseInputDate(toRaw)
    if (!fromUnnorm || !toUnnorm) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
    }

    // Rules: J+1, min/max duration, blocked days
    const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0,0,0,0); return x }
    const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
    const diffDays = (a: Date, b: Date) => Math.floor((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000) + 0
    const today = startOfDay(new Date())

    const from = startOfDay(fromUnnorm)
    const to = startOfDay(toUnnorm)
    if (from > to) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
    }
    if (from < today) {
      return NextResponse.json({ error: "Sélection à partir d'aujourd'hui" }, { status: 400 })
    }
    const daysCount = diffDays(to, from) + 1
    const MIN_DAYS = 7
    if (daysCount < MIN_DAYS) {
      return NextResponse.json({ error: `Durée minimale: ${MIN_DAYS} jours` }, { status: 400 })
    }

    const hdr = req.headers
    const host = hdr.get("x-forwarded-host") ?? hdr.get("host") ?? "default"
    const siteId = host.toLowerCase()

    // Blocked dates from vehicle document
    const vref = doc(db, "vehicles", id)
    const vsnap = await getDoc(vref)
    let vdata: any = null
    if (vsnap.exists()) {
      vdata = vsnap.data() as any
      const blocked: string[] = Array.isArray(vdata?.blockedDates) ? vdata.blockedDates.filter(Boolean) : []
      if (blocked.length) {
        const toYMD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
        const blockedSet = new Set(blocked.map((s) => String(s).slice(0,10)))
        for (let d = from; d <= to; d = addDays(d, 1)) {
          if (blockedSet.has(toYMD(d))) {
            return NextResponse.json({ error: "Plage comporte des jours bloqués" }, { status: 400 })
          }
        }
      }
    }

    // Persist a request (not a reservation)
    const reqRef = await addDoc(collection(db, "reservation_requests"), {
      vehicleId: id,
      lastName,
      firstName,
      email,
      phone,
      from: Timestamp.fromDate(from),
      to: Timestamp.fromDate(to),
      siteId,
      days: daysCount,
      type: (body?.type === 'rattachement' ? 'rattachement' : 'simple'),
      status: "new",
      createdAt: serverTimestamp(),
    })

    // create admin notification referencing the request
    await addDoc(collection(db, "notifications"), {
      siteId,
      type: "reservation.requested",
      requestId: reqRef.id,
      vehicleId: id,
      vehicleName: vdata?.name || null,
      vehicleCategory: vdata?.vehicleType || vdata?.motorization || null,
      reservationType: (body?.type === 'rattachement' ? 'rattachement' : 'simple'),
      lastName,
      firstName,
      email,
      phone,
      from: Timestamp.fromDate(from),
      to: Timestamp.fromDate(to),
      read: false,
      createdAt: serverTimestamp(),
    })

    try {
      const toYMD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      await fetch("https://europe-west1-parkingvtc-25954.cloudfunctions.net/sendTestEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          vehicle: vdata?.name || id,
          from: toYMD(from),
          toDate: toYMD(to),
        }),
        cache: "no-store",
      })
    } catch {}

    return NextResponse.json({ ok: true, requestId: reqRef.id })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}
