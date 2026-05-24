import Link from "next/link";
import { quizzes } from "@/data/quizzes";
import { stories } from "@/data/stories";

const PZ_COLORS = ["#ff6b1a","#0a7090","#7030a0","#2a6a10","#c05010","#104f8a"];

export default function QuizListPage() {
  return (
    <>
      <div className="sec-banner sb-2">❓ Bible Quizzes</div>
      <section className="alt-bg2">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">Test Your Knowledge</p>
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
