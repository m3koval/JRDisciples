import Link from "next/link";

type Activity = {
  href: string;
  title: string;
  desc: string;
  color: string;
  image?: string;
  emoji?: string;
};

const activities: Activity[] = [
  { href: "/stories",  image: "/images/jr/icon-stories.png",       title: "Bible Stories",  desc: "Read amazing true stories from God's Word!",            color: "#ff6b1a" },
  { href: "/quiz",     image: "/images/jr/icon-quizzes.png",        title: "Bible Quizzes",  desc: "Test what you know — earn stars!",                      color: "#0a7090" },
  { href: "/memory",   image: "/images/jr/icon-verse-memory.png",   title: "Verse Memory",   desc: "Hide God's Word in your heart!",                        color: "#2a6a10" },
  { href: "/puzzles",  image: "/images/jr/icon-word-puzzles.png",   title: "Word Puzzles",   desc: "Find hidden Bible words in the grid!",                  color: "#7030a0" },
  { href: "/rebus",    image: "/images/jr/icon-rebus-puzzles.png",  title: "Rebus Puzzles",  desc: "Solve picture clues to find Bible words!",              color: "#c05010" },
  { href: "/lessons",  emoji: "🕊️",                                title: "Lessons",        desc: "Explore Bible topics step by step — with challenges!",  color: "#0d3a6a" },
];

// Static star positions so they're consistent between server and client
const STARS = [
  { left: "5%",  top: "12%", delay: "0s",    dur: "2.1s" },
  { left: "15%", top: "28%", delay: "0.4s",  dur: "1.8s" },
  { left: "25%", top: "8%",  delay: "0.7s",  dur: "2.5s" },
  { left: "38%", top: "35%", delay: "1.1s",  dur: "1.9s" },
  { left: "50%", top: "15%", delay: "0.2s",  dur: "2.3s" },
  { left: "62%", top: "42%", delay: "0.9s",  dur: "2.0s" },
  { left: "72%", top: "10%", delay: "0.3s",  dur: "1.7s" },
  { left: "83%", top: "30%", delay: "1.4s",  dur: "2.2s" },
  { left: "91%", top: "20%", delay: "0.6s",  dur: "1.6s" },
  { left: "8%",  top: "60%", delay: "1.2s",  dur: "2.4s" },
  { left: "20%", top: "72%", delay: "0.5s",  dur: "1.9s" },
  { left: "33%", top: "55%", delay: "1.6s",  dur: "2.1s" },
  { left: "45%", top: "68%", delay: "0.8s",  dur: "2.0s" },
  { left: "57%", top: "80%", delay: "0.1s",  dur: "1.8s" },
  { left: "68%", top: "58%", delay: "1.3s",  dur: "2.5s" },
  { left: "78%", top: "74%", delay: "0.7s",  dur: "1.7s" },
  { left: "88%", top: "62%", delay: "1.0s",  dur: "2.3s" },
  { left: "95%", top: "45%", delay: "0.4s",  dur: "2.0s" },
  { left: "42%", top: "88%", delay: "1.5s",  dur: "1.6s" },
  { left: "60%", top: "92%", delay: "0.9s",  dur: "2.2s" },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        style={{ background: "var(--deep)", minHeight: "92vh", position: "relative", overflow: "hidden" }}
        className="flex flex-col items-center justify-center px-4 py-20 text-center"
      >
        {/* Stars */}
        {STARS.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute", left: s.left, top: s.top,
              width: 6, height: 6, borderRadius: "50%",
              background: "#fff",
              animation: `tw ${s.dur} ${s.delay} ease-in-out infinite`,
              opacity: 0.4,
            }}
          />
        ))}

        {/* Hero image */}
        <div style={{ position: "relative", marginBottom: 32, animation: "dove-float 3s ease-in-out infinite", zIndex: 10 }}>
          <img
            src="/images/jr/home-hero.png"
            alt="JR Disciples"
            style={{
              width: 240,
              height: 240,
              objectFit: "contain",
              filter: "drop-shadow(0 12px 40px rgba(126,200,227,.6))",
              borderRadius: 24,
            }}
          />
        </div>

        <h1 style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "clamp(2rem,7vw,3.5rem)",
          color: "#fff",
          textShadow: "0 0 24px rgba(126,200,227,.5)",
          marginBottom: 12,
          lineHeight: 1.15,
        }}>
          JR Disciples
        </h1>

        <p style={{
          fontFamily: "var(--font-nunito)", fontWeight: 800,
          fontSize: "clamp(0.9rem,3vw,1.1rem)",
          letterSpacing: "2px", textTransform: "uppercase",
          color: "var(--flame2)", marginBottom: 20,
        }}>
          Bible Learning for Kids
        </p>

        <blockquote style={{
          fontFamily: "var(--font-lora)", fontStyle: "italic",
          color: "rgba(255,255,255,.85)", fontSize: "1rem",
          borderLeft: "3px solid rgba(126,200,227,.7)",
          paddingLeft: 16, textAlign: "left",
          maxWidth: 420, lineHeight: 1.7,
        }}>
          &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
          <span style={{ display: "block", fontStyle: "normal", fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--flame2)", marginTop: 6 }}>
            — Psalm 119:105
          </span>
        </blockquote>

        <div style={{ position: "absolute", bottom: 20, animation: "dove-float 2s ease-in-out infinite" }}>
          <span style={{ color: "rgba(255,255,255,.4)", fontSize: "1.5rem" }}>↓</span>
        </div>
      </section>

      {/* ── Section banner ────────────────────────────────── */}
      <div className="sec-banner sb-1">⚡ Pick an Activity</div>

      {/* ── Activity cards ────────────────────────────────── */}
      <section className="alt-bg">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">Start Exploring</p>
          <h2 className="sec-title">What do you want to do today?</h2>
          <p className="sec-intro" style={{ marginBottom: 32 }}>
            Choose any activity below. Each one helps you learn more about God and His amazing Word!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activities.map((act) => (
              <Link
                key={act.href}
                href={act.href}
                className="puzzle-box block no-underline hover:no-underline"
                style={{ ["--pz-color" as string]: act.color, textDecoration: "none" }}
              >
                <p className="puzzle-label">Activity</p>
                <div style={{ height: 60, display: "flex", alignItems: "center", marginBottom: 8 }}>
                  {act.image ? (
                    <img src={act.image} alt={act.title} style={{ width: 56, height: 56, objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: "3rem" }}>{act.emoji}</span>
                  )}
                </div>
                <h3 style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1.2rem", color: "var(--text)", marginBottom: 6 }}>
                  {act.title}
                </h3>
                <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.9rem", color: "#555", lineHeight: 1.6 }}>
                  {act.desc}
                </p>
                <div className="pz-btn" style={{ marginTop: 14, textAlign: "center" }}>
                  Go! →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="divider"><div className="div-line"/><span className="div-icon">✝️</span><div className="div-line"/></div>

      {/* ── Pull quote ────────────────────────────────────── */}
      <section className="alt-bg3">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 18px" }}>
          <div className="pull-quote">
            <p className="pq-text">
              &ldquo;All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.&rdquo;
            </p>
            <span className="pq-ref">— 2 Timothy 3:16 (ESV)</span>
          </div>

          <div className="kid-note">
            💬 Ask a grown-up: What is your favorite Bible story? Why does it matter to you?
          </div>
        </div>
      </section>
    </>
  );
}
