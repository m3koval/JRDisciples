import { metadataForPath } from "@/lib/seo-pages";

export const metadata = metadataForPath("/games/faithful-archer");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
