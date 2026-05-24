"use client";

import { useState, useRef } from "react";
import type { Quiz } from "@/data/quizzes";
import Link from "next/link";

interface Props { quiz: Quiz; pzColor: string; }

function launchConfetti() {
  const colors = ["#ff6b1a","#ffb347","#f0c040","#40b870","#7ec8e3","#c084fc","#f472b6","#fff"];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    const size = 6 + Math.random() * 8;
    Object.assign(el.style, {
      position: "fixed", top: "10%",
      left: Math.random() * 100 + "vw",
      width: size + "px", height: size + "px",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      background: colors[Math.floor(Math.random() * colors.length)],
      animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-in both`,
      animationDelay: Math.random() * 0.8 + "s",
      zIndex: 9999,
      pointerEvents: "none",
    });
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

export default function QuizGame({ quiz, pzColor }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  const question = quiz.questions[current];
  const total = quiz.questions.length;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === question.correctIndex) setScore((s) => s + 1);
    // trigger truth-banner pop-in
    requestAnimationFrame(() => {
      if (bannerRef.current) {
        bannerRef.current.classList.remove("show");
        void bannerRef.current.offsetWidth;
        bannerRef.current.classList.add("show");
      }
    });
  }

  function handleNext() {
    if (current + 1 >= total) {
      setComplete(true);
      setTimeout(launchConfetti, 200);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function handleRestart() {
    setCurrent(0); setSelected(null); setScore(0); setComplete(false);
  }

  if (complete) {
    const pct = Math.round((score / total) * 100);
    const msg =
      pct === 100 ? "PERFECT! You got every one! 🎉" :
      pct >= 80   ? "Amazing job! You know God's Word! ⭐" :
      pct >= 60   ? "Great effort! Keep reading the Bible! 📖" :
                    "Good try! Read the story again and come back! 💪";
    return (
      <div className="puzzle-box" style={{ ["--pz-color" as string]: pzColor, textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: 12 }}>{pct === 100 ? "🏆" : "⭐"}</div>
        <h2 style={{ fontFamily: "var(--font-cinzel)", fontSize: "1.6rem", color: "var(--deep)", marginBottom: 8 }}>
          {score}/{total} Correct!
        </h2>
        <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "1rem", color: "#444", marginBottom: 16 }}>{msg}</p>

        <div style={{ height: 12, background: "#eee", borderRadius: 6, overflow: "hidden", maxWidth: 280, margin: "0 auto 24px" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pzColor, borderRadius: 6, transition: "width 0.6s cubic-bezier(.34,1.56,.64,1)" }} />
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleRestart} className="pz-btn" style={{ width: "auto", padding: "10px 28px" }}>
            Try Again!
          </button>
          <Link href="/quiz" className="pz-btn" style={{ background: "var(--deep)", width: "auto", padding: "10px 28px", textDecoration: "none", display: "inline-block" }}>
            More Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const isCorrect = selected === question.correctIndex;

  return (
    <div className="puzzle-box" style={{ ["--pz-color" as string]: pzColor }}>
      {/* Progress dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p className="puzzle-label" style={{ margin: 0 }}>Question {current + 1} of {total}</p>
        <div style={{ display: "flex", gap: 5 }}>
          {quiz.questions.map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: "50%",
              background: i < current ? "#40b870" : i === current ? pzColor : "#ddd",
            }} />
          ))}
        </div>
      </div>

      <p className="puzzle-q">{question.question}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {question.options.map((opt, idx) => {
          let borderColor = "#e5e7eb";
          let bg = "#fafafa";
          let opacity = 1;
          if (selected !== null) {
            if (idx === question.correctIndex)  { borderColor = "#40b870"; bg = "#edfaf2"; }
            else if (idx === selected)           { borderColor = "#e53e3e"; bg = "#fff5f5"; }
            else                                 { opacity = 0.45; }
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{
              textAlign: "left", padding: "12px 16px",
              border: `2px solid ${borderColor}`, borderRadius: 14,
              background: bg, cursor: selected !== null ? "default" : "pointer",
              fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem",
              color: "#222", opacity, transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontWeight: 900, color: "#aaa", minWidth: 20 }}>{["A","B","C","D"][idx]}.</span>
              <span style={{ flex: 1 }}>{opt}</span>
              {selected !== null && idx === question.correctIndex && <span>✅</span>}
              {selected !== null && idx === selected && idx !== question.correctIndex && <span>❌</span>}
            </button>
          );
        })}
      </div>

      {/* Truth banner */}
      {selected !== null && (
        <div
          ref={bannerRef}
          className="truth-banner"
          style={{ background: isCorrect ? "#40b870" : "#e07020" }}
        >
          {isCorrect ? "🎉 Correct! " : "Not quite — "}
          {question.explanation}
        </div>
      )}

      {selected !== null && (
        <button onClick={handleNext} className="pz-btn">
          {current + 1 >= total ? "See My Score! 🏆" : "Next Question →"}
        </button>
      )}
    </div>
  );
}
