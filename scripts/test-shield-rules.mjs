import assert from 'node:assert/strict'
import { WAVE_SIZES, stepGuard, waveOutcome, hasExited, safeBest } from '../app/games/shield-of-faith/rules.ts'
import { VERSES_EN, VERSES_RU, PRACTICE } from '../app/games/shield-of-faith/scripture.ts'
let checks = 0
function check(name, fn) { fn(); checks++; console.log('PASS', name) }
check('all ten waves progress after last kill, deflection, collision or dodge', () => {
 for(let w=0;w<WAVE_SIZES.length;w++) {
  assert.equal(waveOutcome(1,0,0,w),w===9?'victory':'verse')
  assert.equal(waveOutcome(1,1,0,w),'playing')
  assert.equal(waveOutcome(1,0,1,w),'playing')
  assert.equal(waveOutcome(0,0,0,w),'dead')
 }
})
check('guard drains, recharges only on release and clamps spikes', () => {
 let e=100;for(let i=0;i<1000;i++)e=stepGuard(e,true,16,false).energy
 assert.equal(e,0);assert.deepEqual(stepGuard(e,true,16,false),{active:false,energy:0})
 for(let i=0;i<250;i++)e=stepGuard(e,false,16,false).energy
 assert.equal(e,100)
 assert.equal(stepGuard(100,true,100000,false).energy,96.6)
 assert.ok(stepGuard(100,true,100,true).energy>stepGuard(100,true,100,false).energy)
})
check('guard rate does not depend on frame size', () => {
 let a=100,b=100;for(let i=0;i<60;i++)a=stepGuard(a,true,16,false).energy
 for(let i=0;i<30;i++)b=stepGuard(b,true,32,false).energy
 assert.ok(Math.abs(a-b)<1e-8)
})
check('spawn margin retained but escaped darts removed on all sides', () => {
 assert.equal(hasExited({x:10,y:-18,r:18},768,1024),false)
 for(const [x,y] of [[-80,400],[850,400],[200,-80],[200,1100]])assert.equal(hasExited({x,y,r:18},768,1024),true)
})
check('corrupt and blocked best storage cannot create NaN', () => {
 for(const value of [null,'bad','NaN','Infinity','-5'])assert.equal(safeBest(value),0)
 assert.equal(safeBest('35'),35)
})
check('every wave has paired Scripture and practical response', () => {
 assert.equal(VERSES_EN.length,10);assert.equal(VERSES_RU.length,10);assert.equal(PRACTICE.length,10)
 assert.ok(VERSES_EN.every(v=>v.ref.includes('ESV')))
 assert.ok(VERSES_RU.every(v=>v.ref.includes('Синодальный')))
})
console.log(`${checks} shield rule groups passed`)
