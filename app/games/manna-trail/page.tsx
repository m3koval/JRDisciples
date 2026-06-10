'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

// ─── Types ────────────────────────────────────────────────────────────────────
type Cell = { x: number; y: number }
type Dir = { x: number; y: number }
type Phase = 'menu' | 'play' | 'levelUp' | 'over'
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string }
type Verse = { words: string[]; ref: string }

// ─── Config ───────────────────────────────────────────────────────────────────
const GRID = 21
const BASE_TICK = 165
const MIN_TICK = 80
const TICK_DROP_PER_LEVEL = 14
const SLOW_FACTOR = 1.6
const DOVE_EVERY_MS = 14000
const DOVE_LIFETIME = 8000
const SLOW_DURATION = 5000
const STORAGE_KEY = 'manna-trail-best'

const VERSES_EN: Verse[] = [
  { words: ['Give', 'us', 'this', 'day', 'our', 'daily', 'bread'], ref: 'Matthew 6:11' },
  { words: ['Man', 'shall', 'not', 'live', 'by', 'bread', 'alone'], ref: 'Matthew 4:4' },
  { words: ['I', 'am', 'the', 'bread', 'of', 'life'], ref: 'John 6:35' },
  { words: ['Taste', 'and', 'see', 'that', 'the', 'LORD', 'is', 'good'], ref: 'Psalm 34:8' },
  { words: ['My', 'God', 'will', 'supply', 'every', 'need', 'of', 'yours'], ref: 'Philippians 4:19' },
]
const VERSES_RU: Verse[] = [
  { words: ['Хлеб', 'наш', 'насущный', 'дай', 'нам', 'на', 'сей', 'день'], ref: 'Матфея 6:11' },
  { words: ['Не', 'хлебом', 'одним', 'будет', 'жить', 'человек'], ref: 'Матфея 4:4' },
  { words: ['Я', 'есмь', 'хлеб', 'жизни'], ref: 'Иоанна 6:35' },
  { words: ['Вкусите', 'и', 'увидите', 'как', 'благ', 'Господь'], ref: 'Псалом 33:9' },
  { words: ['Бог', 'мой', 'да', 'восполнит', 'всякую', 'нужду', 'вашу'], ref: 'Филиппийцам 4:19' },
]

