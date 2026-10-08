import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const source = fs.readFileSync(new URL('./flight.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const m = { exports: {} }; new Function('module','exports', compiled)(m,m.exports)
const { newFlight, advance, SITES, releaseFlightInputs, dismissCelebration } = m.exports
const idle = { x:0,y:0,shield:false,rescue:false }
function ticks(s,c,n) { for(let i=0;i<n;i++) advance(s,c,1/60) }
test('fresh mission is deterministic and has no outgoing player weapons',()=>{assert.deepEqual(newFlight(),newFlight()); const s=newFlight(); ticks(s,idle,100); assert.equal(s.blocks,0); assert.equal(s.darts.length,0)})
test('negative/nonfinite time does not alter authority',()=>{const s=newFlight(),before=structuredClone(s); advance(s,idle,-1);advance(s,idle,NaN);assert.deepEqual(s,before)})
test('flight clamps all boundaries and giant deltas',()=>{const s=newFlight();ticks(s,{...idle,x:999,y:-999},500);assert.equal(s.x,9);assert.equal(s.y,-11);const time=s.time;advance(s,idle,1000);assert.ok(s.time-time<.041)})
test('landing waits, wrong position cannot rescue, hold requires time',()=>{const s=newFlight(); s.distance=100;ticks(s,{...idle,rescue:true},120);assert.equal(s.rescued[0],false);assert.equal(s.distance,100);s.x=-6;ticks(s,{...idle,rescue:true},40);assert.equal(s.rescued[0],false);ticks(s,{...idle,rescue:true},50);assert.equal(s.rescued[0],true);assert.equal(s.checkpoint,120)})
test('broad shield intercepts; absent shield lets a threat pass',()=>{for(const shield of [false,true]){const s=newFlight();s.darts=[{id:1,x:4,z:-1.5,vx:0,vz:0}];advance(s,{...idle,shield},1/60);assert.equal(s.blocks,shield?1:0)}})
test('convoy damage gives grace and recovery preserves rescued families',()=>{const s=newFlight();s.distance=170;s.checkpoint=120;s.rescued[0]=true;s.hull=1;s.darts=[{id:1,x:0,z:-154,vx:0,vz:0}];advance(s,idle,1/60);assert.equal(s.recoveries,1);assert.equal(s.distance,120);assert.equal(s.hull,5);assert.equal(s.rescued[0],true);assert.equal(s.darts.length,0)})
test('timed controls complete all rescues and disable both boss phases',()=>{
 const s=newFlight();let frames=0;const phases=new Set();
 while(!s.won && frames++<14000){
  if(s.celebration) { dismissCelebration(s); advance(s,idle,1/60) }
  const site=SITES.find((p,i)=>!s.rescued[i]&&Math.abs(s.distance-p.at)<19);
  const target=site?site.x:m.exports.convoyX(s.distance);
  const incoming=s.darts.some(d=>!(d.warning>0)&&Math.abs(d.x-s.x)<5.2&&Math.abs(d.z+s.distance-(s.y-3.5))<2.1);
  if(s.bossActive)phases.add(s.bossHealth>3?1:2);
  advance(s,{x:Math.max(-1,Math.min(1,target-s.x)),y:Math.max(-1,Math.min(1,-s.y)),shield:!site&&incoming,rescue:!!site},1/60)
 }
 assert.equal(s.won,true,JSON.stringify(s));assert.deepEqual(s.rescued,[true,true,true]);assert.equal(s.bossHealth,0);assert.equal(s.upgrades,3);assert.ok(s.perfects>=6);assert.deepEqual([...phases],[1,2]);assert.equal(s.recoveries,0);
 console.log(`Mission: ${frames} frames, ${s.blocks} blocks, ${s.perfects} perfects, ${s.recoveries} recoveries`);
 const before=structuredClone(s);advance(s,idle,1);assert.deepEqual(s,before)
})
test('holding cannot permanently guard or recharge an exhausted shield',()=>{const s=newFlight();ticks(s,{...idle,shield:true},220);assert.equal(s.energy,0);assert.equal(s.shield,false);assert.equal(s.exhausted,true);ticks(s,{...idle,shield:true},120);assert.equal(s.energy,0);ticks(s,idle,40);assert.equal(s.exhausted,true);ticks(s,idle,40);assert.equal(s.exhausted,false);assert.ok(s.energy>=32)})
test('released shield recharges but raised shield drains',()=>{const s=newFlight();s.energy=50;advance(s,idle,.04);assert.ok(s.energy>50);const e=s.energy;advance(s,{...idle,shield:true},.04);assert.ok(s.energy<e)})
test('warnings neither move nor damage nor reward even at collision positions',()=>{for(const z of [-1.5,16]){const s=newFlight();s.darts=[{id:1,x:0,z,vx:50,vz:50,warning:1}];ticks(s,{...idle,shield:true},30);assert.equal(s.hull,5);assert.equal(s.blocks,0);assert.equal(s.darts[0].x,0);assert.equal(s.darts[0].z,z)}})
test('three progression stages emit distinct visible warning patterns',()=>{const signatures=[];for(const distance of [30,150,300]){const s=newFlight();s.distance=distance;s.spawn=0;advance(s,idle,1/60);assert.ok(s.darts.every(d=>d.warning>=.98&&d.z+s.distance===-14));signatures.push([s.pattern,s.darts.length])}assert.deepEqual(signatures,[['pair',2],['sweep',3],['pincer',4]])})
test('celebration freezes all simulation and dismissal grants nothing',()=>{const s=newFlight();s.distance=100;s.x=-6;ticks(s,{...idle,rescue:true},90);assert.equal(s.celebration,1);const before=structuredClone(s);ticks(s,{x:1,y:1,shield:true,rescue:true},600);assert.deepEqual(s,before);dismissCelebration(s);assert.equal(s.upgrades,1);assert.equal(s.inputReset,true);ticks(s,{...idle,shield:true,rescue:true},10);assert.equal(s.shield,false);assert.equal(s.upgrades,1);assert.equal(s.perfects,0)})
test('return feedback requires real perfect collision and expires without bonus damage',()=>{const s=newFlight();s.distance=440;s.rescued=[true,true,true];advance(s,{...idle,shield:true},1/60);assert.equal(s.returnTime,0);ticks(s,idle,40);collision(s);advance(s,{...idle,shield:true},1/60);assert.equal(s.bossHealth,5);assert.ok(s.returnTime>0);ticks(s,idle,24);assert.equal(s.returnTime,0);assert.ok(s.bossImpact>0);ticks(s,idle,45);assert.equal(s.bossImpact,0);assert.equal(s.bossHealth,5);assert.equal(s.perfects,1)})
function collision(s){s.darts=[{id:s.nextId++,x:s.x,z:-s.distance+s.y-3.5,vx:0,vz:0}]}
test('perfect is earned by a fresh rested press, not holding or rapid tapping',()=>{const s=newFlight();collision(s);advance(s,{...idle,shield:true},1/60);assert.equal(s.perfects,1);const e=s.energy;collision(s);advance(s,{...idle,shield:true},1/60);assert.equal(s.perfects,1);assert.ok(s.energy<e);advance(s,idle,1/60);collision(s);advance(s,{...idle,shield:true},1/60);assert.equal(s.perfects,1);ticks(s,idle,34);collision(s);advance(s,{...idle,shield:true},1/60);assert.equal(s.perfects,2)})
test('holding past timing window only gives normal block',()=>{const s=newFlight();ticks(s,{...idle,shield:true},25);collision(s);advance(s,{...idle,shield:true},1/60);assert.equal(s.blocks,1);assert.equal(s.perfects,0)})
test('recovery and pause disarm held controls without granting rewards',()=>{const s=newFlight();s.hull=0;s.rescueProgress=.8;s.perfectWindow=.2;advance(s,{...idle,shield:true,rescue:true},1/60);assert.equal(s.inputReset,true);assert.equal(s.perfectWindow,0);assert.equal(s.rescueProgress,0);ticks(s,{...idle,shield:true,rescue:true},10);assert.equal(s.shield,false);assert.equal(s.perfects,0);advance(s,idle,1/60);assert.equal(s.inputReset,false);releaseFlightInputs(s);assert.equal(s.perfectWindow,0);assert.equal(s.inputReset,true)})
test('family upgrades are earned once and replay clears all progression',()=>{const s=newFlight();s.distance=100;s.x=-6;ticks(s,{...idle,rescue:true},90);assert.equal(s.upgrades,1);ticks(s,{...idle,rescue:true},90);assert.equal(s.upgrades,1);dismissCelebration(s);ticks(s,idle,100);assert.equal(s.energy,125);const fresh=newFlight();assert.equal(fresh.upgrades,0);assert.equal(fresh.celebration,0);assert.equal(fresh.returnTime,0);assert.equal(fresh.bossHealth,6);assert.equal(fresh.blocks,0);assert.equal(fresh.perfects,0);assert.equal(fresh.shield,false);assert.equal(fresh.rescueProgress,0)})
test('distance and rescues alone never win; ordinary blocks do not hurt boss',()=>{const s=newFlight();s.distance=465;s.rescued=[true,true,true];s.upgrades=3;advance(s,idle,1/60);assert.equal(s.won,false);assert.equal(s.bossActive,true);ticks(s,{...idle,shield:true},30);collision(s);advance(s,{...idle,shield:true},1/60);assert.equal(s.bossHealth,6);ticks(s,idle,40);collision(s);advance(s,{...idle,shield:true},1/60);assert.equal(s.bossHealth,5)})
