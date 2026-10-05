import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
const root = process.cwd()
const source = fs.readFileSync(path.join(root, 'app/games/escape-room-daniel/game.ts'), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
const { initialState, reducer, words, questions, scripture } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
let tests = 0
function test(name, fn) { fn(); tests++; console.log('PASS ' + name) }
function act(state, type, rest = {}) { return reducer(state, { type, ...rest }) }
function firstRoom(language) {
  let state = act(initialState(language), 'start')
  for (let i = 0; i < words[language].length; i++) state = act(state, 'tile', { index: i })
  return act(state, 'check')
}
for (const language of ['en', 'ru']) {
  test(`${language}: tile puzzle requires explicit check and supports correction`, () => {
    let state = act(initialState(language), 'start')
    state = act(state, 'tile', { index: 1 })
    state = act(state, 'check')
    assert.equal(state.feedback, 'wrong'); assert.deepEqual(state.cleared, [])
    state = act(state, 'undo', { index: 0 })
    for (let i = 0; i < words[language].length; i++) state = act(state, 'tile', { index: i })
    assert.deepEqual(state.cleared, [])
    state = act(state, 'check'); assert.deepEqual(state.cleared, [0])
    assert.deepEqual(act(state, 'tile', { index: 0 }), state)
  })
  test(`${language}: room 2 wrong answer stays retryable; BOTH dials required`, () => {
    let state = act(firstRoom(language), 'next')
    state = act(state, 'city', { value: 0 }); state = act(state, 'prayers', { value: 1 })
    state = act(state, 'check'); assert.equal(state.feedback, 'wrong')
    assert.equal(act(state, 'next').room, 1)
    state = act(state, 'city', { value: 1 }); state = act(state, 'check')
    assert.equal(state.feedback, 'wrong')
    state = act(state, 'prayers', { value: 3 }); state = act(state, 'check')
    assert.equal(state.feedback, 'right'); assert.deepEqual(state.cleared, [0, 1])
  })
  test(`${language}: every wrong witness answer stays put; only five correct seals earn key`, () => {
    let state = { ...initialState(language), phase: 'play', room: 2, cleared: [0, 1] }
    for (let i = 0; i < questions.length; i++) {
      state = act(state, 'answer', { value: !questions[i].answer })
      assert.equal(state.question, i); assert.equal(state.feedback, 'wrong')
      assert.deepEqual(state.cleared, [0, 1]); assert.deepEqual(act(state, 'next'), state)
      state = act(state, 'answer', { value: questions[i].answer })
      assert.equal(state.feedback, 'right')
      assert.deepEqual(act(state, 'answer', { value: questions[i].answer }), state)
      state = act(state, 'next')
    }
    assert.equal(state.room, 3); assert.deepEqual(state.cleared, [0, 1, 2])
  })
  test(`${language}: final lock wrong answer recovery, explicit victory, clean replay`, () => {
    let state = { ...initialState(language), phase: 'play', room: 3, cleared: [0, 1, 2] }
    state = act(state, 'verse', { value: 0 }); assert.equal(state.feedback, 'wrong')
    state = act(state, 'verse', { value: 1 }); state = act(state, 'next')
    assert.equal(state.verseStep, 1)
    state = act(state, 'verse', { value: 1 }); assert.equal(state.feedback, 'wrong')
    assert.equal(state.phase, 'play')
    state = act(state, 'verse', { value: 2 }); assert.equal(state.phase, 'play')
    state = act(state, 'next'); assert.equal(state.phase, 'victory')
    assert.deepEqual(state.cleared, [0, 1, 2, 3])
    state = act(state, 'reset'); assert.deepEqual(state, initialState(language))
    assert.deepEqual(act(state, 'next'), state)
  })
}
test('pause prevents puzzle mutations; resume preserves state', () => {
  const state = act(firstRoom('en'), 'next')
  const paused = act(state, 'pause', { value: true })
  assert.deepEqual(act(paused, 'city', { value: 1 }), paused)
  assert.deepEqual(act(paused, 'next'), paused)
  assert.deepEqual(act(paused, 'pause', { value: false }), state)
})
test('language change resets incompatible tiles but retains keys', () => {
  const state = { ...firstRoom('en'), feedback: null, tiles: [0, 4, 5] }
  const switched = act(state, 'language', { language: 'ru' })
  assert.deepEqual(switched.tiles, []); assert.deepEqual(switched.cleared, [0])
  assert.equal(switched.language, 'ru')
})
test('locked rooms and malformed tile indexes cannot bypass progression', () => {
  const state = act(initialState(), 'start')
  for (const value of [1, 2, 3, -1, 9, 1.5]) assert.deepEqual(act(state, 'room', { value }), state)
  for (const index of [-1, 6, NaN, 1.5]) assert.deepEqual(act(state, 'tile', { index }), state)
  assert.deepEqual(act(state, 'next'), state)
})
test('timer-free gameplay removes stale callbacks and reset races', () => {
  const page = fs.readFileSync(path.join(root, 'app/games/escape-room-daniel/page.tsx'), 'utf8')
  assert.doesNotMatch(source + page, /setTimeout|setInterval/)
  assert.match(page, /visibilitychange/)
})
test('exact verified EN/RU verse excerpts retained', () => {
  assert.equal(scripture.en, 'My God sent his angel and shut the lions’ mouths, and they have not harmed me')
  assert.equal(scripture.ru, 'Бог мой послал Ангела Своего и заградил пасть львам, и они не повредили мне')
})
console.log(`Daniel regression: ${tests} passed, 0 failed`)
