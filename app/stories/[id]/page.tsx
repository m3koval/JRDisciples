import { stories } from "@/data/stories";
import { quizzes } from "@/data/quizzes";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return stories.map((s) => ({ id: s.id }));
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = stories.find((s) => s.id === id);
  if (!story) notFound();

  const quiz = quizzes.find((q) => q.storyId === id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/stories" className="text-blue-600 hover:underline font-semibold text-sm">
        ← Back to Stories
      </Link>

      <div className="mt-6 text-center">
        <div className="text-7xl mb-3">{story.emoji}</div>
        <h1 className="text-4xl font-extrabold text-blue-900 mb-1">{story.title}</h1>
        <p className="text-sm text-gray-500 mb-2">{story.reference}</p>
        <p className="text-xs bg-blue-100 text-blue-700 inline-block px-3 py-1 rounded-full">
          {story.ageNote}
        </p>
      </div>

      {/* Story Content */}
      <div className="mt-8 bg-white rounded-2xl border-2 border-blue-100 p-6 space-y-4">
        {story.summary.map((para, i) => (
          <p key={i} className="text-gray-700 text-base leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Big Truth */}
      <div className="mt-6 bg-blue-900 text-white rounded-2xl p-5 text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-blue-300">Big Truth</p>
        <p className="text-lg font-semibold italic">&ldquo;{story.bigTruth}&rdquo;</p>
      </div>

      {/* Discussion Questions */}
      <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-5">
        <h2 className="text-lg font-extrabold text-yellow-800 mb-3">
          💬 Talk About It
        </h2>
        <ol className="space-y-2">
          {story.discussionQuestions.map((q, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-bold text-yellow-700 min-w-5">{i + 1}.</span>
              <span className="text-gray-700">{q}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Quiz CTA */}
      {quiz && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">Ready to test what you learned?</p>
          <Link
            href={`/quiz/${quiz.id}`}
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-extrabold text-lg px-8 py-3 rounded-full transition-colors shadow"
          >
            Take the Quiz! ❓
          </Link>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/stories" className="text-blue-600 hover:underline font-semibold">
          ← Read Another Story
        </Link>
      </div>
    </div>
  );
}
