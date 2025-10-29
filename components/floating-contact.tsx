"use client"

import { Mail, MessageCircle } from "lucide-react"

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      {/* Contact Container with Glassmorphism - Centered Horizontal Icons */}
      <div className="bg-background/70 backdrop-blur-xl border border-border/40 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex gap-6 items-center justify-center">
          {/* Email Contact */}
          <a
            href="mailto:contact@leparkingvtc.com"
            className="flex items-center justify-center p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
            title="Email"
          >
            <Mail className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
          </a>

          {/* WhatsApp Contact */}
          <a
            href="https://wa.me/33612345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
            title="WhatsApp"
          >
            <MessageCircle className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  )
}
