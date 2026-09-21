// Maps a lesson's route (as used in data/lessons.ts `href`) to the lessonId
// it uses with lib/lesson-mastery.ts. New lessons should use their route
// slug directly as the lessonId, so no entry is needed here — only the
// lessons built before this registry existed have a differing prefix.
export const LESSON_MASTERY_ID: Record<string, string> = {
  '/lessons/coin-in-the-fish': 'coin-fish',
  '/lessons/mustard-seed-faith': 'mustard-faith',
  '/lessons/jesus-builds-his-church': 'church-build',
  '/lessons/how-to-pray': 'how-to-pray',
  '/lessons/jonah-big-fish': 'jonah',
  '/lessons/transfiguration': 'transf',
  '/lessons/who-is-jesus': 'wij',
  '/lessons/holy-spirit': 'hs',
}

/** Resolves a lesson href to its mastery-tracking id. */
export function lessonMasteryId(href: string): string {
  return LESSON_MASTERY_ID[href] ?? href.replace(/^\/lessons\//, '')
}
