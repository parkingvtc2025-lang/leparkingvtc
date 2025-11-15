import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-client"
import { doc, getDoc } from "firebase/firestore"

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }
    const ref = doc(db, "vehicles", id)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const data = snap.data() as any

    const image = data.presentationImageUrl
      || (Array.isArray(data.detailImageUrls) && data.detailImageUrls[0])
      || data.imageUrl
      || (Array.isArray(data.imageUrls) && data.imageUrls[0])
      || "/placeholder.jpg"

    const imageUrls: string[] = (Array.isArray(data.detailImageUrls) && data.detailImageUrls.length > 0)
      ? data.detailImageUrls
      : (Array.isArray(data.imageUrls) && data.imageUrls.length > 0)
        ? data.imageUrls
        : (data.imageUrl ? [data.imageUrl] : [])

    const weeklyNum = typeof data.weeklyMinPrice === "number" ? data.weeklyMinPrice : (data.weeklyMinPrice ? Number(data.weeklyMinPrice) : null)
    const monthlyNum = typeof data.monthlyPrice === "number" ? data.monthlyPrice : (data.monthlyPrice ? Number(data.monthlyPrice) : null)

    const payload = {
      id: snap.id,
      name: data.name || "Véhicule",
      image,
      imageUrls,
      category: data.vehicleType || data.motorization || "Véhicule",
      badges: ["Disponible"],
      eligibility: data.uberEligible ? "ÉLIGIBILITÉ UBER" : undefined,
      weeklyPrice: weeklyNum != null ? `${weeklyNum} € / semaine` : null,
      monthlyPrice: monthlyNum != null ? `${monthlyNum} € / mois` : null,
      summary: data.summary || "Véhicule disponible.",
      blockedDates: Array.isArray((data as any).blockedDates) ? (data as any).blockedDates.filter(Boolean) : [],
      specs: {
        seats: data.seats ? `${data.seats} places` : undefined,
        motorisation: data.motorization || undefined,
        trunk: data.trunkVolume || undefined,
        puissanceDIN: data.powerDIN || undefined,
        puissanceFiscale: data.fiscalPower || undefined,
        // Keep legacy combined field for compatibility
        cylindree: data.displacement || data.batteryCapacity || undefined,
        // Expose both for precise labeling on frontend
        displacement: data.displacement || undefined,
        batteryCapacity: data.batteryCapacity || undefined,
        garage: undefined,
      },
      technical: [
        data.emissions ? `Emissions de CO₂ : ${data.emissions}` : null,
        data.batteryCapacity ? `Capacité batterie : ${data.batteryCapacity}` : null,
        data.range ? `Autonomie : ${data.range}` : null,
        data.fastCharge ? `Recharge DC : ${data.fastCharge}` : null,
      ].filter(Boolean),
      dimensions: {
        length: data.length || undefined,
        width: data.width || undefined,
        height: data.height || undefined,
      },
      equipments: Array.isArray(data.equipments) ? data.equipments : [],
    }

    return NextResponse.json(payload)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 })
  }
}
