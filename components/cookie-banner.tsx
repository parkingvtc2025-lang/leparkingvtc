"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const CONSENT_KEY = "cookie-consent"

function getStoredConsent(): "accepted" | "rejected" | null {
  if (typeof window === "undefined") return null
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    if (v === "accepted" || v === "rejected") return v
    return null
  } catch {
    return null
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const v = getStoredConsent()
    setVisible(v == null)
  }, [])

  const setConsent = (val: "accepted" | "rejected") => {
    try {
      localStorage.setItem(CONSENT_KEY, val)
      // also drop a cookie for 180 days (optional)
      const d = new Date()
      d.setTime(d.getTime() + 180 * 24 * 60 * 60 * 1000)
      document.cookie = `${CONSENT_KEY}=${val}; expires=${d.toUTCString()}; path=/; SameSite=Lax`
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1000] px-3 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-4xl rounded-xl border border-foreground/15 bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-foreground/90">
            Nous utilisons des cookies à des fins de mesure d'audience et d'amélioration du service. 
            Consultez notre <Link href="/politique-de-confidentialite" className="underline underline-offset-4">politique de confidentialité</Link>.
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setConsent("rejected")} className="rounded-md border border-foreground/20 px-3 py-2 text-sm hover:border-foreground/40">Refuser</button>
            <button onClick={() => setConsent("accepted")} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Accepter</button>
          </div>
        </div>
      </div>
    </div>
  )
}
