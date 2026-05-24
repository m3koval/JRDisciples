"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/stories", label: "Stories", emoji: "📖" },
  { href: "/quiz", label: "Quizzes", emoji: "❓" },
  { href: "/memory", label: "Memory", emoji: "💡" },
  { href: "/puzzles", label: "Puzzles", emoji: "🔤" },
  { href: "/rebus", label: "Rebus", emoji: "🧩" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-blue-900 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
          <span>✝️</span>
          <span>JR Disciples</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-1">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    active
                      ? "bg-white text-blue-900"
                      : "text-blue-100 hover:bg-blue-700"
                  }`}
                >
                  <span>{link.emoji}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-blue-800 px-4 pb-4">
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      active ? "bg-white text-blue-900" : "text-blue-100 hover:bg-blue-700"
                    }`}
                  >
                    <span>{link.emoji}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
