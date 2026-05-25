import Link from "next/link";
import { memoryVerses } from "@/data/memory-verses";

const PZ_COLORS = ["#2a6a10","#0a7090","#ff6b1a","#7030a0","#c05010","#104f8a","#40b870","#7030a0"];

export default function MemoryListPage() {
  return (
    <>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg,#1a6a30,#2a8a40)", padding: "48px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, width: "100%", maxWidth: 800 }}>
            <img src="/images/jr/verse-memory-hero.png" alt="Verse Memory" style={{ width: "100%", height: "auto", borderRadius: 16, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.25))" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            Verse Memory
          </h1>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "rgba(255,255,255,.95)", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            Hide It in Your Heart · Learn Scripture
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="alt-bg4">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">God&apos;s Word Treasured</p>
          <h2 className="sec-title">Memorize God&apos;s Word</h2>
          <p className="sec-intro" style={{ marginBottom: 8 }}>
            &ldquo;I have stored up your word in my heart, that I might not sin against you.&rdquo;
          </p>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--fire)", marginBottom: 32 }}>
            — Psalm 119:11
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {memoryVerses.map((verse, i) => {
              const color = PZ_COLORS[i % PZ_COLORS.length];
              return (
                <Link
                  key={verse.id}
                  href={`/memory/${verse.id}`}
                  className="puzzle-box"
                  style={{ ["--pz-color" as string]: color, textDecoration: "none", display: "flex", alignItems: "flex-start", gap: 14 }}
                >
                  <div style={{ fontSize: "2.5rem", lineHeight: 1, flexShrink: 0 }}>{verse.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1.05rem", color: "var(--text)", margin: 0 }}>
                        {verse.reference}
                      </h3>
                      <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "1px", color: color, background: "#f8f8f8", borderRadius: 20, padding: "2px 8px" }}>
                        {verse.theme}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontSize: "0.9rem", color: "#555", lineHeight: 1.6, margin: "0 0 8px" }}>
                      &ldquo;{verse.text}&rdquo;
                    </p>
                    <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "0.82rem", color: color }}>
                      Practice Now →
                    </span>
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
