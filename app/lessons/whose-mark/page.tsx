'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { recordGradedAnswer, markLessonComplete, resetLessonMastery } from '@/lib/lesson-mastery'

const LESSON_ID = 'whose-mark'
const BLUE = '#173f73'
const GOLD = '#d99a25'
const INK = '#17243a'
const CREAM = '#fff9ed'
const PROGRESS_KEY = 'whose-mark-progress'
const PROGRESS_EVENT = 'whose-mark-progress-change'
const DEFAULT_PROGRESS = JSON.stringify({ coinRevealed: false, scenarioIndex: 0, scenariosComplete: false, truthIndex: 0, complete: false })
let volatileProgress = DEFAULT_PROGRESS

const VISUALS = {
  hero: '/images/jr/lessons/whose-mark/00-hero-whose-mark.png',
  trap: '/images/jr/lessons/whose-mark/01-hidden-trap.png',
  coin: '/images/jr/lessons/whose-mark/02-look-at-coin.png',
  faithful: '/images/jr/lessons/whose-mark/03-faithful-both-lanes.png',
  image: '/images/jr/lessons/whose-mark/04-gods-image.png',
  complete: '/images/jr/lessons/whose-mark/05-open-hands-loyal-heart.png',
}

type Progress = {
  coinRevealed: boolean
  scenarioIndex: number
  scenariosComplete: boolean
  truthIndex: number
  complete: boolean
}

type Choice = { text: string; correct: boolean; explain: string }
type Scenario = { emoji: string; lane: string; prompt: string; choices: Choice[] }
type Truth = { text: string; answer: boolean; explain: string }

function getProgressSnapshot() {
  try {
    volatileProgress = localStorage.getItem(PROGRESS_KEY) ?? volatileProgress
  } catch {
    // Keep the lesson playable when storage is unavailable.
  }
  return volatileProgress
}

function subscribeToProgress(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === PROGRESS_KEY) onStoreChange()
  }
  window.addEventListener('storage', handleStorage)
  window.addEventListener(PROGRESS_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(PROGRESS_EVENT, onStoreChange)
  }
}

