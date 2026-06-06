'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type Phase = 'intro' | 'briefing' | 'play' | 'reward' | 'complete' | 'paused'
type Environment = 'meadow' | 'bridge' | 'storm'
type Helper = 'rosie' | 'joseph' | 'gracie'
type Point = { x: number; y: number }
type Orb = Point & { id: number; found: boolean }
type Hazard = Point & { id: number; r: number; kind: 'fog' | 'splash' | 'gust' }
type Level = {
  id: string
  helper: Helper
  environment: Environment
  titleEn: string
  titleRu: string
  missionEn: string
  missionRu: string
  gospelEn: string
  gospelRu: string
  refEn: string
  refRu: string
  scriptureEn: string
  scriptureRu: string
  orbs: Orb[]
  hazards: Hazard[]
  lambStart: Point
  gate: Point
  requiredLight: number
}

const STORAGE_KEY = 'shepherd-light-adventure-best'

const LEVELS: Level[] = [
  {
    id: 'lost-lamb',
    helper: 'rosie',
    environment: 'meadow',
    titleEn: 'Trail 1: The Lost Lamb',
    titleRu: 'Тропа 1: Потерянный ягненок',
    missionEn: 'Gather Shepherd Light, clear the gentle fog, and guide the lamb home.',
    missionRu: 'Собери Свет Пастыря, очисти мягкий туман и приведи ягненка домой.',
    gospelEn: 'Jesus came to seek and to save the lost. He does not leave His sheep alone.',
    gospelRu: 'Иисус пришел взыскать и спасти погибшее. Он не оставляет Своих овец одних.',
    refEn: 'Luke 19:10',
    refRu: 'Луки 19:10',
    scriptureEn: 'For the Son of Man came to seek and to save the lost.',
    scriptureRu: 'ибо Сын Человеческий пришел взыскать и спасти погибшее.',
    requiredLight: 5,
    lambStart: { x: 76, y: 24 },
    gate: { x: 18, y: 86 },
    orbs: [
      { id: 1, x: 22, y: 26, found: false }, { id: 2, x: 44, y: 18, found: false }, { id: 3, x: 62, y: 38, found: false },
      { id: 4, x: 50, y: 62, found: false }, { id: 5, x: 30, y: 72, found: false },
    ],
    hazards: [{ id: 1, x: 45, y: 42, r: 9, kind: 'fog' }, { id: 2, x: 72, y: 58, r: 8, kind: 'fog' }],
  },
  {
    id: 'gift-bridge',
    helper: 'joseph',
    environment: 'bridge',
    titleEn: 'Trail 2: The Gift Bridge',
    titleRu: 'Тропа 2: Мост дара',
    missionEn: 'Find the stepping stones, keep the lamb close, and cross by the gift of light.',
    missionRu: 'Найди камни перехода, держи ягненка рядом и перейди по дару света.',
    gospelEn: 'God’s rescue is a gift. We receive it by trusting Jesus, not by earning enough stars.',
    gospelRu: 'Божье спасение — дар. Мы принимаем его, доверяя Иисусу, а не зарабатывая звезды.',
    refEn: 'John 3:16',
    refRu: 'Иоанна 3:16',
    scriptureEn: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
    scriptureRu: 'Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него, не погиб, но имел жизнь вечную.',
    requiredLight: 6,
    lambStart: { x: 80, y: 78 },
    gate: { x: 18, y: 18 },
    orbs: [
      { id: 1, x: 28, y: 74, found: false }, { id: 2, x: 40, y: 58, found: false }, { id: 3, x: 55, y: 46, found: false },
      { id: 4, x: 68, y: 34, found: false }, { id: 5, x: 46, y: 28, found: false }, { id: 6, x: 25, y: 38, found: false },
    ],
    hazards: [{ id: 1, x: 39, y: 41, r: 8, kind: 'splash' }, { id: 2, x: 62, y: 61, r: 9, kind: 'splash' }, { id: 3, x: 75, y: 48, r: 7, kind: 'splash' }],
  },
  {
    id: 'good-shepherd',
    helper: 'gracie',
    environment: 'storm',
    titleEn: 'Trail 3: The Good Shepherd',
    titleRu: 'Тропа 3: Добрый Пастырь',
    missionEn: 'Hold the lantern through warm storm winds and follow the Shepherd’s voice.',
    missionRu: 'Сохрани фонарь в теплом ветре и следуй голосу Пастыря.',
    gospelEn: 'Jesus is the Good Shepherd. He lays down His life for His sheep and leads them home.',
    gospelRu: 'Иисус — Добрый Пастырь. Он полагает жизнь за овец и ведет их домой.',
    refEn: 'John 10:11',
    refRu: 'Иоанна 10:11',
    scriptureEn: 'I am the good shepherd. The good shepherd lays down his life for the sheep.',
    scriptureRu: 'Я есмь пастырь добрый: пастырь добрый полагает жизнь свою за овец.',
    requiredLight: 7,
    lambStart: { x: 82, y: 48 },
    gate: { x: 16, y: 54 },
    orbs: [
      { id: 1, x: 24, y: 24, found: false }, { id: 2, x: 40, y: 32, found: false }, { id: 3, x: 58, y: 24, found: false },
      { id: 4, x: 72, y: 42, found: false }, { id: 5, x: 62, y: 62, found: false }, { id: 6, x: 42, y: 74, found: false }, { id: 7, x: 24, y: 64, found: false },
    ],
    hazards: [{ id: 1, x: 44, y: 50, r: 9, kind: 'gust' }, { id: 2, x: 66, y: 70, r: 8, kind: 'gust' }, { id: 3, x: 75, y: 28, r: 7, kind: 'gust' }],
  },
]

