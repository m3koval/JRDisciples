import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const load = source => ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText
const engine = { exports: {} }
vm.runInNewContext(load(fs.readFileSync(path.join(root, 'app/games/manna-trail/mechanics.ts'), 'utf8')), { exports: engine.exports })
const m = engine.exports
let checks = 0
function test(name, fn) { fn(); checks++; console.log('PASS', name) }
test('full board returns null without calling randomness', () => assert.equal(m.freeCell([{x:0,y:0}], () => { throw Error('must not sample') }, 1), null))
test('one remaining square is always found', () => { for (const r of [0, .1, .99, 1]) assert.equal(JSON.stringify(m.freeCell([{x:0,y:0},{x:1,y:0},{x:0,y:1}], () => r, 2)), '{"x":1,"y":1}') })
test('safe tail-vacating collision and growing-body collision', () => { const s=[{x:1,y:1},{x:1,y:2},{x:0,y:2},{x:0,y:1}]; assert.equal(m.collides(s[3],s,[],false),false); assert.equal(m.collides(s[3],s,[],true),true); assert.equal(m.collides({x:-1,y:0},s,[],false),true) })
test('collision reason distinguishes boundary, rock, trail and vacating tail', () => {
 const snake=[{x:1,y:1},{x:1,y:2},{x:0,y:2},{x:0,y:1}]
 assert.equal(m.collisionReason({x:-1,y:1},snake,[],false),'edge')
 assert.equal(m.collisionReason({x:2,y:1},snake,[{x:2,y:1}],false),'rock')
 assert.equal(m.collisionReason(snake[1],snake,[],false),'trail')
 assert.equal(m.collisionReason(snake[3],snake,[],false),null)
 assert.equal(m.collisionReason(snake[3],snake,[],true),'trail')
 assert.equal(m.collisionReason({x:2,y:1},snake,[],false),null)
})
test('authored destinations and rocks remain disjoint at every level', () => { for(let l=1;l<=9;l++) for(let w=0;w<12;w++) { const s=m.initialTrail(), rocks=m.rocksForLevel(l), c=m.wordCell(l,w,s,rocks); assert.ok(c); assert.ok(![...s,...rocks].some(b=>m.sameCell(b,c))); } assert.equal(m.rocksForLevel(1).length,0); assert.equal(m.rocksForLevel(4).length,4); assert.equal(m.rocksForLevel(9).length,8) })
test('unreachable word placement terminates with null', () => assert.equal(m.wordCell(1,0,[{x:0,y:0}], [{x:1,y:0},{x:0,y:1}]),null))
test('storage unavailable, invalid, negative and stale values are safe', () => { assert.equal(m.readBest({getItem(){throw Error('blocked')}}),0); for(const value of ['NaN','-3','1.5','Infinity']) assert.equal(m.readBest({getItem:()=>value}),0); assert.equal(m.readBest({getItem:()=> '42'}),42); assert.equal(m.saveBest({setItem(){throw Error('quota')}},45),false) })
test('pointer ownership excludes secondary release and timing drops stalls', () => { assert.equal(m.ownsPointer(7,8),false); assert.equal(m.ownsPointer(7,7),true); assert.equal(m.ownsPointer(null,7),false); assert.equal(m.frameDelta(9000,100),0); assert.equal(m.frameDelta(116,100),16); assert.ok(m.tickDuration(9,true)>m.tickDuration(9,false)) })

