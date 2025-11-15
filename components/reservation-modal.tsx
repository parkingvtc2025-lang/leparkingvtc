"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { ArrowUpRight, X } from "lucide-react"
import ReservationPanel from "@/components/reservation-panel"

type Props = {
  vehicleId: string
  blockedDates?: string[]
  minDays?: number
  maxDays?: number
}

export default function ReservationModal({ vehicleId, blockedDates = [], minDays = 2, maxDays = 60 }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground shadow-lg transition hover:shadow-xl">
          Réserver ce véhicule
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-foreground/15 bg-background p-0 shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-3">
            <Dialog.Title className="text-base font-semibold">Réservation</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded p-1 hover:bg-secondary" aria-label="Fermer">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="p-5">
            <ReservationPanel vehicleId={vehicleId} blockedDates={blockedDates} minDays={minDays} maxDays={maxDays} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
