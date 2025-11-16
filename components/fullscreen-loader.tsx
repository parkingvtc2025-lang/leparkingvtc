"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function FullscreenLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
    const timeout = setTimeout(() => {
      setVisible(false)
      try {
        window.dispatchEvent(new Event("app:loaded"))
      } catch (_) {
        /* noop */
      }
    }, 400)
    return () => clearTimeout(timeout)
  }, [pathname])

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-foreground">
        <div className="h-16 w-16 animate-[spin_0.9s_linear_infinite] rounded-full border-[3px] border-foreground/10 border-t-foreground" />
        <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Chargement</p>
      </div>
    </div>
  )
}
