"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"

type Props = {
  images: string[]
  className?: string
  intervalMs?: number
  priorityFirst?: boolean
  sizes?: string
}

export default function ImageCarousel({
  images,
  className,
  intervalMs = 5000,
  priorityFirst = true,
  sizes = "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
}: Props) {
  const cleanImages = useMemo(() => Array.from(new Set((images || []).filter(Boolean))), [images])
  const [index, setIndex] = useState(0)
  const [hover, setHover] = useState(false)
  const len = cleanImages.length
  const touch = useRef<{ startX: number; startY: number; dx: number; dy: number; active: boolean }>({ startX: 0, startY: 0, dx: 0, dy: 0, active: false })

  useEffect(() => {
    if (len < 2 || hover) return
    const id = setInterval(() => setIndex((i) => (i + 1) % len), intervalMs)
    return () => clearInterval(id)
  }, [len, hover, intervalMs])

  useEffect(() => {
    if (index >= len) setIndex(0)
  }, [len, index])

  const go = (dir: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (len < 2) return
    setIndex((i) => (i + dir + len) % len)
  }

  const goto = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIndex(i)
  }

  return (
    <div
      className={"relative h-full w-full select-none overflow-hidden " + (className || "")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={(e) => {
        const t = e.changedTouches[0]
        touch.current = { startX: t.clientX, startY: t.clientY, dx: 0, dy: 0, active: true }
        setHover(true)
      }}
      onTouchMove={(e) => {
        if (!touch.current.active) return
        const t = e.changedTouches[0]
        touch.current.dx = t.clientX - touch.current.startX
        touch.current.dy = t.clientY - touch.current.startY
      }}
      onTouchEnd={() => {
        if (!touch.current.active) return setHover(false)
        const { dx, dy } = touch.current
        touch.current.active = false
        // Only act on mostly horizontal swipes
        if (Math.abs(dx) > Math.abs(dy)) {
          const THRESH = 40
          if (dx > THRESH) setIndex((i) => (i - 1 + len) % len)
          else if (dx < -THRESH) setIndex((i) => (i + 1) % len)
        }
        setHover(false)
      }}
    >
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {cleanImages.map((src, i) => (
          <div key={src + i} className="relative h-full w-full shrink-0 grow-0 basis-full">
            <Image
              src={src}
              alt=""
              fill
              sizes={sizes}
              priority={i === 0 && priorityFirst}
              loading={i === 0 && priorityFirst ? undefined : "lazy"}
              className="object-cover"
              draggable={false}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {len > 1 && (
        <>
          <button
            aria-label="Précédent"
            onClick={go(-1)}
            className="absolute left-2 top-1/2 z-[5] -translate-y-1/2 rounded-full bg-foreground/70 p-2 text-background hover:bg-foreground"
          >
            ‹
          </button>
          <button
            aria-label="Suivant"
            onClick={go(1)}
            className="absolute right-2 top-1/2 z-[5] -translate-y-1/2 rounded-full bg-foreground/70 p-2 text-background hover:bg-foreground"
          >
            ›
          </button>

          <div className="pointer-events-auto absolute bottom-2 left-0 right-0 z-[5] flex items-center justify-center gap-2">
            {cleanImages.map((_, i) => (
              <button
                key={i}
                aria-label={`Aller à l'image ${i + 1}`}
                onClick={goto(i)}
                className={`h-2 w-2 rounded-full transition ${i === index ? "bg-background" : "bg-background/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
