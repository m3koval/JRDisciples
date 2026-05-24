import Link from "next/link";
import { memoryVerses } from "@/data/memory-verses";

export default function MemoryListPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">💡</div>
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Verse Memory</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          &ldquo;I have stored up your word in my heart.&rdquo; — Psalm 119:11
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {memoryVerses.map((verse) => (
          <Link
            key={verse.id}
            href={`/memory/${verse.id}`}
            className="bg-white rounded-2xl border-2 border-green-200 p-5 hover:border-green-400 hover:shadow-md transition-all flex gap-4 items-start"
          >
            <div className="text-4xl">{verse.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-extrabold text-gray-800">{verse.reference}</h2>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                  {verse.theme}
                </span>
              </div>
              <p className="text-sm text-gray-600 italic line-clamp-2">&ldquo;{verse.text}&rdquo;</p>
              <span className="mt-2 inline-block text-green-700 font-bold text-sm">
                Practice Now →
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
