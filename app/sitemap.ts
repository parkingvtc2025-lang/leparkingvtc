import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://leparkingvtc.fr"
  const lastmod = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    "/",
    "/documents",
    "/flotte",
    "/mentions-legales",
    "/conditions-d-utilisation",
    "/politique-de-confidentialite",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: lastmod,
    changeFrequency: "weekly",
    priority: path === "/" ? 1.0 : 0.7,
  }))

  // Try to include vehicle detail pages if API is reachable
  try {
    const res = await fetch(`${base}/api/vehicles`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json()
      const vehicles = Array.isArray(data?.vehicles) ? data.vehicles : []
      const vehicleEntries: MetadataRoute.Sitemap = vehicles
        .filter((v: any) => v?.id)
        .map((v: any) => ({
          url: `${base}/flotte/${v.id}`,
          lastModified: lastmod,
          changeFrequency: "weekly",
          priority: 0.6,
        }))
      return [...staticEntries, ...vehicleEntries]
    }
  } catch {
    // ignore and fall back to static entries
  }

  return staticEntries
}
