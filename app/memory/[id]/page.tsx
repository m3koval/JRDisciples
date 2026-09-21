import { memoryVerses } from "@/data/memory-verses";
import { memoryVersesRu } from "@/data/memory-verses-ru";
import MemoryClient from "./MemoryClient";

export async function generateStaticParams() {
  const ids = new Set([...memoryVerses, ...memoryVersesRu].map((v) => v.id));
  return [...ids].map((id) => ({ id }));
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MemoryClient id={id} />;
}
