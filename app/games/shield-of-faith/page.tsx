'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// ─── Constants ────────────────────────────────────────────────────────────────
const TICK_MS   = 16          // ~62.5 fps fixed timestep
const PLAYER_R  = 18
const BULLET_SPEED = 9
const FIRE_RATE = 320         // ms between auto-shots
const BASE_DART_SPEED = 1.4
const DART_SPAWN_MS   = 2000
const WAVE_SIZES = [5, 8, 11, 14, 18, 22, 27, 32, 38, 50]
const TOTAL_WAVES = WAVE_SIZES.length
const JOY_DEAD   = 10
const JOY_REACH  = 56

// ─── Armor ────────────────────────────────────────────────────────────────────
const ARMOR_TYPES = ['belt','breastplate','boots','shield','helmet','sword'] as const
type ArmorType = typeof ARMOR_TYPES[number]

const ARMOR_DATA: Record<ArmorType, { color: string; icon: string; en: string; ru: string; fxEn: string; fxRu: string }> = {
  belt:        { color: '#fbbf24', icon: '🎗️', en: 'Belt of Truth',       ru: 'Пояс Истины',       fxEn: 'Enemies revealed',  fxRu: 'Враги видны' },
  breastplate: { color: '#60a5fa', icon: '🛡️', en: 'Breastplate',         ru: 'Броня Правды',      fxEn: '+2 shield charges', fxRu: '+2 заряда щита' },
  boots:       { color: '#34d399', icon: '👟', en: 'Boots of Peace',      ru: 'Обувь Мира',        fxEn: '+35% speed',        fxRu: '+35% скорость' },
  shield:      { color: '#f472b6', icon: '🌟', en: 'Shield of Faith',     ru: 'Щит Веры',          fxEn: 'Auto-deflect dart', fxRu: 'Отклоняет дарт' },
  helmet:      { color: '#a78bfa', icon: '⛑️', en: 'Helmet of Salvation', ru: 'Шлем Спасения',     fxEn: 'Extra life',        fxRu: 'Доп. жизнь' },
  sword:       { color: '#fb923c', icon: '⚔️', en: 'Sword of the Spirit', ru: 'Меч Духа',          fxEn: 'Piercing shots',    fxRu: 'Пронизывает всё' },
}

// ─── Scripture ────────────────────────────────────────────────────────────────
const VERSES_EN = [
  { ref: 'Ephesians 6:11', text: 'Put on the full armor of God, so that you can take your stand against the devil\'s schemes.' },
  { ref: 'Ephesians 6:16', text: 'Take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one.' },
  { ref: '1 John 4:4',     text: 'Greater is He who is in you than he who is in the world.' },
  { ref: 'Psalm 46:1',     text: 'God is our refuge and strength, an ever-present help in trouble.' },
  { ref: 'Romans 8:37',    text: 'We are more than conquerors through Him who loved us.' },
  { ref: 'Isaiah 41:10',   text: 'Do not fear, for I am with you. I am your God — I will strengthen you.' },
  { ref: '2 Timothy 1:7',  text: 'God has not given us a spirit of fear, but of power, love, and a sound mind.' },
  { ref: 'Ephesians 6:14', text: 'Stand firm — belt of truth, breastplate of righteousness.' },
  { ref: 'Ephesians 6:17', text: 'Take the helmet of salvation and the sword of the Spirit, which is the word of God.' },
  { ref: 'Ephesians 6:13', text: 'When the day of evil comes, you will be able to stand your ground.' },
]
const VERSES_RU = [
  { ref: 'Еф 6:11',   text: 'Облекитесь во всеоружие Божье, чтобы стоять против козней диавольских.' },
  { ref: 'Еф 6:16',   text: 'Возьмите щит веры, которым угасите все раскалённые стрелы лукавого.' },
  { ref: '1 Ин 4:4',  text: 'Больше Тот, Кто в вас, нежели тот, кто в мире.' },
  { ref: 'Пс 45:2',   text: 'Бог нам прибежище и сила, скорый помощник в бедах.' },
  { ref: 'Рим 8:37',  text: 'Всё преодолеваем силою Возлюбившего нас.' },
  { ref: 'Ис 41:10',  text: 'Не бойся, ибо Я с тобой; не смущайся, ибо Я Бог твой.' },
  { ref: '2 Тим 1:7', text: 'Бог дал нам духа не боязни, но силы, любви и целомудрия.' },
  { ref: 'Еф 6:14',   text: 'Стойте, препоясав истиной и облекшись в броню праведности.' },
  { ref: 'Еф 6:17',   text: 'Возьмите шлем спасения и меч духовный — Слово Божье.' },
  { ref: 'Еф 6:13',   text: 'Когда наступит день злой, вы устоите и, всё преодолев, устоите.' },
]

