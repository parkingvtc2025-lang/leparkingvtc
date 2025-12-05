import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation du site Le Parking VTC.",
}

export default function ConditionsUtilisationPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold text-foreground">Conditions d'utilisation</h1>
      <p className="mt-3 text-sm text-muted-foreground">Dernière mise à jour: {new Date().getFullYear()}</p>

      <section className="mt-10 space-y-6 text-foreground/90">
        <div>
          <h2 className="text-xl font-semibold">Objet</h2>
          <p className="mt-2 text-sm md:text-base">Ces conditions régissent l'accès et l'utilisation du site Le Parking VTC.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Utilisation du service</h2>
          <p className="mt-2 text-sm md:text-base">L'utilisateur s'engage à fournir des informations exactes et à respecter les lois en vigueur.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Responsabilités</h2>
          <p className="mt-2 text-sm md:text-base">Le Parking VTC ne saurait être tenu responsable des indisponibilités temporaires du site.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2 text-sm md:text-base">Pour toute question, contactez-nous à contact@leparkingvtc.com.</p>
        </div>
      </section>
    </main>
  )
}
