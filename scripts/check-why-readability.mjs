// Proof-of-readability guard for the WHY?! curriculum.
//
// Computes the Flesch-Kincaid Grade Level of each lesson's story text (the
// narration + dialogue a child actually reads scene by scene) using a
// standard syllable-counting heuristic. This is not a substitute for a real
// child reading it, but it is a real, repeatable, automatable signal — and
// unlike "I think this reads easier now," it can be checked in CI on every
// change so a future edit can't silently drift the reading level back up.
//
// Lessons already migrated to the structured `beats` schema (see
// components/why/types.ts) are held to a hard target grade level and FAIL
// the build if they drift above it. Lessons still on the legacy flat
// `paragraphs` schema are reported for visibility only — they are not
// held to the target yet, so this script doesn't break the build for the
// whole library on day one of the migration.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const TARGET_GRADE = 5.0; // top of comfortable independent reading for "ages 6-12"
const directory = join(process.cwd(), "data", "why");

function countSyllables(rawWord) {
  const word = rawWord.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  const trimmed = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const matches = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, matches ? matches.length : 1);
}

function scoreText(text) {
  const sentences = (text.match(/[.!?]+(?=\s|$)/g) ?? [text]).length || 1;
  const words = text.match(/[A-Za-z']+/g) ?? [];
  if (words.length === 0) return null;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const grade = 0.39 * (words.length / sentences) + 11.8 * (syllables / words.length) - 15.59;
  return { words: words.length, sentences, grade };
}

function sceneText(scene) {
  if (scene.beats) return scene.beats.map((beat) => beat.text.en).join(" ");
  return (scene.paragraphs?.en ?? []).join(" ");
}

const files = readdirSync(directory).filter((name) => /^lesson-\d{2}\.json$/.test(name)).sort();
const rows = [];
let failures = 0;

for (const file of files) {
  const lesson = JSON.parse(readFileSync(join(directory, file), "utf8"));
  const migrated = lesson.scenes.some((scene) => Array.isArray(scene.beats));
  const text = lesson.scenes.map(sceneText).join(" ");
  const score = scoreText(text);
  if (!score) continue;
  const grade = Math.round(score.grade * 10) / 10;
  const over = migrated && grade > TARGET_GRADE;
  if (over) failures++;
  rows.push({ id: lesson.id, title: lesson.title.en, migrated, words: score.words, grade, over });
}

const migratedRows = rows.filter((r) => r.migrated);
const legacyRows = rows.filter((r) => !r.migrated);

console.log(`WHY?! readability check — target grade level ${TARGET_GRADE} for migrated (structured-dialogue) lessons\n`);

if (migratedRows.length) {
  console.log("Migrated lessons (hard target):");
  for (const r of migratedRows) {
    const mark = r.over ? "FAIL" : "pass";
    console.log(`  [${mark}] #${String(r.id).padStart(2, "0")} "${r.title}" — grade ${r.grade}, ${r.words} words`);
  }
  console.log("");
}

if (legacyRows.length) {
  const avg = Math.round((legacyRows.reduce((s, r) => s + r.grade, 0) / legacyRows.length) * 10) / 10;
  console.log(`Legacy lessons (reported only, not yet migrated): ${legacyRows.length} lessons, average grade ${avg}`);
  console.log("  Highest (best migration candidates): " + legacyRows.slice().sort((a, b) => b.grade - a.grade).slice(0, 5)
    .map((r) => `#${String(r.id).padStart(2, "0")} (${r.grade})`).join(", "));
}

if (failures) {
  console.error(`\n${failures} migrated lesson(s) exceed the grade-${TARGET_GRADE} target.`);
  process.exit(1);
}
console.log(`\nAll migrated lessons are at or under grade ${TARGET_GRADE}.`);
