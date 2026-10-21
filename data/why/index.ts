// Server-only build-time discovery: content writers can add lessons independently.
// No client bundle receives filesystem code or the entire 52-lesson library.
import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Lesson } from "@/components/why/types";
export function getWhyLessons(): Lesson[] {
  const directory = join(process.cwd(), "data", "why");
  return readdirSync(directory).filter(name => /^lesson-\d{2}\.json$/.test(name))
    .sort().map(name => JSON.parse(readFileSync(join(directory, name), "utf8")) as Lesson)
    .sort((a, b) => a.id - b.id);
}