function randCell(blocked: Cell[]): Cell {
  while (true) {
    const c = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
    if (!blocked.some(b => b.x === c.x && b.y === c.y)) return c
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MannaTrailPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const VERSES = isRu ? VERSES_RU : VERSES_EN

  // HUD state (updated on events, not per tick)
  const [phase, setPhase] = useState<Phase>('menu')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [level, setLevel] = useState(1)
  const [wordsGot, setWordsGot] = useState(0)
  const [slowOn, setSlowOn] = useState(false)

  // Game state lives in refs so the loop never waits on React
  const phaseRef = useRef<Phase>('menu')
  const snakeRef = useRef<Cell[]>([])
  const dirRef = useRef<Dir>({ x: 1, y: 0 })
  const dirQueueRef = useRef<Dir[]>([])
  const mannaRef = useRef<Cell>({ x: 0, y: 0 })
  const wordTileRef = useRef<Cell>({ x: 0, y: 0 })
  const doveRef = useRef<{ cell: Cell; until: number } | null>(null)
  const nextDoveAtRef = useRef(0)
  const slowUntilRef = useRef(0)
  const levelRef = useRef(1)
  const wordsGotRef = useRef(0)
  const scoreRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const flashRef = useRef(0)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const swipeRef = useRef<{ x: number; y: number } | null>(null)

  const verse = VERSES[(level - 1) % VERSES.length]

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY) || '0')
    if (Number.isFinite(stored)) setBest(stored)
  }, [])

  useEffect(() => { phaseRef.current = phase }, [phase])

  // ── Direction handling ─────────────────────────────────────────────────────
  function pushDir(d: Dir) {
    const queue = dirQueueRef.current
    const last = queue.length > 0 ? queue[queue.length - 1] : dirRef.current
    // ignore reversals and duplicates
    if (last.x === -d.x && last.y === -d.y) return
    if (last.x === d.x && last.y === d.y) return
    if (queue.length < 3) queue.push(d)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (phaseRef.current !== 'play') return
      const map: Record<string, Dir> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
        W: { x: 0, y: -1 }, S: { x: 0, y: 1 }, A: { x: -1, y: 0 }, D: { x: 1, y: 0 },
      }
      const d = map[e.key]
      if (d) {
        e.preventDefault()
        pushDir(d)
      }
    }
    window.addEventListener('keydown', onKey, { passive: false })
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function onPointerDown(e: React.PointerEvent) {
    swipeRef.current = { x: e.clientX, y: e.clientY }
  }
  function onPointerMove(e: React.PointerEvent) {
    const start = swipeRef.current
    if (!start || phaseRef.current !== 'play') return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return
    if (Math.abs(dx) > Math.abs(dy)) pushDir({ x: dx > 0 ? 1 : -1, y: 0 })
    else pushDir({ x: 0, y: dy > 0 ? 1 : -1 })
    // re-anchor so one drag can steer multiple turns, snake.io style
    swipeRef.current = { x: e.clientX, y: e.clientY }
  }
  function onPointerUp() {
    swipeRef.current = null
  }

  // ── Game setup ─────────────────────────────────────────────────────────────
  function spawnItems() {
    const blocked = [...snakeRef.current]
    mannaRef.current = randCell(blocked)
    wordTileRef.current = randCell([...blocked, mannaRef.current])
  }

  function startGame() {
    const cy = Math.floor(GRID / 2)
    snakeRef.current = [{ x: 7, y: cy }, { x: 6, y: cy }, { x: 5, y: cy }, { x: 4, y: cy }]
    dirRef.current = { x: 1, y: 0 }
    dirQueueRef.current = []
    doveRef.current = null
    nextDoveAtRef.current = performance.now() + DOVE_EVERY_MS
    slowUntilRef.current = 0
    particlesRef.current = []
    levelRef.current = 1
    wordsGotRef.current = 0
    scoreRef.current = 0
    setLevel(1)
    setWordsGot(0)
    setScore(0)
    setSlowOn(false)
    spawnItems()
    setPhase('play')
  }

  function nextLevel() {
    levelRef.current += 1
    wordsGotRef.current = 0
    dirQueueRef.current = []
    setLevel(levelRef.current)
    setWordsGot(0)
    spawnItems()
    setPhase('play')
  }

  function endGame() {
    flashRef.current = 1
    const finalScore = scoreRef.current
    setBest(prev => {
      const next = Math.max(prev, finalScore)
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
    setPhase('over')
  }

  function burst(cell: Cell, color: string, cellPx: number, ox: number, oy: number) {
    const cx = ox + (cell.x + 0.5) * cellPx
    const cy = oy + (cell.y + 0.5) * cellPx
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2
      const v = 1.2 + Math.random() * 2.4
      particlesRef.current.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, color })
    }
  }

  // ── Main loop ──────────────────────────────────────────────────────────────
  const active = phase !== 'menu'
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let acc = 0
    let last = performance.now()

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    function resize() {
      if (!canvas || !wrap) return
      const r = wrap.getBoundingClientRect()
      canvas.width = Math.floor(r.width * dpr)
      canvas.height = Math.floor(r.height * dpr)
      canvas.style.width = `${r.width}px`
      canvas.style.height = `${r.height}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    function tick(now: number) {
      const snake = snakeRef.current
      // apply one queued turn per tick
      const q = dirQueueRef.current
      if (q.length > 0) {
        const d = q.shift()!
        const cur = dirRef.current
        if (!(d.x === -cur.x && d.y === -cur.y)) dirRef.current = d
      }
      const dir = dirRef.current
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }

      // wall or self collision
      if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        endGame()
        return
      }

      snake.unshift(head)
      const verseNow = VERSES[(levelRef.current - 1) % VERSES.length]
      const manna = mannaRef.current
      const wordTile = wordTileRef.current
      const dove = doveRef.current
      const geo = geometry()

      if (head.x === manna.x && head.y === manna.y) {
        scoreRef.current += 1
        setScore(scoreRef.current)
        burst(manna, '#fef3c7', geo.cell, geo.ox, geo.oy)
        mannaRef.current = randCell([...snake, wordTile, ...(dove ? [dove.cell] : [])])
        // grow: do not pop tail
      } else if (head.x === wordTile.x && head.y === wordTile.y) {
        scoreRef.current += 5
        wordsGotRef.current += 1
        setScore(scoreRef.current)
        setWordsGot(wordsGotRef.current)
        burst(wordTile, '#fbbf24', geo.cell, geo.ox, geo.oy)
        if (wordsGotRef.current >= verseNow.words.length) {
          scoreRef.current += 20
          setScore(scoreRef.current)
          setPhase('levelUp')
          return
        }
        wordTileRef.current = randCell([...snake, manna, ...(dove ? [dove.cell] : [])])
        // grow: do not pop tail
      } else {
        if (dove && head.x === dove.cell.x && head.y === dove.cell.y) {
          slowUntilRef.current = now + SLOW_DURATION
          setSlowOn(true)
          burst(dove.cell, '#bae6fd', geo.cell, geo.ox, geo.oy)
          doveRef.current = null
        }
        snake.pop()
      }
    }

    function geometry() {
      const w = canvas!.width
      const h = canvas!.height
      const size = Math.min(w, h) - 8 * dpr
      const cell = size / GRID
      const ox = (w - size) / 2
      const oy = (h - size) / 2
      return { cell, ox, oy, size }
    }

    function draw(now: number) {
      const { cell, ox, oy, size } = geometry()
      const w = canvas!.width
      const h = canvas!.height

      // background
      const bg = ctx!.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#071527')
      bg.addColorStop(1, '#0c2438')
      ctx!.fillStyle = bg
      ctx!.fillRect(0, 0, w, h)

      // board
      ctx!.fillStyle = 'rgba(255,255,255,.03)'
      ctx!.fillRect(ox, oy, size, size)
      ctx!.strokeStyle = 'rgba(251,191,36,.55)'
      ctx!.lineWidth = 2 * dpr
      ctx!.strokeRect(ox - dpr, oy - dpr, size + 2 * dpr, size + 2 * dpr)
      ctx!.strokeStyle = 'rgba(255,255,255,.045)'
      ctx!.lineWidth = 1
      for (let i = 1; i < GRID; i++) {
        ctx!.beginPath(); ctx!.moveTo(ox + i * cell, oy); ctx!.lineTo(ox + i * cell, oy + size); ctx!.stroke()
        ctx!.beginPath(); ctx!.moveTo(ox, oy + i * cell); ctx!.lineTo(ox + size, oy + i * cell); ctx!.stroke()
      }

      // manna (pulsing golden flake)
      const manna = mannaRef.current
      const pulse = 1 + Math.sin(now / 200) * 0.15
      ctx!.save()
      ctx!.shadowColor = '#fde68a'
      ctx!.shadowBlur = 14 * dpr
      ctx!.fillStyle = '#fef9e7'
      ctx!.beginPath()
      ctx!.arc(ox + (manna.x + 0.5) * cell, oy + (manna.y + 0.5) * cell, cell * 0.27 * pulse, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.fillStyle = '#fbbf24'
      ctx!.beginPath()
      ctx!.arc(ox + (manna.x + 0.5) * cell, oy + (manna.y + 0.5) * cell, cell * 0.13 * pulse, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.restore()

      // word tile (golden square + floating word label)
      const wt = wordTileRef.current
      const verseNow = VERSES[(levelRef.current - 1) % VERSES.length]
      const nextWord = verseNow.words[Math.min(wordsGotRef.current, verseNow.words.length - 1)]
      const wx = ox + wt.x * cell
      const wy = oy + wt.y * cell
      ctx!.save()
      ctx!.shadowColor = '#f59e0b'
      ctx!.shadowBlur = 16 * dpr
      const wg = ctx!.createLinearGradient(wx, wy, wx, wy + cell)
      wg.addColorStop(0, '#fde68a')
      wg.addColorStop(1, '#f59e0b')
      ctx!.fillStyle = wg
      roundRect(ctx!, wx + cell * 0.12, wy + cell * 0.12, cell * 0.76, cell * 0.76, cell * 0.22)
      ctx!.fill()
      ctx!.restore()
      ctx!.fillStyle = '#78350f'
      ctx!.font = `900 ${cell * 0.5}px sans-serif`
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      ctx!.fillText('★', wx + cell * 0.5, wy + cell * 0.54)
      // floating label
      const labelY = wy - cell * 0.42 < oy ? wy + cell * 1.12 : wy - cell * 0.42
      ctx!.font = `900 ${Math.max(13 * dpr, cell * 0.52)}px sans-serif`
      const tw = ctx!.measureText(nextWord).width
      const lx = Math.min(Math.max(wx + cell * 0.5, ox + tw / 2 + 8 * dpr), ox + size - tw / 2 - 8 * dpr)
      ctx!.fillStyle = 'rgba(7,21,39,.85)'
      roundRect(ctx!, lx - tw / 2 - 8 * dpr, labelY - cell * 0.34, tw + 16 * dpr, cell * 0.68, cell * 0.24)
      ctx!.fill()
      ctx!.fillStyle = '#fde68a'
      ctx!.fillText(nextWord, lx, labelY)

      // dove
      const dove = doveRef.current
      if (dove) {
        const blink = (dove.until - now < 2500) && Math.floor(now / 200) % 2 === 0
        if (!blink) {
          ctx!.font = `${cell * 0.85}px serif`
          ctx!.textAlign = 'center'
          ctx!.textBaseline = 'middle'
          ctx!.fillText('🕊️', ox + (dove.cell.x + 0.5) * cell, oy + (dove.cell.y + 0.52) * cell)
        }
      }

      // snake — gradient trail, glowing head with eyes
      const snake = snakeRef.current
      const n = snake.length
      for (let i = n - 1; i >= 0; i--) {
        const s = snake[i]
        const t = n === 1 ? 0 : i / (n - 1) // 0 head → 1 tail
        const r = Math.round(251 - t * (251 - 20))
        const g = Math.round(191 - t * (191 - 184))
        const b = Math.round(36 + t * (166 - 36))
        const inset = cell * (0.06 + t * 0.1)
        ctx!.fillStyle = `rgb(${r},${g},${b})`
        if (i === 0) {
          ctx!.save()
          ctx!.shadowColor = '#fbbf24'
          ctx!.shadowBlur = 12 * dpr
        }
        roundRect(ctx!, ox + s.x * cell + inset, oy + s.y * cell + inset, cell - inset * 2, cell - inset * 2, cell * 0.32)
        ctx!.fill()
        if (i === 0) ctx!.restore()
      }
      // eyes on head
      if (n > 0) {
        const hd = snake[0]
        const d = dirRef.current
        const cx = ox + (hd.x + 0.5) * cell
        const cy = oy + (hd.y + 0.5) * cell
        const fx = d.x * cell * 0.18
        const fy = d.y * cell * 0.18
        const sx = d.y * cell * 0.16
        const sy = d.x * cell * 0.16
        for (const sign of [1, -1]) {
          ctx!.fillStyle = '#fff'
          ctx!.beginPath()
          ctx!.arc(cx + fx + sx * sign, cy + fy + sy * sign, cell * 0.1, 0, Math.PI * 2)
          ctx!.fill()
          ctx!.fillStyle = '#1e293b'
          ctx!.beginPath()
          ctx!.arc(cx + fx * 1.3 + sx * sign, cy + fy * 1.3 + sy * sign, cell * 0.05, 0, Math.PI * 2)
          ctx!.fill()
        }
      }

      // particles
      const parts = particlesRef.current
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.x += p.vx * dpr
        p.y += p.vy * dpr
        p.vy += 0.04 * dpr
        p.life -= 0.03
        if (p.life <= 0) { parts.splice(i, 1); continue }
        ctx!.globalAlpha = p.life
        ctx!.fillStyle = p.color
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, cell * 0.1 * p.life + 1, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.globalAlpha = 1
      }

      // slow-mo tint
      if (now < slowUntilRef.current) {
        ctx!.fillStyle = 'rgba(125,211,252,.07)'
        ctx!.fillRect(ox, oy, size, size)
      }

      // death flash
      if (flashRef.current > 0) {
        ctx!.fillStyle = `rgba(239,68,68,${flashRef.current * 0.35})`
        ctx!.fillRect(0, 0, w, h)
        flashRef.current = Math.max(0, flashRef.current - 0.05)
      }
    }

    function roundRect(c: CanvasRenderingContext2D, x: number, y: number, rw: number, rh: number, rad: number) {
      const r = Math.min(rad, rw / 2, rh / 2)
      c.beginPath()
      c.moveTo(x + r, y)
      c.arcTo(x + rw, y, x + rw, y + rh, r)
      c.arcTo(x + rw, y + rh, x, y + rh, r)
      c.arcTo(x, y + rh, x, y, r)
      c.arcTo(x, y, x + rw, y, r)
      c.closePath()
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(now - last, 100)
      last = now

      if (phaseRef.current === 'play') {
        // dove lifecycle
        if (doveRef.current && now > doveRef.current.until) doveRef.current = null
        if (!doveRef.current && now > nextDoveAtRef.current) {
          doveRef.current = {
            cell: randCell([...snakeRef.current, mannaRef.current, wordTileRef.current]),
            until: now + DOVE_LIFETIME,
          }
          nextDoveAtRef.current = now + DOVE_EVERY_MS + Math.random() * 5000
        }
        if (slowUntilRef.current > 0 && now > slowUntilRef.current) {
          slowUntilRef.current = 0
          setSlowOn(false)
        }

        let tickMs = Math.max(MIN_TICK, BASE_TICK - (levelRef.current - 1) * TICK_DROP_PER_LEVEL)
        if (now < slowUntilRef.current) tickMs *= SLOW_FACTOR

        acc += dt
        while (acc >= tickMs && phaseRef.current === 'play') {
          acc -= tickMs
          tick(now)
        }
      }
      draw(now)
    }

    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, isRu])

  // ─── Copy ───────────────────────────────────────────────────────────────────
  const copy = isRu ? {
    back: 'Все игры',
    eyebrow: 'Классическая аркада',
    title: 'Тропа манны',
    subtitle: 'Классическая «змейка» с библейским смыслом: веди народ через пустыню, собирай манну с неба и складывай стих слово за словом. Не врезайся в стены и в свой хвост!',
    start: 'Начать путь',
    again: 'Играть снова',
    resume: 'Дальше',
    exit: 'Выход',
    score: 'Очки',
    best: 'Рекорд',
    level: 'Уровень',
    verseDone: 'Стих собран!',
    bonus: 'Бонус +20',
    gameOver: 'Путь прервался!',
    overText: 'Даже когда мы спотыкаемся, манна будет ждать утром. Попробуй ещё раз!',
    slow: '🕊️ Замедление!',
    howTitle: 'Как играть',
    how1: '🍞 Собирай манну — караван растёт, +1 очко',
    how2: '⭐ Лови золотые слова по порядку — собери весь стих и пройди уровень',
    how3: '🕊️ Голубь замедляет время на 5 секунд',
    how4: '⌨️ Стрелки / WASD · 📱 Свайп в любую сторону',
    nextWord: 'Следующее слово',
  } : {
    back: 'All Games',
    eyebrow: 'Classic Arcade',
    title: 'Manna Trail',
    subtitle: 'Classic snake with a Bible heart: lead the people through the wilderness, gather manna from heaven, and build the memory verse word by word. Don\'t hit the walls — or your own trail!',
    start: 'Start the Trail',
    again: 'Play Again',
    resume: 'Keep Going',
    exit: 'Exit',
    score: 'Score',
    best: 'Best',
    level: 'Level',
    verseDone: 'Verse complete!',
    bonus: 'Bonus +20',
    gameOver: 'The trail ended!',
    overText: 'Even when we stumble, there is fresh manna in the morning. Try again!',
    slow: '🕊️ Slow time!',
    howTitle: 'How to Play',
    how1: '🍞 Eat manna — the trail grows, +1 point',
    how2: '⭐ Catch the golden words in order — finish the verse to clear the level',
    how3: '🕊️ The dove slows time for 5 seconds',
    how4: '⌨️ Arrows / WASD · 📱 Swipe anywhere',
    nextWord: 'Next word',
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#071527,#0c2438 50%,#f7fbff)', color: '#fff' }}>
      <style>{`
        .mt-shell { max-width: 1000px; margin: 0 auto; padding: 40px 16px 64px; }
        .mt-fullscreen { position: fixed; inset: 0; z-index: 9999; background: #071527; display: flex; flex-direction: column; touch-action: none; user-select: none; -webkit-user-select: none; }
        .mt-hud { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px; }
        .mt-hud-stat { border-radius: 12px; padding: 6px 12px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); font-family: var(--font-nunito); font-weight: 1000; font-size: .82rem; white-space: nowrap; }
        .mt-exit { border: 0; border-radius: 999px; padding: 8px 16px; background: rgba(255,255,255,.12); color: #fff; font-family: var(--font-nunito); font-weight: 1000; cursor: pointer; }
        .mt-verse-bar { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; padding: 4px 12px 8px; }
        .mt-chip { border-radius: 999px; padding: 4px 10px; font-family: var(--font-nunito); font-weight: 1000; font-size: .74rem; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.16); color: rgba(255,255,255,.45); }
        .mt-chip.got { background: linear-gradient(180deg,#fde68a,#f59e0b); border-color: #fde68a; color: #78350f; }
        .mt-chip.next { border-color: #fbbf24; color: #fde68a; animation: mt-pulse 1.1s ease-in-out infinite; }
        .mt-arena { flex: 1; position: relative; min-height: 0; }
        .mt-arena canvas { position: absolute; inset: 0; }
        .mt-overlay { position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center; padding: 20px; background: rgba(4,12,22,.78); }
        .mt-card { max-width: 460px; width: 100%; border-radius: 26px; padding: 26px 22px; background: rgba(255,255,255,.97); color: #0d1f3c; border: 3px solid #fbbf24; text-align: center; box-shadow: 0 30px 90px rgba(0,0,0,.5); }
        .mt-btn { border: 0; border-radius: 16px; padding: 13px 30px; background: linear-gradient(180deg,#fbbf24,#f97316); color: #3b2307; font-family: var(--font-nunito); font-weight: 1000; font-size: 1.02rem; cursor: pointer; box-shadow: 0 12px 28px rgba(0,0,0,.25); }
        .mt-slow-badge { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 5; border-radius: 999px; padding: 6px 14px; background: rgba(125,211,252,.18); border: 1px solid rgba(125,211,252,.55); color: #bae6fd; font-family: var(--font-nunito); font-weight: 1000; font-size: .82rem; }
        @keyframes mt-pulse { 0%,100% { opacity: 1; } 50% { opacity: .45; } }
      `}</style>

      {phase !== 'menu' ? (
        <div className="mt-fullscreen" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          <div className="mt-hud">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="mt-hud-stat">⭐ {copy.score}: {score}</span>
              <span className="mt-hud-stat">🏆 {copy.best}: {best}</span>
              <span className="mt-hud-stat">📖 {copy.level} {level}</span>
            </div>
            <button className="mt-exit" onClick={() => setPhase('menu')}>✕ {copy.exit}</button>
          </div>
          <div className="mt-verse-bar" aria-label={verse.ref}>
            {verse.words.map((word, i) => (
              <span key={`${word}-${i}`} className={`mt-chip ${i < wordsGot ? 'got' : i === wordsGot ? 'next' : ''}`}>
                {i < wordsGot ? word : i === wordsGot ? word : '•••'}
              </span>
            ))}
            <span className="mt-chip" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.55)' }}>— {verse.ref}</span>
          </div>
          <div className="mt-arena" ref={wrapRef}>
            {slowOn && <div className="mt-slow-badge">{copy.slow}</div>}
            <canvas ref={canvasRef} />
          </div>

          {phase === 'levelUp' && (
            <div className="mt-overlay">
              <div className="mt-card">
                <div style={{ fontSize: '2.6rem', marginBottom: 8 }}>🍞✨📖</div>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#b45309', letterSpacing: 1, textTransform: 'uppercase', fontSize: '.8rem' }}>
                  {copy.verseDone} {copy.bonus}
                </p>
                <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '1.12rem', lineHeight: 1.6, margin: '12px 0 6px', color: '#1e293b' }}>
                  &ldquo;{verse.words.join(' ')}&rdquo;
                </p>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#075985', marginBottom: 18 }}>— {verse.ref}</p>
                <button className="mt-btn" onClick={nextLevel}>{copy.resume} → {copy.level} {level + 1}</button>
              </div>
            </div>
          )}

          {phase === 'over' && (
            <div className="mt-overlay">
              <div className="mt-card">
                <div style={{ fontSize: '2.6rem', marginBottom: 8 }}>🌅</div>
                <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '1.5rem', marginBottom: 8 }}>{copy.gameOver}</h2>
                <p style={{ fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.6, color: '#475569', marginBottom: 14 }}>{copy.overText}</p>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '1.15rem', marginBottom: 18 }}>
                  ⭐ {copy.score}: {score} · 🏆 {copy.best}: {best}
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button className="mt-btn" onClick={startGame}>{copy.again}</button>
                  <button className="mt-exit" style={{ background: '#e2e8f0', color: '#334155' }} onClick={() => setPhase('menu')}>{copy.exit}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-shell">
          <Link href="/games" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {copy.back}</Link>
          <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 22 }}>{copy.eyebrow}</p>
          <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2.1rem,7vw,4.2rem)', lineHeight: 1.02, margin: '6px 0 14px' }}>🍞 {copy.title}</h1>
          <p style={{ maxWidth: 720, fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.72, color: 'rgba(255,255,255,.9)' }}>{copy.subtitle}</p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '20px 0 26px' }}>
            <span className="mt-hud-stat">🏆 {copy.best}: {best}</span>
          </div>

          <button className="mt-btn" style={{ fontSize: '1.15rem', padding: '16px 40px' }} onClick={startGame}>
            ▶ {copy.start}
          </button>

          <div style={{ marginTop: 30, borderRadius: 24, padding: 20, maxWidth: 560, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.16)' }}>
            <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#ffd866', fontSize: '1.05rem', marginBottom: 12 }}>{copy.howTitle}</h2>
            {[copy.how1, copy.how2, copy.how3, copy.how4].map((line) => (
              <p key={line} style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, lineHeight: 1.7, color: 'rgba(255,255,255,.88)', fontSize: '.95rem' }}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
