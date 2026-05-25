'use client'

import { stories } from "@/data/stories";
import { storiesRu } from "@/data/stories-ru";
import { quizzes } from "@/data/quizzes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/useTranslation";
import { notFound } from "next/navigation";

const BANNER_CLASSES = ["sb-1","sb-2","sb-3","sb-4","sb-5","sb-6"];
const PZ_COLORS = ["#ff6b1a","#0a7090","#7030a0","#2a6a10","#c05010","#104f8a"];
const ALT_BGS = ["alt-bg","alt-bg2","alt-bg3","alt-bg4","alt-bg5","alt-bg6"];

export default function StoryPage() {
  const params = useParams();
  const id = params.id as string;
  const { language } = useLanguage();
  const t = useTranslation();

  // Select the correct stories array based on language
  const currentStories = language === 'ru' ? storiesRu : stories;

  const idx = currentStories.findIndex((s) => s.id === id);
  if (idx === -1) {
    notFound();
  }

  const story = currentStories[idx];
  const quiz = quizzes.find((q) => q.storyId === id);
  const pzColor = PZ_COLORS[idx % PZ_COLORS.length];
  const bannerCls = BANNER_CLASSES[idx % BANNER_CLASSES.length];
  const bgCls = ALT_BGS[idx % ALT_BGS.length];

  return (
    <>
      <div className={`sec-banner ${bannerCls}`}>
        {story.emoji} {story.title}
      </div>

      {/* Story hero image — full-width at top, before title */}
      {story.image && (
        <div style={{ background: "var(--deep)", textAlign: "center", padding: "24px 18px 0" }}>
          <img
            src={story.image}
            alt={story.title}
            style={{ maxWidth: 500, width: "100%", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,.35)", display: "block", margin: "0 auto" }}
          />
        </div>
      )}

      <section className={bgCls}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 18px 52px" }}>
          <Link href="/stories" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: pzColor, textDecoration: "none", fontSize: "0.88rem" }}>
            ← {language === 'ru' ? 'Все истории' : 'All Stories'}
          </Link>

          <div style={{ marginTop: 20, marginBottom: 28 }}>
            <p className="eyebrow">{story.reference}</p>
            <h1 className="sec-title">{story.title}</h1>
            <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.78rem", background: "#fff", border: "2px solid var(--pz-color)", color: "var(--pz-color)", borderRadius: 20, padding: "2px 12px", ["--pz-color" as string]: pzColor }}>
              {story.ageNote}
            </span>
          </div>

          {/* Story content */}
          <div className="puzzle-box" style={{ ["--pz-color" as string]: pzColor }}>
            <p className="puzzle-label">{language === 'ru' ? 'История' : 'The Story'}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {story.summary.map((para, i) => (
                <p key={i} style={{ fontFamily: "var(--font-lora)", fontSize: "1rem", lineHeight: 1.85, color: "#333", margin: 0 }}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Big Truth pull-quote */}
          <div className="pull-quote">
            <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--flame2)", marginBottom: 8 }}>
              {language === 'ru' ? 'Главная истина' : 'Big Truth'}
            </p>
            <p className="pq-text">&ldquo;{story.bigTruth}&rdquo;</p>
          </div>

          {/* Discussion questions */}
          <div className="puzzle-box" style={{ ["--pz-color" as string]: "#f0c040" }}>
            <p className="puzzle-label">💬 {language === 'ru' ? 'Поговорим об этом' : 'Talk About It'}</p>
            <ol style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none" }}>
              {story.discussionQuestions.map((q, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, color: "#f0c040", minWidth: 22, fontSize: "1rem" }}>{i + 1}.</span>
                  <span style={{ fontFamily: "var(--font-lora)", fontSize: "0.95rem", lineHeight: 1.7, color: "#333" }}>{q}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="kid-note">
            💡 {language === 'ru' ? 'Попроси взрослого или учителя рассказать, что эта история означает для них!' : 'Ask a grown-up or teacher to share what this story means to them!'}
          </div>

          {/* Quiz CTA */}
          {quiz && (
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#555", marginBottom: 12 }}>
                {language === 'ru' ? 'Готов проверить, что ты выучил?' : 'Ready to test what you learned?'}
              </p>
              <Link
                href={`/quiz/${quiz.id}`}
                className="pz-btn"
                style={{ display: "inline-block", background: pzColor, color: "#fff", textDecoration: "none", padding: "14px 32px", width: "auto", borderRadius: 14 }}
              >
                {language === 'ru' ? 'Пройти тест! ❓' : 'Take the Quiz! ❓'}
              </Link>
            </div>
          )}

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/stories" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: pzColor, textDecoration: "none" }}>
              ← {language === 'ru' ? 'Прочитать другую историю' : 'Read Another Story'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
