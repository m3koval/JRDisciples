"use client";

import { useLanguage } from "@/context/LanguageContext";

const copy = {
  en: {
    tagline: "JR Disciples — Growing young hearts in God's Word",
    verse: "“Your word is a lamp to my feet and a light to my path.” — Psalm 119:105",
  },
  ru: {
    tagline: "JR Disciples — помогаем детям расти в Божьем Слове",
    verse: "«Слово Твоё — светильник ноге моей и свет стезе моей». — Псалом 118:105",
  },
};

export default function SiteFooter() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <footer style={{ background: "var(--deep)", color: "#fff" }} className="text-center py-5 text-sm">
      <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800 }}>
        {t.tagline}
      </p>
      <p style={{ color: "var(--flame2)", fontSize: "0.75rem", marginTop: 4, fontFamily: "var(--font-nunito)" }}>
        {t.verse}
      </p>
    </footer>
  );
}
