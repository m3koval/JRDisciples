'use client'

import { rebusPuzzles } from "@/data/rebus";
import { rebusRu } from "@/data/rebus-ru";
import RebusCard from "@/components/RebusCard";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

const BANNERS = ["sb-5","sb-2","sb-4","sb-3","sb-1","sb-6"];
const BGS     = ["alt-bg5","alt-bg2","alt-bg4","alt-bg6","alt-bg","alt-bg3"];

export default function RebusPage() {
  const params = useParams();
  const id = params.id as string;
  const { language } = useLanguage();
  const router = useRouter();

  const currentPuzzles = language === 'ru' ? rebusRu : rebusPuzzles;
  const idx = currentPuzzles.findIndex((p) => p.id === id);

  useEffect(() => {
    if (idx === -1) router.replace('/rebus');
  }, [idx, router]);

  if (idx === -1) return null;

  const puzzle = currentPuzzles[idx];

  return (
    <>
      <div className={`sec-banner ${BANNERS[idx % BANNERS.length]}`}>🧩 {puzzle.title}</div>
      <section className={BGS[idx % BGS.length]}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "44px 18px 52px" }}>
          <Link href="/rebus" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#c05010", textDecoration: "none", fontSize: "0.88rem" }}>
            ← {language === 'ru' ? 'Все ребусы' : 'All Rebus Puzzles'}
          </Link>

          <div style={{ margin: "20px 0 28px" }}>
            <p className="eyebrow">{language === 'ru' ? 'Визуальные подсказки' : 'Picture Clues'}</p>
            <h1 className="sec-title">{puzzle.title}</h1>
          </div>

          <RebusCard puzzle={puzzle} />

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/rebus" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#c05010", textDecoration: "none" }}>
              ← {language === 'ru' ? 'Попробуй другой ребус' : 'Try Another Rebus'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