function writeProgress(value: string) {
  volatileProgress = value
  try {
    localStorage.setItem(PROGRESS_KEY, value)
  } catch {
    // The in-memory copy still keeps this visit playable.
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

function parseProgress(value: string): Progress {
  try {
    const parsed = JSON.parse(value) as Partial<Progress>
    return {
      coinRevealed: parsed.coinRevealed === true,
      scenarioIndex: Math.min(4, Math.max(0, Number(parsed.scenarioIndex) || 0)),
      scenariosComplete: parsed.scenariosComplete === true,
      truthIndex: Math.min(6, Math.max(0, Number(parsed.truthIndex) || 0)),
      complete: parsed.complete === true,
    }
  } catch {
    return JSON.parse(DEFAULT_PROGRESS) as Progress
  }
}

const scriptureEn = {
  answer: {
    reference: 'Matthew 22:21', translation: 'ESV',
    text: 'They said, “Caesar’s.” Then he said to them, “Therefore render to Caesar the things that are Caesar’s, and to God the things that are God’s.”',
    url: 'https://www.bible.com/bible/59/MAT.22.21.ESV',
  },
  image: {
    reference: 'Genesis 1:27', translation: 'ESV',
    text: 'So God created man in his own image, in the image of God he created him; male and female he created them.',
    url: 'https://www.bible.com/bible/59/GEN.1.27.ESV',
  },
}

const scriptureRu = {
  answer: {
    reference: 'Матфея 22:21', translation: 'RST',
    text: 'Говорят Ему: кесаревы. Тогда говорит им: итак отдавайте кесарево кесарю, а Божие Богу.',
    url: 'https://www.bible.com/bible/167/MAT.22.21.RST',
  },
  image: {
    reference: 'Бытие 1:27', translation: 'RST',
    text: 'И сотворил Бог человека по образу Своему, по образу Божию сотворил его; мужчину и женщину сотворил их.',
    url: 'https://www.bible.com/bible/167/GEN.1.27.RST',
  },
}

type Scripture = typeof scriptureEn.answer

const scenariosEn: Scenario[] = [
  {
    emoji: '📚', lane: 'Faithful responsibility',
    prompt: 'A library book is due, but you want to keep it longer without asking. What is the faithful choice?',
    choices: [
      { text: 'Return or renew it honestly', correct: true, explain: 'Right. Shared rules and borrowed property should be handled honestly. Serving God includes being trustworthy with what belongs to others.' },
      { text: 'Hide it because God matters more than library rules', correct: false, explain: 'Try again. Loving God is not an excuse for dishonesty. Ordinary responsibilities can be part of obeying Him.' },
    ],
  },
  {
    emoji: '🧹', lane: 'Love your neighbor',
    prompt: 'Your class used a public park for an event. What should happen before everyone leaves?',
    choices: [
      { text: 'Help clean the shared space', correct: true, explain: 'Yes. Caring for shared places is a practical way to love neighbors and act responsibly.' },
      { text: 'Leave the mess because worship is the only thing God cares about', correct: false, explain: 'God cares about worship and how we treat people and their shared spaces.' },
    ],
  },
  {
    emoji: '🙏', lane: 'Worship belongs to God',
    prompt: 'Someone says a powerful human leader deserves the kind of worship only God should receive. What is true?',
    choices: [
      { text: 'Respect people, but worship God alone', correct: true, explain: 'Exactly. Human authorities may receive proper respect, but prayer, worship, and highest loyalty belong to God.' },
      { text: 'Powerful leaders should receive worship too', correct: false, explain: 'No human being is God. Jesus’ answer never gives Caesar God’s place.' },
    ],
  },
  {
    emoji: '🎟️', lane: 'Obey God first',
    prompt: 'An adult tells you to lie about your age so your family can pay a cheaper price. What should you do?',
    choices: [
      { text: 'Tell the truth and ask a trusted adult for help', correct: true, explain: 'Good. Acts 5:29 teaches that we must obey God rather than people when someone tells us to sin.' },
      { text: 'Lie because every adult command must be obeyed', correct: false, explain: 'Human authority is never permission to disobey God. Get help from a trustworthy adult and keep telling the truth.' },
    ],
  },
  {
    emoji: '🪙', lane: 'The whole life belongs to God',
    prompt: 'The coin carried Caesar’s image. You carry God’s image. What does that mean?',
    choices: [
      { text: 'My whole life should honor God—even in ordinary duties', correct: true, explain: 'That is the heart of the lesson. Civic duty is one part of a life already lived under God.' },
      { text: 'Only church time belongs to God', correct: false, explain: 'God is not limited to one day or place. Your worship, choices, relationships, work, and ordinary responsibilities all matter to Him.' },
    ],
  },
]

const scenariosRu: Scenario[] = [
  {
    emoji: '📚', lane: 'Верная ответственность',
    prompt: 'Пора вернуть библиотечную книгу, но тебе хочется оставить её подольше и никому не сказать. Как поступить верно?',
    choices: [
      { text: 'Честно вернуть или продлить книгу', correct: true, explain: 'Верно. Общие правила и чужие вещи требуют честности. Служить Богу — значит быть надёжным.' },
      { text: 'Спрятать книгу: ведь Бог важнее библиотечных правил', correct: false, explain: 'Попробуй ещё раз. Любовь к Богу не оправдывает нечестность. Обычные обязанности тоже могут быть послушанием Ему.' },
    ],
  },
  {
    emoji: '🧹', lane: 'Люби ближнего',
    prompt: 'Ваш класс провёл встречу в общественном парке. Что нужно сделать перед уходом?',
    choices: [
      { text: 'Помочь убрать общее место', correct: true, explain: 'Да. Заботиться об общем месте — практический способ любить ближних и поступать ответственно.' },
      { text: 'Оставить мусор: Богу важно только поклонение', correct: false, explain: 'Богу важно и поклонение, и то, как мы относимся к людям и общим местам.' },
    ],
  },
  {
    emoji: '🙏', lane: 'Поклонение принадлежит Богу',
    prompt: 'Кто-то говорит, что влиятельный правитель достоин поклонения, которое принадлежит Богу. Где истина?',
    choices: [
      { text: 'Уважать людей, но поклоняться только Богу', correct: true, explain: 'Именно. Власти можно оказывать должное уважение, но молитва, поклонение и высшая верность принадлежат Богу.' },
      { text: 'Влиятельным правителям тоже нужно поклоняться', correct: false, explain: 'Ни один человек не является Богом. Ответ Иисуса не отдаёт кесарю Божье место.' },
    ],
  },
  {
    emoji: '🎟️', lane: 'Сначала слушайся Бога',
    prompt: 'Взрослый велит солгать о твоём возрасте, чтобы заплатить меньше. Что делать?',
    choices: [
      { text: 'Сказать правду и обратиться к надёжному взрослому', correct: true, explain: 'Хорошо. Деяния 5:29 учат слушаться Бога больше людей, если нас заставляют грешить.' },
      { text: 'Солгать, потому что любое слово взрослого обязательно', correct: false, explain: 'Человеческая власть не даёт права нарушать Божью волю. Обратись за помощью и продолжай говорить правду.' },
    ],
  },
  {
    emoji: '🪙', lane: 'Вся жизнь принадлежит Богу',
    prompt: 'На монете был образ кесаря. Ты создан по образу Бога. Что это значит?',
    choices: [
      { text: 'Вся моя жизнь должна чтить Бога — даже в обычных делах', correct: true, explain: 'Это сердце урока. Гражданские обязанности — часть жизни, которая уже проходит перед Богом.' },
      { text: 'Богу принадлежит только время в церкви', correct: false, explain: 'Бог не ограничен одним днём или местом. Ему важны поклонение, выборы, отношения, труд и обычные обязанности.' },
    ],
  },
]

const truthsEn: Truth[] = [
  { text: 'Jesus’ enemies asked an honest question because they wanted to learn.', answer: false, explain: 'Matthew says they planned to trap Jesus in His words. He saw the hidden motive and answered with wisdom.' },
  { text: 'Jesus taught that ordinary civic responsibilities can be handled honestly.', answer: true, explain: 'Yes. Giving Caesar what is properly Caesar’s rejects dishonesty and needless rebellion.' },
  { text: 'The government owns part of every person because its image is on money.', answer: false, explain: 'No. The coin could be used to pay what was owed, but no ruler owns our worship, conscience, or whole person.' },
  { text: 'If a human command requires sin, Christians must obey God first.', answer: true, explain: 'Yes. Acts 5:29 gives that boundary. Respect for authority never replaces obedience to God.' },
  { text: 'Obeying God first means I can ignore any rule I dislike.', answer: false, explain: 'No. An inconvenient rule is not the same as a command to sin. Refuse actual wrongdoing respectfully and seek help from a trusted Christian adult.' },
  { text: 'Giving to God means only putting money in an offering.', answer: false, explain: 'No. Giving is important, but your worship, choices, relationships, service, and whole life belong to God.' },
  { text: 'Church time belongs to God, but ordinary life belongs to someone else.', answer: false, explain: 'Everything belongs to God. We honor Him in worship and in honest, loving, everyday responsibility.' },
]

const truthsRu: Truth[] = [
  { text: 'Враги Иисуса задали честный вопрос, потому что хотели учиться.', answer: false, explain: 'Матфей говорит, что они хотели уловить Иисуса в словах. Он видел скрытый замысел и ответил мудро.' },
  { text: 'Иисус учил честно исполнять обычные гражданские обязанности.', answer: true, explain: 'Да. Отдать кесарю должное — значит не обманывать и не бунтовать без причины.' },
  { text: 'Государство владеет частью каждого человека, потому что на деньгах есть образ правителя.', answer: false, explain: 'Нет. Монетой можно было заплатить должное, но правитель не владеет нашим поклонением, совестью или всей личностью.' },
  { text: 'Если человеческий приказ требует греха, христианин должен прежде слушаться Бога.', answer: true, explain: 'Да. Эту границу показывает Деяния 5:29. Уважение к власти не заменяет послушание Богу.' },
  { text: '«Сначала слушайся Бога» означает, что можно нарушать любое неприятное правило.', answer: false, explain: 'Нет. Неудобное правило — не то же самое, что приказ согрешить. Откажись от настоящего зла уважительно и обратись к надёжному верующему взрослому.' },
  { text: '«Отдать Богу» означает только пожертвовать деньги.', answer: false, explain: 'Нет. Пожертвования важны, но Богу принадлежат наше поклонение, выборы, отношения, служение и вся жизнь.' },
  { text: 'Время в церкви принадлежит Богу, а обычная жизнь — кому-то другому.', answer: false, explain: 'Всё принадлежит Богу. Мы чтим Его и в поклонении, и в честной, любящей повседневной ответственности.' },
]

function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <section style={{ background: 'rgba(255,255,255,.96)', borderRadius: 28, padding: 'clamp(20px,4vw,38px)', boxShadow: '0 18px 50px rgba(23,63,115,.12)', border: '1px solid rgba(23,63,115,.12)', ...style }}>{children}</section>
}

function ScriptureBox({ value, isRu }: { value: Scripture; isRu: boolean }) {
  return <div style={{ margin: '20px 0', padding: 20, borderRadius: 20, border: '2px solid rgba(217,154,37,.3)', background: '#fffaf0' }}>
    <a href={value.url} target="_blank" rel="noreferrer" style={{ color: BLUE, fontWeight: 950, textDecoration: 'none' }}>{value.reference} · {value.translation} ↗</a>
    <blockquote style={{ margin: '12px 0 6px', color: INK, fontFamily: 'var(--font-lora)', fontSize: 'clamp(1rem,2.4vw,1.2rem)', lineHeight: 1.7 }}>“{value.text}”</blockquote>
    <small style={{ color: '#64748b', fontWeight: 750 }}>{isRu ? 'Точный текст и ссылка: Bible.com' : 'Exact text and source link: Bible.com'}</small>
  </div>
}

function LessonImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return <figure style={{ margin: '18px 0', overflow: 'hidden', borderRadius: 22, background: '#fef3c7', boxShadow: '0 12px 30px rgba(23,63,115,.12)' }}>
    <div style={{ position: 'relative', aspectRatio: '4 / 3' }}><Image src={src} alt={alt} fill sizes="(max-width: 760px) 100vw, 720px" style={{ objectFit: 'cover' }} /></div>
    <figcaption style={{ padding: '12px 16px 14px', color: '#475569', fontWeight: 800, lineHeight: 1.45 }}>{caption}</figcaption>
  </figure>
}

