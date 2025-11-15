"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import AdminVehicleReserveModal from "@/components/admin-vehicle-reserve-modal"

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/vehicles", { cache: "no-store" })
        if (!res.ok) throw new Error("HTTP " + res.status)
        const data = await res.json()
        if (mounted) setVehicles(Array.isArray(data.vehicles) ? data.vehicles : [])
      } catch (e) {
        if (mounted) setError("Impossible de charger les véhicules.")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] hover:border-foreground/50">
              <ArrowLeft className="h-4 w-4" /> Accueil
            </Link>
            <h1 className="text-2xl font-semibold">Admin • Véhicules</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/notifications" className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] hover:border-foreground/40">
              Notifications
            </Link>
          </div>
        </div>

        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl border border-foreground/10 bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v: any) => (
              <div key={v.id} className="overflow-hidden rounded-xl border border-foreground/15 bg-card shadow-md">
                <div className="relative h-44 w-full">
                  <Image src={v.image || "/placeholder.jpg"} alt={v.name || "Véhicule"} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" />
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{v.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{v.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/flotte/${v.id}`} className="rounded-md border border-foreground/20 px-3 py-1.5 text-xs uppercase tracking-[0.3em] hover:border-foreground/40">Voir</Link>
                    <AdminVehicleReserveModal vehicleId={v.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
