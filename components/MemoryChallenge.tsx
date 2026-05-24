"use client";

import { useState, useRef } from "react";
import type { MemoryVerse } from "@/data/memory-verses";
import Link from "next/link";

const PZ_COLOR = "#2a6a10";

function launchConfetti() {
  const colors = ["#ff6b1a","#ffb347","#f0c040","#40b870","#7ec8e3","#c084fc","#f472b6","#fff"];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    const size = 6 + Math.random() * 8;
    Object.assign(el.style, {
      position: "fixed", top: "15%",
      left: Math.random() * 100 + "vw",
      width: size + "px", height: size + "px",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      background: colors[Math.floor(Math.random() * colors.length)],
      animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-in both`,
      animationDelay: Math.random() * 0.6 + "s",
      zIndex: 9999, pointerEvents: "none",
    });
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

export default function MemoryChallenge({ verse }: { verse: MemoryVerse }) {
  const [stage, setStage] = useState<"read" | "practice" | "complete">("read");
  const words = verse.text.replace(/[.,;!?]/g, "").split(" ");
  const blankedIndexes = words.map((_, i) => i % 2 !== 0);
  const [inputs, setInputs] = useState<string[]>(words.map(() => ""));
  const [checked, setChecked] = useState<boolean[]>(words.map(() => false));
  const bannerRef = useRef<HTMLDivElement>(null);

  function handleCheck() {
    const results = words.map((word, i) =>
      !blankedIndexes[i] ? true : inputs[i].trim().toLowerCase() === word.toLowerCase()
    );
    setChecked(results);
    if (results.every(Boolean)) {
      setTimeout(() => {
        setStage("complete");
        launchConfetti();
        requestAnimationFrame(() => {
          if (bannerRef.current) {
            bannerRef.current.classList.remove("show");
            void bannerRef.current.offsetWidth;
            bannerRef.current.classList.add("show");
          }
        });
      }, 500);
    }
  }

  function handleRestart() {
    setStage("read");
    setInputs(words.map(() => ""));
    setChecked(words.map(() => false));
  }

  const allCorrect = checked.length > 0 && checked.every(Boolean);

  if (stage === "read") {
    return (
      <div className="puzzle-box" style={{ ["--pz-color" as string]: PZ_COLOR, textAlign: "center" }}>
        <p className="puzzle-label">Step 1 — Read the Verse</p>
        <blockquote style={{
          fontFamily: "var(--font-lora)", fontStyle: "italic",
          fontSize: "1.25rem", lineHeight: 1.75, color: "#222",
          margin: "12px 0", borderLeft: "4px solid var(--pz-color)",
          paddingLeft: 16, textAlign: "left",
        }}>
          &ldquo;{verse.text}&rdquo;
        </blockquote>
        <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "2px", textTransform: "uppercase", color: "#999", margin: "8px 0 20px" }}>
          — {verse.reference}
        </p>
        <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, color: "#666", fontSize: "0.9rem", marginBottom: 18 }}>
          Read it a few times until it feels familiar, then press the button!
        </p>
        <button onClick={() => setStage("practice")} className="pz-btn" style={{ maxWidth: 320, margin: "0 auto" }}>
          I&apos;m Ready to Practice! →
        </button>
      </div>
    );
  }

  if (stage === "complete") {
    return (
      <div className="puzzle-box" style={{ ["--pz-color" as string]: PZ_COLOR, textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontFamily: "var(--font-cinzel)", fontSize: "1.6rem", color: "var(--deep)", marginBottom: 8 }}>
          You did it!
        </h2>
        <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#444", marginBottom: 16 }}>
          You hid this verse in your heart! Keep saying it every day.
        </p>
        <div className="pull-quote" style={{ margin: "0 0 20px", textAlign: "left" }}>
          <p className="pq-text">&ldquo;{verse.text}&rdquo;</p>
          <span className="pq-ref">— {verse.reference}</span>
        </div>
        <div ref={bannerRef} className="truth-banner" style={{ background: "#40b870" }}>
          🌟 Well done! &ldquo;I have stored up your word in my heart.&rdquo;
          <span className="truth-verse">— Psalm 119:11</span>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
          <button onClick={handleRestart} className="pz-btn" style={{ width: "auto", padding: "10px 28px" }}>
            Practice Again
          </button>
          <Link href="/memory" className="pz-btn" style={{ background: "var(--deep)", width: "auto", padding: "10px 28px", textDecoration: "none", display: "inline-block" }}>
            More Verses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="puzzle-box" style={{ ["--pz-color" as string]: PZ_COLOR }}>
      <p className="puzzle-label">Step 2 — Fill in the Missing Words</p>
      <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, color: "#888", fontSize: "0.85rem", marginBottom: 16 }}>
        Every other word is hidden. Type the missing ones, then tap Check!
      </p>

      {/* Inline sentence with blanks */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 6px", alignItems: "flex-end", marginBottom: 20 }}>
        {words.map((word, i) => {
          if (!blankedIndexes[i]) {
            return (
              <span key={i} style={{ fontFamily: "var(--font-lora)", fontWeight: 700, fontSize: "1.1rem", color: "#333", paddingBottom: 2 }}>
                {word}
              </span>
            );
          }
          const isRight  = checked[i] && inputs[i].trim().toLowerCase() === word.toLowerCase();
          const isWrong  = checked[i] && inputs[i].trim().toLowerCase() !== word.toLowerCase();
          return (
            <input
              key={i}
              type="text"
              value={inputs[i]}
              onChange={(e) => {
                const n = [...inputs]; n[i] = e.target.value; setInputs(n);
              }}
              placeholder="___"
              style={{
                width: Math.max(60, word.length * 12) + "px",
                fontFamily: "var(--font-nunito)", fontWeight: 900,
                fontSize: "1rem", textAlign: "center",
                border: "none",
                borderBottom: `3px solid ${isRight ? "#40b870" : isWrong ? "#e53e3e" : PZ_COLOR}`,
                background: isRight ? "#edfaf2" : isWrong ? "#fff5f5" : "transparent",
                color: isRight ? "#1a5c30" : isWrong ? "#c00" : "var(--text)",
                outline: "none", padding: "2px 4px",
              }}
            />
          );
        })}
      </div>

      {!allCorrect && (
        <>
          <button onClick={handleCheck} className="pz-btn" style={{ maxWidth: 280, margin: "0 auto", display: "block" }}>
            Check! ✓
          </button>
          {checked.some(Boolean) && !allCorrect && (
            <p className="pz-error" style={{ textAlign: "center" }}>
              Some words aren&apos;t right yet — fix the red ones and try again!
            </p>
          )}
        </>
      )}

      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button onClick={handleRestart} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.8rem", color: "#bbb", textDecoration: "underline" }}>
          Start over
        </button>
      </div>
    </div>
  );
}
