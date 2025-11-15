import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-client"
import { collection, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid body" }, { status: 400 })

    const rref = doc(db, "reservations", id)
    const rsnap = await getDoc(rref)
    if (!rsnap.exists()) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const rdata = rsnap.data() as any

    const updates: any = {}
    const email = body.email?.toString().trim()
    const phone = body.phone?.toString().trim()
    const status = body.status?.toString().trim()
    const fromRaw = body.from
    const toRaw = body.to

    if (email != null) updates.email = email
    if (phone != null) updates.phone = phone
    if (status != null) updates.status = status

    // If dates provided, validate and conflict check
    if (fromRaw != null || toRaw != null) {
      const toDate = (v: any): Date | null => v instanceof Timestamp ? v.toDate() : (v ? new Date(v) : null)
      const parseInputDate = (v: any): Date | null => {
        if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
          const [yy, mm, dd] = v.split("-").map((s: string) => Number(s))
          return new Date(yy, mm - 1, dd)
        }
        const d = new Date(v)
        return isNaN(d.getTime()) ? null : d
      }
      const currentFrom: Date | null = toDate(rdata.from)
      const currentTo: Date | null = toDate(rdata.to)

      const newFromUn = fromRaw != null ? parseInputDate(fromRaw) : currentFrom
      const newToUn = toRaw != null ? parseInputDate(toRaw) : currentTo
      if (!newFromUn || !newToUn) {
        return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
      }

      // Enforce similar rules (J+1, min/max)
      const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0,0,0,0); return x }
      const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
      const diffDays = (a: Date, b: Date) => Math.floor((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000) + 0
      const today = startOfDay(new Date())
      const tomorrow = addDays(today, 1)

      const newFrom = startOfDay(newFromUn)
      const newTo = startOfDay(newToUn)
      if (newFrom > newTo) {
        return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
      }
      if (newFrom < tomorrow) {
        return NextResponse.json({ error: "Sélection à partir de J+1" }, { status: 400 })
      }
      const daysCount = diffDays(newTo, newFrom) + 1
      const MIN_DAYS = 2
      const MAX_DAYS = 60
      if (daysCount < MIN_DAYS) return NextResponse.json({ error: `Durée minimale: ${MIN_DAYS} jours` }, { status: 400 })
      if (daysCount > MAX_DAYS) return NextResponse.json({ error: `Durée maximale: ${MAX_DAYS} jours` }, { status: 400 })

      // Vehicle blocked dates
      const vehicleId = rdata.vehicleId
      if (!vehicleId) return NextResponse.json({ error: "Reservation without vehicleId" }, { status: 400 })
      const vref = doc(db, "vehicles", vehicleId)
      const vsnap = await getDoc(vref)
      if (vsnap.exists()) {
        const vdata = vsnap.data() as any
        const blocked: string[] = Array.isArray(vdata?.blockedDates) ? vdata.blockedDates.filter(Boolean) : []
        if (blocked.length) {
          const toYMD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
          const blockedSet = new Set(blocked.map((s) => s.slice(0,10)))
          for (let d = newFrom; d <= newTo; d = addDays(d, 1)) {
            if (blockedSet.has(toYMD(d))) {
              return NextResponse.json({ error: "Plage comporte des jours bloqués" }, { status: 400 })
            }
          }
        }
      }

      // Conflict check with other reservations for same vehicle and same site
      const hdr = req.headers
      const host = hdr.get("x-forwarded-host") ?? hdr.get("host") ?? "default"
      const siteId = host.toLowerCase()
      const col = collection(db, "reservations")
      const q = query(col, where("vehicleId", "==", vehicleId), where("siteId", "==", siteId))
      const snap = await getDocs(q)
      for (const d of snap.docs) {
        if (d.id === id) continue
        const data = d.data() as any
        const existingFromRaw: Date = data.from instanceof Timestamp ? data.from.toDate() : new Date(data.from)
        const existingToRaw: Date = data.to instanceof Timestamp ? data.to.toDate() : new Date(data.to)
        const startOfDay = (x: Date) => { const y = new Date(x); y.setHours(0,0,0,0); return y }
        const existingFrom = startOfDay(existingFromRaw)
        const existingTo = startOfDay(existingToRaw)
        const st = (data.status || "active").toString()
        if (st !== "canceled") {
          const overlaps = newFrom <= existingTo && newTo >= existingFrom
          if (overlaps) return NextResponse.json({ error: "Dates déjà réservées" }, { status: 409 })
        }
      }

      updates.from = Timestamp.fromDate(newFrom)
      updates.to = Timestamp.fromDate(newTo)
    }

    await updateDoc(rref, updates)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
  }
}
