import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as T from 'three'
const box={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL('./projection.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,box)
for(const [w,h] of [[366,666],[740,590],[320,700],[1024,450]]){
 const p=box.exports.runnerProjection(w,h),c=new T.OrthographicCamera(-50,50,p.worldHeight/2,-p.worldHeight/2,.1,2000)
 c.position.set(50,p.worldHeight/2,600);c.lookAt(50,p.worldHeight/2,0);c.updateMatrixWorld()
 const project=(x,y)=>new T.Vector3(x,p.y(y),2).project(c)
 for(const x of [18,32.8,50,82])for(const y of [-12,0,49,78,96]){const q=project(x,y);assert.ok(Math.abs((q.x+1)*50-x)<1e-8);assert.ok(Math.abs((1-q.y)*50-y)<1e-8)}
 assert.ok(Math.abs(w/100-h/p.worldHeight)<1e-10,'isotropic pixels per world unit')
}
console.log('PASS aspect: isotropic models; authoritative player/item screen mapping across four canvas aspects')
