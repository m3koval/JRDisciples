'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link'
import { useEffect, useState } from 'react'
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
  badgeEn: string
  badgeRu: string
}

type Guide = { nameEn: string; nameRu: string; roleEn: string; roleRu: string; lineEn: string; lineRu: string; tone: 'joshua' | 'caleb' | 'rosie' }

const SCRIPTURE: Scripture[] = [
  {
    refEn: 'Joshua 1:9',
    refRu: 'Иисуса Навина 1:9',
    textEn: 'Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go."',
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
    textEn: 'Only do not rebel against the LORD. And do not fear the people of the land, for they are bread for us. Their protection is removed from them, and the LORD is with us; do not fear them."',
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
    textEn: 'Be strong and courageous. Do not fear or be in dread of them, for it is the LORD your God who goes with you. He will not leave you or forsake you."',
    textRu: 'Будьте тверды и мужественны, не бойтесь, и не страшитесь их, ибо Господь Бог твой Сам пойдет с тобою, не отступит от тебя и не оставит тебя.',
    question: {
      promptEn: "What promise helps God's people keep going?",
      promptRu: 'Какое обещание помогает Божьему народу идти дальше?',
      choicesEn: ['God goes with His people', 'We never need help', 'Big problems are not real'],
      choicesRu: ['Бог идет со Своим народом', 'Нам никогда не нужна помощь', 'Больших трудностей не бывает'],
      answer: 0,
      feedbackEn: 'Good line. God does not leave His people alone.',
      feedbackRu: 'Правильно. Бог не оставляет Свой народ один.',
    },
  },
  {
    refEn: 'Isaiah 41:10',
    refRu: 'Исаия 41:10',
    textEn: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand."',
    textRu: 'Не бойся, ибо Я с тобою; не смущайся, ибо Я Бог твой; Я укреплю тебя, и помогу тебе, и поддержу тебя десницею правды Моей.',
    question: {
      promptEn: 'What three things does God promise to do for His people?',
      promptRu: 'Что три вещи обещает Бог Своему народу?',
      choicesEn: ['Strengthen, help, and uphold them', 'Leave, forget, and ignore them', 'Test, punish, and abandon them'],
      choicesRu: ['Укрепить, помочь и поддержать', 'Оставить, забыть и игнорировать', 'Испытать, наказать и бросить'],
      answer: 0,
      feedbackEn: "Right. God's hand is under His people — they cannot fall alone.",
      feedbackRu: 'Верно. Рука Бога держит Его народ — они не упадут одни.',
    },
  },
  {
    refEn: '2 Chronicles 20:15',
    refRu: '2 Паралипоменон 20:15',
    textEn: 'Do not be afraid and do not be dismayed at this great horde, for the battle is not yours but God\'s."',
    textRu: 'Не бойтесь и не страшитесь множества сего великого, ибо не ваша война, а Божья.',
    question: {
      promptEn: "When God's people face something huge, whose battle is it?",
      promptRu: 'Когда народ Божий встречает что-то огромное, чья это война?',
      choicesEn: ["God's battle, not ours", 'Our battle alone', 'The strongest person wins'],
      choicesRu: ['Битва Бога, не наша', 'Только наша битва', 'Побеждает сильнейший'],
      answer: 0,
      feedbackEn: 'Yes. Trusting God means letting Him fight the biggest battles.',
      feedbackRu: 'Да. Доверять Богу — значит позволить Ему сражаться в самых трудных битвах.',
    },
  },
  {
    refEn: 'Psalm 27:1',
    refRu: 'Псалом 26:1',
    textEn: 'The LORD is my light and my salvation; whom shall I fear? The LORD is the stronghold of my life; of whom shall I be afraid?"',
    textRu: 'Господь — просвещение мое и спасение мое: кого мне бояться? Господь — крепость жизни моей: кого мне страшиться?',
    question: {
      promptEn: 'What two things does the psalmist call the LORD?',
      promptRu: 'Какими двумя словами псалмопевец называет Господа?',
      choicesEn: ['Light and stronghold', 'Far away and silent', 'Angry and distant'],
      choicesRu: ['Свет и крепость', 'Далёкий и молчаливый', 'Сердитый и далёкий'],
      answer: 0,
      feedbackEn: 'Right. Because the LORD is our light and fortress, fear has no foothold.',
      feedbackRu: 'Верно. Потому что Господь — наш свет и крепость, страху нет места.',
    },
  },
  {
    refEn: 'Proverbs 29:25',
    refRu: 'Притчи 29:25',
    textEn: 'The fear of man lays a snare, but whoever trusts in the LORD is safe."',
    textRu: 'Боязнь перед людьми ставит сеть; а надеющийся на Господа будет безопасен.',
    question: {
      promptEn: 'What happens when we fear people instead of trusting God?',
      promptRu: 'Что происходит, когда мы боимся людей вместо того, чтобы доверять Богу?',
      choicesEn: ['We fall into a trap', 'We become stronger', 'Nothing changes'],
      choicesRu: ['Мы попадаем в ловушку', 'Мы становимся сильнее', 'Ничего не меняется'],
      answer: 0,
      feedbackEn: 'Right. Fear of people is a trap. Trust in the LORD is the way out.',
      feedbackRu: 'Верно. Страх перед людьми — ловушка. Доверие Господу — выход из неё.',
    },
  },
]

