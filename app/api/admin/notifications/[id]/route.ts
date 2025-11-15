import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-client"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const body = await req.json().catch(() => null)
    const read = typeof body?.read === "boolean" ? body.read : undefined
    if (read === undefined) return NextResponse.json({ error: "Invalid body" }, { status: 400 })

    const nref = doc(db, "notifications", id)
    const nsnap = await getDoc(nref)
    if (!nsnap.exists()) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await updateDoc(nref, { read })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}
