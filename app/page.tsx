'use client'

import Link from "next/link";
import { useState, useRef } from "react";
import { useTranslation } from "@/lib/useTranslation";

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
  const t = useTranslation();
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        style={{ background: "var(--deep)", position: "relative", overflow: "hidden" }}
        className="flex flex-col items-center text-center"
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
              zIndex: 2,
            }}
          />
        ))}

        {/* Video — inline block, full width, natural aspect ratio, no cropping */}
        {!videoEnded && (
          <video
            ref={videoRef}
            src="/videos/hero-main.mp4"
            autoPlay
            muted
            playsInline
            onEnded={() => setVideoEnded(true)}
            style={{
              width: "min(100%, 1280px)",
              height: "auto",
              display: "block",
              margin: "24px auto 0",
              borderRadius: "0 0 28px 28px",
              boxShadow: "0 24px 80px rgba(0,0,0,.28)",
              position: "relative",
              zIndex: 10,
            }}
          />
        )}

        {/* Hero image — shown after video ends; match video size to avoid layout shrink */}
        {videoEnded && (
          <img
            src="/images/jr/home-hero.png"
            alt="JR Disciples"
            style={{
              width: "min(100%, 1280px)",
              aspectRatio: "16 / 9",
              height: "auto",
              display: "block",
              margin: "24px auto 0",
              objectFit: "cover",
              borderRadius: "0 0 28px 28px",
              boxShadow: "0 24px 80px rgba(0,0,0,.28)",
              position: "relative",
              zIndex: 10,
            }}
          />
        )}

        {/* Title, subtitle, quote — flow below video/image */}
        <div style={{ position: "relative", zIndex: 10, padding: "20px 24px 16px", maxWidth: 560 }}>
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
            {t.home.subtitle}
          </p>

          <blockquote style={{
            fontFamily: "var(--font-lora)", fontStyle: "italic",
            color: "rgba(255,255,255,.85)", fontSize: "1rem",
            borderLeft: "3px solid rgba(126,200,227,.7)",
            paddingLeft: 16, textAlign: "left",
            lineHeight: 1.7,
          }}>
            &ldquo;{t.home.quote}&rdquo;
            <span style={{ display: "block", fontStyle: "normal", fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--flame2)", marginTop: 6 }}>
              — {t.home.psalmRef}
            </span>
          </blockquote>
        </div>

        <div style={{ paddingBottom: 28, animation: "dove-float 2s ease-in-out infinite", position: "relative", zIndex: 10 }}>
          <span style={{ color: "rgba(255,255,255,.4)", fontSize: "1.5rem" }}>↓</span>
        </div>
      </section>

      {/* ── Section banner ────────────────────────────────── */}
      <div className="sec-banner sb-1">{t.home.pickActivity}</div>

      {/* ── Activity cards ────────────────────────────────── */}
      <section className="alt-bg">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 18px 52px" }}>
          <p className="eyebrow">{t.home.startExploring}</p>
          <h2 className="sec-title">{t.home.whatToDo}</h2>
          <p className="sec-intro" style={{ marginBottom: 32 }}>
            {t.home.chooseActivity}
          </p>

          <div className="puzzle-box" style={{ ["--pz-color" as string]: "#0a7090", marginBottom: 28 }}>
            <p className="puzzle-label">{t.home.learningPathsEyebrow}</p>
            <h3 style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "1.35rem", color: "var(--text)", marginBottom: 8 }}>
              {t.home.learningPathsTitle}
            </h3>
            <p style={{ fontFamily: "var(--font-lora)", color: "#555", lineHeight: 1.65, marginBottom: 18 }}>
              {t.home.learningPathsIntro}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { href: "/stories", title: t.home.kidsPathTitle, desc: t.home.kidsPathDesc, color: "#ff6b1a", step: "1" },
                { href: "/quests", title: t.home.familyPathTitle, desc: t.home.familyPathDesc, color: "#2a6a10", step: "2" },
                { href: "/lessons", title: t.home.classPathTitle, desc: t.home.classPathDesc, color: "#0d3a6a", step: "3" },
              ].map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="block no-underline hover:no-underline"
                  style={{ border: `2px solid ${path.color}`, borderRadius: 18, padding: 16, background: "#fff", textDecoration: "none" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: 999, background: path.color, color: "#fff", display: "grid", placeItems: "center", fontFamily: "var(--font-nunito)", fontWeight: 950 }}>
                      {path.step}
                    </span>
                    <h4 style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, color: path.color, margin: 0 }}>
                      {path.title}
                    </h4>
                  </div>
                  <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.88rem", color: "#555", lineHeight: 1.55, marginBottom: 12 }}>
                    {path.desc}
                  </p>
                  <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 900, color: path.color }}>
                    {t.home.startPath} →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { href: "/stories", image: "/images/jr/bible-stories.png", title: t.activities.stories, desc: t.activities.storiesDesc, color: "#ff6b1a" },
              { href: "/quiz", image: "/images/jr/bible-quizzes.png", title: t.activities.quizzes, desc: t.activities.quizzesDesc, color: "#0a7090" },
              { href: "/memory", image: "/images/jr/verse-memory.png", title: t.activities.memory, desc: t.activities.memoryDesc, color: "#2a6a10" },
              { href: "/puzzles", image: "/images/jr/word-puzzles.png", title: t.activities.puzzles, desc: t.activities.puzzlesDesc, color: "#7030a0" },
              { href: "/rebus", image: "/images/jr/rebus-puzzles.png", title: t.activities.rebus, desc: t.activities.rebusDesc, color: "#c05010" },
              { href: "/lessons", image: "/images/jr/lessons-hero.png", title: t.activities.lessons, desc: t.activities.lessonsDesc, color: "#0d3a6a" },
            ].map((act) => (
              <Link
                key={act.href}
                href={act.href}
                className="block no-underline hover:no-underline"
                style={{
                  position: "relative",
                  minHeight: 245,
                  borderRadius: 26,
                  overflow: "hidden",
                  border: `3px solid ${act.color}`,
                  boxShadow: "0 18px 46px rgba(13,31,60,.18)",
                  background: "#0d1f3c",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <img
                  src={act.image}
                  alt={act.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.03)" }}
                />
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(7,18,36,.1),rgba(7,18,36,.3) 38%,rgba(7,18,36,.9))" }} />
                <div style={{ position: "relative", zIndex: 1, minHeight: 245, padding: 18, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <p className="puzzle-label" style={{ color: "#ffd866", marginBottom: 8 }}>{t.common.section}</p>
                  <h3 style={{ fontFamily: "var(--font-nunito)", fontWeight: 950, fontSize: "1.35rem", color: "#fff", lineHeight: 1.1, marginBottom: 8, textShadow: "0 8px 24px rgba(0,0,0,.38)" }}>
                    {act.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.92rem", fontWeight: 700, color: "rgba(255,255,255,.94)", lineHeight: 1.55, marginBottom: 14 }}>
                    {act.desc}
                  </p>
                  <span style={{ alignSelf: "flex-start", borderRadius: 999, padding: "9px 15px", background: act.color, color: "#fff", fontFamily: "var(--font-nunito)", fontWeight: 1000, boxShadow: "0 10px 24px rgba(0,0,0,.2)" }}>
                    {t.home.activityCta} →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/quests"
            className="block no-underline hover:no-underline"
            style={{
              position: "relative",
              marginTop: 6,
              borderRadius: 30,
              overflow: "hidden",
              minHeight: 300,
              display: "grid",
              alignItems: "stretch",
              border: "4px solid rgba(255,216,102,.82)",
              boxShadow: "0 24px 70px rgba(13,31,60,.22)",
              background: "#0d1f3c",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src="/images/jr/quests/quest-hub-map.png"
              alt={t.home.questsMapAlt}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scale(1.03)",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 72% 36%,rgba(255,216,102,.25),transparent 30%), linear-gradient(90deg,rgba(8,20,40,.92),rgba(8,20,40,.62) 48%,rgba(8,20,40,.2))",
              }}
            />
            <div style={{ position: "relative", zIndex: 1, padding: "clamp(24px,5vw,44px)", maxWidth: 580 }}>
              <p className="puzzle-label" style={{ color: "#ffd866", marginBottom: 10 }}>{t.home.featuredAdventure}</p>
              <h3 style={{
                fontFamily: "var(--font-cinzel)",
                fontWeight: 700,
                fontSize: "clamp(2rem,7vw,4rem)",
                color: "#fff",
                lineHeight: 1,
                marginBottom: 14,
                textShadow: "0 10px 34px rgba(0,0,0,.35)",
              }}>
                {t.activities.quests}
              </h3>
              <p style={{
                fontFamily: "var(--font-lora)",
                color: "rgba(255,255,255,.92)",
                fontWeight: 700,
                fontSize: "1.03rem",
                lineHeight: 1.75,
                maxWidth: 520,
              }}>
                {t.activities.questsDesc}
              </p>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                marginTop: 20,
              }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 52,
                  borderRadius: 999,
                  padding: "0 24px",
                  background: "linear-gradient(180deg,#6366f1,#4338ca)",
                  color: "#fff",
                  fontFamily: "var(--font-nunito)",
                  fontWeight: 1000,
                  boxShadow: "0 14px 30px rgba(79,70,229,.34)",
                }}>
                  {t.home.startBibleQuests} →
                </span>
                <span style={{
                  display: "inline-flex",
                  minHeight: 40,
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "0 14px",
                  background: "rgba(255,255,255,.92)",
                  color: "#7c2d12",
                  fontFamily: "var(--font-nunito)",
                  fontWeight: 1000,
                  fontSize: ".82rem",
                }}>
                  {t.home.playableNow}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="divider"><div className="div-line"/><span className="div-icon" aria-hidden="true"/><div className="div-line"/></div>

      {/* ── Pull quote ────────────────────────────────────── */}
      <section className="alt-bg3">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 18px" }}>
          <div className="pull-quote">
            <p className="pq-text">
              &ldquo;{t.home.pullQuote}&rdquo;
            </p>
            <span className="pq-ref">— {t.home.pullQuoteRef}</span>
          </div>

          <div className="kid-note">
            {t.home.kidNote}
          </div>
        </div>
      </section>
    </>
  );
}
