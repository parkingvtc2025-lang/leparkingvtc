"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import SplitText from "@/components/SplitText"
import TextType from "@/components/TextType"
import { usePathname } from "next/navigation"

export default function HeroArt() {
  const pathname = usePathname()
  const [canAnimate, setCanAnimate] = useState(false)

  useEffect(() => {
    setCanAnimate(false)
    const onLoaded = () => setCanAnimate(true)
    window.addEventListener('app:loaded', onLoaded)
    // Fallback in case event fired before mount or on first load
    const fallback = setTimeout(() => setCanAnimate(true), 700)
    return () => {
      window.removeEventListener('app:loaded', onLoaded)
      clearTimeout(fallback)
    }
  }, [pathname])

  return (
    <div className="relative w-full overflow-hidden bg-background">
      <section className="relative h-[100svh] min-h-[560px] flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(70% 55% at 20% 20%, rgba(0,0,0,0.06) 0%, transparent 60%)," +
              "radial-gradient(60% 60% at 80% 15%, rgba(0,0,0,0.05) 0%, transparent 60%)," +
              "conic-gradient(from 210deg at 50% 50%, rgba(0,0,0,0.05), transparent 45%, rgba(0,0,0,0.04))",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, transparent 60%, rgba(0,0,0,0.06) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-15 mix-blend-multiply"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 72px)," +
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0 1px, transparent 1px 88px)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.55em] text-muted-foreground/70">Atelier de mobilité</p>
          <div className="mt-4 space-y-2">
            {canAnimate ? (
            <SplitText
              tag="h1"
              text="Signature VTC"
              className="text-5xl md:text-7xl leading-[1.05] block text-foreground antialiased"
              splitType="chars"
              delay={30}
              duration={0.6}
              ease="power3.out"
              from={{ opacity: 0, y: 0 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
              onLetterAnimationComplete={() => {}}
            />
            ) : (
              <h1 className="text-5xl md:text-7xl leading-[1.05] text-foreground">Signature VTC</h1>
            )}
            {canAnimate ? (
            <SplitText
              tag="h2"
              text="Location de véhicules pour chauffeurs VTC."
              className="text-4xl md:text-6xl leading-[1.05] block text-foreground/90 italic antialiased"
              splitType="chars"
              delay={25}
              duration={0.6}
              ease="power3.out"
              from={{ opacity: 0, y: 0 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
              onLetterAnimationComplete={() => {}}
            />
            ) : (
              <h2 className="text-4xl md:text-6xl leading-[1.05] text-foreground/90 italic">Location de véhicules pour chauffeurs VTC.</h2>
            )}
          </div>
          {canAnimate ? (
          <TextType
            as="p"
            text={["Location VTC clé en main : flotte récente, contrats flexibles, assurance & entretien inclus, assistance 24/7, véhicule de remplacement."]}
            className="mx-auto mt-5 max-w-2xl text-sm md:text-base text-muted-foreground"
            typingSpeed={28}
            initialDelay={900}
            loop={false}
            showCursor={false}
            startOnVisible={true}
            variableSpeed={{ min: 22, max: 34 }}
            onSentenceComplete={() => {}}
          />
          ) : (
            <p className="mx-auto mt-5 max-w-2xl text-sm md:text-base text-muted-foreground">
              Location VTC clé en main : flotte récente, contrats flexibles, assurance & entretien inclus, assistance 24/7, véhicule de remplacement.
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/flotte?reserve=1"
              className={`rounded-lg bg-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground transition-all duration-700 transform-gpu shine-sweep ${canAnimate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
              style={{ transitionDelay: canAnimate ? '120ms' as any : undefined }}
            >
              Réserver
            </Link>
            <Link
              href="/flotte"
              className={`rounded-lg bg-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground transition-all duration-700 transform-gpu shine-sweep ${canAnimate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
              style={{ transitionDelay: canAnimate ? '220ms' as any : undefined }}
            >
              Voir notre flotte
            </Link>
            <a
              href="#about"
              className={`rounded-lg bg-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground transition-all duration-700 transform-gpu shine-sweep ${canAnimate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
              style={{ transitionDelay: canAnimate ? '320ms' as any : undefined }}
            >
              En savoir plus
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 lg:flex xl:right-10">
          <div className="flex flex-col items-center gap-6">
            <p className="text-[11px] tracking-[0.65em] text-muted-foreground/60 uppercase" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>Maîtrise</p>
            <p className="text-sm font-semibold tracking-[0.5em] text-foreground/80 uppercase" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>Signature Luxury</p>
            <p className="text-[11px] tracking-[0.65em] text-muted-foreground/60 uppercase" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>Émotion</p>
          </div>
        </div>
      </section>
    </div>
  )
}

