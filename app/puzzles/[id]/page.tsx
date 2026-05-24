import { wordPuzzles } from "@/data/word-puzzles";
import WordSearchGame from "@/components/WordSearchGame";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return wordPuzzles.map((p) => ({ id: p.id }));
}

const BANNERS = ["sb-3","sb-5","sb-6"];
const BGS = ["alt-bg6","alt-bg2","alt-bg"];

export default async function PuzzlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = wordPuzzles.findIndex((p) => p.id === id);
  if (idx === -1) notFound();
  const puzzle = wordPuzzles[idx];

  return (
    <>
      <div className={`sec-banner ${BANNERS[idx % BANNERS.length]}`}>{puzzle.emoji} {puzzle.title}</div>
      <section className={BGS[idx % BGS.length]}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "44px 18px 52px" }}>
          <Link href="/puzzles" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#7030a0", textDecoration: "none", fontSize: "0.88rem" }}>
            ← All Puzzles
          </Link>

          <div style={{ margin: "20px 0 28px" }}>
            <div style={{ fontSize: "3rem", marginBottom: 8 }}>{puzzle.emoji}</div>
            <p className="eyebrow">{puzzle.theme}</p>
            <h1 className="sec-title">{puzzle.title}</h1>
            <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.95rem", color: "#555", lineHeight: 1.6 }}>
              {puzzle.description}
            </p>
          </div>

          <WordSearchGame puzzle={puzzle} />
        </div>
      </section>
    </>
  );
}
