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
  private landing: THREE.Mesh
  private impacts = new Map<number, number>()
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
  private idleMixer: THREE.AnimationMixer | null = null
  private sun = new THREE.DirectionalLight(0xffefd6, 2.6)
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
    this.scene.add(new THREE.HemisphereLight(0xe6f1ff, 0x77836b, 2.2))
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
    this.landing=this.mesh(new THREE.TorusGeometry(9,1.8,8,40),this.material(new THREE.MeshBasicMaterial({color:'#fff0a6',depthTest:false})),this.scene)
    this.landing.renderOrder=10;this.landing.visible=false
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
    for (const name of ['michael','rock_moss_a','rock_moss_c','boulder_01']) {
      const gltf = await loader.loadAsync(ROOT+name+'.glb')
      gltf.scene.traverse(o => {
        if(o instanceof THREE.Mesh) {
          o.castShadow=true;o.receiveShadow=!(o instanceof THREE.SkinnedMesh); this.geometries.add(o.geometry); this.assetGeometries.add(o.geometry)
          if(name==='michael') for(const m of Array.isArray(o.material)?o.material:[o.material]) {
            if(m instanceof THREE.MeshStandardMaterial) m.normalScale.set(.12,.12)
          }
          for(const m of Array.isArray(o.material)?o.material:[o.material]) {
            this.materials.add(m)
            this.assetMaterials.add(m)
            for(const value of Object.values(m)) if(value instanceof THREE.Texture) this.textures.add(value)
          }
        }
      })
      if(this.disposed) { this.disposeResources(gltf.scene); return }
      if(name==='michael') {
        const idle=gltf.animations.find(a=>a.name==='Idle')
        if(idle) {this.idleMixer=new THREE.AnimationMixer(gltf.scene);this.idleMixer.clipAction(idle).play();this.idleMixer.update(0)}
        gltf.scene.updateMatrixWorld(true)
      }
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
    // Preserve the proven Trail idle pose. The source skin is not approved for
    // arbitrary arm IK: it also binds pouch/hem vertices to the forearms.
    this.character.rotation.y=.72
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
    // Adapt the owned Trail opening's tapered forks + folded leaf crown, not the
    // rejected generated lobe/disc silhouette. Each crown has intentional gaps.
    const group=new THREE.Group();group.position.set(x,this.ground(x,z),z);parent.add(group)
    const bark=this.mat('#79634b',1),leaf=this.mat('#ffffff',.92)
    leaf.side=THREE.DoubleSide
    const curve=new THREE.CatmullRomCurve3([v(0,0,0),v(-h*.025,h*.3,3),v(h*.025,h*.55,-4),v(0,h*.9,0)])
    for(let i=0;i<12;i++) {
      const a=curve.getPoint(i/12),b=curve.getPoint((i+1)/12)
      const tube=this.mesh(new THREE.CylinderGeometry(h*(.048-i*.0034),h*(.051-i*.0034),a.distanceTo(b)+1,9),bark,group)
      tube.position.copy(a).add(b).multiplyScalar(.5);tube.quaternion.setFromUnitVectors(v(0,1),b.clone().sub(a).normalize())
    }
    const g=new THREE.BufferGeometry()
    g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,-.42,.11,.4,0,.19,.45,.42,.11,.4,0,0,1],3))
    g.setIndex([0,1,2,0,2,3,1,4,2,2,4,3]);g.computeVertexNormals()
    const leaves=new THREE.InstancedMesh(this.geo(g),leaf,14*3*32);leaves.castShadow=true;leaves.receiveShadow=true;group.add(leaves)
    const dummy=new THREE.Object3D();let count=0
    for(let i=0;i<14;i++) {
      const angle=seed*.71+i*2.39996,tier=i%4
      const start=v(0,h*(.42+tier*.08),0),dir=v(Math.cos(angle),0,Math.sin(angle))
      const elbow=start.clone().addScaledVector(dir,h*.16).add(v(0,h*.13,0)),tip=start.clone().addScaledVector(dir,h*(.29-tier*.02)).add(v(0,h*(.22+tier*.022),0))
      this.rod(group,start,elbow,h*.018,bark);this.rod(group,elbow,tip,h*.009,bark)
      for(let fork=0;fork<3;fork++) {
        const fa=angle+(fork-1)*.9,center=tip.clone().add(v(Math.cos(fa)*h*.065,h*(fork*.025),Math.sin(fa)*h*.065))
        this.rod(group,elbow.clone().lerp(tip,.7),center,h*.003,bark)
        for(let j=0;j<32;j++) {
          const a=j*2.39996+fa,r=Math.sqrt(j/32)*h*.16
          dummy.position.copy(center).add(v(Math.cos(a)*r,Math.sin(j*4.7+i)*h*.045,Math.sin(a)*r))
          dummy.rotation.set(Math.sin(j*2.7)*.65,a,Math.cos(j)*.3);dummy.scale.setScalar(h*(.05+.014*(Math.sin(j*7+seed)+1)))
          dummy.updateMatrix();leaves.setMatrixAt(count,dummy.matrix)
          leaves.setColorAt(count++,new THREE.Color().setHSL(.25+.025*Math.sin(j+i),.48,.25+.10*(.5+.5*Math.sin(j*3.7)),THREE.SRGBColorSpace))
        }
      }
    }
    leaves.count=count
  }
  private ground(x:number,z:number) {
    const rise=z< -500?Math.min(105,(-z-500)*.10):0
    return -3+rise+Math.sin(x*.005+z*.004)*rise*.35
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
      pos.setY(i,this.ground(x,z))
      const c=new THREE.Color('#799062').lerp(new THREE.Color('#557955'),(Math.sin(x*.013)*Math.cos(z*.009)+1)*.28)
      colors.set([c.r,c.g,c.b],i*3)
    }
    terrain.setAttribute('color',new THREE.BufferAttribute(colors,3));this.grass.color.set('#ffffff');this.grass.vertexColors=true
    terrain.computeVertexNormals();this.mesh(terrain,this.grass,this.scenery)
    // Continuous textured range strip with soft, irregular edges, not a flat slab.
    const path=new THREE.PlaneGeometry(w*2,250,40,6);path.rotateX(-Math.PI/2)
    const pp=path.attributes.position
    for(let i=0;i<pp.count;i++){const x=pp.getX(i),z=pp.getZ(i);pp.setY(i,1+Math.sin(x*.014)*.5);pp.setZ(i,z+Math.sin(x*.008)*17);path.attributes.uv.setXY(i,x/360,z/360)}
    path.computeVertexNormals();this.mesh(path,this.soil,this.scenery,0,0,45)
    for(const [x,z,s,name] of [[-w*.55,-240,125,'boulder_01'],[w*.52,-180,105,'rock_moss_a'],[-w*.23,-460,75,'rock_moss_c'],[w*.2,-390,85,'rock_moss_c']] as const) {
      const g=new THREE.Group();g.position.set(x,0,z);this.scenery.add(g);this.fitModel(name,g,s)
    }
    // A deliberately composed grove frames, rather than covers, the firing lane.
    for(const [x,z,s] of [[-w*.62,-430,280],[-w*.08,-880,245],[w*.46,-1000,270],[w*.75,-500,260]])this.tree(this.scenery,x,z,s,Math.floor(x))
    // Small, curved meadow blades, grouped along the bank rather than repeated
    // oversized plastic succulents. Keep the launch area and target lane clear.
    const blade=new THREE.BufferGeometry()
    blade.setAttribute('position',new THREE.Float32BufferAttribute([-1,0,0,1,0,0,.8,8,1,-.6,8,1,2,16,3],3));blade.setIndex([0,1,2,0,2,3,3,2,4]);blade.computeVertexNormals()
    const meadow=this.mat('#577b40',1);meadow.side=THREE.DoubleSide
    const blades=new THREE.InstancedMesh(this.geo(blade),meadow,360);this.scenery.add(blades);blades.castShadow=true
    const dummy=new THREE.Object3D()
    for(let i=0;i<360;i++) {
      const cluster=Math.floor(i/18),angle=i*2.39996,r=3+(i%18)*1.25
      const x=-w*.72+cluster*w*.074+Math.cos(angle)*r,z=-230+Math.sin(cluster*2.1)*42+Math.sin(angle)*r
      dummy.position.set(x,this.ground(x,z),z);dummy.rotation.set(0,angle,Math.sin(i)*.15);dummy.scale.setScalar(.6+.4*(.5+.5*Math.sin(i*4.7)));dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix)
    }
    // A pivoting practice bow stand leaves the accepted character skin intact.
    const stand=this.world(Math.max(56,w*.13)+34,h*.69-58,12)
    this.rod(this.scenery,v(stand.x,0,8),v(stand.x,stand.y,8),4,this.wood)
    this.box(this.scenery,stand.x,3,8,38,6,35,this.wood)
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
    // Winding approach joins the shooting terrace rather than ending at a slab.
    const approach=new THREE.PlaneGeometry(100,1000,5,40);approach.rotateX(-Math.PI/2)
    const ap=approach.attributes.position
    for(let i=0;i<ap.count;i++) {const z=ap.getZ(i)-570,x=ap.getX(i)-w*.30+Math.sin(z*.0035)*w*.18;ap.setXYZ(i,x,this.ground(x,z)+1.5,z);approach.attributes.uv.setXY(i,x/360,z/360)}
    approach.computeVertexNormals();this.mesh(approach,this.soil,this.scenery)
    const masonry=[this.mat('#a4aa98',1),this.mat('#b6b7a3',1),this.mat('#979e8f',1)]
    for(let row=0;row<3;row++)for(let i=0;i<24;i++) {
      const x=-w*1.2+i*w*.105+(row%2)*w*.05,z=-320+Math.sin(x*.003)*55
      if(Math.abs(x+w*.46)<55)continue
      const stone=this.box(this.scenery,x,10+row*18,z,w*.101,17,37,masonry[(i+row)%3]);stone.rotation.y=Math.sin(i*2.7)*.05
    }
    // Broad coping and repeated piers make the retaining edge read as built stone.
    for(let i=0;i<24;i++){const x=-w*1.2+i*w*.105;if(Math.abs(x+w*.46)<55)continue;this.box(this.scenery,x,58,-320+Math.sin(x*.003)*55,w*.104,8,43,masonry[1])}
    for(const x of [-w*.46-75,-w*.46+75,w*.45])for(let row=0;row<4;row++)this.box(this.scenery,x,12+row*22,-320+Math.sin(x*.003)*55,32,21,48,masonry[row%3])
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
      this.buildScenery();this.releaseTree(this.actors);this.actors.clear();this.targets.clear();this.arrows.clear();this.obstacles.clear();this.cords.clear();this.impacts.clear()
    }
    for(const t of f.targets) {
      const obj=this.targets.get(t.id)||this.makeTarget(t)
      obj.position.copy(this.world(t.x,t.y));obj.quaternion.copy(this.camera.quaternion)
      obj.rotation.z+=Math.sin(t.wobble*12)*t.wobble*.08
      const success=obj.getObjectByName('success')!
      success.visible=t.hit
      if(t.hit&&!this.impacts.has(t.id))this.impacts.set(t.id,f.time)
      const age=f.time-(this.impacts.get(t.id)??f.time)
      success.scale.setScalar(t.hit?1+Math.max(0,1-age/.65)*.65:1)
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
    this.idleMixer?.setTime(f.time)
    // Authored idle is deliberately retained rather than deforming an unproven
    // carry rig into archery. The independently aimed practice bow has a stand.
    this.character.updateMatrixWorld(true)
    const matrix=new THREE.Matrix4();this.aim.count=Math.min(f.aim.length,50)
    f.aim.slice(0,50).forEach((p,i)=>{matrix.makeTranslation(...this.world(p.x,p.y,12).toArray());this.aim.setMatrixAt(i,matrix)})
    this.aim.instanceMatrix.needsUpdate=true
    // The endpoint is the actual preview, not an invented guaranteed hit.
    this.landing.visible=f.aim.length>1
    if(f.aim.length>1){
      const end=f.aim[f.aim.length-1]
      this.landing.position.copy(this.world(end.x,end.y,16));this.landing.quaternion.copy(this.camera.quaternion)
      const near=f.targets.some(t=>!t.hit&&Math.hypot(t.x-end.x,t.y-end.y)<t.r)
      ;(this.landing.material as THREE.MeshBasicMaterial).color.set(near?'#a5efb7':'#fff0a6')
      this.landing.scale.setScalar(near?1.25:1)
    }
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
      if(o instanceof THREE.InstancedMesh)o.dispose()
      if(!this.assetGeometries.has(o.geometry)){o.geometry.dispose();this.geometries.delete(o.geometry)}
      for(const m of Array.isArray(o.material)?o.material:[o.material]) {
        if(!base.includes(m)&&!this.assetMaterials.has(m)){m.dispose();this.materials.delete(m)}
      }
    })
  }
  private disposeResources(root:THREE.Object3D) {
    root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(m))if(value instanceof THREE.Texture)value.dispose();m.dispose()}}})
  }
  dispose() {
    this.disposed=true;this.canvas.removeEventListener('webglcontextlost',this.onLost)
    this.idleMixer?.stopAllAction();if(this.idleMixer)this.idleMixer.uncacheRoot(this.idleMixer.getRoot());this.idleMixer=null
    this.scene.traverse(o=>{if(o instanceof THREE.InstancedMesh)o.dispose()})
    this.geometries.forEach(g=>g.dispose());this.materials.forEach(m=>m.dispose());this.textures.forEach(t=>t.dispose())
    this.scene.clear();this.loaded.clear();this.sun.shadow.dispose();this.renderer.dispose()
    // Release detached contexts after React cleanup; StrictMode can reuse a
    // still-attached canvas, whereas route exit/retry removes the old one.
    queueMicrotask(()=>{if(!this.canvas.isConnected)this.renderer.forceContextLoss()})
    delete this.canvas.dataset.renderer
  }
}
