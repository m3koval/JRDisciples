import Link from "next/link";
import { quizzes } from "@/data/quizzes";
import { stories } from "@/data/stories";

export default function QuizListPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">❓</div>
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Bible Quizzes</h1>
        <p className="text-lg text-gray-600">How well do you know God&apos;s Word? Let&apos;s find out!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const story = stories.find((s) => s.id === quiz.storyId);
          return (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="bg-white rounded-2xl border-2 border-yellow-200 p-6 hover:border-yellow-400 hover:shadow-md transition-all flex flex-col items-center text-center"
            >
              <div className="text-5xl mb-3">{quiz.emoji}</div>
              <h2 className="text-xl font-extrabold text-gray-800 mb-1">{quiz.title}</h2>
              {story && (
                <p className="text-xs text-gray-500 mb-3">{story.reference}</p>
              )}
              <p className="text-sm text-yellow-700 font-semibold bg-yellow-50 px-3 py-1 rounded-full">
                5 Questions
              </p>
              <div className="mt-4">
                <span className="inline-block bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-2 rounded-full">
                  Start Quiz →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline font-semibold">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
