"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CarCard from "./car-card"

const CARS = [
  {
    id: 1,
    name: "BMW M4",
    model: "Competition",
    color: "British Racing Green",
    image: "/kiaeniro.png",
    tagline: "PERFORMANCE",
    description: "Réservez votre véhicule premium dès maintenant",
    horsepower: 503,
    acceleration: "3,8 s",
    topSpeed: 250,
  },
  {
    id: 2,
    name: "Tesla",
    model: "Luxury Sedan",
    color: "Midnight Black",
    image: "/teslaY.jpg",
    tagline: "LUXE",
    description: "Réservez votre véhicule premium dès maintenant",
    horsepower: 670,
    acceleration: "3,1 s",
    topSpeed: 250,
  },
  {
    id: 3,
    name: "BMW",
    model: "Premium SUV",
    color: "Alpine White",
    image: "/teslaY.jpg",
    tagline: "ÉLÉGANCE",
    description: "Réservez votre véhicule premium dès maintenant",
    horsepower: 523,
    acceleration: "4,7 s",
    topSpeed: 245,
  },
  {
    id: 4,
    name: "Porsche 911",
    model: "Gran Coupe",
    color: "Sapphire Blue",
    image: "/tessla.png",
    tagline: "PRESTIGE",
    description: "Réservez votre véhicule premium dès maintenant",
    horsepower: 443,
    acceleration: "3,5 s",
    topSpeed: 293,
  },
  {
    id: 5,
    name: "Tesla Model S",
    model: "Electric Luxury",
    color: "Pearl White",
    image: "/teslaY.jpg",
    tagline: "FUTUR",
    description: "Réservez votre véhicule premium dès maintenant",
    horsepower: 1020,
    acceleration: "2,1 s",
    topSpeed: 322,
  },
]

export default function CarShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sanitize = (s: any) => {
    if (s == null) return s
    const str = String(s)
    return str.replace(/\b(v[ée]hicule\s+)?disponible\b/gi, "").replace(/\s{2,}/g, " ").trim()
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/vehicles", { cache: "no-store" })
        if (!res.ok) throw new Error("HTTP " + res.status)
        const data = await res.json()
        if (!mounted) return
        const list = Array.isArray(data.vehicles) ? data.vehicles : []
        // Map API vehicles to CarCard shape
        const mapped = list.map((v: any) => {
          const cat = String(v?.category || "").toLowerCase()
          const vehType = String(v?.vehicleType || "").toLowerCase()
          const motor = String(v?.motorization || "").toLowerCase()
          const tags = Array.isArray(v?.tags) ? v.tags : Array.isArray(v?.badges) ? v.badges : []
          const hay = [cat, vehType, motor, ...tags.map((t: any) => String(t).toLowerCase())].join(" ")
          let typeLabel: string | undefined
          if (hay.includes("électrique") || hay.includes("electrique") || hay.includes("electric")) typeLabel = "Électrique"
          else if (hay.includes("hybride") || hay.includes("hybrid")) typeLabel = "Hybride"
          return {
            id: v.id,
            name: sanitize(v.name),
            model: typeLabel, // only show type if electric/hybrid
            color: undefined,
            image: v.image,
            tagline: undefined,
            description: undefined,
            tags,
            horsepower: undefined,
            acceleration: undefined,
            topSpeed: undefined,
          }
        })
        setVehicles(mapped)
        const prefer = mapped.findIndex((c: any) => String(c?.name || "").toLowerCase().includes("tesla model y"))
        setCurrentIndex(prefer >= 0 ? prefer : 0)
      } catch (e) {
        if (mounted) setError("Impossible de charger les véhicules.")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const LIST = useMemo(() => (vehicles.length ? vehicles : CARS), [vehicles])
  const N = LIST.length

  useEffect(() => {
    if (!isAutoPlay) return
    if (N < 2) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % N)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlay, N])

  useEffect(() => {
    if (currentIndex >= N) setCurrentIndex(0)
  }, [N, currentIndex])

  const goToPrevious = () => {
    if (N < 1) return
    setCurrentIndex((prev) => (prev - 1 + N) % N)
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    if (N < 1) return
    setCurrentIndex((prev) => (prev + 1) % N)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    if (index < 0 || index >= N) return
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  return (
    <div className="relative w-full overflow-hidden bg-background pt-16">
      {/* Carousel Container */}
      <div className="relative h-[100svh] lg:h-[100dvh] flex items-center justify-center">
        <div className="absolute top-10 left-6 right-6 z-30 mx-auto max-w-md lg:hidden">
          <h1 className="text-2xl font-light leading-tight text-foreground">
            Votre partenaire VTC premium
          </h1>
        </div>
        <div className="absolute top-10 left-6 right-6 z-30 mx-auto max-w-lg space-y-5 md:left-12 md:right-auto md:mx-0 hidden lg:block">
          <p className="text-xs tracking-[0.4em] text-muted-foreground/80 uppercase md:text-sm">
            COLLECTION PRIVÉE
          </p>
          <h1 className="text-3xl font-light leading-tight text-foreground md:text-5xl">
            Des véhicules d'exception pour une expérience
            <span className="block bg-gradient-to-r from-primary via-foreground to-primary/80 bg-clip-text font-semibold italic text-transparent">
              résolument premium
            </span>
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Laissez-vous conduire par une sélection soignée de modèles iconiques, prêts à sublimer chacun de vos déplacements avec élégance.
          </p>
        </div>
        <div className="absolute top-1/2 right-6 z-30 hidden -translate-y-1/2 items-stretch gap-6 lg:flex xl:right-12">
          <div className="h-[28rem] w-px bg-gradient-to-b from-transparent via-foreground/20 to-transparent"></div>
          <div className="flex flex-col items-center justify-between">
            <div className="flex flex-col items-center gap-6">
              <p
                className="text-[11px] tracking-[0.65em] text-muted-foreground/60 uppercase"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                MAÎTRISE
              </p>
              <div className="h-20 w-px bg-foreground/15"></div>
              <p
                className="text-sm font-semibold tracking-[0.5em] text-foreground/80 uppercase"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                SIGNATURE LUXURY
              </p>
              <div className="h-20 w-px bg-foreground/15"></div>
              <p
                className="text-[11px] tracking-[0.65em] text-muted-foreground/60 uppercase"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                ÉMOTION
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 mt-10">
              <div className="h-10 w-px bg-foreground/20"></div>
              <p
                className="text-[9px] tracking-[0.75em] text-muted-foreground/50 uppercase"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                COLLECTION PRIVÉE
              </p>
            </div>
          </div>
          <div className="h-[28rem] w-px bg-gradient-to-b from-transparent via-foreground/20 to-transparent"></div>
        </div>
        {/* Slides */}
        <div className="relative w-full h-full">
          {LIST.map((car, index) => (
            <div
              key={car.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 scale-100 z-10 pointer-events-auto"
                  : "opacity-0 scale-95 z-0 pointer-events-none"
              }`}
              aria-hidden={index !== currentIndex}
            >
              <CarCard car={car} isActive={index === currentIndex} />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-all hover:scale-110 group"
          aria-label="Previous car"
        >
          <ChevronLeft className="w-6 h-6 text-foreground group-hover:scale-125 transition-transform" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-all hover:scale-110 group"
          aria-label="Next car"
        >
          <ChevronRight className="w-6 h-6 text-foreground group-hover:scale-125 transition-transform" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+2rem)] sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {LIST.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex ? "w-8 h-2 bg-foreground" : "w-2 h-2 bg-foreground/30 hover:bg-foreground/60"
            }`}
            aria-label={`Go to car ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
