"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      className={`fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 sm:gap-3 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-32 pointer-events-none"
      }`}
    >
      {/* Navigation Items - Added glass background, centered title, and hide top effect */}
      <div className="flex flex-col gap-1 sm:gap-2 bg-background/40 backdrop-blur-2xl border border-border/30 rounded-3xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-shadow">
        {/* Centered Title */}
        <div className="text-center mb-2">
          <p className="text-xs font-bold text-foreground tracking-wide">Le Parking VTC</p>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => scrollToSection("about")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-foreground hover:bg-secondary/60 rounded-lg transition-colors whitespace-nowrap"
        >
          À Propos
        </button>
        <button
          onClick={() => scrollToSection("products")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-foreground hover:bg-secondary/60 rounded-lg transition-colors whitespace-nowrap"
        >
          Produits
        </button>
        <button
          onClick={() => scrollToSection("blog")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-foreground hover:bg-secondary/60 rounded-lg transition-colors whitespace-nowrap"
        >
          Blog
        </button>
        <button
          onClick={() => scrollToSection("contact")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-foreground hover:bg-secondary/60 rounded-lg transition-colors whitespace-nowrap"
        >
          Contact
        </button>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="p-2 sm:p-3 bg-background/40 backdrop-blur-2xl border border-border/30 rounded-full hover:bg-background/60 transition-colors shadow-lg hover:shadow-xl"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-4 h-4 text-foreground" />
      </button>
    </div>
  )
}
