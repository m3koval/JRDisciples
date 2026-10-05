import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const root = 'app/games/spot-the-difference/'
const url = src => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(src, {compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64')
const scenesUrl = url(fs.readFileSync(root+'scenes.ts','utf8').replace("import objects from './object-edits.json'",'const objects = '+fs.readFileSync(root+'object-edits.json','utf8')))
const { SCENES } = await import(scenesUrl)
const {initialState,reducer,restore,findAt,hitsObject} = await import(url(fs.readFileSync(root+'game.ts','utf8').replace("from './scenes'",`from '${scenesUrl}'`)))
let checks=0
const test=(name,fn)=>{fn();checks++;console.log('PASS '+name)}
const act=(state,type,extra={})=>reducer(state,{type,...extra})
test('all eight retained stories have three actual object masks with EN/RU parity',()=>{assert.equal(SCENES.length,8);for(const s of SCENES){assert.equal(s.differences.length,3);for(const d of s.differences){assert.ok(d.nameEn && d.nameRu);assert.equal(Buffer.from(d.hitMask,'base64').length,1536);assert.ok(hitsObject(d,...d.anchor,0));}for(const field of ['storyEn','storyRu','verseEn','verseRu','refEn','refRu'])assert.ok(s[field])}})
test('old fake-marker centers cannot substitute for bitmap hit testing',()=>{for(const s of SCENES)for(const d of s.differences){assert.equal(hitsObject(d,-1,10),false);assert.equal(hitsObject(d,NaN,10),false);assert.equal(hitsObject(d,767,1023,0),false)}})
test('all scenes complete through real mask coordinates; terminal state and replay remain bounded',()=>{let s=initialState();for(let i=0;i<8;i++){assert.equal(s.scene,i);assert.equal(s.phase,'story');s=act(s,'start');for(const d of SCENES[i].differences){const id=findAt(s,...d.anchor);assert.equal(id,d.id);s=act(s,'find',{id});const duplicate=act(s,'find',{id});assert.deepEqual(duplicate,s)}assert.equal(s.phase,'reward');s=act(s,'next')}assert.equal(s.phase,'done');assert.equal(s.scene,7);assert.deepEqual(act(s,'next'),s);assert.deepEqual(act(s,'reset'),initialState())})
test('story/reward cannot be skipped or collect phantom ids',()=>{let s=initialState();assert.equal(act(s,'next'),s);assert.equal(act(s,'find',{id:1}),s);s=act(s,'start');assert.equal(act(s,'find',{id:99}),s);assert.equal(act(s,'next'),s)})
test('malformed saves and impossible scene indexes recover',()=>{for(const value of [null,[],{},'x',{version:2,scene:8},{version:2,scene:-1},{version:2,scene:NaN}])assert.deepEqual(restore(value),initialState())})
test('stale completed-play saves normalize to reward; false completion rejected',()=>{assert.equal(restore({version:2,scene:0,found:[1,2,3],phase:'play'}).phase,'reward');assert.equal(restore({version:2,scene:1,found:[1,1,99],phase:'done'}).phase,'play');assert.equal(restore({version:2,scene:7,found:[1,2,3],phase:'done'}).phase,'done')})
console.log(`${checks} Spot object/regression groups passed`)
