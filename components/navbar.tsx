"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/20 transition-all duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-foreground rounded-full"></div>
          <span className="text-lg font-bold tracking-tight">Le Parking VTC</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("about")}
            className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            About Us
          </button>
          <button
            onClick={() => scrollToSection("products")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Our Products
          </button>
          <button
            onClick={() => scrollToSection("blog")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Our Blog
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contacts
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-md">
          <div className="px-6 py-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity text-left"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              Our Products
            </button>
            <button
              onClick={() => scrollToSection("blog")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              Our Blog
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              Contacts
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
