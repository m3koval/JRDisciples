import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const lessonDir = path.join(root, 'app', 'lessons')
const ruDataPath = path.join(root, 'data', 'lessons-ru.ts')
const ruData = fs.readFileSync(ruDataPath, 'utf8')

const caseLessonSlugs = fs
  .readdirSync(lessonDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('case-for-christ-'))
  .map((entry) => entry.name)
  .sort()

const failures = []

for (const slug of caseLessonSlugs) {
  const pagePath = path.join(lessonDir, slug, 'page.tsx')
  const text = fs.readFileSync(pagePath, 'utf8')

  if (/\bWEB\b|World English Bible/.test(text)) {
    failures.push(`${slug}: contains WEB wording or label in published page`)
  }

  if (/scriptureEn/.test(text) && !/\bESV\b/.test(text)) {
    failures.push(`${slug}: defines English Scripture but is missing an ESV label in published page`)
  }

  if (!/\buseLanguage\b/.test(text) || !/language === 'ru'|language === "ru"/.test(text)) {
    failures.push(`${slug}: missing Russian language branch in published page`)
  }

  if (!new RegExp(`href:\\s*\"/lessons/${slug}\"`).test(ruData)) {
    failures.push(`${slug}: missing Russian lessons card`)
  }
}

if (failures.length) {
  console.error('Lesson Scripture/localization check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Lesson Scripture/localization checks passed for ${caseLessonSlugs.length} Case for Christ lessons.`)
