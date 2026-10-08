import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const root = 'app/games/spot-the-difference/'
const url = src => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(src, {compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64')
const scenesUrl = url(fs.readFileSync(root+'scenes.ts','utf8').replace("import objects from './object-edits.json'",'const objects = '+fs.readFileSync(root+'object-edits.json','utf8')))
const {SCENES} = await import(scenesUrl)
const {reducer,findAt,hitsObject} = await import(url(fs.readFileSync(root+'game.ts','utf8').replace("from './scenes'",`from '${scenesUrl}'`)))
const page = fs.readFileSync(root+'page.tsx','utf8')
const expression = page.match(/else setMessage\((scene\.differences\.some[^\n]+)\)/)[1]
const classify = new Function('scene','state','hitsObject','x','y',`return ${expression}`)
for (let index=0;index<SCENES.length;index++) {
 const scene=SCENES[index], d=scene.differences[0]
 const state=reducer({version:2,scene:index,phase:'play',found:[]},{type:'find',id:d.id})
 assert.equal(findAt(state,...d.anchor),null)
 assert.equal(classify(scene,state,hitsObject,...d.anchor),'already')
 assert.equal(classify(scene,state,hitsObject,-1,-1),'miss')
 assert.equal(reducer(state,{type:'find',id:d.id}),state)
}
assert.ok(page.includes('Это отличие уже найдено'))
assert.ok(page.includes('You already found this difference'))
console.log('PASS duplicate feedback across all 8 authored scenes: already/miss/no duplicate award + EN/RU')
