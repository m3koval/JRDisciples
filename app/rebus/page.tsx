'use client'

import Link from "next/link";
import { rebusPuzzles } from "@/data/rebus";
import { rebusRu } from "@/data/rebus-ru";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/useTranslation";
import { JrFullImageTile } from "@/components/JrFullImageTile";

const PZ_COLORS = ["#c05010","#0a7090","#2a6a10","#7030a0","#ff6b1a","#104f8a"];

export default function RebusListPage() {
  const { language } = useLanguage();
  const t = useTranslation();
  const currentPuzzles = language === 'ru' ? rebusRu : rebusPuzzles;

  return (
    <>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg,#a04010,#c05010)", padding: "48px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, width: "100%", maxWidth: 800 }}>
            <img src="/images/jr/rebus-puzzles-hero.png" alt="Rebus Puzzles" style={{ width: "100%", height: "auto", borderRadius: 16, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.25))" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            {t.rebus.title}
          </h1>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "rgba(255,255,255,.95)", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            {t.rebus.subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="alt-bg5">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">{language === 'ru' ? 'Ребус-вызовы' : 'Rebus Challenges'}</p>
          <h2 className="sec-title">{language === 'ru' ? 'Разгадай ребус!' : 'Crack the Rebus Code!'}</h2>
          <p className="sec-intro" style={{ marginBottom: 32 }}>
            {t.rebus.intro}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentPuzzles.map((puzzle, i) => {
              const color = PZ_COLORS[i % PZ_COLORS.length];
              return (
                <JrFullImageTile
                  key={puzzle.id}
                  href={`/rebus/${puzzle.id}`}
                  image="/images/jr/rebus-puzzles.png"
                  title={puzzle.title}
                  label={`🧩 ${t.rebus.puzzle}`}
                  description={language === 'ru' ? 'Рассмотри картинки, знаки и подсказки — найди скрытое библейское слово.' : 'Look at the pictures, signs, and clues — find the hidden Bible word.'}
                  cta={language === 'ru' ? 'Разгадай!' : 'Solve It!'}
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
