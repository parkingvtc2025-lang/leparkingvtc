import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documents à fournir",
  description: "Liste des documents nécessaires pour la location VTC: pièce d'identité, permis, carte VTC, justificatif de domicile et caution de 300€.",
}

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
