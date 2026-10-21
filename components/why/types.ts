export type Language = "en" | "ru";
export type Copy = Record<Language, string>;
export type Activity = {
  type: "sequence" | "sort" | "choose"; title: Copy; intro: Copy;
  items: { id: string; text: Copy; group?: string }[];
  correctOrder?: string[]; groups?: { id: string; label: Copy }[];
  question?: Copy; correctId?: string; hint: Copy; success: Copy;
};
export type Lesson = {
  id: number; chapter: number; kind: "lesson" | "lab"; title: Copy; subtitle: Copy;
  scenes: { title: Copy; paragraphs: Record<Language, string[]> }[];
  scripture: { reference: Copy; text: Copy; url: Copy };
  activity: Activity; fieldMission: Copy; prayer: Copy;
  sources: { title: Copy; url: string; supports: Copy; limits: Copy }[]; adultNote: Copy;
};
export type LessonSummary = Pick<Lesson, "id" | "chapter" | "kind" | "title" | "subtitle">;
export const lessonHref = (id: number) => `/why/${String(id).padStart(2, "0")}`;
export const chapterImage = (chapter: number) => `/images/jr/why/chapter-${String(chapter).padStart(2, "0")}.webp`;
