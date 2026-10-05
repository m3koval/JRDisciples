'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link'
import { resolveShot, releaseError, slingScene, shotCurve, curvePoint } from './mechanics'
import type { MouseEvent, PointerEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type Phase = 'intro' | 'question' | 'play' | 'result'
type Power = 'none' | 'focus' | 'steady' | 'shield' | 'wind'
type Result = 'ready' | 'perfect' | 'hit' | 'near' | 'miss' | 'saved'

type Level = {
  nameEn: string
  nameRu: string
  wind: number
  targetAngle: number
  window: number
  distance: number
}

const LEVELS: Level[] = [
  { nameEn: 'Valley Practice', nameRu: 'Тренировка в долине', wind: 0, targetAngle: 42, window: 17, distance: 1 },
  { nameEn: 'Shield Line', nameRu: 'Линия щита', wind: -5, targetAngle: 50, window: 13, distance: 1.15 },
  { nameEn: 'Long Valley Throw', nameRu: 'Дальний бросок долины', wind: 7, targetAngle: 58, window: 10, distance: 1.28 },
]

const SCRIPTURE = {
  refEn: '1 Samuel 17:47',
  refRu: '1 Царств 17:47',
  textEn: 'and that all this assembly may know that the LORD saves not with sword and spear. For the battle is the LORD’s, and he will give you into our hand.”',
  textRu: 'и узнает весь этот сонм, что не мечом и копьем спасает Господь, ибо это война Господа, и Он предаст вас в руки наши.',
  questionEn: 'What did David want everyone to know?',
  questionRu: 'Что Давид хотел, чтобы все узнали?',
  choicesEn: ['The battle is the LORD’s', 'The sling was magic', 'David was showing off'],
  choicesRu: ['Это война Господа', 'Праща была волшебной', 'Давид хвалился собой'],
  answer: 0,
}

const BG = '/images/jr/games/david-sling-v2/generated/01-playfield.png'

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}



