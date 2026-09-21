import { wordPuzzles } from "@/data/word-puzzles";
import { wordPuzzlesRu } from "@/data/word-puzzles-ru";
import PuzzleClient from "./PuzzleClient";

export async function generateStaticParams() {
  const ids = new Set([...wordPuzzles, ...wordPuzzlesRu].map((p) => p.id));
  return [...ids].map((id) => ({ id }));
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PuzzleClient id={id} />;
}
