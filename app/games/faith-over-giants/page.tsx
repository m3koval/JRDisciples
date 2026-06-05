'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type Phase = 'intro' | 'question' | 'play' | 'levelComplete' | 'victory' | 'defeat'
type Powerup = 'people' | 'health' | 'strength'
type Question = {
  promptEn: string
  promptRu: string
  choicesEn: string[]
  choicesRu: string[]
  answer: number
  feedbackEn: string
  feedbackRu: string
}
type Scripture = {
  refEn: string
  refRu: string
  textEn: string
  textRu: string
  question: Question
}
type Level = {
  nameEn: string
  nameRu: string
  giants: number
  fear: number
  speed: number
  scriptureIndex: number
}

const SCRIPTURE: Scripture[] = [
  {
    refEn: 'Joshua 1:9',
    refRu: 'Иисуса Навина 1:9',
    textEn: 'Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go.”',
    textRu: 'Вот Я повелеваю тебе: будь тверд и мужествен, не страшись и не ужасайся; ибо с тобою Господь Бог твой везде, куда ни пойдешь.',
    question: {
      promptEn: 'What did God tell Joshua to be?',
      promptRu: 'Каким Бог повелел быть Иисусу Навину?',
      choicesEn: ['Strong and courageous', 'Proud and loud', 'Afraid and hidden'],
      choicesRu: ['Твердым и мужественным', 'Гордым и шумным', 'Испуганным и спрятанным'],
      answer: 0,
      feedbackEn: 'Yes. Courage means trusting God and obeying Him.',
      feedbackRu: 'Да. Мужество — это доверять Богу и слушаться Его.',
    },
  },
  {
    refEn: 'Numbers 14:9',
    refRu: 'Числа 14:9',
    textEn: 'Only do not rebel against the LORD. And do not fear the people of the land, for they are bread for us. Their protection is removed from them, and the LORD is with us; do not fear them.”',
    textRu: 'только против Господа не восставайте и не бойтесь народа земли сей, ибо он достанется нам на съедение: защиты у них не стало, а с нами Господь; не бойтесь их.',
    question: {
      promptEn: 'Why did Caleb say not to fear?',
      promptRu: 'Почему Халев сказал не бояться?',
      choicesEn: ['Because the LORD was with them', 'Because the giants were tiny', 'Because fear always wins'],
      choicesRu: ['Потому что с ними был Господь', 'Потому что великаны были маленькие', 'Потому что страх всегда побеждает'],
      answer: 0,
      feedbackEn: 'Right. The faithful report looked at God, not only the giants.',
      feedbackRu: 'Верно. Верный ответ смотрел на Бога, а не только на великанов.',
    },
  },
  {
    refEn: 'Deuteronomy 31:6',
    refRu: 'Второзаконие 31:6',
    textEn: 'Be strong and courageous. Do not fear or be in dread of them, for it is the LORD your God who goes with you. He will not leave you or forsake you.”',
    textRu: 'Будьте тверды и мужественны, не бойтесь, и не страшитесь их, ибо Господь Бог твой Сам пойдет с тобою, не отступит от тебя и не оставит тебя.',
    question: {
      promptEn: 'What promise helps God’s people keep going?',
      promptRu: 'Какое обещание помогает Божьему народу идти дальше?',
      choicesEn: ['God goes with His people', 'We never need help', 'Big problems are not real'],
      choicesRu: ['Бог идет со Своим народом', 'Нам никогда не нужна помощь', 'Больших трудностей не бывает'],
      answer: 0,
      feedbackEn: 'Good line. God does not leave His people alone.',
      feedbackRu: 'Правильно. Бог не оставляет Свой народ один.',
    },
  },
]

