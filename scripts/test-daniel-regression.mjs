import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
const root = process.cwd()
const source = fs.readFileSync(path.join(root, 'app/games/escape-room-daniel/game.ts'), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
const { initialState, reducer, words, questions, scripture, windowGuidance } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
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
for (const language of ['en', 'ru']) {
  test(`${language}: window guidance follows either selection order without revealing answers`, () => {
    const expected = language === 'en'
      ? ['Choose a city, then choose how many prayers each day.', 'Now choose the city the windows faced.', 'Now choose how many prayers each day.', 'Both parts are set. Try the window lock below.']
      : ['Выбери город, затем число молитв в день.', 'Теперь выбери город, куда выходили окна.', 'Теперь выбери число молитв в день.', 'Обе части выбраны. Проверь замок окна ниже.']
    const empty = act(firstRoom(language), 'next')
    assert.equal(windowGuidance(empty, language), expected[0])
    for (const city of [0, 1, 2]) {
      const cityFirst = act(empty, 'city', { value: city })
      assert.equal(windowGuidance(cityFirst, language), expected[2])
      for (const prayers of [1, 2, 3]) {
        const prayersFirst = act(empty, 'prayers', { value: prayers })
        assert.equal(windowGuidance(prayersFirst, language), expected[1])
        assert.equal(windowGuidance(act(cityFirst, 'prayers', { value: prayers }), language), expected[3])
        assert.equal(windowGuidance(act(prayersFirst, 'city', { value: city }), language), expected[3])
      }
    }
  })
  test(`${language}: clue disclosure toggles without losing answers, hints reopen it, pause blocks it`, () => {
    for (const room of [0, 1, 2, 3]) {
      const state = { ...initialState(language), phase: 'play', room, tiles: [1, 0], city: 1, prayers: 2, question: 2, verseStep: 1, cleared: [0, 1], feedback: 'wrong' }
      const opened = act(state, 'inspect')
      assert.deepEqual(opened, { ...state, inspected: true })
      assert.deepEqual(act(opened, 'inspect'), state)
      assert.deepEqual(act(state, 'hint'), { ...state, hint: true, inspected: true })
      const paused = act(opened, 'pause', { value: true })
      assert.deepEqual(act(paused, 'inspect'), paused)
      const solved = { ...state, feedback: 'right' }
      assert.deepEqual(act(act(solved, 'inspect'), 'inspect'), solved)
    }
  })
  test(`${language}: complete four-room route with repeated inspections retains all keys`, () => {
    let state = act(initialState(language), 'start')
    const inspect = () => {
      state = act(state, 'inspect'); assert.equal(state.inspected, true)
      state = act(state, 'inspect'); assert.equal(state.inspected, false)
    }
    inspect()
    for (let index = 0; index < words[language].length; index++) state = act(state, 'tile', { index })
    state = act(act(state, 'check'), 'next')
    assert.equal(state.room, 1); inspect()
    state = act(state, 'prayers', { value: 3 }); state = act(state, 'city', { value: 1 })
    state = act(act(state, 'check'), 'next')
    assert.equal(state.room, 2)
    for (const question of questions) {
      inspect()
      state = act(act(state, 'answer', { value: question.answer }), 'next')
    }
    assert.equal(state.room, 3); inspect()
    state = act(act(state, 'verse', { value: 1 }), 'next')
    state = act(act(state, 'verse', { value: 2 }), 'next')
    assert.equal(state.phase, 'victory'); assert.deepEqual(state.cleared, [0, 1, 2, 3])
  })
}
test('mobile/accessibility source contracts: readable labels, disclosure, guidance, pause focus', () => {
  const page = fs.readFileSync(path.join(root, 'app/games/escape-room-daniel/page.tsx'), 'utf8')
  const css = fs.readFileSync(path.join(root, 'app/games/escape-room-daniel/room.module.css'), 'utf8')
  assert.match(css, /\.choices button\{[^}]*flex:1 1 auto;[^}]*overflow-wrap:normal;word-break:normal/)
  assert.match(css, /@media\(max-width:420px\)\{\.windowCities\{flex-direction:column\}/)
  assert.match(css, /min-height:46px/)
  assert.match(page, /aria-expanded=\{state.inspected\} aria-controls="daniel-clue"/)
  assert.match(page, /id="daniel-clue" hidden=\{!state.inspected\}/)
  assert.match(page, /id="daniel-window-guidance" role="status" aria-live="polite"/)
  assert.match(page, /aria-describedby="daniel-window-guidance"/)
  assert.match(page, /state\.verseStep, state\.paused\]/)
  assert.match(page, /aria-hidden="true">✓ /)
  const parsed = ts.transpileModule(page, { reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } })
  assert.deepEqual(parsed.diagnostics, [], 'TSX syntax diagnostics')
})
console.log(`Daniel regression: ${tests} passed, 0 failed`)
