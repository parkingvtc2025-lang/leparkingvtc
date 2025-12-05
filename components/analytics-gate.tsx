"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/react"

const CONSENT_KEY = "cookie-consent"

function hasConsent(): boolean {
  if (typeof window === "undefined") return false
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === "accepted"
  } catch {
    return false
  }
}

export default function AnalyticsGate() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(hasConsent())
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY) setEnabled(e.newValue === "accepted")
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  if (!enabled) return null
  return <Analytics />
}
