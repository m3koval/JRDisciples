'use client'


import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { GRID, MAX_TRAIL, initialTrail, rocksForLevel, freeCell, wordCell, collisionReason, tickDuration, frameDelta, readBest, saveBest, ownsPointer } from './mechanics'

// ─── Types ────────────────────────────────────────────────────────────────────
type CollisionReason = 'edge' | 'rock' | 'trail'
type Cell = { x: number; y: number }
type Dir = { x: number; y: number }
type Phase = 'menu' | 'play' | 'levelUp' | 'over' | 'paused' | 'won'
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string }
type Verse = { words: string[]; quote: string; ref: string }

// ─── Config ───────────────────────────────────────────────────────────────────

const SLOW_FACTOR = 1.6
const DOVE_EVERY_MS = 14000
const DOVE_LIFETIME = 8000
const SLOW_DURATION = 5000


// Exact contiguous excerpts: Bible.com ESV (59) and Synodal (400).
// Punctuation belongs in the reward quote, not in collectible word tiles.
function verseWords(quote: string): string[] { return quote.replace(/[.,;!—]/g, '').split(/\s+/).filter(Boolean) }
const VERSES_EN: Verse[] = [
  { quote: 'Give us this day our daily bread', ref: 'Matthew 6:11' },
  { quote: 'Man shall not live by bread alone', ref: 'Matthew 4:4' },
  { quote: 'I am the bread of life', ref: 'John 6:35' },
  { quote: 'Oh, taste and see that the LORD is good!', ref: 'Psalm 34:8' },
  { quote: 'And my God will supply every need of yours', ref: 'Philippians 4:19' },
  { quote: 'I am the living bread that came down from heaven.', ref: 'John 6:51' },
  { quote: 'and he rained down on them manna to eat', ref: 'Psalm 78:24' },
  { quote: 'feed me with the food that is needful for me', ref: 'Proverbs 30:8' },
  { quote: 'The LORD is my shepherd; I shall not want.', ref: 'Psalm 23:1' },
].map(verse => ({ ...verse, words: verseWords(verse.quote) }))
const VERSES_RU: Verse[] = [
  { quote: 'хлеб наш насущный дай нам на сей день', ref: 'Матфея 6:11' },
  { quote: 'не хлебом одним будет жить человек', ref: 'Матфея 4:4' },
  { quote: 'Я есмь хлеб жизни', ref: 'Иоанна 6:35' },
  { quote: 'Вкусите и увидите, как благ Господь!', ref: 'Псалом 33:9' },
  { quote: 'Бог мой да восполнит всякую нужду вашу', ref: 'Филиппийцам 4:19' },
  { quote: 'Я хлеб живый, сшедший с небес', ref: 'Иоанна 6:51' },
  { quote: 'и одождил на них манну в пищу', ref: 'Псалом 77:24' },
  { quote: 'питай меня насущным хлебом', ref: 'Притчи 30:8' },
  { quote: 'Господь — Пастырь мой; я ни в чем не буду нуждаться', ref: 'Псалом 22:1' },
].map(verse => ({ ...verse, words: verseWords(verse.quote) }))


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
  const [gentle, setGentle] = useState(true)
  const [bump, setBump] = useState<CollisionReason>('edge')

  const gentleRef = useRef(true)
  const bestRef = useRef(0)
  const clockRef = useRef(0)
  const resetTimingRef = useRef(true)
  const pointerRef = useRef<number | null>(null)
  const reducedMotionRef = useRef(false)

  // Game state lives in refs so the loop never waits on React
  const phaseRef = useRef<Phase>('menu')
  const snakeRef = useRef<Cell[]>([])
  const prevSnakeRef = useRef<Cell[]>([])
  const dirRef = useRef<Dir>({ x: 1, y: 0 })
  const dirQueueRef = useRef<Dir[]>([])
  const mannaRef = useRef<Cell | null>(null)
  const wordTileRef = useRef<Cell | null>(null)
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
  const overlayRef = useRef<HTMLDivElement | null>(null)
  // virtual joystick: hold anywhere and steer; anchor follows the thumb
  const joyRef = useRef<{ ax: number; ay: number; cx: number; cy: number } | null>(null)
  const joyVecRef = useRef<{ x: number; y: number } | null>(null)

  const verse = VERSES[(level - 1) % VERSES.length]

  useEffect(() => {
    try { bestRef.current = readBest(window.localStorage) } catch { /* blocked storage getter */ }
    setBest(bestRef.current)
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hide = () => { if (document.hidden && phaseRef.current === 'play') changePhase('paused') }
    const blur = () => { if (phaseRef.current === 'play') changePhase('paused') }
    document.addEventListener('visibilitychange', hide)
    window.addEventListener('blur', blur)
    return () => { document.removeEventListener('visibilitychange', hide); window.removeEventListener('blur', blur) }
  }, [])

  function changePhase(next: Phase) {
    phaseRef.current = next
    dirQueueRef.current = []
    pointerRef.current = null
    joyRef.current = null
    joyVecRef.current = null
    resetTimingRef.current = true
    setPhase(next)
  }

  useEffect(() => {
    if (phase === 'play') {
      canvasRef.current?.focus({ preventScroll: true })
      return
    }
    const dialog = overlayRef.current
    if (!dialog) return
    const buttons = () => Array.from(dialog.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))
    buttons()[0]?.focus({ preventScroll: true })
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const targets = buttons()
      if (!targets.length) return
      const first = targets[0], last = targets[targets.length - 1]
      if (!dialog.contains(document.activeElement) || (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus({ preventScroll: true })
      }
    }
    document.addEventListener('keydown', trapFocus)
    return () => document.removeEventListener('keydown', trapFocus)
  }, [phase])

  // ── Direction handling ─────────────────────────────────────────────────────
  function pushDir(d: Dir) {
    if (phaseRef.current !== 'play') return
    const queue = dirQueueRef.current
    const last = queue.length > 0 ? queue[queue.length - 1] : dirRef.current
    // ignore reversals and duplicates
    if (last.x === -d.x && last.y === -d.y) return
    if (last.x === d.x && last.y === d.y) return
    if (queue.length < 3) queue.push(d)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (phaseRef.current === 'play') changePhase('paused')
        else if (phaseRef.current === 'paused') changePhase('play')
        return
      }
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

  const JOY_DEAD = 12   // px before steering kicks in
  const JOY_REACH = 52  // max thumb-to-anchor distance; anchor gets dragged along

  function onPointerDown(e: React.PointerEvent) {
    if (phaseRef.current !== 'play' || pointerRef.current !== null || e.button !== 0 || (e.target as HTMLElement).closest('button')) return
    pointerRef.current = e.pointerId
    e.currentTarget.setPointerCapture?.(e.pointerId)
    joyRef.current = { ax: e.clientX, ay: e.clientY, cx: e.clientX, cy: e.clientY }
    joyVecRef.current = null
  }
  function onPointerMove(e: React.PointerEvent) {
    const joy = joyRef.current
    if (!joy || !ownsPointer(pointerRef.current, e.pointerId) || phaseRef.current !== 'play') return
    joy.cx = e.clientX
    joy.cy = e.clientY
    let dx = joy.cx - joy.ax
    let dy = joy.cy - joy.ay
    const dist = Math.hypot(dx, dy)
    // drag the anchor along like slither-style joysticks, so steering
    // keeps working however far the thumb wanders
    if (dist > JOY_REACH) {
      const k = (dist - JOY_REACH) / dist
      joy.ax += dx * k
      joy.ay += dy * k
      dx = joy.cx - joy.ax
      dy = joy.cy - joy.ay
    }
    joyVecRef.current = Math.hypot(dx, dy) > JOY_DEAD ? { x: dx, y: dy } : null
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!ownsPointer(pointerRef.current, e.pointerId)) return
    pointerRef.current = null
    joyRef.current = null
    joyVecRef.current = null
  }

  // Turn the joystick vector into a grid direction. If the thumb pulls
  // straight backwards (a U-turn), steer with the perpendicular component
  // instead of ignoring the input — this is what makes it feel "smart".
  function resolveJoyDir(vec: { x: number; y: number }, cur: Dir): Dir | null {
    const ax = Math.abs(vec.x)
    const ay = Math.abs(vec.y)
    const primary: Dir = ax >= ay ? { x: Math.sign(vec.x), y: 0 } : { x: 0, y: Math.sign(vec.y) }
    if (primary.x === -cur.x && primary.y === -cur.y) {
      const secondary: Dir = ax >= ay ? { x: 0, y: Math.sign(vec.y) } : { x: Math.sign(vec.x), y: 0 }
      const secMag = ax >= ay ? ay : ax
      if (secMag > JOY_DEAD * 0.5 && (secondary.x !== 0 || secondary.y !== 0)) return secondary
      return null
    }
    return primary
  }

  // ── Game setup ─────────────────────────────────────────────────────────────
  function spawnItems() {
    const rocks = rocksForLevel(levelRef.current)
    wordTileRef.current = wordCell(levelRef.current, wordsGotRef.current, snakeRef.current, rocks)
    mannaRef.current = freeCell([...snakeRef.current, ...rocks, ...(wordTileRef.current ? [wordTileRef.current] : [])])
  }

  function resetTrail() {
    snakeRef.current = initialTrail()
    prevSnakeRef.current = initialTrail()
    dirRef.current = { x: 1, y: 0 }
    doveRef.current = null
    slowUntilRef.current = 0
    nextDoveAtRef.current = clockRef.current + DOVE_EVERY_MS
    setSlowOn(false)
    spawnItems()
  }

  function recover() {
    resetTrail()
    changePhase('play')
  }

  function startGame() {
    snakeRef.current = initialTrail()
    prevSnakeRef.current = snakeRef.current.map(c => ({ ...c }))
    dirRef.current = { x: 1, y: 0 }
    dirQueueRef.current = []
    joyRef.current = null
    joyVecRef.current = null
    doveRef.current = null
    clockRef.current = 0
    nextDoveAtRef.current = DOVE_EVERY_MS
    gentleRef.current = gentle
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
    changePhase('play')
  }

  function nextLevel() {
    if (levelRef.current >= VERSES.length) { changePhase('won'); return }
    levelRef.current += 1
    wordsGotRef.current = 0
    dirQueueRef.current = []
    setLevel(levelRef.current)
    setWordsGot(0)
    resetTrail()
    changePhase('play')
  }

  function endGame() {
    flashRef.current = reducedMotionRef.current ? 0 : 0.3
    const finalScore = scoreRef.current
    bestRef.current = Math.max(bestRef.current, finalScore)
    setBest(bestRef.current)
    try { saveBest(window.localStorage, bestRef.current) } catch { /* play works without storage */ }
    changePhase('over')
  }

  function burst(cell: Cell, color: string, cellPx: number, ox: number, oy: number) {
    if (reducedMotionRef.current) return
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
      prevSnakeRef.current = snake.map(c => ({ x: c.x, y: c.y }))
      // keyboard queue first, otherwise steer from the held joystick
      const q = dirQueueRef.current
      let want: Dir | null = null
      if (q.length > 0) want = q.shift()!
      else if (joyVecRef.current) want = resolveJoyDir(joyVecRef.current, dirRef.current)
      if (want) {
        const cur = dirRef.current
        if (!(want.x === -cur.x && want.y === -cur.y) && !(want.x === cur.x && want.y === cur.y)) {
          dirRef.current = want
        }
      }
      const dir = dirRef.current
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }

      const grows = snake.length < MAX_TRAIL && [mannaRef.current, wordTileRef.current].some(c => c && c.x === head.x && c.y === head.y)
      const reason = collisionReason(head, snake, rocksForLevel(levelRef.current), grows)
      if (reason) {
        setBump(reason)
        endGame()
        return
      }

      snake.unshift(head)
      if (!grows) snake.pop()
      const verseNow = VERSES[(levelRef.current - 1) % VERSES.length]
      const manna = mannaRef.current
      const wordTile = wordTileRef.current
      const dove = doveRef.current
      const geo = geometry()

      if (manna && head.x === manna.x && head.y === manna.y) {
        scoreRef.current += 1
        setScore(scoreRef.current)
        burst(manna, '#fef3c7', geo.cell, geo.ox, geo.oy)
        mannaRef.current = freeCell([...snake, ...rocksForLevel(levelRef.current), ...(wordTile ? [wordTile] : []), ...(dove ? [dove.cell] : [])])
        // grow: do not pop tail
      } else if (wordTile && head.x === wordTile.x && head.y === wordTile.y) {
        scoreRef.current += 5
        wordsGotRef.current += 1
        setScore(scoreRef.current)
        setWordsGot(wordsGotRef.current)
        burst(wordTile, '#fbbf24', geo.cell, geo.ox, geo.oy)
        if (wordsGotRef.current >= verseNow.words.length) {
          scoreRef.current += 20
          setScore(scoreRef.current)
          bestRef.current = Math.max(bestRef.current, scoreRef.current)
          setBest(bestRef.current)
          try { saveBest(window.localStorage, bestRef.current) } catch { /* optional persistence */ }
          changePhase('levelUp')
          return
        }
        wordTileRef.current = wordCell(levelRef.current, wordsGotRef.current, snake, [...rocksForLevel(levelRef.current), ...(manna ? [manna] : []), ...(dove ? [dove.cell] : [])])
        if (!wordTileRef.current) resetTrail()
        // grow: do not pop tail
      } else {
        if (dove && head.x === dove.cell.x && head.y === dove.cell.y) {
          slowUntilRef.current = now + SLOW_DURATION
          setSlowOn(true)
          burst(dove.cell, '#bae6fd', geo.cell, geo.ox, geo.oy)
          doveRef.current = null
        }

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

    function draw(now: number, frac: number) {
      canvas!.dataset.state = JSON.stringify({ phase: phaseRef.current, snake: snakeRef.current, direction: dirRef.current, word: wordTileRef.current, rocks: rocksForLevel(levelRef.current), level: levelRef.current, words: wordsGotRef.current, score: scoreRef.current })
      const { cell, ox, oy, size } = geometry()
      const w = canvas!.width
      const h = canvas!.height

      // background
      const bg = ctx!.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#071527')
      bg.addColorStop(1, '#0c2438')
      ctx!.fillStyle = bg
      ctx!.fillRect(0, 0, w, h)

      // A quiet sand grid: every blocking rock below is also a real collider.
      const sand = ctx!.createLinearGradient(ox, oy, ox + size, oy + size)
      sand.addColorStop(0, '#a97c4c')
      sand.addColorStop(.48, '#ba905b')
      sand.addColorStop(1, '#88633e')
      ctx!.fillStyle = sand
      ctx!.fillRect(ox, oy, size, size)
      ctx!.strokeStyle = 'rgba(251,191,36,.55)'
      ctx!.lineWidth = 2 * dpr
      ctx!.strokeRect(ox - dpr, oy - dpr, size + 2 * dpr, size + 2 * dpr)
      ctx!.strokeStyle = 'rgba(47,31,18,.12)'
      ctx!.lineWidth = 1
      for (let i = 1; i < GRID; i++) {
        ctx!.beginPath(); ctx!.moveTo(ox + i * cell, oy); ctx!.lineTo(ox + i * cell, oy + size); ctx!.stroke()
        ctx!.beginPath(); ctx!.moveTo(ox, oy + i * cell); ctx!.lineTo(ox + size, oy + i * cell); ctx!.stroke()
      }

      // Visible rock islands exactly match the collision map.
      for (const rock of rocksForLevel(levelRef.current)) {
        const rx = ox + rock.x * cell, ry = oy + rock.y * cell
        ctx!.fillStyle = '#534d48'
        roundRect(ctx!, rx + cell * .06, ry + cell * .06, cell * .88, cell * .88, cell * .25)
        ctx!.fill()
        ctx!.fillStyle = '#aaa199'
        ctx!.fillRect(rx + cell * .22, ry + cell * .2, cell * .4, cell * .13)
      }

      // manna (pulsing golden flake)
      const manna = mannaRef.current
      const pulse = reducedMotionRef.current ? 1 : 1 + Math.sin(now / 200) * 0.15
      if (manna) {
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

      }
      // word tile (golden square + floating word label)
      const wt = wordTileRef.current
      if (wt) {
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
      }

      // dove
      const dove = doveRef.current
      if (dove) {
        const blink = false
        if (!blink) {
          ctx!.font = `${cell * 0.85}px serif`
          ctx!.textAlign = 'center'
          ctx!.textBaseline = 'middle'
          ctx!.fillText('🕊️', ox + (dove.cell.x + 0.5) * cell, oy + (dove.cell.y + 0.52) * cell)
        }
      }

      // snake — gradient trail gliding between cells (interpolated rendering)
      const snake = snakeRef.current
      const prev = prevSnakeRef.current
      const n = snake.length
      const lerpPos = (i: number) => {
        const cur = snake[i]
        const was = prev[Math.min(i, prev.length - 1)] ?? cur
        return { x: was.x + (cur.x - was.x) * frac, y: was.y + (cur.y - was.y) * frac }
      }
      for (let i = n - 1; i >= 0; i--) {
        const s = lerpPos(i)
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
        const hd = lerpPos(0)
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

      // Gentle-mode steering forecast uses the same queue, joystick and collision
      // contract as the next tick; no automated turn or altered collision gates.
      if (gentleRef.current && phaseRef.current === 'play' && snakeRef.current.length) {
        const snake = snakeRef.current
        const direction = dirQueueRef.current[0] ?? (joyVecRef.current ? resolveJoyDir(joyVecRef.current, dirRef.current) : null) ?? dirRef.current
        const next = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }
        const grows = snake.length < MAX_TRAIL && [mannaRef.current, wordTileRef.current].some(c => c && c.x === next.x && c.y === next.y)
        const danger = collisionReason(next, snake, rocksForLevel(levelRef.current), grows)
        canvas!.dataset.nextStep = JSON.stringify({ ...next, danger })
        const nx = ox + Math.max(0, Math.min(GRID - 1, next.x)) * cell
        const ny = oy + Math.max(0, Math.min(GRID - 1, next.y)) * cell
        ctx!.strokeStyle = danger ? '#8b1d18' : '#fff9da'
        ctx!.lineWidth = Math.max(2 * dpr, cell * .08)
        ctx!.strokeRect(nx + cell * .1, ny + cell * .1, cell * .8, cell * .8)
        if (danger) {
          ctx!.beginPath()
          ctx!.moveTo(nx + cell * .22, ny + cell * .22); ctx!.lineTo(nx + cell * .78, ny + cell * .78)
          ctx!.moveTo(nx + cell * .78, ny + cell * .22); ctx!.lineTo(nx + cell * .22, ny + cell * .78)
          ctx!.stroke()
        }
      } else { delete canvas!.dataset.nextStep }

      // joystick indicator while steering
      const joy = joyRef.current
      if (joy && phaseRef.current === 'play') {
        const rect = wrap!.getBoundingClientRect()
        const jax = (joy.ax - rect.left) * dpr
        const jay = (joy.ay - rect.top) * dpr
        const jcx = (joy.cx - rect.left) * dpr
        const jcy = (joy.cy - rect.top) * dpr
        ctx!.strokeStyle = 'rgba(255,255,255,.22)'
        ctx!.lineWidth = 2 * dpr
        ctx!.beginPath()
        ctx!.arc(jax, jay, JOY_REACH * dpr, 0, Math.PI * 2)
        ctx!.stroke()
        ctx!.fillStyle = 'rgba(251,191,36,.5)'
        ctx!.beginPath()
        ctx!.arc(jcx, jcy, 14 * dpr, 0, Math.PI * 2)
        ctx!.fill()
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
      if (flashRef.current > 0 && !reducedMotionRef.current) {
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

    function frame(wallTime: number) {
      raf = requestAnimationFrame(frame)
      const dt = resetTimingRef.current ? 0 : frameDelta(wallTime, last)
      if (resetTimingRef.current) { acc = 0; resetTimingRef.current = false }
      last = wallTime
      if (phaseRef.current === 'play') clockRef.current += dt
      const now = clockRef.current

      if (phaseRef.current === 'play') {
        // dove lifecycle
        if (doveRef.current && now > doveRef.current.until) doveRef.current = null
        if (!doveRef.current && now > nextDoveAtRef.current) {
          const cell = freeCell([...snakeRef.current, ...rocksForLevel(levelRef.current), ...(mannaRef.current ? [mannaRef.current] : []), ...(wordTileRef.current ? [wordTileRef.current] : [])])
          doveRef.current = cell ? { cell, until: now + DOVE_LIFETIME } : null
          nextDoveAtRef.current = now + DOVE_EVERY_MS + Math.random() * 5000
        }
        if (slowUntilRef.current > 0 && now > slowUntilRef.current) {
          slowUntilRef.current = 0
          setSlowOn(false)
        }

        let tickMs = tickDuration(levelRef.current, gentleRef.current)
        if (now < slowUntilRef.current) tickMs *= SLOW_FACTOR

        acc += dt
        while (acc >= tickMs && phaseRef.current === 'play') {
          acc -= tickMs
          tick(now)
        }
        // render between ticks: 0 = just ticked, 1 = next tick due
        draw(now, Math.min(1, acc / tickMs))
        return
      }
      draw(now, 1)
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
    how4: '⌨️ Стрелки / WASD · 📱 Держи палец на экране и веди в нужную сторону — где угодно',
    nextWord: 'Следующее слово',
    chapters: ['Утро в пустыне', 'Тропа среди камней', 'Дорога к лагерю'],
    mission: 'Веди караван к золотому слову',
    gentle: 'Спокойный путь', brisk: 'Бодрый путь',
    pause: 'Пауза', paused: 'Отдохнём?', continue: 'Продолжить',
    recover: 'Вернуться на тропу', recovery: 'Собранные слова и очки остались! Начни с коротким караваном.',
    won: 'Караван дома!', finish: 'В лагерь',
    lesson: 'Бог заботится о нас каждый день. Мы можем доверять Ему и делиться с другими.',
    journey: '9 стихов · 3 тропы · слова не теряются при ошибке',
    directions: ['Вверх', 'Влево', 'Вниз', 'Вправо'],
    forecast: 'Спокойный путь: рамка — следующий шаг. Крестик — пора повернуть.',
    bumps: { edge: 'Край тропы! Поворачивай до границы.', rock: 'Камень на пути! Обойди его сбоку.', trail: 'Караван пересёк свой след. Сделай круг пошире.' },
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
    how4: '⌨️ Arrows / WASD · 📱 Hold your thumb anywhere and steer',
    nextWord: 'Next word',
    chapters: ['Wilderness morning', 'Among the rocks', 'The way to camp'],
    mission: 'Guide the trail to the golden word',
    gentle: 'Gentle trail', brisk: 'Brisk trail',
    pause: 'Pause', paused: 'Take a breath', continue: 'Continue',
    recover: 'Back to the trail', recovery: 'Your words and points are safe! Try again with a short trail.',
    won: 'The caravan is home!', finish: 'To camp',
    lesson: 'God cares for us each day. We can trust Him and share with others.',
    journey: '9 verses · 3 trails · keep your words after a bump',
    directions: ['Up', 'Left', 'Down', 'Right'],
    forecast: 'Gentle trail: the outline is your next step. An × means turn now.',
    bumps: { edge: 'The edge! Turn before the border.', rock: 'A rock in the way! Go around its side.', trail: 'You crossed your own trail. Make a wider turn.' },
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#071527,#0c2438 50%,#f7fbff)', color: '#fff' }}>
      <style>{`
        .mt-shell { max-width: 1000px; margin: 0 auto; padding: 40px 16px 64px; }
        .mt-fullscreen { position: fixed; inset: 0; z-index: 9999; background: #071527; display: flex; flex-direction: column; touch-action: none; user-select: none; -webkit-user-select: none; padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); }
        .mt-hud { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px; }
        .mt-hud-stat { border-radius: 12px; padding: 6px 12px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); font-family: var(--font-nunito); font-weight: 1000; font-size: .82rem; white-space: nowrap; }
        .mt-exit { min-height: 44px; border: 0; border-radius: 999px; padding: 8px 12px; background: rgba(255,255,255,.12); color: #fff; font-family: var(--font-nunito); font-weight: 1000; cursor: pointer; }
        .mt-verse-bar { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; padding: 4px 12px 8px; }
        .mt-chip { border-radius: 999px; padding: 4px 10px; font-family: var(--font-nunito); font-weight: 1000; font-size: .74rem; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.16); color: rgba(255,255,255,.45); }
        .mt-chip.got { background: linear-gradient(180deg,#fde68a,#f59e0b); border-color: #fde68a; color: #78350f; }
        .mt-chip.next { border-color: #fbbf24; color: #fde68a; animation: mt-pulse 1.1s ease-in-out infinite; }
        .mt-arena { flex: 1; position: relative; min-height: 0; }
        .mt-arena canvas { position: absolute; inset: 0; outline: none; }
        .mt-arena canvas:focus-visible { outline: 2px solid #fde68a; outline-offset: -2px; }
        .mt-overlay { position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center; padding: 20px; background: rgba(4,12,22,.78); }
        .mt-card { max-height: 90dvh; overflow-y: auto; max-width: 460px; width: 100%; border-radius: 26px; padding: 26px 22px; background: rgba(255,255,255,.97); color: #0d1f3c; border: 3px solid #fbbf24; text-align: center; box-shadow: 0 30px 90px rgba(0,0,0,.5); }
        .mt-card h2 { font: 1000 clamp(1.35rem, 4vw, 1.9rem)/1.2 var(--font-nunito); margin: 10px 0; }
        .mt-btn { border: 0; border-radius: 16px; padding: 13px 30px; background: linear-gradient(180deg,#fbbf24,#f97316); color: #3b2307; font-family: var(--font-nunito); font-weight: 1000; font-size: 1.02rem; cursor: pointer; box-shadow: 0 12px 28px rgba(0,0,0,.25); }
        .mt-slow-badge { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 5; border-radius: 999px; padding: 6px 14px; background: rgba(125,211,252,.18); border: 1px solid rgba(125,211,252,.55); color: #bae6fd; font-family: var(--font-nunito); font-weight: 1000; font-size: .82rem; }
        @keyframes mt-pulse { 0%,100% { opacity: 1; } 50% { opacity: .45; } }
        .mt-objective { text-align: center; padding: 3px 12px 6px; font: 800 .9rem var(--font-nunito); color: #fde68a; }
        .mt-controls { display: flex; justify-content: center; gap: 10px; padding: 6px 12px 10px; }
        .mt-controls button { min-width: 56px; min-height: 48px; border: 2px solid #76bdb4; border-radius: 14px; background: #174c54; color: white; font-size: 1.5rem; touch-action: none; }
        .mt-controls button:active { background: #417a7b; transform: translateY(2px); }
        /* The board owns a full-height landscape column; controls never cover cells. */
        @media (orientation: landscape) {
          .mt-fullscreen { display: grid; grid-template-columns: minmax(0, 1fr) clamp(220px, 34vw, 260px); grid-template-rows: auto auto minmax(0, 1fr) auto; }
          .mt-arena { grid-column: 1; grid-row: 1 / -1; min-width: 0; }
          .mt-hud { grid-column: 2; grid-row: 1; flex-wrap: wrap; justify-content: center; padding: 8px; gap: 6px; }
          .mt-hud > div { justify-content: center; width: 100%; }
          .mt-hud-stat { padding: 5px 8px; }
          .mt-objective { grid-column: 2; grid-row: 2; font-size: .85rem; padding: 2px 8px 6px; }
          .mt-verse-bar { grid-column: 2; grid-row: 3; align-content: start; overflow-y: auto; min-height: 0; padding: 4px 8px; }
          .mt-controls { grid-column: 2; grid-row: 4; display: grid; grid-template-columns: repeat(3, 52px); grid-template-rows: repeat(3, 48px); gap: 4px; padding: 8px; align-self: end; }
          .mt-controls button { min-width: 48px; min-height: 48px; }
          .mt-controls button:nth-child(1) { grid-area: 1 / 2; }
          .mt-controls button:nth-child(2) { grid-area: 2 / 1; }
          .mt-controls button:nth-child(3) { grid-area: 3 / 2; }
          .mt-controls button:nth-child(4) { grid-area: 2 / 3; }
        }
        @media (orientation: landscape) and (max-height: 420px) { .mt-verse-bar { display: none; } .mt-hud { padding: 4px 8px; } }
        @media (orientation: portrait) and (max-width: 400px) {
          .mt-hud { padding: 6px 8px; gap: 5px; }
          .mt-hud > div { gap: 4px !important; }
          .mt-hud-stat { padding: 5px 7px; font-size: .74rem; }
          .mt-exit { padding: 7px 9px; }
          .mt-objective { font-size: .82rem; }
          .mt-verse-bar { gap: 4px; padding: 3px 8px 5px; }
          .mt-chip { padding: 3px 7px; }
        }
        @media (prefers-reduced-motion: reduce) { .mt-chip.next { animation: none; } }
      `}</style>

      {phase !== 'menu' ? (
        <div className="mt-fullscreen" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onLostPointerCapture={onPointerUp}>
          <div className="mt-hud">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="mt-hud-stat">⭐ {copy.score}: {score}</span>
              <span className="mt-hud-stat">🏆 {copy.best}: {best}</span>
              <span className="mt-hud-stat">📖 {level}/9</span>
            </div>
            {phase === 'play' && <button className="mt-exit" onClick={() => changePhase('paused')}>Ⅱ {copy.pause}</button>}
            <button className="mt-exit" onClick={() => changePhase('menu')}>✕ {copy.exit}</button>
          </div>
          <div className="mt-objective" aria-live="polite">
            {copy.chapters[Math.floor((level - 1) / 3)]} · {wordsGot}/{verse.words.length}<br />
            ⭐ {copy.mission}: <strong>{verse.words[Math.min(wordsGot, verse.words.length - 1)]}</strong>
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
            <canvas tabIndex={0} ref={canvasRef} role="img" aria-label={`${copy.title}: ${copy.mission}`} />
          </div>
          {phase === 'play' && <div className="mt-controls" aria-label={copy.howTitle}>
            {[{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }].map((dir, i) => (
              <button key={i} aria-label={copy.directions[i]} onPointerDown={e => { e.preventDefault(); pushDir(dir) }} onClick={e => { if (e.detail === 0) pushDir(dir) }}>{['↑', '←', '↓', '→'][i]}</button>
            ))}
          </div>}

          {phase === 'paused' && <div className="mt-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label={copy.paused}>
            <div className="mt-card"><h2>{copy.paused}</h2><p style={{ margin: '16px 0' }}>{copy.mission}: <strong>{verse.words[wordsGot]}</strong></p><button className="mt-btn" onClick={() => changePhase('play')}>{copy.continue}</button></div>
          </div>}

          {phase === 'won' && <div className="mt-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label={copy.won}>
            <div className="mt-card"><div style={{ fontSize: 48 }}>⛺</div><h2>{copy.won}</h2><p style={{ margin: '16px 0' }}>{copy.lesson}</p><p style={{ marginBottom: 16 }}>{copy.score}: {score}</p><button className="mt-btn" onClick={startGame}>{copy.again}</button><button className="mt-exit" style={{ background: '#334155', margin: 8 }} onClick={() => changePhase('menu')}>{copy.exit}</button></div>
          </div>}

          {phase === 'levelUp' && (
            <div className="mt-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label={copy.verseDone}>
              <div className="mt-card">
                <div style={{ fontSize: '2.6rem', marginBottom: 8 }}>🍞✨📖</div>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#b45309', letterSpacing: 1, textTransform: 'uppercase', fontSize: '.8rem' }}>
                  {copy.verseDone} {copy.bonus}
                </p>
                <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '1.12rem', lineHeight: 1.6, margin: '12px 0 6px', color: '#1e293b' }}>
                  &ldquo;{verse.quote}&rdquo;
                </p>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#075985', marginBottom: 18 }}>— {verse.ref} · {isRu ? 'Синодальный, отрывок' : 'ESV excerpt'}</p>
                <p style={{ marginBottom: 16, color: '#475569' }}>{copy.lesson}</p>
                <button className="mt-btn" onClick={nextLevel}>{level === VERSES.length ? copy.finish : `${copy.resume} → ${copy.level} ${level + 1}`}</button>
              </div>
            </div>
          )}

          {phase === 'over' && (
            <div className="mt-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label={copy.gameOver}>
              <div className="mt-card">
                <div style={{ fontSize: '2.6rem', marginBottom: 8 }}>🌅</div>
                <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '1.5rem', marginBottom: 8 }}>{copy.gameOver}</h2>
                <p style={{ fontWeight: 900, marginBottom: 10, color: '#7c3522' }}>{copy.bumps[bump]}</p>
                <p style={{ fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.6, color: '#475569', marginBottom: 14 }}>{copy.recovery}</p>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '1.15rem', marginBottom: 18 }}>
                  ⭐ {copy.score}: {score} · 🏆 {copy.best}: {best}
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button className="mt-btn" onClick={recover}>{copy.recover}</button>
                  <button className="mt-exit" style={{ background: '#e2e8f0', color: '#334155' }} onClick={() => changePhase('menu')}>{copy.exit}</button>
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
            <span className="mt-hud-stat">{copy.journey}</span>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <button className="mt-exit" aria-pressed={gentle} style={{ border: gentle ? '2px solid #fbbf24' : '2px solid transparent' }} onClick={() => setGentle(true)}>{copy.gentle}</button>
            <button className="mt-exit" aria-pressed={!gentle} style={{ border: !gentle ? '2px solid #fbbf24' : '2px solid transparent' }} onClick={() => setGentle(false)}>{copy.brisk}</button>
          </div>

          <button className="mt-btn" style={{ fontSize: '1.15rem', padding: '16px 40px' }} onClick={startGame}>
            ▶ {copy.start}
          </button>

          <div style={{ marginTop: 30, borderRadius: 24, padding: 20, maxWidth: 560, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.16)' }}>
            <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#ffd866', fontSize: '1.05rem', marginBottom: 12 }}>{copy.howTitle}</h2>
            {[copy.how1, copy.how2, copy.how3, copy.how4, copy.forecast].map((line) => (
              <p key={line} style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, lineHeight: 1.7, color: 'rgba(255,255,255,.88)', fontSize: '.95rem' }}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
