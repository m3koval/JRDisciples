'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type Item = { id: number; x: number; y: number; kind: 'truth' | 'lie' }
type Wisdom = { en: string; ru: string; refEn: string; refRu: string }

const WISDOM: Wisdom[] = [
  {
    en: 'Your word is a lamp to my feet and a light to my path.',
    ru: 'Слово Твое — светильник ноге моей и свет стезе моей.',
    refEn: 'Psalm 119:105',
    refRu: 'Псалом 118:105',
  },
  {
    en: 'You will know the truth, and the truth will set you free.',
    ru: 'И познаете истину, и истина сделает вас свободными.',
    refEn: 'John 8:32',
    refRu: 'Иоанна 8:32',
  },
  {
    en: 'Be doers of the word, and not hearers only.',
    ru: 'Будьте же исполнители слова, а не слышатели только.',
    refEn: 'James 1:22',
    refRu: 'Иакова 1:22',
  },
  {
    en: 'When I am afraid, I put my trust in you.',
    ru: 'Когда я в страхе, на Тебя я уповаю.',
    refEn: 'Psalm 56:3',
    refRu: 'Псалом 55:4',
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function hit(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y) < 9
}

export default function TruthRunnerPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const [started, setStarted] = useState(false)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [seconds, setSeconds] = useState(75)
  const [player, setPlayer] = useState({ x: 50, y: 80 })
  const [items, setItems] = useState<Item[]>([])
  const [best, setBest] = useState(0)
  const [message, setMessage] = useState('')
  const [wisdomIndex, setWisdomIndex] = useState(0)
  const keys = useRef<Record<string, boolean>>({})
  const pointerTarget = useRef<{ x: number; y: number; active: boolean }>({ x: 50, y: 80, active: false })
  const arenaRef = useRef<HTMLDivElement | null>(null)
  const playerElRef = useRef<HTMLDivElement | null>(null)
  const secondsRef = useRef(75)
  const nextId = useRef(1)

  const copy = isRu ? {
    back: 'Все игры',
    eyebrow: 'Аркада истины',
    title: 'Путь истины',
    subtitle: 'Собирай свет истины. Избегай шёпота лжи. Открывай библейскую мудрость.',
    start: 'Начать игру',
    restart: 'Играть снова',
    choose: 'Выбрать игры',
    score: 'Очки',
    best: 'Рекорд',
    lives: 'Жизни',
    time: 'Время',
    truth: 'Истина',
    lie: 'Ложь',
    how: 'Как играть',
    howText: 'Коснись экрана в любом месте — персонаж следует за пальцем. На компьютере используй стрелки или WASD.',
    reward: 'Награда — Божья мудрость',
    gameOver: 'Игра окончена',
    leaderboard: 'Лидерборд позже: семейные рекорды, значки и недельные вызовы.',
    good: 'Свет истины собран! +10',
    bad: 'Это был шёпот лжи — держись Божьего Слова.',
    quit: 'Выйти',
  } : {
    back: 'All Games',
    eyebrow: 'Truth Arcade',
    title: 'Truth Runner',
    subtitle: 'Collect truth lights. Avoid whispering lies. Unlock Bible wisdom.',
    start: 'Start Game',
    restart: 'Play Again',
    choose: 'Choose Games',
    score: 'Score',
    best: 'Best',
    lives: 'Lives',
    time: 'Time',
    truth: 'Truth',
    lie: 'Lie',
    how: 'How to play',
    howText: 'Touch anywhere on the arena — your character follows your finger. On desktop use arrow keys or WASD.',
    reward: 'Reward — God\'s wisdom',
    gameOver: 'Game Over',
    leaderboard: 'Leaderboard later: family scores, badges, and weekly challenges.',
    good: 'Truth light collected! +10',
    bad: 'That was a whispering lie — stay close to God\'s Word.',
    quit: 'Exit',
  }

  const currentWisdom = useMemo(() => WISDOM[wisdomIndex % WISDOM.length], [wisdomIndex])
  const isDone = started && (!running || lives <= 0 || seconds <= 0)

  useEffect(() => {
    const stored = Number(localStorage.getItem('truth-runner-best') || '0')
    setBest(Number.isFinite(stored) ? stored : 0)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true }
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setSeconds((s) => {
        const next = Math.max(0, s - 1)
        secondsRef.current = next
        return next
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (!running) return
    let timeout: number
    function spawn() {
      const elapsed = 75 - secondsRef.current
      const interval = Math.max(300, 650 - (elapsed / 75) * 340)
      const lieChance = Math.min(0.6, 0.28 + (elapsed / 75) * 0.38)
      const kind: Item['kind'] = Math.random() > lieChance ? 'truth' : 'lie'
      setItems((prev) => [...prev.slice(-16), { id: nextId.current++, x: 8 + Math.random() * 84, y: -8, kind }])
      timeout = window.setTimeout(spawn, interval)
    }
    timeout = window.setTimeout(spawn, 650)
    return () => window.clearTimeout(timeout)
  }, [running])

  useEffect(() => {
    if (!running) return
    let frame = 0
    const tick = () => {
      const left = keys.current.arrowleft || keys.current.a
      const right = keys.current.arrowright || keys.current.d
      const up = keys.current.arrowup || keys.current.w
      const down = keys.current.arrowdown || keys.current.s
      const pt = pointerTarget.current
      setPlayer((p) => {
        if (pt.active) {
          return { x: pt.x, y: pt.y }
        }
        if (left || right || up || down) {
          return {
            x: clamp(p.x + (left ? -3.8 : 0) + (right ? 3.8 : 0), 5, 95),
            y: clamp(p.y + (up ? -3.4 : 0) + (down ? 3.4 : 0), 8, 92),
          }
        }
        return p
      })
      const difficulty = 1 + ((75 - secondsRef.current) / 75) * 1.8
      setItems((prev) => prev.map((item) => ({ ...item, y: item.y + (item.kind === 'truth' ? 1.15 : 1.45) * difficulty })).filter((item) => item.y < 104))
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [running])

  useEffect(() => {
    if (!running) return
    const collided = items.find((item) => hit(player, item))
    if (!collided) return
    setItems((prev) => prev.filter((item) => item.id !== collided.id))
    if (collided.kind === 'truth') {
      setScore((s) => {
        const next = s + 10
        if (next % 30 === 0) setWisdomIndex((i) => i + 1)
        return next
      })
      setMessage(copy.good)
    } else {
      setLives((l) => Math.max(0, l - 1))
      setMessage(copy.bad)
    }
  }, [items, player, running, copy.good, copy.bad])

  useEffect(() => {
    if (!started) return
    if (lives <= 0 || seconds <= 0) setRunning(false)
  }, [lives, seconds, started])

  useEffect(() => {
    if (!isDone) return
    setBest((prev) => {
      const next = Math.max(prev, score)
      localStorage.setItem('truth-runner-best', String(next))
      return next
    })
  }, [isDone, score])

  function startGame() {
    setStarted(true)
    setRunning(true)
    setScore(0)
    setLives(3)
    setSeconds(75)
    setPlayer({ x: 50, y: 80 })
    setItems([])
    setMessage('')
    setWisdomIndex(0)
    pointerTarget.current = { x: 50, y: 80, active: false }
    secondsRef.current = 75
  }

  function exitGame() {
    setStarted(false)
    setRunning(false)
    pointerTarget.current.active = false
  }

  function syncPointer(event: React.PointerEvent<HTMLDivElement>) {
    const rect = arenaRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 5, 95)
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 8, 92)
    pointerTarget.current = { x, y, active: true }
    // Bypass React render cycle — move player instantly, glued to finger
    if (playerElRef.current) {
      playerElRef.current.style.left = `${x}%`
      playerElRef.current.style.top = `${y}%`
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (isDone) return
    event.currentTarget.setPointerCapture(event.pointerId)
    syncPointer(event)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!running || event.buttons === 0) return
    syncPointer(event)
  }

  function handlePointerUp() {
    pointerTarget.current.active = false
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#050914,#081428 55%,#0d1f3c)', color: '#fff' }}>
      <style>{`
        .tr-shell { max-width: 1120px; margin: 0 auto; padding: 24px 14px 50px; }
        .tr-fullscreen { position: fixed; inset: 0; z-index: 9999; display: flex; flex-direction: column; gap: 8px; padding: max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left)); background: linear-gradient(180deg,#050914,#081428 55%,#0d1f3c); }
        .tr-hud { display: grid; grid-template-columns: repeat(4,1fr) auto; gap: 6px; align-items: center; flex-shrink: 0; }
        .tr-chip { border-radius: 14px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18); padding: 8px 10px; text-align: center; font-family: var(--font-nunito); font-weight: 1000; font-size: .82rem; line-height: 1.35; }
        .tr-exit { border: 0; border-radius: 14px; padding: 8px 14px; font-family: var(--font-nunito); font-weight: 1000; font-size: .9rem; background: linear-gradient(180deg,#fee2e2,#fb7185); color: #450a0a; box-shadow: 0 5px 0 #9f1239; cursor: pointer; touch-action: manipulation; white-space: nowrap; }
        .arena { position: relative; overflow: hidden; flex: 1; min-height: 0; border-radius: 24px; border: 4px solid rgba(255,216,102,.8); background: radial-gradient(circle at 50% 12%,rgba(126,200,227,.28),transparent 24%),linear-gradient(180deg,#173a72,#0d1f3c 62%,#071225); box-shadow: 0 28px 90px rgba(0,0,0,.38); touch-action: none; cursor: crosshair; user-select: none; -webkit-user-select: none; }
        .arena-preview { position: relative; overflow: hidden; height: min(62vh,580px); min-height: 380px; border-radius: 32px; border: 4px solid rgba(255,216,102,.8); background: radial-gradient(circle at 50% 12%,rgba(126,200,227,.28),transparent 24%),linear-gradient(180deg,#173a72,#0d1f3c 62%,#071225); box-shadow: 0 28px 90px rgba(0,0,0,.38); }
        .arena::before, .arena-preview::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px); background-size: 46px 46px; animation: tr-road 8s linear infinite; }
        .tr-player { position: absolute; transform: translate(-50%,-50%); width: 54px; height: 54px; border-radius: 20px; background: linear-gradient(180deg,#fff7ad,#fbbf24); border: 3px solid #fff; color: #3b2307; font-size: 1.8rem; display: grid; place-items: center; box-shadow: 0 0 30px rgba(251,191,36,.72); z-index: 3; pointer-events: none; }
        .tr-item { position: absolute; transform: translate(-50%,-50%); width: 42px; height: 42px; border-radius: 999px; font-family: var(--font-nunito); font-weight: 1000; display: grid; place-items: center; z-index: 2; pointer-events: none; }
        .tr-item.truth { background: radial-gradient(circle,#fff 0 18%,#fef08a 35%,#f59e0b 72%); color: #3b2307; box-shadow: 0 0 24px rgba(251,191,36,.8); }
        .tr-item.lie { background: linear-gradient(180deg,#111827,#020617); color: #cbd5e1; border: 2px dashed #64748b; box-shadow: 0 0 20px rgba(15,23,42,.9); }
        .tr-msg { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); z-index: 4; background: rgba(15,23,42,.88); border: 1px solid rgba(255,255,255,.2); border-radius: 18px; padding: 9px 18px; font-family: var(--font-nunito); font-weight: 1000; color: #fde68a; white-space: nowrap; max-width: calc(100% - 28px); text-align: center; pointer-events: none; font-size: .9rem; }
        .hud { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin: 14px 0; }
        .hud-card { border-radius: 18px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); padding: 10px; text-align: center; font-family: var(--font-nunito); font-weight: 1000; }
        @keyframes tr-road { from { background-position: 0 0; } to { background-position: 0 92px; } }
        @media (max-width: 680px) { .hud { grid-template-columns: repeat(2,1fr); } .tr-hud { grid-template-columns: repeat(2,1fr) auto; } .tr-chip:nth-child(3),.tr-chip:nth-child(4) { display: none; } }
      `}</style>

      {started ? (
        <div className="tr-fullscreen">
          <div className="tr-hud">
            <div className="tr-chip">{copy.score}<br />{score}</div>
            <div className="tr-chip">{copy.best}<br />{best}</div>
            <div className="tr-chip">{copy.lives}<br />{'❤️'.repeat(Math.max(0, lives)) || '—'}</div>
            <div className="tr-chip">{copy.time}<br />{seconds}s</div>
            <button className="tr-exit" type="button" onClick={exitGame}>✕ {copy.quit}</button>
          </div>

          <div
            className="arena"
            ref={arenaRef}
            aria-label={copy.title}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {isDone && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 6, display: 'grid', placeItems: 'center', padding: 18, background: 'rgba(5,9,20,.72)' }}>
                <div style={{ maxWidth: 560, width: '100%', textAlign: 'center', borderRadius: 28, padding: 26, background: 'rgba(255,255,255,.96)', color: '#0d1f3c', border: '3px solid #ffd866' }}>
                  <p className="puzzle-label">{copy.gameOver}</p>
                  <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '2rem', margin: '4px 0 10px' }}>{copy.score}: {score}</h2>
                  <div className="pull-quote" style={{ margin: '14px 0', textAlign: 'left' }}>
                    <p className="pq-text">&ldquo;{isRu ? currentWisdom.ru : currentWisdom.en}&rdquo;</p>
                    <span className="pq-ref">— {isRu ? currentWisdom.refRu : currentWisdom.refEn}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="pz-btn" style={{ width: 'auto', padding: '12px 24px' }} onClick={startGame}>{copy.restart}</button>
                    <Link className="pz-btn" style={{ width: 'auto', padding: '12px 24px', background: '#e2e8f0', color: '#0d1f3c', textDecoration: 'none' }} href="/games">{copy.choose}</Link>
                  </div>
                </div>
              </div>
            )}

            <div ref={playerElRef} className="tr-player" style={{ left: `${player.x}%`, top: `${player.y}%` }} aria-hidden="true">✦</div>
            {items.map((item) => (
              <div key={item.id} className={`tr-item ${item.kind}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-label={item.kind === 'truth' ? copy.truth : copy.lie}>
                {item.kind === 'truth' ? '✦' : '!'}
              </div>
            ))}
            {message && !isDone && <div className="tr-msg">{message}</div>}
          </div>
        </div>
      ) : (
        <div className="tr-shell">
          <Link href="/games" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {copy.back}</Link>
          <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 20 }}>{copy.eyebrow}</p>
          <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,7vw,4.2rem)', lineHeight: 1, marginBottom: 10 }}>{copy.title}</h1>
          <p style={{ maxWidth: 720, fontFamily: 'var(--font-lora)', color: 'rgba(255,255,255,.88)', fontWeight: 700, lineHeight: 1.7 }}>{copy.subtitle}</p>

          <div className="hud">
            <div className="hud-card">{copy.score}<br /><span>0</span></div>
            <div className="hud-card">{copy.best}<br /><span>{best}</span></div>
            <div className="hud-card">{copy.lives}<br /><span>❤️❤️❤️</span></div>
            <div className="hud-card">{copy.time}<br /><span>75s</span></div>
          </div>

          <div className="arena-preview">
            <div style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'grid', placeItems: 'center', padding: 18, background: 'rgba(5,9,20,.58)' }}>
              <div style={{ maxWidth: 560, textAlign: 'center', borderRadius: 28, padding: 26, background: 'rgba(255,255,255,.95)', color: '#0d1f3c', border: '3px solid #ffd866' }}>
                <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '1.8rem', marginBottom: 10 }}>{copy.how}</h2>
                <p style={{ fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.65 }}>{copy.howText}</p>
                <button className="pz-btn" style={{ width: 'auto', marginTop: 16, padding: '12px 28px' }} onClick={startGame}>{copy.start}</button>
              </div>
            </div>
          </div>

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14, marginTop: 18 }}>
            <div style={{ borderRadius: 22, padding: 18, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)' }}>
              <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#ffd866', marginBottom: 8 }}>{copy.reward}</h2>
              <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', lineHeight: 1.65 }}>&ldquo;{isRu ? currentWisdom.ru : currentWisdom.en}&rdquo;</p>
              <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#7ec8e3' }}>— {isRu ? currentWisdom.refRu : currentWisdom.refEn}</p>
            </div>
            <div style={{ borderRadius: 22, padding: 18, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)' }}>
              <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#ffd866', marginBottom: 8 }}>{isRu ? 'Сообщение' : 'Message'}</h2>
              <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.65 }}>{copy.leaderboard}</p>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
