'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type TargetKind = 'shield' | 'bell' | 'lantern' | 'dummy' | 'scroll'
type Target = {
  id: number
  kind: TargetKind
  baseX: number
  baseY: number
  x: number
  y: number
  r: number
  phase: number
  speed: number
  hit: boolean
  hitCooldown: number
  wobble: number
  wisdom: boolean
  flop: { torso: number; head: number; leftArm: number; rightArm: number; leftLeg: number; rightLeg: number }
  squash: number
  spin: number
}

type Arrow = { x: number; y: number; vx: number; vy: number; age: number; stuck: boolean; countedMiss?: boolean; glow: boolean; trail: Point[] }
type FloatText = { x: number; y: number; txt: string; life: number; color: string }
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string }
type GameModel = {
  running: boolean
  time: number
  score: number
  best: number
  arrowsLeft: number
  combo: number
  levelIndex: number
  wisdomMeter: number
  wind: number
  targetSeed: number
  recoil: number
  verseIndex: number
}

const SCRIPTURE = {
  en: [
    { title: 'Light the Path', quote: 'Your word is a lamp to my feet and a light to my path.', ref: 'Psalm 119:105' },
    { title: 'Courage', quote: 'Be strong and courageous.', ref: 'Joshua 1:9' },
    { title: 'Steady Practice', quote: 'Whatever you do, work heartily, as for the Lord.', ref: 'Colossians 3:23' },
  ],
  ru: [
    { title: 'Свет для пути', quote: 'Слово Твое — светильник ноге моей и свет стезе моей.', ref: 'Псалом 118:105' },
    { title: 'Мужество', quote: 'будь тверд и мужествен', ref: 'Иисуса Навина 1:9' },
    { title: 'Верная тренировка', quote: 'И все, что делаете, делайте от души, как для Господа.', ref: 'Колоссянам 3:23' },
  ],
}

const COURSES = {
  en: ['Practice Yard', 'Forest Path', 'Hilltop Lights', 'Festival Course'],
  ru: ['Двор тренировки', 'Лесная тропа', 'Огни холма', 'Праздничный курс'],
}

const FAITH_POPUPS = {
  en: ['Light the path!', 'Be courageous!', 'Practice faithfully!'],
  ru: ['Свет пути!', 'Будь мужествен!', 'Тренируйся верно!'],
}

const STORAGE_KEY = 'faithful-archer-best'
const ARROW_SPEED = { calm: 720, fast: 860 }
const ARROW_GRAVITY = { calm: 720, fast: 880 }
const MAX_DRAW = 190
const MOBILE_BREAKPOINT = 720
const HIT_ASSIST = { desktop: 10, mobile: 18, snap: 0.92, cooldown: 0.42 }

type Point = { x: number; y: number }

function launchArrowVelocity(bow: Point, release: Point, calm: boolean) {
  const dx = bow.x - release.x
  const dy = bow.y - release.y
  const draw = Math.min(MAX_DRAW, Math.hypot(dx, dy))
  if (draw < 13) return null
  const angle = Math.atan2(dy, dx)
  const power = clamp(draw / 132, 0.42, 1.45)
  const speed = (calm ? ARROW_SPEED.calm : ARROW_SPEED.fast) * power
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    power,
    draw,
    angle,
  }
}

