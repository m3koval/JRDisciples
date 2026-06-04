"use client";

import { useState, useRef } from "react";
import type { RebusPuzzle } from "@/data/rebus";
import Link from "next/link";

function launchConfetti() {
  const colors = ["#ff6b1a","#ffb347","#f0c040","#40b870","#7ec8e3","#c084fc","#f472b6","#fff"];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    const size = 6 + Math.random() * 8;
    Object.assign(el.style, {
      position: "fixed", top: "20%",
      left: Math.random() * 100 + "vw",
      width: size + "px", height: size + "px",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      background: colors[Math.floor(Math.random() * colors.length)],
      animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-in both`,
      animationDelay: Math.random() * 0.5 + "s",
      zIndex: 9999, pointerEvents: "none",
    });
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

const PZ_COLOR = "#c05010";

export default function RebusCard({ puzzle }: { puzzle: RebusPuzzle }) {
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [shaking, setShaking] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  function handleCheck() {
    if (input.trim().toUpperCase() === puzzle.answer.toUpperCase()) {
      setSolved(true);
      launchConfetti();
      requestAnimationFrame(() => {
        if (bannerRef.current) {
          bannerRef.current.classList.remove("show");
          void bannerRef.current.offsetWidth;
          bannerRef.current.classList.add("show");
        }
      });
    } else {
      setAttempts((a) => a + 1);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div className="puzzle-box" style={{ ["--pz-color" as string]: PZ_COLOR }}>
      <p className="puzzle-label">🧩 Rebus Puzzle</p>
      <p className="puzzle-q">{puzzle.title} — what Bible word do the clues spell?</p>

      {/* Clue display */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "center", gap: 10,
        background: "#fdf3e8", borderRadius: 16, padding: "20px 16px", marginBottom: 20,
      }}>
        {puzzle.clues.map((clue, i) => {
          if (clue.type === "emoji") return (
            <span key={i} style={{ fontSize: "3rem", lineHeight: 1, fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif" }}>{clue.value}</span>
          );
          if (clue.type === "plus")  return <span key={i} style={{ fontSize: "1.8rem", fontWeight: 900, color: "#888" }}>+</span>;
          if (clue.type === "minus") return <span key={i} style={{ fontSize: "1.8rem", fontWeight: 900, color: "#c00" }}>−</span>;
          if (clue.type === "equals") return <span key={i} style={{ fontSize: "1.8rem", fontWeight: 900, color: "#888" }}>=</span>;
          // text
          return (
            <span key={i} style={{
              fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1.2rem",
              background: "#fff", border: "2px solid #ddd", borderRadius: 10,
              padding: "4px 10px", color: "#333",
            }}>{clue.value}</span>
          );
        })}
        <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "#888" }}>=</span>
        <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1.6rem", color: "#ccc" }}>?</span>
      </div>

      {!solved && (
        <>
          <div className={`flex flex-wrap gap-2 ${shaking ? "shake" : ""}`} style={{ marginBottom: 8 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="Type your answer..."
              style={{
                flex: "1 1 160px", border: `2px solid ${shaking ? "#c00" : "#ddd"}`,
                borderRadius: 12, padding: "12px 16px", minHeight: 48,
                fontFamily: "var(--font-nunito)", fontWeight: 900,
                fontSize: "1rem", textTransform: "uppercase",
                outline: "none", color: "var(--text)",
              }}
            />
            <button onClick={handleCheck} className="pz-btn" style={{ flex: "1 1 auto", margin: 0, borderRadius: 12, padding: "0 20px", minHeight: 48 }}>
              Check!
            </button>
          </div>

          {attempts > 0 && (
            <p className="pz-error">
              {attempts === 1 ? "Not quite — try again! 💪" :
               attempts === 2 ? "Keep going! Maybe try the hint!" :
               "The hint below will help!"}
            </p>
          )}

          <div style={{ textAlign: "center", marginTop: 10 }}>
            <button
              onClick={() => setShowHint(!showHint)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.82rem", color: "#aaa", textDecoration: "underline" }}
            >
              {showHint ? "Hide hint" : "Show hint 💭"}
            </button>
            {showHint && (
              <p className="pz-hint" style={{ marginTop: 8, color: "#888", fontStyle: "italic" }}>
                Hint: {puzzle.hint}
              </p>
            )}
          </div>
        </>
      )}

      {/* Truth banner — shown when solved */}
      <div
        ref={bannerRef}
        className="truth-banner"
        style={{ background: "#40b870" }}
      >
        🎊 Yes! The answer is <strong>{puzzle.answer}</strong>!
        <span className="truth-verse">{puzzle.hint}</span>
      </div>

      {solved && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/rebus" className="pz-btn" style={{ display: "inline-block", width: "auto", padding: "10px 28px", textDecoration: "none" }}>
            Try Another Puzzle →
          </Link>
        </div>
      )}
    </div>
  );
}
