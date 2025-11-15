"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { ArrowUpRight, X } from "lucide-react"
import { useEffect, useState } from "react"
import ReservationPanel from "@/components/reservation-panel"

export default function AdminVehicleReserveModal({ vehicleId }: { vehicleId: string }) {
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [name, setName] = useState<string>("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/vehicles/${vehicleId}`, { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        setBlockedDates(Array.isArray(data.blockedDates) ? data.blockedDates : [])
        setName(typeof data.name === "string" ? data.name : "")
      } catch {}
    })()
    return () => { mounted = false }
  }, [vehicleId])

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] hover:border-foreground/40">
          Réserver
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-foreground/15 bg-background p-0 shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-3">
            <Dialog.Title className="text-base font-semibold">Nouvelle réservation {name ? `• ${name}` : ""}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded p-1 hover:bg-secondary" aria-label="Fermer">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="p-5">
            <ReservationPanel vehicleId={vehicleId} blockedDates={blockedDates} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
