import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
function load(path){const box={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,box);return box.exports}
const sling=load('app/games/david-sling-challenge/mechanics.ts');
for(const wind of [-14,0,14])for(const target of [28,65,350]){
 const angle=target-wind;
 assert.equal(sling.releaseError(angle,target,wind),0);
 assert.equal(sling.resolveShot(angle,target,wind,10,false).result,'perfect');
 assert.ok(sling.releaseError(angle+12,target,wind)>0);
 assert.ok(sling.releaseError(angle-12,target,wind)<0);
}
const engine=load('app/games/truth-runner/engine.ts');
let r=engine.beginStage(engine.createRun());
for(let i=0;i<20000&&r.status==='running';i++){
 const next=engine.course(r.stage).find(x=>x.kind==='light'&&!r.resolved.includes(x.id));
 r=engine.advance(r,{axis:0,target:next?.x},1/60*.72);
}
assert.equal(r.status,'checkpoint');assert.equal(r.collected,10);assert.equal(r.lives,3);
for(const asset of ['michael.glb','rock_moss_a.glb','grove-oak.glb','rocky_trail_albedo.jpg'])assert.ok(fs.statSync('public/games/faithful-archer-3d/'+asset).size>0);
console.log('PASS A: wind-correct timing / early-late signs, gentle-pace full trail with 10 lights and 3 hearts, four owned asset dependencies');
