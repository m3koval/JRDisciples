import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const failures = []

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8')
}

function unique(values) {
  return [...new Set(values)].sort()
}

function matchAll(text, regex) {
  return [...text.matchAll(regex)].map((match) => match[1])
}

function cyrillicCount(text) {
  return (text.match(/[А-Яа-яЁё]/g) || []).length
}

function assertSameSet(label, enValues, ruValues) {
  const en = unique(enValues)
  const ru = unique(ruValues)
  for (const value of en) {
    if (!ru.includes(value)) failures.push(`${label}: missing Russian entry for ${value}`)
  }
  for (const value of ru) {
    if (!en.includes(value)) failures.push(`${label}: Russian entry has no English match for ${value}`)
  }
}

const lessonsEn = read('data/lessons.ts')
const lessonsRu = read('data/lessons-ru.ts')
const storiesEn = read('data/stories.ts')
const storiesRu = read('data/stories-ru.ts')

const lessonHrefsEn = matchAll(lessonsEn, /href:\s*["'](\/lessons\/[A-Za-z0-9/_-]+)["']/g)
const lessonHrefsRu = matchAll(lessonsRu, /href:\s*["'](\/lessons\/[A-Za-z0-9/_-]+)["']/g)
assertSameSet('lesson topic cards', lessonHrefsEn, lessonHrefsRu)

const storyIdsEn = matchAll(storiesEn, /\bid:\s*["']([^"']+)["']/g)
const storyIdsRu = matchAll(storiesRu, /\bid:\s*["']([^"']+)["']/g)
assertSameSet('story data', storyIdsEn, storyIdsRu)

if (cyrillicCount(storiesRu) < 500) {
  failures.push('story data: Russian story file does not contain enough Cyrillic content to satisfy bilingual parity')
}

for (const id of unique(storyIdsEn)) {
  const storyBlockRu = storiesRu.slice(Math.max(0, storiesRu.indexOf(`id: "${id}"`) - 200), storiesRu.indexOf(`id: "${id}"`) + 2500)
  if (!storyBlockRu || cyrillicCount(storyBlockRu) < 100) {
    failures.push(`story data: ${id} appears to be missing substantive Russian content`)
  }
}

for (const href of unique(lessonHrefsEn)) {
  const slug = href.replace('/lessons/', '')
  const relPage = `app/lessons/${slug}/page.tsx`
  const absPage = path.join(root, relPage)
  if (!fs.existsSync(absPage)) {
    failures.push(`lesson route: ${href} missing page at ${relPage}`)
    continue
  }

  const page = fs.readFileSync(absPage, 'utf8')
  if (/\bWEB\b|World English Bible/.test(page)) {
    failures.push(`lesson route: ${slug} contains WEB/public-domain Scripture wording or label`)
  }
  if (!/\buseLanguage\b/.test(page) || !/language\s*===\s*["']ru["']/.test(page)) {
    failures.push(`lesson route: ${slug} missing language switcher branch`)
  }
  if (cyrillicCount(page) < 200) {
    failures.push(`lesson route: ${slug} missing substantive Russian page content; every lesson must switch between English and Russian`)  
  }
  if (/\bscriptureRu\b/.test(page) && !/const\s+scriptureRu\b/.test(page)) {
    failures.push(`lesson route: ${slug} references scriptureRu but does not define it`)
  }
  if (/\bscriptureEn\b/.test(page) && !/const\s+scriptureEn\b/.test(page)) {
    failures.push(`lesson route: ${slug} references scriptureEn but does not define it`)
  }
}

for (const href of unique(lessonHrefsRu)) {
  if (!lessonHrefsEn.includes(href)) continue
  const slug = href.replace('/lessons/', '')
  const cardStart = lessonsRu.indexOf(`href: "${href}"`)
  const cardBlock = cardStart >= 0 ? lessonsRu.slice(Math.max(0, cardStart - 300), cardStart + 900) : ''
  if (cyrillicCount(cardBlock) < 50) {
    failures.push(`lesson topic cards: ${href} missing substantive Russian title/description`)
  }
}

if (failures.length) {
  console.error('Bilingual content parity check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Bilingual content parity checks passed for ${unique(lessonHrefsEn).length} lessons and ${unique(storyIdsEn).length} stories.`)
