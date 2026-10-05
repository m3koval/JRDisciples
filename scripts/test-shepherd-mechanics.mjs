import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { createHash } from 'node:crypto'
const root = 'app/games/shepherd-light-adventure/'
const js = ts.transpileModule(fs.readFileSync(root + 'mechanics.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
const context = { exports: {} }; vm.runInNewContext(js, context)
const { createJourney, stepJourney, retryJourney, activateHelper, callLamb, guideRadius, dist } = context.exports
const page = fs.readFileSync(root + 'page.tsx', 'utf8')
const levels = vm.runInNewContext(page.match(/const LEVELS: Level\[\] = ([\s\S]*?)\n\nconst helperMeta/)[1])
const results = []
function test(name, fn) { fn(); results.push({ name, pass: true }); console.log('PASS', name) }
function tick(s, level, input, seconds) { for (let i = 0; i < Math.round(seconds * 60); i++) s = stepJourney(s, level, input, 1/60); return s }
test('Normalized movement; consistent 30/60/120Hz', () => {
 for (const rate of [30, 60, 120]) { let s=createJourney(levels[0]); for(let i=0;i<rate;i++) s=stepJourney(s,levels[0],{dx:1,dy:-1,calm:true},1/rate); assert.ok(Math.abs(dist(s.player,{x:18,y:82})-21)<.001) }
})
test('dt spike and invalid delta bounded', () => { const s=createJourney(levels[0]); const a=stepJourney(s,levels[0],{dx:1},100); assert.ok(dist(s.player,a.player)<=1.051); assert.equal(stepJourney(s,levels[0],{},NaN),s) })
test('Visible hazard radius matches actual collisions', () => { const l=levels[0], s=createJourney(l), h=l.hazards[0]; s.player={x:h.x,y:h.y}; const a=stepJourney(s,l,{},.05); assert.equal(a.hp,2); assert.ok(dist(a.player,h)>h.r); assert.equal(stepJourney({...a,player:h},l,{},.05).hp,2); assert.ok(page.includes('width: `${hazard.r * 2}%`')) })
test('Shield drains, release recharges, helper cooldown is simulation time', () => { const l=levels[0]; let s=createJourney(l); s.player={...l.hazards[0]}; s=tick(s,l,{wide:true},2); assert.equal(s.hp,3); assert.ok(s.energy<70); s.player={x:10,y:10}; const energy=s.energy; s=tick(s,l,{},1); assert.ok(s.energy>energy); s=activateHelper(s); assert.equal(s.helperTime,5); assert.equal(activateHelper(s),s); s=tick(s,l,{},13); assert.equal(s.helperCooldown,0) })
test('Three hits fail; checkpoint preserves light, refills protection, terminal freezes', () => { const l=levels[0]; let s=createJourney(l); s.orbs[0].found=true; for(let i=0;i<3;i++) { s={...s,player:{...l.hazards[0]},invulnerable:0}; s=stepJourney(s,l,{},.05) } assert.equal(s.result,'failed'); assert.equal(stepJourney(s,l,{dx:1},.05),s); const r=retryJourney(s,l); assert.equal(r.hp,3); assert.equal(r.orbs[0].found,true); assert.equal(r.result,'play'); assert.equal(r.time,s.time) })
test('Lamb follows continuously even stationary; separation and call radius work', () => { const l=levels[0]; let s=createJourney(l); s.orbs=s.orbs.map(o=>({...o,found:true})); s.player={x:60,y:24}; const before=s.lamb.x; s=tick(s,l,{wide:true},1); assert.ok(s.lamb.x<before); s.lamb={x:90,y:24}; s.player={x:60,y:24}; const stopped=tick(s,l,{},1); assert.equal(stopped.lamb.x,90); const called=tick(callLamb(s),l,{},1); assert.ok(called.lamb.x<90) })
test('All 3 trails collectible and winnable through real engine; next trail resets', () => {
 for(const l of levels) { let s=createJourney(l); function go(target, wide=false) { for(let i=0;i<1200 && dist(s.player,target)>.1;i++) s=stepJourney(s,l,{target,wide,calm:true},1/60) }
  for(const orb of l.orbs) go(orb); assert.equal(s.orbs.filter(o=>o.found).length,l.requiredLight)
  go(l.lambStart); s=tick(s,l,{calm:true,wide:true},1); go(l.gate,true); s=tick(s,l,{calm:true,wide:true},5)
  assert.equal(s.result,'won',l.id); assert.equal(stepJourney(s,l,{},.05),s)
 }
})
test('Pause cannot skip briefing/reward; recovery and controls phase guarded',()=> { assert.ok(page.includes("disabled={phase !== 'play' && phase !== 'paused'}")); assert.ok(page.includes("document.addEventListener('visibilitychange'")); assert.ok(page.includes('onPointerCancel={pointerUp}')); assert.ok(page.includes("closest('button, .sla-panel')")); assert.ok(page.includes('try { localStorage.setItem')); assert.ok(page.includes('data-hydrated={hydrated}')) })
test('Light ring and regroup guidance use the actual escort radius', () => {
 const s=createJourney(levels[0]); assert.equal(guideRadius(s,false),16); assert.equal(guideRadius(s,true),24)
 assert.equal(guideRadius({...s,energy:0},true),16); assert.equal(guideRadius(activateHelper(s),false),24); assert.equal(guideRadius(callLamb(s),false),34)
 assert.ok(page.includes('guideRadius(journey, lanternWide) * 2')); assert.ok(page.includes('dist(player, lamb) > guideRadius(journey, lanternWide)'))
})
test('Owned sprite motion follows actual input and stops at rest', () => {
 let s=createJourney(levels[0]); s=stepJourney(s,levels[0],{dx:1},1/60); assert.equal(s.facing,1); assert.equal(s.moving,true)
 s=stepJourney(s,levels[0],{},1/60); assert.equal(s.facing,1); assert.equal(s.moving,false)
 s=stepJourney(s,levels[0],{dy:-1},1/60); assert.equal(s.facing,2)
 assert.ok(page.includes('prefers-reduced-motion:reduce')); assert.ok(page.includes('background-position-x:0% !important'))
 const manifest=JSON.parse(fs.readFileSync('tools/shepherd/owned-sprites.json','utf8')); assert.equal(manifest.columns,9); assert.equal(manifest.rows,4)
 for(const asset of Object.values(manifest.assets)) {
  assert.ok(fs.statSync(asset.output).size>10000)
  assert.equal(createHash('sha256').update(fs.readFileSync(asset.source)).digest('hex'),asset.source_sha256)
  assert.equal(createHash('sha256').update(fs.readFileSync(asset.output)).digest('hex'),asset.sha256)
 }
})
if (process.env.JD_EVIDENCE) {
 fs.mkdirSync(process.env.JD_EVIDENCE,{recursive:true})
 fs.writeFileSync(`${process.env.JD_EVIDENCE}/deterministic.json`,JSON.stringify({groups:results.length,results},null,2))
 fs.writeFileSync(`${process.env.JD_EVIDENCE}/levels.json`,JSON.stringify(levels,null,2))
}
console.log(`${results.length} Shepherd groups passed`)
