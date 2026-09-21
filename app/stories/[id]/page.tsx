import { stories } from "@/data/stories";
import { storiesRu } from "@/data/stories-ru";
import StoryClient from "./StoryClient";

// Static export requires every reachable id to be enumerated at build time —
// there's no server left at runtime to resolve an id we didn't pre-render.
export async function generateStaticParams() {
  const ids = new Set([...stories, ...storiesRu].map((s) => s.id));
  return [...ids].map((id) => ({ id }));
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoryClient id={id} />;
}
