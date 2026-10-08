import assert from 'node:assert/strict'
import fs from 'node:fs'
const src=fs.readFileSync(new URL('./page.tsx',import.meta.url),'utf8')
const body=src.match(/async function enterFullscreen\(\) \{([\s\S]*?)\n  \}/)[1]
const run=new Function('document','shell','setFullscreenError',`return (async()=>{${body}})()`)
let entered=0,exited=0,error=null
const node={requestFullscreen:async()=>{entered++}}
const doc={fullscreenElement:null,exitFullscreen:async()=>{exited++}}
await run(doc,{current:node},v=>error=v)
assert.equal(entered,1);assert.equal(error,false)
doc.fullscreenElement=node
await run(doc,{current:node},v=>error=v)
assert.equal(exited,1);assert.equal(entered,1)
doc.fullscreenElement=null
await run(doc,{current:{}},v=>error=v)
assert.equal(error,true)
await run(doc,{current:{requestFullscreen:async()=>{throw Error('unsupported')}}},v=>error=v)
assert.equal(error,true)
assert.ok(src.includes("removeEventListener('fullscreenchange', changed)"))
assert.ok(src.includes('Выйти из полного экрана'))
console.log('PASS fullscreen handler: enter, exit, unsupported, rejection, listener cleanup and RU label contract')
