#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const lessonDir = path.join(root, 'app', 'lessons')
const caseFiles = fs.readdirSync(lessonDir)
  .filter((name) => name.startsWith('case-for-christ-'))
  .map((name) => path.join(lessonDir, name, 'page.tsx'))
  .filter((file) => fs.existsSync(file))

const directEnglishDataMaps = [
  'evidenceCards',
  'caseFiles',
  'quiz',
  'identityCards',
  'teachingTrail',
  'hardWords',
  'questions',
  'visuals',
  'witnesses',
  'trail',
  'bibleAnchors',
]

const errors = []

for (const file of caseFiles) {
  const rel = path.relative(root, file)
  const source = fs.readFileSync(file, 'utf8')

  if (!source.includes('useLanguage')) continue

  for (const name of directEnglishDataMaps) {
    const directMap = new RegExp(`\\{\\s*${name}\\.map\\s*\\(`)
    if (directMap.test(source)) {
      errors.push(`${rel}: maps English-only data array \`${name}\` directly; use a language-selected list such as \`${name}List\`.`)
    }
  }
}

if (errors.length) {
  console.error('Case for Christ Russian copy guard failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Case for Christ Russian copy guard passed for ${caseFiles.length} lessons.`)