// ─── Entity types ─────────────────────────────────────────────────────────────
interface Player { x: number; y: number; vx: number; vy: number; hp: number; maxHp: number; invMs: number; shieldCharges: number; armor: Set<ArmorType>; speed: number; piercing: boolean }
interface Dart   { id: number; x: number; y: number; vx: number; vy: number; r: number; hp: number }
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
  const stateRef     = useRef<'menu'|'playing'|'verse'|'dead'|'victory'>('menu')
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
  const joyRef   = useRef<{ active: boolean; ax: number; ay: number; cx: number; cy: number }>({ active: false, ax: 0, ay: 0, cx: 0, cy: 0 })
  const joyVecRef= useRef({ dx: 0, dy: 0 })

  // React state for UI overlays only
  const [uiState, setUiState]  = useState<'menu'|'playing'|'verse'|'dead'|'victory'>('menu')
  const [verseIdx, setVerseIdx]= useState(0)
  const [armorToast, setArmorToast] = useState<{ type: ArmorType; ts: number } | null>(null)
  const [bestScore, setBestScore] = useState(0)

  // ─── Canvas size ────────────────────────────────────────────────────────────
  const W = useRef(540)
  const H = useRef(820)

  // ─── Init / reset ────────────────────────────────────────────────────────────
  const initGame = useCallback(() => {
    const c = canvasRef.current!
    W.current = c.offsetWidth  || 540
    H.current = c.offsetHeight || 820
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
    dartsRef.current.push({ id: uid(), x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, r, hp: 1 })
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
    p.x = Math.max(PLAYER_R, Math.min(W_ - PLAYER_R, p.x + p.vx))
    p.y = Math.max(PLAYER_R, Math.min(H_ - PLAYER_R, p.y + p.vy))

    if (p.invMs > 0) p.invMs -= dt

    // ── Auto-fire ──
    fireTimerRef.current += dt
    const fireRate = p.armor.has('sword') ? FIRE_RATE * 0.7 : FIRE_RATE
    if (fireTimerRef.current >= fireRate && darts.length > 0) {
      fireTimerRef.current = 0
      let nearest = darts[0], minD = Infinity
      for (const d of darts) {
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
    for (const d of darts) { d.x += d.vx; d.y += d.vy }

    // ── Bullet ↔ dart collisions ──
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const b = bullets[bi]
      for (let di = darts.length - 1; di >= 0; di--) {
        const d = darts[di]
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
            // Check wave complete
            if (darts.length === 0 && dartsLeftRef.current === 0) {
              stateRef.current = 'verse'
              if (wv + 1 >= TOTAL_WAVES) stateRef.current = 'victory'
              setVerseIdx(wv % VERSES_EN.length)
              setUiState(stateRef.current)
            }
          }
          break
        }
      }
    }

    // ── Dart → player collisions ──
    for (let di = darts.length - 1; di >= 0; di--) {
      const d = darts[di]
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

    // ── Powerup collection ──
    for (let i = pups.length - 1; i >= 0; i--) {
      const pu = pups[i]
      pu.y += pu.vy
      pu.pulse++
      if (pu.y > H_ + 40) { pups.splice(i, 1); continue }
      if ((pu.x - p.x)**2 + (pu.y - p.y)**2 < (PLAYER_R + 18)**2) {
        // Apply armor effect
        p.armor.add(pu.type)
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
  const draw = useCallback((now: number, alpha: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = devicePixelRatio
    const W_ = W.current, H_ = H.current

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, W_, H_)

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H_)
    bg.addColorStop(0, '#050a1a')
    bg.addColorStop(1, '#0a1830')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W_, H_)

    // Starfield (static — seeded)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 137.5) % 1) * W_
      const sy = ((i * 97.3 + i * 0.7) % 1) * H_
      const sr = 0.5 + (i % 3) * 0.4
      ctx.beginPath()
      ctx.arc(sx % W_, sy % H_, sr, 0, Math.PI*2)
      ctx.fill()
    }

    const p   = playerRef.current
    const prev= prevPlayerRef.current
    const px  = prev.x + (p.x - prev.x) * alpha
    const py  = prev.y + (p.y - prev.y) * alpha

    // Powerups
    for (const pu of powerupsRef.current) {
      const ac = ARMOR_DATA[pu.type].color
      const pulse = Math.sin(pu.pulse * 0.12) * 3
      ctx.save()
      ctx.shadowColor = ac; ctx.shadowBlur = 14 + pulse
      ctx.font = `${20 + pulse}px sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(ARMOR_DATA[pu.type].icon, pu.x, pu.y)
      ctx.restore()
    }

    // Darts
    for (const d of dartsRef.current) {
      const angle = Math.atan2(d.vy, d.vx)
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
      // Core
      ctx.beginPath(); ctx.arc(0, 0, d.r * 0.45, 0, Math.PI*2)
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

    // Player
    const invBlink = p.invMs > 0 && Math.floor(now / 120) % 2 === 0
    if (!invBlink) {
      ctx.save()
      // Shield glow
      if (p.shieldCharges > 0) {
        ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 30
        ctx.strokeStyle = 'rgba(244,114,182,0.6)'; ctx.lineWidth = 3
        ctx.beginPath(); ctx.arc(px, py, PLAYER_R + 8, 0, Math.PI*2); ctx.stroke()
      }
      // Body glow
      ctx.shadowColor = '#7ec8e3'; ctx.shadowBlur = 20
      const pgrd = ctx.createRadialGradient(px, py, 0, px, py, PLAYER_R)
      pgrd.addColorStop(0, '#e0f2fe')
      pgrd.addColorStop(0.6, '#38bdf8')
      pgrd.addColorStop(1, '#0369a1')
      ctx.beginPath(); ctx.arc(px, py, PLAYER_R, 0, Math.PI*2)
      ctx.fillStyle = pgrd; ctx.fill()
      // Armor indicator — small cross
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5
      ctx.shadowBlur = 0
      ctx.beginPath(); ctx.moveTo(px, py - 8); ctx.lineTo(px, py + 8); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(px - 8, py); ctx.lineTo(px + 8, py); ctx.stroke()
      ctx.restore()
    }

    // HUD
    const hud_x = 14, hud_y = 14
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
    while (accRef.current >= TICK_MS) { tick(TICK_MS); accRef.current -= TICK_MS }
    draw(now, accRef.current / TICK_MS)
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
    const next = waveRef.current + 1
    if (next >= TOTAL_WAVES) { stateRef.current = 'victory'; setUiState('victory'); return }
    waveRef.current      = next
    dartsLeftRef.current = WAVE_SIZES[next]
    dartsRef.current     = []
    bulletsRef.current   = []
    spawnTimerRef.current= 0
    stateRef.current     = 'playing'
    setUiState('playing')
    lastRef.current = performance.now()
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  // ─── Canvas resize ───────────────────────────────────────────────────────────
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ro = new ResizeObserver(() => {
      if (stateRef.current !== 'playing') return
      W.current = c.offsetWidth
      H.current = c.offsetHeight
      c.width  = W.current  * devicePixelRatio
      c.height = H.current  * devicePixelRatio
    })
    ro.observe(c)
    return () => ro.disconnect()
  }, [])

  // ─── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => keysRef.current.add(e.key)
    const onUp   = (e: KeyboardEvent) => keysRef.current.delete(e.key)
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup',   onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [])

  // ─── Joystick pointer ────────────────────────────────────────────────────────
  const onPtrDown = useCallback((e: React.PointerEvent) => {
    if (stateRef.current !== 'playing') return
    const canvas = canvasRef.current!
    const rect   = canvas.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    canvas.setPointerCapture(e.pointerId)
    joyRef.current = { active: true, ax: cx, ay: cy, cx, cy }
    joyVecRef.current = { dx: 0, dy: 0 }
  }, [])

  const onPtrMove = useCallback((e: React.PointerEvent) => {
    if (!joyRef.current.active) return
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

  const onPtrUp = useCallback(() => {
    joyRef.current.active = false
    joyVecRef.current = { dx: 0, dy: 0 }
  }, [])

  // ─── Best score ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = parseInt(localStorage.getItem('shield-of-faith-best') ?? '0')
    bestRef.current = saved
    setBestScore(saved)
  }, [])

  useEffect(() => {
    if (uiState === 'dead' || uiState === 'victory') {
      const b = Math.max(scoreRef.current, bestRef.current)
      localStorage.setItem('shield-of-faith-best', String(b))
      setBestScore(b)
    }
  }, [uiState])

  const verses = isRu ? VERSES_RU : VERSES_EN
  const verse  = verses[verseIdx]

  // ─── JSX ─────────────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100dvh', background: 'linear-gradient(180deg,#050a1a,#0a1830)', userSelect: 'none', WebkitUserSelect: 'none' }}>
      {/* ── CANVAS (always mounted, fullscreen during play) ── */}
      <canvas
        ref={canvasRef}
        onPointerDown={onPtrDown}
        onPointerMove={onPtrMove}
        onPointerUp={onPtrUp}
        onContextMenu={e => e.preventDefault()}
        style={{
          display: uiState === 'playing' ? 'block' : 'none',
          position: 'fixed', inset: 0, width: '100%', height: '100%',
          touchAction: 'none', cursor: 'none'
        }}
      />

      {/* ── ARMOR TOAST ── */}
      {armorToast && (
        <div key={armorToast.ts} style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          display: uiState === 'playing' ? 'block' : 'none',
          background: 'rgba(0,0,0,0.82)', borderRadius: 20, padding: '14px 28px',
          border: `2px solid ${ARMOR_DATA[armorToast.type].color}`,
          textAlign: 'center', pointerEvents: 'none', zIndex: 100,
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
            <h1 style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem,7vw,3rem)', color: '#fff', margin: '0 0 8px' }}>
              {isRu ? 'Щит Веры' : 'Shield of Faith'}
            </h1>
            <p style={{ fontFamily: 'sans-serif', color: '#93c5fd', fontWeight: 700, fontSize: '1rem', margin: '0 0 6px' }}>
              {isRu ? 'Ефесянам 6:16' : 'Ephesians 6:16'}
            </p>
            <p style={{ fontFamily: 'sans-serif', color: 'rgba(255,255,255,.8)', lineHeight: 1.6, marginBottom: 28, fontStyle: 'italic', fontSize: '.95rem' }}>
              {isRu
                ? '«Возьмите щит веры, которым сможете угасить все раскалённые стрелы лукавого.»'
                : '"Take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one."'}
            </p>

            {/* How to play */}
            <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 18, padding: '20px 20px', marginBottom: 28, textAlign: 'left' }}>
              <p style={{ fontFamily: 'sans-serif', fontWeight: 900, color: '#fde68a', margin: '0 0 10px', fontSize: '.95rem' }}>
                {isRu ? 'Как играть' : 'How to play'}
              </p>
              {[
                isRu ? ['🕹️', 'Двигайся джойстиком (тач) или WASD'] : ['🕹️', 'Move with the joystick (touch) or WASD'],
                isRu ? ['🎯', 'Воин сам целится и стреляет'] : ['🎯', 'Your warrior auto-aims and fires'],
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,26,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
          <div style={{ maxWidth: 440, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📖</div>
            <p style={{ fontFamily: 'sans-serif', color: '#93c5fd', fontWeight: 900, fontSize: '.9rem', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              {isRu ? `Волна ${waveRef.current} пройдена!` : `Wave ${waveRef.current} clear!`}
            </p>
            <p style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 'clamp(1rem,4vw,1.3rem)', color: '#fff', lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic' }}>
              "{verse.text}"
            </p>
            <p style={{ fontFamily: 'sans-serif', color: '#fde68a', fontWeight: 900, marginBottom: 32 }}>{verse.ref}</p>
            <button
              onClick={nextWave}
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
              {isRu ? '"Не бойся, ибо Я с тобой." — Ис 41:10' : '"Do not fear, for I am with you." — Isaiah 41:10'}
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
              {isRu ? 'Полное вооружение!' : 'Full Armor Equipped!'}
            </h2>
            <p style={{ fontFamily: 'sans-serif', color: '#bae6fd', lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic', fontSize: '.95rem' }}>
              {isRu
                ? '"Всё преодолеваем силою Возлюбившего нас." — Рим 8:37'
                : '"We are more than conquerors through Him who loved us." — Romans 8:37'}
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
