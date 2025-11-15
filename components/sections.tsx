"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef, useState, useEffect, useMemo } from "react"
import { MapPin, Users, Zap, Shield, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left: Title + narrative */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Le partenaire des <span className="underline decoration-primary decoration-4 underline-offset-8">chauffeurs d’excellence</span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-prose">
              Une sélection exigeante de véhicules, une esthétique soignée et un accompagnement dédié. Notre approche est simple: offrir des voitures élégantes, fiables et prêtes à sublimer votre service.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Sélection rigoureuse</h3>
                  <p className="text-sm text-muted-foreground">Modèles adaptés aux standards premium VTC.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Service humain</h3>
                  <p className="text-sm text-muted-foreground">Conseils et support pour chaque étape.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Disponibilités réelles</h3>
                  <p className="text-sm text-muted-foreground">Couverture et planning adaptés à vos besoins.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Prêt à rouler</h3>
                  <p className="text-sm text-muted-foreground">Process rapide, véhicules immédiatement opérationnels.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Stats + testimonial */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-border p-5 text-center">
                <div className="text-3xl font-bold">150+</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Véhicules</div>
              </div>
              <div className="rounded-lg border border-border p-5 text-center">
                <div className="text-3xl font-bold">4.9/5</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Satisfaction</div>
              </div>
              <div className="rounded-lg border border-border p-5 text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Support</div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground">
                "Un service pensé pour les professionnels: clair, réactif et élégant. C’est notre partenaire de confiance."
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.3em]">Client VTC Premium</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProductsSection() {
  const [raw, setRaw] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const parseEuro = (s: any): number | null => {
    if (!s || typeof s !== "string") return null
    const digits = s.replace(/[^0-9]/g, "")
    if (!digits) return null
    return Number(digits)
  }

  const baseVehicles = useMemo(() => {
    return (raw || []).map((v) => {
      const monthly = parseEuro(v?.monthlyPrice)
      const weekly = parseEuro(v?.weeklyPrice)
      const priceNum = monthly != null ? monthly : weekly != null ? Math.round(weekly * 4) : null
      const createdAtSec = v?.createdAt?.seconds || 0
      return {
        id: v.id,
        name: v.name,
        image: Array.isArray(v.imageUrls) && v.imageUrls.length > 0 ? v.imageUrls[0] : v.image,
        weeklyPrice: v.weeklyPrice,
        monthlyPrice: v.monthlyPrice,
        badges: Array.isArray(v.badges) ? v.badges : [],
        eligibility: v.eligibility,
        createdAtSec,
        priceNum,
      }
    })
  }, [raw])

  const LIMIT = 6
  const viewVehicles = useMemo(() => {
    const list = [...baseVehicles]
    list.sort((a, b) => (b.createdAtSec || 0) - (a.createdAtSec || 0)
      || ((a.priceNum ?? Infinity) - (b.priceNum ?? Infinity))
      || a.name.localeCompare(b.name))
    return list.slice(0, LIMIT)
  }, [baseVehicles])

  const [index, setIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const touch = useRef<{startX:number; startY:number; dx:number; dy:number; active:boolean}>({startX:0,startY:0,dx:0,dy:0,active:false})
  const [paused, setPaused] = useState(false)
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/vehicles", { cache: "no-store" })
        if (!res.ok) throw new Error("HTTP " + res.status)
        const data = await res.json()
        if (mounted) setRaw(Array.isArray(data.vehicles) ? data.vehicles : [])
      } catch (e) {
        if (mounted) setError("Impossible de charger la flotte.")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Responsive items per view
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w < 768) return 1
      if (w < 1024) return 2
      return 3
    }
    const apply = () => setItemsPerView(calc())
    apply()
    window.addEventListener("resize", apply)
    return () => window.removeEventListener("resize", apply)
  }, [])

  // Auto-advance
  useEffect(() => {
    if (paused) return
    if (!viewVehicles.length) return
    const id = setInterval(() => setIndex((i) => (i + 1) % viewVehicles.length), 5000)
    return () => clearInterval(id)
  }, [viewVehicles.length, paused])

  const prev = () => viewVehicles.length && setIndex((i) => (i - 1 + viewVehicles.length) % viewVehicles.length)
  const next = () => viewVehicles.length && setIndex((i) => (i + 1) % viewVehicles.length)

  return (
    <section id="products" className="relative w-full overflow-hidden bg-background py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.55em] text-muted-foreground">Notre flotte</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground text-balance">Présentée avec caractère</h2>
          <p className="mt-3 md:mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
            Une mise en avant inspirée, trois modèles visibles, le centre en focus. Élégant, fluide, professionnel.
          </p>
          <div className="mt-6">
            <Link href="/flotte" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl">
              Voir toute la flotte
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Coverflow */}
      <div className="relative mt-10 md:mt-16">
        {loading ? (
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[48vh] animate-pulse rounded-xl border border-foreground/10 bg-muted" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-6xl px-6 text-sm text-muted-foreground">{error}</div>
        ) : (
          <div
            className="flex items-stretch select-none"
            style={{ gap: "1.25rem", transform: `translateX(calc(50% - ${(index + 0.5) * (100 / itemsPerView)}%))`, transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => {
              const t = e.changedTouches[0]
              touch.current = { startX: t.clientX, startY: t.clientY, dx: 0, dy: 0, active: true }
              setPaused(true)
            }}
            onTouchMove={(e) => {
              if (!touch.current.active) return
              const t = e.changedTouches[0]
              touch.current.dx = t.clientX - touch.current.startX
              touch.current.dy = t.clientY - touch.current.startY
            }}
            onTouchEnd={() => {
              if (!touch.current.active) return
              const { dx, dy } = touch.current
              touch.current.active = false
              if (Math.abs(dy) > Math.abs(dx)) return
              const THRESH = 50
              if (dx > THRESH) prev()
              else if (dx < -THRESH) next()
              if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
              resumeTimeout.current = setTimeout(() => setPaused(false), 5000)
            }}
          >
            {viewVehicles.map((v, i) => {
              const offset = (i - index + viewVehicles.length) % viewVehicles.length
              const dist = Math.min(Math.abs(offset), viewVehicles.length - Math.abs(offset))
              const scale = dist === 0 ? 1 : dist === 1 ? 0.92 : 0.85
              const opacity = dist === 0 ? 1 : dist === 1 ? 0.9 : 0.75
              return (
                <Link key={v.id || i} href={`/flotte/${v.id}`} className="group relative block flex-shrink-0" style={{ width: `${100 / itemsPerView}%` }}>
                  <div className="relative overflow-hidden rounded-xl border border-foreground/15 bg-card shadow-md" style={{ transform: `scale(${scale})`, opacity, transition: "transform 450ms, opacity 450ms" }}>
                    <div className="relative h-[48vh] md:h-[52vh] w-full overflow-hidden">
                      <Image src={v.image || "/placeholder.jpg"} alt={v.name || "Véhicule"} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    </div>
                    <div className="flex items-center justify-between px-5 py-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-foreground">{v.name}</h3>
                        <p className="text-xs text-muted-foreground md:text-sm">{v.weeklyPrice || "—"}</p>
                        {(v.badges?.[0] || v.eligibility) && (
                          <span className="mt-1 inline-block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{v.badges?.[0] || v.eligibility}</span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-foreground">Voir <ArrowUpRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Dots */}
        {!!viewVehicles.length && (
          <div className="mt-6 flex items-center justify-center gap-2 md:gap-3">
            {viewVehicles.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Aller au véhicule ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-foreground" : "w-3 bg-foreground/30 hover:bg-foreground/60"}`}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        {!!viewVehicles.length && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-foreground/20 bg-background p-3 text-foreground shadow md:block" aria-label="Précédent">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-foreground/20 bg-background p-3 text-foreground shadow md:block" aria-label="Suivant">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </section>
  )
}

export function BlogSection() {
  const articles = [
    {
      title: "Les Avantages de la Location VTC",
      date: "29 Octobre 2025",
      excerpt: "Découvrez pourquoi la location VTC est la meilleure solution pour vos déplacements professionnels.",
    },
    {
      title: "Conseils pour Maximiser Vos Revenus",
      date: "25 Octobre 2025",
      excerpt: "Nos experts partagent les meilleures pratiques pour optimiser vos revenus en tant que chauffeur VTC.",
    },
    {
      title: "Entretien et Maintenance des Véhicules",
      date: "20 Octobre 2025",
      excerpt: "Guide complet pour maintenir votre véhicule en parfait état et prolonger sa durée de vie.",
    },
  ]

  return (
    <section id="blog" className="relative min-h-screen py-20 px-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-balance">Notre Blog</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article
              key={index}
              className="rounded-2xl p-8 bg-card border border-border/10 shadow-md transition-transform duration-500 ease-out hover:-translate-y-2 hover:shadow-lg cursor-pointer group"
            >
              <p className="text-sm text-muted-foreground mb-3">{article.date}</p>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-foreground/80 transition-colors">
                {article.title}
              </h3>
              <p className="text-muted-foreground text-sm">{article.excerpt}</p>
              <button className="mt-4 text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
                Lire plus →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
