import type { Beat, Copy, Language, Scene, SpeakerId } from "./types";

// Display name + accent color per speaker. Colors are chosen for contrast
// against the cream reading background and against each other, so a kid
// scanning down the page can tell characters apart by color alone before
// reading the label.
export const speakers: Record<SpeakerId, { name: Copy; color: string }> = {
  michael: { name: { en: "Michael", ru: "Майкл" }, color: "#2f6690" },
  joseph: { name: { en: "Joseph", ru: "Джозеф" }, color: "#6b4fa0" },
  rosie: { name: { en: "Rosie", ru: "Рози" }, color: "#b8457a" },
  gracie: { name: { en: "Gracie", ru: "Грейси" }, color: "#b5651d" },
  teacher: { name: { en: "Teacher", ru: "Учитель" }, color: "#2b6a4f" },
};

// Lessons not yet migrated to structured beats still have plain
// `paragraphs` (one string per paragraph, dialogue folded into the prose
// as before). Render those as narration-only beats so nothing breaks
// mid-migration; a lesson gains dialogue accenting the moment its JSON
// adopts `beats` instead.
export function sceneBeats(scene: Scene, language: Language): Beat[] {
  if (scene.beats) return scene.beats;
  const paragraphs = scene.paragraphs?.[language] ?? [];
  return paragraphs.map((text) => ({ kind: "narration" as const, text: { en: text, ru: text } }));
}
