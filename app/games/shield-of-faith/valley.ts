import * as T from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Flight, convoyX, SITES } from './flight'
import { frameEncounter } from './framing'
export async function makeValley(canvas: HTMLCanvasElement) {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap
  renderer.setClearColor('#acd5d6'); renderer.outputColorSpace = T.SRGBColorSpace
  const scene = new T.Scene(); scene.fog = new T.Fog('#b9d7cb', 65, 115)
  scene.add(new T.HemisphereLight('#fff1ce', '#426468', 1.6))
  const sun = new T.DirectionalLight('#ffe3b0', 2); sun.position.set(-18, 40, 15); sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 40, bottom: -40, far: 150 }); scene.add(sun, sun.target)
  const camera = new T.OrthographicCamera(-16, 16, 25, -25, .1, 200)
  const mat = (color: string) => new T.MeshStandardMaterial({ color, roughness: .87 })
  function box(w: number, h: number, d: number, color: string, x: number, y: number, z: number) {
    const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat(color)); m.position.set(x, y, z); m.receiveShadow = true; scene.add(m); return m
  }
  box(170, 1, 680, '#83a765', 0, -1, -255)
  box(11, .12, 660, '#51a8b0', 0, -.35, -260)
  box(12.5, .13, 660, '#b4c488', 0, -.45, -260)
  for (let i = 0; i < 110; i++) {
    const ripple = box(.7 + (i % 3), .015, .09, '#a1d8cf', Math.sin(i * 2.4) * 4, -.26, -i * 5.8)
    ripple.rotation.y = -.1
  }
  // A continuous riverside lane gives the moving rescue convoy a visible route.
  box(3.6, .08, 620, '#d6c393', 10.8, -.35, -250)
  const loader = new GLTFLoader(); const library: Record<string, T.Group> = {}
  const names = ['rescue_aircraft', 'rescue_person_adult', 'rescue_person_child', 'rescue_boat', 'tree_broadleaf', 'tree_pine', 'house_cottage', 'house_hall', 'bridge', 'siege_manta', 'upgrade_capacity', 'upgrade_recharge', 'upgrade_timing']
  await Promise.all(names.map(async name => {
    const gltf = await loader.loadAsync(`/games/shield-of-faith/models/${name}.glb`)
    gltf.scene.traverse(o => { if (o instanceof T.Mesh) { o.castShadow = true; o.receiveShadow = true } })
    library[name] = gltf.scene
  }))
  function model(name: string, x: number, z: number, size: number, y = 0) {
    const o = library[name].clone(true); const bounds = new T.Box3().setFromObject(o).getSize(new T.Vector3())
    o.scale.setScalar(size / Math.max(bounds.x, bounds.z)); o.position.set(x, y, z); scene.add(o); return o
  }
  for (let i = 0; i < 135; i++) {
    const side = i % 2 ? -1 : 1; const x = side * (15 + (i * 7 % 29)); const z = 25 - i * 4
    model(i % 3 ? 'tree_broadleaf' : 'tree_pine', x, z, 3.6 + i % 3)
  }
  // Small riverside homesteads break up the flat banks without filling the flight lane.
  // Deterministic placement keeps scenery stable across replay and locale changes.
  const meadowGeometry = new T.CircleGeometry(1, 9)
  const meadowMaterials = [mat('#729758'), mat('#9ab272'), mat('#b1b77a')]
  for (let i = 0; i < 64; i++) {
    const side = i % 2 ? -1 : 1
    const patch = new T.Mesh(meadowGeometry, meadowMaterials[i % 3])
    patch.rotation.x = -Math.PI / 2; patch.rotation.z = i * 1.7
    patch.scale.set(3 + i % 4, 4 + i % 5, 1)
    patch.position.set(side * (17 + i * 7 % 21), -.47, 18 - i * 8.1)
    patch.receiveShadow = true; scene.add(patch)
  }
  for (let i = 0; i < 27; i++) {
    const side = i % 2 ? -1 : 1; const x = side * (17 + i % 4 * 5); const z = -i * 19
    const home = model(i % 7 ? 'house_cottage' : 'house_hall', x, z, 5.2 + i % 3 * .5)
    home.rotation.y = side * (.12 + i % 3 * .16)
    box(7.8, .05, 8.5, '#b7b781', x, -.4, z)
    box(Math.abs(x) - 6, .06, 1.1, '#c9be8d', side * (Math.abs(x) + 6) / 2, -.32, z + 3)
    for (let j = 0; j < 2; j++) {
      const tree = model((i + j) % 3 ? 'tree_broadleaf' : 'tree_pine', x + side * (4 + j * 2), z + 5 - j * 9, 2.2 + (i + j) % 3 * .45)
      tree.rotation.y = i * 1.2 + j
    }
  }
  for (const at of [55, 180, 320, 445]) model('bridge', 0, -at, 15, -.1)
  const aircraft = model('rescue_aircraft', 0, 0, 5.2, 5)
  const propeller = aircraft.getObjectByName('propeller_spin')
  const boat = model('rescue_boat', 0, 12, 4.8, .1)
  const people = SITES.map(site => {
    box(7, .35, 8, '#e4d3a3', site.x, -.1, -site.at)
    const group = new T.Group(); scene.add(group)
    for (let j = 0; j < 3; j++) { const person = model(j === 1 ? 'rescue_person_child' : 'rescue_person_adult', site.x + (j - 1) * 1.1, -site.at, .7); group.attach(person) }
    const ring = new T.Mesh(new T.TorusGeometry(3.5, .2, 8, 48), new T.MeshBasicMaterial({ color: '#ffe786' })); ring.rotation.x = -Math.PI / 2; ring.position.set(site.x, .3, -site.at); group.add(ring)
    // A raised rescue pennant remains recognizable above the riverside pad.
    const pole = new T.Mesh(new T.CylinderGeometry(.07, .07, 3.2, 6), mat('#705d46')); pole.position.set(site.x + 2.7, 1.6, -site.at - 2.5); group.add(pole)
    const flag = new T.Mesh(new T.BoxGeometry(1.3, .85, .08), new T.MeshBasicMaterial({ color: '#ffe786' })); flag.position.set(site.x + 2.1, 2.8, -site.at - 2.5); group.add(flag)
    return group
  })
  const shield = new T.Mesh(new T.SphereGeometry(5.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: '#83f7e9', emissive: '#2cbfb9', emissiveIntensity: .6, transparent: true, opacity: .38, side: T.DoubleSide, depthWrite: false }))
  shield.rotation.x = Math.PI / 2; scene.add(shield)
  const rescueBeam = new T.Mesh(new T.CylinderGeometry(.2, 2.5, 5, 24, 1, true), new T.MeshBasicMaterial({ color: '#ffedaa', transparent: true, opacity: .3, side: T.DoubleSide })); scene.add(rescueBeam)
  const threats = new Map<number, T.Mesh>()
  const threatGeometry = new T.ConeGeometry(.48, 2.1, 8); const threatMaterial = new T.MeshStandardMaterial({ color: '#db583d', emissive: '#ff521e', emissiveIntensity: .5 })
  const warningMaterial = new T.MeshBasicMaterial({ color: '#fff06a', wireframe: true })
  const impact = new T.Mesh(new T.TorusGeometry(1, .18, 8, 32), new T.MeshBasicMaterial({ color: '#fff8ac', transparent: true })); impact.rotation.x = -Math.PI / 2; scene.add(impact)
  const boss = model('siege_manta', 0, -458, 12, 4)
  const emitters = ['arm_left', 'arm_right'].map(name => boss.getObjectByName(name)!)
  const core = boss.getObjectByName('core') as T.Mesh
  const coreMaterial = new T.MeshStandardMaterial({ color: '#ffc14e', emissive: '#ff9d33', emissiveIntensity: .8 }); core.material = coreMaterial
  const equipment = ['upgrade_capacity', 'upgrade_recharge', 'upgrade_timing'].map((name, i) => { const o = model(name, 0, 0, i === 0 ? 3.5 : 1.8); return o })
  const returned = new T.Mesh(new T.ConeGeometry(.28, 2.2, 8), new T.MeshBasicMaterial({ color: '#b4fff0' })); returned.rotation.x = -Math.PI / 2; scene.add(returned)
  const bossHit = new T.Mesh(new T.TorusGeometry(1.2, .15, 8, 32), new T.MeshBasicMaterial({ color: '#fff1b5', transparent: true })); bossHit.rotation.x = -Math.PI / 2; scene.add(bossHit)
  const drones: T.Group[] = []
  for (let i = 0; i < 3; i++) { const drone = new T.Group(); const body = new T.Mesh(new T.SphereGeometry(.6, 12, 8), mat('#62485c')); body.scale.z = 1.6; drone.add(body); const wing = new T.Mesh(new T.BoxGeometry(3,.18,.7),mat('#aa7380')); drone.add(wing); scene.add(drone); drones.push(drone) }
  const finish = model('house_hall', -12, -485, 11)
  let disposed = false
  return {
    render(s: Flight) {
      if (disposed) return
      const w = canvas.clientWidth, h = canvas.clientHeight
      if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) renderer.setSize(w, h, false)
      const aspect = w / h; const halfW = aspect < 1 ? 14 : 25; camera.left = -halfW; camera.right = halfW; camera.top = halfW / aspect; camera.bottom = -halfW / aspect; camera.updateProjectionMatrix()
      camera.position.set(0, 39, -s.distance + 32); camera.lookAt(0, 0, -s.distance)
      sun.position.set(-18, 40, -s.distance + 15); sun.target.position.set(0, 0, -s.distance)
      aircraft.position.set(s.x, 5 + Math.sin(s.time * 3) * .12, -s.distance + s.y); aircraft.rotation.z = -Math.sin(s.time) * .025
      if (propeller) propeller.rotation.z = s.time * 38
      boat.position.set(convoyX(s.distance), .1, -s.distance + 16)
      shield.material.color.set(s.perfectWindow > 0 ? '#fff6a0' : '#83f7e9'); shield.visible = s.shield; shield.position.set(s.x, 4.5, -s.distance + s.y - 3.5)
      rescueBeam.visible = s.rescueProgress > 0; rescueBeam.position.set(s.x, 2.5, -s.distance + s.y)
      people.forEach((o, i) => { o.visible = !s.rescued[i] })
      drones.forEach((o, i) => { o.position.set(Math.sin(s.time * 1.7) * 8 + (i - 1) * 3.5, 5, -s.distance - 31); o.visible = s.activeSite < 0 && s.distance > 20 && !s.won; o.scale.setScalar(s.spawn < .8 ? 1.2 : 1) })
      equipment.forEach((o, i) => { o.visible = s.upgrades > i; o.position.set(s.x, 5.5 + i * .2, -s.distance + s.y + (i - 1) * 1.2); o.rotation.z = aircraft.rotation.z })
      // Damage is authoritative at interception; the return arc is a visual receipt, never another hit.
      const displayedHealth = s.bossHealth + (s.returnTime > 0 ? 1 : 0)
      boss.visible = s.distance >= 430; boss.position.set(0, displayedHealth ? 4.5 : 1.2, -458)
      boss.rotation.z = displayedHealth === 0 ? .16 : 0
      emitters.forEach((o, i) => { o.rotation.y = displayedHealth ? Math.sin(s.time * 2 + i) * (displayedHealth > 3 ? .18 : .42) : (i ? -.7 : .7); o.rotation.x = displayedHealth ? 0 : .5 })
      coreMaterial.color.set(displayedHealth === 0 ? '#456476' : displayedHealth > 3 ? '#ffc14e' : '#ff7550'); coreMaterial.emissiveIntensity = displayedHealth === 0 ? 0 : s.bossImpact > 0 ? 2 : .7
      core.scale.setScalar(displayedHealth > 3 ? 1 : .8)
      // The rendered core is the destination, including root/phase transforms.
      const coreTarget = core.getWorldPosition(new T.Vector3())
      returned.visible = s.returnTime > 0; const travel = 1 - s.returnTime / .38; returned.position.set(s.returnX + (coreTarget.x - s.returnX) * travel, 4.7 + (coreTarget.y - 4.7) * travel + Math.sin(travel * Math.PI), s.returnZ + (coreTarget.z - s.returnZ) * travel)
      bossHit.visible = s.bossImpact > 0; bossHit.position.copy(coreTarget); bossHit.scale.setScalar(1 + (1 - s.bossImpact / .65) * 3); bossHit.material.opacity = s.bossImpact / .65
      impact.visible = s.impact > 0; impact.position.set(s.impactX, 4.6, s.impactZ); impact.scale.setScalar(1 + (1 - s.impact / .6) * 3); impact.material.color.set(s.impactKind === 'hit' ? '#ff694d' : s.impactKind === 'perfect' ? '#fff49d' : '#8ffff0'); impact.material.opacity = Math.min(1, s.impact * 3);
      const ids = new Set(s.darts.map(d => d.id)); for (const [id, mesh] of threats) if (!ids.has(id)) { scene.remove(mesh); threats.delete(id) }
      for (const dart of s.darts) { let mesh = threats.get(dart.id); if (!mesh) { mesh = new T.Mesh(threatGeometry, threatMaterial); mesh.rotation.x = Math.PI / 2; scene.add(mesh); threats.set(dart.id, mesh) } mesh.material = (dart.warning || 0) > 0 ? warningMaterial : threatMaterial; mesh.scale.setScalar((dart.warning || 0) > 0 ? 1.3 + Math.sin(s.time * 12) * .15 : 1); mesh.position.set(dart.x, 4.5, (dart.warning || 0) > 0 ? -s.distance - 14 : dart.z) }
      if (boss.visible) {
        // Include the actual articulated mesh, full flight lane and convoy.
        // The original symmetric frustum put the elevated boss above the HUD.
        const encounter = new T.Box3().setFromObject(boss).expandByScalar(1)
        encounter.union(new T.Box3(new T.Vector3(-14, 0, -s.distance - 15), new T.Vector3(14, 8, -s.distance + 20)))
        frameEncounter(camera, encounter, w, h)
      }
      finish.rotation.y = .15; renderer.render(scene, camera)
    },
    dispose() { disposed = true; scene.traverse(o => { if (o instanceof T.Mesh) { o.geometry.dispose(); const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => m.dispose()) } }); renderer.dispose() },
  }
}
