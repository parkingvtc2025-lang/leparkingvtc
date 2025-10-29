"use client"

import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Section with Luxury Divider */}
        <div className="mb-16 pb-16 border-b border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-balance">Le Parking VTC</h3>
              <p className="text-background/70 mt-2 text-lg">Votre partenaire de confiance en location premium</p>
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* About */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-background/50"></div>À Propos
            </h4>
            <p className="text-background/70 text-sm leading-relaxed">
              Depuis plus de 10 ans, nous offrons les meilleures solutions de location de véhicules premium pour les
              chauffeurs VTC professionnels.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-background/50"></div>
              Services
            </h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Location Courte Durée
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Location Longue Durée
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Maintenance Incluse
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Support 24/7
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-background/50"></div>
              Contact
            </h4>
            <div className="space-y-4 text-sm text-background/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Avenue des Champs, 75008 Paris</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+33612345678" className="hover:text-background transition-colors">
                  +33 6 12 34 56 78
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:contact@leparkingvtc.com" className="hover:text-background transition-colors">
                  contact@leparkingvtc.com
                </a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-background/50"></div>
              Horaires
            </h4>
            <div className="space-y-2 text-sm text-background/70">
              <p>
                <span className="font-medium text-background">Lundi - Vendredi</span>
                <br />
                08:00 - 22:00
              </p>
              <p>
                <span className="font-medium text-background">Samedi - Dimanche</span>
                <br />
                24/7 Disponible
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-background/60">
            <p>&copy; 2025 Le Parking VTC. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-background transition-colors">
                Politique de Confidentialité
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Conditions d'Utilisation
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Mentions Légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
