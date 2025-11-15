"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CarCard from "./car-card"

const CARS = [
  {
    id: 1,
    name: "BMW M4",
    model: "Competition",
    color: "British Racing Green",
    image: "/bmw-m4-green-luxury-sports-car-side-view.jpg",
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
    image: "/tesla.png",
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
    image: "/bmw.png",
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
    image: "/bmw-z4-orange-roadster-convertible.jpg",
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

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CARS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + CARS.length) % CARS.length)
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CARS.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  return (
    <div className="relative w-full overflow-hidden bg-background pt-16">
      {/* Carousel Container */}
      <div className="relative h-[100svh] lg:h-[100dvh] flex items-center justify-center">
        <div className="absolute top-10 left-6 right-6 z-30 mx-auto max-w-lg space-y-5 md:left-12 md:right-auto md:mx-0">
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
          {CARS.map((car, index) => (
            <div
              key={car.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
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
        {CARS.map((_, index) => (
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
