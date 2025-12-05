import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/app/api/admin",
        ],
      },
    ],
    host: "https://leparkingvtc.fr",
    sitemap: "https://leparkingvtc.fr/sitemap.xml",
  }
}
