"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCcw, CheckCheck, Bell } from "lucide-react"

type AdminNotification = {
  id: string
  type: string
  siteId?: string
  requestId?: string
  reservationId?: string
  vehicleId?: string
  vehicleName?: string | null
  vehicleCategory?: string | null
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phone?: string | null
  from?: any
  to?: any
  read?: boolean
  createdAt?: any
  reservationType?: string | null
}

function toDate(v: any): Date | null {
  if (!v) return null
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
  }
  if (typeof v === "object" && v.seconds != null) {
    // Firestore Timestamp JSON shape
    return new Date(v.seconds * 1000)
  }
  return null
}

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<AdminNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadOnly, setUnreadOnly] = useState(true)
  const [limit, setLimit] = useState(50)
  const [msg, setMsg] = useState<string | null>(null)
  const [openDetail, setOpenDetail] = useState<AdminNotification | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = new URL("/api/admin/notifications", window.location.origin)
      url.searchParams.set("unreadOnly", String(unreadOnly))
      url.searchParams.set("limit", String(limit))
      const res = await fetch(url.toString(), { cache: "no-store" })
      if (!res.ok) throw new Error("HTTP " + res.status)
      const data = await res.json()
      setItems(Array.isArray(data.notifications) ? data.notifications : [])
    } catch (e) {
      setError("Impossible de charger les notifications.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [unreadOnly, limit])

  const markRead = async (id: string, read: boolean) => {
    try {
      setMsg(null)
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read })
      })
      if (!res.ok) throw new Error(await res.text())
      await load()
      setMsg(read ? "Notification marquée comme lue." : "Notification marquée comme non lue.")
    } catch (e) {
      setMsg("Échec de mise à jour.")
    }
  }

  const markAllRead = async () => {
    try {
      setMsg(null)
      const res = await fetch(`/api/admin/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readAll: true })
      })
      if (!res.ok) throw new Error(await res.text())
      await load()
      setMsg("Toutes les notifications ont été marquées comme lues.")
    } catch (e) {
      setMsg("Échec de l'opération.")
    }
  }

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] hover:border-foreground/50">
              <ArrowLeft className="h-4 w-4" /> Accueil
            </Link>
            <h1 className="text-2xl font-semibold">Admin • Notifications</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] hover:border-foreground/40">
              <RefreshCcw className="h-4 w-4" /> Actualiser
            </button>
            <button onClick={markAllRead} className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] hover:border-foreground/40">
              <CheckCheck className="h-4 w-4" /> Tout marquer lu
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
            Afficher seulement non lues
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span>Limite</span>
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-md border border-foreground/20 bg-background px-2 py-1 text-sm">
              {[20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</div>
        </div>

        {msg && <div className="mb-4 rounded-md border border-foreground/20 bg-card px-4 py-2 text-sm">{msg}</div>}
        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-md border border-foreground/10 bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-foreground/10 bg-card px-4 py-6 text-sm text-muted-foreground">
            <Bell className="h-4 w-4" /> Aucune notification.
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((n) => {
              const created = toDate(n.createdAt)
              const from = toDate(n.from)
              const to = toDate(n.to)
              const isRequest = n.type === "reservation.requested"
              return (
                <div key={n.id} className="flex items-center justify-between gap-3 rounded-lg border border-foreground/10 bg-card px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${isRequest ? "bg-emerald-100 text-emerald-700" : "bg-foreground/10 text-foreground"}`}>{n.type}</span>
                      <span className="text-muted-foreground">{created ? created.toLocaleString() : "—"}</span>
                    </div>
                    <div className="mt-1 text-sm">
                      {isRequest ? (
                        <div>
                          <div className="text-foreground">Demande de réservation pour <strong>{n.vehicleName || n.vehicleId || "Véhicule"}</strong>{n.vehicleCategory ? ` • ${n.vehicleCategory}` : ""}</div>
                          {(n.firstName || n.lastName) && (
                            <div className="text-foreground text-xs">Client: {(n.firstName || "")} {(n.lastName || "")}</div>
                          )}
                          <div className="text-muted-foreground text-xs">{from ? from.toLocaleDateString() : "—"} → {to ? to.toLocaleDateString() : "—"}</div>
                          {n.reservationType && (
                            <div className="mt-0.5 inline-flex rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-foreground">{n.reservationType}</div>
                          )}
                          <div className="text-muted-foreground text-xs">{n.email || "—"} • {n.phone || "—"}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-foreground">Notification: {n.type}</div>
                          <div className="text-muted-foreground text-xs">{n.vehicleName || n.vehicleId || "—"}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-2">
                    <button onClick={() => setOpenDetail(n)} className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-1.5 text-xs hover:border-foreground/40">
                      Détails
                    </button>
                    <button onClick={() => markRead(n.id, !n.read)} className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-1.5 text-xs hover:border-foreground/40">
                      {n.read ? "Marquer non lue" : "Marquer lue"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>

    {openDetail && (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50" onClick={() => setOpenDetail(null)} aria-hidden />
        <div className="absolute left-1/2 top-1/2 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-foreground/15 bg-background p-5 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Détails de la notification</h2>
            <button onClick={() => setOpenDetail(null)} className="rounded p-1 hover:bg-secondary" aria-label="Fermer">×</button>
          </div>
          <div className="grid gap-3">
            <div className="rounded-md border border-foreground/15 p-3">
              <div className="text-xs text-muted-foreground">Type</div>
              <div className="text-sm font-medium">{openDetail.type}</div>
            </div>
            <div className="rounded-md border border-foreground/15 p-3">
              <div className="text-xs text-muted-foreground">Véhicule</div>
              <div className="text-sm font-medium">{openDetail.vehicleName || openDetail.vehicleId || "—"}</div>
              {openDetail.vehicleId && (
                <div className="text-xs text-muted-foreground">ID: {openDetail.vehicleId}</div>
              )}
            </div>
            {(openDetail.firstName || openDetail.lastName || openDetail.email || openDetail.phone) && (
              <div className="rounded-md border border-foreground/15 p-3">
                <div className="text-xs text-muted-foreground">Client</div>
                {(openDetail.firstName || openDetail.lastName) && (
                  <div className="text-sm font-medium">{openDetail.firstName || ""} {openDetail.lastName || ""}</div>
                )}
                <div className="text-xs text-muted-foreground">{openDetail.email || "—"} • {openDetail.phone || "—"}</div>
              </div>
            )}
            {(openDetail.from || openDetail.to) && (
              <div className="rounded-md border border-foreground/15 p-3">
                <div className="text-xs text-muted-foreground">Période</div>
                <div className="text-sm font-medium">
                  {(() => { const f = toDate(openDetail.from); const t = toDate(openDetail.to); return `${f ? f.toLocaleDateString() : "—"} → ${t ? t.toLocaleDateString() : "—"}` })()}
                </div>
                {openDetail.reservationType && (
                  <div className="mt-1 inline-flex rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-foreground">{openDetail.reservationType}</div>
                )}
              </div>
            )}
            <div className="rounded-md border border-foreground/15 p-3">
              <div className="text-xs text-muted-foreground">Métadonnées</div>
              <div className="text-xs text-muted-foreground">Notification ID: {openDetail.id}</div>
              {openDetail.requestId && <div className="text-xs text-muted-foreground">Request ID: {openDetail.requestId}</div>}
              {openDetail.reservationId && <div className="text-xs text-muted-foreground">Reservation ID: {openDetail.reservationId}</div>}
              <div className="text-xs text-muted-foreground">Créée: {(() => { const d = toDate(openDetail.createdAt); return d ? d.toLocaleString() : "—" })()}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button onClick={() => setOpenDetail(null)} className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] hover:border-foreground/40">Fermer</button>
          </div>
        </div>
      </div>
    )}
  )
}
