import Link from "next/link";
import { wordPuzzles } from "@/data/word-puzzles";

export default function PuzzlesListPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🔤</div>
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Word Puzzles</h1>
        <p className="text-lg text-gray-600">
          Find the hidden Bible words in each grid!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {wordPuzzles.map((puzzle) => (
          <Link
            key={puzzle.id}
            href={`/puzzles/${puzzle.id}`}
            className="bg-white rounded-2xl border-2 border-purple-200 p-6 hover:border-purple-400 hover:shadow-md transition-all flex flex-col items-center text-center"
          >
            <div className="text-5xl mb-3">{puzzle.emoji}</div>
            <h2 className="text-xl font-extrabold text-gray-800 mb-2">{puzzle.title}</h2>
            <p className="text-sm text-gray-600 mb-3">{puzzle.description}</p>
            <p className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
              Find {puzzle.words.length} words
            </p>
            <div className="mt-4">
              <span className="inline-block bg-purple-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                Play →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline font-semibold">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
