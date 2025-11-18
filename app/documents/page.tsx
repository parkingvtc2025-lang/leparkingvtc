"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { DocumentsSection } from "@/components/sections"

export default function DocumentsPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <DocumentsSection />
      <Footer />
    </main>
  )
}
