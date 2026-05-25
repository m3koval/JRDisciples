"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/lib/useTranslation";

function NavLinksContent({ t }: { t: any }) {
  return [
    { href: "/",        label: t.nav.home,    emoji: "🏠" },
    { href: "/stories", label: t.nav.stories, emoji: "📖" },
    { href: "/quiz",    label: t.nav.quizzes, emoji: "❓" },
    { href: "/memory",  label: t.nav.memory,  emoji: "💡" },
    { href: "/puzzles", label: t.nav.puzzles, emoji: "🔤" },
    { href: "/rebus",   label: t.nav.rebus,   emoji: "🧩" },
    { href: "/lessons", label: t.nav.lessons, emoji: "🕊️" },
  ];
}

const links = [
  { href: "/",        emoji: "🏠" },
  { href: "/stories", emoji: "📖" },
  { href: "/quiz",    emoji: "❓" },
  { href: "/memory",  emoji: "💡" },
  { href: "/puzzles", emoji: "🔤" },
  { href: "/rebus",   emoji: "🧩" },
  { href: "/lessons", emoji: "🕊️" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();

  return (
    <nav style={{ background: "var(--deep)", position: "sticky", top: 0, zIndex: 100, borderBottom: "3px solid var(--flame2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, gap: 16 }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "var(--font-cinzel)", fontWeight: 700,
          fontSize: "clamp(0.95rem, 3vw, 1.2rem)", color: "#fff",
          textDecoration: "none", display: "flex", alignItems: "center", gap: 10,
          whiteSpace: "nowrap", flexShrink: 0, transition: "opacity 0.2s",
        }}>
          <span style={{ fontSize: "1.4rem" }}>✝️</span>
          <span className="hidden sm:inline" style={{ letterSpacing: "-0.5px" }}>JR Disciples</span>
        </Link>

        {/* Desktop links - center */}
        <ul style={{ display: "none", gap: 0, listStyle: "none", margin: 0, padding: 0, flex: 1, justifyContent: "center" }} className="lg:flex">
          {NavLinksContent({ t }).map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-nunito)", fontWeight: 900,
                    fontSize: "0.75rem", letterSpacing: "0.9px", textTransform: "uppercase",
                    color: active ? "var(--flame2)" : "rgba(255,255,255,.75)",
                    textDecoration: "none", padding: "8px 14px", borderRadius: 6,
                    display: "flex", alignItems: "center", gap: 6,
                    borderBottom: active ? "3px solid var(--flame2)" : "3px solid transparent",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--flame2)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = active ? "var(--flame2)" : "rgba(255,255,255,.75)"}
                >
                  <span>{link.emoji}</span>
                  <span className="hidden xl:inline">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Spacer for flex alignment */}
        <div style={{ flex: 1, display: "none" }} className="lg:block" />

        {/* Right side: Language + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
          {/* Language selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                background: language === "en" ? "rgba(126,200,227,.15)" : "rgba(255,107,26,.15)",
                border: language === "en" ? "2px solid rgba(126,200,227,.3)" : "2px solid rgba(255,107,26,.3)",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: 16,
                cursor: "pointer",
                fontFamily: "var(--font-nunito)",
                fontWeight: 800,
                fontSize: "0.8rem",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              <span>{language === "en" ? "🇬🇧" : "🇷🇺"}</span>
              <span className="hidden sm:inline">{language === "en" ? "EN" : "РУ"}</span>
            </button>
            {langOpen && (
              <div style={{
                position: "absolute",
                top: 44,
                right: 0,
                background: "#0a1a30",
                border: "2px solid rgba(255,255,255,.15)",
                borderRadius: 12,
                overflow: "hidden",
                zIndex: 50,
                boxShadow: "0 8px 32px rgba(0,0,0,.3)",
              }}>
                <button
                  onClick={() => {
                    setLanguage("en");
                    setLangOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 18px",
                    background: language === "en" ? "rgba(126,200,227,.15)" : "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-nunito)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => language !== "en" && (e.currentTarget.style.background = "rgba(126,200,227,.1)")}
                  onMouseLeave={(e) => language !== "en" && (e.currentTarget.style.background = "none")}
                >
                  🇬🇧 English
                </button>
                <div style={{ borderTop: "1px solid rgba(255,255,255,.1)" }} />
                <button
                  onClick={() => {
                    setLanguage("ru");
                    setLangOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 18px",
                    background: language === "ru" ? "rgba(255,107,26,.15)" : "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-nunito)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => language !== "ru" && (e.currentTarget.style.background = "rgba(255,107,26,.1)")}
                  onMouseLeave={(e) => language !== "ru" && (e.currentTarget.style.background = "none")}
                >
                  🇷🇺 Русский
                </button>
              </div>
            )}
          </div>

          {/* Mobile/tablet hamburger */}
          <button
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            style={{
              background: open ? "rgba(255,107,26,.15)" : "none",
              border: "2px solid rgba(255,255,255,.2)",
              cursor: "pointer",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 5,
              borderRadius: 8,
              transition: "all 0.2s",
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: 20, height: 2.5, background: "#fff", borderRadius: 2, transition: "all 0.3s", transform: open ? "rotate(45deg) translateY(8px)" : "rotate(0)" }} />
            <div style={{ width: 20, height: 2.5, background: "#fff", borderRadius: 2, transition: "opacity 0.3s", opacity: open ? 0 : 1 }} />
            <div style={{ width: 20, height: 2.5, background: "#fff", borderRadius: 2, transition: "all 0.3s", transform: open ? "rotate(-45deg) translateY(-8px)" : "rotate(0)" }} />
          </button>
        </div>
      </div>

      {/* Mobile/tablet dropdown */}
      {open && (
        <div style={{
          background: "linear-gradient(135deg, #0a1a30 0%, #0d2a45 100%)",
          borderTop: "2px solid var(--flame2)",
          padding: "12px 18px 18px",
          maxHeight: "calc(100vh - 60px)",
          overflowY: "auto",
          animation: "slideDown 0.3s ease-out",
        }}>
          {NavLinksContent({ t }).map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  fontFamily: "var(--font-nunito)", fontWeight: 800,
                  fontSize: "clamp(0.9rem, 2vw, 1rem)",
                  color: active ? "var(--flame2)" : "rgba(255,255,255,.8)",
                  textDecoration: "none", padding: "14px 12px",
                  borderLeft: active ? "4px solid var(--flame2)" : "4px solid transparent",
                  background: active ? "rgba(255,107,26,.1)" : "none",
                  borderRadius: 6,
                  marginBottom: 4,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => !active && (e.currentTarget.style.background = "rgba(255,255,255,.05)")}
                onMouseLeave={(e) => !active && (e.currentTarget.style.background = "none")}
              >
                <span style={{ fontSize: "1.2rem" }}>{link.emoji}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}
