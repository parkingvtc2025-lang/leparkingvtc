import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import Navbar from "@/components/navbar"
import ImageCarousel from "@/components/image-carousel"
import ReservationModal from "@/components/reservation-modal"

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https")
  const base = `${proto}://${host}`
  const res = await fetch(`${base}/api/vehicles/${id}`, { cache: "no-store" })
  if (!res.ok) notFound()
  const vehicle = await res.json()
  const energyLabel = vehicle?.specs?.batteryCapacity
    ? "Capacité batterie"
    : (vehicle?.specs?.displacement ? "Cylindrée" : "Capacité batterie")
  const energyValue = vehicle?.specs?.batteryCapacity
    ?? vehicle?.specs?.displacement
    ?? vehicle?.specs?.cylindree

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Mobile hero - full width image on top */}
      <div className="relative h-[55svh] w-full overflow-hidden lg:hidden">
        <ImageCarousel
          images={Array.isArray(vehicle.imageUrls) && vehicle.imageUrls.length > 0 ? vehicle.imageUrls : [vehicle.image]}
          sizes="100vw"
          priorityFirst
          className="h-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      </div>

      {/* Desktop split-screen: left full-bleed image (fixed), right scrollable panel */}
      <div className="relative z-10 lg:grid lg:h-screen lg:grid-cols-[minmax(0,1fr)_520px]">
        {/* Left: full-height imagery, fixed visually with sticky */}
        <div className="relative hidden lg:block">
          <div className="sticky top-0 h-[100dvh] overflow-hidden">
            <ImageCarousel
              images={Array.isArray(vehicle.imageUrls) && vehicle.imageUrls.length > 0 ? vehicle.imageUrls : [vehicle.image]}
              sizes="(min-width: 1024px) calc(100vw - 520px)"
              priorityFirst
              className="h-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent dark:from-black/40" />
          </div>
        </div>

        {/* Right: scrollable information panel with fixed bottom CTA */}
        <aside className="relative border-l border-foreground/10 bg-background/95 lg:max-h-[100dvh] lg:overflow-y-auto">
          <section className="px-6 py-8 md:px-8 md:py-12 lg:py-16 space-y-8">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/flotte"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-foreground transition hover:border-foreground/50"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la flotte
              </Link>
              <div className="flex flex-wrap gap-2">
                {(vehicle.badges || []).map((badge: string) => (
                  <span key={badge} className="rounded-full border border-foreground/25 bg-foreground/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-foreground">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <header className="space-y-3">
              <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">{vehicle.category}</p>
              <h1 className="text-3xl md:text-5xl font-semibold text-foreground">{vehicle.name}</h1>
              <p className="max-w-prose text-sm md:text-base text-muted-foreground">{vehicle.summary}</p>
            </header>

            {/* Pricing + eligibility */}
            <div className="rounded-2xl border border-foreground/10 bg-background p-5 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Loyer à partir de</p>
                  <p className="mt-1 text-3xl font-semibold text-foreground">{vehicle.monthlyPrice || "—"}</p>
                  <p className="text-sm text-muted-foreground">{vehicle.weeklyPrice || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Éligibilité</p>
                  <p className="mt-1 text-sm font-medium text-primary">{vehicle.eligibility || "—"}</p>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Places", value: vehicle.specs?.seats },
                { label: "Motorisation", value: vehicle.specs?.motorisation },
                { label: "Coffre", value: vehicle.specs?.trunk },
                { label: "Puissance DIN", value: vehicle.specs?.puissanceDIN },
                { label: "Puissance fiscale", value: vehicle.specs?.puissanceFiscale },
                { label: energyLabel, value: energyValue },
                { label: "Stationnement", value: vehicle.specs?.garage },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-foreground/10 bg-background px-4 py-3 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{item.value || "—"}</p>
                </div>
              ))}
            </div>

            {/* Equipements */}
            {(vehicle.equipments || []).length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Équipements essentiels</h2>
                <ul className="grid gap-3 text-sm text-muted-foreground">
                  {(vehicle.equipments || []).map((equipment: string) => (
                    <li key={equipment} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/70" />
                      {equipment}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technique */}
            {(vehicle.technical || []).length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Caractéristiques techniques</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {(vehicle.technical || []).map((item: string) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dimensions */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Dimensions</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-foreground/10 bg-background px-4 py-3 text-center shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Longueur</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{vehicle.dimensions?.length || "—"}</p>
                </div>
                <div className="rounded-xl border border-foreground/10 bg-background px-4 py-3 text-center shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Largeur</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{vehicle.dimensions?.width || "—"}</p>
                </div>
                <div className="rounded-xl border border-foreground/10 bg-background px-4 py-3 text-center shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Hauteur</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{vehicle.dimensions?.height || "—"}</p>
                </div>
              </div>
            </div>

            
          </section>

          {/* Sticky bottom action bar (green CTA) */}
          <div className="sticky bottom-0 z-10 border-t border-foreground/10 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="px-6 py-4 md:px-8 pb-[env(safe-area-inset-bottom)]">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm leading-tight">
                  <span className="block text-[10px] uppercase tracking-[0.35em] text-muted-foreground">À partir de</span>
                  <span className="font-semibold text-foreground">{vehicle.weeklyPrice || vehicle.monthlyPrice || "Tarif sur demande"}</span>
                </div>
                <ReservationModal vehicleId={id} blockedDates={Array.isArray(vehicle.blockedDates) ? vehicle.blockedDates : []} />
              </div>
            </div>
          </div>
        </aside>
      </div>

    </main>
  )
}
