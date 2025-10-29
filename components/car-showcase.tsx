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
  },
  {
    id: 2,
    name: "Mercedes-AMG C63",
    model: "Luxury Sedan",
    color: "Midnight Black",
    image: "/bmw-i7-black-luxury-sedan-electric.jpg",
    tagline: "LUXE",
    description: "Réservez votre véhicule premium dès maintenant",
  },
  {
    id: 3,
    name: "Audi A8",
    model: "Premium SUV",
    color: "Alpine White",
    image: "/bmw-x7-white-luxury-suv-side-view.jpg",
    tagline: "ÉLÉGANCE",
    description: "Réservez votre véhicule premium dès maintenant",
  },
  {
    id: 4,
    name: "Porsche 911",
    model: "Gran Coupe",
    color: "Sapphire Blue",
    image: "/bmw-m440i-blue-coupe-luxury-car.jpg",
    tagline: "PRESTIGE",
    description: "Réservez votre véhicule premium dès maintenant",
  },
  {
    id: 5,
    name: "Tesla Model S",
    model: "Electric Luxury",
    color: "Pearl White",
    image: "/bmw-z4-orange-roadster-convertible.jpg",
    tagline: "FUTUR",
    description: "Réservez votre véhicule premium dès maintenant",
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
      <div className="relative h-screen flex items-center justify-center">
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
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
