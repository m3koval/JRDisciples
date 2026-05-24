import Link from "next/link";
import { stories } from "@/data/stories";

export default function StoriesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">📖</div>
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Bible Stories</h1>
        <p className="text-lg text-gray-600">
          Discover amazing true stories from God&apos;s Word!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/stories/${story.id}`}
            className="bg-white rounded-2xl border-2 border-blue-200 p-6 hover:border-blue-400 hover:shadow-md transition-all flex flex-col"
          >
            <div className="text-5xl mb-3 text-center">{story.emoji}</div>
            <h2 className="text-xl font-extrabold text-blue-900 mb-1 text-center">{story.title}</h2>
            <p className="text-xs text-gray-500 text-center mb-3">{story.reference}</p>
            <p className="text-sm text-gray-700 flex-1 italic border-l-4 border-blue-200 pl-3">
              &ldquo;{story.bigTruth}&rdquo;
            </p>
            <div className="mt-4 text-center">
              <span className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                Read Story →
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
