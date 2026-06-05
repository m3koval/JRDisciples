'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type Level = {
  nameEn: string
  nameRu: string
  distance: number
  zoneStart: number
  zoneEnd: number
  speed: number
  wind: number
}

const LEVELS: Level[] = [
  { nameEn: 'Practice Field', nameRu: 'Поле тренировки', distance: 42, zoneStart: 42, zoneEnd: 58, speed: 2.2, wind: 0 },
  { nameEn: 'Valley Line', nameRu: 'Линия долины', distance: 55, zoneStart: 45, zoneEnd: 55, speed: 2.8, wind: -4 },
  { nameEn: 'Long Throw', nameRu: 'Дальний бросок', distance: 68, zoneStart: 47, zoneEnd: 53, speed: 3.4, wind: 5 },
]

const VERSE = {
  en: 'and that all this assembly may know that the LORD saves not with sword and spear. For the battle is the LORD’s, and he will give you into our hand.”',
  ru: 'и узнает весь этот сонм, что не мечом и копьем спасает Господь, ибо это война Господа, и Он предаст вас в руки наши.',
  refEn: '1 Samuel 17:47',
  refRu: '1 Царств 17:47',
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function scoreThrow(aim: number, level: Level): { result: 'perfect' | 'hit' | 'near' | 'miss'; points: number; flight: number } {
  const center = (level.zoneStart + level.zoneEnd) / 2
  const miss = Math.abs(aim + level.wind - center)
  if (miss <= 2) return { result: 'perfect', points: 100, flight: clamp(72 + level.distance * 0.18, 72, 86) }
  if (aim + level.wind >= level.zoneStart && aim + level.wind <= level.zoneEnd) return { result: 'hit', points: 60, flight: clamp(66 + level.distance * 0.14, 66, 80) }
  if (miss <= 12) return { result: 'near', points: 20, flight: clamp(48 + level.distance * 0.12, 48, 64) }
  return { result: 'miss', points: 0, flight: clamp(24 + level.distance * 0.08, 24, 42) }
}

export default function DavidSlingChallengePage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const [started, setStarted] = useState(false)
  const [aim, setAim] = useState(20)
  const [direction, setDirection] = useState(1)
  const [levelIndex, setLevelIndex] = useState(0)
  const [throwsLeft, setThrowsLeft] = useState(5)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [messageKey, setMessageKey] = useState<'ready' | 'perfect' | 'hit' | 'near' | 'miss' | 'done'>('ready')
  const [stoneFlight, setStoneFlight] = useState(0)
  const [showWisdom, setShowWisdom] = useState(false)
  const releaseLock = useRef(false)

  const level = LEVELS[levelIndex]
  const isDone = started && (throwsLeft <= 0 || levelIndex >= LEVELS.length)

  const copy = isRu ? {
    back: 'Все игры',
    eyebrow: 'Игра на точность',
    title: 'Праща Давида',
    subtitle: 'Раскрути пращу и отпусти камень в нужный момент. Победа — не в силе, а в доверии Господу.',
    start: 'Начать',
    release: 'Отпустить!',
    next: 'Следующий уровень',
    restart: 'Играть снова',
    score: 'Очки',
    best: 'Рекорд',
    throws: 'Броски',
    level: 'Уровень',
    wind: 'Ветер',
    target: 'Зелёная зона — лучший момент',
    ready: 'Следи за пращой. Нажми, когда метка в зелёной зоне.',
    perfect: 'Точно вовремя! Давид доверял Господу.',
    hit: 'Попадание! Хороший бросок.',
    near: 'Близко! Попробуй отпустить чуть точнее.',
    miss: 'Мимо. Не сдавайся — настройся и пробуй снова.',
    done: 'Раунд окончен. Открой мудрость и попробуй улучшить рекорд.',
    wisdomTitle: 'Библейская мудрость',
    how: 'Как играть',
    howText: 'На телефоне нажми большую кнопку “Отпустить”. На компьютере можно нажать кнопку или пробел. Чем ближе метка к зелёной зоне, тем лучше бросок.',
    childTruth: 'Главная истина: Бог сильнее страха. Давид не хвалился собой — он доверял Господу.',
  } : {
    back: 'All Games',
    eyebrow: 'Timing Game',
    title: 'David Sling Challenge',
    subtitle: 'Swing the sling and release the stone at the right moment. The win is not brute strength — it is trusting the Lord.',
    start: 'Start',
    release: 'Release!',
    next: 'Next Level',
    restart: 'Play Again',
    score: 'Score',
    best: 'Best',
    throws: 'Throws',
    level: 'Level',
    wind: 'Wind',
    target: 'Green zone = best timing',
    ready: 'Watch the sling. Release when the marker is in the green zone.',
    perfect: 'Perfect timing! David trusted the Lord.',
    hit: 'Hit! Strong timing.',
    near: 'Close! Release a little more carefully.',
    miss: 'Miss. Do not quit — reset and try again.',
    done: 'Round complete. Unlock the wisdom and try to beat your best.',
    wisdomTitle: 'Bible Wisdom',
    how: 'How to play',
    howText: 'On mobile, tap the big Release button. On desktop, click it or press Space. The closer the marker lands in the green zone, the better the throw.',
    childTruth: 'Big truth: God is stronger than fear. David was not bragging in himself — he trusted the Lord.',
  }

  const message = copy[messageKey]
  const slingRotation = useMemo(() => -75 + aim * 1.5, [aim])

  useEffect(() => {
    const stored = Number(localStorage.getItem('david-sling-best') || '0')
    setBest(Number.isFinite(stored) ? stored : 0)
  }, [])

  useEffect(() => {
    if (!started || isDone) return
    const tick = window.setInterval(() => {
      setAim((value) => {
        let next = value + direction * level.speed
        if (next >= 100) {
          next = 100
          setDirection(-1)
        }
        if (next <= 0) {
          next = 0
          setDirection(1)
        }
        return next
      })
    }, 28)
    return () => window.clearInterval(tick)
  }, [started, isDone, direction, level.speed])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        releaseStone()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    if (!isDone) return
    setMessageKey('done')
    setShowWisdom(true)
    setBest((prev) => {
      const next = Math.max(prev, score)
      localStorage.setItem('david-sling-best', String(next))
      return next
    })
  }, [isDone, score])

  function startGame() {
    setStarted(true)
    setAim(20)
    setDirection(1)
    setLevelIndex(0)
    setThrowsLeft(5)
    setScore(0)
    setMessageKey('ready')
    setStoneFlight(0)
    setShowWisdom(false)
    releaseLock.current = false
  }

  function releaseStone() {
    if (!started || isDone || releaseLock.current) return
    releaseLock.current = true
    const throwResult = scoreThrow(aim, level)
    setStoneFlight(throwResult.flight)
    setScore((current) => current + throwResult.points)
    setThrowsLeft((current) => Math.max(0, current - 1))
    setMessageKey(throwResult.result)
    if (throwResult.result === 'perfect' || throwResult.result === 'hit') {
      setShowWisdom(true)
    }
    window.setTimeout(() => {
      setStoneFlight(0)
      if (throwResult.result === 'perfect' || throwResult.result === 'hit') {
        setLevelIndex((current) => Math.min(LEVELS.length, current + 1))
      }
      setAim(20)
      setDirection(1)
      releaseLock.current = false
    }, 850)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#071225,#0d1f3c 58%,#f8fafc)', color: '#fff' }}>
      <style>{`
        .sling-wrap { max-width: 1120px; margin: 0 auto; padding: 24px 14px 54px; }
        .sling-grid { display: grid; grid-template-columns: minmax(0,1.25fr) minmax(280px,.75fr); gap: 18px; align-items: stretch; }
        .sling-arena { position: relative; min-height: 560px; overflow: hidden; border-radius: 34px; border: 4px solid rgba(255,216,102,.82); background: linear-gradient(180deg,#7ec8e3 0%,#dbeafe 35%,#a7d477 36%,#3b7a2a 100%); box-shadow: 0 28px 90px rgba(0,0,0,.35); touch-action: manipulation; }
        .sling-arena::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 18% 18%,rgba(255,255,255,.65),transparent 13%),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px); background-size: auto,48px 48px; pointer-events: none; }
        .david { position: absolute; left: 12%; bottom: 11%; width: 98px; height: 138px; border-radius: 48px 48px 30px 30px; background: linear-gradient(180deg,#f6c37a 0 28%,#f97316 29% 72%,#7c2d12 73%); border: 4px solid rgba(255,255,255,.8); box-shadow: 0 16px 36px rgba(0,0,0,.28); display: grid; place-items: start center; font-size: 2rem; padding-top: 12px; z-index: 3; }
        .giant-target { position: absolute; right: 8%; bottom: 15%; width: 138px; height: 214px; border-radius: 70px 70px 28px 28px; background: linear-gradient(180deg,#475569,#1e293b); border: 5px solid #cbd5e1; box-shadow: 0 24px 60px rgba(0,0,0,.34); display: grid; place-items: center; font-family: var(--font-nunito); font-weight: 1000; text-align: center; color: #fff; z-index: 2; }
        .giant-target::before { content: ''; width: 86px; height: 86px; border-radius: 999px; background: radial-gradient(circle,#fef2f2 0 18%,#ef4444 19% 35%,#fff 36% 53%,#ef4444 54% 100%); box-shadow: inset 0 0 0 4px rgba(0,0,0,.08); }
        .sling { position: absolute; left: calc(12% + 48px); bottom: calc(11% + 92px); width: 130px; height: 6px; transform-origin: left center; border-radius: 999px; background: #713f12; box-shadow: 0 0 0 2px rgba(255,255,255,.35); z-index: 4; transition: transform .04s linear; }
        .sling::after { content: '●'; position: absolute; right: -10px; top: -18px; color: #57534e; font-size: 34px; text-shadow: 0 2px 0 #fff; }
        .stone { position: absolute; left: 18%; bottom: 38%; width: 24px; height: 24px; border-radius: 999px; background: #57534e; border: 3px solid #e7e5e4; box-shadow: 0 8px 20px rgba(0,0,0,.34); transform: translateX(calc(var(--flight) * 1%)) translateY(calc(var(--arc) * -1px)); opacity: var(--visible); transition: transform .72s cubic-bezier(.2,.7,.2,1), opacity .18s; z-index: 5; }
        .meter { position: relative; overflow: hidden; height: 34px; border-radius: 999px; background: rgba(15,23,42,.9); border: 2px solid rgba(255,255,255,.5); margin-top: 12px; }
        .zone { position: absolute; top: 0; bottom: 0; background: linear-gradient(180deg,#86efac,#22c55e); box-shadow: 0 0 24px rgba(34,197,94,.8); }
        .marker { position: absolute; top: -8px; width: 8px; height: 50px; border-radius: 999px; background: #f97316; box-shadow: 0 0 18px rgba(249,115,22,.9); transform: translateX(-50%); }
        .sling-card { border-radius: 26px; padding: 18px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); box-shadow: 0 20px 60px rgba(0,0,0,.2); }
        .sling-stat { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin: 14px 0; }
        .sling-stat div { border-radius: 16px; padding: 9px; background: rgba(15,23,42,.78); border: 1px solid rgba(255,255,255,.18); text-align: center; font-family: var(--font-nunito); font-weight: 1000; }
        @media (max-width: 860px) { .sling-grid { grid-template-columns: 1fr; } .sling-arena { min-height: 460px; } .giant-target { width: 102px; height: 164px; right: 5%; } .david { width: 78px; height: 116px; } .sling { width: 94px; } .sling-stat { grid-template-columns: repeat(2,1fr); } }
      `}</style>

      <div className="sling-wrap">
        <Link href="/games" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {copy.back}</Link>
        <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 20 }}>{copy.eyebrow}</p>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2.15rem,7vw,4.4rem)', lineHeight: 1, margin: '6px 0 12px' }}>{copy.title}</h1>
        <p style={{ maxWidth: 780, fontFamily: 'var(--font-lora)', color: 'rgba(255,255,255,.9)', fontWeight: 700, lineHeight: 1.7 }}>{copy.subtitle}</p>

        <div className="sling-stat">
          <div>{copy.score}<br />{score}</div>
          <div>{copy.best}<br />{best}</div>
          <div>{copy.throws}<br />{throwsLeft}</div>
          <div>{copy.level}<br />{Math.min(levelIndex + 1, LEVELS.length)}/{LEVELS.length}</div>
        </div>

        <section className="sling-grid">
          <div className="sling-arena" aria-label={copy.title}>
            <div className="david" aria-hidden="true">👦</div>
            <div className="sling" style={{ transform: `rotate(${slingRotation}deg)` }} aria-hidden="true" />
            <div className="stone" style={{ ['--flight' as string]: stoneFlight, ['--arc' as string]: stoneFlight > 0 ? 110 : 0, ['--visible' as string]: stoneFlight > 0 ? 1 : 0 }} aria-hidden="true" />
            <div className="giant-target" aria-hidden="true" />
          </div>

          <aside className="sling-card">
            <p className="puzzle-label" style={{ color: '#ffd866' }}>{isRu ? level.nameRu : level.nameEn}</p>
            <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '1.35rem', color: '#fff', marginBottom: 8 }}>{copy.target}</h2>
            <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.65, color: 'rgba(255,255,255,.88)', fontWeight: 700 }}>{message}</p>
            <p style={{ marginTop: 8, fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#bfdbfe' }}>{copy.wind}: {level.wind > 0 ? `+${level.wind}` : level.wind}</p>

            <div className="meter" aria-label={copy.target}>
              <span className="zone" style={{ left: `${level.zoneStart}%`, width: `${level.zoneEnd - level.zoneStart}%` }} />
              <span className="marker" style={{ left: `${aim}%` }} />
            </div>

            <button className="pz-btn" style={{ marginTop: 16, width: '100%', minHeight: 58, fontSize: '1.05rem' }} onClick={started ? releaseStone : startGame}>
              {started && !isDone ? copy.release : copy.start}
            </button>

            {isDone && (
              <button className="pz-btn" style={{ marginTop: 10, width: '100%', minHeight: 52, background: '#e2e8f0', color: '#0d1f3c' }} onClick={startGame}>{copy.restart}</button>
            )}

            <div style={{ marginTop: 16, borderRadius: 20, padding: 14, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.16)' }}>
              <h3 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#ffd866', marginBottom: 6 }}>{copy.how}</h3>
              <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.58, color: 'rgba(255,255,255,.88)', fontSize: '.95rem' }}>{copy.howText}</p>
            </div>
          </aside>
        </section>

        <section style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          <div className="sling-card">
            <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#ffd866', marginBottom: 8 }}>{copy.wisdomTitle}</h2>
            <div className="pull-quote" style={{ margin: 0, opacity: showWisdom ? 1 : .72 }}>
              <p className="pq-text">&ldquo;{isRu ? VERSE.ru : VERSE.en}&rdquo;</p>
              <span className="pq-ref">— {isRu ? VERSE.refRu : VERSE.refEn}</span>
            </div>
          </div>
          <div className="sling-card">
            <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#ffd866', marginBottom: 8 }}>{isRu ? 'Главная мысль' : 'Big Truth'}</h2>
            <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.65, color: 'rgba(255,255,255,.9)', fontWeight: 700 }}>{copy.childTruth}</p>
          </div>
        </section>
      </div>
    </main>
  )
}