const LEVELS: Level[] = [
  { nameEn: 'Scout the Land', nameRu: 'Осмотреть землю', giants: 1, fear: 42, speed: 0.95, scriptureIndex: 0, badgeEn: 'Scout Badge', badgeRu: 'Значок разведчика' },
  { nameEn: 'Grapes of Promise', nameRu: 'Виноград обетования', giants: 2, fear: 54, speed: 1.05, scriptureIndex: 1, badgeEn: 'Promise Grapes', badgeRu: 'Виноград обетования' },
  { nameEn: 'The Fear Report', nameRu: 'Испуганный ответ', giants: 3, fear: 68, speed: 1.18, scriptureIndex: 4, badgeEn: 'Truth Listener', badgeRu: 'Слушатель истины' },
  { nameEn: 'Caleb Speaks Up', nameRu: 'Халев говорит верно', giants: 4, fear: 84, speed: 1.32, scriptureIndex: 1, badgeEn: 'Faithful Report', badgeRu: 'Верный ответ' },
  { nameEn: 'Courage Camp', nameRu: 'Стан мужества', giants: 5, fear: 104, speed: 1.48, scriptureIndex: 2, badgeEn: 'Courage Camp', badgeRu: 'Стан мужества' },
  { nameEn: 'Jordan Crossing', nameRu: 'Переход Иордана', giants: 6, fear: 126, speed: 1.65, scriptureIndex: 3, badgeEn: 'River Step', badgeRu: 'Шаг через реку' },
  { nameEn: 'Jericho March', nameRu: 'Марш у Иерихона', giants: 7, fear: 150, speed: 1.84, scriptureIndex: 6, badgeEn: 'Obedient March', badgeRu: 'Послушный марш' },
  { nameEn: 'Hill Country Challenge', nameRu: 'Испытание горной земли', giants: 8, fear: 176, speed: 2.05, scriptureIndex: 5, badgeEn: 'Hill Courage', badgeRu: 'Мужество в горах' },
  { nameEn: 'Stand Together', nameRu: 'Стоять вместе', giants: 9, fear: 204, speed: 2.28, scriptureIndex: 3, badgeEn: 'Together Shield', badgeRu: 'Щит единства' },
  { nameEn: 'Face the Big Fear', nameRu: 'Встреча с большим страхом', giants: 1, fear: 238, speed: 2.55, scriptureIndex: 2, badgeEn: 'Promise Victor', badgeRu: 'Победитель обещания' },
]

const GUIDES: Guide[] = [
  { nameEn: 'Joshua', nameRu: 'Иисус Навин', roleEn: 'Leader', roleRu: 'Вождь', tone: 'joshua', lineEn: 'We move because the LORD is with His people.', lineRu: 'Мы идем, потому что Господь со Своим народом.' },
  { nameEn: 'Caleb', nameRu: 'Халев', roleEn: 'Faithful report', roleRu: 'Верный ответ', tone: 'caleb', lineEn: 'Do not measure the promise by the giants. Trust God.', lineRu: 'Не меряй обещание великанами. Доверяй Богу.' },
  { nameEn: 'Rosie', nameRu: 'Рози', roleEn: 'Scripture helper', roleRu: 'Помощница со стихом', tone: 'rosie', lineEn: 'Read the verse, then choose the truth.', lineRu: 'Прочитай стих, потом выбери истину.' },
]

const powerups: Record<Powerup, { cost: number; labelEn: string; labelRu: string; descEn: string; descRu: string }> = {
  people: {
    cost: 4,
    labelEn: 'Stand Together',
    labelRu: 'Стоять вместе',
    descEn: '+1 helper → stronger rally',
    descRu: '+1 помощник → мощнее сплочение',
  },
  health: {
    cost: 3,
    labelEn: 'Courage Rest',
    labelRu: 'Отдых мужества',
    descEn: 'Regain 2 hearts',
    descRu: 'Вернуть 2 сердца',
  },
  strength: {
    cost: 5,
    labelEn: 'Be Strong',
    labelRu: 'Будь тверд',
    descEn: 'Next hits deal double damage',
    descRu: 'Следующие удары вдвое сильнее',
  },
}

