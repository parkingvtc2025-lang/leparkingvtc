import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flotte de véhicules",
  description: "Découvrez notre flotte de véhicules pour chauffeurs VTC: électriques, hybrides, berlines et SUV premium.",
}

export default function FlotteLayout({ children }: { children: React.ReactNode }) {
  return children
}
