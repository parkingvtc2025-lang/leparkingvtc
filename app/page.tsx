"use client"

import Navbar from "@/components/navbar"
import StickyNav from "@/components/sticky-nav"
import FloatingContact from "@/components/floating-contact"
import Chatbot from "@/components/chatbot"
import HeroArt from "@/components/hero-art"
import { AboutSection, ProductsSection } from "@/components/sections"
import SectionDivider from "@/components/section-divider"
import Footer from "@/components/footer"
import ScrollIndicator from "@/components/scroll-indicator"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <HeroArt />
      <SectionDivider variant="sunset" />
      <AboutSection />
      <SectionDivider variant="ocean" flip />
      <ProductsSection />
      <Footer />
      <StickyNav />
      <FloatingContact />
      <Chatbot />
      <ScrollIndicator />
    </main>
  )
}
