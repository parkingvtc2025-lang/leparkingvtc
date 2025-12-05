import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import AnalyticsGate from "@/components/analytics-gate"
import CookieBanner from "@/components/cookie-banner"
import FullscreenLoader from "@/components/fullscreen-loader"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Le Parking VTC | Location de véhicules pour chauffeurs VTC",
    template: "%s | Le Parking VTC",
  },
  description: "Location de véhicules premium pour chauffeurs VTC: assurance, maintenance, accompagnement et mise à disposition rapide.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans antialiased`}>
        <FullscreenLoader />
        {children}
        <CookieBanner />
        <AnalyticsGate />
      </body>
    </html>
  )
}