const helperMeta = {
  rosie: { emoji: '📖', en: 'Rosie Bible Glow', ru: 'Свет Библии Рози' },
  joseph: { emoji: '🗺️', en: 'Joseph Map Marks', ru: 'Метки карты Йосика' },
  gracie: { emoji: '🌧️', en: 'Gracie Cloak Shield', ru: 'Плащ Грейси' },
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function dist(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function moveToward(from: Point, to: Point, speed: number) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const d = Math.hypot(dx, dy)
  if (d < speed || d === 0) return to
  return { x: from.x + (dx / d) * speed, y: from.y + (dy / d) * speed }
}

export default function ShepherdLightAdventurePage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const arenaRef = useRef<HTMLDivElement | null>(null)
  const keys = useRef<Record<string, boolean>>({})
  const pointer = useRef<Point & { active: boolean }>({ x: 18, y: 82, active: false })
  const levelStartedAt = useRef(0)

  const [phase, setPhase] = useState<Phase>('intro')
  const [levelIndex, setLevelIndex] = useState(0)
  const [player, setPlayer] = useState<Point>({ x: 18, y: 82 })
  const [lamb, setLamb] = useState<Point>(LEVELS[0].lambStart)
  const [orbs, setOrbs] = useState<Orb[]>(LEVELS[0].orbs)

  const [lanternWide, setLanternWide] = useState(false)
  const [helperReady, setHelperReady] = useState(true)
  const [helperActive, setHelperActive] = useState(false)
  const [message, setMessage] = useState('')
  const [best, setBest] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [rescued, setRescued] = useState(0)
  const [spark, setSpark] = useState(0)
  const [calmMode, setCalmMode] = useState(false)

  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)]
  const helper = helperMeta[level.helper]
  const foundLight = orbs.filter((orb) => orb.found).length
  const canGuide = foundLight >= level.requiredLight
  const lambNear = dist(player, lamb) < (lanternWide || helperActive ? 21 : 14)
  const gateNear = dist(lamb, level.gate) < 8 && dist(player, level.gate) < 12
  const progress = Math.round((foundLight / level.requiredLight) * 100)

  const copy = isRu ? {
    back: 'Все игры', eyebrow: 'Евангельское приключение', title: 'Приключение Света Пастыря',
    subtitle: 'Это не викторина. Веди Михаила, неси свет Божьего Слова, помогай ягненку и открывай, почему Иисус пришел спасать.',
    start: 'Начать приключение', briefing: 'Открыть тропу', resume: 'Продолжить', pause: 'Пауза', exit: 'Выйти', next: 'Следующая тропа', replay: 'Играть снова',
    mission: 'Миссия', scripture: 'Слово внутри игры', helper: 'Помощник', light: 'Свет', lamb: 'Ягненок', best: 'Лучшее время', time: 'Время', calm: 'Спокойный режим',
    hold: 'Держать фонарь', useHelper: 'Помощь', call: 'Позови ягненка', notQuiz: 'Игровое обучение: собирай свет, защищай фонарь, веди ягненка к воротам Пастыря.',
    collect: 'Собери свет, потом держи ягненка рядом с фонарем.', guide: 'Свет собран. Веди ягненка к воротам Пастыря.',
    hazard: 'Фонарь дрогнул — держись света и попробуй снова.', helperUsed: 'Помощник открыл безопасную линию.', reward: 'Карточка Евангелия открыта', complete: 'Тропа завершена',
    finalTitle: 'Иисус ищет, спасает и ведет домой',
    finalText: 'Ты не заработал спасение очками. Игра показывает истину: Бог любит нас, Иисус пришел спасти погибших, и мы доверяем Ему и следуем за Ним.',
    trustedAdult: 'Хочешь больше узнать о следовании за Иисусом? Поговори с родителем, пастором или надежным христианским взрослым.',
    controls: 'Коснись и веди пальцем. На компьютере — WASD/стрелки. Держи кнопку фонаря, чтобы расширить свет.',
  } : {
    back: 'All Games', eyebrow: 'Gospel Adventure', title: 'Shepherd Light Adventure',
    subtitle: 'This is not a quiz. Guide Michael, carry the light of God’s Word, help the lamb, and discover why Jesus came to rescue.',
    start: 'Start Adventure', briefing: 'Open Trail', resume: 'Resume', pause: 'Pause', exit: 'Exit', next: 'Next Trail', replay: 'Play Again',
    mission: 'Mission', scripture: 'Scripture inside the game', helper: 'Helper', light: 'Light', lamb: 'Lamb', best: 'Best Time', time: 'Time', calm: 'Calm Mode',
    hold: 'Hold Lantern', useHelper: 'Helper', call: 'Call Lamb', notQuiz: 'Game learning: collect light, protect the lantern, and guide the lamb to the Shepherd Gate.',
    collect: 'Collect light, then keep the lamb close to the lantern.', guide: 'Light gathered. Guide the lamb to the Shepherd Gate.',
    hazard: 'The lantern flickered — stay close to the light and try again.', helperUsed: 'Helper opened a safer line.', reward: 'Gospel Card Unlocked', complete: 'Trail Complete',
    finalTitle: 'Jesus seeks, saves, and leads us home',
    finalText: 'You did not earn rescue by points. The game points to the truth: God loves us, Jesus came to save the lost, and we trust Him and follow Him.',
    trustedAdult: 'Want to know more about following Jesus? Talk with your parent, pastor, or trusted Christian grown-up.',
    controls: 'Touch and drag anywhere. On desktop use WASD/arrow keys. Hold the lantern button to widen the light.',
  }

  const levelTitle = isRu ? level.titleRu : level.titleEn
  const mission = isRu ? level.missionRu : level.missionEn
  const gospel = isRu ? level.gospelRu : level.gospelEn
  const scripture = isRu ? level.scriptureRu : level.scriptureEn
  const scriptureRef = isRu ? level.refRu : level.refEn

  const resetLevel = useCallback((index: number) => {
    const next = LEVELS[Math.min(index, LEVELS.length - 1)]
    setPlayer({ x: 18, y: 82 })
    pointer.current = { x: 18, y: 82, active: false }
    setLamb(next.lambStart)
    setOrbs(next.orbs.map((orb) => ({ ...orb, found: false })))

    setLanternWide(false)
    setHelperReady(true)
    setHelperActive(false)
    setSpark(0)
    setMessage(isRu ? 'Собери свет и найди ягненка.' : 'Gather light and find the lamb.')
    levelStartedAt.current = Date.now()
  }, [isRu])

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY) || '0')
    setBest(Number.isFinite(stored) ? stored : 0)
  }, [])

  useEffect(() => {
    const down = (event: KeyboardEvent) => { keys.current[event.key.toLowerCase()] = true }
    const up = (event: KeyboardEvent) => { keys.current[event.key.toLowerCase()] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  useEffect(() => {
    if (phase !== 'play') return
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - levelStartedAt.current) / 1000)), 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'play') return
    let frame = 0
    const tick = () => {
      const left = keys.current.arrowleft || keys.current.a
      const right = keys.current.arrowright || keys.current.d
      const up = keys.current.arrowup || keys.current.w
      const down = keys.current.arrowdown || keys.current.s
      setPlayer((current) => {
        let next = current
        if (pointer.current.active) {
          next = moveToward(current, pointer.current, calmMode ? 1.9 : 2.45)
        } else if (left || right || up || down) {
          next = { x: current.x + (left ? -2.2 : 0) + (right ? 2.2 : 0), y: current.y + (up ? -2.2 : 0) + (down ? 2.2 : 0) }
        }
        return { x: clamp(next.x, 7, 93), y: clamp(next.y, 9, 91) }
      })
      setSpark((value) => (value + 1) % 120)
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [phase, calmMode])

  useEffect(() => {
    if (phase !== 'play') return
    setOrbs((current) => current.map((orb) => {
      if (orb.found || dist(player, orb) > (lanternWide ? 13 : 8)) return orb
      setMessage(canGuide ? copy.guide : copy.collect)
      return { ...orb, found: true }
    }))
  }, [player, phase, lanternWide, level.requiredLight, canGuide, copy.collect, copy.guide])

  useEffect(() => {
    if (phase !== 'play') return
    const danger = level.hazards.find((hazard) => dist(player, hazard) < hazard.r + (lanternWide ? 3 : 0))
    if (!danger || helperActive || calmMode) return
    setMessage(copy.hazard)
    setPlayer((current) => moveToward(current, { x: 18, y: 82 }, 10))
    pointer.current.active = false
  }, [player, phase, level.hazards, helperActive, calmMode, lanternWide, copy.hazard])

  useEffect(() => {
    if (phase !== 'play' || !canGuide) return
    setLamb((current) => {
      if (!lambNear) return current
      const speed = lanternWide || helperActive ? 1.25 : 0.85
      return moveToward(current, player, speed)
    })
  }, [player, phase, canGuide, lambNear, lanternWide, helperActive])

  useEffect(() => {
    if (phase !== 'play' || !gateNear || !canGuide) return
    setRescued((count) => count + 1)
    setPhase('reward')
  }, [phase, gateNear, canGuide])

  function startGame() {
    setLevelIndex(0)
    setRescued(0)
    setElapsed(0)
    resetLevel(0)
    setPhase('briefing')
  }

  function beginTrail() {
    levelStartedAt.current = Date.now() - elapsed * 1000
    setPhase('play')
  }

  function nextTrail() {
    const next = levelIndex + 1
    if (next >= LEVELS.length) {
      const total = elapsed
      setBest((prev) => {
        const nextBest = prev === 0 ? total : Math.min(prev, total)
        localStorage.setItem(STORAGE_KEY, String(nextBest))
        return nextBest
      })
      setPhase('complete')
      return
    }
    setLevelIndex(next)
    setElapsed(0)
    resetLevel(next)
    setPhase('briefing')
  }

  function useHelper() {
    if (!helperReady || phase !== 'play') return
    setHelperReady(false)
    setHelperActive(true)
    setMessage(copy.helperUsed)
    window.setTimeout(() => setHelperActive(false), 5200)
    window.setTimeout(() => setHelperReady(true), calmMode ? 5000 : 9000)
  }

  function syncPointer(event: React.PointerEvent<HTMLDivElement>) {
    const rect = arenaRef.current?.getBoundingClientRect()
    if (!rect) return
    pointer.current = {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 7, 93),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 9, 91),
      active: true,
    }
  }

  function pointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (phase !== 'play') return
    event.currentTarget.setPointerCapture(event.pointerId)
    syncPointer(event)
  }

  function pointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (phase !== 'play' || event.buttons === 0) return
    syncPointer(event)
  }

  function pointerUp(event: React.PointerEvent<HTMLDivElement>) {
    pointer.current.active = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const screen = phase === 'intro' ? 'intro' : 'game'

  return (
    <main className="sla-page">
      <style>{`
        .sla-page { min-height: 100vh; color: #fff; background: linear-gradient(180deg,#061126,#0f2c45 45%,#fef7df); }
        .sla-wrap { max-width: 1120px; margin: 0 auto; padding: 30px 14px 58px; }
        .sla-hero { display: grid; grid-template-columns: minmax(0,1fr) minmax(300px,.92fr); gap: 22px; align-items: stretch; }
        .sla-card { border-radius: 30px; border: 2px solid rgba(255,255,255,.18); background: rgba(255,255,255,.11); box-shadow: 0 30px 90px rgba(0,0,0,.28); backdrop-filter: blur(16px); }
        .sla-title { font-family: var(--font-cinzel); font-size: clamp(2.3rem,7vw,5.2rem); line-height: .95; color: #fff8dc; margin: 10px 0 16px; text-shadow: 0 8px 34px rgba(251,191,36,.34); }
        .sla-copy { font-family: var(--font-lora); font-weight: 750; line-height: 1.72; color: rgba(255,255,255,.9); }
        .sla-btn { border: 0; border-radius: 18px; padding: 14px 20px; min-height: 56px; font-family: var(--font-nunito); font-weight: 1000; font-size: 1rem; color: #3b2307; background: linear-gradient(180deg,#fde68a,#f59e0b); box-shadow: 0 7px 0 #92400e,0 16px 34px rgba(0,0,0,.25); cursor: pointer; touch-action: manipulation; }
        .sla-btn:active { transform: translateY(4px); box-shadow: 0 3px 0 #92400e; }
        .sla-btn.secondary { color: #ecfeff; background: linear-gradient(180deg,#2563eb,#0f766e); box-shadow: 0 7px 0 #0f3f3b; }
        .sla-btn.danger { color: #450a0a; background: linear-gradient(180deg,#fecaca,#fb7185); box-shadow: 0 7px 0 #9f1239; }
        .sla-preview { position: relative; overflow: hidden; min-height: 520px; border-radius: 34px; border: 4px solid rgba(253,230,138,.85); background: linear-gradient(180deg,#7dd3fc 0%,#bbf7d0 52%,#65a30d 100%); }
        .sla-game { position: fixed; inset: 0; z-index: 9999; padding: max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left)); display: flex; flex-direction: column; gap: 8px; background: linear-gradient(180deg,#061126,#0b2a3e); }
        .sla-hud { display: grid; grid-template-columns: repeat(4,1fr) auto; gap: 7px; align-items: center; }
        .sla-chip { border-radius: 16px; padding: 8px 9px; min-height: 46px; background: rgba(255,255,255,.13); border: 1px solid rgba(255,255,255,.2); font-family: var(--font-nunito); font-weight: 1000; font-size: .82rem; text-align: center; }
        .sla-arena { position: relative; overflow: hidden; flex: 1; min-height: 0; border-radius: 26px; border: 4px solid rgba(253,230,138,.86); box-shadow: inset 0 0 0 2px rgba(255,255,255,.12), 0 28px 80px rgba(0,0,0,.34); touch-action: none; user-select: none; }
        .sla-arena.meadow { background: radial-gradient(circle at 24% 22%,rgba(255,255,255,.74),transparent 10%),linear-gradient(180deg,#7dd3fc 0%,#bbf7d0 50%,#65a30d 100%); }
        .sla-arena.bridge { background: radial-gradient(circle at 78% 18%,rgba(255,255,255,.65),transparent 10%),linear-gradient(180deg,#93c5fd 0%,#bae6fd 36%,#0ea5e9 58%,#84cc16 100%); }
        .sla-arena.storm { background: radial-gradient(circle at 68% 18%,rgba(253,230,138,.4),transparent 14%),linear-gradient(180deg,#475569 0%,#0f766e 50%,#365314 100%); }
        .sla-world { position: absolute; inset: 0; pointer-events: none; }
        .sla-hill { position: absolute; left: -8%; right: -8%; bottom: -12%; height: 42%; border-radius: 50% 50% 0 0; background: linear-gradient(180deg,#a3e635,#4d7c0f); opacity: .95; }
        .sla-path { position: absolute; left: 12%; top: 8%; width: 74%; height: 84%; border-radius: 48%; border: 28px dashed rgba(254,243,199,.26); transform: rotate(-18deg); }
        .sla-gate { position: absolute; width: 86px; height: 86px; transform: translate(-50%,-50%); border-radius: 28px 28px 16px 16px; background: radial-gradient(circle,#fef3c7,#f59e0b); border: 5px solid rgba(255,255,255,.78); box-shadow: 0 0 42px rgba(253,224,71,.76); display: grid; place-items: center; font-size: 2.2rem; }
        .sla-orb { position: absolute; width: 28px; height: 28px; margin: -14px; border-radius: 999px; background: radial-gradient(circle,#fff 0%,#fde68a 42%,#f59e0b 100%); box-shadow: 0 0 28px #fde047; animation: slaFloat 1.9s ease-in-out infinite; }
        .sla-hazard { position: absolute; transform: translate(-50%,-50%); border-radius: 999px; opacity: .62; filter: blur(.1px); }
        .sla-hazard.fog { background: radial-gradient(circle,rgba(255,255,255,.82),rgba(203,213,225,.18)); }
        .sla-hazard.splash { background: radial-gradient(circle,rgba(14,165,233,.82),rgba(14,165,233,.12)); }
        .sla-hazard.gust { background: repeating-radial-gradient(circle,rgba(226,232,240,.5) 0 6px,rgba(255,255,255,.08) 7px 16px); animation: slaSpin 4s linear infinite; }
        .sla-light { position: absolute; width: var(--light-size); height: var(--light-size); transform: translate(-50%,-50%); border-radius: 999px; background: radial-gradient(circle,rgba(254,249,195,.72) 0%,rgba(250,204,21,.27) 42%,transparent 72%); mix-blend-mode: screen; transition: width .15s ease,height .15s ease; }
        .sla-player,.sla-lamb { position: absolute; transform: translate(-50%,-50%); transition: filter .15s ease; }
        .sla-player { width: 54px; height: 72px; }
        .sla-lamb { width: 48px; height: 40px; filter: drop-shadow(0 9px 13px rgba(0,0,0,.22)); }
        .sla-body { position: absolute; left: 13px; bottom: 2px; width: 28px; height: 42px; border-radius: 18px 18px 12px 12px; background: linear-gradient(180deg,#22c55e,#166534); border: 3px solid rgba(255,255,255,.72); }
        .sla-head { position: absolute; left: 12px; top: 1px; width: 31px; height: 31px; border-radius: 999px; background: #f7c59f; border: 3px solid rgba(255,255,255,.72); }
        .sla-hair { position: absolute; left: 8px; top: -3px; width: 38px; height: 18px; border-radius: 999px 999px 8px 8px; background: #5b341c; }
        .sla-lantern { position: absolute; right: 0; bottom: 18px; width: 18px; height: 24px; border-radius: 9px; background: radial-gradient(circle,#fff,#facc15); box-shadow: 0 0 22px #facc15; border: 2px solid #92400e; }
        .sla-lamb-body { position: absolute; left: 5px; top: 12px; width: 36px; height: 24px; border-radius: 999px; background: #fff7ed; border: 3px solid #e2e8f0; }
        .sla-lamb-head { position: absolute; right: 0; top: 7px; width: 20px; height: 20px; border-radius: 999px; background: #f8fafc; border: 3px solid #e2e8f0; }
        .sla-panel { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: min(720px,calc(100% - 22px)); max-height: calc(100% - 22px); overflow: auto; border-radius: 28px; padding: 22px; background: rgba(6,17,38,.9); border: 2px solid rgba(253,230,138,.72); box-shadow: 0 24px 80px rgba(0,0,0,.44); }
        .sla-controls { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .sla-control { border: 0; border-radius: 18px; min-height: 60px; font-family: var(--font-nunito); font-weight: 1000; font-size: .95rem; background: rgba(255,255,255,.15); color: #fff; border: 1px solid rgba(255,255,255,.22); touch-action: manipulation; }
        .sla-control.active { background: linear-gradient(180deg,#fef3c7,#f59e0b); color: #422006; }
        .sla-control:disabled { opacity: .52; }
        .sla-message { min-height: 38px; border-radius: 18px; padding: 9px 13px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.16); font-family: var(--font-nunito); font-weight: 900; text-align: center; }
        .sla-scripture { border-radius: 22px; padding: 16px; background: linear-gradient(180deg,rgba(254,243,199,.96),rgba(255,247,237,.92)); color: #3b2307; border: 2px solid #f59e0b; font-family: var(--font-lora); font-weight: 800; line-height: 1.6; }
        @keyframes slaFloat { 50% { transform: translateY(-7px); } }
        @keyframes slaSpin { to { rotate: 360deg; } }
        @media (max-width: 820px) { .sla-hero { grid-template-columns: 1fr; } .sla-preview { min-height: 420px; } .sla-hud { grid-template-columns: repeat(2,1fr) auto; } .sla-chip:nth-child(3),.sla-chip:nth-child(4) { display: none; } .sla-controls { grid-template-columns: 1fr 1fr; } .sla-control.call { grid-column: 1 / -1; } }
        @media (prefers-reduced-motion: reduce) { .sla-orb,.sla-hazard.gust { animation: none; } .sla-player,.sla-lamb { transition: none; } }
      `}</style>

      {screen === 'intro' ? (
        <section className="sla-wrap">
          <Link href="/games" className="quest-back" style={{ color: '#fde68a', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {copy.back}</Link>
          <div className="sla-hero" style={{ marginTop: 22 }}>
            <div className="sla-card" style={{ padding: 26 }}>
              <p className="eyebrow" style={{ color: '#fde68a' }}>{copy.eyebrow}</p>
              <h1 className="sla-title">{copy.title}</h1>
              <p className="sla-copy" style={{ fontSize: '1.08rem' }}>{copy.subtitle}</p>
              <div className="sla-scripture" style={{ marginTop: 18 }}>
                <strong>{copy.scripture}: {LEVELS[0][isRu ? 'refRu' : 'refEn']}</strong><br />“{LEVELS[0][isRu ? 'scriptureRu' : 'scriptureEn']}”
              </div>
              <p className="sla-copy" style={{ marginTop: 16 }}>{copy.notQuiz}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 20 }}>
                <button className="sla-btn" onClick={startGame}>{copy.start} →</button>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-nunito)', fontWeight: 1000 }}>
                  <input type="checkbox" checked={calmMode} onChange={(event) => setCalmMode(event.target.checked)} /> {copy.calm}
                </label>
              </div>
            </div>
            <div className="sla-preview">
              <GameWorld level={LEVELS[0]} player={{ x: 22, y: 70 }} lamb={{ x: 72, y: 34 }} orbs={LEVELS[0].orbs} lanternWide helperActive spark={spark} />
            </div>
          </div>
        </section>
      ) : (
        <section className="sla-game" aria-label={copy.title}>
          <div className="sla-hud">
            <div className="sla-chip">{copy.light}<br />{foundLight}/{level.requiredLight} · {progress}%</div>
            <div className="sla-chip">{copy.lamb}<br />{rescued}/{LEVELS.length}</div>
            <div className="sla-chip">{copy.time}<br />{elapsed}s</div>
            <div className="sla-chip">{copy.best}<br />{best ? `${best}s` : '—'}</div>
            <button className="sla-btn danger" style={{ minHeight: 46, padding: '8px 13px' }} onClick={() => setPhase(phase === 'paused' ? 'play' : 'paused')}>{phase === 'paused' ? copy.resume : copy.pause}</button>
          </div>

          <div ref={arenaRef} className={`sla-arena ${level.environment}`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onLostPointerCapture={() => { pointer.current.active = false }}>
            <GameWorld level={level} player={player} lamb={lamb} orbs={orbs} lanternWide={lanternWide} helperActive={helperActive} spark={spark} />

            {phase === 'briefing' && (
              <div className="sla-panel">
                <p className="eyebrow" style={{ color: '#fde68a' }}>{copy.mission}</p>
                <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,7vw,3.8rem)', lineHeight: 1, margin: '8px 0 12px' }}>{levelTitle}</h2>
                <p className="sla-copy">{mission}</p>
                <div className="sla-scripture" style={{ margin: '15px 0' }}><strong>{scriptureRef}</strong><br />“{scripture}”</div>
                <p className="sla-copy"><strong>{helper.emoji} {isRu ? helper.ru : helper.en}.</strong> {copy.controls}</p>
                <button className="sla-btn" onClick={beginTrail} style={{ marginTop: 14 }}>{copy.briefing} →</button>
              </div>
            )}

            {phase === 'reward' && (
              <div className="sla-panel">
                <p className="eyebrow" style={{ color: '#fde68a' }}>{copy.reward}</p>
                <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,7vw,3.5rem)', lineHeight: 1, margin: '8px 0 12px' }}>{copy.complete}</h2>
                <div className="sla-scripture"><strong>{scriptureRef}</strong><br />“{scripture}”</div>
                <p className="sla-copy" style={{ marginTop: 14 }}>{gospel}</p>
                <button className="sla-btn" onClick={nextTrail} style={{ marginTop: 14 }}>{levelIndex >= LEVELS.length - 1 ? copy.complete : copy.next} →</button>
              </div>
            )}

            {phase === 'paused' && (
              <div className="sla-panel">
                <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '2.4rem', marginBottom: 10 }}>{copy.pause}</h2>
                <p className="sla-copy">{copy.controls}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                  <button className="sla-btn" onClick={() => setPhase('play')}>{copy.resume}</button>
                  <button className="sla-btn danger" onClick={() => setPhase('intro')}>{copy.exit}</button>
                </div>
              </div>
            )}

            {phase === 'complete' && (
              <div className="sla-panel">
                <p className="eyebrow" style={{ color: '#fde68a' }}>{copy.reward}</p>
                <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,7vw,3.6rem)', lineHeight: 1, margin: '8px 0 12px' }}>{copy.finalTitle}</h2>
                <p className="sla-copy">{copy.finalText}</p>
                <p className="sla-copy" style={{ color: '#fde68a' }}>{copy.trustedAdult}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                  <button className="sla-btn" onClick={startGame}>{copy.replay}</button>
                  <Link href="/games" className="sla-btn secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{copy.back}</Link>
                </div>
              </div>
            )}
          </div>

          <div className="sla-message">{message || (canGuide ? copy.guide : copy.collect)} <span style={{ color: '#fde68a' }}>• {scriptureRef}</span></div>
          <div className="sla-controls">
            <button className={`sla-control ${lanternWide ? 'active' : ''}`} onPointerDown={() => setLanternWide(true)} onPointerUp={() => setLanternWide(false)} onPointerCancel={() => setLanternWide(false)}>{copy.hold}</button>
            <button className={`sla-control ${helperActive ? 'active' : ''}`} disabled={!helperReady} onClick={useHelper}>{helper.emoji} {copy.useHelper}</button>
            <button className="sla-control call" onClick={() => {
              if (canGuide && dist(player, lamb) < 24) setLamb((current) => moveToward(current, player, 6))
            }}>{copy.call}</button>
          </div>
        </section>
      )}
    </main>
  )
}

