export type Language = "en" | "ru";
export type Copy = Record<Language, string>;
export type Activity = {
  type: "sequence" | "sort" | "choose"; title: Copy; intro: Copy;
  items: { id: string; text: Copy; group?: string }[];
  correctOrder?: string[]; groups?: { id: string; label: Copy }[];
  question?: Copy; correctId?: string; hint: Copy; success: Copy;
};
// A speaker in a scene. "teacher" always renders with the warm green accent;
// the four recurring kids each get their own color so a glance at the left
// border tells you who's talking before you read a word.
export type SpeakerId = "michael" | "joseph" | "rosie" | "gracie" | "teacher";
// A scene is told as a sequence of beats instead of one undifferentiated
// block of prose. "narration" is the storyteller's voice (can include
// second-person "you" lines); "dialogue" is one character speaking, and
// renders with a visibly accented, labeled block so it reads apart from
// the narration at a glance.
export type Beat =
  | { kind: "narration"; text: Copy }
  | { kind: "dialogue"; speaker: SpeakerId; text: Copy };
export type Scene = {
  title: Copy;
  // New lessons use `beats`. Lessons not yet migrated keep `paragraphs`
  // (plain narration-only prose) and render exactly as before — nothing
  // breaks while lessons are converted one at a time. See beats.ts.
  beats?: Beat[];
  paragraphs?: Record<Language, string[]>;
};
export type Lesson = {
  id: number; chapter: number; kind: "lesson" | "lab"; title: Copy; subtitle: Copy;
  scenes: Scene[];
  scripture: { reference: Copy; text: Copy; url: Copy };
  activity: Activity; fieldMission: Copy; prayer: Copy;
  // A short, kid-sized response to a real objection the lesson's topic
  // invites — "if someone says... you can say...". Optional so lessons
  // keep working before every one has this written. See beats.ts for how
  // it's validated/rendered.
  // Writing guidance: a flat rebuttal sounds rehearsed; ending on a
  // genuine question back is usually stronger and fits a kid's own voice
  // better. Don't just assert the lesson's position — hand the weight
  // back ("which makes more sense: X, or Y?") so the other person feels
  // their own view costs something too, then let the kid's honest
  // preference close it ("I know which one I'd rather believe") rather
  // than a declared win. See lesson 1 for a worked example.
  comeback?: { prompt: Copy; response: Copy };
  sources: { title: Copy; url: string; supports: Copy; limits: Copy }[]; adultNote: Copy;
};
export type LessonSummary = Pick<Lesson, "id" | "chapter" | "kind" | "title" | "subtitle">;
export const lessonHref = (id: number) => `/why/${String(id).padStart(2, "0")}`;
export const chapterImage = (chapter: number) => `/images/jr/why/chapter-${String(chapter).padStart(2, "0")}.webp`;
