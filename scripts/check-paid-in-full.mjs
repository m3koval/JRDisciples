import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'

const root = process.cwd()
const source = fs.readFileSync(path.join(root, 'app/lessons/paid-in-full/content.ts'), 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText
const box = { exports: {} }
vm.runInNewContext(js, box)
const { content, scriptureEn, scriptureRu, sources } = box.exports
function parity(a, b, at = 'content') {
  assert.equal(typeof a, typeof b, at)
  if (Array.isArray(a)) { assert.equal(a.length, b.length, at); a.forEach((x, i) => parity(x, b[i], `${at}[${i}]`)); return }
  if (a && typeof a === 'object') { assert.deepEqual(Object.keys(a), Object.keys(b), at); for (const k of Object.keys(a)) parity(a[k], b[k], `${at}.${k}`) }
}
parity(content.en, content.ru)
parity(scriptureEn, scriptureRu)
const fixtures = JSON.parse(fs.readFileSync('scripts/fixtures/paid-in-full-scripture.json', 'utf8'))
for (const [lang, scripture] of [['en', scriptureEn], ['ru', scriptureRu]]) {
  assert.equal(scripture.peter, fixtures[lang].peter, `${lang} exact source 1 Peter`)
  assert.equal(scripture.colossians, fixtures[lang].colossians, `${lang} exact source Colossians`)
  for (const key of ['father', 'ransom', 'memory', 'hope']) assert(scripture.peter.includes(scripture[key]), `${lang} ${key} excerpt`)
  assert.equal(scripture.memory.split(' ').join(' '), scripture.memory)
  const t = content[lang]
  assert.equal(t.stages.length, 5)
  assert.equal(t.quiz.length, 6)
  assert.equal(t.timeline.length, 5)
  assert.equal(new Set(t.stages.map(s => s.activity)).size, 5)
  assert(new Set(t.quiz.map(q => q.correct)).size === 3, 'vary correct position')
  for (const q of t.quiz) { assert(q.correct >= 0 && q.correct < q.options.length); assert(q.explanation.length > 30) }
  for (const s of t.stages) { assert(s.hint.length > 30); assert(s.learn.length > 40); assert(scripture[s.verse]); assert(fs.statSync(`public/images/jr/lessons/paid-in-full/${s.image}.webp`).size > 10000) }
  for (const [cards, labels] of [[t.matchCards, t.matchLabels], [t.sortCards, t.sortLabels]]) for (const c of cards) { assert(c.category >= 0 && c.category < labels.length); assert(c.why.length > 20) }
  assert(t.missions.length >= 3 && t.plan.length >= 7 && t.discussions.length >= 5)
}
for (const asset of ['cover','father-judge','travelers','redemption']) assert(fs.existsSync(`public/images/jr/lessons/paid-in-full/${asset}.webp`))
assert(!/unverified|not retained|непроверенн|не сохранены|supplied Russian sermon/.test(source), 'No internal audit notes in public content')
assert(sources.some(([,url]) => url === 'http://www.surveyhistory.org/lincoln_the_surveyor1.htm'))
const home = fs.readFileSync('app/page.tsx', 'utf8')
assert(home.indexOf('<PaidInFullFeature compact') < home.indexOf('href: "/stories"'))
for (const file of ['data/lessons.ts','data/lessons-ru.ts']) {
  const text = fs.readFileSync(file, 'utf8'); assert.equal(text.match(/href: "([^"]+)"/)[1], '/lessons/paid-in-full')
}
if (process.argv[2] === '--export-browser') fs.writeFileSync(process.argv[3], JSON.stringify(box.exports))
console.log('Paid in Full PASS: exact ESV/RST source fixtures, complete EN/RU field parity, five discoveries, four activity mechanics + six-question quiz, four FAL images, first homepage/lesson placement.')
