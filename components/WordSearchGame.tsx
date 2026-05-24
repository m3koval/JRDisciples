"use client";

import { useState, useCallback } from "react";
import type { WordPuzzle } from "@/data/word-puzzles";
import Link from "next/link";

interface Cell {
  row: number;
  col: number;
}

function cellKey(c: Cell) {
  return `${c.row}-${c.col}`;
}

function getCellsBetween(start: Cell, end: Cell): Cell[] | null {
  const dr = end.row - start.row;
  const dc = end.col - start.col;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  if (len === 0) return null;
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null; // not a straight line

  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

  const cells: Cell[] = [];
  for (let i = 0; i <= len; i++) {
    cells.push({ row: start.row + stepR * i, col: start.col + stepC * i });
  }
  return cells;
}

export default function WordSearchGame({ puzzle }: { puzzle: WordPuzzle }) {
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [hoverCell, setHoverCell] = useState<Cell | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [won, setWon] = useState(false);

  const previewCells: Set<string> = new Set();
  if (startCell && hoverCell) {
    const cells = getCellsBetween(startCell, hoverCell);
    if (cells) {
      cells.forEach((c) => previewCells.add(cellKey(c)));
    }
  }

  const handleCellClick = useCallback(
    (cell: Cell) => {
      if (!startCell) {
        setStartCell(cell);
        return;
      }

      // If clicking the same cell, deselect
      if (cellKey(cell) === cellKey(startCell)) {
        setStartCell(null);
        return;
      }

      const cells = getCellsBetween(startCell, cell);
      if (!cells) {
        setStartCell(cell);
        return;
      }

      const word = cells.map((c) => puzzle.grid[c.row][c.col]).join("");
      const reversed = word.split("").reverse().join("");

      const matched = puzzle.words.find(
        (w) => w === word || w === reversed
      );

      if (matched && !foundWords.has(matched)) {
        const newFound = new Set(foundWords);
        newFound.add(matched);
        setFoundWords(newFound);

        const newFoundCells = new Set(foundCells);
        cells.forEach((c) => newFoundCells.add(cellKey(c)));
        setFoundCells(newFoundCells);

        if (newFound.size === puzzle.words.length) {
          setWon(true);
        }
      }

      setStartCell(null);
      setHoverCell(null);
    },
    [startCell, foundWords, foundCells, puzzle]
  );

  if (won) {
    return (
      <div className="bg-white rounded-2xl border-2 border-purple-300 p-8 shadow text-center">
        <div className="text-7xl mb-4">🏆</div>
        <h2 className="text-3xl font-extrabold text-purple-700 mb-2">You found them all!</h2>
        <p className="text-gray-600 mb-6">
          Amazing work! You found all {puzzle.words.length} words!
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/puzzles"
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-full transition-colors"
          >
            More Puzzles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Word list */}
      <div className="bg-white rounded-2xl border-2 border-purple-100 p-4 w-full">
        <p className="text-sm font-bold text-purple-600 mb-3 uppercase tracking-wide">
          Find these words ({foundWords.size}/{puzzle.words.length} found):
        </p>
        <div className="flex flex-wrap gap-2">
          {puzzle.words.map((word) => (
            <span
              key={word}
              className={`px-3 py-1 rounded-full text-sm font-bold border-2 transition-all ${
                foundWords.has(word)
                  ? "bg-green-100 border-green-400 text-green-700 line-through"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <p className="text-sm text-gray-500 text-center">
        {startCell
          ? "Now click the last letter of the word!"
          : "Click the first letter of a word to start!"}
      </p>

      {/* Grid */}
      <div className="overflow-x-auto w-full flex justify-center">
        <table className="border-collapse select-none">
          <tbody>
            {puzzle.grid.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((letter, cIdx) => {
                  const key = `${rIdx}-${cIdx}`;
                  const isFound = foundCells.has(key);
                  const isStart = startCell && cellKey(startCell) === key;
                  const isPreview = previewCells.has(key);

                  return (
                    <td key={cIdx} className="p-0">
                      <div
                        className={`word-cell ${
                          isFound
                            ? "found"
                            : isStart || isPreview
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleCellClick({ row: rIdx, col: cIdx })}
                        onMouseEnter={() => startCell && setHoverCell({ row: rIdx, col: cIdx })}
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
