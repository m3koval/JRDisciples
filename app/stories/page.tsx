'use client'

import Link from "next/link";
import { stories } from "@/data/stories";
import { storiesRu } from "@/data/stories-ru";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/useTranslation";
import { useState, useRef } from "react";
import { JrFullImageTile } from "@/components/JrFullImageTile";

const PZ_COLORS = ["#ff6b1a","#0a7090","#7030a0","#2a6a10","#c05010","#104f8a"];

export default function StoriesPage() {
  const { language } = useLanguage();
  const t = useTranslation();
  const currentStories = language === 'ru' ? storiesRu : stories;
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg,#c05010,#ff6b1a)", padding: "48px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, width: "100%", maxWidth: 800 }}>
            {!videoEnded ? (
              <video
                ref={videoRef}
                src="/videos/hero-story-main.mp4"
                autoPlay
                muted
                playsInline
                onEnded={() => setVideoEnded(true)}
                poster="/images/jr/bible-stories-hero.png"
                style={{ width: "100%", height: "auto", borderRadius: 16, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.25))", display: "block" }}
              />
            ) : (
              <img src="/images/jr/bible-stories-hero.png" alt="Bible Stories" style={{ width: "100%", height: "auto", borderRadius: 16, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.25))" }} />
            )}
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            {t.stories.title}
          </h1>
          <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, fontSize: "0.95rem", color: "rgba(255,255,255,.95)", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            {t.stories.subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="alt-bg">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">{language === 'ru' ? 'Истории из Писания' : 'Stories from Scripture'}</p>
          <h2 className="sec-title">{t.stories.heading}</h2>
          <p className="sec-intro" style={{ marginBottom: 32 }}>
            {t.stories.intro}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentStories.map((story, i) => (
              <JrFullImageTile
                key={story.id}
                href={`/stories/${story.id}`}
                image={story.image || "/images/jr/bible-stories.png"}
                title={story.title}
                label={story.reference}
                description={`“${story.bigTruth}”`}
                cta={`${t.stories.readStory} 📖`}
                color={PZ_COLORS[i % PZ_COLORS.length]}
              />
            ))}
          </div>

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "var(--fire)", textDecoration: "none" }}>
              ← {t.common.backHome}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
