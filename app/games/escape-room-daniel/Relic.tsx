'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styles from './room.module.css'

/** A real dimensional clue object; the reducer remains the only puzzle authority. */
export default function Relic({ room, inspected, solved, onInspect, label }: { room: number; inspected: boolean; solved: boolean; onInspect: () => void; label: string }) {
  const host = useRef<HTMLDivElement>(null)
  const state = useRef({ inspected, solved })
  useEffect(() => { state.current = { inspected, solved } }, [inspected, solved])
  useEffect(() => {
    if (!host.current) return
    const target = host.current
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }) } catch { return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    target.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 30)
    camera.position.set(0, 3.3, 6.4); camera.lookAt(0, 0, 0)
    scene.add(new THREE.HemisphereLight('#e1efff', '#654024', 2.5))
    const lamp = new THREE.DirectionalLight('#ffe0a3', 4); lamp.position.set(-3, 5, 4); scene.add(lamp)
    const group = new THREE.Group(); scene.add(group)
    const paper = new THREE.MeshStandardMaterial({ color: '#ead19a', roughness: .86, side: THREE.DoubleSide })
    const wood = new THREE.MeshStandardMaterial({ color: '#573721', roughness: .65 })
    const gold = new THREE.MeshStandardMaterial({ color: '#c69746', metalness: .72, roughness: .28 })
    const wax = new THREE.MeshStandardMaterial({ color: '#8f302c', roughness: .6 })
    const ink = new THREE.MeshStandardMaterial({ color: '#6a503a', roughness: 1 })
    function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) {
      const object = new THREE.Mesh(geometry, material); object.position.set(x,y,z); group.add(object); return object
    }
    // Curled parchment surface, rollers, end caps and hand-inscribed lines.
    const page = new THREE.PlaneGeometry(2.4, 2.4, 32, 32)
    const positions = page.attributes.position
    for (let i=0; i<positions.count; i++) positions.setZ(i, .12 * Math.pow(Math.abs(positions.getY(i)), 5))
    page.computeVertexNormals()
    const sheet = mesh(page, paper, 0, .1, 0); sheet.rotation.x = -Math.PI / 2
    for (const z of [-1.2,1.2]) {
      const roller = mesh(new THREE.CylinderGeometry(.13,.13,2.9,24), wood, 0,.23,z); roller.rotation.z=Math.PI/2
      for (const x of [-1.48,1.48]) { const cap=mesh(new THREE.SphereGeometry(.19,16,12),gold,x,.23,z); cap.scale.set(.55,1,1) }
    }
    for(let i=0;i<7;i++) { const line=mesh(new THREE.BoxGeometry(1.25 + (i%3)*.18,.012,.027),ink,-.12,.115,-.7+i*.19); line.rotation.y=(i%2)*.025 }
    const seal=mesh(new THREE.CylinderGeometry(.25,.28,.1,32),wax,.65,.18,.57)
    const stamp=mesh(new THREE.TorusGeometry(.14,.018,8,24),gold,.65,.24,.57); stamp.rotation.x=-Math.PI/2
    // Window room has an actual adjustable-looking brass instrument, not a flat icon.
    if(room===1) { const ring=mesh(new THREE.TorusGeometry(.48,.055,12,48),gold,0,.22,0); ring.rotation.x=-Math.PI/2; mesh(new THREE.ConeGeometry(.12,.65,3),gold,0,.37,0).rotation.z=Math.PI/2 }
    const base=mesh(new THREE.CylinderGeometry(1.95,2.05,.2,64),wood,0,-.12,0)
    base.material=new THREE.MeshStandardMaterial({color:'#342c31',roughness:.8})
    let frame=0, previous=0, yaw=0
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize=()=>{const b=target.getBoundingClientRect(); renderer.setSize(b.width,b.height);camera.aspect=b.width/Math.max(1,b.height);camera.updateProjectionMatrix()}
    const observer=new ResizeObserver(resize);observer.observe(target);resize()
    const draw=(time:number)=>{
      const dt=Math.min(.05,(time-previous)/1000);previous=time
      const goal=state.current.inspected ? -.3 : .2
      yaw=reduced?goal:THREE.MathUtils.damp(yaw,goal,6,dt)
      group.rotation.y=yaw; group.rotation.x=state.current.inspected ? .13 : 0
      seal.position.y=state.current.solved ? .48 : .18
      wax.color.set(state.current.solved ? '#458774' : '#8f302c')
      renderer.render(scene,camera);frame=requestAnimationFrame(draw)
    }; frame=requestAnimationFrame(draw)
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose(); const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose())}});renderer.dispose();renderer.domElement.remove()}
  }, [room])
  return <button type="button" className={styles.relic} onClick={onInspect} aria-expanded={inspected} aria-controls="daniel-clue"><div className={styles.relicViewport} ref={host} aria-hidden="true"/><span className={styles.relicLabel}>{label}</span></button>
}
