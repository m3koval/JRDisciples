import assert from 'node:assert/strict'
import fs from 'node:fs'
import { drawBlockImpact, drawArrival } from './art.ts'
import { drawGuardReadability } from './readability.ts'
const calls = []
const ctx = new Proxy({}, {get:(_,key)=>(...args)=>calls.push([key,...args]),set:()=>true})
drawBlockImpact(ctx, 200, 300, 0, false)
assert.equal(calls.length, 0)
for (const ru of [true,false]) for (const remaining of [850,425,1]) drawBlockImpact(ctx,200,300,remaining,ru)
assert.ok(calls.some(c=>c.includes('Blocked +15')))
assert.ok(calls.some(c=>c.includes('Защищено +15')))
assert.ok(calls.filter(c=>c[0]==='arc').every(c=>c.slice(1).filter(v=>typeof v==='number').every(Number.isFinite)))
assert.equal(calls.filter(c=>c[0]==='save').length, calls.filter(c=>c[0]==='restore').length)
drawArrival(ctx,28,120,Math.PI / 3,.5)
assert.ok(calls.some(c=>c[0]==='lineTo' && c[1]===74))
assert.deepEqual(calls.filter(c=>c[0]==='setLineDash').at(-1), ['setLineDash',[]])
const page = fs.readFileSync(new URL('page.tsx',import.meta.url),'utf8')
// Canvas helper regressions remain protected below. The route now uses the
// flight authority and localized DOM cues, not the superseded canvas arena.
assert.ok(page.includes("import { advance, newFlight, SITES } from './flight'"))
assert.ok(page.includes("block: ['Intercepted! The rescue boat is safe.', 'Перехвачено! Лодка в безопасности.']"))
for (const [x,y] of [[-20,200],[410,200],[230,862],[150,-20]]) {
  drawBlockImpact(ctx,x,y,850,true,390,844)
  const label = calls.filter(c=>c[0]==='fillText').at(-1)
  assert.ok(x+label[2]>=64 && x+label[2]<=326)
  assert.ok(y+label[3]>=124 && y+label[3]<=732)
}
assert.ok(page.includes('role="status">{cue}'))
for (const [width,height] of [[390,844],[1024,768],[844,390]]) {
  for (const [x,y] of [[18,120],[width-18,200],[width-18,height-18],[18,height-18],[width/2,height/2]]) {
    for (const ru of [true,false]) for (const active of [true,false]) {
      drawGuardReadability(ctx,x,y,100,active,null,ru,width,height)
      const plaque = calls.filter(c=>c[0]==='roundRect').at(-1)
      const text = calls.filter(c=>c[0]==='fillText').at(-1)
      assert.ok(plaque[1]>=8 && plaque[1]+plaque[3]<=width-8)
      assert.ok(plaque[2]>=112 && plaque[2]+plaque[4]<=height-157)
      assert.equal(text[2],plaque[1]+43)
      assert.equal(text[3],plaque[2]+15)
      assert.equal(text[1],`${active ? (ru?'ЩИТ':'GUARD') : (ru?'ЗАРЯД':'ENERGY')} 100%`)
    }
  }
}
assert.equal(calls.filter(c=>c[0]==='save').length,calls.filter(c=>c[0]==='restore').length)
console.log('PASS preserved legacy canvas helper regressions plus replacement flight cue wiring; 60 edge-safe badge cases')
