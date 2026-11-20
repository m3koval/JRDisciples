import { metadataForPath } from "@/lib/seo-pages";

export const metadata = metadataForPath("/lessons/second-mile");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
