'use client'
/* eslint-disable react-hooks/immutability, react-hooks/set-state-in-effect, react-hooks/refs, react/no-unescaped-entities */

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { WAVE_SIZES, stepGuard, waveOutcome, hasExited, safeBest, ARRIVAL_MS, moveDefender, recoveryEnergy } from './rules'
import { drawCourt, drawShield, drawArrival } from './art'

// ─── Constants ────────────────────────────────────────────────────────────────
const TICK_MS   = 16          // ~62.5 fps fixed timestep
const PLAYER_R  = 18
const BULLET_SPEED = 9
const FIRE_RATE = 320         // ms between auto-shots
const BASE_DART_SPEED = 1.4
const DART_SPAWN_MS   = 2000

const TOTAL_WAVES = WAVE_SIZES.length
const JOY_DEAD   = 10
const JOY_REACH  = 56

// ─── Armor ────────────────────────────────────────────────────────────────────
const ARMOR_TYPES = ['belt','breastplate','boots','shield','helmet','sword'] as const
type ArmorType = typeof ARMOR_TYPES[number]

const ARMOR_DATA: Record<ArmorType, { color: string; icon: string; en: string; ru: string; fxEn: string; fxRu: string }> = {
  belt:        { color: '#fbbf24', icon: '🎗️', en: 'Belt of Truth',       ru: 'Пояс Истины',       fxEn: '+1 shield charge',  fxRu: '+1 заряд щита' },
  breastplate: { color: '#60a5fa', icon: '🛡️', en: 'Breastplate',         ru: 'Броня Правды',      fxEn: '+2 shield charges', fxRu: '+2 заряда щита' },
  boots:       { color: '#34d399', icon: '👟', en: 'Boots of Peace',      ru: 'Обувь Мира',        fxEn: '+35% speed',        fxRu: '+35% скорость' },
  shield:      { color: '#f472b6', icon: '🌟', en: 'Shield of Faith',     ru: 'Щит Веры',          fxEn: 'Longer shield hold', fxRu: 'Щит держится дольше' },
  helmet:      { color: '#a78bfa', icon: '⛑️', en: 'Helmet of Salvation', ru: 'Шлем Спасения',     fxEn: 'Extra life',        fxRu: 'Доп. жизнь' },
  sword:       { color: '#fb923c', icon: '⚔️', en: 'Sword of the Spirit', ru: 'Меч Духа',          fxEn: 'Piercing shots',    fxRu: 'Пронизывает всё' },
}

import { VERSES_EN, VERSES_RU, PRACTICE } from './scripture'

// ─── Entity types ─────────────────────────────────────────────────────────────
interface Player { x: number; y: number; vx: number; vy: number; hp: number; maxHp: number; invMs: number; shieldCharges: number; armor: Set<ArmorType>; speed: number; piercing: boolean }
interface Dart   { id: number; x: number; y: number; vx: number; vy: number; r: number; hp: number; warningMs: number }
interface Bullet { id: number; x: number; y: number; vx: number; vy: number; piercing: boolean }
interface Powerup{ id: number; x: number; y: number; vy: number; type: ArmorType; pulse: number }
interface Particle{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; r: number }

