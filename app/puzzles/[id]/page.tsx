'use client'

import { wordPuzzles } from "@/data/word-puzzles";
import { wordPuzzlesRu } from "@/data/word-puzzles-ru";
import WordSearchGame from "@/components/WordSearchGame";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

const BANNERS = ["sb-3","sb-5","sb-6"];
const BGS = ["alt-bg6","alt-bg2","alt-bg"];

export default function PuzzlePage() {
  const params = useParams();
  const id = params.id as string;
  const { language } = useLanguage();
  const router = useRouter();

  const currentPuzzles = language === 'ru' ? wordPuzzlesRu : wordPuzzles;
  const idx = currentPuzzles.findIndex((p) => p.id === id);

  useEffect(() => {
    if (idx === -1) router.replace('/puzzles');
  }, [idx, router]);

  if (idx === -1) return null;

  const puzzle = currentPuzzles[idx];

  return (
    <>
      <div className={`sec-banner ${BANNERS[idx % BANNERS.length]}`}>{puzzle.emoji} {puzzle.title}</div>
      <section className={BGS[idx % BGS.length]}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "44px 18px 52px" }}>
          <Link href="/puzzles" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#7030a0", textDecoration: "none", fontSize: "0.88rem" }}>
            ← {language === 'ru' ? 'Все головоломки' : 'All Puzzles'}
          </Link>

          <div style={{ margin: "20px 0 28px" }}>
            <div style={{ fontSize: "3rem", marginBottom: 8 }}>{puzzle.emoji}</div>
            <p className="eyebrow">{puzzle.theme}</p>
            <h1 className="sec-title">{puzzle.title}</h1>
          </div>

          <WordSearchGame puzzle={puzzle} />

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/puzzles" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#7030a0", textDecoration: "none" }}>
              ← {language === 'ru' ? 'Попробуй другую головоломку' : 'Try Another Puzzle'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
