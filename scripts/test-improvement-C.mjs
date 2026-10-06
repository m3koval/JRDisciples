import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import { nearestApproach, drawGuardReadability } from '../app/games/shield-of-faith/readability.ts'
import { courseTurn } from '../app/games/faith-over-giants/course.ts'
const threat={x:100,y:0,vx:-1,vy:0,r:10,warningMs:0}
assert.equal(nearestApproach([threat],0,0)?.distance,90)
assert.equal(nearestApproach([{...threat,vx:1}],0,0),null)
assert.equal(nearestApproach([{...threat,warningMs:500}],0,0),null)
assert.equal(nearestApproach([{...threat,x:500}],0,0),null)
console.log('PASS Shield approaching/receding/warning/distant threat semantics')
const ctx=new Proxy({}, {get:(_,key)=> (...args)=>{for(const a of args) if(typeof a==='number') assert.ok(Number.isFinite(a),String(key))},set:()=>true})
for(const active of [true,false])for(const energy of [0,15,100])for(const ru of [true,false]) drawGuardReadability(ctx,100,200,energy,active,threat,ru)
console.log('PASS Guard rendering finite for active/recharge/EN/RU states')
const state={obstacles:[2],resolve:1,fear:90,health:3,coins:0,strength:0}
assert.equal(courseTurn(state,{type:'advance',index:0},0,2).health,2)
assert.equal(courseTurn(state,{type:'rally'},0,2).health,3)
assert.deepEqual(state,{obstacles:[2],resolve:1,fear:90,health:3,coins:0,strength:0})
const choices=fs.readFileSync('app/games/faith-over-giants/TurnChoices.tsx','utf8')
assert.match(choices,/courseTurn\(state/); assert.match(choices,/onClick=\{act\}/)
console.log('PASS Giants previews reuse immutable canonical turn rules and route real actions')
const shepherd=fs.readFileSync('app/games/shepherd-light-adventure/page.tsx','utf8')
assert.match(shepherd,/showGuide, setShowGuide\] = useState\(true\)/)
assert.match(shepherd,/guidance.remaining === 0 && <svg/)
const trail=fs.readFileSync('app/games/trail-of-truth/AdventureFrame.tsx','utf8')
assert.match(trail,/if \(!entered\) return/);assert.match(trail,/\[attempt, entered\]/);assert.match(trail,/onClick=\{\(\) => setEntered\(true\)\}/)
assert.match(trail,/__trailBlock\?\.ui/)
assert.ok(fs.existsSync('public/images/jr/games/faith-over-giants/expedition-landscape.svg'))
console.log('PASS Shepherd guidance/escort connection and Trail user-start/readiness/source asset wiring')
for(const dir of ['shepherd-light-adventure','shield-of-faith','faith-over-giants','trail-of-truth'])for(const name of fs.readdirSync('app/games/'+dir).filter(n=>/\.tsx?$/.test(n))){
 const path='app/games/'+dir+'/'+name
 const result=ts.transpileModule(fs.readFileSync(path,'utf8'),{fileName:path,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}})
 assert.equal(result.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error).length,0,path)
}
console.log('PASS all four owned directories TS/TSX syntax (not full type/build/browser QA)')