const LEVELS: Level[] = [
  { nameEn: 'Scout the Land', nameRu: 'Осмотреть землю', giants: 1, fear: 40, speed: 1.1, scriptureIndex: 0 },
  { nameEn: 'Grapes of Promise', nameRu: 'Виноград обетования', giants: 2, fear: 50, speed: 1.2, scriptureIndex: 1 },
  { nameEn: 'The Fear Report', nameRu: 'Испуганный ответ', giants: 3, fear: 62, speed: 1.35, scriptureIndex: 1 },
  { nameEn: 'Caleb Speaks Up', nameRu: 'Халев говорит верно', giants: 4, fear: 74, speed: 1.5, scriptureIndex: 1 },
  { nameEn: 'Courage Camp', nameRu: 'Стан мужества', giants: 5, fear: 88, speed: 1.65, scriptureIndex: 2 },
  { nameEn: 'Jordan Crossing', nameRu: 'Переход Иордана', giants: 6, fear: 102, speed: 1.82, scriptureIndex: 0 },
  { nameEn: 'Jericho March', nameRu: 'Марш у Иерихона', giants: 7, fear: 118, speed: 2, scriptureIndex: 2 },
  { nameEn: 'Hill Country Challenge', nameRu: 'Испытание горной земли', giants: 8, fear: 136, speed: 2.2, scriptureIndex: 0 },
  { nameEn: 'Stand Together', nameRu: 'Стоять вместе', giants: 9, fear: 154, speed: 2.42, scriptureIndex: 2 },
  { nameEn: 'Level 10: Promise Boss', nameRu: 'Уровень 10: Страх-великан', giants: 1, fear: 190, speed: 2.7, scriptureIndex: 0 },
]

