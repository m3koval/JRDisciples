import { memoryVerses } from "@/data/memory-verses";
import MemoryChallenge from "@/components/MemoryChallenge";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return memoryVerses.map((v) => ({ id: v.id }));
}

export default async function MemoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verse = memoryVerses.find((v) => v.id === id);
  if (!verse) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/memory" className="text-blue-600 hover:underline font-semibold text-sm">
        ← Back to Verses
      </Link>

      <div className="mt-6 text-center mb-8">
        <div className="text-6xl mb-2">{verse.emoji}</div>
        <h1 className="text-3xl font-extrabold text-blue-900">{verse.reference}</h1>
        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mt-2">
          {verse.theme}
        </span>
      </div>

      <MemoryChallenge verse={verse} />
    </div>
  );
}
