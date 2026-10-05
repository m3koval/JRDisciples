import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import { ARRIVAL_MS, moveDefender, recoveryEnergy, stepGuard, waveOutcome, hasExited } from '../app/games/shield-of-faith/rules.ts'
import { drawCourt, drawShield, drawArrival } from '../app/games/shield-of-faith/art.ts'
const root = new URL('../app/games/shield-of-faith/', import.meta.url)
const page = fs.readFileSync(new URL('page.tsx', root), 'utf8')
let checks = 0
function check(name, fn) { fn(); checks++; console.log('PASS', name) }
check('guard movement clamps after slowdown at all four boundaries', () => {
  for (const guarding of [false, true]) {
    assert.deepEqual(moveDefender(18,18,-3,-3,guarding,400,600,18),{x:18,y:18})
    assert.deepEqual(moveDefender(382,582,3,3,guarding,400,600,18),{x:382,y:582})
  }
  assert.equal(moveDefender(100,100,4,0,true,400,600,18).x,102.2)
})
check('recovery provides a usable shield without removing stronger reserves', () => {
  assert.equal(recoveryEnergy(0),50); assert.equal(recoveryEnergy(80),80)
  assert.equal(recoveryEnergy(150),100)
})
check('all changed TS/TSX files parse and transpile in isolation', () => {
  for (const fileName of ['page.tsx','rules.ts','art.ts']) {
    const result = ts.transpileModule(fs.readFileSync(new URL(fileName,root),'utf8'), {fileName, reportDiagnostics:true, compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}})
    assert.deepEqual(result.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error),[])
  }
})
// Exercise the actual tick body with isolated in-memory refs: no React/browser/build.
const tickSource = page.split('const tick = useCallback(')[1].split('}, [spawnDart])')[0] + '}'
const body = ts.transpileModule(`const tick = ${tickSource}`,{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText + '; return tick'
function arena(dart) {
  const ref = current => ({current})
  const env = { playerRef:ref({x:200,y:300,vx:0,vy:0,hp:3,maxHp:3,invMs:0,shieldCharges:0,armor:new Set(),speed:3.2,piercing:false}), dartsRef:ref([dart]), bulletsRef:ref([]),powerupsRef:ref([]),particlesRef:ref([]),waveRef:ref(0),W:ref(400),H:ref(600),cueRef:ref({kind:'start',ms:100}),prevPlayerRef:ref({x:200,y:300}),keysRef:ref(new Set()),joyVecRef:ref({dx:0,dy:0}),joyRef:ref({active:false}),guardRef:ref({active:false,energy:0}),guardHeldRef:ref(false),guardPointerRef:ref(null),pointerIdRef:ref(null),scoreRef:ref(0),dartsKilledRef:ref(0),fireTimerRef:ref(0),spawnTimerRef:ref(0),dartsLeftRef:ref(1),stateRef:ref('playing'),bestRef:ref(0),PLAYER_R:18,FIRE_RATE:320,BULLET_SPEED:9,DART_SPAWN_MS:2000,VERSES_EN:Array(10),stepGuard,waveOutcome,hasExited,moveDefender,recoveryEnergy,burst(){},spawnDart(){},setBestScore(){},setUiState(){},setPracticeAnswer(){},setVerseIdx(){},setArmorToast(){} }
  const tick = new Function(...Object.keys(env),body)(...Object.values(env))
  return {env,tick}
}
check('arrival warnings neither move nor damage player or consume a guard', () => {
  const d={id:1,x:200,y:300,vx:1,vy:0,r:18,hp:1,warningMs:ARRIVAL_MS}
  const {env,tick}=arena(d); env.guardHeldRef.current=true;env.guardRef.current.energy=100
  tick(16)
  assert.equal(d.x,200);assert.equal(d.warningMs,ARRIVAL_MS-16)
  assert.equal(env.dartsRef.current.length,1);assert.equal(env.playerRef.current.hp,3)
})
check('active dart hit gives recovery window and energy exactly once', () => {
  const {env,tick}=arena({id:1,x:200,y:300,vx:0,vy:0,r:18,hp:1,warningMs:0})
  tick(16);assert.equal(env.playerRef.current.hp,2);assert.equal(env.playerRef.current.invMs,1800)
  assert.equal(env.guardRef.current.energy,50);assert.equal(env.cueRef.current.kind,'recover')
  tick(16);assert.equal(env.playerRef.current.hp,2)
})
check('warning expiration enables a real shield block and wave completion', () => {
  const {env,tick}=arena({id:1,x:200,y:300,vx:0,vy:0,r:18,hp:1,warningMs:16})
  env.guardHeldRef.current=true;env.guardRef.current.energy=100;env.dartsLeftRef.current=0
  tick(16);assert.equal(env.dartsRef.current.length,0);assert.equal(env.scoreRef.current,15)
  assert.equal(env.playerRef.current.hp,3);assert.equal(env.stateRef.current,'verse')
  assert.equal(env.guardHeldRef.current,false);assert.equal(env.guardPointerRef.current,null)
})
check('duplicate armor cannot stack speed or award score', () => {
  const {env,tick}=arena({id:1,x:0,y:0,vx:0,vy:0,r:18,hp:1,warningMs:ARRIVAL_MS})
  env.playerRef.current.armor.add('boots')
  env.powerupsRef.current=[{id:2,x:200,y:300,vy:0,type:'boots',pulse:0}]
  tick(16);assert.equal(env.playerRef.current.speed,3.2);assert.equal(env.scoreRef.current,0)
  assert.equal(env.powerupsRef.current.length,0)
})
check('canvas art routines keep geometry finite at phone and tablet sizes', () => {
  const calls=[]
  const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'?()=>({addColorStop(){}}):(...args)=>calls.push(args),set:()=>true})
  for (const [w,h] of [[320,568],[1024,768],[768,1024]]) {drawCourt(ctx,w,h);drawShield(ctx,w/2,h/2,32,true);drawArrival(ctx,28,120,1,.5)}
  assert.ok(calls.length>0);assert.ok(calls.flat().filter(v=>typeof v==='number').every(Number.isFinite))
})
console.log(`${checks} Shield pass7 groups passed (not browser or visual QA)`)
