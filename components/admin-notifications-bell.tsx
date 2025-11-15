"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Bell, Check, Eye, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase-client"

export default function AdminNotificationsBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items])

  useEffect(() => {
    setLoading(true)
    const siteId = window.location.host.toLowerCase()
    const col = collection(db, "notifications")
    const qy = query(col, where("siteId", "==", siteId))
    const unsub = onSnapshot(qy, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        .sort((a: any, b: any) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      setItems(arr)
      setLoading(false)
    }, () => setLoading(false))
    return () => unsub()
  }, [])

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) })
      setItems((arr) => arr.map((x) => x.id === id ? { ...x, read: true } : x))
    } catch {}
  }

  const confirmReservation = async (notif: any) => {
    try {
      if (!notif?.reservationId) return
      await fetch(`/api/admin/reservations/${notif.reservationId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "active" }) })
      await markRead(notif.id)
    } catch {}
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="relative inline-flex items-center rounded-full border border-foreground/20 p-2 hover:border-foreground/40" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">{unreadCount}</span>
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={8} className="z-50 w-[360px] rounded-lg border border-foreground/15 bg-background p-2 shadow-xl">
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="text-sm font-semibold">Notifications</div>
            <button onClick={() => { /* no-op with realtime */ }} className="rounded p-1 text-xs hover:bg-secondary"><RefreshCcw className="h-4 w-4" /></button>
          </div>
          <div className="max-h-[60vh] overflow-auto">
            {loading ? (
              <div className="p-3 text-sm text-muted-foreground">Chargement...</div>
            ) : items.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">Aucune notification</div>
            ) : (
              <ul className="space-y-1">
                {items.map((n) => (
                  <li key={n.id} className={`rounded-md border ${n.read ? "border-transparent" : "border-foreground/15"} bg-card/70 p-3`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm">
                        <div className="font-medium">{n.type || "Notification"}</div>
                        <div className="text-xs text-muted-foreground">Véhicule: {n.vehicleId} • {n.from?.seconds ? new Date(n.from.seconds*1000).toLocaleDateString() : ""} → {n.to?.seconds ? new Date(n.to.seconds*1000).toLocaleDateString() : ""}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!!n.reservationId && (
                          <button onClick={() => confirmReservation(n)} className="inline-flex items-center gap-1 rounded border border-foreground/20 px-2 py-1 text-xs hover:border-foreground/40"><Check className="h-3.5 w-3.5" /> Confirmer</button>
                        )}
                        {!n.read && (
                          <button onClick={() => markRead(n.id)} className="inline-flex items-center gap-1 rounded border border-foreground/20 px-2 py-1 text-xs hover:border-foreground/40"><Eye className="h-3.5 w-3.5" /> Lu</button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-2 border-t border-foreground/10 pt-2 text-right">
            <Link href="/admin/notifications" className="text-xs text-muted-foreground hover:text-foreground">Voir toutes</Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
