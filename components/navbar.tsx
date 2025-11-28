"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import PillNav from "./PillNav"
import Link from "next/link"

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
    { label: "Accueil", href: "/" },
    { label: "Véhicules hybrides", href: "/flotte?type=hybride" },
    { label: "Véhicules électriques", href: "/flotte?type=electrique" },
    { label: "À propos", href: "/#about" },
    { label: "Documents", href: "/documents" },
    { label: "Blog", href: "/#blog" },
  ]

  const pillItems = [
    { label: "Accueil", href: "/" },
    { label: "Véhicules hybrides", href: "/flotte?type=hybride" },
    { label: "Véhicules électriques", href: "/flotte?type=electrique" },
    { label: "À propos", href: "/#about" },
    { label: "Documents", href: "/documents" },
    { label: "Blog", href: "/#blog" },
  ]

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId)
    setIsOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isDesktop && isDocked ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto py-3 flex justify-center">
          <PillNav
            logo=""
            logoAlt=""
            items={pillItems}
            activeHref={"#"}
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#0b0b0b"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            onMobileMenuClick={() => {}}
          />
        </div>
      </nav>

      {isDesktop && (
        <div
          className={`fixed bottom-8 left-1/2 z-30 hidden w-full max-w-4xl -translate-x-1/2 justify-center transition-all duration-500 md:flex ${
            isDocked ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-2 rounded bg-background px-5 py-3 text-sm font-medium text-foreground shadow-xl">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded bg-secondary/30 px-4 py-1.5 hover:bg-secondary/50 transition-colors"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded bg-emerald-600 px-3 py-1.5 text-white hover:opacity-90 transition-opacity"
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
