import type { MetadataRoute } from "next";
import { publicPages } from "@/lib/seo-pages";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // No fabricated last-modified dates or language variants.
  return [...new Set(publicPages().map(page => page.path))].sort().map(path => ({ url: new URL(path, SITE_URL).href }));
}
