import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const source = fs.readFileSync(new URL('../app/games/faith-over-giants/course.ts', import.meta.url), 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
const { courseTurn, nextObstacle, answerOrder, courseProgress, turnForecast } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
const initial = (obstacles = [2, 2]) => ({ obstacles, resolve: 3, fear: 16, health: 6, coins: 3, strength: 0 })
let s = initial()
assert.equal(courseTurn(s, { type: 'advance', index: 1 }, 0, 2), s, 'cannot skip obstacles')
let first = courseTurn(s, { type: 'advance', index: 0 }, 0, 2)
assert.deepEqual(s, initial(), 'pure transition')
assert.equal(first.resolve, 2)
assert.equal(first.obstacles[0], 1)
assert.equal(first.coins, 3)
first = courseTurn(first, { type: 'advance', index: 0 }, 0, 2)
assert.equal(first.coins, 4, 'one reward per cleared obstacle')
assert.equal(courseTurn(first, { type: 'advance', index: 0 }, 0, 2), first)
const empty = {...s, resolve: 0}
assert.equal(courseTurn(empty, {type: 'advance', index: 0}, 0, 2), empty)
assert.equal(courseTurn(empty, {type: 'rally'}, 0, 2).resolve, 1)
assert.equal(courseTurn(s, {type: 'rally'}, 0, 2).resolve, 3)
assert.equal(courseTurn({...s, fear: 99}, {type: 'advance', index: 0}, 9, 2).health, 5)
assert.equal(courseTurn({...s, strength: 3}, {type: 'advance', index: 0}, 0, 2).obstacles[0], 0)
for (let level=0; level<10; level++) {
  s=initial(Array(level===9?1:level+1).fill(level===9?12:2+Math.floor(level/3)))
  let turns=0
  while(nextObstacle(s.obstacles)>=0 && turns++<300) {
    s=courseTurn(s, s.resolve===0 || s.fear>55 ? {type:'rally'} : {type:'advance', index:nextObstacle(s.obstacles)}, level, 2)
  }
  assert.ok(turns<300, `level ${level+1} reachable`)
  assert.equal(s.health,6, 'careful strategy protects hearts')
  assert.equal(courseTurn(s,{type:'rally'},level,2),s,'final state stable')
  assert.deepEqual([...answerOrder(level)].sort(),[0,1,2])
}
s={...initial(Array(20).fill(12)),health:1,fear:99}
s=courseTurn(s,{type:'advance',index:0},9,2)
assert.equal(s.health,0)
assert.equal(courseTurn(s,{type:'rally'},9,2),s,'defeat cannot be bypassed')
console.log('PASS: 10 courses reachable; ordering, resolve, rally, pressure damage, power-up, one-time rewards, defeat/final guards, answer permutations.')
assert.equal(courseProgress([12], 12), 0)
assert.equal(courseProgress([11], 12), 8, 'boss progress responds to the first step')
assert.equal(courseProgress([0, 0], 2), 100)
assert.equal(courseProgress([], 2), 0)
const calm = { ...initial(), fear: 0 }
assert.equal(courseTurn(calm, { type: 'rally' }, 0, 2), calm, 'no-op rally must not acquire a UI action lock')
for (let level = 0; level < 10; level++) {
  for (let fear = 0; fear < 100; fear++) {
    const before = { ...initial([12]), fear }
    const preview = turnForecast(before, level, 2)
    const after = courseTurn(before, { type: 'advance', index: 0 }, level, 2)
    assert.equal(preview.losesHeart, after.health < before.health, 'forecast matches actual damage')
    const rallied = courseTurn(before, { type: 'rally' }, level, 2)
    assert.equal(preview.rallyRelief, before.fear - rallied.fear)
    assert.equal(preview.rallyResolve, rallied.resolve - before.resolve)
  }
}
// Prove the browser's real-input reckless recovery route reaches defeat.
let health = 6, healed = false, defeated = false
for (let level = 0; level < 10; level++) {
  s = { ...initial(Array(level === 9 ? 1 : level + 1).fill(level === 9 ? 12 : 2 + Math.floor(level / 3))), health }
  for (let turn = 0; turn < 400 && nextObstacle(s.obstacles) >= 0 && s.health > 0; turn++) {
    if (!healed && s.health < 6) { s.health = Math.min(6, s.health + 2); healed = true }
    s = courseTurn(s, s.resolve === 0 ? { type: 'rally' } : { type: 'advance', index: nextObstacle(s.obstacles) }, level, 2)
  }
  if (s.health === 0) { defeated = true; break }
  health = Math.min(6, s.health + 1)
}
assert.ok(healed && defeated, 'real reckless course path exercises healing and defeat')
const pageSource = fs.readFileSync(new URL('../app/games/faith-over-giants/page.tsx', import.meta.url), 'utf8')
const parsed = ts.transpileModule(pageSource, { fileName: 'page.tsx', reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 } })
assert.deepEqual(parsed.diagnostics, [], 'TSX syntax')
assert.ok(pageSource.includes('setCoins(checkpoint.current.coins)') && pageSource.includes('setHelpers(checkpoint.current.helpers)'), 'retry restores banked resources')
console.log('PASS: 1000 exact turn forecasts; partial/boss progress; real reckless defeat route; checkpoint resource guard; TSX syntax.')
