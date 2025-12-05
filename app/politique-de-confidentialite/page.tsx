import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de Le Parking VTC: collecte, utilisation, conservation des données et droits RGPD.",
}

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen px-6 py-16 md:py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold text-foreground">Politique de confidentialité</h1>
      <p className="mt-3 text-sm text-muted-foreground">Dernière mise à jour: {new Date().getFullYear()}</p>

      <section className="mt-10 space-y-6 text-foreground/90">
        <div>
          <h2 className="text-xl font-semibold">Collecte des données</h2>
          <p className="mt-2 text-sm md:text-base">Nous collectons les données nécessaires à la gestion de vos demandes de location et à la communication avec vous.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Utilisation</h2>
          <p className="mt-2 text-sm md:text-base">Vos données sont utilisées uniquement à des fins de service et de conformité légale.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Conservation</h2>
          <p className="mt-2 text-sm md:text-base">Les données sont conservées pour la durée nécessaire aux finalités prévues et aux obligations légales.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Vos droits</h2>
          <p className="mt-2 text-sm md:text-base">Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données. Contact: contact@leparkingvtc.com.</p>
        </div>
      </section>
    </main>
  )
}