const powerups: Record<Powerup, { cost: number; labelEn: string; labelRu: string; descEn: string; descRu: string }> = {
  people: {
    cost: 3,
    labelEn: 'Stand Together',
    labelRu: 'Стоять вместе',
    descEn: '+1 helper for stronger courage steps',
    descRu: '+1 помощник для сильных шагов мужества',
  },
  health: {
    cost: 2,
    labelEn: 'Courage Rest',
    labelRu: 'Отдых мужества',
    descEn: 'Regain 2 hearts',
    descRu: 'Вернуть 2 сердца',
  },
  strength: {
    cost: 4,
    labelEn: 'Be Strong',
    labelRu: 'Будь тверд',
    descEn: 'Temporary strong push against fear',
    descRu: 'Временный сильный шаг против страха',
  },
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export default function FaithOverGiantsPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const [phase, setPhase] = useState<Phase>('intro')
  const [levelIndex, setLevelIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fearLine, setFearLine] = useState(16)
  const [health, setHealth] = useState(6)
  const [helpers, setHelpers] = useState(2)
  const [wisdomFuel, setWisdomFuel] = useState(0)
  const [strengthTurns, setStrengthTurns] = useState(0)
  const [message, setMessage] = useState('')
  const [bestLevel, setBestLevel] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)]
  const scripture = SCRIPTURE[level.scriptureIndex]
  const progressPercent = clamp((progress / level.fear) * 100, 0, 100)
  const isBoss = levelIndex === LEVELS.length - 1
  const couragePower = useMemo(() => helpers * 7 + (strengthTurns > 0 ? 16 : 0), [helpers, strengthTurns])

  const copy = isRu ? {
    back: 'Все игры',
    eyebrow: 'Библейская стратегия',
    title: 'Вера сильнее великанов',
    subtitle: 'Веди народ вперед, отвечай на Божье Слово внутри игры и побеждай страх мужеством, послушанием и доверием Господу.',
    start: 'Начать путь',
    continue: 'Следующий уровень',
    restart: 'Играть снова',
    playAgain: 'Повторить путь',
    level: 'Уровень',
    hearts: 'Сердца',
    helpers: 'Помощники',
    fuel: 'Мудрость',
    fear: 'Страх',
    courage: 'Мужество',
    answerTitle: 'Сначала Божье Слово',
    answerHelp: 'Ответь правильно, чтобы получить Мудрость для усилений.',
    correct: 'Верно! +2 Мудрости.',
    wrong: 'Хорошая попытка. Посмотри на стих и попробуй снова.',
    stand: 'Шаг мужества',
    report: 'Верный ответ',
    victory: 'Победа веры!',
    defeat: 'Страх остановил путь. Попробуй снова с Божьим Словом.',
    completed: 'Уровень пройден. Великаны выглядели большими, но Бог больше страха.',
    bossHint: 'Финальный босс — не человек. Это большой страх, который Божий народ должен отвергнуть.',
    powerupsTitle: 'Усиления',
    scriptureTitle: 'Стих внутри игры',
    bigTruth: 'Главная истина: Божьи обещания больше великанов, которых мы боимся.',
  } : {
    back: 'All Games',
    eyebrow: 'Bible Strategy Game',
    title: 'Faith Over Giants',
    subtitle: 'Lead the people forward, answer God’s Word inside the game, and push back fear with courage, obedience, and trust in the Lord.',
    start: 'Start the Journey',
    continue: 'Next Level',
    restart: 'Play Again',
    playAgain: 'Run It Back',
    level: 'Level',
    hearts: 'Hearts',
    helpers: 'Helpers',
    fuel: 'Wisdom Fuel',
    fear: 'Fear',
    courage: 'Courage',
    answerTitle: 'God’s Word First',
    answerHelp: 'Answer correctly to earn Wisdom Fuel for power-ups.',
    correct: 'Correct! +2 Wisdom Fuel.',
    wrong: 'Good try. Look at the verse and try again.',
    stand: 'Courage Step',
    report: 'Faithful Report',
    victory: 'Faith Victory!',
    defeat: 'Fear stopped the journey. Try again with God’s Word.',
    completed: 'Level cleared. The giants looked big, but God is greater than fear.',
    bossHint: 'The final boss is not a person. It is big fear that God’s people must reject.',
    powerupsTitle: 'Power-ups',
    scriptureTitle: 'Scripture inside the game',
    bigTruth: 'Big truth: God’s promises are bigger than the giants we fear.',
  }

  useEffect(() => {
    const stored = Number(localStorage.getItem('faith-over-giants-best-level') || '0')
    setBestLevel(Number.isFinite(stored) ? stored : 0)
  }, [])

  useEffect(() => {
    if (phase !== 'play') return
    const timer = window.setInterval(() => {
      setFearLine((value) => {
        const next = value + level.speed
        if (next >= 100) {
          setHealth((h) => Math.max(0, h - 1))
          setMessage(isRu ? 'Страх подошел близко — держись Божьего обещания.' : 'Fear pressed close — hold to God’s promise.')
          return 26
        }
        return next
      })
    }, 850)
    return () => window.clearInterval(timer)
  }, [phase, level.speed, isRu])

  useEffect(() => {
    if (phase !== 'play') return
    if (health <= 0) {
      setPhase('defeat')
      return
    }
    if (progress >= level.fear) {
      if (levelIndex >= LEVELS.length - 1) {
        setPhase('victory')
        setBestLevel(10)
        localStorage.setItem('faith-over-giants-best-level', '10')
      } else {
        setPhase('levelComplete')
        const nextBest = Math.max(bestLevel, levelIndex + 1)
        setBestLevel(nextBest)
        localStorage.setItem('faith-over-giants-best-level', String(nextBest))
      }
    }
  }, [phase, health, progress, level.fear, levelIndex, bestLevel])

  function startGame() {
    setPhase('question')
    setLevelIndex(0)
    setProgress(0)
    setFearLine(16)
    setHealth(6)
    setHelpers(2)
    setWisdomFuel(0)
    setStrengthTurns(0)
    setSelectedAnswer(null)
    setMessage('')
  }

  function answerQuestion(index: number) {
    setSelectedAnswer(index)
    if (index === scripture.question.answer) {
      setWisdomFuel((fuel) => fuel + 2)
      setMessage(copy.correct)
      window.setTimeout(() => {
        setSelectedAnswer(null)
        setPhase('play')
      }, 650)
    } else {
      setMessage(copy.wrong)
    }
  }

  function nextLevel() {
    setLevelIndex((current) => current + 1)
    setProgress(0)
    setFearLine(16)
    setHealth((h) => Math.min(6, h + 1))
    setStrengthTurns(0)
    setSelectedAnswer(null)
    setMessage('')
    setPhase('question')
  }

  function courageStep() {
    if (phase !== 'play') return
    setProgress((value) => value + couragePower)
    setFearLine((value) => clamp(value - 7, 10, 100))
    setMessage(isRu ? 'Верный ответ отталкивает страх.' : 'A faithful report pushes fear back.')
    if (strengthTurns > 0) setStrengthTurns((turns) => Math.max(0, turns - 1))
  }

  function spendPowerup(kind: Powerup) {
    const power = powerups[kind]
    if (phase !== 'play' || wisdomFuel < power.cost) return
    setWisdomFuel((fuel) => fuel - power.cost)
    if (kind === 'people') {
      setHelpers((count) => Math.min(8, count + 1))
      setMessage(isRu ? 'Еще один помощник стал рядом.' : 'Another helper stood with the team.')
    }
    if (kind === 'health') {
      setHealth((value) => Math.min(6, value + 2))
      setMessage(isRu ? 'Отдых восстановил сердца.' : 'Courage Rest restored hearts.')
    }
    if (kind === 'strength') {
      setStrengthTurns(3)
      setMessage(isRu ? 'Следующие шаги сильнее: будь тверд и мужествен.' : 'The next steps are stronger: be strong and courageous.')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#071225,#123522 54%,#f8fafc)', color: '#fff' }}>
      <style>{`
        .giants-wrap { max-width: 1140px; margin: 0 auto; padding: 24px 14px 56px; }
        .giants-grid { display: grid; grid-template-columns: minmax(0,1.25fr) minmax(292px,.75fr); gap: 18px; align-items: stretch; }
        .promise-arena { position: relative; min-height: 570px; overflow: hidden; border-radius: 34px; border: 4px solid rgba(255,216,102,.86); background: linear-gradient(180deg,#80c7e8 0%,#dbeafe 31%,#d8b46f 32%,#73612e 100%); box-shadow: 0 30px 90px rgba(0,0,0,.34); isolation: isolate; touch-action: manipulation; }
        .promise-arena::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 18% 14%,rgba(255,255,255,.78),transparent 12%),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px); background-size: auto,52px 52px; pointer-events: none; }
        .promise-arena::after { content: ''; position: absolute; left: -10%; right: -10%; bottom: 0; height: 28%; background: radial-gradient(ellipse at 24% 100%,#426b25 0 26%,transparent 27%),radial-gradient(ellipse at 64% 100%,#31591e 0 28%,transparent 29%),linear-gradient(180deg,transparent,#244819 54%,#173214); z-index: 0; }
        .hills { position: absolute; inset: auto 0 28% 0; height: 34%; background: linear-gradient(135deg,transparent 0 20%,rgba(103,86,46,.65) 21% 42%,transparent 43%),linear-gradient(225deg,transparent 0 19%,rgba(76,100,60,.7) 20% 44%,transparent 45%); opacity: .9; z-index: 0; }
        .team { position: absolute; left: 7%; bottom: 11%; z-index: 4; display: flex; align-items: end; gap: 7px; }
        .helper { width: 42px; height: 76px; border-radius: 24px 24px 14px 14px; background: linear-gradient(180deg,#f8d29a 0 25%,#fef3c7 26% 33%,#2563eb 34% 72%,#78350f 73%); border: 3px solid rgba(255,255,255,.78); box-shadow: 0 10px 26px rgba(0,0,0,.24); display: grid; place-items: start center; padding-top: 5px; font-size: 1.15rem; }
        .helper.leader { width: 54px; height: 92px; background: linear-gradient(180deg,#f8d29a 0 24%,#fef3c7 25% 32%,#16a34a 33% 72%,#78350f 73%); font-size: 1.45rem; }
        .giant-line { position: absolute; right: 8%; bottom: 11%; z-index: 3; display: flex; align-items: end; gap: 8px; transform: translateX(calc((100 - var(--fear-line)) * .62%)); transition: transform .45s ease; }
        .giant { width: 54px; height: 118px; border-radius: 34px 34px 18px 18px; background: linear-gradient(180deg,#64748b,#1e293b); border: 4px solid #cbd5e1; box-shadow: 0 16px 38px rgba(0,0,0,.32); display: grid; place-items: center; font-family: var(--font-nunito); font-weight: 1000; color: #fff; }
        .giant.boss { width: 106px; height: 196px; border-radius: 64px 64px 28px 28px; background: linear-gradient(180deg,#78350f,#1e293b 58%,#020617); border-color: #fed7aa; font-size: 1.45rem; box-shadow: 0 26px 70px rgba(0,0,0,.42),0 0 46px rgba(249,115,22,.28); }
        .promise-light { position: absolute; left: 50%; top: 18%; width: 180px; height: 180px; transform: translateX(-50%); border-radius: 999px; background: radial-gradient(circle,rgba(255,255,255,.92) 0 12%,rgba(255,216,102,.56) 13% 42%,transparent 70%); filter: blur(.3px); z-index: 1; }
        .progress-path { position: absolute; left: 8%; right: 8%; bottom: 6%; height: 18px; border-radius: 999px; background: rgba(15,23,42,.72); border: 2px solid rgba(255,255,255,.72); z-index: 5; overflow: hidden; }
        .progress-path span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg,#fef08a,#22c55e); width: var(--progress); box-shadow: 0 0 20px rgba(34,197,94,.7); }
        .giants-card { border-radius: 26px; padding: 18px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); box-shadow: 0 20px 60px rgba(0,0,0,.2); }
        .giants-stat { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; margin: 14px 0; }
        .giants-stat div { border-radius: 16px; padding: 9px; background: rgba(15,23,42,.76); border: 1px solid rgba(255,255,255,.18); text-align: center; font-family: var(--font-nunito); font-weight: 1000; }
        .answer-grid { display: grid; gap: 10px; margin-top: 14px; }
        .answer-grid button, .power-row button { border: 0; border-radius: 16px; padding: 12px 14px; font-family: var(--font-nunito); font-weight: 1000; text-align: left; background: rgba(255,255,255,.94); color: #0d1f3c; box-shadow: 0 10px 22px rgba(0,0,0,.18); }
        .answer-grid button.selected { outline: 4px solid #fbbf24; }
        .power-row { display: grid; gap: 10px; margin-top: 10px; }
        .power-row button:disabled { opacity: .48; filter: grayscale(.35); }
        .arena-overlay { position: absolute; inset: 0; z-index: 8; display: grid; place-items: center; padding: 18px; background: rgba(5,9,20,.62); }
        .arena-overlay > div { max-width: 650px; border-radius: 28px; padding: 24px; background: rgba(255,255,255,.96); color: #0d1f3c; border: 3px solid #ffd866; text-align: center; }
        @media (max-width: 880px) { .giants-grid { grid-template-columns: 1fr; } .promise-arena { min-height: 470px; } .giants-stat { grid-template-columns: repeat(2,1fr); } .giant { width: 42px; height: 94px; } .giant.boss { width: 78px; height: 148px; } .helper { width: 34px; height: 62px; } .helper.leader { width: 44px; height: 78px; } }
      `}</style>

      <div className="giants-wrap">
        <Link href="/games" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {copy.back}</Link>
        <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 20 }}>{copy.eyebrow}</p>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,7vw,4.35rem)', lineHeight: 1, margin: '6px 0 12px' }}>{copy.title}</h1>
        <p style={{ maxWidth: 840, fontFamily: 'var(--font-lora)', color: 'rgba(255,255,255,.9)', fontWeight: 700, lineHeight: 1.7 }}>{copy.subtitle}</p>

        <div className="giants-stat">
          <div>{copy.level}<br />{Math.min(levelIndex + 1, 10)}/10</div>
          <div>{copy.hearts}<br />{'❤️'.repeat(health) || '—'}</div>
          <div>{copy.helpers}<br />{helpers}</div>
          <div>{copy.fuel}<br />{wisdomFuel}</div>
          <div>{isRu ? 'Лучший' : 'Best'}<br />{bestLevel}/10</div>
        </div>

        <section className="giants-grid">
          <div className="promise-arena" aria-label={copy.title}>
            <div className="hills" aria-hidden="true" />
            <div className="promise-light" aria-hidden="true" />
            <div className="team" aria-hidden="true">
              <div className="helper leader">🛡️</div>
              {Array.from({ length: Math.max(0, Math.min(helpers - 1, 7)) }).map((_, index) => <div key={index} className="helper">👣</div>)}
            </div>
            <div className="giant-line" style={{ ['--fear-line' as string]: fearLine }} aria-hidden="true">
              {isBoss ? <div className="giant boss">{isRu ? 'Страх' : 'Fear'}</div> : Array.from({ length: level.giants }).map((_, index) => <div key={index} className="giant">!</div>)}
            </div>
            <div className="progress-path" aria-label={`${copy.courage}: ${Math.round(progressPercent)}%`}><span style={{ ['--progress' as string]: `${progressPercent}%` }} /></div>

            {phase === 'intro' && (
              <div className="arena-overlay">
                <div>
                  <p className="puzzle-label">{copy.bigTruth}</p>
                  <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '2rem', margin: '6px 0 10px' }}>{isRu ? 'Путь к обетованию' : 'The Promise Journey'}</h2>
                  <p style={{ fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.62 }}>{isRu ? 'Это не игра про жестокость. Это игра про верный ответ: Бог больше страха.' : 'This is not a violence game. It is a faithful-report game: God is greater than fear.'}</p>
                  <button className="pz-btn" style={{ width: 'auto', marginTop: 16, padding: '12px 28px' }} onClick={startGame}>{copy.start}</button>
                </div>
              </div>
            )}

            {(phase === 'levelComplete' || phase === 'victory' || phase === 'defeat') && (
              <div className="arena-overlay">
                <div>
                  <p className="puzzle-label">{phase === 'victory' ? copy.victory : phase === 'defeat' ? copy.defeat : copy.completed}</p>
                  <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '2rem', margin: '6px 0 10px' }}>{isRu ? level.nameRu : level.nameEn}</h2>
                  <div className="pull-quote" style={{ margin: '12px 0', textAlign: 'left' }}>
                    <p className="pq-text">&ldquo;{isRu ? scripture.textRu : scripture.textEn}&rdquo;</p>
                    <span className="pq-ref">— {isRu ? scripture.refRu : scripture.refEn}</span>
                  </div>
                  {phase === 'levelComplete' && <button className="pz-btn" style={{ width: 'auto', padding: '12px 28px' }} onClick={nextLevel}>{copy.continue}</button>}
                  {phase !== 'levelComplete' && <button className="pz-btn" style={{ width: 'auto', padding: '12px 28px' }} onClick={startGame}>{copy.playAgain}</button>}
                </div>
              </div>
            )}
          </div>

          <aside className="giants-card">
            <p className="puzzle-label" style={{ color: '#ffd866' }}>{isRu ? level.nameRu : level.nameEn}</p>
            <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '1.35rem', color: '#fff', marginBottom: 8 }}>{phase === 'question' ? copy.answerTitle : copy.report}</h2>
            {isBoss && <p style={{ fontFamily: 'var(--font-nunito)', color: '#fed7aa', fontWeight: 900, lineHeight: 1.45, marginBottom: 8 }}>{copy.bossHint}</p>}

            <div style={{ borderRadius: 20, padding: 14, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.16)' }}>
              <h3 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#ffd866', marginBottom: 6 }}>{copy.scriptureTitle}</h3>
              <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.58, color: 'rgba(255,255,255,.9)', fontWeight: 700 }}>&ldquo;{isRu ? scripture.textRu : scripture.textEn}&rdquo;</p>
              <p style={{ fontFamily: 'var(--font-nunito)', color: '#bfdbfe', fontWeight: 1000, marginTop: 8 }}>— {isRu ? scripture.refRu : scripture.refEn}</p>
            </div>

            {phase === 'question' ? (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontFamily: 'var(--font-lora)', color: 'rgba(255,255,255,.9)', lineHeight: 1.55, fontWeight: 700 }}>{copy.answerHelp}</p>
                <h3 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, marginTop: 10 }}>{isRu ? scripture.question.promptRu : scripture.question.promptEn}</h3>
                <div className="answer-grid">
                  {(isRu ? scripture.question.choicesRu : scripture.question.choicesEn).map((choice, index) => (
                    <button key={choice} className={selectedAnswer === index ? 'selected' : ''} onClick={() => answerQuestion(index)}>{choice}</button>
                  ))}
                </div>
                <p style={{ marginTop: 10, minHeight: 24, fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: selectedAnswer === scripture.question.answer ? '#bbf7d0' : '#fed7aa' }}>{message || ' '}</p>
              </div>
            ) : (
              <div style={{ marginTop: 16 }}>
                <button className="pz-btn" style={{ width: '100%', minHeight: 58, fontSize: '1.05rem' }} onClick={phase === 'play' ? courageStep : startGame}>
                  {phase === 'play' ? copy.stand : copy.restart}
                </button>
                <p style={{ marginTop: 10, minHeight: 38, fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#dbeafe', lineHeight: 1.45 }}>{message || (isRu ? scripture.question.feedbackRu : scripture.question.feedbackEn)}</p>

                <div style={{ marginTop: 16 }}>
                  <h3 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#ffd866' }}>{copy.powerupsTitle}</h3>
                  <div className="power-row">
                    {(Object.keys(powerups) as Powerup[]).map((key) => {
                      const power = powerups[key]
                      return (
                        <button key={key} disabled={phase !== 'play' || wisdomFuel < power.cost} onClick={() => spendPowerup(key)}>
                          {isRu ? power.labelRu : power.labelEn} · {power.cost} {isRu ? 'мудр.' : 'fuel'}<br />
                          <span style={{ fontWeight: 800, opacity: .78 }}>{isRu ? power.descRu : power.descEn}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  )
}
