import { rebusPuzzles } from "@/data/rebus";
import RebusCard from "@/components/RebusCard";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return rebusPuzzles.map((p) => ({ id: p.id }));
}

export default async function RebusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const puzzle = rebusPuzzles.find((p) => p.id === id);
  if (!puzzle) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/rebus" className="text-blue-600 hover:underline font-semibold text-sm">
        ← Back to Rebus Puzzles
      </Link>

      <div className="mt-6 text-center mb-8">
        <div className="text-6xl mb-2">🧩</div>
        <h1 className="text-3xl font-extrabold text-blue-900">{puzzle.title}</h1>
        <p className="text-gray-500 mt-1">Figure out the Bible word from the clues!</p>
      </div>

      <RebusCard puzzle={puzzle} />
    </div>
  );
}
