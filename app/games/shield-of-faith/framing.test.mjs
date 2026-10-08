import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import * as T from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
const compiled = ts.transpileModule(fs.readFileSync(new URL('./framing.ts', import.meta.url), 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText
const m={exports:{}}; new Function('require','module','exports',compiled)(()=>T,m,m.exports)
const {frameEncounter}=m.exports
const bytes=fs.readFileSync(new URL('./assets/siege_manta.glb',import.meta.url))
const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'')
const boss=gltf.scene
const size=new T.Box3().setFromObject(boss).getSize(new T.Vector3()); boss.scale.setScalar(12/Math.max(size.x,size.z))
for(const [w,h] of [[1280,800],[390,844]]) test(`actual GLB fits HUD-safe encounter ${w}x${h}`,()=>{
 let minY=Infinity,maxY=-Infinity,oldMin=Infinity,samples=0
 for(const health of [6,3,0]) for(const distance of [430,440,440.15,465]) for(let t=0;t<32;t++){
  boss.position.set(0,health?4.5:1.2,-458);boss.rotation.z=health?0:.16
  ;['arm_left','arm_right'].forEach((name,i)=>{const o=boss.getObjectByName(name);o.rotation.y=health?Math.sin(t*Math.PI/16+i)*(health>3?.18:.42):(i?-.7:.7);o.rotation.x=health?0:.5})
  boss.getObjectByName('core').scale.setScalar(health>3?1:.8)
  const actual=new T.Box3().setFromObject(boss)
  const bounds=actual.clone().expandByScalar(1).union(new T.Box3(new T.Vector3(-14,0,-distance-15),new T.Vector3(14,8,-distance+20)))
  const hw=w<h?14:25,c=new T.OrthographicCamera(-hw,hw,hw*h/w,-hw*h/w,.1,200);c.position.set(0,39,-distance+32);c.lookAt(0,0,-distance);c.updateMatrixWorld(true)
  const corners=[];for(const x of [actual.min.x,actual.max.x])for(const y of [actual.min.y,actual.max.y])for(const z of [actual.min.z,actual.max.z])corners.push(new T.Vector3(x,y,z))
  for(const p of corners)oldMin=Math.min(oldMin,(1-p.clone().project(c).y)*h/2)
  frameEncounter(c,bounds,w,h)
  for(const p of corners){const ndc=p.clone().project(c);const y=(1-ndc.y)*h/2;assert.ok(Number.isFinite(y));assert.ok(y>=254-1e-6,`${y}`);assert.ok(y<=h-130+1e-6);assert.ok(Math.abs(ndc.x)<=1);assert.ok(Math.abs(ndc.z)<=1);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}samples++
 }
 console.log(JSON.stringify({viewport:[w,h],samples,bossScreenY:[minY,maxY],oldMinY:oldMin}))
})
