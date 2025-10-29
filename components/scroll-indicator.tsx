"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Hide scroll indicator after scrolling down
      if (window.scrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">Scroll</span>
        <div className="animate-bounce-gentle">
          <ChevronDown className="w-5 h-5 text-foreground/60" />
        </div>
      </div>
    </div>
  )
}
