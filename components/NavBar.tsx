"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation, type Translations } from "@/lib/useTranslation";

function navLinks(t: Translations) {
  return [
    { href: "/",        label: t.nav.home },
    { href: "/stories", label: t.nav.stories },
    { href: "/quiz",    label: t.nav.quizzes },
    { href: "/memory",  label: t.nav.memory },
    { href: "/puzzles", label: t.nav.puzzles },
    { href: "/rebus",   label: t.nav.rebus },
    { href: "/quests",  label: t.nav.quests },
    { href: "/lessons", label: t.nav.lessons },
  ];
}

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
          <span aria-hidden="true" style={{
            display: "inline-grid", placeItems: "center", width: 34, height: 34,
            borderRadius: 12, background: "linear-gradient(135deg,var(--flame2),#ffd866)",
            color: "var(--deep)", fontFamily: "var(--font-nunito)", fontWeight: 1000,
            fontSize: "0.78rem", letterSpacing: "-0.5px", boxShadow: "0 6px 18px rgba(255,216,102,.22)",
          }}>JD</span>
          <span className="hidden sm:inline" style={{ letterSpacing: "-0.5px" }}>JR Disciples</span>
        </Link>

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
              <span>{language === "en" ? "EN" : "РУ"}</span>
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
                  English
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
                  Русский
                </button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
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
              width: 44,
              height: 44,
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
        <div style={{ background: "#0a1a30", borderTop: "1px solid rgba(255,255,255,.08)", padding: "8px 16px 16px", maxHeight: "calc(100vh - 52px)", overflowY: "auto" }}>
          {navLinks(t).map((link) => {
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
                <span aria-hidden="true" style={{
                  width: 10, height: 10, borderRadius: 999,
                  background: active ? "var(--flame2)" : "rgba(126,200,227,.55)",
                  boxShadow: active ? "0 0 16px rgba(255,216,102,.55)" : "none",
                  flexShrink: 0,
                }} />
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
