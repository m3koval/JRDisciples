import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JR Disciples — Bible Learning for Kids",
  description: "Fun Bible stories, quizzes, puzzles, and verse memory for kids ages 6-10.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-amber-50">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="bg-blue-900 text-white text-center py-4 text-sm">
          <p>✝️ JR Disciples — Growing young hearts in God&apos;s Word</p>
        </footer>
      </body>
    </html>
  );
}
