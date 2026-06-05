'use client'

import Link from "next/link";
import { wordPuzzles } from "@/data/word-puzzles";
import { wordPuzzlesRu } from "@/data/word-puzzles-ru";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/useTranslation";
import { JrFullImageTile } from "@/components/JrFullImageTile";

const PZ_COLORS = ["#7030a0","#0a7090","#c05010"];

export default function PuzzlesListPage() {
  const { language } = useLanguage();
  const t = useTranslation();
  const currentPuzzles = language === 'ru' ? wordPuzzlesRu : wordPuzzles;

  return (
    <>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg,#5030a0,#7030a0)", padding: "48px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, width: "100%", maxWidth: 800 }}>
            <img src="/images/jr/word-puzzles-hero.png" alt="Word Puzzles" style={{ width: "100%", height: "auto", borderRadius: 16, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.25))" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            {t.puzzles.title}
          </h1>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "rgba(255,255,255,.95)", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            {t.puzzles.subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="alt-bg6">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">{t.puzzles.wordSearch}</p>
          <h2 className="sec-title">{t.puzzles.heading}</h2>
          <p className="sec-intro" style={{ marginBottom: 32 }}>
            {t.puzzles.intro}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {currentPuzzles.map((puzzle, i) => {
              const color = PZ_COLORS[i % PZ_COLORS.length];
              return (
                <JrFullImageTile
                  key={puzzle.id}
                  href={`/puzzles/${puzzle.id}`}
                  image="/images/jr/word-puzzles.png"
                  title={puzzle.title}
                  label={puzzle.theme}
                  description={`${puzzle.description} ${t.puzzles.findWords} ${puzzle.words.length} ${t.puzzles.words}`}
                  cta={t.puzzles.play}
                  color={color}
                />
              );
            })}
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
