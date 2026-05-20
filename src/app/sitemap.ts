import type { MetadataRoute } from "next";
import { getHomeSections, getSiteSettings } from "@/lib/queries/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [s, sections] = await Promise.all([getSiteSettings(), getHomeSections()]);
  const base = (s?.siteUrl as string | undefined) || "http://localhost:3000";
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
  ];
  for (const sec of sections) {
    if (sec.isVisible === false) continue;
    entries.push({
      url: `${base}/#${sec.key}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  return entries;
}