function getCanvasPoint(canvas: HTMLCanvasElement, event: PointerEvent): Point {
  const rect = canvas.getBoundingClientRect()
  return {
    x: clamp(event.clientX - rect.left, 0, rect.width),
    y: clamp(event.clientY - rect.top, 0, rect.height),
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function getHitAssistRadius(target: Target, width: number) {
  return target.r + (width < MOBILE_BREAKPOINT ? HIT_ASSIST.mobile : HIT_ASSIST.desktop)
}

function distancePointToSegment(point: Point, start: Point, end: Point) {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const lenSq = dx * dx + dy * dy
  if (!lenSq) return Math.hypot(point.x - end.x, point.y - end.y)
  const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq, 0, 1)
  const x = start.x + dx * t
  const y = start.y + dy * t
  return Math.hypot(point.x - x, point.y - y)
}

function snapArrowToTarget(arrow: Arrow, target: Target) {
  const angle = Math.atan2(arrow.vy, arrow.vx)
  const visualStickRadius = target.r * HIT_ASSIST.snap
  arrow.x = target.x - Math.cos(angle) * visualStickRadius
  arrow.y = target.y - Math.sin(angle) * visualStickRadius
  arrow.trail.unshift({ x: arrow.x, y: arrow.y })
  arrow.trail = arrow.trail.slice(0, 8)
}

function makeModel(): GameModel {
  return {
    running: false,
    time: 0,
    score: 0,
    best: 0,
    arrowsLeft: 18,
    combo: 0,
    levelIndex: 0,
    wisdomMeter: 0,
    wind: 0.012,
    targetSeed: 0,
    recoil: 0,
    verseIndex: 0,
  }
}

function seeded(n: number) {
  return Math.abs(Math.sin(n * 12.9898 + 78.233) * 43758.5453) % 1
}

export default function FaithfulArcherPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const modelRef = useRef<GameModel>(makeModel())
  const arrowsRef = useRef<Arrow[]>([])
  const targetsRef = useRef<Target[]>([])
  const sparksRef = useRef<Spark[]>([])
  const floatRef = useRef<FloatText[]>([])
  const pointerRef = useRef({ down: false, x: 0, y: 0, startX: 0, startY: 0 })
  const sizeRef = useRef({ width: 960, height: 620, dpr: 1 })
  const [hud, setHud] = useState({ score: 0, best: 0, arrows: 18, combo: 0, wisdom: 0, level: 0, running: false })
  const [showGuide, setShowGuide] = useState(true)
  const showGuideRef = useRef(true)
  const [calmMode, setCalmMode] = useState(true)
  const calmRef = useRef(true)
  const [wisdomCard, setWisdomCard] = useState<{ title: string; quote: string; ref: string } | null>(null)

  const copy = isRu ? {
    back: 'Все игры',
    eyebrow: 'Мобильная игра на меткость',
    title: 'Верный лучник',
    subtitle: 'Тяни, целься и отпускай стрелу. Попадай в щиты, колокольчики и фонари, чтобы открыть библейскую мудрость.',
    start: 'Начать тренировку',
    restart: 'Сначала',
    calm: 'Спокойный режим',
    aim: 'Подсказка траектории',
    score: 'Очки',
    best: 'Рекорд',
    arrows: 'Стрелы',
    combo: 'Серия',
    course: 'Курс',
    wisdom: 'Мудрость',
    mobileRelease: 'Мобильное управление: держи палец на поле, тяни назад от лучника, смотри на светлую траекторию и отпусти. Попадания требуют точности, но цель можно поражать снова после короткой паузы.',
    truth: 'Главная мысль: Божье Слово освещает путь. Тренируйся спокойно, целься честно и не сдавайся.',
    keep: 'Продолжить',
  } : {
    back: 'All Games',
    eyebrow: 'Mobile Archery Game',
    title: 'Faithful Archer',
    subtitle: 'Pull, aim, and release. Hit shields, bells, and lanterns to unlock Bible wisdom through the game loop.',
    start: 'Start Training',
    restart: 'Restart',
    calm: 'Calm Mode',
    aim: 'Aim Trail',
    score: 'Score',
    best: 'Best',
    arrows: 'Arrows',
    combo: 'Combo',
    course: 'Course',
    wisdom: 'Wisdom',
    mobileRelease: 'Mobile controls: hold your finger on the field, pull back from the archer, follow the bright aim trail, then release. Hits need real aim now, but the same target can be hit again after a short pause.',
    truth: 'Big truth: God’s Word lights the path. Practice calmly, aim honestly, and keep going.',
    keep: 'Keep Practicing',
  }

  const courseName = useMemo(() => (isRu ? COURSES.ru : COURSES.en)[Math.min(hud.level, COURSES.en.length - 1)], [hud.level, isRu])

  function syncHud() {
    const m = modelRef.current
    setHud({ score: m.score, best: m.best, arrows: m.arrowsLeft, combo: m.combo, wisdom: Math.round(m.wisdomMeter), level: m.levelIndex, running: m.running })
  }

  function startGame() {
    const best = Number(localStorage.getItem(STORAGE_KEY) || '0')
    const model = makeModel()
    model.running = true
    model.best = Number.isFinite(best) ? best : 0
    modelRef.current = model
    arrowsRef.current = []
    sparksRef.current = []
    floatRef.current = []
    spawnTargets()
    setWisdomCard(null)
    syncHud()
  }

  function spawnTargets() {
    const { width, height } = sizeRef.current
    const model = modelRef.current
    const count = width < MOBILE_BREAKPOINT ? 5 : 6
    const baseX = width < MOBILE_BREAKPOINT ? Math.max(width * 0.48, 285) : Math.max(width * 0.52, 330)
    targetsRef.current = Array.from({ length: count }, (_, i) => {
      const kind: TargetKind = i === 1 ? 'bell' : i === 2 ? 'scroll' : i === 3 ? 'lantern' : i === 4 ? 'dummy' : 'shield'
      const laneOffset = (i % 2) * Math.min(width < MOBILE_BREAKPOINT ? 132 : 190, width * 0.18)
      const x = baseX + laneOffset + (seeded(i + model.targetSeed + 4) * 40 - 20)
      const y = height * (0.22 + (i / count) * 0.5) + (seeded(i + 19) * 28 - 14)
      const mobileBoost = width < MOBILE_BREAKPOINT ? 8 : 0
      return {
        id: i,
        kind,
        baseX: x,
        baseY: y,
        x,
        y,
        r: (kind === 'dummy' ? 36 : kind === 'scroll' ? 28 : 31) + mobileBoost,
        phase: i * 1.7,
        speed: 0.24 + i * 0.05 + model.levelIndex * 0.08,
        hit: false,
        hitCooldown: 0,
        wobble: 0,
        wisdom: kind === 'bell' || kind === 'lantern' || kind === 'scroll',
        flop: { torso: 0, head: 0, leftArm: 0, rightArm: 0, leftLeg: 0, rightLeg: 0 },
        squash: 0,
        spin: 0,
      }
    })
  }

  useEffect(() => {
    showGuideRef.current = showGuide
  }, [showGuide])

  useEffect(() => {
    calmRef.current = calmMode
  }, [calmMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let last = 0

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(320, Math.floor(rect.width))
      const height = Math.max(430, Math.floor(rect.height))
      sizeRef.current = { width, height, dpr }
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (modelRef.current.running) spawnTargets()
    }

    function archer() {
      const { width, height } = sizeRef.current
      const m = modelRef.current
      return { x: Math.max(72, width * 0.13), y: height * 0.69 + Math.sin(m.time * 2.2) * 1.5 + m.recoil }
    }

    function shoot(tx: number, ty: number) {
      const m = modelRef.current
      if (!m.running || m.arrowsLeft <= 0 || wisdomCard) return
      const a = archer()
      const bowX = a.x + 34
      const bowY = a.y - 58
      const launch = launchArrowVelocity({ x: bowX, y: bowY }, { x: tx, y: ty }, calmRef.current)
      if (!launch) return
      arrowsRef.current.push({ x: bowX, y: bowY, vx: launch.vx, vy: launch.vy, age: 0, stuck: false, glow: launch.power > 1.12, trail: [] })
      m.arrowsLeft -= 1
      m.recoil = 7
      floatRef.current.push({ x: bowX, y: bowY - 32, txt: isRu ? 'ровно!' : 'steady!', life: 0.75, color: '#31552d' })
      syncHud()
    }

    function update(dt: number) {
      const m = modelRef.current
      if (!m.running || wisdomCard) return
      m.time += dt
      m.recoil *= Math.pow(0.05, dt)
      m.wind = Math.sin(m.time * 0.8) * (calmRef.current ? 0.014 : 0.025)
      const { width, height } = sizeRef.current
      const difficulty = calmRef.current ? 0.58 : 1

      for (const t of targetsRef.current) {
        t.squash *= Math.pow(0.08, dt)
        t.spin *= Math.pow(0.12, dt)
        t.hitCooldown = Math.max(0, t.hitCooldown - dt)
        t.wobble *= Math.pow(0.12, dt)
        t.flop.torso *= Math.pow(0.18, dt)
        t.flop.head *= Math.pow(0.18, dt)
        t.flop.leftArm *= Math.pow(0.18, dt)
        t.flop.rightArm *= Math.pow(0.18, dt)
        t.flop.leftLeg *= Math.pow(0.18, dt)
        t.flop.rightLeg *= Math.pow(0.18, dt)
        const move = m.levelIndex === 0 ? 0 : Math.sin(m.time * t.speed * difficulty + t.phase) * (20 + m.levelIndex * 10)
        t.x = t.baseX + move
        t.y = t.baseY + (t.kind === 'lantern' ? Math.sin(m.time * 1.3 + t.phase) * 16 : 0)
      }

      for (const arrow of arrowsRef.current) {
        if (arrow.stuck) continue
        arrow.age += dt
        arrow.vx += m.wind * 220 * dt
        arrow.vy += (calmRef.current ? ARROW_GRAVITY.calm : ARROW_GRAVITY.fast) * dt
        arrow.vx *= Math.pow(0.997, dt * 60)
        const prev = { x: arrow.x, y: arrow.y }
        arrow.x += arrow.vx * dt
        arrow.y += arrow.vy * dt
        arrow.trail.unshift({ x: arrow.x, y: arrow.y })
        arrow.trail = arrow.trail.slice(0, 8)
        if (arrow.y > height * 0.83 || arrow.x > width + 120 || arrow.x < -120 || arrow.age > 5) {
          if (!arrow.countedMiss) {
            arrow.countedMiss = true
            m.combo = 0
            floatRef.current.push({ x: clamp(arrow.x, 90, width - 90), y: clamp(arrow.y, 90, height - 90), txt: isRu ? 'ещё раз' : 'try again', life: 1, color: '#7a4e20' })
            syncHud()
          }
          arrow.stuck = true
        }
        for (const target of targetsRef.current) {
          if (target.hitCooldown > 0) continue
          const hitRadius = getHitAssistRadius(target, width)
          const centerDistance = Math.hypot(arrow.x - target.x, arrow.y - target.y)
          const pathDistance = distancePointToSegment({ x: target.x, y: target.y }, prev, { x: arrow.x, y: arrow.y })
          if (Math.min(centerDistance, pathDistance) < hitRadius) {
            hitTarget(arrow, target)
            break
          }
        }
      }

      arrowsRef.current = arrowsRef.current.filter((a) => a.age < 7)
      sparksRef.current = sparksRef.current.filter((s) => { s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 32 * dt; s.life -= dt; return s.life > 0 })
      floatRef.current = floatRef.current.filter((f) => { f.y -= 30 * dt; f.life -= dt; return f.life > 0 })

      if (targetsRef.current.length && targetsRef.current.every((t) => t.hit)) {
        m.levelIndex = Math.min(3, m.levelIndex + 1)
        m.targetSeed += 10
        spawnTargets()
        floatRef.current.push({ x: width * 0.52, y: height * 0.22, txt: isRu ? 'новый курс!' : 'next course!', life: 1.4, color: '#31552d' })
        syncHud()
      }

      if (m.arrowsLeft <= 0 && arrowsRef.current.every((a) => a.stuck || a.age > 0.5)) {
        m.running = false
        m.best = Math.max(m.best, m.score)
        localStorage.setItem(STORAGE_KEY, String(m.best))
        setWisdomCard((isRu ? SCRIPTURE.ru : SCRIPTURE.en)[m.verseIndex % SCRIPTURE.en.length])
        syncHud()
      }
    }

    function hitTarget(arrow: Arrow, target: Target) {
      const m = modelRef.current
      snapArrowToTarget(arrow, target)
      arrow.stuck = true
      target.hit = true
      target.hitCooldown = HIT_ASSIST.cooldown
      target.wobble = 1.35
      target.squash = 1
      target.spin = clamp(arrow.vx / 1600, -0.45, 0.45)
      const impact = clamp(arrow.vx / 900, -1, 1)
      const lift = clamp(arrow.vy / 900, -1, 1)
      target.flop = {
        torso: impact * 0.55,
        head: -impact * 0.75 + lift * 0.18,
        leftArm: -0.95 - impact * 0.35,
        rightArm: 0.9 + impact * 0.55,
        leftLeg: 0.58 + lift * 0.18,
        rightLeg: -0.62 + impact * 0.22,
      }
      m.combo += 1
      const bullseye = Math.hypot(arrow.x - target.x, arrow.y - target.y) < target.r * 0.42
      let points = bullseye ? 55 : 25
      if (target.kind === 'bell') points += 20
      if (target.kind === 'lantern') points += 25
      if (target.kind === 'scroll') points += 30
      if (target.kind === 'dummy') points += 12
      points = Math.round(points * Math.min(3, 1 + Math.floor(m.combo / 3) * 0.5))
      m.score += points
      m.best = Math.max(m.best, m.score)
      localStorage.setItem(STORAGE_KEY, String(m.best))
      m.wisdomMeter += target.wisdom ? 34 : 12
      if (target.wisdom) {
        const msg = (isRu ? FAITH_POPUPS.ru : FAITH_POPUPS.en)[m.verseIndex % FAITH_POPUPS.en.length]
        floatRef.current.push({ x: target.x, y: target.y - 92, txt: msg, life: 1.35, color: '#d97706' })
      }
      for (let i = 0; i < 20; i++) sparksRef.current.push({ x: target.x, y: target.y, vx: (Math.random() - 0.5) * 130, vy: (Math.random() - 0.9) * 150, life: 0.55 + Math.random() * 0.55, color: target.kind === 'lantern' ? '#ffd166' : '#8ee36a' })
      floatRef.current.push({ x: target.x, y: target.y - 38, txt: (bullseye ? (isRu ? 'В центр +' : 'Bullseye +') : '+') + points, life: 1.1, color: bullseye ? '#d97706' : '#31552d' })
      if (m.combo === 3) floatRef.current.push({ x: target.x, y: target.y - 72, txt: isRu ? 'Сосредоточено!' : 'Focused!', life: 1.1, color: '#31552d' })
      if (m.wisdomMeter >= 100) {
        m.wisdomMeter = 0
        const verse = (isRu ? SCRIPTURE.ru : SCRIPTURE.en)[m.verseIndex++ % SCRIPTURE.en.length]
        setWisdomCard(verse)
      }
      syncHud()
    }

    function draw() {
      const { width, height } = sizeRef.current
      ctx!.clearRect(0, 0, width, height)
      drawBackground(ctx!, width, height, modelRef.current.time)
      for (const target of targetsRef.current) drawTarget(ctx!, target, modelRef.current.time)
      drawArcher(ctx!, archer(), modelRef.current.time, pointerRef.current)
      drawAim(ctx!, archer())
      drawArrows(ctx!)
      drawEffects(ctx!)
      if (!modelRef.current.running) drawStartHint(ctx!, width, height)
    }

    function drawAim(drawCtx: CanvasRenderingContext2D, a: { x: number; y: number }) {
      const pointer = pointerRef.current
      if (!pointer.down || !modelRef.current.running || wisdomCard) return
      const bx = a.x + 34
      const by = a.y - 58
      const launch = launchArrowVelocity({ x: bx, y: by }, { x: pointer.x, y: pointer.y }, calmRef.current)
      if (!launch) return
      const { draw: dist, angle, power } = launch
      drawCtx.save()
      drawCtx.strokeStyle = 'rgba(49,85,45,.28)'
      drawCtx.lineWidth = 5
      drawCtx.beginPath()
      drawCtx.arc(bx, by, MAX_DRAW, 0, Math.PI * 2)
      drawCtx.stroke()
      drawCtx.fillStyle = 'rgba(255,226,122,.22)'
      drawCtx.beginPath()
      drawCtx.arc(pointer.x, pointer.y, 24 + Math.sin(modelRef.current.time * 8) * 3, 0, Math.PI * 2)
      drawCtx.fill()
      drawCtx.strokeStyle = 'rgba(255,255,255,.65)'
      drawCtx.lineWidth = 3
      drawCtx.stroke()
      drawCtx.strokeStyle = 'rgba(255,255,255,.9)'
      drawCtx.lineWidth = 3
      drawCtx.setLineDash([9, 9])
      drawCtx.beginPath()
      drawCtx.moveTo(bx, by)
      drawCtx.lineTo(bx - Math.cos(angle) * dist, by - Math.sin(angle) * dist)
      drawCtx.stroke()
      drawCtx.setLineDash([])
      drawCtx.fillStyle = '#ffe27a'
      roundRect(drawCtx, bx - 44, by + 48, 88, 11, 999, true)
      drawCtx.fillStyle = '#f97316'
      roundRect(drawCtx, bx - 44, by + 48, 88 * Math.min(1, power), 11, 999, true)
      if (showGuideRef.current) {
        drawCtx.fillStyle = 'rgba(255,255,255,.82)'
        let x = bx, y = by, vx = launch.vx, vy = launch.vy
        const step = 1 / 30
        for (let i = 0; i < 42; i++) {
          vx += modelRef.current.wind * 220 * step
          vy += (calmRef.current ? ARROW_GRAVITY.calm : ARROW_GRAVITY.fast) * step
          x += vx * step
          y += vy * step
          if (i % 2 === 0) { drawCtx.beginPath(); drawCtx.arc(x, y, 3, 0, Math.PI * 2); drawCtx.fill() }
        }
      }
      drawCtx.restore()
    }

    function drawArrows(drawCtx: CanvasRenderingContext2D) {
      for (const arrow of arrowsRef.current) {
        if (arrow.trail.length > 1) {
          drawCtx.save()
          drawCtx.lineCap = 'round'
          drawCtx.strokeStyle = arrow.glow ? 'rgba(255,226,122,.62)' : 'rgba(255,255,255,.42)'
          drawCtx.lineWidth = arrow.glow ? 5 : 3
          drawCtx.beginPath()
          arrow.trail.forEach((p, i) => { if (i === 0) drawCtx.moveTo(p.x, p.y); else drawCtx.lineTo(p.x, p.y) })
          drawCtx.stroke()
          drawCtx.restore()
        }
        const angle = Math.atan2(arrow.vy, arrow.vx)
        drawCtx.save()
        drawCtx.translate(arrow.x, arrow.y)
        drawCtx.rotate(angle)
        if (arrow.glow) { drawCtx.shadowColor = '#ffe27a'; drawCtx.shadowBlur = 13 }
        drawCtx.strokeStyle = '#5b371f'; drawCtx.lineWidth = 4; drawCtx.beginPath(); drawCtx.moveTo(-22, 0); drawCtx.lineTo(18, 0); drawCtx.stroke()
        drawCtx.fillStyle = '#203047'; drawCtx.beginPath(); drawCtx.moveTo(24, 0); drawCtx.lineTo(12, -6); drawCtx.lineTo(12, 6); drawCtx.closePath(); drawCtx.fill()
        drawCtx.fillStyle = '#79c96b'; drawCtx.beginPath(); drawCtx.moveTo(-22, 0); drawCtx.lineTo(-32, -7); drawCtx.lineTo(-28, 0); drawCtx.lineTo(-32, 7); drawCtx.closePath(); drawCtx.fill()
        drawCtx.restore()
      }
    }

    function drawEffects(drawCtx: CanvasRenderingContext2D) {
      for (const s of sparksRef.current) { drawCtx.globalAlpha = Math.max(0, s.life); drawCtx.fillStyle = s.color; drawCtx.beginPath(); drawCtx.arc(s.x, s.y, 3.5, 0, Math.PI * 2); drawCtx.fill(); drawCtx.globalAlpha = 1 }
      drawCtx.textAlign = 'center'; drawCtx.font = '900 20px var(--font-nunito), system-ui'
      for (const f of floatRef.current) { drawCtx.globalAlpha = Math.max(0, Math.min(1, f.life)); drawCtx.fillStyle = f.color; drawCtx.strokeStyle = 'rgba(255,255,255,.92)'; drawCtx.lineWidth = 4; drawCtx.strokeText(f.txt, f.x, f.y); drawCtx.fillText(f.txt, f.x, f.y); drawCtx.globalAlpha = 1 }
    }

    function frame(ts: number) {
      const dt = Math.min(0.033, (ts - last) / 1000 || 0)
      last = ts
      update(dt)
      draw()
      raf = requestAnimationFrame(frame)
    }

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault()
      const point = getCanvasPoint(canvas!, event)
      pointerRef.current = { down: true, x: point.x, y: point.y, startX: point.x, startY: point.y }
      canvas!.setPointerCapture(event.pointerId)
    }
    const onPointerMove = (event: PointerEvent) => {
      const point = getCanvasPoint(canvas!, event)
      pointerRef.current.x = point.x
      pointerRef.current.y = point.y
    }
    const onPointerUp = () => {
      const point = pointerRef.current
      if (point.down) shoot(point.x, point.y)
      point.down = false
    }
    const onPointerCancel = () => {
      pointerRef.current.down = false
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        if (!modelRef.current.running) startGame()
        else {
          const a = archer()
          shoot(a.x - 118, a.y - 42)
        }
      }
      if (event.key === 'r' || event.key === 'R') startGame()
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('keydown', onKey)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerCancel)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerCancel)
    }
  // Canvas loop owns mutable game refs; recreating only when language or modal state changes is intentional.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRu, wisdomCard])

  return (
    <main className="archer-page">
      <style>{`
        .archer-page { min-height: 100vh; color: #fff; background: linear-gradient(180deg,#061429,#0d1f3c 42%,#f8fafc); }
        .archer-wrap { max-width: 1180px; margin: 0 auto; padding: 22px 12px 48px; }
        .archer-hero { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 14px; align-items: end; margin-bottom: 12px; }
        .archer-title { font-family: var(--font-cinzel); font-size: clamp(2.05rem,7vw,4.5rem); line-height: .95; margin: 6px 0 10px; }
        .archer-sub { max-width: 820px; font-family: var(--font-lora); color: rgba(255,255,255,.9); font-weight: 700; line-height: 1.58; margin: 0; }
        .archer-shell { display: grid; grid-template-columns: minmax(0,1fr) 318px; gap: 14px; align-items: stretch; }
        .target-course { position: relative; min-height: min(650px, calc(100svh - 215px)); border-radius: 32px; overflow: hidden; border: 4px solid rgba(255,216,102,.84); background: #8fd3ff; box-shadow: 0 28px 90px rgba(0,0,0,.34); touch-action: none; isolation: isolate; }
        .target-course canvas { width: 100%; height: 100%; display: block; cursor: crosshair; touch-action: none; }
        .archer-panel { border-radius: 28px; padding: 16px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); box-shadow: 0 22px 60px rgba(0,0,0,.22); }
        .archer-stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; margin-bottom: 12px; }
        .archer-stats div { border-radius: 16px; padding: 10px; text-align: center; background: rgba(15,23,42,.82); border: 1px solid rgba(255,255,255,.18); font-family: var(--font-nunito); font-weight: 1000; }
        .wisdom-bar { height: 20px; border-radius: 999px; overflow: hidden; background: rgba(15,23,42,.82); border: 2px solid rgba(255,255,255,.45); margin: 10px 0 14px; }
        .wisdom-bar span { display: block; height: 100%; width: var(--wisdom); background: linear-gradient(90deg,#fde68a,#fb923c); box-shadow: 0 0 20px rgba(251,191,36,.8); }
        .archer-actions { display: grid; gap: 9px; }
        .archer-toggle { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border-radius: 16px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.16); font-family: var(--font-nunito); font-weight: 900; }
        .archer-toggle input { width: 24px; height: 24px; accent-color: #f59e0b; }
        .mobile-release { margin-top: 14px; border-radius: 18px; padding: 13px; background: rgba(126,200,227,.16); border: 1px solid rgba(126,200,227,.35); font-family: var(--font-lora); color: rgba(255,255,255,.88); font-weight: 700; line-height: 1.55; }
        .archer-wisdom-card { position: fixed; inset: 0; z-index: 40; display: grid; place-items: center; padding: 18px; background: radial-gradient(circle at center,rgba(255,246,220,.18),rgba(6,20,41,.78)); }
        .archer-wisdom-inner { max-width: 620px; border-radius: 28px; padding: 26px; background: #fff6dc; color: #203047; border: 5px solid #f7c948; box-shadow: 0 28px 90px rgba(0,0,0,.42); text-align: center; }
        @media (max-width: 900px) { .archer-hero { grid-template-columns: 1fr; } .archer-shell { grid-template-columns: 1fr; } .target-course { min-height: min(620px, calc(100svh - 310px)); border-radius: 24px; } .archer-panel { order: -1; } }
        @media (max-width: 560px) { .archer-wrap { padding: 14px 8px 38px; } .archer-stats { grid-template-columns: repeat(3,1fr); font-size: .82rem; } .archer-panel { padding: 12px; border-radius: 22px; } .target-course { min-height: 56svh; } .archer-title { font-size: clamp(2rem,13vw,3.2rem); } }
      `}</style>

      <div className="archer-wrap">
        <div className="archer-hero">
          <div>
            <Link href="/games" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {copy.back}</Link>
            <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 18 }}>{copy.eyebrow}</p>
            <h1 className="archer-title">{copy.title}</h1>
            <p className="archer-sub">{copy.subtitle}</p>
          </div>
          <button className="pz-btn" style={{ width: 'auto', minHeight: 54, padding: '14px 24px' }} onClick={startGame}>{hud.running ? copy.restart : copy.start}</button>
        </div>

        <section className="archer-shell">
          <div className="target-course" aria-label={copy.title}>
            <canvas ref={canvasRef} />
          </div>

          <aside className="archer-panel">
            <p className="puzzle-label" style={{ color: '#ffd866' }}>{copy.course}: {courseName}</p>
            <div className="archer-stats">
              <div>{copy.score}<br />{hud.score}</div>
              <div>{copy.best}<br />{hud.best}</div>
              <div>{copy.arrows}<br />{hud.arrows}</div>
              <div>{copy.combo}<br />{hud.combo}</div>
              <div>{copy.wisdom}<br />{hud.wisdom}%</div>
              <div>{isRu ? 'Режим' : 'Mode'}<br />{calmMode ? (isRu ? 'тихо' : 'calm') : (isRu ? 'быстро' : 'fast')}</div>
            </div>
            <div className="wisdom-bar" aria-label={copy.wisdom} style={{ ['--wisdom' as string]: `${hud.wisdom}%` }}><span /></div>
            <div className="archer-actions">
              <button className="pz-btn" style={{ width: '100%', minHeight: 54 }} onClick={startGame}>{hud.running ? copy.restart : copy.start}</button>
              <label className="archer-toggle"><span>{copy.calm}</span><input type="checkbox" checked={calmMode} onChange={(event) => setCalmMode(event.target.checked)} /></label>
              <label className="archer-toggle"><span>{copy.aim}</span><input type="checkbox" checked={showGuide} onChange={(event) => setShowGuide(event.target.checked)} /></label>
            </div>
            <p className="mobile-release">{copy.mobileRelease}</p>
            <p className="mobile-release">{copy.truth}</p>
          </aside>
        </section>
      </div>

      {wisdomCard && (
        <div className="archer-wisdom-card" role="dialog" aria-modal="true" aria-label={isRu ? 'Библейская мудрость' : 'Bible Wisdom'}>
          <div className="archer-wisdom-inner">
            <p className="puzzle-label" style={{ color: '#b45309' }}>{isRu ? 'Библейская мудрость' : 'Bible Wisdom'}</p>
            <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: 'clamp(1.8rem,6vw,3rem)', color: '#31552d', margin: '4px 0 12px' }}>{wisdomCard.title}</h2>
            <p style={{ fontFamily: 'var(--font-lora)', fontSize: '1.35rem', lineHeight: 1.55, fontWeight: 800, color: '#203047' }}>&ldquo;{wisdomCard.quote}&rdquo;</p>
            <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#7a4e20' }}>— {wisdomCard.ref}</p>
            <button className="pz-btn" style={{ marginTop: 14, width: 'auto', padding: '12px 24px' }} onClick={() => setWisdomCard(null)}>{copy.keep}</button>
          </div>
        </div>
      )}
    </main>
  )
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const g = ctx.createLinearGradient(0, 0, 0, height)
  g.addColorStop(0, '#86d3ff')
  g.addColorStop(0.5, '#e2f8ff')
  g.addColorStop(0.51, '#79c96b')
  g.addColorStop(1, '#3e9a5d')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = 'rgba(255,255,255,.82)'
  cloud(ctx, ((width * 0.2 + time * 9) % (width + 160)) - 80, height * 0.15, 56)
  cloud(ctx, ((width * 0.72 + time * 6) % (width + 190)) - 95, height * 0.13, 72)
  cloud(ctx, ((width * 0.48 + time * 11) % (width + 140)) - 70, height * 0.22, 44)
  ctx.fillStyle = '#68b767'; ellipse(ctx, width * 0.74, height * 0.6, width * 0.72, height * 0.28)
  ctx.fillStyle = '#5daa59'; ellipse(ctx, width * 0.24, height * 0.62, width * 0.68, height * 0.24)
  ctx.fillStyle = '#d99f53'; roundRect(ctx, 0, height * 0.8, width, height * 0.2, 0, true)
  ctx.fillStyle = 'rgba(255,246,220,.28)'; roundRect(ctx, width * 0.1, height * 0.84, width * 0.8, 16, 12, true)
  ctx.strokeStyle = 'rgba(49,85,45,.32)'; ctx.lineWidth = 2
  for (let i = 0; i < 28; i++) {
    const x = (i / 27) * width
    const y = height * 0.83 + seeded(i + 2) * height * 0.11
    const sway = Math.sin(time * 3 + i) * 4
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sway, y - 10, x + sway * 1.3, y - 22); ctx.stroke()
  }
}

