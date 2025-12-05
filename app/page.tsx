"use client"

import Navbar from "@/components/navbar"
import StickyNav from "@/components/sticky-nav"
import FloatingContact from "@/components/floating-contact"
import Chatbot from "@/components/chatbot"
import CarShowcase from "@/components/car-showcase"
import { AboutSection, DocumentsSection, ProductsSection } from "@/components/sections"
import SectionDivider from "@/components/section-divider"
import Footer from "@/components/footer"
import PartnersSection from "@/components/partners"
import ScrollIndicator from "@/components/scroll-indicator"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <CarShowcase />
      <SectionDivider variant="sunset" />
      <AboutSection />
      <SectionDivider variant="ocean" />
      <DocumentsSection />
      <SectionDivider variant="ocean" flip />
      <ProductsSection />
      <PartnersSection />
      <Footer />
      <StickyNav />
      <FloatingContact />
      <Chatbot />
      <ScrollIndicator />
    </main>
  )
}
