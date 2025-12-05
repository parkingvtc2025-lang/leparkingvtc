import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const lastmod = new Date()
  const routes = [
    "",
    "/documents",
    "/flotte",
    "/mentions-legales",
    "/conditions-d-utilisation",
    "/politique-de-confidentialite",
  ]
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: lastmod,
    changeFrequency: "weekly",
    priority: path === "" ? 1.0 : 0.7,
  }))
}