// Exercise the actual page handlers and animation loop with deterministic browser primitives.
// Instrument only the in-memory test compilation; no production test API is exposed.
let source = fs.readFileSync(path.join(root, 'app/games/manna-trail/page.tsx'),'utf8')
source = source.replace('  // ─── Render', `  globalThis.__game = { startGame, recover, nextLevel, changePhase, onPointerDown, onPointerMove, onPointerUp, phaseRef, snakeRef, prevSnakeRef, dirRef, scoreRef, wordsGotRef, levelRef, wordTileRef, mannaRef, doveRef, slowUntilRef, clockRef, pointerRef, joyRef, joyVecRef, bestRef };\n  // ─── Render`)
const slots=[], pending=[]; let hook=0, now=0, raf, language='en'
const listeners={}
const context2d = new Proxy({}, { get(target,key) { if(key==='measureText') return () => ({width:35}); if(key==='createLinearGradient') return () => ({addColorStop(){}}); return target[key] ?? (()=>{}); }, set(target,key,val){target[key]=val; return true} })
const canvas={width:600,height:600,style:{},dataset:{},focus(){},getContext:()=>context2d}
const wrap={getBoundingClientRect:()=>({width:600,height:600,left:0,top:0})}
const jsx=(type,props)=>{ if(props?.ref) props.ref.current = type==='canvas'?canvas:wrap; return {type,props} }
const react={
 useState(init){const i=hook++; if(!(i in slots)) slots[i]=init; return [slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v}]},
 useRef(init){const i=hook++; if(!(i in slots)) slots[i]={current:init}; return slots[i]},
 useEffect(fn,deps){const i=hook++; const old=slots[i]; if(!old || deps.some((d,j)=>d!==old.deps[j])) { pending.push(()=>{old?.cleanup?.(); slots[i]={deps,cleanup:fn()} }); }}
}
const scope={exports:{},require(name){ if(name==='./mechanics')return m; if(name==='react')return react; if(name==='react/jsx-runtime')return {jsx,jsxs:jsx}; if(name==='next/link')return {default:'a'}; if(name.includes('LanguageContext'))return {useLanguage:()=>({language})}; throw Error(name)},
 performance:{now:()=>now}, requestAnimationFrame:fn=>{raf=fn;return 1}, cancelAnimationFrame(){}, ResizeObserver:class {observe(){} disconnect(){}},
 document:{hidden:false,addEventListener:(k,v)=>listeners[k]=v,removeEventListener(){}},
 window:{devicePixelRatio:1,matchMedia:()=>({matches:true}),addEventListener:(k,v)=>listeners[k]=v,removeEventListener(){},get localStorage(){throw Error('storage blocked')}}, console,
}
vm.createContext(scope); vm.runInContext(load(source),scope)
function render(){hook=0; scope.exports.default(); while(pending.length)pending.shift()(); return scope.__game}
let g=render()
function frame(ms=250){now+=ms; raf(now)}
function start(){g.startGame();g=render();frame(0)}
function collect(){ const target=g.wordTileRef.current; assert.ok(target); const from= target.x>0?{x:target.x-1,y:target.y}:{x:target.x+1,y:target.y}; g.snakeRef.current=[from];g.prevSnakeRef.current=[from];g.dirRef.current={x:target.x>0?1:-1,y:0};frame(250);g=render() }
test('actual page starts despite throwing localStorage and collects first authored word',()=>{start();for(let i=0;i<5;i++)frame();g=render();assert.equal(g.wordsGotRef.current,1);assert.equal(g.scoreRef.current,5)})
test('actual collision retains progress and recovery starts short',()=>{g.snakeRef.current=[{x:20,y:10}];g.dirRef.current={x:1,y:0};frame();g=render();assert.equal(g.phaseRef.current,'over');assert.equal(g.wordsGotRef.current,1);g.recover();g=render();assert.equal(g.phaseRef.current,'play');assert.equal(g.snakeRef.current.length,4);assert.equal(g.wordsGotRef.current,1);assert.equal(g.scoreRef.current,5)})
test('actual visibility pause freezes timers and requires manual resume',()=>{frame(0);g.slowUntilRef.current=g.clockRef.current+5000;const clock=g.clockRef.current;scope.document.hidden=true;listeners.visibilitychange();g=render();frame(10000);assert.equal(g.phaseRef.current,'paused');assert.equal(g.clockRef.current,clock);scope.document.hidden=false;listeners.visibilitychange();assert.equal(g.phaseRef.current,'paused');g.changePhase('play');g=render();frame(0);assert.equal(g.clockRef.current,clock)})
test('actual pointer handlers ignore second finger and release only owner',()=>{const e=(id,x=0)=>({pointerId:id,button:0,clientX:x,clientY:0,target:{closest:()=>null},currentTarget:{setPointerCapture(){}}});g.onPointerDown(e(1));g.onPointerDown(e(2));g.onPointerMove(e(2,80));assert.equal(g.joyVecRef.current,null);g.onPointerUp(e(2));assert.equal(g.pointerRef.current,1);g.onPointerMove(e(1,80));assert.ok(g.joyVecRef.current);g.onPointerUp(e(1));assert.equal(g.pointerRef.current,null)})
for(const lang of ['en','ru']) test(`actual ${lang} nine-verse progression, finite finale and replay`,()=>{language=lang;g=render();start();for(let level=1;level<=9;level++){let safety=0;while(g.phaseRef.current==='play' && safety++<20)collect();assert.equal(g.phaseRef.current,'levelUp');assert.equal(g.levelRef.current,level);const points=g.scoreRef.current;g.nextLevel();g=render();frame(0);assert.equal(g.scoreRef.current,points);if(level<9){assert.equal(g.phaseRef.current,'play');assert.equal(g.wordsGotRef.current,0);assert.equal(g.snakeRef.current.length,4)}}assert.equal(g.phaseRef.current,'won');assert.equal(g.levelRef.current,9);start();assert.equal(g.levelRef.current,1);assert.equal(g.scoreRef.current,0);assert.equal(g.wordsGotRef.current,0)})
console.log(`${checks} Manna Trail regression groups passed`)
