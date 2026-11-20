import { metadataForPath } from "@/lib/seo-pages";

export const metadata = metadataForPath("/explore");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
