import type { Metadata } from "next";
import { Cinzel_Decorative, Cormorant_Garamond, Lora, Nunito } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { LanguageProvider } from "@/context/LanguageContext";

const cinzel = Cinzel_Decorative({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-cormorant",
  display: "swap",
});

const lora = Lora({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-lora",
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "700", "800", "900"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JR Disciples — Bible Learning for Kids",
  description: "Fun Bible stories, quizzes, puzzles, and verse memory for kids ages 6–10.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${lora.variable} ${nunito.variable}`}>
      <body>
        <LanguageProvider>
          <NavBar />
          <main>{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
