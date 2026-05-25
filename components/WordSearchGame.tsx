"use client";

import { useState, useCallback } from "react";
import type { WordPuzzle } from "@/data/word-puzzles";
import Link from "next/link";

const PZ_COLOR = "#7030a0";

interface Cell { row: number; col: number; }
const key = (c: Cell) => `${c.row}-${c.col}`;

function getCellsBetween(a: Cell, b: Cell): Cell[] | null {
  const dr = b.row - a.row, dc = b.col - a.col;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  if (len === 0) return null;
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const sr = dr === 0 ? 0 : dr / Math.abs(dr);
  const sc = dc === 0 ? 0 : dc / Math.abs(dc);
  return Array.from({ length: len + 1 }, (_, i) => ({ row: a.row + sr * i, col: a.col + sc * i }));
}

function launchConfetti() {
  const colors = ["#ff6b1a","#ffb347","#f0c040","#40b870","#7ec8e3","#c084fc","#fff"];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    const size = 6 + Math.random() * 8;
    Object.assign(el.style, {
      position: "fixed", top: "10%", left: Math.random() * 100 + "vw",
      width: size + "px", height: size + "px",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      background: colors[Math.floor(Math.random() * colors.length)],
      animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-in both`,
      animationDelay: Math.random() * 0.6 + "s",
      zIndex: 9999, pointerEvents: "none",
    });
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

export default function WordSearchGame({ puzzle }: { puzzle: WordPuzzle }) {
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [hoverCell, setHoverCell] = useState<Cell | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [won, setWon] = useState(false);

  const previewKeys = new Set<string>();
  if (startCell && hoverCell) {
    getCellsBetween(startCell, hoverCell)?.forEach((c) => previewKeys.add(key(c)));
  }

  const handleClick = useCallback((cell: Cell) => {
    if (!startCell) { setStartCell(cell); return; }
    if (key(cell) === key(startCell)) { setStartCell(null); return; }

    const cells = getCellsBetween(startCell, cell);
    if (!cells) { setStartCell(cell); return; }

    const word = cells.map((c) => puzzle.grid[c.row][c.col]).join("");
    const rev  = word.split("").reverse().join("");
    const match = puzzle.words.find((w) => w === word || w === rev);

    if (match && !foundWords.has(match)) {
      const nw = new Set(foundWords); nw.add(match);
      const nc = new Set(foundCells); cells.forEach((c) => nc.add(key(c)));
      setFoundWords(nw); setFoundCells(nc);
      if (nw.size === puzzle.words.length) { setWon(true); setTimeout(launchConfetti, 100); }
    }
    setStartCell(null); setHoverCell(null);
  }, [startCell, foundWords, foundCells, puzzle]);

  if (won) {
    return (
      <div className="puzzle-box" style={{ ["--pz-color" as string]: PZ_COLOR, textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: 12 }}>🏆</div>
        <h2 style={{ fontFamily: "var(--font-cinzel)", fontSize: "1.6rem", color: "var(--deep)", marginBottom: 8 }}>
          You found them all!
        </h2>
        <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#444", marginBottom: 20 }}>
          Amazing! Every single word found!
        </p>
        <Link href="/puzzles" className="pz-btn" style={{ display: "inline-block", width: "auto", padding: "10px 28px", textDecoration: "none" }}>
          More Puzzles →
        </Link>
      </div>
    );
  }

  return (
    <div className="puzzle-box" style={{ ["--pz-color" as string]: PZ_COLOR }}>
      <p className="puzzle-label">🔍 Word Search</p>
      <p className="puzzle-q">
        {startCell ? "Now click the last letter of the word!" : "Click the first letter of a word to start!"}
      </p>

      {/* Word chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {puzzle.words.map((w) => (
          <span key={w} style={{
            fontFamily: "var(--font-nunito)", fontWeight: 900, fontSize: "0.82rem",
            padding: "4px 12px", borderRadius: 20, border: `2px solid ${foundWords.has(w) ? "#40b870" : "#ddd"}`,
            background: foundWords.has(w) ? "#edfaf2" : "#fafafa",
            color: foundWords.has(w) ? "#1a5c30" : "#555",
            textDecoration: foundWords.has(w) ? "line-through" : "none",
            transition: "all 0.2s",
          }}>{w}</span>
        ))}
      </div>

      <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.78rem", color: "#aaa", marginBottom: 10 }}>
        Found {foundWords.size} / {puzzle.words.length}
      </p>

      {/* Grid */}
      <div style={{ overflowX: "auto", touchAction: "pan-x" }}>
        <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
          <tbody>
            {puzzle.grid.map((row, r) => (
              <tr key={r}>
                {row.map((letter, c) => {
                  const k = `${r}-${c}`;
                  const isFound    = foundCells.has(k);
                  const isStart    = startCell && key(startCell) === k;
                  const isPreview  = previewKeys.has(k);
                  return (
                    <td key={c} style={{ padding: 1 }}>
                      <div
                        className={`word-cell${isFound ? " found" : isStart || isPreview ? " selected" : ""}`}
                        style={{ ["--pz-color" as string]: PZ_COLOR }}
                        onClick={() => handleClick({ row: r, col: c })}
                        onMouseEnter={() => startCell && setHoverCell({ row: r, col: c })}
                      >
                        {letter}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
