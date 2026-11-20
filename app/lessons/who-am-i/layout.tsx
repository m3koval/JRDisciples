import { pageMetadata } from "@/lib/seo";
import type { Metadata } from 'next'

export const metadata: Metadata = pageMetadata("/lessons/who-am-i", "Who am I?", "An interactive English and Russian Bible lesson about belonging to Jesus, with 1 Peter 2:9–10 and a printable activity booklet.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
