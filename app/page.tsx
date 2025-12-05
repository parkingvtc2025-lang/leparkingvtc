"use client"

import dynamic from "next/dynamic"
import Script from "next/script"
import Navbar from "@/components/navbar"
import { AboutSection, DocumentsSection, ProductsSection } from "@/components/sections"
import SectionDivider from "@/components/section-divider"
import Footer from "@/components/footer"
import PartnersSection from "@/components/partners"
const StickyNav = dynamic(() => import("@/components/sticky-nav"), { ssr: false })
const FloatingContact = dynamic(() => import("@/components/floating-contact"), { ssr: false })
const Chatbot = dynamic(() => import("@/components/chatbot"), { ssr: false })
const CarShowcase = dynamic(() => import("@/components/car-showcase"))
const ScrollIndicator = dynamic(() => import("@/components/scroll-indicator"), { ssr: false })

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Structured Data */}
      <Script id="ld-website" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Le Parking VTC",
          url: "/",
          potentialAction: {
            "@type": "SearchAction",
            target: "/flotte?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </Script>
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
