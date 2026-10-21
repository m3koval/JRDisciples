import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import AppShell from "@/components/app/AppShell";
import { LanguageProvider } from "@/context/LanguageContext";

const isAppBuild = process.env.CAPACITOR_BUILD === "1";

// Bundled upstream fonts keep CI and offline app builds independent of Google CSS responses.
// Source URLs, hashes, and OFL licenses are retained in ./fonts.
const cinzel = localFont({
  src: [
    { path: "./fonts/cinzel-decorative-400-normal.ttf", weight: "400", style: "normal" },
    { path: "./fonts/cinzel-decorative-700-normal.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-600-normal.ttf", weight: "600", style: "normal" },
    { path: "./fonts/cormorant-garamond-700-normal.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

const lora = localFont({
  src: [
    { path: "./fonts/lora-400-normal.ttf", weight: "400", style: "normal" },
    { path: "./fonts/lora-600-normal.ttf", weight: "600", style: "normal" },
    { path: "./fonts/lora-400-italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/lora-600-italic.ttf", weight: "600", style: "italic" },
  ],
  variable: "--font-lora",
  display: "swap",
});

const nunito = localFont({
  src: [
    { path: "./fonts/nunito-400-normal.ttf", weight: "400", style: "normal" },
    { path: "./fonts/nunito-700-normal.ttf", weight: "700", style: "normal" },
    { path: "./fonts/nunito-800-normal.ttf", weight: "800", style: "normal" },
    { path: "./fonts/nunito-900-normal.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JR Disciples — Bible Learning for Kids",
  description: "Fun Bible stories, quizzes, puzzles, and verse memory for kids ages 6–10.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: isAppBuild ? "cover" : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-app-shell={isAppBuild ? "capacitor" : undefined}
      className={`${cinzel.variable} ${cormorant.variable} ${lora.variable} ${nunito.variable}`}
    >
      <body>
        <LanguageProvider>
          {isAppBuild ? (
            <AppShell>{children}</AppShell>
          ) : (
            <>
              <NavBar />
              <main>{children}</main>
              <SiteFooter />
            </>
          )}
        </LanguageProvider>
      </body>
    </html>
  );
}
