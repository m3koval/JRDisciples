import { wordPuzzles } from "@/data/word-puzzles";
import WordSearchGame from "@/components/WordSearchGame";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return wordPuzzles.map((p) => ({ id: p.id }));
}

export default async function PuzzlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const puzzle = wordPuzzles.find((p) => p.id === id);
  if (!puzzle) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/puzzles" className="text-blue-600 hover:underline font-semibold text-sm">
        ← Back to Puzzles
      </Link>

      <div className="mt-6 text-center mb-8">
        <div className="text-6xl mb-2">{puzzle.emoji}</div>
        <h1 className="text-3xl font-extrabold text-blue-900">{puzzle.title}</h1>
        <p className="text-gray-500 mt-1">{puzzle.description}</p>
      </div>

      <WordSearchGame puzzle={puzzle} />
    </div>
  );
}
