'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link'
import ExpeditionWorld from './ExpeditionWorld'
import { useEffect, useRef, useState } from 'react'
import TurnChoices from './TurnChoices'
import { courseTurn, nextObstacle, answerOrder, courseProgress, turnForecast } from './course'
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
    textRu: 'только против Господа не восставайте и не бойтесь народа земли сей; ибо он достанется нам на съедение: защиты у них не стало, а с нами Господь; не бойтесь их.',
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
    textRu: 'будьте тверды и мужественны, не бойтесь, [не ужасайтесь] и не страшитесь их, ибо Господь Бог твой Сам пойдет с тобою [и] не отступит от тебя и не оставит тебя.',
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
    textEn: 'fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.',
    textRu: 'не бойся, ибо Я с тобою; не смущайся, ибо Я Бог твой; Я укреплю тебя, и помогу тебе, и поддержу тебя десницею правды Моей.',
    question: {
      promptEn: 'What three things does God promise to do for His people?',
      promptRu: 'Что Бог обещает сделать для Своего народа?',
      choicesEn: ['Strengthen, help, and uphold them', 'Leave, forget, and ignore them', 'Test, punish, and abandon them'],
      choicesRu: ['Укрепить, помочь и поддержать', 'Оставить, забыть и игнорировать', 'Испытать, наказать и бросить'],
      answer: 0,
      feedbackEn: 'Right. God promises to strengthen, help, and uphold His people.',
      feedbackRu: 'Верно. Бог обещает укрепить, помочь и поддержать Свой народ.',
    },
  },
  {
    refEn: '2 Chronicles 20:15',
    refRu: '2 Паралипоменон 20:15',
    textEn: 'Do not be afraid and do not be dismayed at this great horde, for the battle is not yours but God’s.',
    textRu: 'не бойтесь и не ужасайтесь множества сего великого, ибо не ваша война, а Божия.',
    question: {
      promptEn: 'Whose battle did God say this was?',
      promptRu: 'Чьей назвал Бог эту битву?',
      choicesEn: ["God's battle, not ours", 'Our battle alone', 'The strongest person wins'],
      choicesRu: ['Битва Бога, не наша', 'Только наша битва', 'Побеждает сильнейший'],
      answer: 0,
      feedbackEn: 'Yes. Judah was told to trust the LORD and obey His direction.',
      feedbackRu: 'Да. Жителям Иудеи было велено доверять Господу и следовать Его указаниям.',
    },
  },
  {
    refEn: 'Psalm 27:1',
    refRu: 'Псалом 26:1',
    textEn: 'The LORD is my light and my salvation; whom shall I fear? The LORD is the stronghold of my life; of whom shall I be afraid?',
    textRu: 'Господь — свет мой и спасение мое: кого мне бояться? Господь крепость жизни моей: кого мне страшиться?',
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
    textEn: 'The fear of man lays a snare, but whoever trusts in the LORD is safe.',
    textRu: 'Боязнь пред людьми ставит сеть; а надеющийся на Господа будет безопасен.',
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
    descEn: 'Next 3 steps clear twice the fear',
    descRu: 'Следующие 3 шага вдвое сильнее',
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
  const [resolve, setResolve] = useState(3)
  const actionLock = useRef(false)
  const checkpoint = useRef({ coins: 0, helpers: 2 })
  const activeObstacle = nextObstacle(giantHps)

  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)]
  const scripture = SCRIPTURE[level.scriptureIndex]
  const isBoss = levelIndex === LEVELS.length - 1
  const giantMaxHp = isBoss ? BOSS_MAX_HP : 2 + Math.floor(levelIndex / 3)
  const progressPercent = courseProgress(giantHps, giantMaxHp)
  const forecast = turnForecast({ obstacles: giantHps, resolve, fear: fearLine, health, coins, strength: strengthTurns }, levelIndex, helpers)

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
    tapHint: 'Шаг стоит 1 решимость. Сплочение вернёт решимость и уменьшит страх. Пройди препятствия до лагеря.',
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
    tapHint: 'Advance costs 1 resolve. Rally restores resolve and lowers fear. Clear each obstacle to reach camp.',
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
    try {
      const stored = Number(localStorage.getItem('faith-over-giants-best-level') || '0')
      setBestLevel(Number.isFinite(stored) ? clamp(Math.floor(stored), 0, 10) : 0)
    } catch { /* Private browsing still allows a complete journey. */ }
  }, [])

  useEffect(() => { actionLock.current = false }, [giantHps, resolve, fearLine, coins, phase])

  // Defeat check
  useEffect(() => {
    if (phase !== 'play') return
    if (health <= 0) {
      setPhase('defeat')
    }
  }, [phase, health])

  // Level complete check: all giants defeated
  useEffect(() => {
    if (phase !== 'play' || health <= 0) return
    if (giantHps.length === 0) return
    if (!giantHps.every(hp => hp <= 0)) return
    if (levelIndex >= LEVELS.length - 1) {
      setBadges((earned) => earned.includes(level.badgeEn) ? earned : [...earned, level.badgeEn])
      setLastAction('badge')
      setPhase('victory')
      setBestLevel(10)
      try { localStorage.setItem('faith-over-giants-best-level', '10') } catch { /* Session best remains available. */ }
    } else {
      setBadges((earned) => earned.includes(level.badgeEn) ? earned : [...earned, level.badgeEn])
      setLastAction('badge')
      setPhase('levelComplete')
      const nextBest = Math.max(bestLevel, levelIndex + 1)
      setBestLevel(nextBest)
      try { localStorage.setItem('faith-over-giants-best-level', String(nextBest)) } catch { /* Session best remains available. */ }
    }
  }, [phase, giantHps, health, level.badgeEn, levelIndex, bestLevel])

  function startGame() {
    checkpoint.current = { coins: 0, helpers: 2 }
    setPhase('question')
    setLevelIndex(0)
    initGiants(0)
    setFearLine(16)
    setResolve(3)
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
    if (phase !== 'question' || answerLocked || actionLock.current) return
    setSelectedAnswer(index)
    if (index === scripture.question.answer) {
      actionLock.current = true
      setCoins(c => c + 3)
      setMessage(copy.correct)
      setAnswerLocked(true)
    } else {
      setMessage(copy.wrong)
    }
  }

  function retryLevel() {
    initGiants(levelIndex)
    setHealth(6)
    setFearLine(16)
    setResolve(3)
    setCoins(checkpoint.current.coins)
    setHelpers(checkpoint.current.helpers)
    setStrengthTurns(0)
    setSelectedAnswer(null)
    setAnswerLocked(false)
    setMessage('')
    setPhase('question')
  }

  function nextLevel() {
    checkpoint.current = { coins, helpers }
    const next = levelIndex + 1
    setLevelIndex(next)
    initGiants(next)
    setFearLine(16)
    setResolve(3)
    setHealth((h) => Math.min(6, h + 1))
    setStrengthTurns(0)
    setSelectedAnswer(null)
    setAnswerLocked(false)
    setLastAction('none')
    setMessage('')
    setPhase('question')
  }

  function takeTurn(type: 'advance' | 'rally', index = activeObstacle) {
    if (phase !== 'play' || actionLock.current) return
    const before = { obstacles: giantHps, resolve, fear: fearLine, health, coins, strength: strengthTurns }
    const after = courseTurn(before, type === 'rally' ? { type } : { type, index }, levelIndex, helpers)
    if (before === after) return
    actionLock.current = true
    setGiantHps(after.obstacles)
    setResolve(after.resolve)
    setFearLine(after.fear)
    setHealth(after.health)
    setCoins(after.coins)
    setStrengthTurns(after.strength)
    setHittingIndex(type === 'advance' ? index : null)
    setLastAction(after.health < health ? 'hit' : 'step')
    setMessage(type === 'rally'
      ? (isRu ? 'Команда сплотилась: +1 решимость, меньше страха.' : 'Team rallied: +1 resolve, less fear.')
      : after.health < health
        ? (isRu ? 'Страх слишком близко. Сплотись перед следующим шагом!' : 'Fear pressed close. Rally before the next step!')
        : (isRu ? 'Путь открывается! Следи за решимостью и страхом.' : 'The path is opening! Watch resolve and fear.'))
  }

  function attackGiant(index: number) { takeTurn('advance', index) }
  function courageStep() { takeTurn('rally') }

  function spendPowerup(kind: Powerup) {
    const power = powerups[kind]
    if (phase !== 'play' || coins < power.cost || actionLock.current || (kind === 'health' && health === 6) || (kind === 'people' && helpers === 8) || (kind === 'strength' && strengthTurns > 0)) return
    actionLock.current = true
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
        .phase-play > h1, .phase-play > p, .phase-play .guide-card { display: none; }
        .phase-question .promise-arena { display: none; }
        .phase-question .giants-grid { grid-template-columns: minmax(0, 680px); justify-content: center; }
        .fear-cloud-art { position: absolute; inset: 0; background: url('/images/jr/games/faith-over-giants/fear-cloud.svg') center/contain no-repeat; transform: scale(var(--cloud-scale)); opacity: var(--cloud-opacity); transition: transform .35s ease, opacity .35s ease; pointer-events: none; }
        .giant-hp-label { position: absolute; left: 50%; top: 84%; transform: translateX(-50%); border: 1px solid #dae8ed; border-radius: 8px; padding: 2px 7px; background: #263f52; color: #fff; white-space: nowrap; font-size: 12px; font-weight: 900; }
        .giant:disabled { cursor: default; opacity: .65; }
        .giant:focus-visible, .pz-btn:focus-visible { outline: 4px solid #fef08a; outline-offset: 4px; }
        .course-actions { position: relative; z-index: 8; }
        .course-actions button { width: 100%; min-height: 56px; margin: 10px 0; }
        .pz-btn:disabled { opacity: .5; }
        @media (prefers-reduced-motion: reduce) { .giant, .fear-cloud-art, .progress-path span, .pressure-meter span { transition: none !important; } .action-burst { display: none; } }
        @media (max-width: 880px) { .giants-grid { display: flex !important; flex-direction: column; } .giants-card { order: -1; } .promise-arena { min-height: 290px !important; } }
        .giants-wrap { max-width: 1140px; margin: 0 auto; padding: 24px 14px 56px; }
        .giants-grid { display: grid; grid-template-columns: minmax(0,1.25fr) minmax(292px,.75fr); gap: 18px; align-items: stretch; }
        .promise-arena { position: relative; min-height: 570px; overflow: hidden; border-radius: 28px; border: 3px solid #dfca83; background: #94c7cf; box-shadow: 0 20px 60px #071a2440; isolation: isolate; touch-action: manipulation; }
        .promise-arena.is-power { border-color: #fff2a8; }
        .giant-line { position: absolute; inset: 76px 0 24px; z-index: 3; pointer-events: none; }
        .giant { position: absolute; left: 53%; top: 56%; transform: translate(-50%,-50%); width: clamp(105px,24vw,190px); height: clamp(88px,18vw,145px); padding: 0; border: 0; background: transparent; color: #183144; cursor: pointer; touch-action: manipulation; pointer-events: auto; -webkit-user-select: none; user-select: none; transition: left .45s ease; }
        .giant-dead { visibility: hidden; pointer-events: none; }
        .giant-hp-bar { position: absolute; bottom: -10px; left: 25%; right: 25%; height: 5px; border-radius: 999px; background: #294054; overflow: hidden; }
        .giant-hp-bar-fill { height: 100%; border-radius: 999px; background: #f3cc7a; transition: width .2s ease; }
        .pressure-meter { position: absolute; right: 10px; top: 82px; z-index: 5; width: 130px; border-radius: 9px; padding: 4px 7px; background: #294557ed; border: 1px solid #d7e6e9; font-family: var(--font-nunito); font-size: 11px; font-weight: 900; pointer-events: none; }
        .pressure-meter span { display: block; height: 5px; border-radius: 999px; margin-top: 3px; background: linear-gradient(90deg,#b8d47b,#f6cd6c,#e79b7e); width: var(--fear-line-width); transition: width .3s ease; }
        .progress-path { position: absolute; left: 8%; right: 8%; bottom: 7px; height: 8px; border-radius: 999px; background: #314934; border: 1px solid #f7e1b2; z-index: 5; overflow: hidden; }
        .progress-path span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg,#fef08a,#22c55e); width: var(--progress); box-shadow: 0 0 20px rgba(34,197,94,.7); }
        .action-burst { position: absolute; left: 28%; bottom: 28%; z-index: 6; pointer-events: none; border-radius: 999px; padding: 10px 14px; background: rgba(255,255,255,.9); color: #14532d; font-family: var(--font-nunito); font-weight: 1000; box-shadow: 0 14px 32px rgba(0,0,0,.22); animation: burst-rise .8s ease-out both; }
        .guide-card { display: grid; grid-template-columns: 58px 1fr; gap: 12px; align-items: center; border-radius: 20px; padding: 12px; margin-bottom: 12px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18); }
        .guide-symbol { display: grid; place-items: center; width: 52px; height: 52px; border: 1px solid #dac78c; border-radius: 14px; background: #234a48; color: #ffe5a6; font-size: 30px; }
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

        @keyframes burst-rise { 0% { opacity: 0; transform: translateY(18px) scale(.92); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-34px) scale(1.08); } }
        @media (max-width: 880px) { .giants-grid { grid-template-columns: 1fr; } .promise-arena { min-height: 360px; } .giants-stat { grid-template-columns: repeat(2,1fr); } }
        .journey-map { display: flex; gap: 5px; list-style: none; padding: 0; margin: 12px 0; }
        .journey-map li { flex: 1; text-align: center; border: 1px solid #94a3b8; border-radius: 8px; padding: 6px 0; font-weight: 900; background: #172a3c; }
        .journey-map li[aria-current="step"] { outline: 3px solid #fde68a; background: #365d43; }
        .course-sign { position: absolute; top: 16px; left: 16px; right: 16px; z-index: 6; background: #112a32; padding: 10px 14px; border-radius: 14px; font-weight: 900; }

        .turn-advice { padding: 10px; border-radius: 12px; background: #102b34; line-height: 1.5; }
        .turn-advice[data-warning="true"] { border: 2px solid #fbbf24; }
        .course-scripture summary { cursor: pointer; min-height: 32px; font-weight: 900; color: #fde68a; }
        .phase-play .giants-stat { grid-template-columns: repeat(5,minmax(0,1fr)); font-size: .85rem; }
        .phase-play .badge-row { display: none; }
        .phase-play .promise-arena { min-height: 350px; }
        .phase-play .giants-card { padding: 14px; }
        @media (max-width: 880px) { .phase-play .giants-card { order: 0; } .phase-play .promise-arena { min-height: 270px !important; } .phase-play .giants-stat div { padding: 6px 2px; } .phase-play .giants-stat div:nth-child(2) { font-size: .7rem; } }
        /* The active board owns the viewport; modal results are outside the isolated arena. */
        .giants-wrap.phase-play { position: fixed; inset: 0; z-index: 200; width: 100%; max-width: none; height: 100dvh; padding: max(8px,env(safe-area-inset-top)) 10px max(8px,env(safe-area-inset-bottom)); background: #102c2b; display: grid; grid-template-rows: 44px auto auto minmax(0,1fr); gap: 6px; }
        .phase-play > a { align-self: center; justify-self: start; display: inline-flex; align-items: center; min-height: 44px; padding: 6px 12px; border: 1px solid #84a794; border-radius: 12px; }
        .phase-play .giants-stat { margin: 0; font-size: 13px; }
        .phase-play .giants-stat div { padding: 5px; }
        .phase-play .giants-stat div span { display: none; }
        .phase-play .journey-map { margin: 0 0 2px; }
        .phase-play .journey-map li { padding: 3px 0; }
        .phase-play .giants-grid { display: grid !important; min-height: 0; grid-template-columns: minmax(0,1.1fr) minmax(280px,1fr); gap: 10px; }
        .phase-play .promise-arena { height: 100%; min-height: 0 !important; border-radius: 22px; }
        .phase-play .giants-card { min-height: 0; overflow: auto; background: #24433f; box-shadow: none; border-radius: 18px; }
        .phase-play .giants-card > h2, .phase-play .giants-card > .puzzle-label { display: none; }
        .phase-play .course-scripture { padding: 8px !important; }
        .phase-play .course-scripture summary { min-height: 44px; display: flex; align-items: center; font-size: 14px; }
        .phase-play .turn-advice { font-family: var(--font-nunito); font-size: 14px; }
        .phase-play .course-actions > p:first-child { font-family: var(--font-nunito); font-size: 14px; }
        .phase-play .course-actions { z-index: auto; }
        @media (max-width: 880px) and (orientation: portrait) {
          .phase-play .giants-grid { grid-template-columns: 1fr; grid-template-rows: minmax(230px,40%) minmax(0,1fr); }
          .phase-play .giants-card { order: 0; padding: 10px; }
          .phase-play .giant { width: 115px; height: 90px; }
          .phase-play .course-sign { top: 10px; left: 10px; right: 10px; padding: 6px 10px; font-size: 14px; }

        }
        @media (max-height: 500px) and (orientation: landscape) {
          .giants-wrap.phase-play { grid-template-rows: 44px auto minmax(0,1fr); }
          .phase-play .journey-map { display: none; }
          .phase-play .giants-grid { grid-template-columns: minmax(0,1fr) minmax(260px,1fr); }
          .phase-play .giant { width: 105px; height: 78px; }
          .phase-play .giant-line { inset: 66px 0 20px; }
          .phase-play .pressure-meter { top: 68px; width: 115px; font-size: 10px; }
          .phase-play .course-sign { top: 8px; left: 8px; right: 8px; padding: 5px 8px; font-size: 12px; }
        }
      `}</style>

      <div className={`giants-wrap phase-${phase}`} data-testid="giants-game" data-state={JSON.stringify({ phase, levelIndex, obstacles: giantHps, resolve, fear: fearLine, health, helpers, coins, strength: strengthTurns, badges: badges.length, answerLocked, progress: progressPercent })}>
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

        {phase !== 'intro' && <ol className="journey-map" aria-label={isRu ? 'Путь: 10 уровней' : 'Journey: 10 courses'}>{LEVELS.map((item, index) => <li key={item.nameEn} aria-current={index === levelIndex ? 'step' : undefined} aria-label={`${isRu ? item.nameRu : item.nameEn}${index < badges.length ? (isRu ? ', пройден' : ', completed') : ''}`}>{index < badges.length ? '✓' : index + 1}</li>)}</ol>}
        <section className="giants-grid">
          <div className={`promise-arena ${lastAction === 'step' ? 'is-step' : lastAction === 'hit' ? 'is-hit' : lastAction === 'power' ? 'is-power' : ''}`} aria-label={copy.title}>
            <ExpeditionWorld progress={progressPercent} helpers={helpers} isRu={isRu} />
            {phase === 'play' && <div className="course-sign">{isRu ? 'До лагеря' : 'Path to camp'} · {progressPercent}%<br /><small>{isRu ? 'Преграда' : 'Obstacle'} {activeObstacle + 1}/{giantHps.length} · {isRu ? 'Осталось сил страха' : 'Fear remaining'}: {giantHps[activeObstacle]}</small></div>}

            <div className="pressure-meter" aria-hidden="true">{copy.pressure}<span style={{ ['--fear-line-width' as string]: `${clamp(fearLine, 0, 100)}%` }} /></div>
            <div className="giant-line">
              {giantHps.map((hp, index) => {
                if (index !== activeObstacle) return null
                const isHitting = hittingIndex === index
                const isDead = hp <= 0
                const classNames = ['giant', isBoss ? 'boss' : '', isHitting ? 'giant-hit' : '', isDead ? 'giant-dead' : ''].filter(Boolean).join(' ')
                return (
                  <button
                    type="button"
                    disabled={phase !== 'play' || resolve < 1}
                    key={index}
                    className={classNames}
                    style={{ left: `${36 + progressPercent * .45}%`, ['--cloud-scale' as string]: .48 + .52 * hp / giantMaxHp, ['--cloud-opacity' as string]: .5 + .5 * hp / giantMaxHp }}
                    onClick={() => attackGiant(index)}
                    aria-label={isRu ? `Пройти страх ${index + 1}, осталось ${hp}` : `Advance through fear ${index + 1}, ${hp} remaining`}
                  >
                    <span className="fear-cloud-art" aria-hidden="true" />
                    <span className="giant-hp-label" aria-hidden="true">{copy.fear} {hp}/{giantMaxHp}</span>
                    <span className="giant-hp-bar" aria-hidden="true"><span className="giant-hp-bar-fill" style={{ display: 'block', width: `${hp / giantMaxHp * 100}%` }} /></span>
                  </button>
                )
              })}
            </div>
            {lastAction !== 'none' && phase === 'play' && <div className="action-burst">{lastAction === 'hit' ? `-${isRu ? 'сердце' : 'heart'}` : lastAction === 'power' ? (isRu ? 'Усиление!' : 'Power ready!') : `+${copy.courage}`}</div>}
            <div className="progress-path" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent} aria-label={isRu ? 'Путь к лагерю' : 'Path to camp'}><span style={{ ['--progress' as string]: `${progressPercent}%` }} /></div>


          </div>

          <aside className="giants-card">
            <div className="guide-card">
              <div className="guide-symbol" aria-hidden="true">{guide.tone === 'rosie' ? '▤' : '✧'}</div>
              <div>
                <p className="puzzle-label" style={{ color: '#ffd866', margin: 0 }}>{isRu ? guide.roleRu : guide.roleEn}</p>
                <h3 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, margin: '2px 0 4px', color: '#fff' }}>{isRu ? guide.nameRu : guide.nameEn}</h3>
                <p style={{ fontFamily: 'var(--font-lora)', color: 'rgba(255,255,255,.88)', fontWeight: 700, lineHeight: 1.42, fontSize: '.92rem' }}>{isRu ? guide.lineRu : guide.lineEn}</p>
              </div>
            </div>
            <p className="puzzle-label" style={{ color: '#ffd866' }}>{isRu ? level.nameRu : level.nameEn}</p>
            <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '1.35rem', color: '#fff', marginBottom: 8 }}>{phase === 'question' ? copy.answerTitle : copy.report}</h2>
            {isBoss && <p style={{ fontFamily: 'var(--font-nunito)', color: '#fed7aa', fontWeight: 900, lineHeight: 1.45, marginBottom: 8 }}>{copy.bossHint}</p>}

            <details open={phase === 'question'} className="course-scripture" style={{ borderRadius: 20, padding: 14, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.16)' }}>
              <summary>{copy.scriptureTitle} · {isRu ? scripture.refRu : scripture.refEn}</summary>
              <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.58, color: 'rgba(255,255,255,.9)', fontWeight: 700 }}>{isRu ? scripture.textRu : scripture.textEn}</p>
              <p style={{ fontFamily: 'var(--font-nunito)', color: '#bfdbfe', fontWeight: 1000, marginTop: 8 }}>— {isRu ? scripture.refRu : scripture.refEn}</p>
            </details>

            {phase === 'question' ? (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontFamily: 'var(--font-lora)', color: 'rgba(255,255,255,.9)', lineHeight: 1.55, fontWeight: 700 }}>{copy.answerHelp}</p>
                <h3 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, marginTop: 10 }}>{isRu ? scripture.question.promptRu : scripture.question.promptEn}</h3>
                <div className="answer-grid">
                  {answerOrder(levelIndex).map((index) => (
                    /* Keep original choice IDs when varying visible answer positions. */
                    <button key={index} disabled={answerLocked} className={selectedAnswer === index ? 'selected' : ''} onClick={() => answerQuestion(index)}>{(isRu ? scripture.question.choicesRu : scripture.question.choicesEn)[index]}</button>
                  ))}
                </div>
                {answerLocked && <button className="pz-btn" onClick={() => { setPhase('play'); setMessage(copy.tapHint) }}>{isRu ? 'В путь!' : 'Enter the course'}</button>}
                <p role="status" style={{ marginTop: 10, minHeight: 24, fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: selectedAnswer === scripture.question.answer ? '#bbf7d0' : '#fed7aa' }}>{message || ' '}</p>
              </div>
            ) : (
              <div style={{ marginTop: 16 }}>
                {isBoss && phase === 'play' && (
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, color: '#fed7aa', marginBottom: 8 }}>
                    {isRu ? `Преграда страха: ${bossCurrentHp}/${BOSS_MAX_HP}` : `Fear barrier: ${bossCurrentHp}/${BOSS_MAX_HP}`}
                  </p>
                )}
                {phase === 'play' && <div className="course-actions">
                  <p>{isRu ? 'Решимость' : 'Resolve'}: {resolve}/3 · {isRu ? 'Препятствие' : 'Obstacle'} {Math.max(0, activeObstacle) + 1}/{giantHps.length} · {copy.fear}: {Math.round(fearLine)}%</p>
                  <p className="turn-advice" data-warning={forecast.losesHeart || resolve === 0} role="status">{resolve === 0 ? (isRu ? 'Сначала сплотись: нужна решимость.' : 'Rally first: you need resolve.') : forecast.losesHeart ? (isRu ? 'Следующий шаг отнимет 1 сердце. Сплотись, чтобы снизить страх.' : 'The next advance costs 1 heart. Rally to lower fear.') : (isRu ? 'Можно идти: следующий шаг не отнимет сердце.' : 'Ready: the next advance will not cost a heart.')}<br /><small>{isRu ? `Шаг: +${forecast.pressure} страха. При 100 — минус сердце. Сплочение: −${forecast.rallyRelief} страха, +${forecast.rallyResolve} решимость. Время не торопит.` : `Advance: +${forecast.pressure} fear. At 100, lose a heart. Rally: −${forecast.rallyRelief} fear, +${forecast.rallyResolve} resolve. Take your time.`}</small></p>
                  <TurnChoices state={{ obstacles: giantHps, resolve, fear: fearLine, health, coins, strength: strengthTurns }} level={levelIndex} helpers={helpers} isRu={isRu} onAdvance={() => attackGiant(activeObstacle)} onRally={courageStep} />
                </div>}
                <button className="pz-btn" disabled={phase === 'play' && resolve === 3 && fearLine === 0} style={{ display: phase === 'play' ? 'none' : undefined, width: '100%', minHeight: 58, fontSize: '1.05rem' }} onClick={phase === 'play' ? courageStep : startGame}>
                  {phase === 'play' ? (isRu ? 'Сплотиться +1' : 'Rally +1') : copy.restart}
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
                        <button data-testid={`power-${key}`} key={key} disabled={phase !== 'play' || coins < power.cost || (key === 'health' && health === 6) || (key === 'people' && helpers === 8) || (key === 'strength' && strengthTurns > 0)} onClick={() => spendPowerup(key)}>
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
            {phase === 'intro' && (
              <div className="arena-overlay">
                <div>
                  <p className="puzzle-label">{copy.bigTruth}</p>
                  <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '2rem', margin: '6px 0 10px' }}>{isRu ? 'Путь к обетованию' : 'The Promise Journey'}</h2>
                  <p style={{ fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.62 }}>{isRu ? 'Прочитай стих. Веди команду через облака страха: шаг расходует решимость, сплочение её возвращает. Это препятствия, а не люди.' : 'Read the verse. Guide your team through clouds of fear: advance spends resolve; rally restores it. These are obstacles, not people.'}</p>
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
                    <p className="pq-text">{isRu ? scripture.textRu : scripture.textEn}</p>
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
                  {phase === 'defeat' && <p>{isRu ? 'Повторим этот уровень с 6 сердцами. Монеты и помощники вернутся к началу уровня. Награды этой попытки сбросятся. Контрольная точка действует до закрытия игры.' : 'Retry this course with 6 hearts. Coins and helpers return to the start of this course; rewards from this attempt reset. This checkpoint lasts until you leave the game.'}</p>}
                  {phase !== 'levelComplete' && <button className="pz-btn" style={{ width: 'auto', padding: '12px 28px' }} onClick={phase === 'defeat' ? retryLevel : startGame}>{phase === 'defeat' ? (isRu ? 'Повторить этот уровень' : 'Retry this checkpoint') : copy.playAgain}</button>}
                </div>
              </div>
            )}
      </div>
    </main>
  )
}
