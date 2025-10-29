"use client"

import Navbar from "@/components/navbar"
import StickyNav from "@/components/sticky-nav"
import FloatingContact from "@/components/floating-contact"
import Chatbot from "@/components/chatbot"
import CarShowcase from "@/components/car-showcase"
import { AboutSection, ProductsSection, BlogSection, ContactSection } from "@/components/sections"
import Footer from "@/components/footer"
import ScrollIndicator from "@/components/scroll-indicator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <CarShowcase />
      <AboutSection />
      <ProductsSection />
      <BlogSection />
      <ContactSection />
      <Footer />
      <StickyNav />
      <FloatingContact />
      <Chatbot />
      <ScrollIndicator />
    </main>
  )
}
