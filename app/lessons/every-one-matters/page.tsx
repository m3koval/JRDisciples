'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const BLUE = '#1d4ed8'
const NAVY = '#172554'
const GOLD = '#fbbf24'
const CREAM = '#eff6ff'
const PROGRESS_KEY = 'every-one-matters'
const PROGRESS_EVENT = 'every-one-matters-progress'
const DEFAULT_PROGRESS = JSON.stringify({ found: false, scenarioIndex: 0, scenariosComplete: false, truthIndex: 0, complete: false })

type Progress = {
  found: boolean
  scenarioIndex: number
  scenariosComplete: boolean
  truthIndex: number
  complete: boolean
}

function getProgressSnapshot() {
  return localStorage.getItem(PROGRESS_KEY) ?? DEFAULT_PROGRESS
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

function parseProgress(value: string): Progress {
  try {
    const parsed = JSON.parse(value) as Partial<Progress>
    return {
      found: parsed.found === true,
      scenarioIndex: Math.min(4, Math.max(0, Number(parsed.scenarioIndex) || 0)),
      scenariosComplete: parsed.scenariosComplete === true,
      truthIndex: Math.min(4, Math.max(0, Number(parsed.truthIndex) || 0)),
      complete: parsed.complete === true,
    }
  } catch {
    return JSON.parse(DEFAULT_PROGRESS) as Progress
  }
}

const scriptureEn = {
  warning: {
    reference: 'Matthew 18:10',
    translation: 'ESV',
    text: 'See that you do not despise one of these little ones. For I tell you that in heaven their angels always see the face of my Father who is in heaven.',
    url: 'https://www.bible.com/bible/59/MAT.18.10.ESV',
  },
  heart: {
    reference: 'Matthew 18:14',
    translation: 'ESV',
    text: 'So it is not the will of my Father who is in heaven that one of these little ones should perish.',
    url: 'https://www.bible.com/bible/59/MAT.18.14.ESV',
  },
}

const scriptureRu = {
  warning: {
    reference: 'Матфея 18:10',
    translation: 'RST',
    text: 'Смотрите, не презирайте ни одного из малых сих; ибо говорю вам, что Ангелы их на небесах всегда видят лице Отца Моего Небесного.',
    url: 'https://www.bible.com/bible/167/MAT.18.10.RST',
  },
  heart: {
    reference: 'Матфея 18:14',
    translation: 'RST',
    text: 'Так, нет воли Отца вашего Небесного, чтобы погиб один из малых сих.',
    url: 'https://www.bible.com/bible/167/MAT.18.14.RST',
  },
}

type Scripture = typeof scriptureEn.warning

type Choice = { text: string; correct: boolean; explain: string }
type Scenario = { emoji: string; prompt: string; choices: Choice[] }

const scenariosEn: Scenario[] = [
  {
    emoji: '🪑',
    prompt: 'A new kid is sitting alone while everyone else has a group. What reflects God’s heart?',
    choices: [
      { text: 'Invite them to join, even if it feels awkward', correct: true, explain: 'God does not overlook the one standing alone. We can notice and welcome them.' },
      { text: 'Stay with my group and pretend I did not see', correct: false, explain: 'Try again. Jesus warns us not to look down on or ignore “one of these little ones.”' },
    ],
  },
  {
    emoji: '🎮',
    prompt: 'Your younger sibling cannot play the game as well as you. What should you do?',
    choices: [
      { text: 'Mock them because strong players matter more', correct: false, explain: 'Strength and skill do not decide someone’s value to God.' },
      { text: 'Help patiently and give them a fair turn', correct: true, explain: 'God cares for the weak and spiritually young, not only the strongest.' },
    ],
  },
  {
    emoji: '💬',
    prompt: 'Kids in a chat are making fun of someone. What is the wise response?',
    choices: [
      { text: 'Do not join in; support them and tell a trusted adult if needed', correct: true, explain: 'Protecting someone from cruelty is different from chasing popularity.' },
      { text: 'Add a joke so everyone likes me', correct: false, explain: 'Popularity is not worth treating another person as if they do not matter.' },
    ],
  },
  {
    emoji: '🙏',
    prompt: 'A friend has wandered from church and does not want to talk about God. What can you do?',
    choices: [
      { text: 'Decide God must not care about them anymore', correct: false, explain: 'The shepherd searches for the wandering one. God’s heart has not become cold.' },
      { text: 'Pray, remain kind, and ask God for a wise opportunity to care', correct: true, explain: 'We cannot force a heart, but we can pray, love, and stay ready to point to Jesus.' },
    ],
  },
  {
    emoji: '🐑',
    prompt: 'Does the wandering sheep matter more than the ninety-nine?',
    choices: [
      { text: 'Yes—the others stop mattering', correct: false, explain: 'No. The sermon carefully explained that the one is not more valuable. The search shows that each one matters.' },
      { text: 'No—every sheep matters, so the shepherd will not casually lose one', correct: true, explain: 'Exactly. God’s determined care for one does not erase His love for the others.' },
    ],
  },
]

const scenariosRu: Scenario[] = [
  {
    emoji: '🪑',
    prompt: 'Новый ребёнок сидит один, а у остальных уже есть компания. Что отражает Божье сердце?',
    choices: [
      { text: 'Пригласить его, даже если немного неловко', correct: true, explain: 'Бог не забывает того, кто остался один. Мы можем заметить и принять его.' },
      { text: 'Остаться со своей компанией и сделать вид, что не заметил', correct: false, explain: 'Попробуй ещё раз. Иисус предупреждает нас не презирать и не игнорировать «одного из малых сих».' },
    ],
  },
  {
    emoji: '🎮',
    prompt: 'Младший брат или сестра играет хуже тебя. Как поступить?',
    choices: [
      { text: 'Смеяться, потому что сильные игроки важнее', correct: false, explain: 'Сила и умение не определяют ценность человека для Бога.' },
      { text: 'Терпеливо помочь и дать честную очередь', correct: true, explain: 'Бог заботится о слабых и духовно юных, а не только о самых сильных.' },
    ],
  },
  {
    emoji: '💬',
    prompt: 'В чате дети насмехаются над кем-то. Как ответить мудро?',
    choices: [
      { text: 'Не участвовать, поддержать человека и при необходимости сказать взрослому', correct: true, explain: 'Защитить человека от жестокости важнее, чем гнаться за популярностью.' },
      { text: 'Добавить шутку, чтобы всем понравиться', correct: false, explain: 'Популярность не стоит того, чтобы обращаться с человеком так, будто он не важен.' },
    ],
  },
  {
    emoji: '🙏',
    prompt: 'Друг отошёл от церкви и не хочет говорить о Боге. Что можно сделать?',
    choices: [
      { text: 'Решить, что Богу он уже безразличен', correct: false, explain: 'Пастух ищет заблудившуюся овцу. Божье сердце не стало холодным.' },
      { text: 'Молиться, оставаться добрым и просить у Бога мудрости', correct: true, explain: 'Мы не можем заставить сердце измениться, но можем молиться, любить и указывать на Иисуса.' },
    ],
  },
  {
    emoji: '🐑',
    prompt: 'Заблудившаяся овца важнее девяноста девяти?',
    choices: [
      { text: 'Да — остальные уже не важны', correct: false, explain: 'Нет. В проповеди ясно сказано: одна овца не ценнее остальных. Поиск показывает, что важна каждая.' },
      { text: 'Нет — важна каждая овца, поэтому пастух не бросит одну погибать', correct: true, explain: 'Именно. Решительная забота об одной не отменяет любви к остальным.' },
    ],
  },
]

const truthsEn = [
  { text: 'God cares only about people who are already spiritually strong.', answer: false, explain: 'The sermon emphasized God’s care for the weak, overlooked, sick, wandering, and spiritually young.' },
  { text: 'Jesus says not to despise even one of the little ones.', answer: true, explain: 'That is Jesus’ warning in Matthew 18:10.' },
  { text: 'Including a lonely kid earns salvation.', answer: false, explain: 'No good deed purchases salvation. Caring for others reflects God’s heart; Jesus saves.' },
  { text: 'The shepherd’s search shows that losing one is not “good enough.”', answer: true, explain: 'Every one matters. The shepherd goes after the wandering sheep.' },
  { text: 'God can use us to notice people others overlook.', answer: true, explain: 'We do not become the Savior, but we can pray, welcome, protect, and point people to Jesus.' },
]

const truthsRu = [
  { text: 'Бог заботится только о тех, кто уже силён духовно.', answer: false, explain: 'В проповеди подчёркнута Божья забота о слабых, незаметных, больных, заблудившихся и духовно юных.' },
  { text: 'Иисус говорит не презирать ни одного из малых.', answer: true, explain: 'Это предупреждение Иисуса в Матфея 18:10.' },
  { text: 'Если принять одинокого ребёнка, этим можно заслужить спасение.', answer: false, explain: 'Добрыми делами спасение не покупают. Забота отражает Божье сердце; спасает Иисус.' },
  { text: 'Поиск пастуха показывает, что потерять одного — не «достаточно хорошо».', answer: true, explain: 'Важен каждый. Пастух идёт за заблудившейся овцой.' },
  { text: 'Бог может помочь нам замечать тех, кого другие не замечают.', answer: true, explain: 'Мы не Спаситель, но можем молиться, принимать, защищать и указывать людям на Иисуса.' },
]

function ScriptureBox({ value, isRu }: { value: Scripture; isRu: boolean }) {
  return (
    <div style={{ margin: '20px 0', padding: 20, borderRadius: 18, border: '2px solid rgba(29,78,216,.22)', background: '#fff', boxShadow: '0 10px 30px rgba(30,64,175,.08)' }}>
      <a href={value.url} target="_blank" rel="noreferrer" style={{ color: BLUE, fontFamily: 'var(--font-nunito)', fontWeight: 900, textDecoration: 'none' }}>{value.reference} · {value.translation} ↗</a>
      <blockquote style={{ margin: '12px 0 5px', color: NAVY, fontFamily: 'var(--font-lora)', fontSize: 'clamp(1rem,2.5vw,1.2rem)', lineHeight: 1.7 }}>“{value.text}”</blockquote>
      <small style={{ color: '#64748b', fontFamily: 'var(--font-nunito)', fontWeight: 700 }}>{isRu ? 'Точный текст и ссылка: Bible.com' : 'Exact text and source link: Bible.com'}</small>
    </div>
  )
}

function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <section style={{ background: 'rgba(255,255,255,.94)', borderRadius: 26, padding: 'clamp(20px,4vw,36px)', marginBottom: 26, boxShadow: '0 18px 45px rgba(23,37,84,.12)', border: '1px solid rgba(29,78,216,.12)', ...style }}>{children}</section>
}