function GameWorld({ level, player, lamb, orbs, lanternWide, helperActive, spark }: { level: Level; player: Point; lamb: Point; orbs: Orb[]; lanternWide: boolean; helperActive: boolean; spark: number }) {
  const lightSize = lanternWide || helperActive ? 190 : 128
  return (
    <div className="sla-world" style={{ ['--light-size' as string]: `${lightSize}px` }}>
      <div className="sla-hill" />
      <div className="sla-path" />
      <div className="sla-gate" style={{ left: `${level.gate.x}%`, top: `${level.gate.y}%` }}>🐑</div>
      {level.hazards.map((hazard) => (
        <div key={hazard.id} className={`sla-hazard ${hazard.kind}`} style={{ left: `${hazard.x}%`, top: `${hazard.y}%`, width: `${hazard.r * 2.7}px`, height: `${hazard.r * 2.7}px` }} />
      ))}
      {orbs.filter((orb) => !orb.found).map((orb) => <div key={orb.id} className="sla-orb" style={{ left: `${orb.x}%`, top: `${orb.y}%`, animationDelay: `${orb.id * .15}s` }} />)}
      <div className="sla-light" style={{ left: `${player.x}%`, top: `${player.y}%` }} />
      {Array.from({ length: helperActive ? 10 : 5 }).map((_, index) => (
        <span key={index} aria-hidden="true" style={{ position: 'absolute', left: `${player.x + Math.sin((spark + index * 13) / 8) * (8 + index)}%`, top: `${player.y + Math.cos((spark + index * 11) / 9) * (5 + index * .7)}%`, color: '#fde68a', textShadow: '0 0 14px #facc15', fontSize: 11 + (index % 3) * 4 }}>✦</span>
      ))}
      <div className="sla-lamb" style={{ left: `${lamb.x}%`, top: `${lamb.y}%` }}>
        <div className="sla-lamb-body" /><div className="sla-lamb-head" />
      </div>
      <div className="sla-player" style={{ left: `${player.x}%`, top: `${player.y}%`, filter: helperActive ? 'drop-shadow(0 0 18px #fef3c7)' : undefined }}>
        <div className="sla-hair" /><div className="sla-head" /><div className="sla-body" /><div className="sla-lantern" />
      </div>
    </div>
  )
}
