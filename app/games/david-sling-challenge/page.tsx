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

  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)]
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
    howText: 'Следи за вращением пращи. Нажми “Отпустить”, когда метка и дуга показывают лучший момент. На компьютере можно нажать кнопку или пробел.',
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
    howText: 'Watch the sling rotation. Press Release when the marker and arc show the best moment. On desktop, click the button or press Space.',
    childTruth: 'Big truth: God is stronger than fear. David was not bragging in himself — he trusted the Lord.',
  }

  const message = copy[messageKey]
  const slingRotation = useMemo(() => -75 + aim * 1.5, [aim])
  const resultClass = messageKey === 'perfect' || messageKey === 'hit' ? 'is-hit' : messageKey === 'near' ? 'is-near' : messageKey === 'miss' ? 'is-miss' : ''

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
        .sling-arena { position: relative; min-height: 560px; overflow: hidden; border-radius: 34px; border: 4px solid rgba(255,216,102,.82); background: linear-gradient(180deg,#27a7f4 0%,#8bd6ff 30%,#c8f2ff 46%,#d7b26a 47%,#70a83a 68%,#24551d 100%); box-shadow: 0 28px 90px rgba(0,0,0,.35); touch-action: manipulation; isolation: isolate; }
        .sling-arena::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 15% 13%,rgba(255,255,255,.72),transparent 11%),radial-gradient(circle at 68% 22%,rgba(255,216,102,.2),transparent 20%),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px); background-size: auto,auto,50px 50px; pointer-events: none; z-index: 0; }
        .sling-arena::after { content: ''; position: absolute; left: -8%; right: -8%; bottom: 0; height: 36%; background: radial-gradient(ellipse at 20% 100%,#376f25 0 28%,transparent 29%),radial-gradient(ellipse at 72% 100%,#4b7f2a 0 30%,transparent 31%),linear-gradient(180deg,rgba(189,142,64,.18),#4f8c30 30%,#24551d 78%,#163414); z-index: 0; }
        .mountains { position: absolute; inset: auto 0 31% 0; height: 33%; background: linear-gradient(135deg,transparent 0 22%,rgba(142,112,63,.78) 23% 41%,transparent 42%),linear-gradient(225deg,transparent 0 17%,rgba(76,120,80,.74) 18% 39%,transparent 40%),linear-gradient(180deg,transparent 0 58%,rgba(73,104,59,.32) 59%); opacity: .88; z-index: 0; }
        .cloud { position: absolute; top: 10%; width: 122px; height: 38px; border-radius: 999px; background: rgba(255,255,255,.9); filter: blur(.1px); box-shadow: 28px -14px 0 6px rgba(255,255,255,.74),64px 3px 0 1px rgba(255,255,255,.68),92px -4px 0 -3px rgba(255,255,255,.55); z-index: 1; }
        .cloud.one { left: 9%; } .cloud.two { right: 14%; top: 18%; transform: scale(.9); opacity: .82; }
        .block-ledge { position: absolute; left: 4%; bottom: 7%; width: 188px; height: 58px; z-index: 2; background: linear-gradient(180deg,#f8d98b,#c69138); border-radius: 12px; box-shadow: inset 0 0 0 3px rgba(255,255,255,.34),0 16px 34px rgba(0,0,0,.22); }
        .block-ledge::before { content: ''; position: absolute; inset: -22px 18px auto 24px; height: 34px; border-radius: 10px; background: linear-gradient(180deg,#ffe5a3,#d8a34b); box-shadow: 52px 8px 0 #c88f31,104px -3px 0 #f4c967; }
        .toy-blocks { position: absolute; right: 2%; bottom: 5%; width: 184px; height: 88px; z-index: 2; background: linear-gradient(90deg,#61b13e 0 24%,transparent 25% 36%,#dc3f32 37% 50%,transparent 51% 61%,#f2c94c 62% 76%,transparent 77%); opacity: .9; filter: drop-shadow(0 12px 16px rgba(0,0,0,.18)); }
        .valley-river { position: absolute; left: 35%; right: 28%; bottom: 27%; height: 28px; border-radius: 999px; background: linear-gradient(90deg,#38bdf8,#e0f2fe,#0ea5e9); transform: rotate(-8deg); box-shadow: 0 0 20px rgba(56,189,248,.48); z-index: 1; }
        .crowd { position: absolute; left: 1%; right: 1%; bottom: 28%; height: 42px; z-index: 2; opacity: .78; background: radial-gradient(circle at 9% 55%,#5b3418 0 3px,transparent 4px),radial-gradient(circle at 16% 45%,#8b5a2b 0 3px,transparent 4px),radial-gradient(circle at 24% 60%,#5b3418 0 3px,transparent 4px),radial-gradient(circle at 73% 48%,#5b3418 0 3px,transparent 4px),radial-gradient(circle at 81% 60%,#8b5a2b 0 3px,transparent 4px),radial-gradient(circle at 90% 50%,#5b3418 0 3px,transparent 4px); }
        .david { position: absolute; left: 10%; bottom: 12%; width: 130px; height: 178px; z-index: 5; filter: drop-shadow(0 18px 20px rgba(0,0,0,.24)); }
        .david .head { position: absolute; left: 34px; top: 0; width: 64px; height: 66px; border-radius: 50% 50% 45% 45%; background: radial-gradient(circle at 34% 32%,#ffe3b1,#f6b86f 72%); border: 3px solid rgba(255,255,255,.8); box-shadow: inset -8px -8px 0 rgba(196,93,37,.12); }
        .david .hair { position: absolute; left: 25px; top: -8px; width: 78px; height: 50px; border-radius: 42px 42px 22px 22px; background: radial-gradient(circle at 19% 40%,#5b3418 0 11px,transparent 12px),radial-gradient(circle at 41% 24%,#6b3f20 0 14px,transparent 15px),radial-gradient(circle at 63% 35%,#4b2b16 0 13px,transparent 14px),#5b3418; }
        .david .face { position: absolute; left: 50px; top: 25px; width: 38px; height: 22px; border-radius: 999px; background: radial-gradient(circle at 28% 36%,#1f2937 0 2px,transparent 3px),radial-gradient(circle at 70% 36%,#1f2937 0 2px,transparent 3px); }
        .david .face::after { content: ''; position: absolute; left: 10px; top: 12px; width: 18px; height: 8px; border-bottom: 3px solid #7c2d12; border-radius: 999px; }
        .david .body { position: absolute; left: 28px; top: 59px; width: 74px; height: 84px; border-radius: 28px 28px 18px 18px; background: linear-gradient(180deg,#6fbf5b,#388b3b); border: 3px solid rgba(255,255,255,.72); box-shadow: inset -10px -14px 0 rgba(20,83,45,.2); }
        .david .strap { position: absolute; left: 34px; top: 64px; width: 78px; height: 9px; border-radius: 999px; background: #7c3f16; transform: rotate(56deg); z-index: 2; }
        .david .arm { position: absolute; width: 46px; height: 15px; border-radius: 999px; background: #f6b86f; border: 2px solid rgba(255,255,255,.6); transform-origin: right center; }
        .david .arm.left { left: 1px; top: 78px; transform: rotate(-30deg); }
        .david .arm.right { right: 4px; top: 81px; transform: rotate(24deg); }
        .david .leg { position: absolute; width: 20px; height: 60px; top: 132px; border-radius: 12px; background: linear-gradient(180deg,#f6b86f 0 46%,#7c2d12 47%); }
        .david .leg.left { left: 36px; transform: rotate(14deg); } .david .leg.right { right: 34px; transform: rotate(-12deg); }
        .david::after { content: ''; position: absolute; left: 16px; right: 10px; bottom: -12px; height: 18px; border-radius: 999px; background: rgba(15,23,42,.22); filter: blur(3px); }
        .trajectory { position: absolute; left: 20%; bottom: 31%; width: 56%; height: 46%; overflow: visible; pointer-events: none; z-index: 3; opacity: .74; }
        .trajectory path { fill: none; stroke: rgba(255,255,255,.82); stroke-width: 5; stroke-linecap: round; stroke-dasharray: 10 13; filter: drop-shadow(0 0 9px rgba(255,216,102,.72)); }
        .trajectory .arc-glow { stroke: rgba(251,191,36,.35); stroke-width: 12; stroke-dasharray: none; }
        .sling-orbit { position: absolute; left: calc(11% + 34px); bottom: calc(10% + 78px); width: 96px; height: 96px; border-radius: 999px; border: 3px dashed rgba(255,255,255,.75); box-shadow: 0 0 0 8px rgba(255,216,102,.1),0 0 28px rgba(255,216,102,.42); z-index: 6; }
        .sling { position: absolute; left: calc(11% + 82px); bottom: calc(10% + 126px); width: 118px; height: 6px; transform-origin: left center; border-radius: 999px; background: linear-gradient(90deg,#78350f,#facc15 76%,#78350f); box-shadow: 0 0 0 2px rgba(255,255,255,.35),0 0 22px rgba(250,204,21,.48); z-index: 7; transition: transform .04s linear; }
        .sling::after { content: '●'; position: absolute; right: -10px; top: -18px; color: #57534e; font-size: 34px; text-shadow: 0 2px 0 #fff,0 0 16px rgba(255,255,255,.7); }
        .stone { position: absolute; left: 20%; bottom: 39%; width: 25px; height: 25px; border-radius: 999px; background: radial-gradient(circle at 35% 28%,#a8a29e,#57534e 68%); border: 3px solid #e7e5e4; box-shadow: 0 8px 20px rgba(0,0,0,.34),0 0 18px rgba(255,255,255,.52); transform: translateX(calc(var(--flight) * 1%)) translateY(calc(var(--arc) * -1px)); opacity: var(--visible); transition: transform .72s cubic-bezier(.2,.7,.2,1), opacity .18s; z-index: 8; }
        .impact { position: absolute; right: 12%; bottom: 45%; width: 108px; height: 108px; border-radius: 999px; background: radial-gradient(circle,rgba(254,240,138,.95) 0 12%,rgba(251,191,36,.65) 13% 34%,transparent 35%); opacity: 0; transform: scale(.7); z-index: 6; pointer-events: none; }
        .sling-arena.is-hit .impact { animation: impact-pop .8s ease-out; }
        .sling-arena.is-near .impact { animation: near-pop .7s ease-out; }
        .sling-arena.is-miss .trajectory { opacity: .38; }
        .giant-target { position: absolute; right: 6%; bottom: 12%; width: 190px; height: 294px; z-index: 4; filter: drop-shadow(0 28px 28px rgba(0,0,0,.28)); }
        .giant-target .spear { position: absolute; left: 38px; top: 14px; width: 9px; height: 240px; border-radius: 999px; background: linear-gradient(90deg,#5b3418,#a16207,#5b3418); transform: rotate(-6deg); z-index: 0; }
        .giant-target .spear::before { content: ''; position: absolute; left: -13px; top: -28px; width: 35px; height: 45px; clip-path: polygon(50% 0,100% 70%,52% 100%,0 70%); background: linear-gradient(135deg,#f8fafc,#94a3b8); border-radius: 8px; }
        .giant-target .giant-head { position: absolute; left: 68px; top: 0; width: 78px; height: 78px; border-radius: 50% 50% 44% 44%; background: radial-gradient(circle at 38% 30%,#ffd6a4,#c46a3a 72%); border: 4px solid rgba(255,255,255,.55); box-shadow: inset -10px -8px 0 rgba(120,53,15,.18); }
        .giant-target .helmet { position: absolute; left: 58px; top: -10px; width: 98px; height: 44px; border-radius: 48px 48px 12px 12px; background: linear-gradient(180deg,#fde68a,#a16207); border: 3px solid rgba(255,255,255,.55); }
        .giant-target .helmet::after { content: ''; position: absolute; left: 40px; top: -18px; width: 24px; height: 28px; border-radius: 14px 14px 4px 4px; background: linear-gradient(180deg,#f97316,#7c2d12); }
        .giant-target .beard { position: absolute; left: 74px; top: 48px; width: 66px; height: 55px; border-radius: 18px 18px 32px 32px; background: radial-gradient(circle at 28% 20%,#3b2415 0 10px,transparent 11px),radial-gradient(circle at 55% 24%,#4b2b16 0 12px,transparent 13px),#3b2415; }
        .giant-target .giant-face { position: absolute; left: 82px; top: 31px; width: 48px; height: 24px; background: radial-gradient(circle at 28% 40%,#111827 0 3px,transparent 4px),radial-gradient(circle at 72% 40%,#111827 0 3px,transparent 4px); z-index: 2; }
        .giant-target .armor { position: absolute; left: 45px; top: 78px; width: 114px; height: 136px; border-radius: 44px 44px 20px 20px; background: repeating-linear-gradient(0deg,#7c5b2f 0 15px,#9f7436 16px 29px); border: 4px solid rgba(255,229,166,.74); box-shadow: inset -12px -18px 0 rgba(68,38,12,.18); }
        .giant-target .armor::before { content: ''; position: absolute; left: -24px; top: 36px; width: 164px; height: 20px; border-radius: 999px; background: rgba(104,65,27,.95); }
        .giant-target .shield { position: absolute; right: -4px; top: 92px; width: 102px; height: 126px; border-radius: 50%; background: radial-gradient(circle,#facc15 0 13%,#8b5a2b 14% 43%,#d6a75f 44% 49%,#6b3f20 50% 100%); border: 6px solid #fef3c7; box-shadow: inset 0 0 0 6px rgba(120,53,15,.55),0 18px 32px rgba(0,0,0,.24); z-index: 4; }
        .giant-target .legs { position: absolute; left: 61px; right: 26px; bottom: 0; height: 88px; background: linear-gradient(90deg,#7c2d12 0 32%,transparent 33% 58%,#7c2d12 59%); border-radius: 18px; }
        .giant-target::after { content: ''; position: absolute; left: 20px; right: 10px; bottom: -14px; height: 22px; border-radius: 999px; background: rgba(15,23,42,.24); filter: blur(5px); }
        .meter { position: relative; overflow: hidden; height: 34px; border-radius: 999px; background: rgba(15,23,42,.9); border: 2px solid rgba(255,255,255,.5); margin-top: 12px; }
        .zone { position: absolute; top: 0; bottom: 0; background: linear-gradient(180deg,#bbf7d0,#22c55e); box-shadow: 0 0 24px rgba(34,197,94,.8); }
        .marker { position: absolute; top: -8px; width: 8px; height: 50px; border-radius: 999px; background: #f97316; box-shadow: 0 0 18px rgba(249,115,22,.9); transform: translateX(-50%); }
        .sling-card { border-radius: 26px; padding: 18px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); box-shadow: 0 20px 60px rgba(0,0,0,.2); }
        .sling-stat { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin: 14px 0; }
        .sling-stat div { border-radius: 16px; padding: 9px; background: rgba(15,23,42,.78); border: 1px solid rgba(255,255,255,.18); text-align: center; font-family: var(--font-nunito); font-weight: 1000; }
        @keyframes impact-pop { 0% { opacity: 0; transform: scale(.55); } 18% { opacity: 1; transform: scale(1.08); } 100% { opacity: 0; transform: scale(1.45); } }
        @keyframes near-pop { 0% { opacity: 0; transform: scale(.45); } 22% { opacity: .72; transform: scale(.88); } 100% { opacity: 0; transform: scale(1.18); } }
        @media (max-width: 860px) { .sling-grid { grid-template-columns: 1fr; } .sling-arena { min-height: 470px; } .giant-target { right: -1%; bottom: 10%; transform: scale(.72); transform-origin: right bottom; } .david { left: 5%; bottom: 12%; transform: scale(.74); transform-origin: left bottom; } .block-ledge { left: 2%; bottom: 7%; transform: scale(.74); transform-origin: left bottom; } .toy-blocks { opacity: .54; transform: scale(.7); transform-origin: right bottom; } .crowd { bottom: 31%; } .sling-orbit { left: calc(5% + 25px); bottom: calc(12% + 62px); width: 76px; height: 76px; } .sling { left: calc(5% + 63px); bottom: calc(12% + 100px); width: 92px; } .trajectory { left: 18%; width: 58%; bottom: 34%; } .sling-stat { grid-template-columns: repeat(2,1fr); } }
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
          <div className={`sling-arena ${resultClass}`} aria-label={copy.title}>
            <div className="mountains" aria-hidden="true" />
            <div className="valley-river" aria-hidden="true" />
            <div className="crowd" aria-hidden="true" />
            <div className="block-ledge" aria-hidden="true" />
            <div className="toy-blocks" aria-hidden="true" />
            <div className="cloud one" aria-hidden="true" />
            <div className="cloud two" aria-hidden="true" />
            <svg className="trajectory" viewBox="0 0 520 260" aria-hidden="true">
              <path className="arc-glow" d="M12 218 C 158 42, 336 34, 506 170" />
              <path d="M12 218 C 158 42, 336 34, 506 170" />
            </svg>
            <div className="david" aria-hidden="true">
              <span className="hair" />
              <span className="head" />
              <span className="face" />
              <span className="body" />
              <span className="strap" />
              <span className="arm left" />
              <span className="arm right" />
              <span className="leg left" />
              <span className="leg right" />
            </div>
            <div className="sling-orbit" aria-hidden="true" />
            <div className="sling" style={{ transform: `rotate(${slingRotation}deg)` }} aria-hidden="true" />
            <div className="stone" style={{ ['--flight' as string]: stoneFlight, ['--arc' as string]: stoneFlight > 0 ? 116 : 0, ['--visible' as string]: stoneFlight > 0 ? 1 : 0 }} aria-hidden="true" />
            <div className="impact" aria-hidden="true" />
            <div className="giant-target" aria-hidden="true">
              <span className="spear" />
              <span className="giant-head" />
              <span className="helmet" />
              <span className="beard" />
              <span className="giant-face" />
              <span className="armor" />
              <span className="shield" />
              <span className="legs" />
            </div>
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