function drawTarget(ctx: CanvasRenderingContext2D, target: Target, time: number) {
  ctx.save()
  ctx.translate(target.x, target.y)
  ctx.rotate(target.spin + Math.sin(time * 8 + target.id) * target.wobble * 0.25)
  const squash = target.squash
  ctx.scale(1 + squash * 0.18, 1 - squash * 0.12)
  ctx.fillStyle = 'rgba(32,48,71,.16)'; ellipse(ctx, 0, target.r + 18, target.r * 2, 10)
  if (target.kind === 'dummy') drawRagdollDummy(ctx, target, time)
  else if (target.kind === 'bell') drawBell(ctx, target, time)
  else if (target.kind === 'lantern') drawLantern(ctx, time)
  else if (target.kind === 'scroll') drawScroll(ctx, time)
  else drawShield(ctx, target, time)
  if (target.hitCooldown > 0) { ctx.globalAlpha = 0.55; ctx.fillStyle = '#fff6dc'; ctx.font = '900 18px system-ui'; ctx.textAlign = 'center'; ctx.fillText('✓', 0, 6) }
  ctx.restore()
}

function drawShield(ctx: CanvasRenderingContext2D, target: Target, time: number) {
  const breathe = 1 + Math.sin(time * 3 + target.id) * 0.035
  ctx.save(); ctx.scale(breathe, breathe)
  ctx.fillStyle = '#8a5a30'; ctx.beginPath(); ctx.arc(0, 0, target.r, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(0, 0, target.r * 0.74, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#3f8f5a'; ctx.beginPath(); ctx.arc(0, 0, target.r * 0.46, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffe27a'; star(ctx, 0, 0, 5, target.r * 0.2, target.r * 0.09)
  ctx.restore()
}

function drawBell(ctx: CanvasRenderingContext2D, target: Target, time: number) {
  ctx.save(); ctx.rotate(Math.sin(time * 4 + target.id) * 0.08)
  ctx.fillStyle = '#b57920'; roundRect(ctx, -5, -54, 10, 30, 5, true)
  ctx.fillStyle = '#f7c948'; ctx.strokeStyle = '#7a4e20'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.arc(0, 0, target.r, Math.PI * 0.08, Math.PI * 0.92, true); ctx.lineTo(-target.r * 0.75, 16); ctx.lineTo(target.r * 0.75, 16); ctx.closePath(); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(0, 2, 8, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
}

function drawLantern(ctx: CanvasRenderingContext2D, time: number) {
  const pulse = 1 + Math.sin(time * 5) * 0.06
  ctx.save(); ctx.scale(pulse, pulse)
  ctx.shadowColor = '#ffd166'; ctx.shadowBlur = 22; ctx.fillStyle = '#ffd166'; roundRect(ctx, -19, -27, 38, 54, 12, true)
  ctx.shadowBlur = 0; ctx.strokeStyle = '#7a4e20'; ctx.lineWidth = 4; roundRect(ctx, -23, -31, 46, 62, 12, false, true)
  ctx.fillStyle = '#fff6dc'; ellipse(ctx, 0, 0, 15, 28)
  ctx.restore()
}

function drawScroll(ctx: CanvasRenderingContext2D, time: number) {
  ctx.save(); ctx.rotate(Math.sin(time * 3.5) * 0.045)
  ctx.fillStyle = '#fff6dc'; ctx.strokeStyle = '#7a4e20'; ctx.lineWidth = 3; roundRect(ctx, -26, -18, 52, 36, 10, true, true)
  ctx.fillStyle = '#f7c948'; ctx.beginPath(); ctx.arc(-25, -18, 7, 0, Math.PI * 2); ctx.arc(25, 18, 7, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#3f8f5a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-13, -2); ctx.lineTo(-2, 9); ctx.lineTo(16, -10); ctx.stroke()
  ctx.restore()
}

function drawRagdollDummy(ctx: CanvasRenderingContext2D, target: Target, time: number) {
  const f = target.flop
  const sway = Math.sin(time * 11 + target.id) * target.wobble * 0.16
  ctx.save(); ctx.rotate(f.torso + sway)
  ctx.fillStyle = '#fff6dc'; ctx.strokeStyle = '#7a4e20'; ctx.lineWidth = 3; roundRect(ctx, -17, -18, 34, 34, 10, true, true)
  ctx.fillStyle = '#f7c948'; ctx.beginPath(); ctx.arc(0, -1, 10, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#31552d'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -1, 6, 0, Math.PI * 2); ctx.stroke()
  ragLimb(ctx, 0, -22, 0, 32, 7, '#7a4e20', 0)
  ragLimb(ctx, 0, -2, -23, -2, 7, '#7a4e20', f.leftArm)
  ragLimb(ctx, 0, -2, 23, -2, 7, '#7a4e20', f.rightArm)
  ragLimb(ctx, 0, 32, -20, 54, 7, '#7a4e20', f.leftLeg)
  ragLimb(ctx, 0, 32, 20, 54, 7, '#7a4e20', f.rightLeg)
  ctx.save(); ctx.translate(0, -39); ctx.rotate(f.head + sway * 1.5)
  ctx.fillStyle = '#d99f53'; ctx.strokeStyle = '#7a4e20'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#31552d'; ctx.fillRect(-8, -4, 4, 4); ctx.fillRect(7, -4, 4, 4)
  ctx.strokeStyle = '#31552d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 4, 7, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke()
  ctx.restore(); ctx.restore()
}

function drawArcher(ctx: CanvasRenderingContext2D, a: { x: number; y: number }, time: number, pointer: { down: boolean; x: number; y: number }) {
  // Original “faithful stickman” pose: snappy silhouette, no copied characters/assets.
  const pullPower = pointer.down
    ? Math.min(1, Math.hypot((a.x + 34) - pointer.x, (a.y - 56) - pointer.y) / MAX_DRAW)
    : 0
  const pullBack = pullPower * 28
  const lean = pullPower * 0.16
  const idle = Math.sin(time * 5) * 2
  const brace = pullPower * 12
  const headTilt = pointer.down ? -0.12 * pullPower : Math.sin(time * 2) * 0.03

  ctx.save(); ctx.translate(a.x, a.y); ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  ctx.fillStyle = 'rgba(32,48,71,.18)'; ellipse(ctx, 10, 18, 96, 18)
  ctx.rotate(-lean)

  // Stickman legs and torso: readable viral-stick silhouette with Junior Disciples colors.
  limb(ctx, -5, -10, -38 - brace, 36 + idle, 10, '#31552d')
  limb(ctx, 5, -10, 36 + brace, 36 - idle, 10, '#31552d')
  limb(ctx, -38 - brace, 36 + idle, -56 - brace, 39, 8, '#4b3218')
  limb(ctx, 36 + brace, 36 - idle, 56 + brace, 39, 8, '#4b3218')
  limb(ctx, 0, -82, 0, -14, 13, '#4aa96c')
  ctx.fillStyle = '#ffe27a'; roundRect(ctx, -18, -63, 36, 12, 8, true)

  ctx.save(); ctx.translate(0, -104); ctx.rotate(headTilt)
  ctx.fillStyle = '#f5c99b'; ctx.strokeStyle = '#203047'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#6b3f22'; ctx.beginPath(); ctx.arc(-4, -10, 18, Math.PI, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#203047'; ctx.beginPath(); ctx.arc(7, -2, 2.4, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  const bowHand = { x: 39, y: -58 }
  const stringHand = { x: -7 - pullBack, y: -57 + pullPower * 3 }
  limb(ctx, -1, -60, stringHand.x, stringHand.y, 10, '#f5c99b')
  limb(ctx, 2, -59, bowHand.x, bowHand.y, 10, '#f5c99b')

  // Oversized elastic bow + nocked arrow are the visual centerpiece.
  ctx.save(); ctx.translate(bowHand.x, bowHand.y); ctx.rotate(-0.35)
  if (pullPower > 0.75) { ctx.shadowColor = '#ffe27a'; ctx.shadowBlur = 18 }
  ctx.strokeStyle = pullPower > 0.75 ? '#f7c948' : '#7a4e20'; ctx.lineWidth = 6
  ctx.beginPath(); ctx.arc(0, 0, 38 + pullPower * 4, -1.25, 1.25); ctx.stroke()
  ctx.shadowBlur = 0
  ctx.strokeStyle = pullPower > 0.75 ? '#ffe27a' : 'rgba(255,255,255,.9)'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(12, -36); ctx.lineTo(-12 - pullBack, 0); ctx.lineTo(12, 36); ctx.stroke()
  if (pointer.down && pullBack > 2) {
    ctx.strokeStyle = '#5b371f'; ctx.lineWidth = 4
    ctx.beginPath(); ctx.moveTo(-12 - pullBack, 0); ctx.lineTo(22, 0); ctx.stroke()
    ctx.fillStyle = '#203047'; ctx.beginPath(); ctx.moveTo(27, 0); ctx.lineTo(16, -6); ctx.lineTo(16, 6); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#79c96b'; ctx.beginPath(); ctx.moveTo(-12 - pullBack, 0); ctx.lineTo(-25 - pullBack, -8); ctx.lineTo(-20 - pullBack, 0); ctx.lineTo(-25 - pullBack, 8); ctx.closePath(); ctx.fill()
  }
  ctx.restore()
  ctx.restore()
}

function drawStartHint(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save(); ctx.fillStyle = 'rgba(255,246,220,.86)'; roundRect(ctx, width * 0.22, height * 0.2, width * 0.56, 86, 24, true)
  ctx.fillStyle = '#31552d'; ctx.textAlign = 'center'; ctx.font = '1000 24px var(--font-nunito), system-ui'; ctx.fillText('Press Start / Начать', width * 0.5, height * 0.2 + 52)
  ctx.restore()
}

function ragLimb(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, w: number, color: string, angle: number) {
  ctx.save(); ctx.translate(x1, y1); ctx.rotate(angle); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(x2 - x1, y2 - y1); ctx.stroke(); ctx.fillStyle = '#f7c948'; ctx.beginPath(); ctx.arc(0, 0, w * 0.56, 0, Math.PI * 2); ctx.fill(); ctx.restore()
}

function limb(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, w: number, color: string) {
  ctx.strokeStyle = '#203047'; ctx.lineWidth = w + 4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
}

function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ellipse(ctx, x, y, s * 1.4, s * 0.55); ellipse(ctx, x - s * 0.45, y + s * 0.05, s * 0.75, s * 0.45); ellipse(ctx, x + s * 0.45, y + s * 0.07, s * 0.85, s * 0.42); ellipse(ctx, x, y - s * 0.18, s * 0.9, s * 0.5)
}

function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath(); ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill()
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill = true, stroke = false) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) ctx.fill(); if (stroke) ctx.stroke()
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, points: number, outer: number, inner: number) {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 ? inner : outer
    const angle = -Math.PI / 2 + i * Math.PI / points
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath(); ctx.fill()
}
