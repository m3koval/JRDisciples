import Link from "next/link";
import { rebusPuzzles } from "@/data/rebus";

export default function RebusListPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🧩</div>
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Rebus Puzzles</h1>
        <p className="text-lg text-gray-600">
          Use the picture clues to figure out the Bible word!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rebusPuzzles.map((puzzle) => (
          <Link
            key={puzzle.id}
            href={`/rebus/${puzzle.id}`}
            className="bg-white rounded-2xl border-2 border-pink-200 p-6 hover:border-pink-400 hover:shadow-md transition-all flex flex-col items-center text-center"
          >
            <div className="text-5xl mb-3">🧩</div>
            <h2 className="text-xl font-extrabold text-gray-800 mb-3">{puzzle.title}</h2>
            <div className="flex flex-wrap gap-1 justify-center mb-4">
              {puzzle.clues.slice(0, 4).map((clue, i) => (
                <span key={i} className="text-2xl">
                  {clue.type === "emoji" || clue.type === "text" ? clue.value : clue.type === "plus" ? "+" : clue.type === "minus" ? "−" : "="}
                </span>
              ))}
              {puzzle.clues.length > 4 && <span className="text-gray-400">...</span>}
            </div>
            <p className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-semibold">
              Solve the puzzle!
            </p>
            <div className="mt-4">
              <span className="inline-block bg-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                Try It →
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
