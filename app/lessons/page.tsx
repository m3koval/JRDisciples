import Link from "next/link";

const topics = [
  {
    href: "/lessons/holy-spirit",
    image: "/images/jr/topic-holy-spirit.png",
    title: "The Holy Spirit",
    desc: "Who is He? His symbols, roles, fruit, gifts, and how to live with Him — 7 sections with interactive challenges!",
    color: "#0d3a6a",
    sections: 7,
  },
];

export default function LessonsPage() {
  return (
    <>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg,#0d3a6a,#1a5a9a)", padding: "48px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, width: "100%", maxWidth: 800 }}>
            <img src="/images/jr/lessons-hero.png" alt="Bible Lessons" style={{ width: "100%", height: "auto", borderRadius: 16, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.25))" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            Bible Lessons
          </h1>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "rgba(255,255,255,.95)", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            Deep Learning · One Section at a Time · Complete Challenges
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="alt-bg">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">Choose a Topic</p>
          <h2 className="sec-title">What do you want to learn?</h2>
          <p className="sec-intro" style={{ marginBottom: 8 }}>
            Each lesson is broken into sections. Complete the challenge in each section to unlock the next one!
          </p>
          <div className="kid-note" style={{ marginBottom: 32 }}>
            💡 Your progress is saved automatically — you can pick up right where you left off!
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="puzzle-box block no-underline hover:no-underline"
                style={{ ["--pz-color" as string]: topic.color, textDecoration: "none" }}
              >
                <p className="puzzle-label">Topic · {topic.sections} sections</p>
                <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  {topic.image ? (
                    <img src={topic.image} alt={topic.title} style={{ width: 80, height: 80, objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: "3.2rem" }}>{topic.emoji}</span>
                  )}
                </div>
                <h3 style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1.2rem", color: "var(--text)", marginBottom: 6 }}>
                  {topic.title}
                </h3>
                <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.9rem", color: "#555", lineHeight: 1.6 }}>
                  {topic.desc}
                </p>
                <div className="pz-btn" style={{ marginTop: 14, textAlign: "center" }}>
                  Start! →
                </div>
              </Link>
            ))}
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
