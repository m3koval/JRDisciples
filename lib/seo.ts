import type { Metadata } from "next";

export const SITE_URL = "https://www.juniordisciples.com";
export const DEFAULT_IMAGE = "/images/jr/quests/quest-hub-map.png";

export function pageMetadata(path: string, title: string, description: string, image = DEFAULT_IMAGE): Metadata {
  const fullTitle = `${title} | Junior Disciples`;
  const url = new URL(path, SITE_URL).href;
  const images = [{ url: new URL(image || DEFAULT_IMAGE, SITE_URL).href, alt: title }];
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: "Junior Disciples", title: fullTitle, description, url, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