export default function EveryOneMattersPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const scripture = isRu ? scriptureRu : scriptureEn
  const scenarios = isRu ? scenariosRu : scenariosEn
  const truths = isRu ? truthsRu : truthsEn
  const serializedProgress = useSyncExternalStore(subscribeToProgress, getProgressSnapshot, () => DEFAULT_PROGRESS)
  const progress = useMemo(() => parseProgress(serializedProgress), [serializedProgress])
  const { found, scenarioIndex, scenariosComplete, truthIndex, complete } = progress
  const [scenarioFeedback, setScenarioFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [truthFeedback, setTruthFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const sheep = useMemo(() => Array.from({ length: 20 }, (_, index) => ({ index, wandering: index === 13 })), [])

  function saveProgress(patch: Partial<Progress>) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...progress, ...patch }))
    window.dispatchEvent(new Event(PROGRESS_EVENT))
  }

  function chooseScenario(choice: Choice) {
    if (scenarioFeedback || scenariosComplete) return
    setScenarioFeedback({ ok: choice.correct, text: choice.explain })
    if (choice.correct) setTimeout(() => {
      if (scenarioIndex < scenarios.length - 1) saveProgress({ scenarioIndex: scenarioIndex + 1 })
      else saveProgress({ scenariosComplete: true })
      setScenarioFeedback(null)
    }, 1050)
    else setTimeout(() => setScenarioFeedback(null), 1100)
  }

  function answerTruth(answer: boolean) {
    if (truthFeedback || !scenariosComplete || complete) return
    const item = truths[truthIndex]
    const ok = answer === item.answer
    setTruthFeedback({ ok, text: ok ? item.explain : (isRu ? 'Посмотри на смысл отрывка и попробуй ещё раз.' : 'Look again at the passage’s meaning and try once more.') })
    if (ok) setTimeout(() => {
      if (truthIndex === truths.length - 1) saveProgress({ complete: true })
      else saveProgress({ truthIndex: truthIndex + 1 })
      setTruthFeedback(null)
    }, 1050)
    else setTimeout(() => setTruthFeedback(null), 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(circle at 20% 0%,rgba(59,130,246,.22),transparent 30%),linear-gradient(180deg,${CREAM},#dbeafe 45%,#bfdbfe)`, color: NAVY }}>
      <header style={{ position: 'relative', overflow: 'hidden', minHeight: 390, display: 'grid', placeItems: 'center', textAlign: 'center', padding: '54px 20px' }}>
        <Image src="/images/jr/lessons/every-one-matters/topic-every-one-matters-fal.png" alt="" fill priority style={{ objectFit: 'cover', opacity: .32 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(23,37,84,.45),rgba(23,37,84,.9))' }} />
        <div style={{ position: 'relative', maxWidth: 840, color: '#fff' }}>
          <div style={{ display: 'inline-block', padding: '8px 15px', borderRadius: 999, background: GOLD, color: NAVY, fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '.78rem', letterSpacing: 1.2 }}>{isRu ? 'МАТФЕЯ 18:10–14' : 'MATTHEW 18:10–14'}</div>
          <h1 style={{ margin: '18px 0 12px', fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2.3rem,8vw,5rem)', lineHeight: 1 }}>{isRu ? 'Важен каждый' : 'Every One Matters'}</h1>
          <p style={{ maxWidth: 720, margin: '0 auto', fontFamily: 'var(--font-nunito)', fontSize: 'clamp(1rem,2.6vw,1.25rem)', lineHeight: 1.65, fontWeight: 800 }}>{isRu ? 'Мир часто замечает сильных и популярных. Иисус показывает сердце Отца: Он не презирает слабого, незаметного или заблудившегося — для Него важен каждый.' : 'The world often notices the strong and popular. Jesus shows the Father’s heart: He does not despise the weak, overlooked, or wandering—every one matters to Him.'}</p>
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: '-34px auto 0', padding: '0 16px 70px', position: 'relative' }}>
        <Panel>
          <h2 style={{ marginTop: 0, fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.5rem,4vw,2.25rem)' }}>{isRu ? 'Царство переворачивает список важных' : 'The Kingdom flips the “important people” list'}</h2>
          <p style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.75, fontWeight: 750 }}>{isRu ? 'В проповеди говорилось, что мир тратит много сил на охрану самых важных людей. Но Иисус показывает другие ценности Царства. Божье сердце обращено не только к сильным людям, которые сами преодолеют любые горы. Он видит слабого, больного, незаметного, духовно юного и того, кто сбился с пути.' : 'The sermon explained that the world spends great effort protecting its most important people. Jesus shows different Kingdom values. God’s heart is not only for strong people who can cross every mountain by themselves. He sees the weak, sick, overlooked, spiritually young, and wandering.'}</p>
          <ScriptureBox value={scripture.warning} isRu={isRu} />
          <p style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.75, fontWeight: 750 }}><strong>{isRu ? 'Важная точность:' : 'Important accuracy:'}</strong> {isRu ? 'одна овца не ценнее девяноста девяти. Пастух ищет её потому, что важна каждая овца. Его радость не означает, что остальные перестали быть любимыми.' : 'the one sheep is not more valuable than the ninety-nine. The shepherd searches because every sheep matters. His joy does not mean the others stopped being loved.'}</p>
        </Panel>

        <Panel>
          <h2 style={{ marginTop: 0, textAlign: 'center', fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.5rem,4vw,2.2rem)' }}>{isRu ? 'Игра 1 · Найди одну' : 'Game 1 · Find the One'}</h2>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>{isRu ? 'Одна овца отбилась от стада. Найди её среди остальных.' : 'One sheep wandered away from the flock. Find it among the others.'}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(48px,1fr))', gap: 10, margin: '24px auto', maxWidth: 600 }}>
            {sheep.map(item => <button key={item.index} data-sheep={item.wandering ? 'wandering' : 'flock'} onClick={() => item.wandering && saveProgress({ found: true })} aria-label={item.wandering ? (isRu ? 'Заблудившаяся овца' : 'Wandering sheep') : (isRu ? 'Овца в стаде' : 'Sheep in flock')} style={{ minHeight: 64, borderRadius: 14, border: `2px solid ${found && item.wandering ? '#16a34a' : 'rgba(29,78,216,.16)'}`, background: found && item.wandering ? '#dcfce7' : '#eff6ff', cursor: 'pointer', fontSize: item.wandering ? '1.6rem' : '2rem', transform: item.wandering ? 'translateY(8px) rotate(-12deg)' : 'none' }}>{item.wandering ? '🐑' : '🐑'}</button>)}
          </div>
          {found && <div role="status" style={{ padding: 18, borderRadius: 16, background: '#dcfce7', color: '#14532d', textAlign: 'center', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{isRu ? 'Нашёл! Пастух не сказал: «Девяносто девять — достаточно». Он пошёл искать одну.' : 'Found! The shepherd did not say, “Ninety-nine is good enough.” He went searching for the one.'}</div>}
        </Panel>

        <Panel style={{ opacity: found ? 1 : .55 }}>
          <h2 style={{ marginTop: 0, fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.45rem,4vw,2.15rem)' }}>{isRu ? 'Игра 2 · Заметь незаметного' : 'Game 2 · Notice the Overlooked'}</h2>
          {!found ? <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{isRu ? 'Сначала найди овцу.' : 'Find the sheep first.'}</p> : scenariosComplete ? <div role="status" style={{ padding: 18, borderRadius: 16, background: '#dcfce7', color: '#14532d', textAlign: 'center', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{isRu ? 'Готово! Ты прошёл все пять ситуаций и потренировался замечать тех, кого другие пропускают.' : 'Complete! You worked through all five situations and practiced noticing people others miss.'}</div> : <>
            <div style={{ fontSize: '3rem' }}>{scenarios[scenarioIndex].emoji}</div>
            <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.15rem', lineHeight: 1.55, fontWeight: 900 }}>{scenarios[scenarioIndex].prompt}</p>
            <div style={{ display: 'grid', gap: 12 }}>
              {scenarios[scenarioIndex].choices.map((choice, index) => <button key={index} onClick={() => chooseScenario(choice)} disabled={!!scenarioFeedback} style={{ padding: 16, borderRadius: 15, border: '2px solid rgba(29,78,216,.2)', background: '#fff', color: NAVY, textAlign: 'left', fontFamily: 'var(--font-nunito)', fontWeight: 850, cursor: 'pointer' }}>{choice.text}</button>)}
            </div>
            {scenarioFeedback && <p role="status" style={{ padding: 14, borderRadius: 14, background: scenarioFeedback.ok ? '#dcfce7' : '#fee2e2', color: scenarioFeedback.ok ? '#14532d' : '#7f1d1d', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{scenarioFeedback.text}</p>}
            <div style={{ marginTop: 16, fontFamily: 'var(--font-nunito)', fontWeight: 900, color: BLUE }}>{scenarioIndex + 1} / {scenarios.length}</div>
          </>}
        </Panel>

        <Panel style={{ opacity: scenariosComplete ? 1 : .55 }}>
          <ScriptureBox value={scripture.heart} isRu={isRu} />
          <h2 style={{ fontFamily: 'var(--font-cinzel)' }}>{isRu ? 'Последняя проверка · Правда проповеди' : 'Final Check · The Sermon Truth'}</h2>
          {!scenariosComplete ? <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{isRu ? 'Сначала пройди все пять ситуаций в игре «Заметь незаметного».' : 'Complete all five “Notice the Overlooked” situations first.'}</p> : !complete ? <>
            <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.12rem', fontWeight: 900 }}>{truths[truthIndex].text}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[true, false].map(value => <button key={String(value)} onClick={() => answerTruth(value)} disabled={!!truthFeedback} style={{ flex: '1 1 160px', padding: 16, border: 0, borderRadius: 15, background: value ? BLUE : '#475569', color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 1000, cursor: 'pointer' }}>{value ? (isRu ? '✓ ПРАВДА' : '✓ TRUE') : (isRu ? '✗ НЕПРАВДА' : '✗ FALSE')}</button>)}
            </div>
            {truthFeedback && <p role="status" style={{ padding: 14, borderRadius: 14, background: truthFeedback.ok ? '#dcfce7' : '#fee2e2', color: truthFeedback.ok ? '#14532d' : '#7f1d1d', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{truthFeedback.text}</p>}
            <div style={{ marginTop: 16, fontFamily: 'var(--font-nunito)', fontWeight: 900, color: BLUE }}>{truthIndex + 1} / {truths.length}</div>
          </> : <div style={{ padding: 24, borderRadius: 20, background: 'linear-gradient(135deg,#dbeafe,#dcfce7)', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem' }}>🐑❤️</div>
            <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.6rem' }}>{isRu ? 'Важен каждый' : 'Every One Matters'}</h3>
            <p style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.7, fontWeight: 850 }}>{isRu ? 'Ты важен для Бога. И тот ребёнок, которого другие не замечают, тоже важен. Мы не можем никого спасти своими силами, но можем молиться, принимать, защищать и указывать людям на Иисуса.' : 'You matter to God. The kid others overlook matters too. We cannot save anyone by our own power, but we can pray, welcome, protect, and point people to Jesus.'}</p>
          </div>}
        </Panel>

        <Panel style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-cinzel)' }}>{isRu ? 'Продолжить приключение' : 'Continue the Adventure'}</h2>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>{isRu ? 'Пройди существующий квест о потерянной овце и помоги пастуху найти её.' : 'Play the existing Lost Sheep quest and help the shepherd bring the wandering sheep home.'}</p>
          <Link href="/quests/lost-sheep" style={{ display: 'inline-block', padding: '15px 24px', borderRadius: 15, background: `linear-gradient(135deg,${BLUE},${NAVY})`, color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-nunito)', fontWeight: 1000 }}>{isRu ? 'Начать квест →' : 'Start the Quest →'}</Link>
        </Panel>
      </main>
    </div>
  )
}
