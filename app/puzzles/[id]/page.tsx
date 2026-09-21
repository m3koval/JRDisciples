import { wordPuzzles } from "@/data/word-puzzles";
import PuzzleClient from "./PuzzleClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return wordPuzzles.map((item) => ({ id: item.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PuzzleClient id={id} />;
}
