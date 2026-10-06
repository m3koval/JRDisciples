import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import vm from 'node:vm'
const root=new URL('./',import.meta.url)
const world=fs.readFileSync(new URL('trail-world.tsx',root),'utf8')
const sling=fs.readFileSync(new URL('page.tsx',root),'utf8')
const runner=fs.readFileSync(new URL('../truth-runner/page.tsx',root),'utf8')
// Test the actual authored placements, not a parallel fixture list.
const match=world.match(/const placements=runner\?(\[.*\]):(\[.*\])/)
assert.ok(match)
const runnerTrees=JSON.parse(match[1]),slingTrees=JSON.parse(match[2])
for(const [x] of runnerTrees) assert.ok(x+Math.SQRT2*16<18 || x-Math.SQRT2*16>82,'rotated crown must clear steering lane')
for(const [,y] of slingTrees) assert.ok(y+14.5<30 || y-14.5>75,'throw corridor must clear oak bounds')
assert.ok(world.indexOf('renderer.render(scene,camera)')<world.indexOf("report('ready')"))
assert.match(world,/loaded&&!announced&&rect.width>0&&rect.height>0/)
assert.match(world,/webglcontextlost/)
assert.match(world,/if\(dead\)\{dispose\(\[result.scene\]\)/)
for(const name of ['choosePower','tapRhythm','holdSpin','releaseThrow']) {
 const fn=sling.slice(sling.indexOf('function '+name));assert.match(fn.slice(0,330),/!worldReady.current/)
}
assert.match(sling,/pausedRef.current \|\| !worldReady.current/)
assert.match(runner,/if\(!active \|\| worldStatus!=='ready'\) return/)
assert.match(runner,/\[active,worldStatus\]/)
// Execute the existing authority with paused state: loading must never require
// replacing its save/score contract. Also check scoring boundary behavior.
const load=(url)=>{const box={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(url,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,box);return box.exports}
const engine=load(new URL('../truth-runner/engine.ts',root)),mechanics=load(new URL('mechanics.ts',root))
let run=engine.pause(engine.beginStage(engine.createRun()))
const snapshot=JSON.stringify(run)
for(let i=0;i<120;i++)run=engine.advance(run,{axis:1},1/60)
assert.equal(JSON.stringify(run),snapshot)
assert.equal(mechanics.resolveShot(42,42,0,17,false).result,'perfect')
console.log('PASS refinement A: authored oak clearance; rendered-frame readiness/source gates; context-loss and late-load cleanup contracts; paused authority and sling score regression. Not WebGL/browser evidence.')
