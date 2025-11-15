import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-client"
import { collection, getDocs, limit as fsLimit, orderBy, query, updateDoc, where, doc } from "firebase/firestore"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const unreadOnly = url.searchParams.get("unreadOnly") === "true"
    const limitParam = Number(url.searchParams.get("limit") || 20)

    const hdr = req.headers
    const host = hdr.get("x-forwarded-host") ?? hdr.get("host") ?? "default"
    const siteId = host.toLowerCase()

    const col = collection(db, "notifications")
    const isDevHost = siteId.includes("localhost") || siteId.startsWith("127.0.0.1") || siteId.endsWith(".vercel.app")
    const qLimit = fsLimit(Math.max(1, Math.min(100, limitParam)))

    let snap
    if (isDevHost) {
      // Dev/preview: avoid composite indexes; filter in code
      const q = query(col, orderBy("createdAt", "desc"), qLimit)
      snap = await getDocs(q)
    } else {
      try {
        const q = query(col, where("siteId", "==", siteId), orderBy("createdAt", "desc"), qLimit)
        snap = await getDocs(q)
      } catch {
        // Fallback if index missing: fetch latest and filter in code
        const q = query(col, orderBy("createdAt", "desc"), qLimit)
        snap = await getDocs(q)
      }
    }

    let items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
    if (!isDevHost) {
      items = items.filter((n: any) => {
        const s = typeof n.siteId === "string" ? n.siteId.toLowerCase() : null
        return !s || s === siteId
      })
    }
    if (unreadOnly) items = items.filter((n: any) => !n.read)

    return NextResponse.json({ notifications: items })
  } catch (e) {
    return NextResponse.json({ error: "Failed to list notifications" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const readAll = body?.readAll === true

    const hdr = req.headers
    const host = hdr.get("x-forwarded-host") ?? hdr.get("host") ?? "default"
    const siteId = host.toLowerCase()

    if (!readAll) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const col = collection(db, "notifications")
    const q = query(col, where("siteId", "==", siteId), where("read", "==", false), orderBy("createdAt", "desc"), fsLimit(200))
    const snap = await getDocs(q)
    const batch = snap.docs
    for (const dref of batch) {
      await updateDoc(doc(db, "notifications", dref.id), { read: true })
    }

    return NextResponse.json({ ok: true, updated: batch.length })
  } catch (e) {
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}
