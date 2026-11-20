import { metadataForPath } from "@/lib/seo-pages";

export const metadata = metadataForPath("/games/trail-of-truth");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