let _id = 0
const uid = () => ++_id

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ShieldOfFaithPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const accRef    = useRef(0)
  const lastRef   = useRef(0)

  // Game state refs (zero lag)
  const stateRef     = useRef<'menu'|'playing'|'paused'|'verse'|'dead'|'victory'>('menu')
  const playerRef    = useRef<Player>({ x: 270, y: 600, vx: 0, vy: 0, hp: 3, maxHp: 3, invMs: 0, shieldCharges: 0, armor: new Set(), speed: PLAYER_R * 0.18, piercing: false })
  const dartsRef     = useRef<Dart[]>([])
  const bulletsRef   = useRef<Bullet[]>([])
  const powerupsRef  = useRef<Powerup[]>([])
  const particlesRef = useRef<Particle[]>([])
  const waveRef      = useRef(0)
  const dartsLeftRef = useRef(WAVE_SIZES[0])
  const dartsKilledRef = useRef(0)
  const scoreRef     = useRef(0)
  const bestRef      = useRef(0)
  const fireTimerRef = useRef(0)
  const spawnTimerRef= useRef(0)

  // Prev player for lerp
  const prevPlayerRef = useRef({ x: 270, y: 600 })

  // Input refs
  const keysRef  = useRef<Set<string>>(new Set())
  const pointerIdRef = useRef<number | null>(null)
  const guardHeldRef = useRef(false)
  const guardRef = useRef({ active: false, energy: 100 })
  const guardButtonRef = useRef<HTMLButtonElement>(null)
  const guardPointerRef = useRef<number | null>(null)
  const cueRef = useRef({ kind: 'start', ms: 3200 })
  const guardLabelRef = useRef<HTMLSpanElement>(null)

  const joyRef   = useRef<{ active: boolean; ax: number; ay: number; cx: number; cy: number }>({ active: false, ax: 0, ay: 0, cx: 0, cy: 0 })
  const joyVecRef= useRef({ dx: 0, dy: 0 })

  // React state for UI overlays only
  const [uiState, setUiState]  = useState<'menu'|'playing'|'paused'|'verse'|'dead'|'victory'>('menu')
  const [verseIdx, setVerseIdx]= useState(0)
  const [armorToast, setArmorToast] = useState<{ type: ArmorType; ts: number } | null>(null)
  const [bestScore, setBestScore] = useState(0)
  const [practiceAnswer, setPracticeAnswer] = useState<'correct' | 'retry' | null>(null)

  // ─── Canvas size ────────────────────────────────────────────────────────────
  const W = useRef(540)
  const H = useRef(820)

  // ─── Init / reset ────────────────────────────────────────────────────────────
  const initGame = useCallback(() => {
    const c = canvasRef.current!
    W.current = window.innerWidth
    H.current = window.innerHeight
    c.width  = W.current  * devicePixelRatio
    c.height = H.current  * devicePixelRatio

    dartsRef.current     = []
    bulletsRef.current   = []
    powerupsRef.current  = []
    particlesRef.current = []
    waveRef.current      = 0
    dartsLeftRef.current = WAVE_SIZES[0]
    dartsKilledRef.current = 0
    scoreRef.current     = 0
    fireTimerRef.current = 0
    spawnTimerRef.current= 0
    accRef.current       = 0
    keysRef.current.clear()
    pointerIdRef.current = null
    guardHeldRef.current = false
    guardPointerRef.current = null
    cueRef.current = { kind: 'start', ms: 3200 }
    guardRef.current = { active: false, energy: 100 }
    joyRef.current.active = false
    joyVecRef.current = { dx: 0, dy: 0 }
    setArmorToast(null)

    const cx = W.current / 2, cy = H.current * 0.65
    playerRef.current = { x: cx, y: cy, vx: 0, vy: 0, hp: 3, maxHp: 3, invMs: 0, shieldCharges: 0, armor: new Set(), speed: 3.2, piercing: false }
    prevPlayerRef.current = { x: cx, y: cy }
  }, [])

  // ─── Particles ──────────────────────────────────────────────────────────────
  const burst = (x: number, y: number, color: string, count = 10) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const spd   = 1.5 + Math.random() * 3.5
      particlesRef.current.push({ x, y, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, life: 30 + Math.random()*20, maxLife: 50, color, r: 2 + Math.random()*3 })
    }
  }

  // ─── Spawn dart ─────────────────────────────────────────────────────────────
  const spawnDart = useCallback(() => {
    const wv = waveRef.current
    const spd = BASE_DART_SPEED + wv * 0.18 + Math.random() * 0.4
    const r   = 14 + Math.random() * 8
    const cx  = W.current / 2
    const cy  = H.current / 2
    // Spawn from random edge
    let x = 0, y = 0
    const edge = Math.floor(Math.random() * 4)
    if (edge === 0) { x = Math.random() * W.current; y = -r }
    else if (edge === 1) { x = W.current + r; y = Math.random() * H.current }
    else if (edge === 2) { x = Math.random() * W.current; y = H.current + r }
    else { x = -r; y = Math.random() * H.current }
    // Aim at center-ish with spread
    const spread = 0.3
    const angle  = Math.atan2(cy - y, cx - x) + (Math.random() - 0.5) * spread
    dartsRef.current.push({ id: uid(), x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, r, hp: 1, warningMs: ARRIVAL_MS })
  }, [])

  // ─── Tick ────────────────────────────────────────────────────────────────────
  const tick = useCallback((dt: number) => {
    const p      = playerRef.current
    const darts  = dartsRef.current
    const bullets= bulletsRef.current
    const pups   = powerupsRef.current
    const parts  = particlesRef.current
    const wv     = waveRef.current
    const W_     = W.current
    const H_     = H.current
    cueRef.current.ms = Math.max(0, cueRef.current.ms - dt)
    for (const d of darts) d.warningMs = Math.max(0, d.warningMs - dt)

    // ── Input → velocity ──
    prevPlayerRef.current = { x: p.x, y: p.y }
    let mx = 0, my = 0
    const keys = keysRef.current
    if (keys.has('ArrowLeft')  || keys.has('a') || keys.has('A')) mx -= 1
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) mx += 1
    if (keys.has('ArrowUp')    || keys.has('w') || keys.has('W')) my -= 1
    if (keys.has('ArrowDown')  || keys.has('s') || keys.has('S')) my += 1
    const jv = joyVecRef.current
    if (joyRef.current.active) { mx += jv.dx; my += jv.dy }
    const mag = Math.sqrt(mx*mx + my*my)
    if (mag > 0) { mx /= mag; my /= mag }
    p.vx = mx * p.speed
    p.vy = my * p.speed


    if (p.invMs > 0) p.invMs -= dt

    guardRef.current = stepGuard(guardRef.current.energy, guardHeldRef.current || keys.has(' '), dt, p.armor.has('shield'))
    Object.assign(p, moveDefender(p.x, p.y, p.vx, p.vy, guardRef.current.active, W_, H_, PLAYER_R))
    // Holding the shield trades movement speed for a broad defensive radius.
    if (guardRef.current.active) {
      for (let i = darts.length - 1; i >= 0; i--) {
        const d = darts[i]
        if (d.warningMs > 0) continue
        if (Math.hypot(d.x - p.x, d.y - p.y) < PLAYER_R + 48 + d.r) {
          cueRef.current = { kind: 'block', ms: 850 }
          burst(d.x, d.y, '#7dd3fc', 10)
          darts.splice(i, 1)
          scoreRef.current += 15
          dartsKilledRef.current++
        }
      }
    }

    // ── Auto-fire ──
    fireTimerRef.current += dt
    const fireRate = p.armor.has('sword') ? FIRE_RATE * 0.7 : FIRE_RATE
    const liveDarts = darts.filter(d => d.warningMs <= 0)
    if (fireTimerRef.current >= fireRate && liveDarts.length > 0) {
      fireTimerRef.current = 0
      let nearest = liveDarts[0], minD = Infinity
      for (const d of liveDarts) {
        const dd = (d.x - p.x)**2 + (d.y - p.y)**2
        if (dd < minD) { minD = dd; nearest = d }
      }
      const bAngle = Math.atan2(nearest.y - p.y, nearest.x - p.x)
      bullets.push({ id: uid(), x: p.x, y: p.y, vx: Math.cos(bAngle)*BULLET_SPEED, vy: Math.sin(bAngle)*BULLET_SPEED, piercing: p.piercing })
    }

    // ── Dart spawn ──
    spawnTimerRef.current += dt
    const spawnRate = Math.max(600, DART_SPAWN_MS - wv * 120)
    if (spawnTimerRef.current >= spawnRate && dartsLeftRef.current > 0) {
      spawnTimerRef.current = 0
      dartsLeftRef.current--
      spawnDart()
    }

    // ── Move bullets ──
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i]
      b.x += b.vx; b.y += b.vy
      if (b.x < -20 || b.x > W_+20 || b.y < -20 || b.y > H_+20) { bullets.splice(i, 1) }
    }

    // ── Move darts ──
    for (const d of darts) { if (d.warningMs <= 0) { d.x += d.vx; d.y += d.vy } }

    // ── Bullet ↔ dart collisions ──
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const b = bullets[bi]
      for (let di = darts.length - 1; di >= 0; di--) {
        const d = darts[di]
        if (d.warningMs > 0) continue
        if ((b.x-d.x)**2 + (b.y-d.y)**2 < (d.r + 5)**2) {
          d.hp--
          burst(d.x, d.y, '#fbbf24', 7)
          if (!b.piercing) { bullets.splice(bi, 1) }
          if (d.hp <= 0) {
            burst(d.x, d.y, '#f97316', 14)
            scoreRef.current += 10 + wv * 2
            dartsKilledRef.current++
            // Drop powerup chance
            if (Math.random() < 0.2) {
              const type = ARMOR_TYPES[Math.floor(Math.random() * ARMOR_TYPES.length)]
              if (!p.armor.has(type)) {
                pups.push({ id: uid(), x: d.x, y: d.y, vy: 0.8, type, pulse: 0 })
              }
            }
            darts.splice(di, 1)

          }
          break
        }
      }
    }

    // ── Dart → player collisions ──
    for (let di = darts.length - 1; di >= 0; di--) {
      const d = darts[di]
      if (d.warningMs > 0) continue
      const dist2 = (d.x - p.x)**2 + (d.y - p.y)**2
      if (dist2 < (d.r + PLAYER_R)**2) {
        if (p.shieldCharges > 0) {
          p.shieldCharges--
          burst(d.x, d.y, '#f472b6', 12)
          darts.splice(di, 1)
          continue
        }
        if (p.invMs <= 0) {
          p.hp--
          p.invMs = 1800
          guardRef.current.energy = recoveryEnergy(guardRef.current.energy)
          cueRef.current = { kind: 'recover', ms: 1800 }
          burst(p.x, p.y, '#ef4444', 18)
          if (p.hp <= 0) {
            stateRef.current = 'dead'
            if (scoreRef.current > bestRef.current) bestRef.current = scoreRef.current
            setBestScore(bestRef.current)
            setUiState('dead')
          }
        }
        darts.splice(di, 1)
      }
    }

    // Every removal path counts toward completion, including dodged darts.
    for (let i = darts.length - 1; i >= 0; i--) {
      if (hasExited(darts[i], W_, H_)) darts.splice(i, 1)
    }
    const outcome = waveOutcome(p.hp, dartsLeftRef.current, darts.length, wv)
    if (outcome !== 'playing') {
      setPracticeAnswer(null)
      stateRef.current = outcome
      setVerseIdx(wv % VERSES_EN.length)
      setUiState(outcome)
      guardHeldRef.current = false
      guardPointerRef.current = null
      pointerIdRef.current = null
      joyRef.current.active = false
      joyVecRef.current = { dx: 0, dy: 0 }
      keysRef.current.clear()
      return // No pickups or side effects after a terminal/verse transition.
    }

    // ── Powerup collection ──
    for (let i = pups.length - 1; i >= 0; i--) {
      const pu = pups[i]
      if (p.armor.has(pu.type)) { pups.splice(i, 1); continue }
      pu.y += pu.vy
      pu.pulse++
      if (pu.y > H_ + 40) { pups.splice(i, 1); continue }
      if ((pu.x - p.x)**2 + (pu.y - p.y)**2 < (PLAYER_R + 18)**2) {
        // Apply armor effect
        p.armor.add(pu.type)
        if (pu.type === 'shield') guardRef.current.energy = 100
        if (pu.type === 'belt') p.shieldCharges += 1
        if (pu.type === 'breastplate') p.shieldCharges += 2
        if (pu.type === 'boots')       p.speed = Math.min(p.speed * 1.35, 6.5)
        if (pu.type === 'helmet')      { p.maxHp++; p.hp = Math.min(p.hp + 1, p.maxHp) }
        if (pu.type === 'sword')       p.piercing = true
        burst(pu.x, pu.y, ARMOR_DATA[pu.type].color, 16)
        scoreRef.current += 50
        setArmorToast({ type: pu.type, ts: Date.now() })
        pups.splice(i, 1)
      }
    }

    // ── Particles ──
    for (let i = parts.length - 1; i >= 0; i--) {
      const pt = parts[i]
      pt.x += pt.vx; pt.y += pt.vy
      pt.vy += 0.05
      pt.life--
      if (pt.life <= 0) parts.splice(i, 1)
    }
  }, [spawnDart])

  // ─── Draw ────────────────────────────────────────────────────────────────────
  const draw = useCallback((alpha: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = devicePixelRatio
    const W_ = W.current, H_ = H.current

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, W_, H_)

    drawCourt(ctx, W_, H_)

    const p   = playerRef.current
    const prev= prevPlayerRef.current
    const px  = prev.x + (p.x - prev.x) * alpha
    const py  = prev.y + (p.y - prev.y) * alpha
    if (guardRef.current.active) {
      ctx.fillStyle = 'rgba(125,211,252,.16)'
      ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.arc(px, py, PLAYER_R + 48, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    }
    if (guardButtonRef.current) {
      guardButtonRef.current.style.background = `linear-gradient(to top, #146487 ${guardRef.current.energy}%, #172c3b ${guardRef.current.energy}%)`
      guardButtonRef.current.setAttribute('aria-pressed', String(guardRef.current.active))
    }
    if (guardLabelRef.current) guardLabelRef.current.textContent = guardRef.current.energy < 15
      ? (isRu ? 'Отпусти' : 'Release') : (isRu ? 'Держи щит' : 'Hold shield')
    canvas.dataset.state = JSON.stringify({ phase: stateRef.current, x: p.x, y: p.y, hp: p.hp, wave: waveRef.current + 1, remaining: dartsRef.current.length + dartsLeftRef.current, nearestThreat: Math.min(9999, ...dartsRef.current.map(d => Math.hypot(d.x - p.x, d.y - p.y) - d.r)), score: scoreRef.current, guard: guardRef.current, armor: Array.from(p.armor), warnings: dartsRef.current.filter(d => d.warningMs > 0).map(d => ({ x: d.x, y: d.y, remaining: d.warningMs })), cue: cueRef.current })

    // Powerups
    for (const pu of powerupsRef.current) {
      const ac = ARMOR_DATA[pu.type].color
      const pulse = Math.sin(pu.pulse * 0.12) * 3
      ctx.save()
      ctx.fillStyle = '#102931'; ctx.strokeStyle = ac; ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(pu.x, pu.y, 23, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.shadowColor = ac; ctx.shadowBlur = 14 + pulse
      ctx.font = `${20 + pulse}px sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(ARMOR_DATA[pu.type].icon, pu.x, pu.y)
      ctx.restore()
    }

    // Darts
    for (const d of dartsRef.current) {
      const angle = Math.atan2(d.vy, d.vx)
      if (d.warningMs > 0) {
        drawArrival(ctx, Math.max(28, Math.min(W_ - 28, d.x)), Math.max(120, Math.min(H_ - 180, d.y)), angle, 1 - d.warningMs / ARRIVAL_MS)
        continue
      }
      ctx.save()
      ctx.translate(d.x, d.y)
      ctx.rotate(angle)
      // Flame dart body
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, d.r)
      grad.addColorStop(0, '#fef08a')
      grad.addColorStop(0.4, '#f97316')
      grad.addColorStop(1, 'rgba(239,68,68,0)')
      ctx.beginPath()
      ctx.ellipse(0, 0, d.r * 1.6, d.r * 0.7, 0, 0, Math.PI*2)
      ctx.fillStyle = grad
      ctx.fill()
      // A pointed head and shaft show travel direction even without motion.
      ctx.strokeStyle = '#ffd39b'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(-d.r, 0); ctx.lineTo(d.r * .6, 0); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(d.r * .8, 0); ctx.lineTo(-d.r * .1, -d.r * .38); ctx.lineTo(-d.r * .1, d.r * .38); ctx.closePath()
      ctx.fillStyle = '#fff7ed'; ctx.fill()
      ctx.restore()
    }

    // Bullets
    for (const b of bulletsRef.current) {
      ctx.save()
      ctx.shadowColor = b.piercing ? '#fb923c' : '#fde68a'
      ctx.shadowBlur = 10
      ctx.fillStyle = b.piercing ? '#fb923c' : '#fef9c3'
      ctx.beginPath(); ctx.arc(b.x, b.y, b.piercing ? 5 : 3.5, 0, Math.PI*2)
      ctx.fill()
      ctx.restore()
    }

    // Particles
    for (const pt of particlesRef.current) {
      const alpha2 = pt.life / pt.maxLife
      ctx.save()
      ctx.globalAlpha = alpha2
      ctx.fillStyle = pt.color
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI*2)
      ctx.fill()
      ctx.restore()
    }

    // The defender never disappears on a hit. A steady recovery ring replaces flashing.
    ctx.fillStyle = '#071e2888'
    ctx.beginPath(); ctx.ellipse(px, py + 25, 24, 8, 0, 0, Math.PI * 2); ctx.fill()
    drawShield(ctx, px, py, 32, guardRef.current.active)
    ctx.strokeStyle = p.invMs > 0 ? '#ffffff' : '#7dd3fc'; ctx.lineWidth = 4
    ctx.beginPath(); ctx.arc(px, py, 33, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (p.invMs > 0 ? p.invMs / 1800 : guardRef.current.energy / 100)); ctx.stroke()
    if (p.shieldCharges > 0) {
      ctx.fillStyle = '#fff0bd'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'
      ctx.fillText(`+${p.shieldCharges}`, px, py + 48)
    }

    const cue = cueRef.current
    const cueText = cue.ms > 0 && cue.kind === 'recover' ? (isRu ? 'Ты защищён! Держи щит.' : 'You’re safe! Hold your shield.')
      : guardRef.current.energy < 15 ? (isRu ? 'Отпусти щит — набери силу' : 'Release shield — refill your energy')
      : cue.ms > 0 && cue.kind === 'block' ? (isRu ? 'Стрела погашена!' : 'Dart blocked!')
      : cue.ms > 0 ? (isRu ? 'Следи за стрелками по краям' : 'Watch the arrows at the edges') : ''
    if (cueText) {
      ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'
      const box = Math.min(W_ - 24, ctx.measureText(cueText).width + 24)
      ctx.fillStyle = '#102931ed'; ctx.fillRect((W_ - box) / 2, 112, box, 34)
      ctx.fillStyle = '#fff0bd'; ctx.fillText(cueText, W_ / 2, 134, W_ - 40)
    }

    // HUD
    const hud_x = 14, hud_y = 14
    ctx.textAlign = 'left'
    // HP hearts
    for (let i = 0; i < p.maxHp; i++) {
      ctx.font = '20px sans-serif'
      ctx.fillText(i < p.hp ? '❤️' : '🖤', hud_x + i * 26, hud_y + 10)
    }
    // Score
    ctx.fillStyle = '#fde68a'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(String(scoreRef.current), W_ - 14, hud_y + 14)
    // Wave
    ctx.fillStyle = '#bae6fd'
    ctx.font = 'bold 13px sans-serif'
    ctx.fillText(`${isRu ? 'Волна' : 'Wave'} ${waveRef.current + 1}/${TOTAL_WAVES}`, W_ - 14, hud_y + 32)
    // Darts remaining
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '12px sans-serif'
    ctx.fillText(`${dartsRef.current.length + dartsLeftRef.current} ${isRu ? 'снарядов' : 'darts left'}`, hud_x, H_ - 14)
    // Armor collected
    const armorArr = Array.from(p.armor)
    for (let i = 0; i < armorArr.length; i++) {
      ctx.font = '18px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(ARMOR_DATA[armorArr[i]].icon, hud_x + i * 26, H_ - 36)
    }
    // Shield charges
    if (p.shieldCharges > 0) {
      ctx.fillStyle = '#f472b6'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left'
      ctx.fillText(`🌟×${p.shieldCharges}`, hud_x, H_ - 54)
    }

    // Joystick ring
    const joy = joyRef.current
    if (joy.active) {
      ctx.save(); ctx.globalAlpha = 0.28
      ctx.strokeStyle = '#7ec8e3'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(joy.ax, joy.ay, JOY_REACH, 0, Math.PI*2); ctx.stroke()
      ctx.fillStyle = '#7ec8e3'
      ctx.beginPath(); ctx.arc(joy.cx, joy.cy, 14, 0, Math.PI*2); ctx.fill()
      ctx.restore()
    }

    ctx.restore()
  }, [isRu])

  // ─── Game loop ───────────────────────────────────────────────────────────────
  const loop = useCallback((now: number) => {
    if (stateRef.current !== 'playing') return
    const dt = Math.min(now - lastRef.current, 100)
    lastRef.current = now
    accRef.current += dt
    while (accRef.current >= TICK_MS && stateRef.current === 'playing') { tick(TICK_MS); accRef.current -= TICK_MS }
    draw(accRef.current / TICK_MS)
    rafRef.current = requestAnimationFrame(loop)
  }, [tick, draw])

  const startPlay = useCallback(() => {
    initGame()
    stateRef.current = 'playing'
    setUiState('playing')
    lastRef.current = performance.now()
    accRef.current  = 0
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [initGame, loop])

  const nextWave = useCallback(() => {
    if (stateRef.current !== 'verse') return
    const next = waveRef.current + 1
    if (next >= TOTAL_WAVES) { stateRef.current = 'victory'; setUiState('victory'); return }
    waveRef.current      = next
    dartsLeftRef.current = WAVE_SIZES[next]
    dartsRef.current     = []
    bulletsRef.current   = []
    spawnTimerRef.current= 0
    stateRef.current     = 'playing'
    accRef.current = 0
    guardRef.current = { active: false, energy: 100 }
    playerRef.current.hp = Math.min(playerRef.current.maxHp, playerRef.current.hp + 1)
    cueRef.current = { kind: 'start', ms: 2200 }
    const nextArmor = ARMOR_TYPES.find(type => !playerRef.current.armor.has(type))
    powerupsRef.current = nextArmor ? [{ id: uid(), x: W.current / 2, y: H.current / 2, vy: 0, type: nextArmor, pulse: 0 }] : []
    setUiState('playing')
    lastRef.current = performance.now()
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  const pausePlay = useCallback(() => {
    if (stateRef.current !== 'playing') return
    stateRef.current = 'paused'; setUiState('paused')
    keysRef.current.clear(); guardHeldRef.current = false
    guardPointerRef.current = null
    pointerIdRef.current = null; joyRef.current.active = false
    joyVecRef.current = { dx: 0, dy: 0 }
    cancelAnimationFrame(rafRef.current)
  }, [])
  const resumePlay = useCallback(() => {
    if (stateRef.current !== 'paused') return
    stateRef.current = 'playing'; setUiState('playing')
    lastRef.current = performance.now(); accRef.current = 0
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])
  useEffect(() => {
    const hidden = () => { if (document.hidden) pausePlay() }
    window.addEventListener('blur', pausePlay)
    document.addEventListener('visibilitychange', hidden)
    return () => {
      window.removeEventListener('blur', pausePlay)
      document.removeEventListener('visibilitychange', hidden)
      cancelAnimationFrame(rafRef.current)
    }
  }, [pausePlay])

  // Removal must not depend on CSS animation (including reduced-motion mode).
  useEffect(() => {
    if (!armorToast) return
    const timer = window.setTimeout(() => setArmorToast(null), 1800)
    return () => window.clearTimeout(timer)
  }, [armorToast])

  // ─── Canvas resize ───────────────────────────────────────────────────────────
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ro = new ResizeObserver(() => {
      if (stateRef.current !== 'playing' && stateRef.current !== 'paused') return
      if (c.offsetWidth <= 0 || c.offsetHeight <= 0) return
      const oldW = W.current, oldH = H.current
      W.current = c.offsetWidth
      H.current = c.offsetHeight
      playerRef.current.x *= W.current / oldW
      playerRef.current.y *= H.current / oldH
      prevPlayerRef.current = { x: playerRef.current.x, y: playerRef.current.y }
      for (const group of [dartsRef.current, bulletsRef.current, powerupsRef.current]) {
        for (const item of group) { item.x *= W.current / oldW; item.y *= H.current / oldH }
      }
      c.width  = W.current  * devicePixelRatio
      c.height = H.current  * devicePixelRatio
    })
    ro.observe(c)
    return () => ro.disconnect()
  }, [])

  // ─── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { pausePlay(); return }
      if (stateRef.current !== 'playing') return
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault()
      keysRef.current.add(e.key)
    }
    const onUp   = (e: KeyboardEvent) => keysRef.current.delete(e.key)
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup',   onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [pausePlay])

  // ─── Joystick pointer ────────────────────────────────────────────────────────
  const onPtrDown = useCallback((e: React.PointerEvent) => {
    if (stateRef.current !== 'playing' || pointerIdRef.current !== null) return
    pointerIdRef.current = e.pointerId
    const canvas = canvasRef.current!
    const rect   = canvas.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    canvas.setPointerCapture(e.pointerId)
    joyRef.current = { active: true, ax: cx, ay: cy, cx, cy }
    joyVecRef.current = { dx: 0, dy: 0 }
  }, [])

  const onPtrMove = useCallback((e: React.PointerEvent) => {
    if (!joyRef.current.active || pointerIdRef.current !== e.pointerId) return
    const canvas = canvasRef.current!
    const rect   = canvas.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const dx = cx - joyRef.current.ax
    const dy = cy - joyRef.current.ay
    const dist = Math.sqrt(dx*dx + dy*dy)
    // Drag anchor
    if (dist > JOY_REACH) {
      const ox = (dx / dist) * (dist - JOY_REACH)
      const oy = (dy / dist) * (dist - JOY_REACH)
      joyRef.current.ax += ox; joyRef.current.ay += oy
    }
    const ndx = cx - joyRef.current.ax
    const ndy = cy - joyRef.current.ay
    const nd  = Math.sqrt(ndx*ndx + ndy*ndy)
    if (nd > JOY_DEAD) {
      joyVecRef.current = { dx: ndx / Math.max(nd, JOY_REACH) * 1.1, dy: ndy / Math.max(nd, JOY_REACH) * 1.1 }
    } else {
      joyVecRef.current = { dx: 0, dy: 0 }
    }
    joyRef.current.cx = cx; joyRef.current.cy = cy
  }, [])

  const onPtrUp = useCallback((e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return
    pointerIdRef.current = null
    joyRef.current.active = false
    joyVecRef.current = { dx: 0, dy: 0 }
  }, [])

  // ─── Best score ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let saved = 0
    try { saved = safeBest(localStorage.getItem('shield-of-faith-best')) } catch { /* Private/offline play remains available. */ }
    bestRef.current = saved
    setBestScore(saved)
  }, [])

  useEffect(() => {
    if (uiState === 'dead' || uiState === 'victory') {
      const b = Math.max(scoreRef.current, bestRef.current)
      bestRef.current = b
      try { localStorage.setItem('shield-of-faith-best', String(b)) } catch { /* Keep the session best if storage is unavailable. */ }
      setBestScore(b)
    }
  }, [uiState])

  const verses = isRu ? VERSES_RU : VERSES_EN
  const verse  = verses[verseIdx]

  // ─── JSX ─────────────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100dvh', background: 'linear-gradient(180deg,#050a1a,#0a1830)', userSelect: 'none', WebkitUserSelect: 'none', fontFamily: 'Arial, sans-serif' }}>
      {/* ── CANVAS (always mounted, fullscreen during play) ── */}
      <canvas
        ref={canvasRef}
        aria-label={isRu ? 'Арена. Двигайся стрелками. Пробел — щит.' : 'Arena. Arrow keys move. Space holds your shield.'}
        onPointerDown={onPtrDown}
        onPointerMove={onPtrMove}
        onPointerUp={onPtrUp}
        onPointerCancel={onPtrUp}
        onLostPointerCapture={onPtrUp}
        onContextMenu={e => e.preventDefault()}
        style={{
          display: uiState === 'playing' || uiState === 'paused' ? 'block' : 'none',
          position: 'fixed', inset: 0, width: '100%', height: '100%',
          touchAction: 'none', cursor: 'none', zIndex: 1000
        }}
      />

      {uiState === 'playing' && <>
        <button onClick={pausePlay} style={{ position: 'fixed', top: 'max(56px, env(safe-area-inset-top))', right: 14, zIndex: 1010, minHeight: 48, padding: '8px 18px', borderRadius: 14, border: '1px solid #93c5fd', background: '#142c3b', color: '#fff', fontWeight: 800 }}>{isRu ? 'Пауза' : 'Pause'}</button>
        <div aria-hidden="true" style={{ position: 'fixed', bottom: 'max(70px, env(safe-area-inset-bottom))', left: 24, width: 88, height: 88, border: '2px solid #a6c7c855', borderRadius: '50%', background: '#b8e8df12', zIndex: 1002, pointerEvents: 'none', display: 'grid', placeItems: 'center', color: '#bdd8db', fontSize: 28 }}>✥</div>
        <button ref={guardButtonRef} aria-label={isRu ? 'Держи щит' : 'Hold shield'} aria-pressed={false}
          onPointerDown={e => { e.preventDefault(); if (guardPointerRef.current !== null) return; guardPointerRef.current = e.pointerId; e.currentTarget.setPointerCapture(e.pointerId); guardHeldRef.current = true }}
          onPointerUp={e => { if (guardPointerRef.current === e.pointerId) { guardPointerRef.current = null; guardHeldRef.current = false } }}
          onPointerCancel={e => { if (guardPointerRef.current === e.pointerId) { guardPointerRef.current = null; guardHeldRef.current = false } }}
          onLostPointerCapture={e => { if (guardPointerRef.current === e.pointerId) { guardPointerRef.current = null; guardHeldRef.current = false } }}
          onKeyDown={e => { if (e.key === 'Enter') guardHeldRef.current = true }}
          onKeyUp={() => { guardHeldRef.current = false }}
          style={{ position: 'fixed', bottom: 'max(58px, env(safe-area-inset-bottom))', right: 20, width: 104, height: 104, borderRadius: '50%', border: '3px solid #8cddf2', color: '#fff', zIndex: 1010, touchAction: 'none', fontWeight: 900, fontSize: 16 }}>
          <span style={{ display: 'block', fontSize: 28 }}>🛡</span><span ref={guardLabelRef}>{isRu ? 'Держи щит' : 'Hold shield'}</span>
        </button>
        <p style={{ position: 'fixed', bottom: 6, left: '24%', right: '24%', margin: 0, textAlign: 'center', color: '#d7e6e8', fontSize: 12, zIndex: 1005, pointerEvents: 'none' }}>{isRu ? 'Отпусти щит, чтобы восстановить его силу' : 'Release your shield to recharge'}</p>
      </>}
      {uiState === 'paused' && <div role="dialog" aria-modal="true" aria-label={isRu ? 'Пауза' : 'Paused'} style={{ position: 'fixed', inset: 0, zIndex: 1200, background: '#071923dc', display: 'grid', placeItems: 'center', color: 'white', padding: 24 }}>
        <div style={{ textAlign: 'center' }}><h2>{isRu ? 'Пауза' : 'Paused'}</h2>
        <button onClick={resumePlay} style={{ padding: '16px 32px', borderRadius: 16, background: '#ffe1a1', color: '#342a12', border: 0, fontWeight: 900, fontSize: 18 }}>{isRu ? 'Продолжить' : 'Resume'}</button>
        <Link href="/games" style={{ display: 'block', padding: 24, color: '#fff' }}>{isRu ? 'К играм' : 'All games'}</Link></div>
      </div>}

      {/* ── ARMOR TOAST ── */}
      {armorToast && (
        <div key={armorToast.ts} style={{
          position: 'fixed', top: 180, left: '50%', transform: 'translate(-50%,-50%)',
          display: uiState === 'playing' ? 'block' : 'none',
          background: 'rgba(0,0,0,0.82)', borderRadius: 20, padding: '14px 28px',
          border: `2px solid ${ARMOR_DATA[armorToast.type].color}`,
          textAlign: 'center', pointerEvents: 'none', zIndex: 1100,
          animation: 'fadeInOut 1.8s ease forwards'
        }}>
          <div style={{ fontSize: '2rem' }}>{ARMOR_DATA[armorToast.type].icon}</div>
          <div style={{ color: ARMOR_DATA[armorToast.type].color, fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1rem' }}>
            {isRu ? ARMOR_DATA[armorToast.type].ru : ARMOR_DATA[armorToast.type].en}
          </div>
          <div style={{ color: '#fff', fontFamily: 'sans-serif', fontSize: '.8rem', opacity: 0.8 }}>
            {isRu ? ARMOR_DATA[armorToast.type].fxRu : ARMOR_DATA[armorToast.type].fxEn}
          </div>
        </div>
      )}

      {/* ── MENU ── */}
      {uiState === 'menu' && (
        <section style={{ maxWidth: 520, margin: '0 auto', padding: '36px 20px', color: '#fff' }}>
          <Link href="/games" style={{ color: '#ffd866', fontFamily: 'sans-serif', fontWeight: 900, textDecoration: 'none' }}>
            ← {isRu ? 'К играм' : 'Back to Games'}
          </Link>
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 8 }}>🛡️</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/jr/games/shield-of-faith-hero.png"
              alt=""
              aria-hidden="true"
              style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 24, border: '3px solid rgba(147,197,253,.45)', boxShadow: '0 24px 70px rgba(0,0,0,.42)', marginBottom: 18 }}
            />
            <h1 style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem,7vw,3rem)', color: '#fff', margin: '0 0 8px' }}>
              {isRu ? 'Щит Веры' : 'Shield of Faith'}
            </h1>
            <p style={{ fontFamily: 'sans-serif', color: '#93c5fd', fontWeight: 700, fontSize: '1rem', margin: '0 0 6px' }}>
              {isRu ? 'Ефесянам 6:16' : 'Ephesians 6:16'}
            </p>
            <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.8)', lineHeight: 1.6, marginBottom: 28, fontStyle: 'italic', fontSize: '.95rem' }}>
              {verses[4].text}
            </p>

            {/* How to play */}
            <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 18, padding: '20px 20px', marginBottom: 28, textAlign: 'left' }}>
              <p style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fde68a', margin: '0 0 10px', fontSize: '.95rem' }}>
                {isRu ? 'Как играть' : 'How to play'}
              </p>
              {[
                isRu ? ['🕹️', 'Двигайся джойстиком (тач) или WASD'] : ['🕹️', 'Move with the joystick (touch) or WASD'],
                isRu ? ['🎯', 'Воин сам целится и стреляет'] : ['🎯', 'Your warrior auto-aims and fires'],
                isRu ? ['🛡️', 'Держи щит, чтобы гасить стрелы. Отпусти — он восстановится. На клавиатуре: пробел.'] : ['🛡️', 'Hold your shield to extinguish darts. Release to recharge. Keyboard: Space.'],
                isRu ? ['🔥', 'Раскалённые стрелы летят со всех сторон'] : ['🔥', 'Fiery darts fly in from every direction'],
                isRu ? ['⚔️', 'Собирай доспехи для силовых усилений'] : ['⚔️', 'Collect armor pieces for power-ups'],
                isRu ? ['📖', 'Между волнами читай Слово Божье'] : ['📖', 'Between waves, read God\'s Word'],
              ].map(([icon, text]) => (
                <div key={String(text)} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 7 }}>
                  <span style={{ fontSize: '1rem' }}>{icon}</span>
                  <span style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.85)', fontSize: '.88rem' }}>{text}</span>
                </div>
              ))}
            </div>

            {bestScore > 0 && (
              <p style={{ fontFamily: 'sans-serif', color: '#fbbf24', fontWeight: 700, marginBottom: 16 }}>
                {isRu ? `Рекорд: ${bestScore}` : `Best: ${bestScore}`}
              </p>
            )}

            <button
              onClick={startPlay}
              style={{ background: 'linear-gradient(180deg,#fbbf24,#f97316)', color: '#3b2307', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1.15rem', border: 'none', borderRadius: 16, padding: '16px 48px', cursor: 'pointer', boxShadow: '0 8px 32px rgba(251,191,36,.4)' }}
            >
              {isRu ? 'Играть →' : 'Play →'}
            </button>
          </div>
        </section>
      )}

      {/* ── VERSE OVERLAY ── */}
      {uiState === 'verse' && verse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,26,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: 20 }}>
          <div style={{ maxWidth: 440, maxHeight: '90dvh', overflowY: 'auto', textAlign: 'center', color: '#fff' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📖</div>
            <p style={{ fontFamily: 'sans-serif', color: '#93c5fd', fontWeight: 900, fontSize: '.9rem', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              {isRu ? `Волна ${waveRef.current + 1} пройдена!` : `Wave ${waveRef.current + 1} clear!`}
            </p>
            <p style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 'clamp(1rem,4vw,1.3rem)', color: '#fff', lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic' }}>
              "{verse.text}"
            </p>
            <p style={{ fontFamily: 'sans-serif', color: '#fde68a', fontWeight: 900, marginBottom: 32 }}>{verse.ref}</p>
            <p>{isRu ? 'Как применить это сегодня?' : 'How can you live this today?'}</p>
            {Array.from({length: 2}, (_, i) => {
              const correct = i === verseIdx % 2
              return <button key={i} disabled={practiceAnswer === 'correct'} onClick={() => setPracticeAnswer(correct ? 'correct' : 'retry')} style={{ display: 'block', width: '100%', padding: '14px 16px', minHeight: 52, marginBottom: 10, borderRadius: 12, border: '1px solid #6f99a9', background: '#173443', color: '#fff', fontWeight: 700, fontSize: 16 }}>{correct ? PRACTICE[verseIdx][isRu ? 1 : 0] : (isRu ? 'Забыть о Боге и поступать как хочется.' : 'Forget God and do whatever I feel like.')}</button>
            })}
            <p role="status">{practiceAnswer === 'retry' ? (isRu ? 'Посмотри на стих ещё раз. Что помогает поступить верно?' : 'Read the verse again. What helps you do what is right?') : practiceAnswer === 'correct' ? (ARMOR_TYPES.some(type => !playerRef.current.armor.has(type)) ? (isRu ? 'Верно! В центре тебя ждут доспехи.' : 'Yes! Look for armor in the center.') : (isRu ? 'Верно! Щит восстановится перед новой волной.' : 'Yes! Your shield refills for the next wave.')) : ''}</p>
            <button
              onClick={nextWave}
              disabled={practiceAnswer !== 'correct'}
              style={{ background: 'linear-gradient(180deg,#fbbf24,#f97316)', color: '#3b2307', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1.1rem', border: 'none', borderRadius: 14, padding: '14px 40px', cursor: 'pointer' }}
            >
              {isRu ? `Волна ${waveRef.current + 2} →` : `Wave ${waveRef.current + 2} →`}
            </button>
          </div>
        </div>
      )}

      {/* ── DEAD ── */}
      {uiState === 'dead' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,26,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
          <div style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛡️</div>
            <h2 style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fff', fontSize: '1.6rem', margin: '0 0 8px' }}>
              {isRu ? 'Устоять тяжело...' : 'You fell this time...'}
            </h2>
            <p style={{ fontFamily: 'sans-serif', color: '#93c5fd', lineHeight: 1.6, marginBottom: 8, fontStyle: 'italic' }}>
              {verses[0].text} — {verses[0].ref}
            </p>
            <p style={{ fontFamily: 'sans-serif', color: '#fde68a', fontWeight: 900, fontSize: '1.3rem', marginBottom: 6 }}>
              {isRu ? `Очки: ${scoreRef.current}` : `Score: ${scoreRef.current}`}
            </p>
            {bestScore > 0 && (
              <p style={{ fontFamily: 'sans-serif', color: '#fbbf24', fontWeight: 700, marginBottom: 24, fontSize: '.9rem' }}>
                {isRu ? `Рекорд: ${bestScore}` : `Best: ${bestScore}`}
              </p>
            )}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
              <button onClick={startPlay} style={{ background: 'linear-gradient(180deg,#fbbf24,#f97316)', color: '#3b2307', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1rem', border: 'none', borderRadius: 14, padding: '13px 30px', cursor: 'pointer' }}>
                {isRu ? 'Ещё раз' : 'Try again'}
              </button>
              <Link href="/games" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', fontFamily: 'sans-serif', fontWeight: 700, fontSize: '1rem', borderRadius: 14, padding: '13px 30px', textDecoration: 'none', display: 'inline-block' }}>
                {isRu ? 'К играм' : 'Games'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── VICTORY ── */}
      {uiState === 'victory' && (
        <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg,#050a1a,#0c2a4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20, overflowY: 'auto' }}>
          <div style={{ maxWidth: 460, textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🏆</div>
            <h2 style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fde68a', fontSize: 'clamp(1.5rem,6vw,2.2rem)', margin: '0 0 10px' }}>
              {isRu ? 'Ты прошёл все волны!' : 'You stood through every wave!'}
            </h2>
            <p style={{ fontFamily: 'sans-serif', color: '#bae6fd', lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic', fontSize: '.95rem' }}>
              {verses[9].text} — {verses[9].ref}
            </p>
            <p style={{ fontFamily: 'sans-serif', color: '#fde68a', fontWeight: 900, fontSize: '1.5rem', margin: '16px 0 4px' }}>
              {isRu ? `Очки: ${scoreRef.current}` : `Score: ${scoreRef.current}`}
            </p>
            {scoreRef.current >= bestScore && (
              <p style={{ fontFamily: 'sans-serif', color: '#fbbf24', fontWeight: 700, marginBottom: 20, fontSize: '.95rem' }}>
                {isRu ? '🌟 Новый рекорд!' : '🌟 New best score!'}
              </p>
            )}
            {/* Armor collected */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
              {ARMOR_TYPES.map(at => (
                <div key={at} style={{ background: playerRef.current.armor.has(at) ? `${ARMOR_DATA[at].color}22` : 'rgba(255,255,255,.04)', border: `2px solid ${playerRef.current.armor.has(at) ? ARMOR_DATA[at].color : 'rgba(255,255,255,.1)'}`, borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem' }}>{ARMOR_DATA[at].icon}</div>
                  <div style={{ fontFamily: 'sans-serif', fontSize: '.72rem', color: playerRef.current.armor.has(at) ? '#fff' : 'rgba(255,255,255,.3)', fontWeight: 700, marginTop: 4 }}>
                    {isRu ? ARMOR_DATA[at].ru : ARMOR_DATA[at].en}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
              <button onClick={startPlay} style={{ background: 'linear-gradient(180deg,#fbbf24,#f97316)', color: '#3b2307', fontFamily: 'sans-serif', fontWeight: 900, fontSize: '1rem', border: 'none', borderRadius: 14, padding: '13px 30px', cursor: 'pointer' }}>
                {isRu ? 'Ещё раз' : 'Play again'}
              </button>
              <Link href="/games" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', fontFamily: 'sans-serif', fontWeight: 700, fontSize: '1rem', borderRadius: 14, padding: '13px 30px', textDecoration: 'none', display: 'inline-block' }}>
                {isRu ? 'К играм' : 'Games'}
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
        @keyframes fadeInOut {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.8); }
          15%  { opacity: 1; transform: translate(-50%,-50%) scale(1.05); }
          70%  { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(0.95); }
        }
      `}</style>
    </main>
  )
}
