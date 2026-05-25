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
    <nav style={{ background: "var(--deep)", position: "sticky", top: 0, zIndex: 100, borderBottom: "2px solid rgba(126,200,227,.15)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, minWidth: 0 }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "var(--font-cinzel)", fontWeight: 700,
          fontSize: "clamp(0.85rem, 4vw, 1.05rem)", color: "#fff",
          textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          <span>✝️</span> <span className="hidden sm:inline">JR Disciples</span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: "flex", gap: 0, listStyle: "none", margin: 0, padding: 0, overflow: "auto", scrollBehavior: "smooth" }} className="hidden lg:flex">
          {NavLinksContent({ t }).map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-nunito)", fontWeight: 900,
                    fontSize: "0.7rem", letterSpacing: "0.8px", textTransform: "uppercase",
                    color: active ? "#fff" : "rgba(255,255,255,.65)",
                    textDecoration: "none", padding: "6px 10px", borderRadius: 0,
                    display: "flex", alignItems: "center", gap: 3,
                    borderBottom: active ? "3px solid var(--flame2)" : "3px solid transparent",
                    transition: "color 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{link.emoji}</span>
                  <span className="hidden xl:inline">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Language selector */}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            style={{
              background: "rgba(255,255,255,.1)",
              border: "1px solid rgba(255,255,255,.3)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 20,
              cursor: "pointer",
              fontFamily: "var(--font-nunito)",
              fontWeight: 800,
              fontSize: "0.75rem",
              marginRight: 8,
            }}
          >
            {language === "en" ? "🇬🇧 EN" : "🇷🇺 РУ"}
          </button>
          {langOpen && (
            <div style={{
              position: "absolute",
              top: 40,
              right: 0,
              background: "#0a1a30",
              border: "1px solid rgba(255,255,255,.2)",
              borderRadius: 12,
              overflow: "hidden",
              zIndex: 50,
            }}>
              <button
                onClick={() => {
                  setLanguage("en");
                  setLangOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 16px",
                  background: language === "en" ? "rgba(255,255,255,.1)" : "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-nunito)",
                  fontWeight: 800,
                }}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => {
                  setLanguage("ru");
                  setLangOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 16px",
                  background: language === "ru" ? "rgba(255,255,255,.1)" : "none",
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,.1)",
                  color: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-nunito)",
                  fontWeight: 800,
                }}
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
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 4, marginLeft: "auto" }}
        >
          <div style={{ width: 22, height: 2, background: "#fff", borderRadius: 2 }} />
          <div style={{ width: 22, height: 2, background: "#fff", borderRadius: 2 }} />
          <div style={{ width: 22, height: 2, background: "#fff", borderRadius: 2 }} />
        </button>
      </div>

      {/* Mobile/tablet dropdown */}
      {open && (
        <div style={{ background: "#0a1a30", borderTop: "1px solid rgba(255,255,255,.08)", padding: "8px 16px 16px", maxHeight: "calc(100vh - 52px)", overflowY: "auto" }}>
          {NavLinksContent({ t }).map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontFamily: "var(--font-nunito)", fontWeight: 800,
                  fontSize: "clamp(0.85rem, 2vw, 0.95rem)", color: active ? "#fff" : "rgba(255,255,255,.65)",
                  textDecoration: "none", padding: "12px 8px",
                  borderLeft: active ? "3px solid var(--flame2)" : "3px solid transparent",
                  background: active ? "rgba(255,179,71,.12)" : "none",
                  borderRadius: 4,
                }}
              >
                <span>{link.emoji}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", marginTop: 8, paddingTop: 8 }}>
            <button
              onClick={() => {
                setLanguage("en");
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 8px",
                background: language === "en" ? "rgba(255,179,71,.12)" : "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-nunito)",
                fontWeight: 800,
                fontSize: "0.9rem",
                borderLeft: language === "en" ? "3px solid var(--flame2)" : "3px solid transparent",
                borderRadius: 4,
              }}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => {
                setLanguage("ru");
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 8px",
                background: language === "ru" ? "rgba(255,179,71,.12)" : "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-nunito)",
                fontWeight: 800,
                fontSize: "0.9rem",
                borderLeft: language === "ru" ? "3px solid var(--flame2)" : "3px solid transparent",
                borderRadius: 4,
                marginTop: 4,
              }}
            >
              🇷🇺 Русский
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
