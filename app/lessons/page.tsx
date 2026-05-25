'use client'

import Link from "next/link";
import { lessonTopics } from "@/data/lessons";
import { lessonTopicsRu } from "@/data/lessons-ru";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/useTranslation";

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
            {(t as any).lessons.title}
          </h1>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "rgba(255,255,255,.95)", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            {(t as any).lessons.subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="alt-bg">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">{(t as any).lessons.chooseTopics}</p>
          <h2 className="sec-title">{(t as any).lessons.whatLearn}</h2>
          <p className="sec-intro" style={{ marginBottom: 8 }}>
            {(t as any).lessons.intro}
          </p>
          <div className="kid-note" style={{ marginBottom: 32 }}>
            💡 {(t as any).lessons.progressSaved}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentTopics.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="puzzle-box block no-underline hover:no-underline"
                style={{ ["--pz-color" as string]: topic.color, textDecoration: "none" }}
              >
                <p className="puzzle-label">{t.common.section} · {topic.sections} {(t as any).lessons.sections}</p>
                <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  {topic.image ? (
                    <img src={topic.image} alt={topic.title} style={{ width: 80, height: 80, objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: "3.2rem" }}>{topic.emoji}</span>
                  )}
                </div>
                <h3 style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1.2rem", color: "var(--text)", marginBottom: 6 }}>
                  {topic.title}
                </h3>
                <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.9rem", color: "#555", lineHeight: 1.6 }}>
                  {topic.desc}
                </p>
                <div className="pz-btn" style={{ marginTop: 14, textAlign: "center" }}>
                  {(t as any).lessons.start} →
                </div>
              </Link>
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
