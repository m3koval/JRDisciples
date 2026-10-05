import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const file = 'app/games/spot-the-difference/inspection.ts'
assert.ok(fs.existsSync(file), 'matched detail inspection module must exist')
const code = ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText
const {inspectionView, picturePoint, areaFor, moveCursor, AREA_LABELS} = await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))
let n=0
const test=(name,fn)=>{fn();console.log('PASS '+name);n++}
test('whole picture input and finite boundary handling',()=>{assert.deepEqual(inspectionView(false,0),{x:0,y:0,width:768,height:1024});assert.deepEqual(picturePoint(.5,.5,inspectionView(false,0)),{x:384,y:512});assert.equal(picturePoint(NaN,0,inspectionView(false,0)),null);assert.equal(picturePoint(-.01,.5,inspectionView(false,0)),null);assert.equal(picturePoint(1.1,.5,inspectionView(false,0)),null)})
test('nine overlapping detail windows cover every source pixel',()=>{for(let y=0;y<1024;y+=8)for(let x=0;x<768;x+=8)assert.ok(Array.from({length:9},(_,i)=>inspectionView(true,i)).some(v=>x>=v.x&&x<v.x+v.width&&y>=v.y&&y<v.y+v.height));assert.equal(AREA_LABELS.length,9);for(const name of AREA_LABELS)assert.ok(name.en&&name.ru)})
test('detail hit mapping stays aligned at all nine positions',()=>{for(let i=0;i<9;i++){const v=inspectionView(true,i);assert.equal(v.width,384);assert.equal(v.height,512);assert.deepEqual(picturePoint(.5,.5,v),{x:v.x+192,y:v.y+256});const right=picturePoint(1,1,v);assert.ok(right.x<768&&right.y<1024)}})
test('any actual object anchor can be brought inside detail view',()=>{const scenes=JSON.parse(fs.readFileSync('app/games/spot-the-difference/object-edits.json'));for(const s of scenes)for(const d of s.differences){const [x,y]=d.anchor;const area=areaFor(x,y);const v=inspectionView(true,area);assert.ok(x>=v.x&&x<=v.x+v.width&&y>=v.y&&y<=v.y+v.height)}})
test('keyboard inspection pointer is visible, bounded and fine-step capable',()=>{const v=inspectionView(true,8);assert.deepEqual(moveCursor({x:0,y:0},'ArrowRight',false,v),{x:v.x+4,y:v.y+4,visible:true});const p=moveCursor({x:700,y:900},'ArrowRight',true,v);assert.equal(p.x,704);assert.equal(p.y,900);assert.ok(moveCursor({x:766,y:1023},'ArrowRight',false,v).x<=764)})
console.log(`${n} Spot detail groups passed`)
