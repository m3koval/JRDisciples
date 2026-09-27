import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'
import crypto from 'node:crypto'

const root = process.cwd()
const source = fs.readFileSync('app/lessons/second-mile/content.ts', 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
const sandbox = { exports: {} }
vm.runInNewContext(js, sandbox)
const { copy, images, scriptureEn, scriptureRu } = sandbox.exports
const sources = JSON.parse(fs.readFileSync('docs/second-mile-scripture-sources.json', 'utf8')).verses
assert.equal(sources.length, 8)
assert.equal(scriptureEn.length, 4)
assert.equal(scriptureRu.length, 4)
;[...scriptureEn, ...scriptureRu].forEach((verse, i) => {
  assert.equal(verse.text, sources[i].quote, `${verse.reference} exact Bible.com quote drift`)
  assert.equal(verse.url, sources[i].url)
})
assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.ru).sort())
for (const key of Object.keys(copy.en)) {
  assert.equal(typeof copy.en[key], typeof copy.ru[key], key)
  if (Array.isArray(copy.en[key])) assert.equal(copy.en[key].length, copy.ru[key].length, key)
}
assert.equal(copy.en.verseTiles.join(' '), scriptureEn[0].text)
assert.equal(copy.ru.verseTiles.join(' '), scriptureRu[0].text)
for (const language of ['en', 'ru']) {
  const t = copy[language]
  for (const key of ['titles', 'teaching', 'tasks', 'hints', 'learns']) assert.equal(t[key].length, 4, `${language} ${key}`)
  assert.equal(t.alts.length, 6)
  assert.equal(t.thoughts.length, 4)
  for (const key of ['needs', 'actions', 'graceTiles', 'plans']) assert.equal(t[key].length, 3)
}
const dir = 'public/images/jr/lessons/second-mile'
const manifest = JSON.parse(fs.readFileSync(`${dir}/asset-manifest.json`, 'utf8'))
assert.equal(images.length, 6)
assert.equal(manifest.assets.length, 6)
assert.equal(new Set(images).size, 6)
for (const [i, asset] of manifest.assets.entries()) {
  assert.equal(images[i], `/images/jr/lessons/second-mile/${asset.file}`)
  const bytes = fs.readFileSync(path.join(root, dir, asset.file))
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), asset.sha256)
  assert.equal(asset.visual_qa, 'PASS')
  assert.ok(fs.statSync(`${dir}/${asset.prompt}`).size > 100)
}
for (const file of ['data/lessons.ts', 'data/lessons-ru.ts', 'data/journey.ts']) {
  assert.ok(fs.readFileSync(file, 'utf8').includes('/lessons/second-mile'), file)
}
const pageSource = fs.readFileSync('app/lessons/second-mile/page.tsx', 'utf8')
const parserSource = pageSource.slice(pageSource.indexOf('type Progress'), pageSource.indexOf('const EMPTY'))
  + pageSource.slice(pageSource.indexOf('function parse('), pageSource.indexOf('function save(')) + '\nexports.parse = parse;'
const parserBox = { exports: {} }
vm.runInNewContext(ts.transpileModule(parserSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, parserBox)
const parse = state => parserBox.exports.parse(JSON.stringify(state))
assert.equal(parse({scene: 2, phase: 'do', sorted: [0,1,2,3]}).phase, 'result', 'completed sorting checkpoint must not strand child')
assert.equal(parse({scene: 3, phase: 'do', matched: [0,1,2]}).phase, 'result', 'completed matching checkpoint must not strand child')
assert.equal(parse({scene: 1, phase: 'do', order: [0,1,2,3,4]}).phase, 'do', 'verse still requires explicit Check and mastery grading')
assert.equal(parse({scene: 4, phase: 'do', order: [0,1,2]}).phase, 'do', 'grace still requires explicit Check')
assert.equal(parse({scene: 2, phase: 'result', sorted: [0]}).phase, 'do', 'incomplete result must return to puzzle')
assert.equal(parse({scene: 99}).scene, 0)
console.log('PASS: checkpoint invariants; 8 exact Scripture excerpts; EN/RU field/array parity; 2 exact verse puzzles; 6 unique QA-approved art files/hash checks; lesson and journey wiring.')