export default function WhoseMarkPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const scripture = isRu ? scriptureRu : scriptureEn
  const scenarios = isRu ? scenariosRu : scenariosEn
  const truths = isRu ? truthsRu : truthsEn
  const serializedProgress = useSyncExternalStore(subscribeToProgress, getProgressSnapshot, () => DEFAULT_PROGRESS)
  const progress = useMemo(() => parseProgress(serializedProgress), [serializedProgress])
  const { coinRevealed, scenarioIndex, scenariosComplete, truthIndex, complete } = progress
  const [scenarioFeedback, setScenarioFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [truthFeedback, setTruthFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  // Tracks which scenario/truth indices were ever answered wrong before being
  // answered correctly, so mastery only credits a true first-try correct.
  const [scenarioErred, setScenarioErred] = useState<Set<number>>(new Set())
  const [truthErred, setTruthErred] = useState<Set<number>>(new Set())
  const percent = complete ? 100 : scenariosComplete ? 76 + truthIndex * 5 : coinRevealed ? 28 + scenarioIndex * 9 : 12

  function saveProgress(patch: Partial<Progress>) {
    writeProgress(JSON.stringify({ ...progress, ...patch }))
  }

  function chooseScenario(choice: Choice) {
    if (scenarioFeedback || scenariosComplete) return
    setScenarioFeedback({ ok: choice.correct, text: choice.explain })
    if (!choice.correct) setScenarioErred(prev => new Set(prev).add(scenarioIndex))
    window.setTimeout(() => {
      setScenarioFeedback(null)
      if (!choice.correct) return
      recordGradedAnswer(LESSON_ID, !scenarioErred.has(scenarioIndex))
      if (scenarioIndex < scenarios.length - 1) saveProgress({ scenarioIndex: scenarioIndex + 1 })
      else saveProgress({ scenariosComplete: true })
    }, 1150)
  }

  function answerTruth(answer: boolean) {
    if (truthFeedback || !scenariosComplete || complete) return
    const item = truths[truthIndex]
    const ok = answer === item.answer
    setTruthFeedback({ ok, text: ok ? item.explain : (isRu ? 'Вернись к смыслу отрывка и попробуй ещё раз.' : 'Return to the passage’s meaning and try again.') })
    if (!ok) setTruthErred(prev => new Set(prev).add(truthIndex))
    window.setTimeout(() => {
      setTruthFeedback(null)
      if (!ok) return
      recordGradedAnswer(LESSON_ID, !truthErred.has(truthIndex))
      if (truthIndex < truths.length - 1) saveProgress({ truthIndex: truthIndex + 1 })
      else {
        saveProgress({ complete: true })
        markLessonComplete(LESSON_ID)
      }
    }, 1150)
  }

  function restart() {
    writeProgress(DEFAULT_PROGRESS)
    resetLessonMastery(LESSON_ID)
    setScenarioFeedback(null)
    setTruthFeedback(null)
    setScenarioErred(new Set())
    setTruthErred(new Set())
  }

  return <main style={{ minHeight: '100vh', background: `radial-gradient(circle at 15% 0,rgba(252,211,77,.28),transparent 30%),linear-gradient(180deg,${CREAM},#e7f0fb 72%,#dbeafe)`, color: INK }}>
    <div style={{ maxWidth: 1060, margin: '0 auto', padding: '22px clamp(15px,4vw,42px) 72px' }}>
      <Link href="/lessons" style={{ color: BLUE, fontWeight: 950, textDecoration: 'none' }}>← {isRu ? 'Все уроки' : 'All lessons'}</Link>

      <header style={{ position: 'relative', overflow: 'hidden', minHeight: 460, borderRadius: 30, margin: '18px 0 18px', display: 'grid', alignItems: 'end', boxShadow: '0 25px 65px rgba(23,36,58,.24)' }}>
        <Image src={VISUALS.hero} alt={isRu ? 'Иисус показывает монету спрашивающим, а Майкл в зелёной одежде смотрит на неё рядом с открытой Библией' : 'Jesus shows a coin to the questioners while Michael in green watches beside an open Bible'} fill priority sizes="(max-width: 1060px) 100vw, 1060px" style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(10,24,44,.03) 15%,rgba(10,24,44,.94) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(24px,5vw,52px)', color: '#fff' }}>
          <div style={{ color: '#fde68a', fontWeight: 950, letterSpacing: '.06em', textTransform: 'uppercase' }}>{isRu ? 'Матфея 22:15–22 · Мудрость перед ловушкой' : 'Matthew 22:15–22 · Wisdom under pressure'}</div>
          <h1 style={{ margin: '10px 0', fontFamily: 'var(--font-lora)', fontSize: 'clamp(2.45rem,7vw,5rem)', lineHeight: .98 }}>{isRu ? 'Чей образ?' : 'Whose Mark?'}</h1>
          <p style={{ maxWidth: 760, margin: 0, fontSize: 'clamp(1rem,2.5vw,1.24rem)', lineHeight: 1.6, fontWeight: 800 }}>{isRu ? 'На монете был образ кесаря. На людях — Божий образ. Иисус показывает, как жить честно среди людей и всем сердцем принадлежать Богу.' : 'Caesar’s image was on the coin. God’s image is on people. Jesus shows us how to live honestly among people while belonging wholeheartedly to God.'}</p>
        </div>
      </header>

      <div aria-label={isRu ? 'Прогресс урока' : 'Lesson progress'} style={{ height: 12, background: '#cbd5e1', borderRadius: 999, overflow: 'hidden', marginBottom: 24 }}><div style={{ height: '100%', width: `${Math.min(100, percent)}%`, background: `linear-gradient(90deg,${BLUE},${GOLD})`, transition: 'width .3s ease' }} /></div>

      <div style={{ display: 'grid', gap: 22 }}>
        <Panel>
          <h2 style={{ marginTop: 0, fontSize: 'clamp(1.55rem,4vw,2.25rem)' }}>{isRu ? '1. Вопрос с крючком' : '1. A question with a hook'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 18, alignItems: 'start' }}>
            <LessonImage src={VISUALS.trap} alt={isRu ? 'Свободная верёвочная петля на полу показывает попытку фарисеев и иродиан уловить Иисуса вопросом' : 'A loose rope loop on the floor symbolizes the Pharisees and Herodians trying to trap Jesus with a question'} caption={isRu ? 'Вопрос звучал вежливо, но был ловушкой.' : 'The question sounded polite, but it was a trap.'} />
            <div>
              <p style={{ lineHeight: 1.75, fontSize: '1.06rem', fontWeight: 700 }}>{isRu ? 'Фарисеи и иродиане обычно не были одной командой. Но здесь они объединились, чтобы уловить Иисуса. Если Он скажет: «Не платите налог», Его можно обвинить перед Римом. Если скажет: «Платите», люди могут решить, что Он поддерживает всё, что делает Рим.' : 'The Pharisees and Herodians were not normally one team. Here they joined forces to trap Jesus. If He said, “Do not pay,” they could accuse Him before Rome. If He said, “Pay,” the crowd might think He approved everything Rome did.'}</p>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontWeight: 750 }}>{isRu ? 'Майкл — вымышленный проводник Junior Disciples. Его нет в библейском рассказе.' : 'Michael is a fictional Junior Disciples guide; he is not a character in the Bible passage.'}</p>
              <div style={{ padding: 17, borderRadius: 16, background: '#eff6ff', borderLeft: `6px solid ${BLUE}`, fontWeight: 850, lineHeight: 1.6 }}>{isRu ? 'Иисус не испугался и не выбрал одну из их ложных дверей. Он показал монету и задал лучший вопрос.' : 'Jesus did not panic or choose one of their false doors. He showed a coin and asked a better question.'}</div>
            </div>
          </div>
        </Panel>

        <Panel>
          <h2 style={{ marginTop: 0 }}>{isRu ? '2. Лаборатория монеты' : '2. The Coin Lab'}</h2>
          <LessonImage src={VISUALS.coin} alt={isRu ? 'Иисус держит одну римскую монету, пока Майкл и слушатели внимательно смотрят' : 'Jesus holds one Roman coin while Michael and the listeners look carefully'} caption={isRu ? 'Иисус спросил, чей образ и имя на монете.' : 'Jesus asked whose image and name were on the coin.'} />
          {!coinRevealed ? <div style={{ textAlign: 'center', padding: 20, borderRadius: 20, background: 'linear-gradient(135deg,#eff6ff,#fef3c7)' }}>
            <div aria-hidden="true" style={{ fontSize: 70 }}>🪙</div>
            <p style={{ fontWeight: 900 }}>{isRu ? 'Нажми, чтобы исследовать подсказку Иисуса.' : 'Tap to investigate Jesus’ clue.'}</p>
            <button type="button" onClick={() => saveProgress({ coinRevealed: true })} style={{ padding: '15px 24px', border: 0, borderRadius: 16, background: BLUE, color: '#fff', font: 'inherit', fontWeight: 950, cursor: 'pointer' }}>{isRu ? 'Рассмотреть монету' : 'Examine the coin'}</button>
          </div> : <div role="status" style={{ padding: 20, borderRadius: 20, background: '#ecfdf5', border: '2px solid #86efac' }}>
            <h3 style={{ marginTop: 0 }}>{isRu ? 'Подсказка найдена' : 'Clue discovered'}</h3>
            <p style={{ lineHeight: 1.7, fontWeight: 750 }}>{isRu ? 'На денарии был образ кесаря. Монета принадлежала его денежной системе, поэтому Иисус сказал отдать кесарю должное. Но затем Он поднял вопрос намного выше: что принадлежит Богу?' : 'The denarius bore Caesar’s image. The coin belonged to his money system, so Jesus said to give Caesar what was properly due. Then Jesus raised the question much higher: what belongs to God?'}</p>
            <ScriptureBox value={scripture.answer} isRu={isRu} />
          </div>}
        </Panel>

        <Panel style={{ opacity: coinRevealed ? 1 : .58 }}>
          <h2 style={{ marginTop: 0 }}>{isRu ? '3. На тебе Божий образ' : '3. God’s image is on you'}</h2>
          {!coinRevealed ? <p style={{ fontWeight: 900 }}>{isRu ? 'Сначала исследуй монету.' : 'Examine the coin first.'}</p> : <>
            <LessonImage src={VISUALS.image} alt={isRu ? 'Майкл, Джозеф, Рози, Грейси и другие дети читают Библию, а зеркало отражает человеческие лица' : 'Michael, Joseph, Rosie, Gracie, and other children read the Bible while a mirror reflects human faces'} caption={isRu ? 'Монета носит образ правителя. Каждый человек создан по образу Бога.' : 'A coin carries a ruler’s image. Every person is made in God’s image.'} />
            <ScriptureBox value={scripture.image} isRu={isRu} />
            <p style={{ lineHeight: 1.75, fontWeight: 750 }}>{isRu ? 'Иисус указал на образ кесаря на монете. Бытие учит, что люди носят Божий образ. Это не значит, что мы выглядим как Бог. Он создал людей, чтобы они отражали Его характер, знали Его и заботились о Его мире. Поэтому кесарь не может потребовать твоего поклонения, совести или всей твоей личности. Вся твоя жизнь уже проходит перед Богом.' : 'Jesus pointed to Caesar’s image on the coin. Genesis teaches that people bear God’s image. This does not mean our bodies look like God. He made people to reflect His character, know Him, and care for His world. No ruler can claim your worship, conscience, or whole person. Your whole life is already lived before God.'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 12 }}>
              {[
                { emoji: '🧾', en: ['Honor authority under God', 'Be honest about money, safety rules, borrowed things, and shared responsibilities as part of obeying God.'], ru: ['Почитай власть перед Богом', 'Будь честен с деньгами, правилами безопасности, чужими вещами и общими обязанностями как часть послушания Богу.'] },
                { emoji: '❤️', en: ['Love your neighbor', 'Good citizenship is not worship; it is one place to practice truth and neighbor-love.'], ru: ['Люби ближнего', 'Ответственность — не поклонение власти, а место для правды и любви к людям.'] },
                { emoji: '🙏', en: ['Worship God alone', 'Prayer, worship, conscience, and highest loyalty never belong to a human ruler.'], ru: ['Поклоняйся только Богу', 'Молитва, поклонение, совесть и высшая верность не принадлежат человеку.'] },
                { emoji: '🛡️', en: ['Obey God first', 'When a person commands sin, follow God and seek help from a trustworthy adult.'], ru: ['Сначала слушайся Бога', 'Если человек требует греха, слушайся Бога и обратись к надёжному взрослому.'] },
              ].map((item) => { const copy = isRu ? item.ru : item.en; return <article key={copy[0]} style={{ padding: 17, borderRadius: 18, background: '#f8fafc' }}><div style={{ fontSize: 36 }}>{item.emoji}</div><h3>{copy[0]}</h3><p style={{ lineHeight: 1.6 }}>{copy[1]}</p></article> })}
            </div>
          </>}
        </Panel>

        <Panel style={{ opacity: coinRevealed ? 1 : .58 }}>
          <h2 style={{ marginTop: 0 }}>{isRu ? `4. Выбери мудрую линию · ${scenarioIndex + 1}/${scenarios.length}` : `4. Choose the wise line · ${scenarioIndex + 1}/${scenarios.length}`}</h2>
          {!coinRevealed ? <p style={{ fontWeight: 900 }}>{isRu ? 'Сначала исследуй монету.' : 'Examine the coin first.'}</p> : scenariosComplete ? <div role="status" style={{ padding: 20, borderRadius: 18, background: '#dcfce7', color: '#14532d', fontWeight: 900 }}>{isRu ? 'Готово! Ты потренировался быть честным, любить ближних, поклоняться Богу и слушаться Его прежде людей.' : 'Complete! You practiced honesty, neighbor-love, worship of God, and obeying Him before people.'}</div> : <>
            <LessonImage src={VISUALS.faithful} alt={isRu ? 'Майкл возвращает книгу, а дети заботятся об общем парке рядом с открытой Библией' : 'Michael returns a book while children care for a shared park near an open Bible'} caption={isRu ? 'Обычная ответственность тоже может чтить Бога.' : 'Ordinary responsibility can honor God too.'} />
            <div style={{ display: 'inline-block', padding: '7px 12px', borderRadius: 999, background: '#fef3c7', color: '#854d0e', fontWeight: 950 }}>{scenarios[scenarioIndex].lane}</div>
            <div style={{ fontSize: 46, marginTop: 10 }}>{scenarios[scenarioIndex].emoji}</div>
            <p style={{ fontSize: '1.16rem', lineHeight: 1.6, fontWeight: 900 }}>{scenarios[scenarioIndex].prompt}</p>
            <div style={{ display: 'grid', gap: 12 }}>{scenarios[scenarioIndex].choices.map((choice) => <button key={choice.text} type="button" onClick={() => chooseScenario(choice)} disabled={Boolean(scenarioFeedback)} style={{ padding: 16, borderRadius: 16, border: '2px solid #bfdbfe', background: '#fff', color: INK, textAlign: 'left', font: 'inherit', fontWeight: 850, cursor: 'pointer' }}>{choice.text}</button>)}</div>
            {scenarioFeedback && <p role="status" style={{ padding: 14, borderRadius: 14, background: scenarioFeedback.ok ? '#dcfce7' : '#fee2e2', color: scenarioFeedback.ok ? '#14532d' : '#7f1d1d', fontWeight: 850 }}>{scenarioFeedback.ok ? '✓ ' : '↺ '}{scenarioFeedback.text}</p>}
          </>}
        </Panel>

        <Panel style={{ opacity: scenariosComplete ? 1 : .58 }}>
          <h2 style={{ marginTop: 0 }}>{isRu ? `5. Проверка истины · ${truthIndex + 1}/${truths.length}` : `5. Truth check · ${truthIndex + 1}/${truths.length}`}</h2>
          {!scenariosComplete ? <p style={{ fontWeight: 900 }}>{isRu ? 'Сначала пройди все пять жизненных ситуаций.' : 'Complete all five life situations first.'}</p> : !complete ? <>
            <p style={{ fontSize: '1.16rem', lineHeight: 1.6, fontWeight: 900 }}>{truths[truthIndex].text}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => answerTruth(true)} disabled={Boolean(truthFeedback)} style={{ flex: '1 1 150px', padding: 16, border: 0, borderRadius: 15, background: '#15803d', color: '#fff', font: 'inherit', fontWeight: 950 }}>{isRu ? 'Правда' : 'True'}</button>
              <button type="button" onClick={() => answerTruth(false)} disabled={Boolean(truthFeedback)} style={{ flex: '1 1 150px', padding: 16, border: 0, borderRadius: 15, background: '#b91c1c', color: '#fff', font: 'inherit', fontWeight: 950 }}>{isRu ? 'Неправда' : 'False'}</button>
            </div>
            {truthFeedback && <p role="status" style={{ padding: 14, borderRadius: 14, background: truthFeedback.ok ? '#dcfce7' : '#fee2e2', color: truthFeedback.ok ? '#14532d' : '#7f1d1d', fontWeight: 850 }}>{truthFeedback.ok ? '✓ ' : '↺ '}{truthFeedback.text}</p>}
          </> : <div style={{ textAlign: 'center', padding: 8 }}>
            <div style={{ fontSize: 64 }}>🪙 → ❤️</div>
            <h3 style={{ fontSize: 'clamp(1.8rem,5vw,3rem)', margin: '8px 0' }}>{isRu ? 'Ты нашёл главный образ' : 'You found the greater image'}</h3>
            <LessonImage src={VISUALS.complete} alt={isRu ? 'Майкл помогает соседу, а друзья несут Библию и служат людям после истории Иисуса' : 'Michael helps a neighbor while his friends carry a Bible and serve people after Jesus’ story'} caption={isRu ? 'Открытые руки служат людям. Верное сердце поклоняется Богу.' : 'Open hands serve people. A loyal heart worships God.'} />
            <p style={{ maxWidth: 720, margin: '12px auto 20px', lineHeight: 1.7, fontWeight: 800 }}>{isRu ? 'Монета напоминала о временном правителе. Ты создан по образу вечного Бога. Живи честно, люби ближних, молись за власти, поклоняйся только Богу и слушайся Его, если кто-то требует греха.' : 'The coin pointed to a temporary ruler. You bear the image of the eternal God. Live honestly, love your neighbors, pray for authorities, worship God alone, and obey Him if anyone commands sin.'}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}><Link href="/lessons" style={{ padding: '14px 20px', borderRadius: 15, background: BLUE, color: '#fff', textDecoration: 'none', fontWeight: 950 }}>{isRu ? 'Выбрать другой урок' : 'Choose another lesson'}</Link><button type="button" onClick={restart} style={{ padding: '14px 20px', borderRadius: 15, border: `2px solid ${BLUE}`, background: '#fff', color: BLUE, font: 'inherit', fontWeight: 950 }}>{isRu ? 'Пройти ещё раз' : 'Do it again'}</button></div>
          </div>}
        </Panel>

        <Panel style={{ background: '#f8fafc' }}>
          <h2 style={{ marginTop: 0 }}>{isRu ? 'Разговор с родителями' : 'Parent conversation'}</h2>
          <ul style={{ lineHeight: 1.85, fontWeight: 700 }}><li>{isRu ? 'Какие обязанности помогают нашей семье служить соседям честно?' : 'Which responsibilities help our family serve our neighbors honestly?'}</li><li>{isRu ? 'Почему образ Бога на человеке важнее образа правителя на монете?' : 'Why does God’s image on a person matter more than a ruler’s image on a coin?'}</li><li>{isRu ? 'К кому ребёнок может обратиться, если взрослый требует солгать или согрешить?' : 'Which trusted adult can a child ask for help if someone tells them to lie or sin?'}</li></ul>
          <p style={{ color: '#64748b', lineHeight: 1.65, marginBottom: 0 }}>{isRu ? 'Бог установил власть для порядка, но человеческая власть ограничена. Урок не учит слепому послушанию и не использует Бога как повод избегать честных обязанностей. Добрые дела не зарабатывают спасение; они могут быть плодом веры. «Сначала слушайся Бога» относится к приказу, который действительно требует греха, а не просто к неудобному правилу. Нужно отказаться от зла уважительно и обратиться к надёжному верующему взрослому.' : 'God establishes authority for order, but human authority is limited. This lesson teaches neither blind obedience nor using God as an excuse to avoid honest duties. Good service does not earn salvation; it can be fruit of faith. “Obey God first” applies when a command truly requires sin, not merely when a rule feels inconvenient. Refuse wrongdoing respectfully and seek help from a trusted Christian adult.'}</p>
        </Panel>
      </div>
    </div>
  </main>
}
