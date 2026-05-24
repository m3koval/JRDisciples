"use client";

import { useState } from "react";
import type { MemoryVerse } from "@/data/memory-verses";
import Link from "next/link";

type Stage = "read" | "practice" | "complete";

export default function MemoryChallenge({ verse }: { verse: MemoryVerse }) {
  const [stage, setStage] = useState<Stage>("read");

  const words = verse.text.replace(/[.,;!?]/g, "").split(" ");
  // For practice, blank out every other word starting at index 1
  const blankedIndexes = words.map((_, i) => i % 2 !== 0);

  const [inputs, setInputs] = useState<string[]>(words.map(() => ""));
  const [checked, setChecked] = useState<boolean[]>(words.map(() => false));
  const [allCorrect, setAllCorrect] = useState(false);

  function handleCheck() {
    const newChecked = words.map((word, i) => {
      if (!blankedIndexes[i]) return true;
      return inputs[i].trim().toLowerCase() === word.toLowerCase();
    });
    setChecked(newChecked);
    if (newChecked.every(Boolean)) {
      setTimeout(() => setStage("complete"), 800);
      setAllCorrect(true);
    }
  }

  function handleRestart() {
    setStage("read");
    setInputs(words.map(() => ""));
    setChecked(words.map(() => false));
    setAllCorrect(false);
  }

  if (stage === "read") {
    return (
      <div className="bg-white rounded-2xl border-2 border-green-200 p-8 shadow text-center">
        <p className="text-xs uppercase tracking-widest font-bold text-green-500 mb-3">
          Step 1 — Read the verse
        </p>
        <blockquote className="text-2xl font-bold text-gray-800 leading-snug mb-4">
          &ldquo;{verse.text}&rdquo;
        </blockquote>
        <p className="text-gray-500 font-semibold mb-8">— {verse.reference}</p>

        <p className="text-sm text-gray-600 mb-4">
          Read it a few times until you feel ready, then click below!
        </p>
        <button
          onClick={() => setStage("practice")}
          className="bg-green-500 hover:bg-green-600 text-white font-extrabold px-8 py-3 rounded-full transition-colors text-lg"
        >
          I&apos;m Ready to Practice! →
        </button>
      </div>
    );
  }

  if (stage === "complete") {
    return (
      <div className="bg-white rounded-2xl border-2 border-green-300 p-8 shadow text-center">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="text-3xl font-extrabold text-green-700 mb-2">You did it!</h2>
        <p className="text-gray-600 mb-6">You hid this verse in your heart! Keep practicing it every day.</p>

        <blockquote className="text-lg font-semibold text-gray-800 italic bg-green-50 rounded-xl p-4 mb-6">
          &ldquo;{verse.text}&rdquo;
          <footer className="text-sm text-gray-500 mt-1 not-italic">— {verse.reference}</footer>
        </blockquote>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={handleRestart}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition-colors"
          >
            Practice Again
          </button>
          <Link
            href="/memory"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full transition-colors"
          >
            More Verses
          </Link>
        </div>
      </div>
    );
  }

  // Practice stage
  return (
    <div className="bg-white rounded-2xl border-2 border-green-200 p-6 shadow">
      <p className="text-xs uppercase tracking-widest font-bold text-green-500 mb-3 text-center">
        Step 2 — Fill in the missing words
      </p>
      <p className="text-sm text-gray-500 text-center mb-5">
        Type the missing words (shown as blanks below), then tap &ldquo;Check!&rdquo;
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {words.map((word, i) => {
          if (!blankedIndexes[i]) {
            return (
              <span key={i} className="text-lg font-bold text-gray-800 self-end pb-1">
                {word}
              </span>
            );
          }

          const isCheckedCorrect = checked[i] && inputs[i].trim().toLowerCase() === word.toLowerCase();
          const isCheckedWrong = checked[i] && inputs[i].trim().toLowerCase() !== word.toLowerCase();

          return (
            <input
              key={i}
              type="text"
              value={inputs[i]}
              onChange={(e) => {
                const newInputs = [...inputs];
                newInputs[i] = e.target.value;
                setInputs(newInputs);
              }}
              className={`border-b-2 text-center text-lg font-bold w-24 focus:outline-none pb-0.5 ${
                isCheckedCorrect
                  ? "border-green-500 text-green-700 bg-green-50"
                  : isCheckedWrong
                  ? "border-red-400 text-red-600 bg-red-50"
                  : "border-gray-400 text-blue-700"
              }`}
              placeholder="___"
            />
          );
        })}
      </div>

      {!allCorrect && (
        <div className="text-center">
          <button
            onClick={handleCheck}
            className="bg-green-500 hover:bg-green-600 text-white font-extrabold px-8 py-3 rounded-full transition-colors"
          >
            Check! ✓
          </button>
          {checked.some(Boolean) && !allCorrect && (
            <p className="mt-3 text-red-600 text-sm font-semibold">
              Some words aren&apos;t right yet — check the red ones and try again!
            </p>
          )}
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={handleRestart}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
