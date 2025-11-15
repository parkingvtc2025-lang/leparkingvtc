"use client"

import { useState } from "react"
import { Mail, MessageCircle, Phone, X } from "lucide-react"

export default function FloatingContact() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed left-6 bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] z-[1000] pointer-events-auto">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
        aria-expanded={open}
        aria-label="Ouvrir le contact"
      >
        <MessageCircle className="h-4 w-4" />
        Contact
      </button>

      {open && (
        <div className="mt-3 w-72 rounded-2xl border border-border/30 bg-background p-3 shadow-xl">
          <div className="flex items-center justify-between pb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Nous contacter</p>
            <button onClick={() => setOpen(false)} aria-label="Fermer" className="rounded p-1 hover:bg-secondary">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="https://wa.me/33612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border/40 px-3 py-2 transition-colors hover:bg-secondary"
              title="WhatsApp"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MessageCircle className="w-4 h-4" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium">WhatsApp</span>
                <span className="text-xs opacity-70">+33 6 12 34 56 78</span>
              </div>
            </a>
            <a
              href="tel:+33612345678"
              className="flex items-center gap-3 rounded-lg border border-border/40 px-3 py-2 transition-colors hover:bg-secondary"
              title="Téléphone"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Phone className="w-4 h-4" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium">Appeler</span>
                <span className="text-xs opacity-70">+33 6 12 34 56 78</span>
              </div>
            </a>
            <a
              href="mailto:contact@leparkingvtc.com"
              className="flex items-center gap-3 rounded-lg border border-border/40 px-3 py-2 transition-colors hover:bg-secondary"
              title="Email"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Mail className="w-4 h-4" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium">Email</span>
                <span className="text-xs opacity-70">contact@leparkingvtc.com</span>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
