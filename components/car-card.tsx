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
}

interface CarCardProps {
  car: Car
  isActive: boolean
}

export default function CarCard({ car, isActive }: CarCardProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 py-12 bg-background relative">
      {/* Background Tagline */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-9xl md:text-[200px] font-bold text-foreground/5 select-none whitespace-nowrap">
          {car.tagline || ""}
        </div>
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-96 flex items-center justify-center pointer-events-none hidden lg:flex">
        <div className="flex flex-col items-center gap-4">
          <div className="w-px h-12 bg-foreground/30"></div>
          <div
            className={`text-lg font-semibold tracking-widest text-foreground/60 transition-all duration-1000 ${
              isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: isActive ? "translateX(0)" : "translateX(-32px)",
            }}
          >
            {car.tagline || ""}
          </div>
          <div className="w-px h-12 bg-foreground/30"></div>
        </div>
      </div>

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
          {car.model && <p className="text-lg text-muted-foreground mb-6">{car.model}</p>}
          {car.description && <p className="text-sm text-muted-foreground italic mb-8">{car.description}</p>}

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
              className="relative px-8 py-3 border-2 border-foreground text-foreground font-medium rounded-lg overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-rotate-1 hover:shadow-[0_20px_35px_rgba(15,23,42,0.25)]"
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