const BOSS_MAX_HP = 12

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export default function FaithOverGiantsPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const [phase, setPhase] = useState<Phase>('intro')
  const [levelIndex, setLevelIndex] = useState(0)
  const [giantHps, setGiantHps] = useState<number[]>([])
  const [hittingIndex, setHittingIndex] = useState<number | null>(null)
  const [fearLine, setFearLine] = useState(16)
  const [health, setHealth] = useState(6)
  const [helpers, setHelpers] = useState(2)
  const [coins, setCoins] = useState(0)
  const [strengthTurns, setStrengthTurns] = useState(0)
  const [message, setMessage] = useState('')
  const [lastAction, setLastAction] = useState<'none' | 'step' | 'hit' | 'power' | 'badge'>('none')
  const [badges, setBadges] = useState<string[]>([])
  const [bestLevel, setBestLevel] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerLocked, setAnswerLocked] = useState(false)

  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)]
  const scripture = SCRIPTURE[level.scriptureIndex]
  const isBoss = levelIndex === LEVELS.length - 1
  const giantMaxHp = isBoss ? BOSS_MAX_HP : 2 + Math.floor(levelIndex / 3)
  const progressPercent = giantHps.length > 0 ? (giantHps.filter(hp => hp <= 0).length / giantHps.length) * 100 : 0

  const guide = GUIDES[phase === 'question' ? 2 : levelIndex % 2]

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
    coins: '🪙 Монеты',
    fear: 'Страх',
    courage: 'Мужество',
    answerTitle: 'Сначала Божье Слово',
    answerHelp: 'Ответь правильно — получи монеты для усилений.',
    correct: 'Верно! +3 🪙',
    wrong: 'Хорошая попытка. Посмотри на стих и попробуй снова.',
    stand: 'Стоять твёрдо!',
    report: 'Верный ответ',
    victory: 'Победа веры!',
    defeat: 'Страх остановил путь. Попробуй снова с Божьим Словом.',
    completed: 'Уровень пройден. Великаны выглядели большими, но Бог больше страха.',
    bossHint: 'Финальный босс — не человек. Это большой страх, который Божий народ должен отвергнуть.',
    powerupsTitle: 'Усиления',
    scriptureTitle: 'Стих внутри игры',
    bigTruth: 'Главная истина: Божьи обещания больше великанов, которых мы боимся.',
    badgeEarned: 'Новая награда',
    reward: 'Награда',
    pressure: 'Давление страха',
    tapHint: 'Нажимай на великанов, чтобы сражаться!',
    helpersHint: 'каждый отталкивает страх',
    bossWarning: '⚠️ Последнее испытание впереди: большой страх. Держись обещания Господа!',
    reflection: '💭 Подумай: какой «великан» пугает тебя в жизни? Как обещание Господа помогает идти вперёд?',
  } : {
    back: 'All Games',
    eyebrow: 'Bible Strategy Game',
    title: 'Faith Over Giants',
    subtitle: "Lead the people forward, answer God's Word inside the game, and push back fear with courage, obedience, and trust in the Lord.",
    start: 'Start the Journey',
    continue: 'Next Level',
    restart: 'Play Again',
    playAgain: 'Run It Back',
    level: 'Level',
    hearts: 'Hearts',
    helpers: 'Helpers',
    coins: '🪙 Coins',
    fear: 'Fear',
    courage: 'Courage',
    answerTitle: "God's Word First",
    answerHelp: 'Answer correctly to earn coins for power-ups.',
    correct: 'Correct! +3 🪙',
    wrong: 'Good try. Look at the verse and try again.',
    stand: 'Stand Firm!',
    report: 'Faithful Report',
    victory: 'Faith Victory!',
    defeat: "Fear stopped the journey. Try again with God's Word.",
    completed: 'Level cleared. The giants looked big, but God is greater than fear.',
    bossHint: "The final boss is not a person. It is big fear that God's people must reject.",
    powerupsTitle: 'Power-ups',
    scriptureTitle: 'Scripture inside the game',
    bigTruth: "Big truth: God's promises are bigger than the giants we fear.",
    badgeEarned: 'New Reward',
    reward: 'Reward',
    pressure: 'Fear Pressure',
    tapHint: 'Tap the giants to fight them!',
    helpersHint: 'each one pushes fear back',
    bossWarning: "⚠️ The final challenge is ahead: big fear itself. Hold to the LORD's promise!",
    reflection: "💭 Think about this: what is one 'giant' in your own life? How does God's promise help you keep going?",
  }

  function initGiants(index: number) {
    const lvl = LEVELS[Math.min(index, LEVELS.length - 1)]
    const isBossLevel = index === LEVELS.length - 1
    const hp = isBossLevel ? BOSS_MAX_HP : 2 + Math.floor(index / 3)
    setGiantHps(Array.from({ length: lvl.giants }, () => hp))
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
          setLastAction('hit')
          setMessage(isRu ? 'Страх подошел близко — держись Божьего обещания.' : "Fear pressed close — hold to God's promise.")
          return 26
        }
        return next
      })
    }, 850)
    return () => window.clearInterval(timer)
  }, [phase, level.speed, isRu])

  // Defeat check
  useEffect(() => {
    if (phase !== 'play') return
    if (health <= 0) {
      setPhase('defeat')
    }
  }, [phase, health])

  // Level complete check: all giants defeated
  useEffect(() => {
    if (phase !== 'play') return
    if (giantHps.length === 0) return
    if (!giantHps.every(hp => hp <= 0)) return
    if (levelIndex >= LEVELS.length - 1) {
      setBadges((earned) => earned.includes(level.badgeEn) ? earned : [...earned, level.badgeEn])
      setLastAction('badge')
      setPhase('victory')
      setBestLevel(10)
      localStorage.setItem('faith-over-giants-best-level', '10')
    } else {
      setBadges((earned) => earned.includes(level.badgeEn) ? earned : [...earned, level.badgeEn])
      setLastAction('badge')
      setPhase('levelComplete')
      const nextBest = Math.max(bestLevel, levelIndex + 1)
      setBestLevel(nextBest)
      localStorage.setItem('faith-over-giants-best-level', String(nextBest))
    }
  }, [phase, giantHps, level.badgeEn, levelIndex, bestLevel])

  function startGame() {
    setPhase('question')
    setLevelIndex(0)
    initGiants(0)
    setFearLine(16)
    setHealth(6)
    setHelpers(2)
    setCoins(0)
    setStrengthTurns(0)
    setSelectedAnswer(null)
    setAnswerLocked(false)
    setLastAction('none')
    setBadges([])
    setMessage('')
  }

  function answerQuestion(index: number) {
    if (answerLocked) return
    setSelectedAnswer(index)
    if (index === scripture.question.answer) {
      setCoins((c) => c + 3)
      setLastAction('power')
      setMessage(copy.correct)
      setAnswerLocked(true)
      window.setTimeout(() => {
        setSelectedAnswer(null)
        setAnswerLocked(false)
        setPhase('play')
      }, 1400)
    } else {
      setAnswerLocked(true)
      setMessage(copy.wrong)
      window.setTimeout(() => {
        setSelectedAnswer(null)
        setAnswerLocked(false)
      }, 1200)
    }
  }

  function nextLevel() {
    const next = levelIndex + 1
    setLevelIndex(next)
    initGiants(next)
    setFearLine(16)
    setHealth((h) => Math.min(6, h + 1))
    setStrengthTurns(0)
    setSelectedAnswer(null)
    setAnswerLocked(false)
    setLastAction('none')
    setMessage('')
    setPhase('question')
  }

  function attackGiant(index: number) {
    if (phase !== 'play') return
    if (giantHps[index] <= 0) return
    const dmg = strengthTurns > 0 ? 2 : 1
    setHittingIndex(index)
    window.setTimeout(() => setHittingIndex(null), 340)
    setGiantHps((hps) => {
      const next = [...hps]
      next[index] = Math.max(0, next[index] - dmg)
      if (next[index] <= 0) setCoins((c) => c + 1)
      return next
    })
    if (strengthTurns > 0) setStrengthTurns((turns) => Math.max(0, turns - 1))
    setLastAction('step')
    setMessage(dmg === 2
      ? (isRu ? 'Двойной удар! +1 🪙 за победу.' : 'Double strike! +1 🪙 for the victory.')
      : (isRu ? 'Удар верой! Стой твёрдо — Господь с тобой.' : 'Strike with faith! Stand firm — the LORD is with you.')
    )
  }

  function courageStep() {
    if (phase !== 'play') return
    const pushBack = helpers * 5 + (strengthTurns > 0 ? 14 : 0)
    setFearLine((value) => clamp(value - pushBack, 10, 100))
    setLastAction('step')
    setMessage(isRu ? 'Верный ответ отталкивает страх — команда держится!' : 'A faithful report pushes fear back — the team stands firm!')
    if (strengthTurns > 0) setStrengthTurns((turns) => Math.max(0, turns - 1))
  }

  function spendPowerup(kind: Powerup) {
    const power = powerups[kind]
    if (phase !== 'play' || coins < power.cost) return
    setCoins((c) => c - power.cost)
    if (kind === 'people') {
      setHelpers((count) => Math.min(8, count + 1))
      setLastAction('power')
      setMessage(isRu ? 'Еще один помощник стал рядом.' : 'Another helper stood with the team.')
    }
    if (kind === 'health') {
      setHealth((value) => Math.min(6, value + 2))
      setLastAction('power')
      setMessage(isRu ? 'Отдых восстановил сердца.' : 'Courage Rest restored hearts.')
    }
    if (kind === 'strength') {
      setStrengthTurns(3)
      setLastAction('power')
      setMessage(isRu ? 'Следующие шаги сильнее: будь тверд и мужествен.' : 'The next steps are stronger: be strong and courageous.')
    }
  }

  // Current boss HP for display
  const bossCurrentHp = isBoss && giantHps.length > 0 ? giantHps[0] : 0

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#071225,#123522 54%,#f8fafc)', color: '#fff' }}>
      <style>{`
        .giants-wrap { max-width: 1140px; margin: 0 auto; padding: 24px 14px 56px; }
        .giants-grid { display: grid; grid-template-columns: minmax(0,1.25fr) minmax(292px,.75fr); gap: 18px; align-items: stretch; }
        .promise-arena { position: relative; min-height: 570px; overflow: hidden; border-radius: 34px; border: 4px solid rgba(255,216,102,.86); background: linear-gradient(180deg,#80c7e8 0%,#dbeafe 31%,#d8b46f 32%,#73612e 100%); box-shadow: 0 30px 90px rgba(0,0,0,.34); isolation: isolate; touch-action: manipulation; }
        .promise-arena.is-step { animation: courage-pulse .42s ease-out; }
        .promise-arena.is-hit { animation: fear-shake .36s ease-out; }
        .promise-arena.is-power { box-shadow: 0 30px 90px rgba(0,0,0,.34),0 0 42px rgba(255,216,102,.46); }
        .promise-arena::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 18% 14%,rgba(255,255,255,.78),transparent 12%),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px); background-size: auto,52px 52px; pointer-events: none; }
        .promise-arena::after { content: ''; position: absolute; left: -10%; right: -10%; bottom: 0; height: 28%; background: radial-gradient(ellipse at 24% 100%,#426b25 0 26%,transparent 27%),radial-gradient(ellipse at 64% 100%,#31591e 0 28%,transparent 29%),linear-gradient(180deg,transparent,#244819 54%,#173214); z-index: 0; }
        .hills { position: absolute; inset: auto 0 28% 0; height: 34%; background: linear-gradient(135deg,transparent 0 20%,rgba(103,86,46,.65) 21% 42%,transparent 43%),linear-gradient(225deg,transparent 0 19%,rgba(76,100,60,.7) 20% 44%,transparent 45%); opacity: .9; z-index: 0; }
        .team { position: absolute; left: 7%; bottom: 11%; z-index: 4; display: flex; align-items: end; gap: 7px; transition: transform .3s ease; }
        .promise-arena.is-step .team { transform: translateX(22px); }
        .helper { position: relative; width: 42px; height: 76px; border-radius: 24px 24px 14px 14px; background: linear-gradient(180deg,#8b5a2b 0 12%,#f8d29a 13% 26%,#fef3c7 27% 33%,#2563eb 34% 72%,#78350f 73%); border: 3px solid rgba(255,255,255,.78); box-shadow: 0 10px 26px rgba(0,0,0,.24); display: grid; place-items: start center; padding-top: 5px; }
        .helper::before { content: ''; position: absolute; top: 17px; left: 12px; width: 18px; height: 8px; border-radius: 999px; background: rgba(120,53,15,.42); }
        .helper::after { content: ''; position: absolute; bottom: -9px; left: 6px; right: 6px; height: 12px; border-radius: 999px; background: rgba(15,23,42,.24); filter: blur(3px); }
        .helper.leader { width: 54px; height: 92px; background: linear-gradient(180deg,#5b3418 0 12%,#f8d29a 13% 24%,#fef3c7 25% 32%,#16a34a 33% 72%,#78350f 73%); }
        .helper.leader .shield { position: absolute; left: -10px; top: 34px; width: 24px; height: 32px; border-radius: 12px 12px 16px 16px; background: linear-gradient(180deg,#fde68a,#d97706); border: 2px solid #fff7ed; box-shadow: 0 0 14px rgba(253,230,138,.65); }
        .giant-line { position: absolute; right: 8%; bottom: 11%; z-index: 3; display: flex; align-items: end; gap: 8px; transform: translateX(calc((100 - var(--fear-line)) * .62%)); transition: transform .45s ease; }
        .giant { position: relative; width: 54px; height: 118px; border-radius: 34px 34px 18px 18px; background: linear-gradient(180deg,#64748b,#1e293b); border: 4px solid #cbd5e1; box-shadow: 0 16px 38px rgba(0,0,0,.32); display: grid; place-items: center; font-family: var(--font-nunito); font-weight: 1000; color: #fff; cursor: pointer; touch-action: manipulation; user-select: none; -webkit-user-select: none; transition: opacity .38s ease-out, transform .38s ease-out; }
        .giant::before { content: ''; position: absolute; top: 20px; width: 24px; height: 12px; border-radius: 999px; background: rgba(15,23,42,.65); box-shadow: 0 18px 0 rgba(148,163,184,.38); }
        .giant::after { content: ''; position: absolute; bottom: -10px; left: 7px; right: 7px; height: 14px; border-radius: 999px; background: rgba(15,23,42,.28); filter: blur(4px); }
        .giant.boss { width: 106px; height: 196px; border-radius: 64px 64px 28px 28px; background: linear-gradient(180deg,#78350f,#1e293b 58%,#020617); border-color: #fed7aa; font-size: 1.05rem; text-align: center; box-shadow: 0 26px 70px rgba(0,0,0,.42),0 0 46px rgba(249,115,22,.28); }
        .giant-hit { animation: giant-hit-flash .34s ease-out; }
        .giant-dead { opacity: 0; transform: translateY(14px) scale(0.7); pointer-events: none; }
        .giant-hp-bar { position: absolute; bottom: 8px; left: 8px; right: 8px; height: 10px; border-radius: 999px; background: rgba(15,23,42,.6); overflow: hidden; }
        .giant-hp-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#ef4444,#fbbf24); transition: width .2s ease; }
        .pressure-meter { position: absolute; right: 7%; top: 7%; z-index: 5; width: 170px; border-radius: 18px; padding: 10px; background: rgba(15,23,42,.72); border: 1px solid rgba(255,255,255,.32); font-family: var(--font-nunito); font-weight: 1000; }
        .pressure-meter span { display: block; height: 10px; border-radius: 999px; margin-top: 6px; background: linear-gradient(90deg,#22c55e,#fde047,#ef4444); width: var(--fear-line-width); transition: width 0.75s linear; }
        .promise-light { position: absolute; left: 50%; top: 18%; width: 180px; height: 180px; transform: translateX(-50%); border-radius: 999px; background: radial-gradient(circle,rgba(255,255,255,.92) 0 12%,rgba(255,216,102,.56) 13% 42%,transparent 70%); filter: blur(.3px); z-index: 1; }
        .progress-path { position: absolute; left: 8%; right: 8%; bottom: 6%; height: 18px; border-radius: 999px; background: rgba(15,23,42,.72); border: 2px solid rgba(255,255,255,.72); z-index: 5; overflow: hidden; }
        .progress-path span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg,#fef08a,#22c55e); width: var(--progress); box-shadow: 0 0 20px rgba(34,197,94,.7); }
        .action-burst { position: absolute; left: 28%; bottom: 28%; z-index: 6; pointer-events: none; border-radius: 999px; padding: 10px 14px; background: rgba(255,255,255,.9); color: #14532d; font-family: var(--font-nunito); font-weight: 1000; box-shadow: 0 14px 32px rgba(0,0,0,.22); animation: burst-rise .8s ease-out both; }
        .guide-card { display: grid; grid-template-columns: 58px 1fr; gap: 12px; align-items: center; border-radius: 20px; padding: 12px; margin-bottom: 12px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18); }
        .guide-avatar { position: relative; width: 56px; height: 62px; border-radius: 26px 26px 16px 16px; background: linear-gradient(180deg,#6b3f20 0 16%,#f8d29a 17% 34%,#fef3c7 35% 42%,#16a34a 43% 100%); border: 2px solid rgba(255,255,255,.72); }
        .guide-avatar.caleb { background: linear-gradient(180deg,#5b3418 0 16%,#f8d29a 17% 34%,#fef3c7 35% 42%,#2563eb 43% 100%); }
        .guide-avatar.rosie { background: linear-gradient(180deg,#4b2e83 0 16%,#f0c7a0 17% 34%,#fef3c7 35% 42%,#7c3aed 43% 100%); }
        .guide-avatar::after { content: ''; position: absolute; top: 24px; left: 16px; width: 24px; height: 8px; border-radius: 999px; background: rgba(120,53,15,.42); }
        .badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
        .badge-chip { border-radius: 999px; padding: 7px 10px; background: linear-gradient(180deg,#fef3c7,#fbbf24); color: #3b2307; font-family: var(--font-nunito); font-size: .76rem; font-weight: 1000; box-shadow: 0 8px 18px rgba(0,0,0,.18); }
        .giants-card { border-radius: 26px; padding: 18px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); box-shadow: 0 20px 60px rgba(0,0,0,.2); }
        .giants-stat { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; margin: 14px 0; }
        .giants-stat div { border-radius: 16px; padding: 9px; background: rgba(15,23,42,.76); border: 1px solid rgba(255,255,255,.18); text-align: center; font-family: var(--font-nunito); font-weight: 1000; }
        .answer-grid { display: grid; gap: 10px; margin-top: 14px; }
        .answer-grid button, .power-row button { border: 0; border-radius: 16px; padding: 12px 14px; font-family: var(--font-nunito); font-weight: 1000; text-align: left; background: rgba(255,255,255,.94); color: #0d1f3c; box-shadow: 0 10px 22px rgba(0,0,0,.18); }
        .answer-grid button.selected { outline: 4px solid #fbbf24; }
        .answer-grid button:disabled { opacity: .52; cursor: not-allowed; }
        .power-row { display: grid; gap: 10px; margin-top: 10px; }
        .power-row button:disabled { opacity: .48; filter: grayscale(.35); }
        .arena-overlay { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 18px; background: rgba(5,9,20,.72); }
        .arena-overlay > div { max-width: 480px; width: 100%; border-radius: 28px; padding: 24px; background: rgba(255,255,255,.96); color: #0d1f3c; border: 3px solid #ffd866; text-align: center; overflow-y: auto; max-height: 90dvh; }
        .reward-medal { width: 84px; height: 84px; margin: 0 auto 10px; border-radius: 999px; display: grid; place-items: center; background: radial-gradient(circle,#fff 0 18%,#fef08a 19% 54%,#f59e0b 55%); border: 5px solid #fff7ed; box-shadow: 0 16px 36px rgba(0,0,0,.2),0 0 28px rgba(251,191,36,.65); color: #78350f; font-family: var(--font-nunito); font-weight: 1000; }
        @keyframes courage-pulse { 0% { filter: saturate(1); } 40% { filter: saturate(1.35) brightness(1.06); } 100% { filter: saturate(1); } }
        @keyframes fear-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 55% { transform: translateX(5px); } }
        @keyframes burst-rise { 0% { opacity: 0; transform: translateY(18px) scale(.92); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-34px) scale(1.08); } }
        @keyframes giant-hit-flash { 0%,100% { filter: brightness(1); transform: scale(1); } 30% { filter: brightness(3) saturate(0); transform: scale(1.14); } }
        @media (max-width: 880px) { .giants-grid { grid-template-columns: 1fr; } .promise-arena { min-height: 470px; } .giants-stat { grid-template-columns: repeat(2,1fr); } .giant { width: 54px; height: 108px; font-size: .8rem; } .giant.boss { width: 88px; height: 158px; } .helper { width: 34px; height: 62px; } .helper.leader { width: 44px; height: 78px; } }
      `}</style>

      <div className="giants-wrap">
        <Link href="/games" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {copy.back}</Link>
        <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 20 }}>{copy.eyebrow}</p>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,7vw,4.35rem)', lineHeight: 1, margin: '6px 0 12px' }}>{copy.title}</h1>
        <p style={{ maxWidth: 840, fontFamily: 'var(--font-lora)', color: 'rgba(255,255,255,.9)', fontWeight: 700, lineHeight: 1.7 }}>{copy.subtitle}</p>

        <div className="giants-stat">
          <div>{copy.level}<br />{Math.min(levelIndex + 1, 10)}/10</div>
          <div>{copy.hearts}<br />{'❤️'.repeat(health) || '—'}</div>
          <div>{copy.helpers}<br />{helpers}<br /><span style={{ fontSize: '.66rem', opacity: .65, fontWeight: 700 }}>{copy.helpersHint}</span></div>
          <div>{copy.coins}<br />{coins}</div>
          <div>{isRu ? 'Лучший' : 'Best'}<br />{bestLevel}/10</div>
        </div>

        <section className="giants-grid">
          <div className={`promise-arena ${lastAction === 'step' ? 'is-step' : lastAction === 'hit' ? 'is-hit' : lastAction === 'power' ? 'is-power' : ''}`} aria-label={copy.title}>
            <div className="hills" aria-hidden="true" />
            <div className="promise-light" aria-hidden="true" />
            <div className="pressure-meter" aria-hidden="true">{copy.pressure}<span style={{ ['--fear-line-width' as string]: `${clamp(fearLine, 0, 100)}%` }} /></div>
            <div className="team" aria-hidden="true">
              <div className="helper leader"><span className="shield" /></div>
              {Array.from({ length: Math.max(0, Math.min(helpers - 1, 7)) }).map((_, index) => <div key={index} className="helper" />)}
            </div>
            <div className="giant-line" style={{ ['--fear-line' as string]: fearLine }} aria-hidden="true">
              {giantHps.map((hp, index) => {
                const isHitting = hittingIndex === index
                const isDead = hp <= 0
                const classNames = ['giant', isBoss ? 'boss' : '', isHitting ? 'giant-hit' : '', isDead ? 'giant-dead' : ''].filter(Boolean).join(' ')
                return (
                  <div
                    key={index}
                    className={classNames}
                    onClick={() => attackGiant(index)}
                    role="button"
                    aria-label={isBoss ? (isRu ? 'Страх' : 'Fear') : `Giant ${index + 1}`}
                  >
                    {isBoss ? (
                      <>
                        {isRu ? 'Страх' : 'Fear'}
                        <div className="giant-hp-bar">
                          <div className="giant-hp-bar-fill" style={{ width: `${(hp / BOSS_MAX_HP) * 100}%` }} />
                        </div>
                      </>
                    ) : (
                      <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 3 }}>
                        {Array.from({ length: giantMaxHp }).map((_, i) => (
                          <span key={i} style={{ display: 'block', width: 7, height: 7, borderRadius: '50%', background: i < hp ? '#ef4444' : 'rgba(255,255,255,.2)', flexShrink: 0 }} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {lastAction !== 'none' && phase === 'play' && <div className="action-burst">{lastAction === 'hit' ? `-${isRu ? 'сердце' : 'heart'}` : lastAction === 'power' ? '+3 🪙' : `+${copy.courage}`}</div>}
            <div className="progress-path" aria-label={`${copy.courage}: ${Math.round(progressPercent)}%`}><span style={{ ['--progress' as string]: `${progressPercent}%` }} /></div>

            {phase === 'intro' && (
              <div className="arena-overlay">
                <div>
                  <p className="puzzle-label">{copy.bigTruth}</p>
                  <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '2rem', margin: '6px 0 10px' }}>{isRu ? 'Путь к обетованию' : 'The Promise Journey'}</h2>
                  <p style={{ fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.62 }}>{isRu ? 'Нажимай на великанов, чтобы сражаться с ними. Это не игра про жестокость. Это игра про верный ответ: Бог больше страха.' : 'Tap the giants to fight them. This is not a violence game. It is a faithful-report game: God is greater than fear.'}</p>
                  <button className="pz-btn" style={{ width: 'auto', marginTop: 16, padding: '12px 28px' }} onClick={startGame}>{copy.start}</button>
                </div>
              </div>
            )}

            {(phase === 'levelComplete' || phase === 'victory' || phase === 'defeat') && (
              <div className="arena-overlay">
                <div>
                  <p className="puzzle-label">{phase === 'victory' ? copy.victory : phase === 'defeat' ? copy.defeat : copy.completed}</p>
                  {phase !== 'defeat' && <div className="reward-medal">{copy.reward}</div>}
                  <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '2rem', margin: '6px 0 10px' }}>{isRu ? level.nameRu : level.nameEn}</h2>
                  {phase !== 'defeat' && <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#92400e' }}>{copy.badgeEarned}: {isRu ? level.badgeRu : level.badgeEn}</p>}
                  <div className="pull-quote" style={{ margin: '12px 0', textAlign: 'left' }}>
                    <p className="pq-text">&ldquo;{isRu ? scripture.textRu : scripture.textEn}&rdquo;</p>
                    <span className="pq-ref">— {isRu ? scripture.refRu : scripture.refEn}</span>
                  </div>
                  {phase === 'levelComplete' && levelIndex === LEVELS.length - 2 && (
                    <p style={{ margin: '14px 0 10px', padding: '10px 14px', borderRadius: 12, background: '#fef3c7', color: '#78350f', fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '.9rem' }}>{copy.bossWarning}</p>
                  )}
                  {phase === 'victory' && (
                    <div style={{ margin: '14px 0 12px', padding: '12px 16px', borderRadius: 14, background: 'rgba(5,9,20,.06)', textAlign: 'left' }}>
                      <p style={{ fontFamily: 'var(--font-lora)', color: '#0d1f3c', fontWeight: 700, lineHeight: 1.6, margin: 0 }}>{copy.reflection}</p>
                    </div>
                  )}
                  {phase === 'levelComplete' && <button className="pz-btn" style={{ width: 'auto', padding: '12px 28px' }} onClick={nextLevel}>{copy.continue}</button>}
                  {phase !== 'levelComplete' && <button className="pz-btn" style={{ width: 'auto', padding: '12px 28px' }} onClick={startGame}>{copy.playAgain}</button>}
                </div>
              </div>
            )}
          </div>

          <aside className="giants-card">
            <div className="guide-card">
              <div className={`guide-avatar ${guide.tone}`} aria-hidden="true" />
              <div>
                <p className="puzzle-label" style={{ color: '#ffd866', margin: 0 }}>{isRu ? guide.roleRu : guide.roleEn}</p>
                <h3 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, margin: '2px 0 4px', color: '#fff' }}>{isRu ? guide.nameRu : guide.nameEn}</h3>
                <p style={{ fontFamily: 'var(--font-lora)', color: 'rgba(255,255,255,.88)', fontWeight: 700, lineHeight: 1.42, fontSize: '.92rem' }}>{isRu ? guide.lineRu : guide.lineEn}</p>
              </div>
            </div>
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
                    <button key={choice} disabled={answerLocked} className={selectedAnswer === index ? 'selected' : ''} onClick={() => answerQuestion(index)}>{choice}</button>
                  ))}
                </div>
                <p style={{ marginTop: 10, minHeight: 24, fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: selectedAnswer === scripture.question.answer ? '#bbf7d0' : '#fed7aa' }}>{message || ' '}</p>
              </div>
            ) : (
              <div style={{ marginTop: 16 }}>
                {isBoss && phase === 'play' && (
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#fed7aa', marginBottom: 8 }}>
                    {isRu ? `Здоровье босса: ${bossCurrentHp}/${BOSS_MAX_HP}` : `Boss HP: ${bossCurrentHp}/${BOSS_MAX_HP}`}
                  </p>
                )}
                <button className="pz-btn" style={{ width: '100%', minHeight: 58, fontSize: '1.05rem' }} onClick={phase === 'play' ? courageStep : startGame}>
                  {phase === 'play' ? copy.stand : copy.restart}
                </button>
                <p style={{ marginTop: 10, minHeight: 38, fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#dbeafe', lineHeight: 1.45 }}>
                  {message || (phase === 'play' ? copy.tapHint : (isRu ? scripture.question.feedbackRu : scripture.question.feedbackEn))}
                </p>

                {badges.length > 0 && (
                  <div className="badge-row" aria-label={copy.reward}>
                    {badges.map((badge) => {
                      const earnedLevel = LEVELS.find((item) => item.badgeEn === badge)
                      return <span className="badge-chip" key={badge}>{earnedLevel ? (isRu ? earnedLevel.badgeRu : earnedLevel.badgeEn) : badge}</span>
                    })}
                  </div>
                )}

                <div style={{ marginTop: 16 }}>
                  <h3 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#ffd866' }}>{copy.powerupsTitle}</h3>
                  <div className="power-row">
                    {(Object.keys(powerups) as Powerup[]).map((key) => {
                      const power = powerups[key]
                      return (
                        <button key={key} disabled={phase !== 'play' || coins < power.cost} onClick={() => spendPowerup(key)}>
                          {isRu ? power.labelRu : power.labelEn} · {power.cost} 🪙<br />
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
