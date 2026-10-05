import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import vm from 'node:vm'
const source = fs.readFileSync('app/games/truth-runner/engine.ts', 'utf8')
const exports = {}
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText, { exports, Math, Number, Set })
const { createRun, beginStage, advance, pause, resume, STEP, COURSE_LENGTH, course, GOAL, safeBest, saveBest } = exports
let checks = 0
const test = (name, fn) => { fn(); checks++; console.log(`PASS ${name}`) }
function simulate(hz, seconds, input) { let s = beginStage(createRun()); for (let i = 0; i < hz * seconds; i++) s = advance(s, input, 1 / hz); return s }
test('same simulation at 30/60/120Hz', () => { const a = simulate(30, 3, { axis: 0 }); for (const hz of [60,120]) { const b = simulate(hz, 3, { axis: 0 }); assert.ok(Math.abs(a.distance - b.distance) < 0.001); assert.equal(a.lives,b.lives) } })
test('held steering moves continuously and clamps', () => { const s = simulate(60, 1, { axis: -1 }); assert.equal(s.x, 18); assert.equal(simulate(60,1,{axis:1}).x,82) })
test('pointer target steers without teleporting', () => { const s = advance(beginStage(createRun()), {axis:0,target:82}, STEP); assert.ok(s.x > 50 && s.x < 82) })
test('pause freezes all simulation and resume resets remainder', () => { let s = pause(simulate(60,2,{axis:0})); const same = advance(s,{axis:1},10); assert.equal(same,s); s = resume(s); assert.equal(s.remainder,0); assert.equal(s.status,'running') })
test('large elapsed time is bounded; invalid dt ignored', () => { const s = beginStage(createRun()); assert.ok(advance(s,{axis:0},10).distance <= 5); assert.equal(advance(s,{axis:0},NaN),s); assert.equal(advance(s,{axis:0},-1),s) })
test('all courses have reachable lights, no overlapping obstacles', () => { for(let stage=0;stage<4;stage++) { const rows=course(stage); assert.equal(rows.filter(x=>x.kind==='light').length,10); for(const l of rows.filter(x=>x.kind==='light')) assert.ok(!rows.some(x=>x.kind==='rock' && x.at===l.at && x.x===l.x)); } })
test('autopilot completes all four chapters with explicit stops', () => { let s=beginStage(createRun()); for(let stage=0;stage<4;stage++) { for(let i=0;i<10000 && s.status==='running';i++) { const next=course(stage).find(x=>x.kind==='light' && x.at>=s.distance); s=advance(s,{axis:0,target:next?.x ?? s.x},STEP) } assert.ok(s.collected>=GOAL); assert.equal(s.status,stage===3?'won':'checkpoint'); assert.ok(s.distance>=COURSE_LENGTH); if(stage<3) s=beginStage(s); } assert.equal(s.stage,3); assert.equal(s.score,400) })
test('missed goal fails and retry does not duplicate score', () => { let s=beginStage(createRun()); s={...s,x:18, distance:COURSE_LENGTH-0.1,collected:0,score:30}; s=advance(s,{axis:0},STEP); assert.equal(s.status,'lost'); const retry=beginStage(s); assert.equal(retry.score,0); assert.equal(retry.distance,0); assert.equal(retry.lives,3) })
test('terminal state cannot score twice',()=>{ let s=beginStage(createRun()); s={...s,distance:COURSE_LENGTH-0.1,collected:GOAL}; s=advance(s,{axis:0},STEP); assert.equal(advance(s,{axis:1},1),s) })
test('corrupt, blocked, and stale storage are safe',()=>{ for(const raw of ['-1','NaN','Infinity','12.5','garbage']) assert.equal(safeBest({getItem:()=>raw}).value,0); assert.equal(safeBest({getItem:()=>{throw Error('blocked')}}).available,false); const r=saveBest({getItem:()=> '20',setItem:()=>{throw Error('quota')}},80,60); assert.equal(r.value,80); assert.equal(r.available,false); let saved; assert.equal(saveBest({getItem:()=> '90',setItem:(_,v)=>{saved=v}},30,40).value,90); assert.equal(saved,'90') })
console.log(`${checks} deterministic Truth Runner tests passed`)
