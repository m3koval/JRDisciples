import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
const root = 'app/games/shepherd-light-adventure/'
function load(file, imports = {}) {
  const result = ts.transpileModule(fs.readFileSync(root + file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true })
  assert.equal(result.diagnostics.length, 0, `${file}: syntax diagnostics`)
  const context = { exports: {}, require: name => { assert.ok(imports[name], name); return imports[name] } }
  vm.runInNewContext(result.outputText, context)
  return context.exports
}
const mechanics = load('mechanics.ts')
const { createJourney, stepJourney, guideRadius, activateHelper, callLamb, retryJourney, dist } = mechanics
const { getGuidance, guidePath, segmentClear } = load('guidance.ts', { './mechanics': mechanics })
const page = fs.readFileSync(root + 'page.tsx', 'utf8')
const levels = vm.runInNewContext(page.match(/const LEVELS: Level\[\] = ([\s\S]*?)\n\nconst helperMeta/)[1])
let groups = 0
function test(name, fn) { fn(); groups++; console.log('PASS', name) }
function ready(level) { const s = createJourney(level); s.orbs.forEach(o => { o.found = true }); return s }

test('Collect nearest remaining light; do not prematurely escort; projection is pure', () => {
  for (const level of levels) {
    const s = createJourney(level), before = JSON.stringify(s)
    const g = getGuidance(s, level, false)
    assert.equal(g.state, 'collect'); assert.equal(g.remaining, level.requiredLight)
    assert.equal(dist(s.player, g.target), Math.min(...s.orbs.map(o => dist(s.player, o))))
    assert.equal(g.canCall, false); assert.equal(JSON.stringify(s), before)
    s.orbs.find(o => o.id === g.target.id).found = true
    assert.notEqual(getGuidance(s, level, false).target.id, g.target.id)
  }
})
test('Strict reach boundaries match normal, empty shield, shield, helper and call', () => {
  const level = levels[0]
  for (const [base, wide] of [[ready(level), false], [ready(level), true], [{ ...ready(level), energy: 0 }, true], [activateHelper(ready(level)), false], [callLamb(ready(level)), false]]) {
    const radius = guideRadius(base, wide)
    const s = { ...base, player: { x: 30, y: 30 }, lamb: { x: 30 + radius, y: 30 } }
    assert.equal(getGuidance(s, level, wide).state, 'return')
    assert.equal(stepJourney(s, level, { wide }, .01).lamb.x, s.lamb.x)
    s.lamb.x -= .1
    assert.equal(getGuidance(s, level, wide).state, 'wait')
    assert.ok(stepJourney(s, level, { wide }, .01).lamb.x < s.lamb.x)
  }
})
test('Call advice requires available call and actual extended reach', () => {
  const level = levels[0], s = { ...ready(level), player: { x: 20, y: 20 }, lamb: { x: 45, y: 20 } }
  assert.equal(getGuidance(s, level, false).canCall, true)
  assert.equal(getGuidance({ ...s, callCooldown: 1 }, level, false).canCall, false)
  assert.equal(getGuidance({ ...s, lamb: { x: 54, y: 20 } }, level, false).canCall, false)
  assert.notEqual(getGuidance(callLamb(s), level, false).state, 'return')
})
test('Wait allows catch-up before resuming; gate advice never abandons an out-of-reach lamb', () => {
  const level = levels[0]
  let s = { ...ready(level), player: { x: 30, y: 20 }, lamb: { x: 43, y: 20 }, moving: true }
  assert.equal(getGuidance(s, level, false).state, 'wait')
  for (let i = 0; i < 24; i++) s = stepJourney(s, level, {}, 1 / 60)
  assert.equal(getGuidance(s, level, false).state, 'escort')
  s.player = { ...level.gate }; s.lamb = { x: level.gate.x + 12, y: level.gate.y }
  assert.equal(getGuidance(s, level, false).state, 'home')
  s.lamb.x += 10
  assert.equal(getGuidance(s, level, false).state, 'return')
})
test('Routes go around actual hazard circles and refuse unsafe endpoints', () => {
  const hazards = [{ x: 50, y: 50, r: 9, id: 1, kind: 'fog' }]
  const route = guidePath({ x: 20, y: 50 }, { x: 80, y: 50 }, hazards)
  assert.ok(route.length > 2)
  for (let i = 1; i < route.length; i++) assert.ok(segmentClear(route[i - 1], route[i], hazards))
  assert.equal(guidePath(hazards[0], { x: 80, y: 50 }, hazards).length, 0)
  assert.equal(guidePath({ x: 20, y: 50 }, hazards[0], hazards).length, 0)
  assert.equal(JSON.stringify(route), JSON.stringify(guidePath({ x: 20, y: 50 }, { x: 80, y: 50 }, hazards)))
})
test('Following only suggested waypoints/waits wins all trails without shield, helper, Calm Mode or damage', () => {
  for (const level of levels) {
    let s = createJourney(level), frames = 0, waits = 0
    while (s.result === 'play' && frames++ < 12000) {
      const g = getGuidance(s, level, false)
      const path = g.target ? guidePath(s.player, g.target, level.hazards) : []
      if (g.target) assert.ok(path.length > 1, `${level.id}: route missing in ${g.state}`)
      else waits++
      s = stepJourney(s, level, { target: path[1] }, 1 / 60)
    }
    assert.equal(s.result, 'won', `${level.id}: bounded guide completion`)
    assert.equal(s.hits, 0, level.id); assert.ok(waits > 0, level.id)
    assert.equal(getGuidance(s, level, false).state, 'done')
    assert.equal(getGuidance(retryJourney(s, level), level, false).remaining, 0)
    console.log(`  ${level.id}: ${frames} frames, ${waits} catch-up frames, no damage`)
  }
})
test('UI wiring retains optional map, Joseph map semantics, localization and valid TSX syntax', () => {
  const result = ts.transpileModule(page, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true })
  assert.equal(result.diagnostics.length, 0)
  for (const marker of ['aria-pressed={showGuide}', "level.helper === 'joseph' && helperActive", 'data-guide-state={guidance.state}', 'Show guide', 'Покажи путь', 'guidePath(player, guidance.target, level.hazards)', 'guidance={guidance} route={route} mapVisible={mapVisible}']) assert.ok(page.includes(marker), marker)
})
console.log(`${groups} Shepherd pass9 groups passed`)
