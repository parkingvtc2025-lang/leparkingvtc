import Image from "next/image"

export default function PartnersSection() {
  const partners: Array<
    | { name: string; type: "logo"; bg: string; src: string; alt: string; imgHeightClass?: string }
    | { name: string; type: "badge"; bg: string; textClass?: string }
  > = [
    { name: "Bolt", type: "logo", bg: "#00FF75", src: "/svgpartenaire/Bolt/Bolt_idiYLKHeFj_0.svg", alt: "Bolt" },
    { name: "FlexiFleet", type: "badge", bg: "#111827", textClass: "text-white text-2xl md:text-3xl" },
    { name: "Heetch", type: "logo", bg: "#FF0069", src: "/svgpartenaire/Heetch/Heetch_idvgvZoLf2_1.svg", alt: "Heetch", imgHeightClass: "h-7 md:h-9" },
    { name: "Uber", type: "logo", bg: "#000000", src: "/svgpartenaire/Uber/Uber_idx5jwDz9K_0.svg", alt: "Uber" },
  ]

  return (
    <section className="py-16 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Nos partenaires</h2>
          <p className="mt-2 text-sm text-muted-foreground">Des acteurs majeurs de la mobilité nous font confiance</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 items-stretch">
          {partners.map((p) => (
            <div
              key={p.name}
              className="group relative rounded-xl border border-border/50 bg-background/50 p-4 md:p-6 flex items-center justify-center"
            >
              {p.type === "logo" ? (
                <div className="w-full h-20 md:h-24 rounded-lg flex items-center justify-center" style={{ backgroundColor: (p as any).bg }}>
                  {/* Using next/image even for SVG for consistency */}
                  <Image src={(p as any).src} alt={(p as any).alt} width={180} height={48} className={`${(p as any).imgHeightClass ?? 'h-10 md:h-12'} w-auto`} />
                </div>
              ) : (
                <div className="w-full h-20 md:h-24 rounded-lg flex items-center justify-center" style={{ backgroundColor: (p as any).bg }}>
                  <span className={`font-extrabold tracking-tight ${(p as any).textClass ?? 'text-lg md:text-xl'}`}>
                    {(p as any).name}
                  </span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-border/40 group-hover:ring-border/70 transition-colors" />
            </div>
          ))}
        </div>

        
      </div>
    </section>
  )
}
