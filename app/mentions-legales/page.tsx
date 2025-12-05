import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Le Parking VTC: éditeur, hébergement, contact et responsabilités.",
}

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold text-foreground">Mentions légales</h1>
      <p className="mt-3 text-sm text-muted-foreground">Dernière mise à jour: {new Date().getFullYear()}</p>

      <section className="mt-10 space-y-6 text-foreground/90">
        <div>
          <h2 className="text-xl font-semibold">Éditeur du site</h2>
          <p className="mt-2 text-sm md:text-base">Le Parking VTC – Société de location de véhicules pour chauffeurs VTC.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Siège social</h2>
          <p className="mt-2 text-sm md:text-base">123 Avenue des Champs, 75008 Paris, France</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2 text-sm md:text-base">contact@leparkingvtc.com – +33 6 12 34 56 78</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Hébergement</h2>
          <p className="mt-2 text-sm md:text-base">Renseigner l’hébergeur (ex: Vercel / OVH / autre).</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Responsabilité</h2>
          <p className="mt-2 text-sm md:text-base">Les informations présentées sur ce site sont fournies à titre indicatif et peuvent être modifiées à tout moment.</p>
        </div>
      </section>
    </main>
  )
}
