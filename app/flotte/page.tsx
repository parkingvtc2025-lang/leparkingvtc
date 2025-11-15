"use client"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import Navbar from "@/components/navbar"
import FloatingContact from "@/components/floating-contact"
import ImageCarousel from "@/components/image-carousel"
import { Filter, Zap, Leaf, Search, X } from "lucide-react"

const filterOptions = [
  { label: "Tous les véhicules", value: "all" },
  { label: "Coupés & Sport", value: "sport" },
  { label: "Berlines & Limousines", value: "berline" },
  { label: "SUV & 4x4", value: "suv" },
  { label: "100% Électriques", value: "electric" },
]

const tagMap: Record<string, string> = {
  sport: "Coupé Sport",
  berline: "Berline Électrique",
  suv: "SUV Luxe",
  electric: "Électrique",
}

function resolveTag(category: string) {
  const normalized = category.toLowerCase()
  if (normalized.includes("coupé") || normalized.includes("sport")) return "sport"
  if (normalized.includes("berline") || normalized.includes("limousine")) return "berline"
  if (normalized.includes("suv") || normalized.includes("4x4") || normalized.includes("range")) return "suv"
  if (normalized.includes("électrique") || normalized.includes("electric")) return "electric"
  return "all"
}

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [type, setType] = useState<"all" | "electrique" | "hybride">("all")
  const [priceMin, setPriceMin] = useState<string>("")
  const [priceMax, setPriceMax] = useState<string>("")
  const [panelOpen, setPanelOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/vehicles", { cache: "no-store" })
        if (!res.ok) throw new Error("HTTP " + res.status)
        const data = await res.json()
        if (isMounted) setVehicles(Array.isArray(data.vehicles) ? data.vehicles : [])
      } catch (e) {
        if (isMounted) setError("Impossible de charger la flotte.")
      } finally {
        if (isMounted) setLoading(false)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  const parseEuro = (s: any): number | null => {
    if (!s || typeof s !== "string") return null
    const digits = s.replace(/[^0-9]/g, "")
    if (!digits) return null
    return Number(digits)
  }

  const toMonthly = (v: any): number | null => {
    const m = parseEuro(v?.monthlyPrice)
    const w = parseEuro(v?.weeklyPrice)
    if (m != null) return m
    if (w != null) return Math.round(w * 4)
    return null
  }

  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase()
    const min = priceMin !== "" ? Number(priceMin) : null
    const max = priceMax !== "" ? Number(priceMax) : null
    return vehicles.filter((v) => {
      if (qn) {
        const hay = `${v?.name || ""} ${v?.summary || ""}`.toLowerCase()
        if (!hay.includes(qn)) return false
      }
      if (type !== "all") {
        const cat = (v?.category || "").toLowerCase()
        if (type === "electrique" && !(cat.includes("electrique") || cat.includes("électrique"))) return false
        if (type === "hybride" && !(cat.includes("hybride") || cat.includes("hybrid"))) return false
      }
      if (min != null || max != null) {
        const pm = toMonthly(v)
        if (min != null && (pm == null || pm < min)) return false
        if (max != null && (pm == null || pm > max)) return false
      }
      return true
    })
  }, [vehicles, q, type, priceMin, priceMax])

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24 md:py-28">
        <div className="space-y-4 md:space-y-6">
          <p className="text-xs uppercase tracking-[0.55em] text-muted-foreground">Notre flotte</p>
          <h1 className="text-3xl md:text-5xl font-bold">Trouvez le véhicule parfait</h1>
          <p className="max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed">
            Des modèles pensés pour les chauffeurs d’excellence. Explorez, comparez et réservez en toute simplicité.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-lg border border-foreground/10 bg-muted" />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-muted-foreground">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((vehicle, index) => {
              const tag = resolveTag(vehicle.category || "")
              return (
                <Link
                  key={vehicle.id || index}
                  href={`/flotte/${vehicle.id}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-foreground/15 bg-card shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ImageCarousel
                      images={Array.isArray(vehicle.imageUrls) && vehicle.imageUrls.length > 0 ? vehicle.imageUrls : [vehicle.image]}
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      priorityFirst={false}
                    />
                    <div className="absolute left-3 top-3 rounded-sm bg-foreground/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-background">
                      {vehicle.badges?.[0] ?? "Disponible"}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="space-y-1">
                      <h3 className="text-base md:text-lg font-semibold text-foreground">{vehicle.name}</h3>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Loyer à partir de</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm md:text-base font-semibold text-foreground">{vehicle.monthlyPrice || "—"}</span>
                        <span className="text-xs text-muted-foreground">{vehicle.weeklyPrice || "—"}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">{vehicle.summary}</p>
                    <div className="mt-auto flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                      <span>{tag !== "all" ? tagMap[tag] : vehicle.category}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[10px] font-semibold tracking-[0.25em] text-primary-foreground">Voir</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <div className="fixed right-6 top-1/2 z-[900] hidden -translate-y-1/2 md:block">
        {panelOpen ? (
          <div className="w-80 rounded-2xl border border-foreground/10 bg-background/80 p-4 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Filtres</span>
              <button onClick={() => setPanelOpen(false)} className="rounded p-1 hover:bg-secondary" aria-label="Fermer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher un modèle"
                    className="w-full rounded-md border border-foreground/20 bg-background px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="block text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Type</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("all")}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] ${type === "all" ? "border-primary bg-primary text-primary-foreground" : "border-foreground/20 text-foreground hover:border-foreground/40"}`}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Tous
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("electrique")}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] ${type === "electrique" ? "border-primary bg-primary text-primary-foreground" : "border-foreground/20 text-foreground hover:border-foreground/40"}`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Électrique
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("hybride")}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] ${type === "hybride" ? "border-primary bg-primary text-primary-foreground" : "border-foreground/20 text-foreground hover:border-foreground/40"}`}
                  >
                    <Leaf className="h-3.5 w-3.5" />
                    Hybride
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <span className="block text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Budget (€/mois)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="Min"
                    className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30"
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="Max"
                    className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setQ(""); setType("all"); setPriceMin(""); setPriceMax("") }}
                  className="flex-1 rounded-md border border-foreground/20 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-foreground hover:border-foreground/40"
                >
                  Réinitialiser
                </button>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="flex-1 rounded-md bg-primary px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
                >
                  Appliquer
                </button>
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="rounded-full border border-foreground/20 bg-background/80 p-3 shadow-xl backdrop-blur transition-colors hover:border-foreground/40"
            aria-label="Ouvrir les filtres"
          >
            <Filter className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="fixed right-5 bottom-24 z-[900] md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-full border border-foreground/20 bg-background/80 p-3 shadow-xl backdrop-blur transition-colors hover:border-foreground/40"
          aria-label="Ouvrir les filtres"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[950] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80%] rounded-t-2xl border-t border-foreground/15 bg-background p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Filtres</span>
              <button onClick={() => setMobileOpen(false)} className="rounded p-1 hover:bg-secondary" aria-label="Fermer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher un modèle"
                    className="w-full rounded-md border border-foreground/20 bg-background px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="block text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Type</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("all")}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] ${type === "all" ? "border-primary bg-primary text-primary-foreground" : "border-foreground/20 text-foreground hover:border-foreground/40"}`}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Tous
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("electrique")}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] ${type === "electrique" ? "border-primary bg-primary text-primary-foreground" : "border-foreground/20 text-foreground hover:border-foreground/40"}`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Électrique
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("hybride")}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] ${type === "hybride" ? "border-primary bg-primary text-primary-foreground" : "border-foreground/20 text-foreground hover:border-foreground/40"}`}
                  >
                    <Leaf className="h-3.5 w-3.5" />
                    Hybride
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <span className="block text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Budget (€/mois)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="Min"
                    className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30"
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="Max"
                    className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setQ(""); setType("all"); setPriceMin(""); setPriceMax("") }}
                  className="flex-1 rounded-md border border-foreground/20 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-foreground hover:border-foreground/40"
                >
                  Réinitialiser
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-md bg-primary px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground"
                >
                  Appliquer
                </button>
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      )}
      <FloatingContact />
    </main>
  )
}
