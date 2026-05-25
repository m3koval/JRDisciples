'use client'

import { memoryVerses } from "@/data/memory-verses";
import { memoryVersesRu } from "@/data/memory-verses-ru";
import MemoryChallenge from "@/components/MemoryChallenge";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { notFound } from "next/navigation";

export default function MemoryPage() {
  const params = useParams();
  const id = params.id as string;
  const { language } = useLanguage();

  const currentVerses = language === 'ru' ? memoryVersesRu : memoryVerses;
  const verse = currentVerses.find((v) => v.id === id);

  if (!verse) notFound();

  return (
    <>
      <div className="sec-banner sb-4">💡 {language === 'ru' ? 'Запоминание стихов' : 'Verse Memory'}</div>
      <section className="alt-bg4">
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "44px 18px 52px" }}>
          <Link href="/memory" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#2a6a10", textDecoration: "none", fontSize: "0.88rem" }}>
            ← {language === 'ru' ? 'Все стихи' : 'All Verses'}
          </Link>

          <div style={{ margin: "20px 0 28px" }}>
            <div style={{ fontSize: "3rem", marginBottom: 8 }}>{verse.emoji}</div>
            <p className="eyebrow">{verse.theme}</p>
            <h1 className="sec-title">{verse.reference}</h1>
          </div>

          <MemoryChallenge verse={verse} />

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/memory" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#2a6a10", textDecoration: "none" }}>
              ← {language === 'ru' ? 'Попробуй другой стих' : 'Try Another Verse'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
