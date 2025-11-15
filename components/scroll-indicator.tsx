"use client"

import { useEffect, useState } from "react"

export default function ScrollIndicator() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
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
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const newProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(newProgress)
      setIsVisible(scrollTop < docHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const positionClasses = "top-6 left-1/2 -translate-x-1/2 w-[min(640px,92vw)]"

  const visibilityClasses = isVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 -translate-y-4"

  return (
    <div className={`pointer-events-none fixed z-30 hidden md:block transition-all duration-500 ${positionClasses} ${visibilityClasses}`}>
      <div className="flex items-center gap-4">
        <span className="text-[0.7rem] font-medium text-muted-foreground tracking-[0.6em] uppercase">Scroll</span>
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-foreground/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-foreground via-foreground/70 to-foreground/50 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
          <div className="absolute inset-0 rounded-full ring-1 ring-white/20 ring-inset" />
        </div>
      </div>
    </div>
  )
}
