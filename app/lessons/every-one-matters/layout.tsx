import { metadataForPath } from "@/lib/seo-pages";

export const metadata = metadataForPath("/lessons/every-one-matters");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
