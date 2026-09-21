'use client'

import { quizzes } from "@/data/quizzes";
import { quizzesRu } from "@/data/quizzes-ru";
import { stories } from "@/data/stories";
import { storiesRu } from "@/data/stories-ru";
import QuizGame from "@/components/QuizGame";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const PZ_COLORS = ["#ff6b1a","#0a7090","#7030a0","#2a6a10","#c05010","#104f8a"];
const BANNER_CLASSES = ["sb-1","sb-2","sb-3","sb-4","sb-5","sb-6"];

export default function QuizClient({ id }: { id: string }) {
  const { language } = useLanguage();

  const currentQuizzes = language === 'ru' ? quizzesRu : quizzes;
  const currentStories = language === 'ru' ? storiesRu : stories;

  const idx = currentQuizzes.findIndex((q) => q.id === id);


  if (idx === -1) return null;

  const quiz = currentQuizzes[idx];
  const story = currentStories.find((s) => s.id === quiz.storyId);
  const color = PZ_COLORS[idx % PZ_COLORS.length];
  const banner = BANNER_CLASSES[idx % BANNER_CLASSES.length];

  return (
    <>
      <div className={`sec-banner ${banner}`}>{quiz.emoji} {quiz.title}</div>
      <section className="alt-bg2">
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "44px 18px 52px" }}>
          <Link href="/quiz" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: color, textDecoration: "none", fontSize: "0.88rem" }}>
            ← {language === 'ru' ? 'Все викторины' : 'All Quizzes'}
          </Link>
          <div style={{ marginTop: 20, marginBottom: 28 }}>
            <p className="eyebrow">{language === 'ru' ? 'История' : 'From the Story'}: {story?.title}</p>
            <h1 className="sec-title">{quiz.title}</h1>
          </div>
          <QuizGame quiz={quiz} pzColor={color} />
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/quiz" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: color, textDecoration: "none" }}>
              ← {language === 'ru' ? 'Попробуй другую викторину' : 'Try Another Quiz'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}