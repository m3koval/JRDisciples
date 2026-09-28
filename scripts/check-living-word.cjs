/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness loads TypeScript fixtures with Module._compile. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const Module = require('node:module')
function load(file) {
  const mod = new Module(file, module)
  mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020}}).outputText, file)
  return mod.exports
}
const {initial, parseProgress, solved, applyAnswer} = load('app/lessons/living-word/state.ts')
assert.deepEqual(parseProgress('{bad'), initial)
assert.deepEqual(parseProgress('null'), initial)
assert.equal(parseProgress(JSON.stringify({...initial, scene: 99})).scene, 0)
assert.equal(parseProgress(JSON.stringify({...initial, scene: 2, phase: 'feedback'})).phase, 'do')
assert.equal(parseProgress(JSON.stringify({...initial, scene: 2, phase: 'do', order: [0,1,2]})).phase, 'do', 'reorder needs explicit Check')
assert.equal(parseProgress(JSON.stringify({...initial, scene: 3, phase: 'do', matched:[0,1,2]})).phase, 'feedback')
assert.equal(parseProgress(JSON.stringify({...initial, scene: 4, phase: 'do', claims:[0,1,2]})).phase, 'feedback')
assert.equal(parseProgress(JSON.stringify({...initial, scene: 5, completed: true, plan: null})).completed, false)
let p = {...initial, scene:1, phase:'do'}
p = applyAnswer(p, 'context', false)
assert.equal(p.phase, 'do')
assert.equal(p.attempts.context, false)
p = applyAnswer(p, 'context', true, {context:true})
assert.equal(p.phase, 'feedback')
assert.equal(p.attempts.context, false, 'retries do not overwrite first try')
assert.equal(solved({...initial, scene:2, order:[0,2,1]}), false)
assert.equal(solved({...initial, scene:2, order:[0,1,2]}), true)
assert.deepEqual(parseProgress(JSON.stringify({...initial, matched:[0,0,-1,8,1]})).matched, [0,1])
console.log('PASS: progress corruption, explicit grading, solved recovery, retry and completion guards')
const {copy, images} = load('app/lessons/living-word/content.ts')
function shape(a,b,path='copy') {
  assert.equal(typeof a, typeof b,path)
  if (Array.isArray(a)) {assert.equal(a.length,b.length,path); a.forEach((x,i)=>shape(x,b[i],`${path}[${i}]`))}
  else if(a && typeof a === 'object') {assert.deepEqual(Object.keys(a),Object.keys(b),path); for(const k of Object.keys(a)) shape(a[k],b[k],`${path}.${k}`)}
}
shape(copy.en,copy.ru)
assert.equal(copy.en.titles.length,4)
for(const image of images) assert.ok(fs.statSync('public'+image).size>0,image)
console.log('PASS: complete EN/RU copy shape, four truths, real local assets')
const {scriptureEn, scriptureRu} = load('app/lessons/living-word/scripture.ts')
const fixture = JSON.parse(fs.readFileSync('docs/living-word/scripture-verified.json', 'utf8'))
let quotes = 0
for (const [language, entries] of [['en', scriptureEn], ['ru', scriptureRu]]) {
  assert.equal(entries.length, 7)
  for (const entry of entries) {
    const source = fixture.find(row => row.language === language && row.ref === entry.id)
    assert.ok(source, `Missing verified source: ${language}/${entry.id}`)
    assert.equal(entry.text, source.verses.map(v => v.content).join(' '))
    assert.equal(entry.url, source.url)
    assert.equal(entry.translation, source.version)
    quotes++
  }
}
console.log(`PASS: ${quotes} exact Scripture quotes, URLs and translation labels match retrieved Bible.com sources`)
