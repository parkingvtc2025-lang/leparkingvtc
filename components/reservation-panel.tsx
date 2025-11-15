"use client"

import { useEffect, useMemo, useState } from "react"
import { DayPicker, DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"

type ReservationPanelProps = {
  vehicleId: string
  blockedDates?: string[]
  minDays?: number
  maxDays?: number
}

export default function ReservationPanel({ vehicleId, blockedDates = [], minDays = 2, maxDays = 60 }: ReservationPanelProps) {
  const [reserved, setReserved] = useState<Array<{ from: Date; to: Date }>>([])
  const [selected, setSelected] = useState<DateRange | undefined>()
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0,0,0,0); return x }
  const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
  const tomorrow = addDays(startOfDay(new Date()), 1)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/vehicles/${vehicleId}/reservations`, { cache: "no-store" })
        if (!res.ok) throw new Error("HTTP " + res.status)
        const data = await res.json()
        if (!mounted) return
        const parseLocalYMD = (m: string): Date => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(m)) {
            const [yy, mm, dd] = m.split("-").map((x: string) => Number(x))
            return new Date(yy, mm - 1, dd)
          }
          return new Date(m)
        }
        const ranges: Array<{ from: Date; to: Date }> = Array.isArray(data.reservations)
          ? data.reservations.map((r: any) => ({ from: parseLocalYMD(String(r.from)), to: parseLocalYMD(String(r.to)) }))
          : []
        setReserved(ranges.map(({ from, to }) => { const s = new Date(from); s.setHours(0,0,0,0); const e = new Date(to); e.setHours(0,0,0,0); return { from: s, to: e } }))
      } catch (e) {
        if (mounted) setError("Impossible de charger les réservations.")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [vehicleId])

  const reservedMatchers = useMemo(() => reserved.map((r) => ({ from: r.from, to: r.to })) as any[], [reserved])
  const blockedMatchers = useMemo(() => {
    const arr = (blockedDates || [])
    return arr.map((s) => {
      const m = String(s)
      let d: Date
      if (/^\d{4}-\d{2}-\d{2}$/.test(m)) {
        const [yy, mm, dd] = m.split("-").map((x) => Number(x))
        d = new Date(yy, mm - 1, dd)
      } else {
        d = new Date(m)
      }
      d.setHours(0,0,0,0)
      return { from: d, to: d }
    }) as any[]
  }, [blockedDates])
  const disabledMatchers = useMemo(() => {
    const arr: any[] = []
    arr.push(...reservedMatchers)
    arr.push(...blockedMatchers)
    arr.push({ before: tomorrow })
    return arr
  }, [reservedMatchers, blockedMatchers, tomorrow])

  const modifiers = useMemo(() => ({ reserved: reservedMatchers, blocked: blockedMatchers }), [reservedMatchers, blockedMatchers])
  const modifiersStyles = useMemo(() => ({
    reserved: { backgroundColor: "#ef4444", color: "white" },
    blocked: { backgroundColor: "#ef4444", color: "white" },
  }), [])

  const rangeDays = useMemo(() => selected?.from && selected?.to ? Math.floor((startOfDay(selected.to).getTime() - startOfDay(selected.from).getTime()) / 86400000) + 1 : 0, [selected])
  const validRangeLen = rangeDays === 0 || (rangeDays >= minDays && rangeDays <= maxDays)
  const canSubmit = !!(selected?.from && selected?.to && email.includes("@") && phone.trim().length >= 6 && validRangeLen && !submitting)

  const submit = async () => {
    if (!selected?.from || !selected?.to) return
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const toYMD = (d: Date) => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
      }
      const res = await fetch(`/api/vehicles/${vehicleId}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          from: toYMD(selected.from),
          to: toYMD(selected.to),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Échec de la réservation")
      }
      setSuccess("Votre demande a été envoyée.")
      setSelected(undefined)
      setEmail("")
      setPhone("")
      const reload = await fetch(`/api/vehicles/${vehicleId}/reservations`, { cache: "no-store" })
      if (reload.ok) {
        const data = await reload.json()
        const parseLocalYMD = (m: string): Date => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(m)) {
            const [yy, mm, dd] = m.split("-").map((x: string) => Number(x))
            return new Date(yy, mm - 1, dd)
          }
          return new Date(m)
        }
        const ranges: Array<{ from: Date; to: Date }> = Array.isArray(data.reservations)
          ? data.reservations.map((r: any) => ({ from: parseLocalYMD(String(r.from)), to: parseLocalYMD(String(r.to)) }))
          : []
        setReserved(ranges.map(({ from, to }) => { const s = new Date(from); s.setHours(0,0,0,0); const e = new Date(to); e.setHours(0,0,0,0); return { from: s, to: e } }))
      }
    } catch (e: any) {
      setError(e?.message || "Une erreur est survenue")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-background/80 p-6 shadow-md">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Réserver ce véhicule</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choisissez une période et vos coordonnées. Validation sous 24h.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-foreground/10 bg-background p-4">
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={(r) => setSelected(r ? { from: r.from ? startOfDay(r.from) : undefined, to: r.to ? startOfDay(r.to) : undefined } : undefined)}
            disabled={disabledMatchers as any}
            modifiers={modifiers as any}
            modifiersStyles={modifiersStyles as any}
            modifiersClassNames={{ reserved: "rdp-day_reserved", blocked: "rdp-day_blocked" } as any}
            weekStartsOn={1}
            numberOfMonths={1}
            className="rdp text-foreground"
          />
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            <li>• Les dates en rouge sont indisponibles (réservées ou bloquées).</li>
            <li>• Départ à partir de demain (J+1).</li>
            <li>• Durée: {minDays} à {maxDays} jours.</li>
          </ul>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {selected?.from && selected?.to ? (
              <span>
                Du {selected.from.toLocaleDateString()} au {selected.to.toLocaleDateString()} ({rangeDays} jours)
              </span>
            ) : (
              <span>Choisissez vos dates</span>
            )}
            {!validRangeLen && (
              <div className="mt-1 text-xs text-red-500">Durée invalide: {minDays} à {maxDays} jours.</div>
            )}
          </div>
          {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>}
          <button
            disabled={!canSubmit}
            onClick={submit}
            className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold ${canSubmit ? "bg-primary text-primary-foreground" : "bg-foreground/20 text-foreground"}`}
          >
            {submitting ? "Envoi..." : "Envoyer la demande"}
          </button>
        </div>
      </div>
    </div>
  )
}