export default function DavidSlingChallengePage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const holdRef = useRef(false)
  const angleRef = useRef(28)
  const speedRef = useRef(0.45)
  const stoneRef = useRef({ error: 0, window: 17, active: false })

  // A pending result advances only with foreground play time, never behind Pause.
  const transitionRef = useRef<{ remaining: number; finish: () => void } | null>(null)
  const pausedRef = useRef(false)
  const pointerRef = useRef<number | null>(null)
  const resumeRef = useRef<HTMLButtonElement | null>(null)
  const holdButtonRef = useRef<HTMLButtonElement | null>(null)
  const pauseButtonRef = useRef<HTMLButtonElement | null>(null)
  const [paused, setPaused] = useState(false)
  const lockedRef = useRef(false)
  const [checkpointScore, setCheckpointScore] = useState(0)

  const [phase, setPhase] = useState<Phase>('intro')
  const [levelIndex, setLevelIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [throwsLeft, setThrowsLeft] = useState(5)
  const [result, setResult] = useState<Result>('ready')
  const [wisdomFuel, setWisdomFuel] = useState(0)
  const [power, setPower] = useState<Power>('none')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [speedMeter, setSpeedMeter] = useState(9)
  const [releaseAngle, setReleaseAngle] = useState(28)
  const [buttonFlash, setButtonFlash] = useState<'rhythm' | 'hold' | 'release' | 'power' | null>(null)

  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)]
  const effectiveWindow = level.window + (power === 'steady' ? 8 : 0)
  const effectiveWind = power === 'wind' ? Math.round(level.wind / 3) : level.wind

  function flash(kind: 'rhythm' | 'hold' | 'release' | 'power') {
    setButtonFlash(kind)
    window.setTimeout(() => setButtonFlash(null), 180)
  }

  function stopTap(event: PointerEvent<HTMLElement> | MouseEvent<HTMLElement>) {
    event.preventDefault()
    event.stopPropagation()
  }

  const copy = isRu ? {
    back: 'Все игры', eyebrow: 'Праща и доверие', title: 'Праща Давида',
    subtitle: 'Прочитай слова Давида, выбери помощь, затем держи и отпускай вращающуюся пращу. Пройди три испытания в долине.',
    start: 'Начать миссию', quit: 'Выйти', mission: 'Миссия с пращой', questionTitle: 'Сначала Божье Слово', questionHelp: 'Ответь правильно, чтобы получить Мудрость и усиление для броска.',
    stepBible: 'Прочитай стих', stepPower: 'Выбери помощь', stepPlay: 'Ритм • держи • отпусти', speed: 'Скорость пращи', perfectZone: 'Зеленая дуга = лучший момент',
    correct: 'Верно! +2 Мудрости. Выбери усиление.', wrong: 'Хорошая попытка. Прочитай стих и попробуй снова.',
    rhythm: 'Ритм', hold: 'Держи', release: 'Отпусти!', next: 'Следующий уровень', again: 'Снова',
    score: 'Очки', best: 'Рекорд', throws: 'Камни', fuel: 'Мудрость', wind: 'Ветер', level: 'Уровень',
    focus: 'Мудрый фокус', steady: 'Твердая рука', shield: 'Щит доверия', calmWind: 'Успокоить ветер',
    focusDesc: 'замедляет вращение', steadyDesc: 'расширяет окно', shieldDesc: 'спасает один промах', windDesc: 'уменьшает ветер',
    ready: 'Набери скорость пращи, удерживай вращение и отпусти по дуге.', perfect: 'Точно! Давид доверял Господу.', hit: 'Попадание! Хороший бросок.', near: 'Близко. Настрой ритм и попробуй еще.', miss: 'Промах. Не сдавайся — вера продолжает путь.', saved: 'Щит доверия дал повтор без потери.',
  } : {
    back: 'All Games', eyebrow: 'Sling and trust', title: 'David Sling Challenge',
    subtitle: 'Read David’s words, choose your help, then hold and release the rotating sling. Complete three valley challenges.',
    start: 'Start Mission', quit: 'Exit', mission: 'Sling Mission', questionTitle: 'God’s Word First', questionHelp: 'Answer correctly to earn Wisdom Fuel and choose a throw advantage.',
    stepBible: 'Read the verse', stepPower: 'Choose help', stepPlay: 'Tap • hold • release', speed: 'Sling Speed', perfectZone: 'Green arc = best release',
    correct: 'Correct! +2 Wisdom Fuel. Choose a power-up.', wrong: 'Good try. Read the verse and try again.',
    rhythm: 'Tap Rhythm', hold: 'Hold', release: 'Release!', next: 'Next Level', again: 'Play Again',
    score: 'Score', best: 'Best', throws: 'Stones', fuel: 'Wisdom', wind: 'Wind', level: 'Level',
    focus: 'Wisdom Focus', steady: 'Steady Hand', shield: 'Trust Shield', calmWind: 'Calm Wind',
    focusDesc: 'slows rotation', steadyDesc: 'widens release window', shieldDesc: 'saves one miss', windDesc: 'reduces wind',
    ready: 'Build sling speed, hold the spin, then release on the dotted line.', perfect: 'Perfect! David trusted the Lord.', hit: 'Hit! Strong timing.', near: 'Close. Tune the rhythm and try again.', miss: 'Miss. Do not quit — faith keeps moving.', saved: 'Trust Shield gave you a safe retry.',
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const width = Math.max(1, Math.round(rect.width * dpr))
    const height = Math.max(1, Math.round(rect.height * dpr))
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    ctx.save()
    ctx.scale(dpr, dpr)
    const w = width / dpr
    const h = height / dpr

    ctx.clearRect(0, 0, w, h)

    const scene = slingScene(w, h)
    const david = scene.origin
    const target = scene.target
    const nowAngle = angleRef.current
    const radians = (nowAngle * Math.PI) / 180
    const targetAngle = level.targetAngle - effectiveWind
    const preview = shotCurve(scene, stoneRef.current.active ? stoneRef.current.error : releaseError(nowAngle, targetAngle, 0), effectiveWindow)
    const goal = shotCurve(scene, 0, effectiveWindow)

    ctx.lineCap = 'round'
    ctx.lineWidth = Math.max(5, scene.width * .014)
    ctx.strokeStyle = 'rgba(34,197,94,.32)'
    ctx.beginPath()
    ctx.moveTo(david.x, david.y)
    ctx.quadraticCurveTo(goal.control.x, goal.control.y, goal.end.x, goal.end.y)
    ctx.stroke()

    ctx.lineWidth = Math.max(2, scene.width * .004)
    ctx.setLineDash([6, 8])
    ctx.strokeStyle = 'rgba(255,255,255,.9)'
    ctx.shadowBlur = 14
    ctx.shadowColor = '#facc15'
    ctx.beginPath()
    ctx.moveTo(david.x, david.y)
    ctx.quadraticCurveTo(preview.control.x, preview.control.y, preview.end.x, preview.end.y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.shadowBlur = 0

    ctx.strokeStyle = '#78350f'
    ctx.lineWidth = 2
    ctx.beginPath()
    const radius = Math.max(8, scene.width * .033)
    ctx.arc(david.x, david.y, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#57534e'
    ctx.beginPath()
    ctx.arc(david.x + Math.cos(radians) * radius, david.y - Math.sin(radians) * radius, 4, 0, Math.PI * 2)
    ctx.fill()

    const stone = stoneRef.current
    if (stone.active) {
      const progress = 1 - (transitionRef.current?.remaining ?? 0) / 950
      const position = curvePoint(shotCurve(scene, stone.error, stone.window), progress)
      ctx.fillStyle = '#f8fafc'
      ctx.shadowBlur = 20
      ctx.shadowColor = '#fde68a'
      ctx.beginPath()
      ctx.arc(position.x, position.y, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

    }

    if (stone.active && Math.abs(stone.error) <= stone.window && (transitionRef.current?.remaining ?? 950) < 150) {
      ctx.strokeStyle = '#fde68a'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(target.x, target.y, scene.width * .06, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.restore()
    rafRef.current = window.requestAnimationFrame(draw)
  }, [effectiveWind, effectiveWindow, level.targetAngle])

  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem('david-sling-v2-best') || '0')
      setBest(Number.isFinite(stored) && stored >= 0 ? stored : 0)
    } catch { /* Storage is optional. */ }
    rafRef.current = window.requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [draw])

  useEffect(() => {
    if (phase !== 'play') return
    let previous = performance.now()
    const timer = window.setInterval(() => {
      const now = performance.now()
      const elapsed = Math.min(64, Math.max(0, now - previous))
      previous = now
      if (pausedRef.current) return
      const pending = transitionRef.current
      if (pending) {
        pending.remaining -= elapsed
        if (pending.remaining <= 0) {
          transitionRef.current = null
          pending.finish()
          return
        }
      }
      const slow = power === 'focus' ? 0.48 : 1
      angleRef.current = (angleRef.current + speedRef.current * slow) % 360
      setReleaseAngle(Math.round(angleRef.current))
      if (!holdRef.current) speedRef.current = clamp(speedRef.current - 0.018, 0.45, 5.2)
      setSpeedMeter(Math.round((speedRef.current / 5.2) * 100))
    }, 16)
    return () => window.clearInterval(timer)
  }, [phase, power])

  useEffect(() => {
    const onDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && phase === 'play' && !event.repeat && !(event.target instanceof HTMLElement && event.target.closest('button, a, input'))) {
        event.preventDefault()
        holdSpin()
      }
    }
    const onUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' && holdRef.current && pointerRef.current === null) {
        event.preventDefault()
        releaseThrow()
      }
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  })

  const pauseGame = useCallback(() => {
    if (phase !== 'play' || pausedRef.current) return
    holdRef.current = false
    pointerRef.current = null
    pausedRef.current = true
    setPaused(true)
  }, [phase])

  function resumeGame() {
    holdRef.current = false
    pointerRef.current = null
    pausedRef.current = false
    setPaused(false)
  }

  useEffect(() => {
    const hidden = () => { if (document.hidden) pauseGame() }
    const escape = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && !pausedRef.current) pauseGame()
    }
    window.addEventListener('blur', pauseGame)
    window.addEventListener('resize', pauseGame)
    window.addEventListener('keydown', escape)
    document.addEventListener('visibilitychange', hidden)
    return () => {
      window.removeEventListener('blur', pauseGame)
      window.removeEventListener('resize', pauseGame)
      window.removeEventListener('keydown', escape)
      document.removeEventListener('visibilitychange', hidden)
    }
  }, [pauseGame])

  useEffect(() => {
    if (phase !== 'play') return
    if (paused) resumeRef.current?.focus()
    else (holdButtonRef.current || pauseButtonRef.current)?.focus()
  }, [paused, phase])

  function cancelPending() {
    transitionRef.current = null
    pausedRef.current = false
    setPaused(false)
    pointerRef.current = null
    lockedRef.current = false
    holdRef.current = false
    stoneRef.current.active = false
  }

  function retryLevel() {
    cancelPending()
    setScore(checkpointScore)
    setThrowsLeft(5)
    setWisdomFuel(0)
    setPower('none')
    setResult('ready')
    setSelectedAnswer(null)
    setMessage('')
    angleRef.current = 28
    speedRef.current = 0.45
    setPhase('question')
  }

  function begin() {
    cancelPending()
    setCheckpointScore(0)
    setWisdomFuel(0)
    setPhase('question')
    setLevelIndex(0)
    setScore(0)
    setThrowsLeft(5)
    setResult('ready')
    setMessage('')
    setPower('none')
    setSelectedAnswer(null)
    angleRef.current = 28
    speedRef.current = 0.45
    setSpeedMeter(9)
    stoneRef.current.active = false
  }

  function exitGame() {
    cancelPending()
    holdRef.current = false
    stoneRef.current.active = false
    setPhase('intro')
    setPower('none')
    setSelectedAnswer(null)
    setMessage('')
    setResult('ready')
  }

  function answer(index: number) {
    setSelectedAnswer(index)
    if (index === SCRIPTURE.answer) {
      setWisdomFuel((value) => value + 2)
      setMessage(copy.correct)
      setPhase('play')
    } else {
      setMessage(copy.wrong)
    }
  }

  function choosePower(next: Power) {
    const cost = next === 'none' ? 0 : 1
    if (phase !== 'play' || pausedRef.current || lockedRef.current) return
    if (wisdomFuel < cost) {
      setMessage(isRu ? 'Сначала ответь на стих, чтобы получить Мудрость.' : 'Answer the verse first to earn Wisdom Fuel.')
      return
    }
    flash('power')
    setWisdomFuel((value) => value - cost)
    setPower(next)
    setMessage(next === 'focus' ? copy.focusDesc : next === 'steady' ? copy.steadyDesc : next === 'shield' ? copy.shieldDesc : next === 'wind' ? copy.windDesc : copy.ready)
  }

  function tapRhythm() {
    if (phase !== 'play' || pausedRef.current || lockedRef.current) return
    flash('rhythm')
    speedRef.current = clamp(speedRef.current + 0.62, 0.45, 5.2)
    setSpeedMeter(Math.round((speedRef.current / 5.2) * 100))
    setMessage(copy.ready)
  }

  function holdSpin() {
    if (phase !== 'play' || pausedRef.current || lockedRef.current || holdRef.current) return
    flash('hold')
    holdRef.current = true
    speedRef.current = clamp(speedRef.current + 0.18, 0.45, 5.2)
    setSpeedMeter(Math.round((speedRef.current / 5.2) * 100))
  }

  function stopHold() {
    holdRef.current = false
    pointerRef.current = null
  }

  function releaseThrow() {
    if (phase !== 'play' || pausedRef.current || throwsLeft <= 0 || stoneRef.current.active || lockedRef.current) return
    flash('release')
    holdRef.current = false
    lockedRef.current = true
    const shot = resolveShot(angleRef.current, level.targetAngle, effectiveWind, effectiveWindow, power === 'shield')
    stoneRef.current = {
      error: shot.error,
      window: effectiveWindow,
      active: true,
    }
    setThrowsLeft((value) => Math.max(0, value - shot.stoneCost))
    if (shot.consumeShield) setPower('none')
    const points = shot.points
    const nextResult = shot.result

    setResult(nextResult)
    setMessage(copy[nextResult])
    setScore((current) => {
      const next = current + points
      const bestNext = Math.max(best, next)
      setBest(bestNext)
      try { localStorage.setItem('david-sling-v2-best', String(bestNext)) } catch { /* Keep playing. */ }
      return next
    })

    transitionRef.current = { remaining: 950, finish: () => {
      lockedRef.current = false
      stoneRef.current.active = false
      if (shot.advance) {

        if (levelIndex < LEVELS.length - 1) {
          setCheckpointScore(score + points)
          setLevelIndex((value) => value + 1)
          setThrowsLeft(5)
          setPhase('question')
          setSelectedAnswer(null)
          setPower('none')
          setMessage('')
          setResult('ready')
          angleRef.current = 28
          speedRef.current = 0.45
          setSpeedMeter(9)
        } else {
          setPhase('result')
        }
      } else if (throwsLeft - shot.stoneCost <= 0) setPhase('result')
      else setSpeedMeter(Math.round((speedRef.current / 5.2) * 100))
    } }
  }

  const choices = isRu ? SCRIPTURE.choicesRu : SCRIPTURE.choicesEn
  const phaseSteps = [copy.stepBible, copy.stepPower, copy.stepPlay]
  const canUseGameControls = phase === 'play' && !lockedRef.current
  const canChoosePower = phase === 'play' && !paused && wisdomFuel > 0 && !lockedRef.current
  const isGameOpen = phase !== 'intro'

  return (
    <main className="dsv2-page">
      <style>{`
        .dsv2-page { min-height: 100vh; color: #fff; background: linear-gradient(180deg,#06172f,#10294b 62%,#f8fafc); }
        .dsv2-wrap { max-width: 1180px; margin: 0 auto; padding: 24px 14px 58px; }
        .dsv2-hero { max-width: 920px; }
        .dsv2-title { font-family: var(--font-cinzel); font-size: clamp(1.95rem,5.8vw,4.1rem); line-height: .95; margin: 4px 0 10px; }
        .dsv2-subtitle { font-family: var(--font-lora); color: rgba(255,255,255,.9); font-weight: 800; line-height: 1.45; }
        .dsv2-hero-start { margin-top: 12px; }
        .dsv2-stats { display: grid; grid-template-columns: repeat(5,1fr); gap: 9px; margin: 12px 0; }
        .dsv2-stats div { border-radius: 16px; padding: 10px; background: rgba(15,23,42,.72); border: 1px solid rgba(255,255,255,.18); text-align: center; font-family: var(--font-nunito); font-weight: 1000; }
        .dsv2-stat-icons { display: block; color: #ffd866; letter-spacing: .04em; }
        .dsv2-phase-strip { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0 14px; }
        .dsv2-step { border: 1px solid rgba(255,255,255,.2); border-radius: 999px; padding: 8px 12px; background: rgba(15,23,42,.66); font-family: var(--font-nunito); font-weight: 1000; color: #cbd5e1; }
        .dsv2-step.active { background: linear-gradient(180deg,#fef08a,#f59e0b); color: #3b2307; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(245,158,11,.35); }
        .dsv2-play-shell.fullscreen { position: fixed; inset: 0; z-index: 9999; display: grid; grid-template-rows: auto auto minmax(0,1fr); gap: 8px; padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left)); overflow: auto; background: radial-gradient(circle at top,#193b6d,#06172f 64%,#020617); user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
        .dsv2-play-shell.fullscreen .dsv2-stats { margin: 0; grid-template-columns: repeat(6, minmax(88px,1fr)); }
        .dsv2-exit { display: none; border: 0; border-radius: 16px; padding: 10px 14px; font-family: var(--font-nunito); font-weight: 1000; background: linear-gradient(180deg,#fee2e2,#fb7185); color: #450a0a; box-shadow: 0 6px 0 #9f1239; cursor: pointer; touch-action: manipulation; }
        .dsv2-play-shell:not(.fullscreen) .dsv2-stats, .dsv2-play-shell:not(.fullscreen) .dsv2-phase-strip, .dsv2-play-shell:not(.fullscreen) .dsv2-card { display: none; }
        .dsv2-play-shell.fullscreen .dsv2-exit { display: block; }
        .dsv2-grid { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(310px,.65fr); gap: 16px; align-items: stretch; }
        .dsv2-play-shell.fullscreen .dsv2-grid { min-height: 0; }
        .dsv2-play-shell.fullscreen .dsv2-stage { min-height: min(58vh, 520px); }
        .dsv2-play-shell.fullscreen .dsv2-bg { height: 100%; object-fit: cover; }
        .dsv2-stage { position: relative; border-radius: 32px; overflow: hidden; border: 4px solid rgba(255,216,102,.9); background: radial-gradient(circle at center,#123f73,#07182f); box-shadow: 0 32px 92px rgba(0,0,0,.38); touch-action: manipulation; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
        .dsv2-bg { position: relative; display: block; width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: contain; object-position: center center; z-index: 0; }
        .dsv2-stage canvas { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; display: block; background: transparent; opacity: 1; pointer-events: none; }
        .dsv2-intro-overlay { position: absolute; inset: 0; z-index: 4; display: grid; place-items: center; padding: 20px; background: linear-gradient(180deg,rgba(4,10,25,.42),rgba(4,10,25,.72)); }
        .dsv2-intro-card { max-width: 620px; border-radius: 30px; padding: 24px; text-align: center; background: rgba(255,250,232,.96); color: #10203e; border: 4px solid #ffd866; box-shadow: 0 28px 70px rgba(0,0,0,.35); }
        .dsv2-intro-card h2 { font-family: var(--font-cinzel); font-size: clamp(1.7rem,4vw,2.7rem); margin: 0 0 8px; }
        .dsv2-intro-card p { font-family: var(--font-nunito); font-weight: 900; line-height: 1.45; }
        .dsv2-start-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 16px 0; }
        .dsv2-start-steps span { border-radius: 16px; padding: 10px; background: #dbeafe; font-family: var(--font-nunito); font-weight: 1000; }
        .dsv2-start { border: 0; border-radius: 22px; padding: 16px 26px; font-family: var(--font-nunito); font-size: 1.05rem; font-weight: 1000; color: #3b2307; background: linear-gradient(180deg,#fef08a,#f59e0b); box-shadow: 0 14px 0 #92400e, 0 26px 36px rgba(0,0,0,.28); cursor: pointer; touch-action: manipulation; }
        .dsv2-start:active, .dsv2-game-btn:active, .dsv2-power:active, .dsv2-choice:active { transform: translateY(4px); }
        .dsv2-overlay { position: absolute; z-index: 3; inset: auto 20px 18px 20px; display: flex; flex-wrap: nowrap; align-items: flex-end; justify-content: space-between; pointer-events: auto; }
        .dsv2-game-btn { pointer-events: auto; border: 0; border-radius: 999px; width: 76px; height: 76px; display: grid; place-items: center; font-family: var(--font-nunito); font-weight: 1000; font-size: .72rem; line-height: 1.2; color: #3b2307; background: linear-gradient(180deg,#fef3c7,#f59e0b); box-shadow: 0 7px 0 #92400e, 0 14px 28px rgba(0,0,0,.3); cursor: pointer; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
        .dsv2-game-btn * { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; pointer-events: none; }
        .dsv2-game-btn.release { color: #052e16; background: linear-gradient(180deg,#bbf7d0,#22c55e); box-shadow: 0 7px 0 #166534, 0 14px 28px rgba(0,0,0,.3); }
        .dsv2-game-btn.flash { animation: dsv2-pop .18s ease-out; }
        .dsv2-meter { position: absolute; z-index: 3; left: 16px; top: 16px; width: min(300px, calc(100% - 32px)); border-radius: 18px; padding: 12px; background: rgba(15,23,42,.76); border: 1px solid rgba(255,255,255,.22); font-family: var(--font-nunito); font-weight: 1000; }
        .dsv2-meter-track { height: 14px; border-radius: 999px; background: rgba(255,255,255,.18); overflow: hidden; margin: 6px 0; }
        .dsv2-meter-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#38bdf8,#22c55e,#facc15); transition: width .16s ease-out; }
        .dsv2-card { border-radius: 26px; padding: 18px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); box-shadow: 0 20px 60px rgba(0,0,0,.22); }
        .dsv2-card h2, .dsv2-card h3 { font-family: var(--font-nunito); font-weight: 1000; color: #ffd866; }
        .dsv2-card p { font-family: var(--font-lora); font-weight: 800; line-height: 1.58; color: rgba(255,255,255,.9); }
        .dsv2-choice, .dsv2-power { width: 100%; border: 0; border-radius: 18px; padding: 13px 15px; margin-top: 9px; text-align: left; font-family: var(--font-nunito); font-weight: 1000; background: linear-gradient(180deg,#ffffff,#dbeafe); color: #0d1f3c; box-shadow: 0 8px 0 #64748b, 0 16px 24px rgba(0,0,0,.18); cursor: pointer; touch-action: manipulation; }
        .dsv2-choice.selected { outline: 4px solid #fbbf24; }
        .dsv2-power.active { background: linear-gradient(180deg,#bbf7d0,#22c55e); box-shadow: 0 8px 0 #166534, 0 16px 24px rgba(0,0,0,.18); }
        .dsv2-power.flash { animation: dsv2-pop .18s ease-out; }
        .dsv2-power:disabled { opacity: .48; cursor: not-allowed; filter: grayscale(.25); transform: none; }
        .dsv2-scripture { border-radius: 20px; padding: 14px; background: rgba(15,23,42,.68); border: 1px solid rgba(255,255,255,.2); margin: 12px 0; }
        .dsv2-scripture strong { color: #bfdbfe; font-family: var(--font-nunito); }
        .dsv2-message { min-height: 44px; color: #fde68a !important; font-family: var(--font-nunito) !important; font-weight: 1000 !important; }
        @keyframes dsv2-pop { 0% { transform: scale(1); } 55% { transform: scale(1.08); } 100% { transform: scale(1); } }
        @media (max-width: 900px) { .dsv2-grid { grid-template-columns: 1fr; } .dsv2-stats { grid-template-columns: repeat(2,1fr); } .dsv2-play-shell.fullscreen { overflow: auto; grid-template-rows: auto auto auto; gap: 6px; } .dsv2-play-shell.fullscreen .dsv2-stats { grid-template-columns: repeat(6, minmax(48px,1fr)); gap: 5px; } .dsv2-play-shell.fullscreen .dsv2-stats div, .dsv2-play-shell.fullscreen .dsv2-exit { min-height: 46px; padding: 5px; border-radius: 12px; font-size: .7rem; } .dsv2-play-shell.fullscreen .dsv2-stat-icons { font-size: .78rem; white-space: nowrap; overflow: hidden; } .dsv2-play-shell.fullscreen .dsv2-phase-strip { gap: 5px; margin: 4px 0; } .dsv2-play-shell.fullscreen .dsv2-step { padding: 5px 7px; font-size: .72rem; } .dsv2-play-shell.fullscreen .dsv2-stage { min-height: 46vh; border-radius: 20px; } .dsv2-play-shell.fullscreen.phase-question .dsv2-card { order: -1; } .dsv2-play-shell.fullscreen.phase-question .dsv2-stage { min-height: 28vh; } .dsv2-play-shell.fullscreen.phase-question .dsv2-overlay { display: none; } .dsv2-play-shell.fullscreen .dsv2-card { max-height: none; } .dsv2-start-steps { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) { .dsv2-game-btn, .dsv2-power { animation: none !important; } .dsv2-meter-fill { transition: none; } }
        .dsv2-play-shell.fullscreen { height:100dvh; overflow:hidden; grid-template-rows:auto auto minmax(0,1fr); }
        .dsv2-play-shell.fullscreen .dsv2-stage { min-height:0; }
        .dsv2-play-shell.fullscreen .dsv2-bg { position:absolute; inset:0; width:100%; height:100%; }
        .dsv2-play-shell.fullscreen .dsv2-card { min-height:0; max-height:100%; overflow:auto; padding-bottom:28px; }
        @media (max-width:900px) {
          .dsv2-play-shell.fullscreen .dsv2-grid { grid-template-rows:minmax(190px,1fr) minmax(110px,.55fr); gap:8px; }
          .dsv2-play-shell.fullscreen.phase-question .dsv2-grid,.dsv2-play-shell.fullscreen.phase-result .dsv2-grid { grid-template-rows:minmax(0,1fr); }
          .dsv2-play-shell.fullscreen.phase-question .dsv2-stage,.dsv2-play-shell.fullscreen.phase-result .dsv2-stage { display:none; }
          .dsv2-play-shell.fullscreen .dsv2-meter { padding:8px; font-size:.8rem; }
          .dsv2-play-shell.fullscreen .dsv2-overlay { left:12px; right:12px; bottom:14px; }
        }
        @media (max-height:550px) and (orientation:landscape) {
          .dsv2-play-shell.fullscreen .dsv2-grid { grid-template-columns:minmax(0,1.2fr) minmax(260px,.8fr); grid-template-rows:minmax(0,1fr); }
          .dsv2-play-shell.fullscreen.phase-question .dsv2-grid,.dsv2-play-shell.fullscreen.phase-result .dsv2-grid { grid-template-columns:1fr; }
          .dsv2-play-shell.fullscreen .dsv2-phase-strip { display:none; }
          .dsv2-play-shell.fullscreen { grid-template-rows:auto minmax(0,1fr); }
        }
        .dsv2-play-shell.fullscreen .dsv2-bg { top: 88px; bottom: 100px; height: calc(100% - 188px); object-fit: contain; }
        .dsv2-play-shell.fullscreen .dsv2-stage { container-type: size; }
        @container (height < 340px) {
          .dsv2-play-shell.fullscreen .dsv2-bg { top: 0; bottom: 0; height: 100%; }
          .dsv2-play-shell.fullscreen .dsv2-meter { top: 6px; left: 8px; width: 190px; padding: 5px 8px; font-size: 11px; }
          .dsv2-play-shell.fullscreen .dsv2-meter-track { height: 5px; margin: 3px 0; }
          .dsv2-play-shell.fullscreen .dsv2-meter small { font-size: 9px; }
        }
        .dsv2-session-actions { display: flex; gap: 6px; padding: 0 !important; border: 0 !important; background: none !important; }
        .dsv2-session-actions button { flex: 1; min-width: 44px; min-height: 44px; }
        .dsv2-play-shell.fullscreen .dsv2-stats { grid-template-columns: repeat(5,minmax(0,1fr)) minmax(112px,1.6fr); }
        .dsv2-pause { border: 1px solid #a5c6df; border-radius: 12px; background: #183654; color: white; font-weight: 900; cursor: pointer; }
        .dsv2-pause-dialog { position: fixed; inset: 0; z-index: 10001; display: grid; place-items: center; padding: 20px; background: #041326d9; }
        .dsv2-pause-dialog > div { max-width: 420px; padding: 24px; border-radius: 24px; border: 3px solid #ffd866; background: #10294b; text-align: center; }
        .dsv2-pause-dialog h2 { color: #fff; }
        .dsv2-pause-dialog p { margin: 14px 0; }
        .dsv2-pause-dialog button { min-height: 48px; padding: 12px 20px; margin: 6px; }
        .dsv2-page button:focus-visible { outline: 4px solid #fde68a; outline-offset: 3px; }
        @media (max-width: 430px) { .dsv2-play-shell.fullscreen .dsv2-stats { grid-template-columns: repeat(5,minmax(0,1fr)); } .dsv2-session-actions { grid-column: 1 / -1; justify-self: end; } }
      `}</style>
      <div className="dsv2-wrap">
        <Link href="/games" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {copy.back}</Link>
        <section className="dsv2-hero">
          <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 20 }}>{copy.eyebrow}</p>
          <h1 className="dsv2-title">{copy.title}</h1>
          <p className="dsv2-subtitle">{copy.subtitle}</p>
          {!isGameOpen && <button className="dsv2-start dsv2-hero-start" type="button" onClick={(event) => { stopTap(event); begin() }}>▶ {copy.start}</button>}
        </section>
        <div data-phase={phase} data-paused={paused} data-holding={holdRef.current} data-pending={lockedRef.current} data-level={levelIndex + 1} className={`dsv2-play-shell ${isGameOpen ? `fullscreen phase-${phase}` : ''}`} onContextMenu={(event) => { if (isGameOpen) event.preventDefault() }}>
        <div className="dsv2-stats" inert={paused}>
          <div>{copy.level}<br />{Math.min(levelIndex + 1, LEVELS.length)}/{LEVELS.length}</div>
          <div>{copy.score}<br />{score}</div>
          <div>{copy.best}<br />{best}</div>
          <div>{copy.throws}<span className="dsv2-stat-icons">{'🪨'.repeat(Math.max(0, throwsLeft))}</span></div>
          <div>{copy.fuel}<span className="dsv2-stat-icons">{'💛'.repeat(Math.min(5, wisdomFuel)) || '0'}</span></div>
          <div className="dsv2-session-actions">
            {phase === 'play' && <button ref={pauseButtonRef} className="dsv2-pause" type="button" onClick={pauseGame}>{isRu ? 'Пауза' : 'Pause'}</button>}
            <button className="dsv2-exit" type="button" onClick={(event) => { stopTap(event); exitGame() }}>↩ {copy.quit}</button>
          </div>
        </div>
        <div className="dsv2-phase-strip" aria-label={isRu ? 'Этапы игры' : 'Game steps'}>
          {phaseSteps.map((step, index) => (
            <span className={`dsv2-step ${index === 0 && phase === 'question' ? 'active' : index === 1 && phase === 'play' ? 'active' : index === 2 && (phase === 'play' || phase === 'result') ? 'active' : ''}`} key={step}>{index + 1}. {step}</span>
          ))}
        </div>
        <section className="dsv2-grid" inert={paused}>
          <div className="dsv2-stage">
            <img className="dsv2-bg" src={BG} alt="" aria-hidden="true" />
            <canvas ref={canvasRef} aria-label={copy.title} />
            <div className="dsv2-meter" data-angle={releaseAngle} data-target={level.targetAngle - effectiveWind}>
              <span>{copy.speed}: {speedMeter}%</span>
              <div className="dsv2-meter-track"><div className="dsv2-meter-fill" style={{ width: `${speedMeter}%` }} /></div>
              <small>{copy.perfectZone} · {copy.wind}: {effectiveWind > 0 ? '+' : ''}{effectiveWind} · ±{effectiveWindow}°</small>
            </div>
            {phase === 'intro' && <div className="dsv2-intro-overlay"><div className="dsv2-intro-card"><h2>{copy.mission}</h2><div className="dsv2-start-steps"><span>📖 {copy.stepBible}</span><span>💛 {copy.stepPower}</span><span>🪨 {copy.stepPlay}</span></div><button className="dsv2-start" type="button" onClick={(event) => { stopTap(event); begin() }}>▶ {copy.start}</button></div></div>}
            {canUseGameControls && <div className="dsv2-overlay">
              <button className={`dsv2-game-btn ${buttonFlash === 'rhythm' ? 'flash' : ''}`} type="button" onClick={(event) => { stopTap(event); tapRhythm() }}>⚡<br />{copy.rhythm}</button>
              <button ref={holdButtonRef} className={`dsv2-game-btn release ${buttonFlash === 'hold' || buttonFlash === 'release' ? 'flash' : ''}`} type="button"
                onPointerDown={(event) => { stopTap(event); if (pointerRef.current !== null || holdRef.current || pausedRef.current || event.button !== 0) return; pointerRef.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); holdSpin() }}
                onPointerUp={(event) => { stopTap(event); if (pointerRef.current !== event.pointerId) return; pointerRef.current = null; if (holdRef.current) releaseThrow() }}
                onPointerCancel={(event) => { stopTap(event); if (pointerRef.current === event.pointerId) stopHold() }}
                onLostPointerCapture={(event) => { if (pointerRef.current === event.pointerId) stopHold() }}
                onKeyDown={(event) => { if ((event.code === 'Space' || event.code === 'Enter') && !event.repeat && pointerRef.current === null) { event.preventDefault(); holdSpin() } }}
                onKeyUp={(event) => { if ((event.code === 'Space' || event.code === 'Enter') && pointerRef.current === null) { event.preventDefault(); if (holdRef.current) releaseThrow() } }} onClick={stopTap}>🎯<br />{copy.hold}</button>
            </div>}
          </div>
          <aside className="dsv2-card">
            <p className="puzzle-label" style={{ color: '#ffd866' }}>{isRu ? level.nameRu : level.nameEn}</p>
            <h2>{phase === 'question' ? copy.questionTitle : result === 'ready' ? copy.release : copy[result]}</h2>
            <div className="dsv2-scripture">
              <p>&ldquo;{isRu ? SCRIPTURE.textRu : SCRIPTURE.textEn}&rdquo;</p>
              <strong>— {isRu ? SCRIPTURE.refRu : SCRIPTURE.refEn}</strong>
            </div>
            {phase === 'question' ? <>
              <p>{copy.questionHelp}</p>
              <h3>{isRu ? SCRIPTURE.questionRu : SCRIPTURE.questionEn}</h3>
              {choices.map((choice, index) => <button className={`dsv2-choice ${selectedAnswer === index ? 'selected' : ''}`} key={choice} type="button" onClick={(event) => { stopTap(event); answer(index) }}>{choice}</button>)}
            </> : <>
              <p className="dsv2-message">{message || copy.ready}</p>
              <h3>{isRu ? 'Усиления' : 'Power-ups'}</h3>
              <button disabled={!canChoosePower} className={`dsv2-power ${power === 'focus' ? 'active' : ''} ${buttonFlash === 'power' && power === 'focus' ? 'flash' : ''}`} type="button" onClick={(event) => { stopTap(event); choosePower('focus') }}>👁️ {copy.focus} · 💛1<br /><span>{copy.focusDesc}</span></button>
              <button disabled={!canChoosePower} className={`dsv2-power ${power === 'steady' ? 'active' : ''} ${buttonFlash === 'power' && power === 'steady' ? 'flash' : ''}`} type="button" onClick={(event) => { stopTap(event); choosePower('steady') }}>✋ {copy.steady} · 💛1<br /><span>{copy.steadyDesc}</span></button>
              <button disabled={!canChoosePower} className={`dsv2-power ${power === 'shield' ? 'active' : ''} ${buttonFlash === 'power' && power === 'shield' ? 'flash' : ''}`} type="button" onClick={(event) => { stopTap(event); choosePower('shield') }}>🛡️ {copy.shield} · 💛1<br /><span>{copy.shieldDesc}</span></button>
              <button disabled={!canChoosePower} className={`dsv2-power ${power === 'wind' ? 'active' : ''} ${buttonFlash === 'power' && power === 'wind' ? 'flash' : ''}`} type="button" onClick={(event) => { stopTap(event); choosePower('wind') }}>🌬️ {copy.calmWind} · 💛1<br /><span>{copy.windDesc}</span></button>
              {phase === 'result' && <>
                <h3>{result === 'perfect' || result === 'hit' ? (isRu ? 'Все три уровня пройдены!' : 'All three levels complete!') : (isRu ? 'Попробуй этот уровень снова — путь сохранён.' : 'Try this level again — keep your progress.')}</h3>
                {result !== 'perfect' && result !== 'hit' && <button className="dsv2-start" onClick={retryLevel}>{isRu ? 'Повторить уровень · 5 камней' : 'Retry level · 5 stones'}</button>}
                <button className="dsv2-choice" type="button" onClick={begin}>{copy.again}</button>
              </>}
            </>}
          </aside>
        </section>
        {paused && <div className="dsv2-pause-dialog" role="dialog" aria-modal="true" aria-labelledby="sling-pause-title" onKeyDown={(event) => {
          if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); resumeGame() }
          if (event.key === 'Tab') {
            const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button')
            if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1].focus() }
            else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0].focus() }
          }
        }}><div><h2 id="sling-pause-title">{isRu ? 'Пауза' : 'Paused'}</h2><p>{isRu ? 'Вращение и бросок ждут. Продолжи, когда будешь готов.' : 'Your sling and throw are waiting. Continue when you are ready.'}</p><button ref={resumeRef} className="dsv2-pause" onClick={resumeGame}>{isRu ? 'Продолжить' : 'Resume'}</button><button className="dsv2-pause" onClick={exitGame}>{copy.quit}</button></div></div>}
        </div>
      </div>
    </main>
  )
}
