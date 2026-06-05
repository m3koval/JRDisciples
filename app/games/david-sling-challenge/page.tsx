'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link'
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

function angleDiff(a: number, b: number) {
  const diff = Math.abs((((a - b) % 360) + 540) % 360 - 180)
  return diff
}

export default function DavidSlingChallengePage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const holdRef = useRef(false)
  const angleRef = useRef(28)
  const speedRef = useRef(0.45)
  const stoneRef = useRef<{ x: number; y: number; vx: number; vy: number; active: boolean }>({ x: 0, y: 0, vx: 0, vy: 0, active: false })
  const impactRef = useRef(0)

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

  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)]
  const effectiveWindow = level.window + (power === 'steady' ? 8 : 0)
  const effectiveWind = power === 'wind' ? Math.round(level.wind / 3) : level.wind

  const copy = isRu ? {
    back: 'Все игры', eyebrow: 'David Sling v2', title: 'Праща Давида',
    subtitle: 'Теперь это игровой прототип: набирай ритм, держи вращение и отпускай пращу в правильный момент. Божье Слово дает настоящую помощь в игре.',
    start: 'Начать v2', questionTitle: 'Сначала Божье Слово', questionHelp: 'Ответь правильно, чтобы получить Мудрость и усиление для броска.',
    correct: 'Верно! +2 Мудрости. Выбери усиление.', wrong: 'Хорошая попытка. Прочитай стих и попробуй снова.',
    rhythm: 'Нажимай ритм', hold: 'Держи вращение', release: 'Отпусти бросок', next: 'Следующий уровень', again: 'Снова',
    score: 'Очки', best: 'Рекорд', throws: 'Броски', fuel: 'Мудрость', wind: 'Ветер', level: 'Уровень',
    focus: 'Мудрый фокус', steady: 'Твердая рука', shield: 'Щит доверия', calmWind: 'Успокоить ветер',
    focusDesc: 'замедляет вращение', steadyDesc: 'расширяет окно', shieldDesc: 'спасает один промах', windDesc: 'уменьшает ветер',
    ready: 'Набери скорость пращи, удерживай вращение и отпусти по дуге.', perfect: 'Точно! Давид доверял Господу.', hit: 'Попадание! Хороший бросок.', near: 'Близко. Настрой ритм и попробуй еще.', miss: 'Промах. Не сдавайся — вера продолжает путь.', saved: 'Щит доверия дал повтор без потери.',
  } : {
    back: 'All Games', eyebrow: 'David Sling v2', title: 'David Sling Challenge',
    subtitle: 'Now rebuilt as a real game prototype: tap rhythm, hold the spin, and release the sling at the right moment. God’s Word gives real help inside the game.',
    start: 'Start v2', questionTitle: 'God’s Word First', questionHelp: 'Answer correctly to earn Wisdom Fuel and choose a throw advantage.',
    correct: 'Correct! +2 Wisdom Fuel. Choose a power-up.', wrong: 'Good try. Read the verse and try again.',
    rhythm: 'Tap Rhythm', hold: 'Hold Spin', release: 'Release Throw', next: 'Next Level', again: 'Play Again',
    score: 'Score', best: 'Best', throws: 'Throws', fuel: 'Wisdom', wind: 'Wind', level: 'Level',
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
    const width = Math.max(720, Math.round(rect.width * dpr))
    const height = Math.max(420, Math.round(rect.height * dpr))
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    ctx.save()
    ctx.scale(dpr, dpr)
    const w = width / dpr
    const h = height / dpr

    ctx.clearRect(0, 0, w, h)

    const david = { x: w * 0.22, y: h * 0.62 }
    const target = { x: w * 0.78, y: h * 0.48 }
    const nowAngle = angleRef.current
    const radians = (nowAngle * Math.PI) / 180
    const aimLength = w * 0.47
    const arcEnd = { x: david.x + Math.cos(radians) * aimLength, y: david.y - Math.sin(radians) * h * 0.52 }
    const targetAngle = level.targetAngle + effectiveWind
    const targetRad = (targetAngle * Math.PI) / 180
    const zoneEnd = { x: david.x + Math.cos(targetRad) * aimLength, y: david.y - Math.sin(targetRad) * h * 0.52 }

    ctx.lineCap = 'round'
    ctx.lineWidth = 16
    ctx.strokeStyle = 'rgba(34,197,94,.32)'
    ctx.beginPath()
    ctx.moveTo(david.x, david.y)
    ctx.quadraticCurveTo(w * 0.48, h * 0.12, zoneEnd.x, zoneEnd.y)
    ctx.stroke()

    ctx.lineWidth = 5
    ctx.setLineDash([11, 12])
    ctx.strokeStyle = 'rgba(255,255,255,.9)'
    ctx.shadowBlur = 14
    ctx.shadowColor = '#facc15'
    ctx.beginPath()
    ctx.moveTo(david.x, david.y)
    ctx.quadraticCurveTo(w * 0.47, h * 0.14, arcEnd.x, arcEnd.y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.shadowBlur = 0

    ctx.strokeStyle = '#78350f'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(david.x, david.y, 34 + speedRef.current * 4, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#57534e'
    ctx.beginPath()
    ctx.arc(david.x + Math.cos(radians) * 38, david.y - Math.sin(radians) * 38, 9, 0, Math.PI * 2)
    ctx.fill()

    const stone = stoneRef.current
    if (stone.active) {
      stone.x += stone.vx
      stone.y += stone.vy
      stone.vy += 0.32
      ctx.fillStyle = '#f8fafc'
      ctx.shadowBlur = 20
      ctx.shadowColor = '#fde68a'
      ctx.beginPath()
      ctx.arc(stone.x, stone.y, 11, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      if (stone.x > w * 0.9 || stone.y > h * 0.9) stone.active = false
    }

    if (impactRef.current > 0) {
      impactRef.current -= 1
      ctx.fillStyle = `rgba(250,204,21,${impactRef.current / 26})`
      ctx.beginPath()
      ctx.arc(target.x, target.y, 30 + (26 - impactRef.current) * 3, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = 'rgba(15,23,42,.72)'
    ctx.fillRect(14, 14, 230, 76)
    ctx.fillStyle = '#fff7ed'
    ctx.font = '800 16px Nunito, sans-serif'
    ctx.fillText(`${copy.wind}: ${effectiveWind > 0 ? '+' : ''}${effectiveWind}`, 28, 42)
    ctx.fillText(`${isRu ? 'Окно' : 'Window'}: ±${effectiveWindow}°`, 28, 68)

    ctx.restore()
    rafRef.current = window.requestAnimationFrame(draw)
  }, [copy.wind, effectiveWind, effectiveWindow, isRu, level.targetAngle])

  useEffect(() => {
    const stored = Number(localStorage.getItem('david-sling-v2-best') || '0')
    setBest(Number.isFinite(stored) ? stored : 0)
    rafRef.current = window.requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [draw])

  useEffect(() => {
    if (phase !== 'play') return
    const timer = window.setInterval(() => {
      const slow = power === 'focus' ? 0.48 : 1
      angleRef.current = (angleRef.current + speedRef.current * slow) % 360
      if (!holdRef.current) speedRef.current = clamp(speedRef.current - 0.018, 0.45, 5.2)
    }, 16)
    return () => window.clearInterval(timer)
  }, [phase, power])

  useEffect(() => {
    const onDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        holdSpin()
      }
    }
    const onUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
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

  function begin() {
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
    stoneRef.current.active = false
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
    if (wisdomFuel < cost) return
    setWisdomFuel((value) => value - cost)
    setPower(next)
    setMessage(next === 'focus' ? copy.focusDesc : next === 'steady' ? copy.steadyDesc : next === 'shield' ? copy.shieldDesc : next === 'wind' ? copy.windDesc : copy.ready)
  }

  function tapRhythm() {
    if (phase !== 'play') return
    speedRef.current = clamp(speedRef.current + 0.62, 0.45, 5.2)
    setMessage(copy.ready)
  }

  function holdSpin() {
    if (phase !== 'play') return
    holdRef.current = true
    speedRef.current = clamp(speedRef.current + 0.18, 0.45, 5.2)
  }

  function stopHold() {
    holdRef.current = false
  }

  function releaseThrow() {
    if (phase !== 'play' || throwsLeft <= 0 || stoneRef.current.active) return
    holdRef.current = false
    const adjustedAngle = (angleRef.current + effectiveWind + 360) % 360
    const diff = angleDiff(adjustedAngle, level.targetAngle)
    const launch = (angleRef.current * Math.PI) / 180
    const canvas = canvasRef.current
    const rect = canvas?.getBoundingClientRect()
    const w = rect?.width || 900
    const h = rect?.height || 520
    stoneRef.current = {
      x: w * 0.22,
      y: h * 0.62,
      vx: Math.cos(launch) * (11 + level.distance * 2),
      vy: -Math.sin(launch) * (9 + level.distance * 2.5),
      active: true,
    }
    setThrowsLeft((value) => Math.max(0, value - 1))

    let points = 0
    let nextResult: Result = 'miss'
    if (diff <= 3) { points = 120; nextResult = 'perfect'; impactRef.current = 26 }
    else if (diff <= effectiveWindow) { points = 75; nextResult = 'hit'; impactRef.current = 22 }
    else if (diff <= effectiveWindow + 9) { points = 25; nextResult = 'near'; impactRef.current = 12 }
    else if (power === 'shield') { nextResult = 'saved'; points = 0 }

    setResult(nextResult)
    setMessage(copy[nextResult])
    setScore((current) => {
      const next = current + points
      const bestNext = Math.max(best, next)
      setBest(bestNext)
      localStorage.setItem('david-sling-v2-best', String(bestNext))
      return next
    })

    if (nextResult === 'perfect' || nextResult === 'hit') {
      window.setTimeout(() => {
        if (levelIndex < LEVELS.length - 1) {
          setLevelIndex((value) => value + 1)
          setPhase('question')
          setSelectedAnswer(null)
          setPower('none')
          setMessage('')
          angleRef.current = 28
          speedRef.current = 0.45
        } else {
          setPhase('result')
        }
      }, 950)
    } else if (throwsLeft <= 1) {
      window.setTimeout(() => setPhase('result'), 850)
    }
  }

  const choices = isRu ? SCRIPTURE.choicesRu : SCRIPTURE.choicesEn

  return (
    <main className="dsv2-page">
      <style>{`
        .dsv2-page { min-height: 100vh; color: #fff; background: linear-gradient(180deg,#06172f,#10294b 62%,#f8fafc); }
        .dsv2-wrap { max-width: 1180px; margin: 0 auto; padding: 24px 14px 58px; }
        .dsv2-hero { max-width: 920px; }
        .dsv2-title { font-family: var(--font-cinzel); font-size: clamp(1.95rem,5.8vw,4.1rem); line-height: .95; margin: 4px 0 10px; }
        .dsv2-subtitle { font-family: var(--font-lora); color: rgba(255,255,255,.9); font-weight: 800; line-height: 1.45; }
        .dsv2-stats { display: grid; grid-template-columns: repeat(5,1fr); gap: 9px; margin: 12px 0; }
        .dsv2-stats div { border-radius: 16px; padding: 10px; background: rgba(15,23,42,.72); border: 1px solid rgba(255,255,255,.18); text-align: center; font-family: var(--font-nunito); font-weight: 1000; }
        .dsv2-grid { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(310px,.65fr); gap: 16px; align-items: stretch; }
        .dsv2-stage { position: relative; border-radius: 32px; overflow: hidden; border: 4px solid rgba(255,216,102,.9); background: radial-gradient(circle at center,#123f73,#07182f); box-shadow: 0 32px 92px rgba(0,0,0,.38); touch-action: none; }
        .dsv2-bg { position: relative; display: block; width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: contain; object-position: center center; z-index: 0; }
        .dsv2-stage canvas { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; display: block; background: transparent; opacity: 1; }
        .dsv2-overlay { position: absolute; inset: auto 16px 16px 16px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: center; pointer-events: none; }
        .dsv2-overlay button { pointer-events: auto; border: 0; border-radius: 18px; padding: 14px 18px; min-height: 56px; font-family: var(--font-nunito); font-weight: 1000; background: linear-gradient(180deg,#fef08a,#f59e0b); color: #3b2307; box-shadow: 0 12px 28px rgba(0,0,0,.25); }
        .dsv2-card { border-radius: 26px; padding: 18px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); box-shadow: 0 20px 60px rgba(0,0,0,.22); }
        .dsv2-card h2, .dsv2-card h3 { font-family: var(--font-nunito); font-weight: 1000; color: #ffd866; }
        .dsv2-card p { font-family: var(--font-lora); font-weight: 800; line-height: 1.58; color: rgba(255,255,255,.9); }
        .dsv2-choice, .dsv2-power { width: 100%; border: 0; border-radius: 16px; padding: 12px 14px; margin-top: 9px; text-align: left; font-family: var(--font-nunito); font-weight: 1000; background: rgba(255,255,255,.95); color: #0d1f3c; box-shadow: 0 10px 24px rgba(0,0,0,.18); }
        .dsv2-choice.selected { outline: 4px solid #fbbf24; }
        .dsv2-power.active { background: linear-gradient(180deg,#bbf7d0,#22c55e); }
        .dsv2-scripture { border-radius: 20px; padding: 14px; background: rgba(15,23,42,.68); border: 1px solid rgba(255,255,255,.2); margin: 12px 0; }
        .dsv2-scripture strong { color: #bfdbfe; font-family: var(--font-nunito); }
        .dsv2-message { min-height: 44px; color: #fde68a !important; font-family: var(--font-nunito) !important; font-weight: 1000 !important; }
        @media (max-width: 900px) { .dsv2-grid { grid-template-columns: 1fr; } .dsv2-stats { grid-template-columns: repeat(2,1fr); } }
      `}</style>
      <div className="dsv2-wrap">
        <Link href="/games" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {copy.back}</Link>
        <section className="dsv2-hero">
          <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 20 }}>{copy.eyebrow}</p>
          <h1 className="dsv2-title">{copy.title}</h1>
          <p className="dsv2-subtitle">{copy.subtitle}</p>
        </section>
        <div className="dsv2-stats">
          <div>{copy.level}<br />{Math.min(levelIndex + 1, LEVELS.length)}/{LEVELS.length}</div>
          <div>{copy.score}<br />{score}</div>
          <div>{copy.best}<br />{best}</div>
          <div>{copy.throws}<br />{throwsLeft}</div>
          <div>{copy.fuel}<br />{wisdomFuel}</div>
        </div>
        <section className="dsv2-grid">
          <div className="dsv2-stage" onPointerDown={holdSpin} onPointerUp={releaseThrow} onPointerLeave={stopHold}>
            <img className="dsv2-bg" src={BG} alt="" aria-hidden="true" />
            <canvas ref={canvasRef} aria-label={copy.title} />
            {phase === 'intro' && <div className="arena-overlay"><div><h2>{copy.title}</h2><p>{copy.subtitle}</p><button className="pz-btn" onClick={begin}>{copy.start}</button></div></div>}
            <div className="dsv2-overlay">
              <button onClick={(e) => { e.stopPropagation(); tapRhythm() }}>{copy.rhythm}</button>
              <button onPointerDown={(e) => { e.stopPropagation(); holdSpin() }} onPointerUp={(e) => { e.stopPropagation(); releaseThrow() }}>{copy.hold} / {copy.release}</button>
            </div>
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
              {choices.map((choice, index) => <button className={`dsv2-choice ${selectedAnswer === index ? 'selected' : ''}`} key={choice} onClick={() => answer(index)}>{choice}</button>)}
            </> : <>
              <p className="dsv2-message">{message || copy.ready}</p>
              <h3>{isRu ? 'Усиления' : 'Power-ups'}</h3>
              <button className={`dsv2-power ${power === 'focus' ? 'active' : ''}`} onClick={() => choosePower('focus')}>{copy.focus} · 1<br /><span>{copy.focusDesc}</span></button>
              <button className={`dsv2-power ${power === 'steady' ? 'active' : ''}`} onClick={() => choosePower('steady')}>{copy.steady} · 1<br /><span>{copy.steadyDesc}</span></button>
              <button className={`dsv2-power ${power === 'shield' ? 'active' : ''}`} onClick={() => choosePower('shield')}>{copy.shield} · 1<br /><span>{copy.shieldDesc}</span></button>
              <button className={`dsv2-power ${power === 'wind' ? 'active' : ''}`} onClick={() => choosePower('wind')}>{copy.calmWind} · 1<br /><span>{copy.windDesc}</span></button>
              {phase === 'result' && <button className="pz-btn" style={{ width: '100%', marginTop: 14 }} onClick={begin}>{copy.again}</button>}
            </>}
          </aside>
        </section>
      </div>
    </main>
  )
}
