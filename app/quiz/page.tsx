import Link from "next/link";
import { quizzes } from "@/data/quizzes";
import { stories } from "@/data/stories";

const PZ_COLORS = ["#ff6b1a","#0a7090","#7030a0","#2a6a10","#c05010","#104f8a"];

export default function QuizListPage() {
  return (
    <>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg,#0a5090,#0a7090)", padding: "48px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, width: "100%", maxWidth: 800 }}>
            <img src="/images/jr/bible-quizzes-hero.png" alt="Bible Quizzes" style={{ width: "100%", height: "auto", borderRadius: 16, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.25))" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            Bible Quizzes
          </h1>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "rgba(255,255,255,.95)", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            Test Your Knowledge · 5 Questions Each
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="alt-bg2">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">Challenge Yourself</p>
          <h2 className="sec-title">How Well Do You Know God&apos;s Word?</h2>
          <p className="sec-intro" style={{ marginBottom: 32 }}>
            Each quiz has 5 questions about a Bible story. See how many you get right!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz, i) => {
              const story = stories.find((s) => s.id === quiz.storyId);
              const color = PZ_COLORS[i % PZ_COLORS.length];
              return (
                <Link
                  key={quiz.id}
                  href={`/quiz/${quiz.id}`}
                  className="puzzle-box block"
                  style={{ ["--pz-color" as string]: color, textDecoration: "none" }}
                >
                  <p className="puzzle-label">{story?.reference ?? "Bible Quiz"}</p>
                  <div style={{ fontSize: "3rem", marginBottom: 8 }}>{quiz.emoji}</div>
                  <h3 style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1.1rem", color: "var(--text)", marginBottom: 6 }}>
                    {quiz.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.8rem", color: color, background: "#f8f8f8", borderRadius: 20, padding: "3px 10px", display: "inline-block" }}>
                    5 Questions · Earn a ⭐
                  </p>
                  <div className="pz-btn" style={{ textAlign: "center", marginTop: 14 }}>
                    Start Quiz →
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
