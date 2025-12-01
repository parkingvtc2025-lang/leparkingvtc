import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-client"
import { collection, getDocs } from "firebase/firestore"

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "vehicles"))
    const vehicles = snap.docs.map((d) => {
      const data = d.data() as any
      const imageUrls: string[] = (Array.isArray(data.detailImageUrls) && data.detailImageUrls.length > 0)
        ? data.detailImageUrls
        : (Array.isArray(data.imageUrls) && data.imageUrls.length > 0)
          ? data.imageUrls
          : (data.imageUrl ? [data.imageUrl] : [])
      // Dedupe while preserving order
      const seen = new Set<string>()
      const deduped = imageUrls.filter((u) => {
        if (!u || seen.has(u)) return false
        seen.add(u)
        return true
      })
      const image = data.presentationImageUrl
        || (deduped[0])
        || "/placeholder.jpg"

      const weeklyNum = typeof data.weeklyMinPrice === "number" ? data.weeklyMinPrice : (data.weeklyMinPrice ? Number(data.weeklyMinPrice) : null)
      const monthlyNum = typeof data.monthlyPrice === "number" ? data.monthlyPrice : (data.monthlyPrice ? Number(data.monthlyPrice) : null)

      return {
        id: d.id,
        name: data.name || "Véhicule",
        image,
        hasPresentation: !!data.presentationImageUrl,
        imageUrls: deduped,
        category: data.vehicleType || data.motorization || "Véhicule",
        isBerline: !!data.isBerline,
        tags: Array.isArray(data.tags) ? data.tags : [],
        badges: Array.isArray(data.badges) ? data.badges : (Array.isArray(data.tags) ? data.tags : []),
        eligibility: data.uberEligible ? "ÉLIGIBILITÉ UBER" : undefined,
        weeklyPrice: weeklyNum != null ? `${weeklyNum} € / semaine` : null,
        monthlyPrice: monthlyNum != null ? `${monthlyNum} € / mois` : null,
        summary: data.summary || "",
      }
    })

    // Tri simple: si createdAt existe, tri desc, sinon par name
    vehicles.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0) || a.name.localeCompare(b.name))

    return NextResponse.json({ vehicles })
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}
