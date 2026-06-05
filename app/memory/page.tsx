'use client'

import Link from "next/link";
import { memoryVerses } from "@/data/memory-verses";
import { memoryVersesRu } from "@/data/memory-verses-ru";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/useTranslation";
import { JrFullImageTile } from "@/components/JrFullImageTile";

const PZ_COLORS = ["#2a6a10","#0a7090","#ff6b1a","#7030a0","#c05010","#104f8a","#40b870","#7030a0"];

export default function MemoryListPage() {
  const { language } = useLanguage();
  const t = useTranslation();
  const currentVerses = language === 'ru' ? memoryVersesRu : memoryVerses;

  return (
    <>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg,#1a6a30,#2a8a40)", padding: "48px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, width: "100%", maxWidth: 800 }}>
            <img src="/images/jr/verse-memory-hero.png" alt="Verse Memory" style={{ width: "100%", height: "auto", borderRadius: 16, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.25))" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            {t.memory.title}
          </h1>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "rgba(255,255,255,.95)", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            {t.memory.subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="alt-bg4">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">{t.memory.treasured}</p>
          <h2 className="sec-title">{t.memory.heading}</h2>
          <p className="sec-intro" style={{ marginBottom: 8 }}>
            &ldquo;{t.memory.intro}&rdquo;
          </p>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--fire)", marginBottom: 32 }}>
            — {t.memory.introRef}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentVerses.map((verse, i) => {
              const color = PZ_COLORS[i % PZ_COLORS.length];
              return (
                <JrFullImageTile
                  key={verse.id}
                  href={`/memory/${verse.id}`}
                  image="/images/jr/verse-memory.png"
                  title={verse.reference}
                  label={verse.theme}
                  description={`“${verse.text}”`}
                  cta={t.memory.practiceNow}
                  color={color}
                  minHeight={315}
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
