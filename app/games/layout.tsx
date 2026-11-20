import { metadataForPath } from "@/lib/seo-pages";

export const metadata = metadataForPath("/games");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
