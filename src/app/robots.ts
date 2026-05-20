import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/queries/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSiteSettings().catch(() => null);
  const base = (s?.siteUrl as string | undefined) || "http://localhost:3000";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin", "/login"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
