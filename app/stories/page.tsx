import Link from "next/link";
import { stories } from "@/data/stories";

const PZ_COLORS = ["#ff6b1a","#0a7090","#7030a0","#2a6a10","#c05010","#104f8a"];

export default function StoriesPage() {
  return (
    <>
      <div className="sec-banner sb-1">📖 Bible Stories</div>
      <section className="alt-bg">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">God&apos;s True Stories</p>
          <h2 className="sec-title">Amazing Stories from God&apos;s Word</h2>
          <p className="sec-intro" style={{ marginBottom: 32 }}>
            Every story in the Bible is true — and every one points to Jesus, the greatest story of all!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stories.map((story, i) => (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="puzzle-box block"
                style={{ ["--pz-color" as string]: PZ_COLORS[i % PZ_COLORS.length], textDecoration: "none" }}
              >
                <p className="puzzle-label">{story.reference}</p>
                <div style={{ fontSize: "3rem", marginBottom: 8 }}>{story.emoji}</div>
                <h3 style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1.15rem", color: "var(--text)", marginBottom: 6 }}>
                  {story.title}
                </h3>
                <p style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontSize: "0.88rem", color: "#555", lineHeight: 1.6, borderLeft: "3px solid var(--pz-color)", paddingLeft: 10 }}>
                  &ldquo;{story.bigTruth}&rdquo;
                </p>
                <div className="pz-btn" style={{ textAlign: "center", marginTop: 14 }}>
                  Read Story 📖
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
