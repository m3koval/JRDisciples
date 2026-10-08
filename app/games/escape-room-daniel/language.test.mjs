import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const source = fs.readFileSync(new URL('./game.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText
const { reducer, initialState, words } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
for (const language of ['en', 'ru']) {
  const other = language === 'en' ? 'ru' : 'en'
  for (const room of [1, 2, 3]) for (const paused of [false, true]) {
    const state = { ...initialState(language), phase: 'play', room, paused, city: 1, prayers: 3, question: 3, verseStep: 1, cleared: [0, 1], inspected: true, feedback: 'right' }
    assert.deepEqual(reducer(state, { type: 'language', language: other }), { ...state, language: other })
  }
  const solved = { ...initialState(language), phase: 'play', cleared: [0], tiles: words[language].map((_, i) => i), feedback: 'right' }
  const translated = reducer(solved, { type: 'language', language: other })
  assert.equal(translated.feedback, 'right')
  assert.equal(translated.tiles.length, words[other].length)
  assert.equal(reducer(translated, { type: 'next' }).room, 1)
  const partial = reducer({ ...solved, feedback: null, tiles: [0, 1] }, { type: 'language', language: other })
  assert.deepEqual(partial.tiles, [])
}
console.log('PASS Daniel EN/RU switch: nonword progress, pause, solved Continue and incompatible partial tiles')
