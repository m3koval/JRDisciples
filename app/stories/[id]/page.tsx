import { stories } from "@/data/stories";
import StoryClient from "./StoryClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return stories.map((item) => ({ id: item.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoryClient id={id} />;
}
