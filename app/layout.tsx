import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import AnalyticsGate from "@/components/analytics-gate"
import CookieBanner from "@/components/cookie-banner"
import FullscreenLoader from "@/components/fullscreen-loader"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Le Parking VTC | Location de véhicules pour chauffeurs VTC",
    template: "%s | Le Parking VTC",
  },
  description: "Location de véhicules premium pour chauffeurs VTC: assurance, maintenance, accompagnement et mise à disposition rapide.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Le Parking VTC",
    title: "Le Parking VTC",
    description: "Location de véhicules premium pour chauffeurs VTC.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Parking VTC",
    description: "Location de véhicules premium pour chauffeurs VTC.",
  },
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
