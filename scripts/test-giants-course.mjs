import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const source = fs.readFileSync(new URL('../app/games/faith-over-giants/course.ts', import.meta.url), 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText
const { courseTurn, nextObstacle, answerOrder } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
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
