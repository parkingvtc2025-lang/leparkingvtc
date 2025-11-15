"use client"

interface SectionDividerProps {
  variant?: "sunset" | "ocean" | "midnight"
  flip?: boolean
}

const SectionDivider = (_props: SectionDividerProps) => {
  return (
    <div className="relative w-full" aria-hidden="true">
      <div className="mx-auto my-8 h-px w-[88%] max-w-6xl bg-border/70" />
    </div>
  )
}

export default SectionDivider
