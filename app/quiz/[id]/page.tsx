import { quizzes } from "@/data/quizzes";
import QuizGame from "@/components/QuizGame";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return quizzes.map((q) => ({ id: q.id }));
}

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = quizzes.find((q) => q.id === id);
  if (!quiz) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/quiz" className="text-blue-600 hover:underline font-semibold text-sm">
        ← Back to Quizzes
      </Link>

      <div className="mt-6 text-center mb-8">
        <div className="text-6xl mb-2">{quiz.emoji}</div>
        <h1 className="text-3xl font-extrabold text-blue-900">{quiz.title}</h1>
        <p className="text-gray-500 mt-1">Answer all {quiz.questions.length} questions!</p>
      </div>

      <QuizGame quiz={quiz} />
    </div>
  );
}
