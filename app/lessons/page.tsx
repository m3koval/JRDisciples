'use client'

import Link from "next/link";
import { lessonTopics } from "@/data/lessons";
import { lessonTopicsRu } from "@/data/lessons-ru";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/useTranslation";
import { JrFullImageTile } from "@/components/JrFullImageTile";

export default function LessonsPage() {
  const { language } = useLanguage();
  const t = useTranslation();
  const currentTopics = language === 'ru' ? lessonTopicsRu : lessonTopics;
  return (
    <>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg,#0d3a6a,#1a5a9a)", padding: "48px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, width: "100%", maxWidth: 800 }}>
            <img src="/images/jr/lessons-hero.png" alt="Bible Lessons" style={{ width: "100%", height: "auto", borderRadius: 16, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.25))" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            {t.lessons.title}
          </h1>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "rgba(255,255,255,.95)", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            {t.lessons.subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="alt-bg">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">{t.lessons.chooseTopics}</p>
          <h2 className="sec-title">{t.lessons.whatLearn}</h2>
          <p className="sec-intro" style={{ marginBottom: 8 }}>
            {t.lessons.intro}
          </p>
          <div className="kid-note" style={{ marginBottom: 32 }}>
            💡 {t.lessons.progressSaved}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentTopics.map((topic) => (
              <JrFullImageTile
                key={topic.href}
                href={topic.href}
                image={topic.image || "/images/jr/lessons-hero.png"}
                title={topic.title}
                label={`${t.common.section} · ${topic.sections} ${t.lessons.sections}`}
                description={topic.desc}
                cta={t.lessons.start}
                color={topic.color}
              />
            ))}
          </div>

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "var(--fire)", textDecoration: "none" }}>
              ← {t.common.backHome}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
