import Link from "next/link";
import { rebusPuzzles } from "@/data/rebus";

const PZ_COLORS = ["#c05010","#0a7090","#2a6a10","#7030a0","#ff6b1a","#104f8a"];

export default function RebusListPage() {
  return (
    <>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg,#a04010,#c05010)", padding: "48px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, width: "100%", maxWidth: 800 }}>
            <img src="/images/jr/rebus-puzzles-hero.png" alt="Rebus Puzzles" style={{ width: "100%", height: "auto", borderRadius: 16, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.25))" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            Rebus Puzzles
          </h1>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "rgba(255,255,255,.95)", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            Picture Clues · Crack the Code
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="alt-bg5">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">Rebus Challenges</p>
          <h2 className="sec-title">Crack the Rebus Code!</h2>
          <p className="sec-intro" style={{ marginBottom: 32 }}>
            Each puzzle uses emojis and letters as clues. Add them together (or take some away!) to find the hidden Bible word!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rebusPuzzles.map((puzzle, i) => {
              const color = PZ_COLORS[i % PZ_COLORS.length];
              return (
                <Link
                  key={puzzle.id}
                  href={`/rebus/${puzzle.id}`}
                  className="puzzle-box block"
                  style={{ ["--pz-color" as string]: color, textDecoration: "none" }}
                >
                  <p className="puzzle-label">🧩 Rebus Puzzle</p>
                  <h3 style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1rem", color: "var(--text)", marginBottom: 10 }}>
                    {puzzle.title}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 12 }}>
                    {puzzle.clues.slice(0, 5).map((clue, j) => (
                      <span key={j} style={{ fontSize: clue.type === "emoji" ? "2rem" : "1.1rem", fontFamily: "var(--font-nunito)", fontWeight: 900, color: clue.type === "minus" ? "#c00" : "#555" }}>
                        {clue.type === "plus" ? "+" : clue.type === "minus" ? "−" : clue.type === "equals" ? "=" : clue.value}
                      </span>
                    ))}
                    <span style={{ fontSize: "1.1rem", color: "#ccc", fontWeight: 900 }}>= ?</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontSize: "0.82rem", color: "#888" }}>
                    Hint: {puzzle.hint}
                  </p>
                  <div className="pz-btn" style={{ textAlign: "center", marginTop: 14 }}>
                    Solve It! →
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
