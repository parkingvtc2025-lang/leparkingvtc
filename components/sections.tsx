"use client"

import { MapPin, Users, Zap, Shield } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">À Propos de Le Parking VTC</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Depuis plus de 10 ans, Le Parking VTC est votre partenaire de confiance pour la location de véhicules
            premium. Nous proposons une flotte de voitures haut de gamme pour les chauffeurs VTC professionnels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Équipe Professionnelle</h3>
                <p className="text-muted-foreground">
                  Notre équipe est disponible 24/7 pour vous accompagner dans vos besoins de location.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Service Rapide</h3>
                <p className="text-muted-foreground">
                  Réservation en ligne en quelques minutes, livraison rapide à votre domicile.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Shield className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Sécurité Garantie</h3>
                <p className="text-muted-foreground">
                  Tous nos véhicules sont assurés et régulièrement entretenus pour votre sécurité.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <MapPin className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Couverture Régionale</h3>
                <p className="text-muted-foreground">
                  Nous couvrons toute la région avec des points de retrait stratégiques.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProductsSection() {
  const products = [
    {
      name: "Berlines Premium",
      description: "Véhicules haut de gamme pour vos trajets professionnels",
      features: ["Confort maximal", "Climatisation", "Système audio premium"],
    },
    {
      name: "SUV Luxe",
      description: "Espace et prestige pour vos déplacements",
      features: ["Grand espace", "Traction intégrale", "Sièges chauffants"],
    },
    {
      name: "Véhicules Électriques",
      description: "Écologique et économique",
      features: ["Zéro émission", "Autonomie longue", "Recharge rapide"],
    },
  ]

  return (
    <section id="products" className="min-h-screen bg-secondary/30 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-balance">Notre Flotte</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-8 border border-border/20 hover:border-border/50 transition-all hover:shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-3">{product.name}</h3>
              <p className="text-muted-foreground mb-6">{product.description}</p>
              <ul className="space-y-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-foreground rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlogSection() {
  const articles = [
    {
      title: "Les Avantages de la Location VTC",
      date: "29 Octobre 2025",
      excerpt: "Découvrez pourquoi la location VTC est la meilleure solution pour vos déplacements professionnels.",
    },
    {
      title: "Conseils pour Maximiser Vos Revenus",
      date: "25 Octobre 2025",
      excerpt: "Nos experts partagent les meilleures pratiques pour optimiser vos revenus en tant que chauffeur VTC.",
    },
    {
      title: "Entretien et Maintenance des Véhicules",
      date: "20 Octobre 2025",
      excerpt: "Guide complet pour maintenir votre véhicule en parfait état et prolonger sa durée de vie.",
    },
  ]

  return (
    <section id="blog" className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-balance">Notre Blog</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article
              key={index}
              className="bg-secondary/50 rounded-2xl p-8 border border-border/20 hover:border-border/50 transition-all hover:shadow-lg cursor-pointer group"
            >
              <p className="text-sm text-muted-foreground mb-3">{article.date}</p>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-foreground/80 transition-colors">
                {article.title}
              </h3>
              <p className="text-muted-foreground text-sm">{article.excerpt}</p>
              <button className="mt-4 text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
                Lire plus →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  return (
    <section id="contact" className="min-h-screen bg-secondary/30 py-20 px-6 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-balance">Nous Contacter</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Adresse</h3>
              <p className="text-muted-foreground">123 Avenue des Champs, 75008 Paris, France</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Téléphone</h3>
              <p className="text-muted-foreground">+33 6 12 34 56 78</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Email</h3>
              <p className="text-muted-foreground">contact@leparkingvtc.com</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Horaires</h3>
              <p className="text-muted-foreground">Lundi - Dimanche: 24/7</p>
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-background border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-background border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="Votre email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                className="w-full px-4 py-3 bg-background border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                rows={4}
                placeholder="Votre message"
              ></textarea>
            </div>

            <button className="w-full px-6 py-3 bg-foreground text-background font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
