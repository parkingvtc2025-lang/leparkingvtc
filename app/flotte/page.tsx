"use client"
import Link from "next/link"
import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import FloatingContact from "@/components/floating-contact"
import ImageCarousel from "@/components/image-carousel"
import { Filter, Zap, Leaf, Search, X, Shield, BadgeCheck, Clock, Info, ChevronDown } from "lucide-react"

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

function FleetPageContent() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [type, setType] = useState<"all" | "electrique" | "hybride" | "berline">("all")
  const [priceMin, setPriceMin] = useState<string>("")
  const [priceMax, setPriceMax] = useState<string>("")
  const [panelOpen, setPanelOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"new" | "priceAsc" | "priceDesc">("new")
  const [priceCap, setPriceCap] = useState<number | null>(null)
  const [descOpen, setDescOpen] = useState(false)
  const searchParams = useSearchParams()

  const sanitize = (s: any) => {
    if (s == null) return s
    const str = String(s)
    return str.replace(/\b(v[ée]hicule\s+)?disponible\b/gi, "").replace(/\s{2,}/g, " ").trim()
  }

  // Sync initial filter with query param (e.g., /flotte?type=hybride)
  useEffect(() => {
    const qp = searchParams.get("type")
    if (qp === "electrique" || qp === "hybride" || qp === "berline") {
      setType(qp as any)
    } else if (qp === "all") {
      setType("all")
    }
  }, [searchParams])

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
        const tags: string[] = Array.isArray(v?.tags) ? v.tags.map((x: any) => String(x).toLowerCase()) : []
        if (type === "electrique" && !(cat.includes("electrique") || cat.includes("électrique"))) return false
        if (type === "hybride" && !(cat.includes("hybride") || cat.includes("hybrid"))) return false
        if (type === "berline" && !(v?.isBerline === true || tags.includes("berline") || cat.includes("berline"))) return false
      }
      if (min != null || max != null) {
        const pm = toMonthly(v)
        if (min != null && (pm == null || pm < min)) return false
        if (max != null && (pm == null || pm > max)) return false
      }
      if (priceCap != null) {
        const pm = toMonthly(v)
        if (pm == null || pm > priceCap) return false
      }
      return true
    })
  }, [vehicles, q, type, priceMin, priceMax, priceCap])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sortBy === "new") {
      arr.sort((a: any, b: any) => {
        const as = a?.createdAt?.seconds ?? a?.createdAtSec ?? 0
        const bs = b?.createdAt?.seconds ?? b?.createdAtSec ?? 0
        return bs - as
      })
    } else if (sortBy === "priceAsc" || sortBy === "priceDesc") {
      arr.sort((a: any, b: any) => {
        const pa = toMonthly(a)
        const pb = toMonthly(b)
        const da = pa == null ? Number.POSITIVE_INFINITY : pa
        const db = pb == null ? Number.POSITIVE_INFINITY : pb
        return sortBy === "priceAsc" ? da - db : db - da
      })
    }
    return arr
  }, [filtered, sortBy])

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24 md:py-28">
        <div className="space-y-4 md:space-y-6">
          <p className="text-xs uppercase tracking-[0.55em] text-muted-foreground">Notre flotte</p>
          <h1 className="text-3xl md:text-5xl font-bold">Trouvez le véhicule parfait</h1>
          <p className="max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed">
            Des modèles premium, une disponibilité réelle, un accompagnement humain pour démarrer sans friction.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border border-foreground/15 bg-card px-3 py-2 text-sm">
              <Shield className="h-4 w-4 text-primary" /> Assurance & maintenance incluses
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-foreground/15 bg-card px-3 py-2 text-sm">
              <BadgeCheck className="h-4 w-4 text-primary" /> Processus simple et rapide
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-foreground/15 bg-card px-3 py-2 text-sm">
              <Clock className="h-4 w-4 text-primary" /> Mise à disposition flexible
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setType(type === "electrique" ? "all" : "electrique")} className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] border ${type === "electrique" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-foreground/20"}`}>Électrique</button>
            <button onClick={() => setType(type === "hybride" ? "all" : "hybride")} className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] border ${type === "hybride" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-foreground/20"}`}>Hybride</button>
            <button onClick={() => setType(type === "berline" ? "all" : "berline")} className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] border ${type === "berline" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-foreground/20"}`}>Berline</button>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Budget mensuel</label>
            <input type="range" min={300} max={3000} step={50} value={priceCap ?? 3000} onChange={(e) => setPriceCap(Number(e.target.value))} className="h-2 w-40 cursor-pointer appearance-none rounded bg-foreground/10" />
            <span className="text-sm text-foreground">≤ {priceCap ?? 3000}€</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Trier par</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="rounded-md border border-foreground/20 bg-card px-3 py-2 text-sm">
              <option value="new">Nouveautés</option>
              <option value="priceAsc">Prix ↑</option>
              <option value="priceDesc">Prix ↓</option>
            </select>
          </div>
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
            {sorted.map((vehicle, index) => {
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
                    {false && (
                      <div className="absolute left-3 top-3 rounded-sm bg-foreground/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-background">
                        {vehicle.badges?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="space-y-1">
                      <h3 className="text-base md:text-lg font-semibold text-foreground">{vehicle.name}</h3>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Loyer à partir de</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm md:text-base font-semibold text-foreground">{vehicle.monthlyPrice || "—"}</span>
                        <span className="text-xs text-muted-foreground">{vehicle.weeklyPrice || "—"}</span>
                      </div>
                      {!!(Array.isArray(vehicle.tags) && vehicle.tags.length) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {vehicle.tags
                            .filter((t: any) => !/disponible/i.test(String(t)))
                            .slice(0, 4)
                            .map((t: any, idx: number) => (
                              <span key={idx} className="rounded-sm bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
                                {String(t)}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">{vehicle.summary}</p>
                    <div className="mt-auto flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                      <span>{tag !== "all" ? tagMap[tag] : vehicle.category}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-[10px] font-semibold tracking-[0.25em] text-white">Voir</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="mt-10">
          <div className={`relative overflow-hidden rounded-2xl border border-foreground/10 bg-card p-5 transition-all ${descOpen ? "" : "max-h-28"}`}>
            <p className="text-sm md:text-base text-muted-foreground">
              Le Parking VTC propose une sélection exigeante de véhicules adaptés aux besoins des chauffeurs professionnels: confort des passagers, efficience énergétique, fiabilité et image premium. Notre flotte évolue en permanence pour vous garantir des modèles récents, entretenus et immédiatement opérationnels, avec une offre claire et un accompagnement dédié.
            </p>
            {!descOpen && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />}
          </div>
          <button onClick={() => setDescOpen((v) => !v)} className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground">
            <span>{descOpen ? "Voir moins" : "En savoir plus"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${descOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="mt-12 space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Questions fréquentes</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <details open className="group rounded-xl border border-foreground/10 bg-card p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold">Assurance incluse ?</summary>
              <p className="mt-2 text-sm text-muted-foreground">Oui, l’assurance adaptée à l’activité VTC ainsi que la maintenance courante sont incluses selon le contrat.</p>
            </details>
            <details open className="group rounded-xl border border-foreground/10 bg-card p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold">Caution</summary>
              <p className="mt-2 text-sm text-muted-foreground">Une caution de 300€ est demandée et restituée selon les conditions du contrat.</p>
            </details>
            <details open className="group rounded-xl border border-foreground/10 bg-card p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold">Conditions</summary>
              <p className="mt-2 text-sm text-muted-foreground">Pièce d’identité, permis de conduire, carte VTC, justificatif de domicile et dépôt de caution sont requis.</p>
            </details>
            <details open className="group rounded-xl border border-foreground/10 bg-card p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold">Délai de mise à disposition</summary>
              <p className="mt-2 text-sm text-muted-foreground">Selon disponibilité et dossier, la mise à disposition peut être très rapide. Contactez-nous pour une estimation.</p>
            </details>
          </div>
        </div>
      </section>

      <div className="fixed right-5 bottom-[calc(env(safe-area-inset-bottom)+6rem)] z-[900] md:hidden">
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
          <div className="absolute bottom-0 left-0 right-0 max-h-[80svh] rounded-t-2xl border-t border-foreground/15 bg-background p-5 pb-[env(safe-area-inset-bottom)] shadow-2xl overflow-y-auto">
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
                  <button
                    type="button"
                    onClick={() => setType("berline")}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-[0.3em] ${type === "berline" ? "border-primary bg-primary text-primary-foreground" : "border-foreground/20 text-foreground hover:border-foreground/40"}`}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Berline
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

export default function FleetPage() {
  return (
    <Suspense fallback={<main className="relative min-h-screen bg-background text-foreground" />}> 
      <FleetPageContent />
    </Suspense>
  )
}
