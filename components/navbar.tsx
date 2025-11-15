"use client"

import { useState, useEffect } from "react"
import { Menu, X, ArrowUp } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDocked, setIsDocked] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!isDesktop) {
      setIsDocked(false)
      return
    }

    const handleScroll = () => {
      const threshold = window.innerHeight * 0.3
      setIsDocked(window.scrollY > threshold)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDesktop])

  useEffect(() => {
    if (isDocked) {
      setIsOpen(false)
    }
  }, [isDocked])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false)
    }
  }

  const navLinks = [
    { id: "about", label: "À propos" },
    { id: "products", label: "Notre flotte" },
    { id: "blog", label: "Blog" },
  ]

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId)
    setIsOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 bg-background border-b border-border/20 transition-all duration-500 ${
          isDesktop && isDocked ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-foreground rounded-full"></div>
            <span className="text-lg font-bold tracking-tight">Le Parking VTC</span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border/20 bg-background">
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {isDesktop && (
        <div
          className={`fixed bottom-8 left-1/2 z-30 hidden w-full max-w-4xl -translate-x-1/2 justify-center transition-all duration-500 md:flex ${
            isDocked ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-medium text-foreground shadow-xl">
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="rounded-md bg-secondary/30 px-4 py-1.5 hover:bg-secondary/50 transition-colors"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:opacity-90 transition-opacity"
              aria-label="Remonter en haut"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
