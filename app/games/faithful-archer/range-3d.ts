import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/** Presentation only. All coordinates originate in the unchanged pixel-space simulation.
 * An orthographic, elevated camera keeps the collision plane exactly screen aligned.
 * Environment and props are real lit/depth-tested geometry, not perspective canvas art.
 */
type Point = { x: number; y: number }
type Target = Point & { id: number; kind: string; r: number; hit: boolean; wobble: number }
type Arrow = Point & { id: number; vx: number; vy: number; stuck: boolean }
type Obstacle = Point & { id: number; w: number; h: number }
export type RangeFrame = {
  width: number; height: number; time: number; level: number; bow: Point;
  targets: Target[]; arrows: Arrow[]; obstacles: Obstacle[];
  aim: Point[]; review: Point[]; angle: number; draw: number;
}
const TILT = 0.34
const C = Math.cos(TILT), S = Math.sin(TILT)
const ROOT = '/games/faithful-archer-3d/'
const v = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)

export class Range3D {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 7000)
  private scenery = new THREE.Group()
  private actors = new THREE.Group()
  private targets = new Map<number, THREE.Group>()
  private arrows = new Map<number, THREE.Group>()
  private obstacles = new Map<number, THREE.Group>()
  private cords = new Map<number, THREE.Mesh>()
  private bow = new THREE.Group()
  private string: THREE.Line
  private aim: THREE.InstancedMesh
  private review: THREE.Line
  private character = new THREE.Group()
  private loaded = new Map<string, THREE.Object3D>()
  private textures = new Set<THREE.Texture>()
  private assetGeometries = new Set<THREE.BufferGeometry>()
  private assetMaterials = new Set<THREE.Material>()
  private geometries = new Set<THREE.BufferGeometry>()
  private materials = new Set<THREE.Material>()
  private disposed = false
  private ready = false
  private width = 0
  private height = 0
  private level = -1
  private frames = 0
  private bones: { bone: THREE.Bone; rotation: THREE.Quaternion }[] = []
  private sun = new THREE.DirectionalLight(0xffe4b2, 3.2)
  private wood: THREE.MeshStandardMaterial
  private stone: THREE.MeshStandardMaterial
  private brass: THREE.MeshStandardMaterial
  private green: THREE.MeshStandardMaterial
  private cream: THREE.MeshStandardMaterial
  private rope: THREE.MeshStandardMaterial
  private soil: THREE.MeshStandardMaterial
  private grass: THREE.MeshStandardMaterial
  private onLost: (e: Event) => void

  constructor(private canvas: HTMLCanvasElement, fail: () => void, private onReady: () => void) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.scene.background = new THREE.Color('#b5d8cf')
    this.scene.fog = new THREE.Fog('#b5d8cf', 2800, 5200)
    this.scene.add(new THREE.HemisphereLight(0xdceef3, 0x665735, 2.2))
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(1024, 1024)
    this.sun.shadow.normalBias = 1.5
    this.sun.shadow.bias = -0.0002
    this.sun.shadow.camera.near = 10
    this.sun.shadow.camera.far = 4000
    this.scene.add(this.sun, this.sun.target, this.scenery, this.actors, this.character, this.bow)
    this.wood = this.mat('#ffffff', 0.86)
    this.stone = this.mat('#bcb6a0', 0.96)
    this.brass = this.mat('#c99a42', 0.35, 0.68)
    this.green = this.mat('#285d48', 0.76)
    this.cream = this.mat('#f4dfae', 0.94)
    this.rope = this.mat('#a78554', 1)
    this.soil = this.mat('#f6debd', 1)
    this.grass = this.mat('#718751', 1)
    this.string = new THREE.Line(this.geo(new THREE.BufferGeometry()), this.material(new THREE.LineBasicMaterial({color:'#f4e6c7'})))
    this.bow.add(this.string)
    this.buildBow()
    this.aim = new THREE.InstancedMesh(this.geo(new THREE.SphereGeometry(2.5, 8, 6)), this.material(new THREE.MeshBasicMaterial({color:'#fff3ce'})), 50)
    this.aim.count = 0; this.aim.frustumCulled = false
    this.scene.add(this.aim)
    this.review = new THREE.Line(this.geo(new THREE.BufferGeometry()), this.material(new THREE.LineDashedMaterial({ color:'#335a63', dashSize:6, gapSize:6, transparent:true, opacity:0.85 })))
    this.scene.add(this.review)
    this.review.geometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(160*3),3))
    this.review.geometry.setDrawRange(0,0);this.review.frustumCulled=false
    this.onLost = e => { e.preventDefault(); this.ready = false; fail() }
    canvas.addEventListener('webglcontextlost', this.onLost)
    // Asset failure is a real failure, never a silent vector fallback.
    this.load().catch(() => { if (!this.disposed) fail() })
  }
  get isReady() { return this.ready && !this.disposed }
  private mat(color: string, roughness: number, metalness = 0) {
    return this.material(new THREE.MeshStandardMaterial({color, roughness, metalness}))
  }
  private material<T extends THREE.Material>(m:T):T { this.materials.add(m); return m }
  private geo<T extends THREE.BufferGeometry>(g:T):T { this.geometries.add(g); return g }
  private mesh(g:THREE.BufferGeometry, m:THREE.Material, parent:THREE.Object3D, x=0,y=0,z=0) {
    const a = new THREE.Mesh(this.geo(g), m); a.position.set(x,y,z); a.castShadow = true; a.receiveShadow = true; parent.add(a); return a
  }
  private box(parent:THREE.Object3D, x:number,y:number,z:number,w:number,h:number,d:number,m=this.wood) {
    return this.mesh(new RoundedBoxGeometry(w,h,d,1,Math.min(2,w/8,h/8,d/8)),m,parent,x,y,z)
  }
  private rod(parent:THREE.Object3D,a:THREE.Vector3,b:THREE.Vector3,r:number,m=this.wood) {
    const obj=this.mesh(new THREE.CylinderGeometry(r,r*1.12,a.distanceTo(b),8),m,parent)
    obj.position.copy(a).add(b).multiplyScalar(.5); obj.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize()); return obj
  }
  private async load() {
    const loader = new GLTFLoader()
    for (const name of ['michael','rock_moss_a','rock_moss_c','boulder_01','plant_bushDetailed','grove-oak']) {
      const gltf = await loader.loadAsync(ROOT+name+'.glb')
      gltf.scene.traverse(o => {
        if(o instanceof THREE.Mesh) {
          o.castShadow=true;o.receiveShadow=!(o instanceof THREE.SkinnedMesh); this.geometries.add(o.geometry); this.assetGeometries.add(o.geometry)
          for(const m of Array.isArray(o.material)?o.material:[o.material]) {
            this.materials.add(m)
            this.assetMaterials.add(m)
            for(const value of Object.values(m)) if(value instanceof THREE.Texture) this.textures.add(value)
          }
        }
      })
      if(this.disposed) { this.disposeResources(gltf.scene); return }
      this.loaded.set(name,gltf.scene)
    }
    const texLoader=new THREE.TextureLoader()
    for(const [file,material,repeat] of [['rocky_trail_albedo.jpg',this.soil,3],['hessian_230_albedo.jpg',this.cream,2],['timber.jpg',this.wood,1]] as const) {
      const texture=await texLoader.loadAsync(ROOT+file)
      texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping; texture.repeat.set(repeat,repeat)
      this.textures.add(texture); material.map=texture;material.needsUpdate=true
      if(this.disposed) {texture.dispose();return}
    }
    this.fitModel('michael',this.character,128)
    this.character.rotation.y=Math.PI/2
    this.character.traverse(o=>{if(o instanceof THREE.Bone)this.bones.push({bone:o,rotation:o.quaternion.clone()})})
    this.ready=true; this.width=0; this.onReady()
  }
  private fitModel(name:string, parent:THREE.Object3D, height:number) {
    // Character is used once: preserve its real skin and approved runtime material.
    const source=this.loaded.get(name)!
    const model=name==='michael'?source:source.clone(true)
    const bounds=new THREE.Box3().setFromObject(model)
    const size=bounds.getSize(v());const center=bounds.getCenter(v())
    const scale=height/size.y
    model.scale.multiplyScalar(scale)
    model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale)
    parent.add(model); return model
  }
  private buildBow() {
    const points=[v(-24,-48),v(-13,-40),v(-3,-23),v(0,0),v(-3,23),v(-13,40),v(-24,48)]
    const curve=new THREE.CatmullRomCurve3(points)
    this.mesh(new THREE.TubeGeometry(curve,40,3,8,false),this.wood,this.bow)
    this.mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>p.clone().add(v(0,0,1.8)))),40,.8,5,false),this.brass,this.bow)
    this.box(this.bow,0,0,0,7,19,9,this.green)
    for(let i=-7;i<=7;i+=3) this.rod(this.bow,v(-4,i,5),v(4,i+1,5),.7,this.rope)
  }
  private makeArrow() {
    const group=new THREE.Group()
    this.rod(group,v(-34,0,0),v(-5,0,0),1.25,this.wood)
    const head=new THREE.Shape();head.moveTo(0,0);head.lineTo(-9,3.6);head.lineTo(-6,0);head.lineTo(-9,-3.6);head.closePath()
    this.mesh(new THREE.ExtrudeGeometry(head,{depth:1,bevelEnabled:false}),this.brass,group)
    for(const rotation of [0,Math.PI*2/3,Math.PI*4/3]) {
      const feather=new THREE.Shape();feather.moveTo(-33,0);feather.lineTo(-36,5);feather.quadraticCurveTo(-28,7,-24,0);feather.closePath()
      const f=this.mesh(new THREE.ExtrudeGeometry(feather,{depth:.6,bevelEnabled:false}),this.green,group);f.rotation.x=rotation
    }
    return group
  }
  private makeTarget(t:Target) {
    const group=new THREE.Group();const r=t.r
    // All target faces use camera-plane axes: their projected center and silhouette
    // match the authoritative hit circle. Thickness projects behind that plane.
    if(t.kind==='bell') {
      const profile=[v(0,-r*.72),v(r*.78,-r*.72),v(r*.8,-r*.55),v(r*.57,-r*.45),v(r*.44,r*.4),v(r*.28,r*.62),v(0,r*.64)]
      this.mesh(new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(p.x,p.y)),32),this.brass,group)
      this.mesh(new THREE.TorusGeometry(r*.77,1.5,6,32),this.brass,group,0,-r*.65).rotation.x=Math.PI/2
      this.rod(group,v(0,-r*.52),v(0,-r*.9),2.3,this.wood)
      this.mesh(new THREE.TorusGeometry(5,1.5,6,16),this.brass,group,0,r*.8)
    } else if(t.kind==='lantern') {
      const glow=this.mat('#ffd879',.45);glow.emissive.set('#eeb34e');glow.emissiveIntensity=.45
      this.box(group,0,0,0,r*1.1,r*1.2,r*.64,glow)
      for(const x of [-1,1])for(const z of [-1,1])this.rod(group,v(x*r*.62,-r*.67,z*r*.38),v(x*r*.62,r*.67,z*r*.38),1.8,this.brass)
      for(const y of [-r*.7,r*.7])this.box(group,0,y,0,r*1.4,4,r*.9,this.green)
      const roof=new THREE.CylinderGeometry(2,r*.85,r*.3,4);this.mesh(roof,this.green,group,0,r*.9).rotation.y=Math.PI/4
      this.mesh(new THREE.TorusGeometry(5,1.8,6,16),this.brass,group,0,r*1.12)
    } else if(t.kind==='scroll') {
      this.box(group,0,0,0,r*1.25,r*1.5,4,this.cream)
      for(const y of [-r*.76,r*.76]) {
        this.rod(group,v(-r*.77,y,0),v(r*.77,y,0),4.5,this.wood)
        this.rod(group,v(-r*.57,y,3),v(r*.57,y,3),5,this.cream)
      }
      this.mesh(new THREE.CylinderGeometry(r*.23,r*.23,3,24),this.green,group,0,0,5).rotation.x=Math.PI/2
      for(const x of [-1,1])this.box(group,x*4,-r*.42,4,5,14,1,this.green).rotation.z=x*.15
    } else {
      const profile=[new THREE.Vector2(0,7),new THREE.Vector2(r*.3,6),new THREE.Vector2(r*.75,2),new THREE.Vector2(r*.92,0),new THREE.Vector2(r*.92,-5),new THREE.Vector2(0,-5)]
      this.mesh(new THREE.LatheGeometry(profile,40),this.wood,group).rotation.x=Math.PI/2
      this.mesh(new THREE.TorusGeometry(r*.87,2.5,8,40),this.brass,group,0,0,4)
      this.mesh(new THREE.TorusGeometry(r*.53,1.5,8,40),this.cream,group,0,0,6)
      this.mesh(new THREE.CylinderGeometry(r*.27,r*.27,4,32),this.green,group,0,0,8).rotation.x=Math.PI/2
      for(let i=0;i<8;i++){const a=i*Math.PI/4;this.mesh(new THREE.SphereGeometry(1.6,6,6),this.brass,group,Math.cos(a)*r*.77,Math.sin(a)*r*.77,5)}
    }
    const halo=this.mesh(new THREE.TorusGeometry(r+5,1.4,6,40),this.brass,group,0,0,-8);halo.name='success';halo.visible=false
    this.actors.add(group);this.targets.set(t.id,group);return group
  }
  private world(x:number,y:number,z=0) { return v(x-this.width/2,(this.height*.84-y+z*S)/C,z) }
  private tree(parent:THREE.Object3D,x:number,z:number,h:number,seed:number) {
    const rise=z< -450?Math.min(160,(-z-450)*.18):0
    const y=Math.sin(x*.007+z*.004)*rise*.45+rise-5
    const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=seed*.71;parent.add(group)
    this.fitModel('grove-oak',group,h)
  }
  private buildScenery() {
    // Dispose transient authored scenery on resize/course change, retain reusable assets.
    this.releaseTree(this.scenery)
    this.scenery.clear()
    const w=this.width,h=this.height
    const daisX=Math.max(56,w*.13)-4,daisY=Math.max(1,(h*.15-33)/C)
    for(const x of [-40,40])for(const z of [-40,40])this.box(this.scenery,daisX-w/2+x,daisY/2,z,12,daisY,12,this.wood)
    for(const z of [-42,42])this.box(this.scenery,daisX-w/2,daisY-12,z,104,16,12,this.wood)
    for(let i=0;i<3;i++)this.box(this.scenery,daisX-w/2-66-i*16,daisY*(3-i)/6,0,20,daisY*(3-i)/3,74,this.stone)
    for(let i=0;i<5;i++)this.box(this.scenery,daisX-w/2-40+i*20,daisY,0,19,5,106,this.wood)
    const depth=h*1.55+500
    const terrain=new THREE.PlaneGeometry(w*4,depth,48,48);terrain.rotateX(-Math.PI/2);terrain.translate(0,0,500-depth/2)
    const pos=terrain.attributes.position
    const colors=new Float32Array(pos.count*3)
    for(let i=0;i<pos.count;i++) {
      const x=pos.getX(i),z=pos.getZ(i)
      const rise=z< -450?Math.min(160,(-z-450)*.18):0
      pos.setY(i,Math.sin(x*.007+z*.004)*rise*.45+rise-3)
      const c=new THREE.Color('#87945e').lerp(new THREE.Color('#537650'),(Math.sin(x*.013)*Math.cos(z*.009)+1)*.28)
      colors.set([c.r,c.g,c.b],i*3)
    }
    terrain.setAttribute('color',new THREE.BufferAttribute(colors,3));this.grass.color.set('#ffffff');this.grass.vertexColors=true
    terrain.computeVertexNormals();this.mesh(terrain,this.grass,this.scenery)
    // Continuous textured range strip with soft, irregular edges, not a flat slab.
    const path=new THREE.PlaneGeometry(w*2,250,40,6);path.rotateX(-Math.PI/2)
    const pp=path.attributes.position
    for(let i=0;i<pp.count;i++){const x=pp.getX(i),z=pp.getZ(i);pp.setY(i,1+Math.sin(x*.014)*.5);pp.setZ(i,z+Math.sin(x*.008)*17)}
    path.computeVertexNormals();this.mesh(path,this.soil,this.scenery,0,0,45)
    for(const [x,z,s,name] of [[-w*.55,-240,125,'boulder_01'],[w*.52,-180,105,'rock_moss_a'],[-w*.23,-460,75,'rock_moss_c'],[w*.2,-390,85,'rock_moss_c']] as const) {
      const g=new THREE.Group();g.position.set(x,0,z);this.scenery.add(g);this.fitModel(name,g,s)
    }
    // A deliberately composed grove frames, rather than covers, the firing lane.
    for(const [x,z,s] of [[-w*.65,-420,300],[-w*.42,-700,300],[w*.1,-1000,290],[w*.64,-850,330],[w*.95,-490,340]])this.tree(this.scenery,x,z,s,Math.floor(x))
    for(let i=0;i<13;i++) {
      const x=-w*.65+i*w*.105;const g=new THREE.Group();g.position.set(x,0,-180-(i%3)*25);this.scenery.add(g);this.fitModel('plant_bushDetailed',g,30+(i%3)*10)
    }
    // Timber target gallery behind the collision plane. Pegs and braces give it
    // recognizable construction. Support ropes sit behind, never replace targets.
    const left=w*.52-w/2,right=w*.94-w/2,top=h*.77/C
    for(const x of [left,right]) {
      this.box(this.scenery,x,top/2,-38,16,top,18)
      this.box(this.scenery,x,7,-38,30,14,34,this.stone)
      this.rod(this.scenery,v(x,top-70,-38),v(x+(x===left?50:-50),top-14,-38),5)
    }
    this.box(this.scenery,(left+right)/2,top,-38,right-left+42,19,25)
    for(const x of [left,right])for(const y of [top-5,top-28])this.mesh(new THREE.CylinderGeometry(2.5,2.5,22,8),this.brass,this.scenery,x,y,-25).rotation.x=Math.PI/2
    // Low retaining wall follows the back bank; masonry avoids competing with aim.
    for(let row=0;row<2;row++)for(let i=0;i<18;i++)this.box(this.scenery,-w*.9+i*w*.11+(row%2)*16,12+row*23,-300, w*.105-3,22,34,this.stone)
    this.sun.position.set(-w*.6,1000,600);this.sun.target.position.set(0,h*.2,0)
    const camera=this.sun.shadow.camera;camera.left=-w;camera.right=w;camera.top=h;camera.bottom=-h;camera.updateProjectionMatrix()
  }
  render(f:RangeFrame) {
    if(this.disposed||!this.ready)return
    if(f.width!==this.width||f.height!==this.height||f.level!==this.level) {
      this.width=f.width;this.height=f.height;this.level=f.level
      this.renderer.setSize(f.width,f.height,false)
      this.camera.left=-f.width/2;this.camera.right=f.width/2;this.camera.top=f.height/2;this.camera.bottom=-f.height/2
      const center=v(0,f.height*.34/C,0)
      this.camera.position.copy(center).add(v(0,2000*S,2000*C));this.camera.lookAt(center);this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld()
      this.buildScenery();this.releaseTree(this.actors);this.actors.clear();this.targets.clear();this.arrows.clear();this.obstacles.clear();this.cords.clear()
    }
    for(const t of f.targets) {
      const obj=this.targets.get(t.id)||this.makeTarget(t)
      obj.position.copy(this.world(t.x,t.y));obj.quaternion.copy(this.camera.quaternion)
      obj.rotation.z+=Math.sin(t.wobble*12)*t.wobble*.08
      obj.getObjectByName('success')!.visible=t.hit
      let cord=this.cords.get(t.id)
      if(!cord){cord=this.mesh(new THREE.CylinderGeometry(.85,.85,1,5),this.rope,this.actors);this.cords.set(t.id,cord)}
      const top=v(t.x-this.width/2,this.height*.77/C,-38),bottom=this.world(t.x,t.y-t.r,-10)
      cord.position.copy(top).add(bottom).multiplyScalar(.5);cord.scale.y=top.distanceTo(bottom)
      cord.quaternion.setFromUnitVectors(v(0,1,0),top.sub(bottom).normalize())
    }
    for(const [id,obj] of this.targets)if(!f.targets.some(t=>t.id===id)){this.releaseTree(obj);this.actors.remove(obj);this.targets.delete(id)}
    for(const a of f.arrows) {
      let obj=this.arrows.get(a.id)
      if(!obj){obj=this.makeArrow();this.actors.add(obj);this.arrows.set(a.id,obj)}
      obj.position.copy(this.world(a.x,a.y,9));obj.quaternion.copy(this.camera.quaternion);obj.rotateZ(-Math.atan2(a.vy,a.vx))
    }
    for(const [id,obj] of this.arrows)if(!f.arrows.some(a=>a.id===id)){this.releaseTree(obj);this.actors.remove(obj);this.arrows.delete(id)}
    for(const o of f.obstacles) {
      let obj=this.obstacles.get(o.id)
      if(!obj) { obj=new THREE.Group();this.box(obj,0,0,-7,o.w,o.h,14);for(const y of [-o.h*.36,o.h*.36])this.box(obj,0,y,1,o.w+2,5,4,this.brass);this.actors.add(obj);this.obstacles.set(o.id,obj) }
      obj.position.copy(this.world(o.x+o.w/2,o.y+o.h/2));obj.quaternion.copy(this.camera.quaternion)
    }
    this.character.position.copy(this.world(f.bow.x-38,f.bow.y+91))
    this.bow.position.copy(this.world(f.bow.x,f.bow.y,12));this.bow.quaternion.copy(this.camera.quaternion);this.bow.rotateZ(-f.angle)
    const pull=Math.min(35,f.draw*.18)
    this.string.geometry.setFromPoints([v(-24,-48),v(-24-pull,0),v(-24,48)])
    for(const b of this.bones)b.bone.quaternion.copy(b.rotation)
    this.character.updateMatrixWorld(true)
    this.poseArm('L',this.bow.localToWorld(v(0,0,0)),v(0,-1,-.5))
    this.poseArm('R',this.bow.localToWorld(v(-24-pull,0,0)),v(0,-.4,1))
    const matrix=new THREE.Matrix4();this.aim.count=Math.min(f.aim.length,50)
    f.aim.slice(0,50).forEach((p,i)=>{matrix.makeTranslation(...this.world(p.x,p.y,12).toArray());this.aim.setMatrixAt(i,matrix)})
    this.aim.instanceMatrix.needsUpdate=true
    const history=this.review.geometry.attributes.position
    f.review.slice(0,160).forEach((p,i)=>{const point=this.world(p.x,p.y,12);history.setXYZ(i,point.x,point.y,point.z)})
    history.needsUpdate=true;this.review.geometry.setDrawRange(0,Math.min(f.review.length,160))
    this.review.computeLineDistances();this.review.visible=f.review.length>1
    this.renderer.render(this.scene,this.camera);this.frames++
    let error=0
    const projected=f.targets.map(t=>{const p=this.targets.get(t.id)!.position.clone().project(this.camera);const x=(p.x+1)*f.width/2,y=(1-p.y)*f.height/2;error=Math.max(error,Math.hypot(x-t.x,y-t.y));return {id:t.id,x,y,r:t.r}})
    this.canvas.dataset.renderer=JSON.stringify({kind:'three-webgl',ready:true,frames:this.frames,drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,alignmentError:error,targets:projected})
  }
  private releaseTree(root:THREE.Object3D) {
    const base=[this.wood,this.stone,this.brass,this.green,this.cream,this.rope,this.soil,this.grass]
    root.traverse(o=>{
      if(!(o instanceof THREE.Mesh))return
      if(!this.assetGeometries.has(o.geometry)){o.geometry.dispose();this.geometries.delete(o.geometry)}
      for(const m of Array.isArray(o.material)?o.material:[o.material]) {
        if(!base.includes(m)&&!this.assetMaterials.has(m)){m.dispose();this.materials.delete(m)}
      }
    })
  }
  private poseArm(side:string,target:THREE.Vector3,bend:THREE.Vector3) {
    const bone=(name:string)=>this.character.getObjectByName(name+'.'+side)||this.character.getObjectByName(name+side)
    const upper=bone('upper_arm'),lower=bone('forearm'),hand=bone('hand')
    if(!upper||!lower||!hand)return
    const start=upper.getWorldPosition(v()),elbow=lower.getWorldPosition(v()),end=hand.getWorldPosition(v())
    const a=start.distanceTo(elbow),b=elbow.distanceTo(end),dir=target.clone().sub(start),d=Math.max(.1,Math.min(dir.length(),a+b-.01));dir.normalize()
    const along=(a*a-b*b+d*d)/(2*d),across=Math.sqrt(Math.max(0,a*a-along*along))
    const perp=bend.clone().addScaledVector(dir,-bend.dot(dir)).normalize()
    const joint=start.clone().addScaledVector(dir,along).addScaledVector(perp,across)
    const orient=(bone:THREE.Object3D,from:THREE.Vector3,to:THREE.Vector3)=>{
      const delta=new THREE.Quaternion().setFromUnitVectors(from.normalize(),to.normalize())
      const q=bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(delta)
      bone.quaternion.copy(bone.parent!.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(q));bone.updateWorldMatrix(false,true)
    }
    orient(upper,elbow.clone().sub(start),joint.clone().sub(start))
    const e=lower.getWorldPosition(v());orient(lower,hand.getWorldPosition(v()).sub(e),target.clone().sub(e))
  }
  private disposeResources(root:THREE.Object3D) {
    root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(m))if(value instanceof THREE.Texture)value.dispose();m.dispose()}}})
  }
  dispose() {
    this.disposed=true;this.canvas.removeEventListener('webglcontextlost',this.onLost)
    this.geometries.forEach(g=>g.dispose());this.materials.forEach(m=>m.dispose());this.textures.forEach(t=>t.dispose())
    this.scene.clear();this.loaded.clear();this.sun.shadow.dispose();this.renderer.dispose()
    // Release detached contexts after React cleanup; StrictMode can reuse a
    // still-attached canvas, whereas route exit/retry removes the old one.
    queueMicrotask(()=>{if(!this.canvas.isConnected)this.renderer.forceContextLoss()})
    delete this.canvas.dataset.renderer
  }
}
