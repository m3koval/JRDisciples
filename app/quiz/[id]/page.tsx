import { quizzes } from "@/data/quizzes";
import { stories } from "@/data/stories";
import QuizGame from "@/components/QuizGame";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return quizzes.map((q) => ({ id: q.id }));
}

const PZ_COLORS = ["#ff6b1a","#0a7090","#7030a0","#2a6a10","#c05010","#104f8a"];
const BANNER_CLASSES = ["sb-1","sb-2","sb-3","sb-4","sb-5","sb-6"];

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = quizzes.findIndex((q) => q.id === id);
  if (idx === -1) notFound();
  const quiz = quizzes[idx];
  const story = stories.find((s) => s.id === quiz.storyId);
  const color = PZ_COLORS[idx % PZ_COLORS.length];
  const banner = BANNER_CLASSES[idx % BANNER_CLASSES.length];

  return (
    <>
      <div className={`sec-banner ${banner}`}>{quiz.emoji} {quiz.title}</div>
      <section className="alt-bg2">
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "44px 18px 52px" }}>
          <Link href="/quiz" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: color, textDecoration: "none", fontSize: "0.88rem" }}>
            ← All Quizzes
          </Link>

          <div style={{ margin: "20px 0 28px" }}>
            {story && <p className="eyebrow">{story.reference}</p>}
            <h1 className="sec-title">{quiz.title}</h1>
            <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#777", fontSize: "0.9rem" }}>
              Answer all {quiz.questions.length} questions — you can do it! 💪
            </p>
          </div>

          <QuizGame quiz={quiz} pzColor={color} />
        </div>
      </section>
    </>
  );
}
