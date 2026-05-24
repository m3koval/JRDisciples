"use client";

import { useState } from "react";
import type { Quiz } from "@/data/quizzes";
import Link from "next/link";

export default function QuizGame({ quiz }: { quiz: Quiz }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);

  const question = quiz.questions[current];
  const total = quiz.questions.length;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (current + 1 >= total) {
      setComplete(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setComplete(false);
  }

  if (complete) {
    const pct = Math.round((score / total) * 100);
    const message =
      pct === 100
        ? "PERFECT! You got them all! 🎉🎉🎉"
        : pct >= 80
        ? "Amazing job! You know God's Word! ⭐"
        : pct >= 60
        ? "Great effort! Keep reading the Bible! 📖"
        : "Good try! Reading the story again will help! 💪";

    return (
      <div className="bg-white rounded-2xl border-2 border-yellow-200 p-8 text-center shadow">
        <div className="text-7xl mb-4">{pct === 100 ? "🏆" : "⭐"}</div>
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2">
          {score}/{total} Correct!
        </h2>
        <p className="text-xl text-gray-700 mb-6">{message}</p>

        {/* Score bar */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-6 max-w-xs mx-auto">
          <div
            className="h-full bg-green-400 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={handleRestart}
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-6 py-3 rounded-full transition-colors"
          >
            Try Again!
          </button>
          <Link
            href="/quiz"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full transition-colors"
          >
            More Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-yellow-100 shadow overflow-hidden">
      {/* Progress */}
      <div className="bg-yellow-50 px-6 py-3 flex items-center justify-between border-b border-yellow-100">
        <span className="text-sm font-semibold text-yellow-700">
          Question {current + 1} of {total}
        </span>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < current
                  ? "bg-green-400"
                  : i === current
                  ? "bg-yellow-400"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        <p className="text-xl font-bold text-gray-800 mb-6 leading-snug">
          {question.question}
        </p>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt, idx) => {
            let style = "border-2 border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300";
            if (selected !== null) {
              if (idx === question.correctIndex) {
                style = "border-2 border-green-400 bg-green-50";
              } else if (idx === selected) {
                style = "border-2 border-red-400 bg-red-50";
              } else {
                style = "border-2 border-gray-200 bg-gray-50 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`text-left px-4 py-3 rounded-xl font-semibold text-gray-800 transition-all ${style}`}
              >
                <span className="mr-2 text-gray-400 font-bold">
                  {["A", "B", "C", "D"][idx]}.
                </span>
                {opt}
                {selected !== null && idx === question.correctIndex && (
                  <span className="ml-2">✅</span>
                )}
                {selected !== null && idx === selected && idx !== question.correctIndex && (
                  <span className="ml-2">❌</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {selected !== null && (
          <div
            className={`mt-4 p-4 rounded-xl border-2 ${
              selected === question.correctIndex
                ? "bg-green-50 border-green-300 text-green-800"
                : "bg-orange-50 border-orange-300 text-orange-800"
            }`}
          >
            <p className="font-semibold mb-1">
              {selected === question.correctIndex ? "🎉 Correct!" : "Not quite — here's why:"}
            </p>
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button
            onClick={handleNext}
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-colors"
          >
            {current + 1 >= total ? "See My Score! 🏆" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
