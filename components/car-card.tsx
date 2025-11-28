"use client"

import Image from "next/image"
import Link from "next/link"

interface Car {
  id: string | number
  name: string
  model?: string
  color?: string
  image: string
  tagline?: string
  description?: string
  horsepower?: number
  acceleration?: string
  topSpeed?: number
  tags?: string[]
}

interface CarCardProps {
  car: Car
  isActive: boolean
}

export default function CarCard({ car, isActive }: CarCardProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 py-12 bg-background relative">

      {/* Removed side vertical tagline to only keep subtle background label */}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-8">
        {/* Car Image */}
        <div
          className={`relative w-full h-96 transition-all duration-1000 ${
            isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <Image
            src={car.image || "/placeholder.svg"}
            alt={`${car.name} ${car.model ?? ""}`}
            fill
            className="object-contain"
            priority={isActive}
          />
        </div>

        {/* Car Info */}
        <div
          className={`text-center transition-all duration-1000 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{car.name}</h2>
          {car.model && !/disponible/i.test(String(car.model)) && (
            <p className="text-lg text-muted-foreground mb-6">{car.model}</p>
          )}
          {/* Description intentionally hidden to avoid displaying availability/status-like text */}

          {!!(car.tags && car.tags.length) && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5">
              {(car.tags || [])
                .filter((t: any) => !/disponible/i.test(String(t)))
                .slice(0, 4)
                .map((t: any, idx: number) => (
                  <span key={idx} className="rounded-sm bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
                    {String(t)}
                  </span>
                ))}
            </div>
          )}

          {(car.horsepower != null || car.acceleration || car.topSpeed != null) && (
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              {car.horsepower != null && (
                <div className="min-w-[120px] space-y-1 text-left">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">Puissance</p>
                  <p className="text-xl font-semibold text-foreground">{car.horsepower} ch</p>
                </div>
              )}
              {car.acceleration && (
                <div className="min-w-[120px] space-y-1 text-left">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">0-100 km/h</p>
                  <p className="text-xl font-semibold text-foreground">{car.acceleration}</p>
                </div>
              )}
              {car.topSpeed != null && (
                <div className="min-w-[120px] space-y-1 text-left">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">V. max</p>
                  <p className="text-xl font-semibold text-foreground">{car.topSpeed} km/h</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/flotte/${car.id}`}
              className="relative px-8 py-3 rounded-lg bg-emerald-600 text-white font-semibold uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-rotate-1 hover:shadow-[0_20px_35px_rgba(15,23,42,0.25)]"
            >
              Réserver
            </Link>
            <Link
              href="/flotte"
              className="px-5 py-2.5 rounded-lg border border-foreground/30 text-foreground text-sm font-medium transition-colors hover:border-foreground/60"
            >
              Voir nos véhicules
            </Link>
            <a
              href="#about"
              className="px-5 py-2.5 rounded-lg border border-foreground/30 text-foreground text-sm font-medium transition-colors hover:border-foreground/60"
            >
              En savoir plus
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-foreground to-transparent mt-8"></div>
      </div>
    </div>
  )
}
