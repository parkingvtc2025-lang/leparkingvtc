"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, Download, Filter, Pencil, RefreshCcw, Save, Search, X } from "lucide-react"
import { DayPicker, DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"
import Link from "next/link"

type AdminReservation = {
  id: string
  vehicleId: string
  vehicleName?: string | null
  vehicleCategory?: string | null
  email: string
  phone: string
  from: string
  to: string
  status: string
  createdAt?: string | null
}

export default function AdminReservationsPage() {
  const [all, setAll] = useState<AdminReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [vehicleFilter, setVehicleFilter] = useState("")

  // editor modal state
  const [editing, setEditing] = useState<AdminReservation | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [reservedAdmin, setReservedAdmin] = useState<Array<{ from: Date; to: Date }>>([])
  const [blockedAdmin, setBlockedAdmin] = useState<Array<{ from: Date; to: Date }>>([])
  const [range, setRange] = useState<DateRange | undefined>()

  const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0,0,0,0); return x }
  const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
  const tomorrow = addDays(startOfDay(new Date()), 1)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = new URL("/api/admin/reservations", window.location.origin)
      if (vehicleFilter.trim()) url.searchParams.set("vehicleId", vehicleFilter.trim())
      const res = await fetch(url.toString(), { cache: "no-store" })
      if (!res.ok) throw new Error("HTTP " + res.status)
      const data = await res.json()
      setAll(Array.isArray(data.reservations) ? data.reservations : [])
    } catch (e) {
      setError("Impossible de charger les réservations.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter((r) => {
      const hay = `${r.id} ${r.vehicleId} ${r.vehicleName ?? ""} ${r.email} ${r.phone} ${r.status}`.toLowerCase()
      return hay.includes(q)
    })
  }, [all, query])

  const toggleCancel = async (r: AdminReservation) => {
    try {
      setMsg(null)
      const next = r.status === "canceled" ? "active" : "canceled"
      const res = await fetch(`/api/admin/reservations/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error(await res.text())
      await load()
      setMsg(`Réservation ${r.id} mise à jour.`)
    } catch (e) {
      setMsg("Echec de mise à jour.")
    }
  }

  const loadReservedForVehicle = async (vehicleId: string, excludeReservationId?: string) => {
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/reservations`, { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      const parseLocalYMD = (m: string): Date => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(m)) {
          const [yy, mm, dd] = m.split("-").map((x: string) => Number(x))
          return new Date(yy, mm - 1, dd)
        }
        return new Date(m)
      }
      const ranges: Array<{ from: Date; to: Date; id?: string }> = Array.isArray(data.reservations)
        ? data.reservations.map((r: any) => ({ id: r.id, from: parseLocalYMD(String(r.from)), to: parseLocalYMD(String(r.to)) }))
        : []
      const filtered = ranges.filter((r) => r.id !== excludeReservationId)
      setReservedAdmin(filtered.map(({ from, to }) => { const s = new Date(from); s.setHours(0,0,0,0); const e = new Date(to); e.setHours(0,0,0,0); return { from: s, to: e } }))

      // Also fetch vehicle blocked dates
      const vres = await fetch(`/api/vehicles/${vehicleId}`, { cache: "no-store" })
      if (vres.ok) {
        const vdata = await vres.json()
        const blocked: Array<{ from: Date; to: Date }> = Array.isArray(vdata?.blockedDates)
          ? vdata.blockedDates.filter(Boolean).map((s: string) => {
              const m = String(s)
              let d: Date
              if (/^\d{4}-\d{2}-\d{2}$/.test(m)) {
                const [yy, mm, dd] = m.split("-").map((x: string) => Number(x))
                d = new Date(yy, mm - 1, dd)
              } else {
                d = new Date(m)
              }
              d.setHours(0,0,0,0)
              return { from: d, to: d }
            })
          : []
        setBlockedAdmin(blocked)
      } else {
        setBlockedAdmin([])
      }
    } catch {}
  }

  useEffect(() => {
    if (!editing?.vehicleId) return
    loadReservedForVehicle(editing.vehicleId, editing.id)
    // seed range with current values
    if (editing.from && editing.to) {
      const f = new Date(editing.from); f.setHours(0,0,0,0)
      const t = new Date(editing.to); t.setHours(0,0,0,0)
      setRange({ from: f, to: t })
    } else {
      setRange(undefined)
    }
  }, [editing?.vehicleId, editing?.id])

  const blockedMatchers = useMemo(() => blockedAdmin.map((r) => ({ from: r.from, to: r.to })) as any[], [blockedAdmin])
  const disabledMatchers = useMemo(() => { const arr: any[] = []; arr.push(...reservedAdmin); arr.push(...blockedAdmin); arr.push({ before: tomorrow }); return arr }, [reservedAdmin, blockedAdmin, tomorrow])
  const modifiers = useMemo(() => ({ reserved: reservedAdmin, blocked: blockedAdmin }) as any, [reservedAdmin, blockedAdmin])
  const modifiersStyles = useMemo(() => ({ reserved: { backgroundColor: "#ef4444", color: "white" }, blocked: { backgroundColor: "#ef4444", color: "white" } }), [])

  const saveEdit = async () => {
    if (!editing) return
    try {
      setSaving(true)
      setMsg(null)
      const body: any = {
        email: editing.email,
        phone: editing.phone,
        from: range?.from ? new Date(range.from) : undefined,
        to: range?.to ? new Date(range.to) : undefined,
        status: editing.status,
      }
      const res = await fetch(`/api/admin/reservations/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          from: body.from ? `${body.from.getFullYear()}-${String(body.from.getMonth() + 1).padStart(2, "0")}-${String(body.from.getDate()).padStart(2, "0")}` : undefined,
          to: body.to ? `${body.to.getFullYear()}-${String(body.to.getMonth() + 1).padStart(2, "0")}-${String(body.to.getDate()).padStart(2, "0")}` : undefined,
        }),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt)
      }
      setEditing(null)
      await load()
      setMsg("Réservation modifiée.")
    } catch (e) {
      setMsg("Échec de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] hover:border-foreground/50">
              <ArrowLeft className="h-4 w-4" /> Accueil
            </Link>
            <h1 className="text-2xl font-semibold">Admin • Réservations</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/notifications" className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] hover:border-foreground/40">
              Notifications
            </Link>
            <a href={`/api/admin/reservations?${vehicleFilter ? `vehicleId=${encodeURIComponent(vehicleFilter)}&` : ""}format=csv`} className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] hover:border-foreground/40">
              <Download className="h-4 w-4" /> Export CSV
            </a>
            <button onClick={load} className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] hover:border-foreground/40">
              <RefreshCcw className="h-4 w-4" /> Actualiser
            </button>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher (id, email, tel, véhicule...)" className="w-full rounded-md border border-foreground/20 bg-background px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30" />
            </div>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} placeholder="Filtrer par vehicleId" className="w-56 rounded-md border border-foreground/20 bg-background px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30" />
            </div>
          </div>
        </div>

        {msg && <div className="mb-4 rounded-md border border-foreground/20 bg-card px-4 py-2 text-sm">{msg}</div>}
        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-md border border-foreground/10 bg-muted" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-foreground/10">
            <table className="min-w-full text-sm">
              <thead className="bg-card/70">
                <tr className="text-left">
                  <th className="px-3 py-3 font-semibold">ID</th>
                  <th className="px-3 py-3 font-semibold">Véhicule</th>
                  <th className="px-3 py-3 font-semibold">Période</th>
                  <th className="px-3 py-3 font-semibold">Statut</th>
                  <th className="px-3 py-3 font-semibold">Client</th>
                  <th className="px-3 py-3 font-semibold">Créée</th>
                  <th className="px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-foreground/10">
                    <td className="px-3 py-3 align-top text-muted-foreground">{r.id.slice(0, 6)}…</td>
                    <td className="px-3 py-3 align-top">
                      <div className="font-medium">{r.vehicleName || r.vehicleId}</div>
                      <div className="text-xs text-muted-foreground">{r.vehicleCategory}</div>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <div>{r.from} → {r.to}</div>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${r.status === "canceled" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{r.status}</span>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <div className="text-foreground">{r.email}</div>
                      <div className="text-xs text-muted-foreground">{r.phone}</div>
                    </td>
                    <td className="px-3 py-3 align-top text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}</td>
                    <td className="px-3 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(r)} className="inline-flex items-center gap-1 rounded-md border border-foreground/20 px-2 py-1 text-xs hover:border-foreground/40"><Pencil className="h-3.5 w-3.5" /> Éditer</button>
                        <button onClick={() => toggleCancel(r)} className="inline-flex items-center gap-1 rounded-md border border-foreground/20 px-2 py-1 text-xs hover:border-foreground/40">{r.status === "canceled" ? "Restaurer" : "Annuler"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} aria-hidden />
          <div className="absolute left-1/2 top-1/2 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-foreground/15 bg-background p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Modifier la réservation</h2>
              <button onClick={() => setEditing(null)} className="rounded p-1 hover:bg-secondary" aria-label="Fermer"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                <input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Téléphone</label>
                <input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">Période</label>
                <div className="rounded-lg border border-foreground/10 bg-background p-3">
                  <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={(r) => setRange(r ? { from: r?.from ? startOfDay(r.from as Date) : undefined, to: r?.to ? startOfDay(r.to as Date) : undefined } : undefined)}
                    disabled={disabledMatchers as any}
                    modifiers={modifiers as any}
                    modifiersStyles={modifiersStyles as any}
                    modifiersClassNames={{ reserved: "rdp-day_reserved", blocked: "rdp-day_blocked" } as any}
                    weekStartsOn={1}
                    numberOfMonths={1}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">Les périodes en rouge sont indisponibles (réservées ou bloquées).</p>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Statut</label>
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30">
                  <option value="active">active</option>
                  <option value="canceled">canceled</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={() => setEditing(null)} className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] hover:border-foreground/40"><X className="h-4 w-4" /> Fermer</button>
              <button disabled={saving} onClick={saveEdit} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground"><Save className="h-4 w-4" /> Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
