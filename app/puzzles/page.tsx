import Link from "next/link";
import { wordPuzzles } from "@/data/word-puzzles";

const PZ_COLORS = ["#7030a0","#0a7090","#c05010"];

export default function PuzzlesListPage() {
  return (
    <>
      <div className="sec-banner sb-3">🔤 Word Puzzles</div>
      <section className="alt-bg6">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">Hidden Words</p>
          <h2 className="sec-title">Bible Word Searches</h2>
          <p className="sec-intro" style={{ marginBottom: 32 }}>
            Find the hidden Bible words in each grid. Click the first letter, then the last — and see if it&apos;s a match!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {wordPuzzles.map((puzzle, i) => {
              const color = PZ_COLORS[i % PZ_COLORS.length];
              return (
                <Link
                  key={puzzle.id}
                  href={`/puzzles/${puzzle.id}`}
                  className="puzzle-box block"
                  style={{ ["--pz-color" as string]: color, textDecoration: "none" }}
                >
                  <p className="puzzle-label">{puzzle.theme}</p>
                  <div style={{ fontSize: "3rem", marginBottom: 8 }}>{puzzle.emoji}</div>
                  <h3 style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1.1rem", color: "var(--text)", marginBottom: 6 }}>
                    {puzzle.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.88rem", color: "#555", lineHeight: 1.6, marginBottom: 10 }}>
                    {puzzle.description}
                  </p>
                  <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.8rem", color: color }}>
                    Find {puzzle.words.length} words
                  </span>
                  <div className="pz-btn" style={{ textAlign: "center", marginTop: 14 }}>
                    Play →
                  </div>
                </Link>
              );
            })}
          </div>

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "var(--fire)", textDecoration: "none" }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
