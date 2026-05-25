import type { Metadata } from "next";
import { Cinzel_Decorative, Lora, Nunito } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { LanguageProvider } from "@/context/LanguageContext";

const cinzel = Cinzel_Decorative({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const lora = Lora({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JR Disciples — Bible Learning for Kids",
  description: "Fun Bible stories, quizzes, puzzles, and verse memory for kids ages 6–10.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${lora.variable} ${nunito.variable}`}>
      <body>
        <LanguageProvider>
          <NavBar />
          <main>{children}</main>
          <footer style={{ background: "var(--deep)", color: "#fff" }} className="text-center py-5 text-sm">
            <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800 }}>
              ✝️ JR Disciples — Growing young hearts in God&apos;s Word
            </p>
            <p style={{ color: "var(--flame2)", fontSize: "0.75rem", marginTop: 4, fontFamily: "var(--font-nunito)" }}>
              &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo; — Psalm 119:105
            </p>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
