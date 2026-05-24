"use client";

import { useState } from "react";
import type { RebusPuzzle } from "@/data/rebus";
import Link from "next/link";

export default function RebusCard({ puzzle }: { puzzle: RebusPuzzle }) {
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);

  function handleCheck() {
    if (input.trim().toUpperCase() === puzzle.answer.toUpperCase()) {
      setSolved(true);
    } else {
      setAttempts((a) => a + 1);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleCheck();
  }

  if (solved) {
    return (
      <div className="bg-white rounded-2xl border-2 border-pink-300 p-8 shadow text-center">
        <div className="text-7xl mb-4">🎊</div>
        <h2 className="text-3xl font-extrabold text-pink-700 mb-2">That&apos;s right!</h2>
        <div className="text-5xl font-extrabold text-gray-800 my-4">{puzzle.answer}</div>
        <p className="text-gray-600 mb-6 italic">{puzzle.hint}</p>
        <Link
          href="/rebus"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-full transition-colors"
        >
          Try Another Puzzle →
        </Link>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border-2 border-pink-200 p-6 shadow ${shake ? "animate-bounce" : ""}`}>
      {/* Clues */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8 bg-pink-50 rounded-2xl p-6">
        {puzzle.clues.map((clue, i) => {
          if (clue.type === "emoji") {
            return (
              <span key={i} className="text-6xl leading-none">
                {clue.value}
              </span>
            );
          }
          if (clue.type === "plus") {
            return (
              <span key={i} className="text-3xl font-black text-gray-500">
                +
              </span>
            );
          }
          if (clue.type === "minus") {
            return (
              <span key={i} className="text-3xl font-black text-red-400">
                −
              </span>
            );
          }
          if (clue.type === "equals") {
            return (
              <span key={i} className="text-3xl font-black text-gray-400">
                =
              </span>
            );
          }
          // text
          return (
            <span key={i} className="text-2xl font-extrabold text-gray-700 bg-white px-3 py-1 rounded-xl border-2 border-gray-200">
              {clue.value}
            </span>
          );
        })}
        <span className="text-3xl font-black text-gray-500">=</span>
        <span className="text-3xl font-extrabold text-gray-300">?</span>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-pink-400 uppercase"
        />
        <button
          onClick={handleCheck}
          className="bg-pink-500 hover:bg-pink-600 text-white font-extrabold px-5 py-3 rounded-xl transition-colors"
        >
          Check!
        </button>
      </div>

      {/* Feedback */}
      {attempts > 0 && (
        <p className="text-red-500 font-semibold text-center mb-3">
          {attempts === 1
            ? "Not quite — try again! 💪"
            : attempts === 2
            ? "Keep trying! Maybe try the hint below!"
            : "You can do it! The hint might help!"}
        </p>
      )}

      {/* Hint toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-sm text-gray-400 hover:text-pink-600 underline"
        >
          {showHint ? "Hide hint" : "Show hint 💭"}
        </button>
        {showHint && (
          <p className="mt-2 text-sm text-pink-700 bg-pink-50 rounded-xl p-3 font-semibold">
            Hint: {puzzle.hint}
          </p>
        )}
      </div>
    </div>
  );
}
