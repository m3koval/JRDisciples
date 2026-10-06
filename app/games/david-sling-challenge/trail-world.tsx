'use client'
import { useEffect, useRef, useState } from 'react'
import * as T from 'three'
import { runnerProjection } from '../truth-runner/projection'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/** Lit owned meshes; presentation only, never an alternate collision authority. */
export type TrailFrame = { x:number; distance:number; runner:boolean; target?:{x:number;y:number}; origin?:{x:number;y:number}; items?:{id:number;x:number;y:number;kind:string}[] }
export type TrailStatus = 'loading' | 'ready' | 'failed'
export default function TrailWorld({frame,onStatusChange,isRu=false}:{frame:TrailFrame;onStatusChange?:(status:TrailStatus)=>void;isRu?:boolean}) {
 const canvas=useRef<HTMLCanvasElement>(null), current=useRef(frame), notify=useRef(onStatusChange)
 const [status,setStatus]=useState<TrailStatus>('loading'), [attempt,setAttempt]=useState(0)
 useEffect(()=>{current.current=frame;notify.current=onStatusChange},[frame,onStatusChange])
 useEffect(()=>{
  if(!canvas.current)return
  let dead=false,raf=0,loaded=false,announced=false,broken=false
  const report=(next:TrailStatus)=>{if(!dead){setStatus(next);notify.current?.(next)}}
  report('loading')
  let renderer:T.WebGLRenderer
  try {renderer=new T.WebGLRenderer({canvas:canvas.current,antialias:true})} catch {report('failed');return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap
  const scene=new T.Scene();scene.background=new T.Color('#758566')
  const camera=new T.OrthographicCamera(-50,50,50,-50,.1,2000);camera.position.set(50,50,600);camera.lookAt(50,50,0)
  scene.add(new T.HemisphereLight(0xe4f3ff,0x46512c,1.8))
  const sun=new T.DirectionalLight(0xffe1ab,2.3);sun.position.set(-30,130,250);sun.target.position.set(50,50,0);scene.add(sun,sun.target)
  sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-140,right:140,top:140,bottom:-140,near:1,far:500});sun.shadow.normalBias=.15
  // Continuous backing avoids exposed canvas bars as Sling's camera fits portrait.
  const ground=new T.Mesh(new T.PlaneGeometry(600,600),new T.MeshStandardMaterial({color:'#758566',roughness:1}));ground.position.set(50,50,-25);ground.receiveShadow=true;scene.add(ground)
  const path=new T.Mesh(new T.PlaneGeometry(66,600),new T.MeshStandardMaterial({color:'#d7c5a0',roughness:1}));path.position.set(50,50,-24);path.receiveShadow=true;scene.add(path)
  const objects=new Map<number,T.Object3D>();let rock:T.Object3D|undefined,person:T.Object3D|undefined
  const assets:T.Object3D[]=[],textures:T.Texture[]=[],trees:{object:T.Object3D;y:number}[]=[]
  const dispose=(roots:T.Object3D[])=>{const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),maps=new Set<T.Texture>();for(const root of roots)root.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const v of Object.values(m))if(v instanceof T.Texture)maps.add(v)}}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());maps.forEach(t=>t.dispose())}
  const loader=new GLTFLoader()
  const normalize=(o:T.Object3D,size:number)=>{const b=new T.Box3().setFromObject(o),s=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3());const k=size/Math.max(s.x,s.y,s.z);const g=new T.Group();o.scale.multiplyScalar(k);o.position.sub(c.multiplyScalar(k));o.traverse(n=>{if(n instanceof T.Mesh){n.castShadow=true;n.receiveShadow=true}});g.add(o);return g}
  const mesh=async(url:string)=>{const result=await loader.loadAsync(url);if(dead){dispose([result.scene]);return null}assets.push(result.scene);return result.scene}
  const load=async()=>{
   const r=await mesh('/games/faithful-archer-3d/rock_moss_a.glb');if(!r)return;rock=normalize(r,11)
   const m=await mesh('/games/faithful-archer-3d/michael.glb');if(!m)return;person=normalize(m,22);person.rotation.x=.32;person.rotation.y=current.current.runner?Math.PI:.6;scene.add(person)
   const tree=await mesh('/games/faithful-archer-3d/grove-oak.glb');if(!tree)return
   const runner=current.current.runner,master=normalize(tree,runner?32:29)
   // Sling's entire horizontal throw corridor stays clear. Runner shoulders sit
   // outside the authoritative x=18..82 steering corridor, not over its lanes.
   const placements=runner?[[-7,12],[107,30],[-7,68],[107,89]]:[[8,-4],[62,-8],[28,109],[94,110]]
   placements.forEach(([x,y],i)=>{const o=master.clone(true);o.position.set(x,y,-9);o.rotation.y=i*1.7;scene.add(o);trees.push({object:o,y})})
   const tex=await new T.TextureLoader().loadAsync('/games/faithful-archer-3d/rocky_trail_albedo.jpg');if(dead){tex.dispose();return}textures.push(tex);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(2,20);path.material.map=tex;path.material.needsUpdate=true
   loaded=true
  }
  void load().catch(()=>{broken=true;report('failed')})
  const ring=new T.Mesh(new T.TorusGeometry(5,.8,8,40),new T.MeshStandardMaterial({color:'#ffe1a0',metalness:.15,roughness:.65}));scene.add(ring)
  const lightGeometry=new T.OctahedronGeometry(2.7,1),lightMaterial=new T.MeshStandardMaterial({color:'#ffe7a0',emissive:'#be7310',emissiveIntensity:.6,metalness:.45,roughness:.25})
  const draw=()=>{
   if(dead||broken)return
   const f=current.current,rect=canvas.current!.getBoundingClientRect();const w=Math.max(1,Math.round(rect.width)),h=Math.max(1,Math.round(rect.height))
   const size=renderer.getSize(new T.Vector2());if(size.x!==w||size.y!==h)renderer.setSize(w,h,false)
   if(!f.runner){const aspect=rect.width/Math.max(1,rect.height);const vw=Math.max(100,aspect*75),vh=Math.max(100,100/(aspect*.75));camera.left=-vw/2;camera.right=vw/2;camera.bottom=-vh/2;camera.top=vh/2;camera.updateProjectionMatrix()}
   const projection=runnerProjection(w,h)
   if(f.runner){
    // Equal pixels/world-unit in both axes, without changing gameplay positions.
    camera.left=-50;camera.right=50;camera.top=projection.worldHeight/2;camera.bottom=-projection.worldHeight/2
    camera.position.set(50,projection.worldHeight/2,600);camera.lookAt(50,projection.worldHeight/2,0);camera.updateProjectionMatrix()
    for(const tree of trees)tree.object.position.y=tree.y*projection.worldHeight/100
    ground.position.y=path.position.y=projection.worldHeight/2
   }
   if(person)person.position.set(f.origin?.x??f.x,(f.runner?projection.y(f.origin?.y??78):100-(f.origin?.y??78))+7,4)
   ring.visible=!f.runner;ring.position.set(f.target?.x??94,100-(f.target?.y??49),3)
   path.rotation.z=f.runner?0:-Math.PI/2;path.material.map?.offset.set(0,f.runner?-f.distance/600:0)
   const items=f.items??[]
   for(const item of items){let o=objects.get(item.id);if(!o){if(item.kind==='rock'&&!rock)continue;o=item.kind==='rock'?rock!.clone(true):new T.Mesh(lightGeometry,lightMaterial);objects.set(item.id,o);scene.add(o)}o.position.set(item.x,f.runner?projection.y(item.y):100-item.y,2);if(item.kind==='light')o.rotation.y=f.distance*.025}
   for(const [id,o]of objects)if(!items.some(i=>i.id===id)){scene.remove(o);objects.delete(id)}
   try {renderer.render(scene,camera)} catch {broken=true;report('failed');return}
   if(f.runner&&person){
    const project=(v:T.Vector3)=>{const p=v.clone().project(camera);return {x:(p.x+1)*50,y:(1-p.y)*50}}
    canvas.current!.dataset.projection=JSON.stringify({pixelsPerUnit:[w/(camera.right-camera.left),h/(camera.top-camera.bottom)],player:project(new T.Vector3(person.position.x,person.position.y-7,person.position.z)),items:items.map(i=>({id:i.id,canonical:{x:i.x,y:i.y},rendered:project(objects.get(i.id)?.position??new T.Vector3())}))})
   }
   // Asset resolution alone is insufficient: readiness follows a rendered frame.
   if(loaded&&!announced&&rect.width>0&&rect.height>0){announced=true;report('ready')}
   raf=requestAnimationFrame(draw)
  };draw()
  const element=canvas.current
  const lost=(event:Event)=>{event.preventDefault();broken=true;report('failed')}
  element.addEventListener('webglcontextlost',lost)
  return()=>{dead=true;cancelAnimationFrame(raf);element.removeEventListener('webglcontextlost',lost);dispose([scene,...assets,...(rock?[rock]:[])]);textures.forEach(t=>t.dispose());lightGeometry.dispose();lightMaterial.dispose();renderer.dispose()}
 },[attempt])
 return <><canvas ref={canvas} data-trail-status={status} aria-hidden="true" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}/>{status!=='ready'&&<div role="status" style={{position:'absolute',inset:0,zIndex:20,display:'grid',placeContent:'center',textAlign:'center',background:'#152b26eb',color:'white',padding:16}}>{status==='loading'?(isRu?'Загружаем тропу…':'Loading the trail…'):<>{isRu?'Не удалось загрузить 3D. Игра ждёт.':'3D could not load. Your game is waiting.'}<button type="button" onClick={()=>{notify.current?.('loading');setStatus('loading');setAttempt(n=>n+1)}} style={{marginTop:12,minHeight:44}}>{isRu?'Повторить загрузку':'Retry loading'}</button></>}</div>}</>
}
