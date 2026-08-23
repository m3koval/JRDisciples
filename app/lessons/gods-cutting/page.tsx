'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const PURPLE = '#6d28d9'
const DEEP = '#312e81'
const GOLD = '#f59e0b'
const CREAM = '#faf5ff'
const STORAGE_KEY = 'gods-cutting'
const PROGRESS_EVENT = 'gods-cutting-progress'
const DEFAULT_PROGRESS = JSON.stringify({ story: 0, scenarios: 0, judah: false, truth: 0, complete: false })
let volatileProgress = DEFAULT_PROGRESS
let storageDisabled = false

type Progress = { story: number; scenarios: number; judah: boolean; truth: number; complete: boolean }
type StoryStep = { id: string; icon: string; title: string; text: string; reference: string }
type Choice = { text: string; correct: boolean; explain: string }
type Scenario = { icon: string; prompt: string; choices: Choice[] }
type Truth = { text: string; answer: boolean; explain: string }

function getProgressSnapshot() {
  if (typeof window === 'undefined' || storageDisabled) return volatileProgress
  try {
    volatileProgress = window.localStorage.getItem(STORAGE_KEY) ?? volatileProgress
  } catch {
    storageDisabled = true
  }
  return volatileProgress
}

function subscribeToProgress(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === STORAGE_KEY) onStoreChange() }
  window.addEventListener('storage', onStorage)
  window.addEventListener(PROGRESS_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(PROGRESS_EVENT, onStoreChange)
  }
}

function parseProgress(raw: string): Progress {
  try {
    const value = JSON.parse(raw) as Partial<Progress>
    return {
      story: Math.min(6, Math.max(0, Number(value.story) || 0)),
      scenarios: Math.min(5, Math.max(0, Number(value.scenarios) || 0)),
      judah: value.judah === true,
      truth: Math.min(5, Math.max(0, Number(value.truth) || 0)),
      complete: value.complete === true,
    }
  } catch { return JSON.parse(DEFAULT_PROGRESS) as Progress }
}

function saveProgress(progress: Progress) {
  volatileProgress = JSON.stringify(progress)
  if (!storageDisabled) {
    try { localStorage.setItem(STORAGE_KEY, volatileProgress) } catch { storageDisabled = true /* in-memory fallback */ }
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

function clearProgress() {
  volatileProgress = DEFAULT_PROGRESS
  if (!storageDisabled) {
    try { localStorage.removeItem(STORAGE_KEY) } catch { storageDisabled = true }
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

const scriptureEn = {
  changed: {
    reference: 'Genesis 44:33', translation: 'ESV',
    text: 'Now therefore, please let your servant remain instead of the boy as a servant to my lord, and let the boy go back with his brothers.',
    url: 'https://www.bible.com/bible/59/GEN.44.33.ESV',
  },
  gospel: {
    reference: 'Romans 5:8', translation: 'ESV',
    text: 'but God shows his love for us in that while we were still sinners, Christ died for us.',
    url: 'https://www.bible.com/bible/59/ROM.5.8.ESV',
  },
}

const scriptureRu = {
  changed: {
    reference: 'Бытие 44:33', translation: 'RST',
    text: 'Итак пусть я, раб твой, вместо отрока останусь рабом у господина моего, а отрок пусть идет с братьями своими',
    url: 'https://www.bible.com/bible/167/GEN.44.33.RST',
  },
  gospel: {
    reference: 'Римлянам 5:8', translation: 'RST',
    text: 'Но Бог Свою любовь к нам доказывает тем, что Христос умер за нас, когда мы были еще грешниками.',
    url: 'https://www.bible.com/bible/167/ROM.5.8.RST',
  },
}

type ScriptureValue = typeof scriptureEn.changed

const storyOrder = ['rough', 'silence', 'pressure', 'conscience', 'hand', 'changed']
const storyScrambled = ['conscience', 'rough', 'changed', 'pressure', 'silence', 'hand']

const storyEn: StoryStep[] = [
  { id: 'rough', icon: '🪨', title: 'A rough heart', reference: 'Genesis 37', text: 'Jealousy hardened Joseph’s brothers. They threw him into a pit and sold him, choosing themselves over their brother.' },
  { id: 'silence', icon: '⌛', title: 'Years of silence', reference: 'Genesis 38–41', text: 'About twenty years passed. God had not forgotten Joseph or the brothers. Their hidden guilt was still real.' },
  { id: 'pressure', icon: '🌾', title: 'Hard circumstances', reference: 'Genesis 42:1–20', text: 'Famine brought the brothers to Egypt, where Joseph tested whether they were still willing to abandon a brother.' },
  { id: 'conscience', icon: '💡', title: 'Conscience wakes up', reference: 'Genesis 42:21', text: 'The brothers finally admitted, “We are guilty concerning our brother.” They stopped pretending nothing was wrong.' },
  { id: 'hand', icon: '🤲', title: 'They recognize God’s hand', reference: 'Genesis 44:16', text: 'Judah looked deeper than the hidden cup. He understood that their old sin had to be faced instead of blamed away.' },
  { id: 'changed', icon: '💎', title: 'A changed man', reference: 'Genesis 44:33', text: 'Years earlier Judah helped give Joseph away to save himself. Now he offered himself so Benjamin could go free.' },
]

const storyRu: StoryStep[] = [
  { id: 'rough', icon: '🪨', title: 'Грубое сердце', reference: 'Бытие 37', text: 'Зависть ожесточила братьев Иосифа. Они бросили его в яму и продали, выбрав себя вместо брата.' },
  { id: 'silence', icon: '⌛', title: 'Годы молчания', reference: 'Бытие 38–41', text: 'Прошло около двадцати лет. Бог не забыл ни Иосифа, ни братьев. Их скрытая вина оставалась настоящей.' },
  { id: 'pressure', icon: '🌾', title: 'Трудные обстоятельства', reference: 'Бытие 42:1–20', text: 'Голод привёл братьев в Египет, где Иосиф проверил, готовы ли они снова бросить брата.' },
  { id: 'conscience', icon: '💡', title: 'Совесть просыпается', reference: 'Бытие 42:21', text: 'Братья наконец признали: «точно мы наказываемся за грех против брата нашего». Они перестали притворяться.' },
  { id: 'hand', icon: '🤲', title: 'Они видят Божью руку', reference: 'Бытие 44:16', text: 'Иуда посмотрел глубже истории с чашей. Он понял: старый грех нужно признать, а не оправдывать.' },
  { id: 'changed', icon: '💎', title: 'Изменённый человек', reference: 'Бытие 44:33', text: 'Когда-то Иуда отдал Иосифа, чтобы спасти себя. Теперь он предложил себя, чтобы Вениамин ушёл свободным.' },
]

const scenariosEn: Scenario[] = [
  { icon: '🏆', prompt: 'Your sibling is praised, and jealousy starts growing. Which choice lets God shape your heart?', choices: [
    { text: 'Find a way to make them look bad', correct: false, explain: 'That feeds the same jealousy that hardened Joseph’s brothers.' },
    { text: 'Thank God for their gift and congratulate them honestly', correct: true, explain: 'Love can celebrate another person instead of fighting for first place.' },
  ] },
  { icon: '🧩', prompt: 'You broke something and no one saw. What does an awakened conscience do?', choices: [
    { text: 'Admit it, apologize, and help make it right', correct: true, explain: 'Repentance tells the truth and turns toward what is right.' },
    { text: 'Hide it and wait for someone else to be blamed', correct: false, explain: 'Hiding protects the rough edge instead of letting God work on it.' },
  ] },
  { icon: '⚽', prompt: 'You lose an important game. Is every hard feeling proof that God is punishing you?', choices: [
    { text: 'Yes—every disappointment means I committed a special sin', correct: false, explain: 'No. Not every hard thing is punishment. We can still ask God for wisdom and respond faithfully.' },
    { text: 'No—but I can ask God what faithful response I can learn', correct: true, explain: 'That is honest without inventing guilt God has not shown.' },
  ] },
  { icon: '💬', prompt: 'Friends are blaming a younger kid to protect themselves. What resembles changed Judah?', choices: [
    { text: 'Speak truth and protect the younger child, even if it costs popularity', correct: true, explain: 'Judah stopped sacrificing a brother to save himself.' },
    { text: 'Stay quiet because protecting myself matters most', correct: false, explain: 'That repeats the old selfish pattern.' },
  ] },
  { icon: '🙏', prompt: 'God shows you a real sin in your heart. What is the wise next step?', choices: [
    { text: 'Pretend pressure alone will automatically fix me', correct: false, explain: 'Hard circumstances do not automatically make anyone holy.' },
    { text: 'Confess it, trust Jesus, ask for help, and practice the right response', correct: true, explain: 'God’s shaping includes truth, repentance, faith, and obedient change.' },
  ] },
]

const scenariosRu: Scenario[] = [
  { icon: '🏆', prompt: 'Хвалят брата или сестру, и в тебе растёт зависть. Как позволить Богу менять сердце?', choices: [
    { text: 'Постараться выставить его хуже', correct: false, explain: 'Так ты кормишь ту же зависть, которая ожесточила братьев Иосифа.' },
    { text: 'Поблагодарить Бога за его дар и искренне поздравить', correct: true, explain: 'Любовь умеет радоваться за другого, а не воевать за первое место.' },
  ] },
  { icon: '🧩', prompt: 'Ты что-то сломал, и никто не видел. Что делает проснувшаяся совесть?', choices: [
    { text: 'Признаться, попросить прощения и помочь исправить', correct: true, explain: 'Покаяние говорит правду и поворачивает к правильному.' },
    { text: 'Скрыть и ждать, пока обвинят другого', correct: false, explain: 'Так ты прячешь грубую грань и не позволяешь Богу работать.' },
  ] },
  { icon: '⚽', prompt: 'Ты проиграл важную игру. Каждое трудное чувство доказывает, что Бог тебя наказывает?', choices: [
    { text: 'Да — любое разочарование означает особый грех', correct: false, explain: 'Нет. Не каждая трудность — наказание. Но можно просить у Бога мудрости для верного ответа.' },
    { text: 'Нет — но я могу спросить Бога, как ответить верно', correct: true, explain: 'Это честно и не придумывает вину, которую Бог не показал.' },
  ] },
  { icon: '💬', prompt: 'Друзья обвиняют младшего ребёнка, чтобы защитить себя. Как поступил бы изменённый Иуда?', choices: [
    { text: 'Сказать правду и защитить младшего, даже потеряв популярность', correct: true, explain: 'Иуда перестал жертвовать братом ради собственного спасения.' },
    { text: 'Молчать, потому что важнее защитить себя', correct: false, explain: 'Так повторяется старый эгоистичный выбор.' },
  ] },
  { icon: '🙏', prompt: 'Бог показывает настоящий грех в твоём сердце. Какой следующий шаг мудрый?', choices: [
    { text: 'Думать, что трудности сами автоматически исправят меня', correct: false, explain: 'Тяжёлые обстоятельства сами по себе никого не делают святым.' },
    { text: 'Исповедать грех, довериться Иисусу, попросить помощи и поступать верно', correct: true, explain: 'Божья работа включает правду, покаяние, веру и послушание.' },
  ] },
]

const truthsEn: Truth[] = [
  { text: 'God only loves people after they become polished and useful.', answer: false, explain: 'God loved us while we were still sinners. His love is not a trophy we earn.' },
  { text: 'Judah changed from giving up a brother to offering himself for a brother.', answer: true, explain: 'That is the sermon’s central Genesis 37 → Genesis 44 contrast.' },
  { text: 'Pain and pressure automatically make every person holy.', answer: false, explain: 'No. God uses truth and circumstances, but we must respond with repentance and faith.' },
  { text: 'Repentance includes admitting sin instead of blaming it away.', answer: true, explain: 'The brothers’ conscience woke up, and Judah stopped protecting himself at another brother’s cost.' },
  { text: 'Jesus saves us; changed choices are fruit of His work, not payment for salvation.', answer: true, explain: 'Christ died for sinners. We do not polish ourselves enough to purchase God’s rescue.' },
]

const truthsRu: Truth[] = [
  { text: 'Бог любит людей только после того, как они стали красивыми и полезными.', answer: false, explain: 'Бог возлюбил нас, когда мы ещё были грешниками. Его любовь нельзя заработать.' },
  { text: 'Иуда изменился: раньше отдал брата, а позже предложил себя вместо брата.', answer: true, explain: 'Это главное сравнение проповеди: Бытие 37 → Бытие 44.' },
  { text: 'Боль и давление автоматически делают каждого святым.', answer: false, explain: 'Нет. Бог использует истину и обстоятельства, но мы отвечаем покаянием и верой.' },
  { text: 'Покаяние включает признание греха вместо оправданий.', answer: true, explain: 'Совесть братьев проснулась, и Иуда перестал спасать себя ценой брата.' },
  { text: 'Нас спасает Иисус; добрые перемены — плод Его работы, а не плата за спасение.', answer: true, explain: 'Христос умер за грешников. Мы не можем сами «отшлифоваться» и купить Божье спасение.' },
]

function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <section style={{ background: 'rgba(255,255,255,.96)', borderRadius: 26, padding: 'clamp(20px,4vw,36px)', marginBottom: 26, boxShadow: '0 18px 45px rgba(49,46,129,.13)', border: '1px solid rgba(109,40,217,.14)', ...style }}>{children}</section>
}

function ScriptureBox({ value, isRu }: { value: ScriptureValue; isRu: boolean }) {
  return <div style={{ padding: 20, borderRadius: 18, background: '#fff', border: '2px solid rgba(109,40,217,.2)', margin: '18px 0' }}>
    <a href={value.url} target="_blank" rel="noreferrer" style={{ color: PURPLE, fontWeight: 900, textDecoration: 'none' }}>{value.reference} · {value.translation} ↗</a>
    <blockquote style={{ margin: '12px 0 5px', color: DEEP, fontFamily: 'var(--font-lora)', fontSize: 'clamp(1rem,2.5vw,1.2rem)', lineHeight: 1.65 }}>“{value.text}”</blockquote>
    <small style={{ color: '#64748b', fontWeight: 700 }}>{isRu ? 'Точный текст и ссылка: Bible.com' : 'Exact text and source link: Bible.com'}</small>
  </div>
}

const choiceStyle: CSSProperties = { width: '100%', textAlign: 'left', border: '2px solid rgba(109,40,217,.2)', background: '#fff', color: DEEP, borderRadius: 16, padding: '15px 17px', font: 'inherit', fontWeight: 850, cursor: 'pointer', marginTop: 10 }

export default function GodsCuttingLesson() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const raw = useSyncExternalStore(subscribeToProgress, getProgressSnapshot, () => DEFAULT_PROGRESS)
  const progress = useMemo(() => parseProgress(raw), [raw])
  const [feedback, setFeedback] = useState('')
  const story = isRu ? storyRu : storyEn
  const scenarios = isRu ? scenariosRu : scenariosEn
  const truths = isRu ? truthsRu : truthsEn
  const scripture = isRu ? scriptureRu : scriptureEn
  const completedCount = progress.story + progress.scenarios + (progress.judah ? 1 : 0) + progress.truth
  const percent = Math.round((completedCount / 17) * 100)

  function update(next: Partial<Progress>) { saveProgress({ ...progress, ...next }) }
  function chooseStory(id: string) {
    if (id === storyOrder[progress.story]) { setFeedback(isRu ? 'Верная грань! Продолжай.' : 'Right facet! Keep going.'); update({ story: progress.story + 1 }) }
    else setFeedback(isRu ? 'Не этот шаг. Посмотри на историю ещё раз.' : 'Not that step yet. Look at the story again.')
  }
  function chooseScenario(choice: Choice) {
    setFeedback(choice.explain)
    if (choice.correct) update({ scenarios: progress.scenarios + 1 })
  }
  function chooseJudah(correct: boolean) {
    if (correct) { setFeedback(isRu ? 'Да. Иуда предложил себя вместо Вениамина.' : 'Yes. Judah offered himself in Benjamin’s place.'); update({ judah: true }) }
    else setFeedback(isRu ? 'Это повторило бы старый выбор: спасти себя ценой брата.' : 'That would repeat the old choice: save himself at his brother’s cost.')
  }
  function chooseTruth(answer: boolean) {
    const current = truths[progress.truth]
    const correct = answer === current.answer
    setFeedback(current.explain)
    if (correct) {
      const nextTruth = progress.truth + 1
      update({ truth: nextTruth, complete: nextTruth === truths.length })
    }
  }

  return <main style={{ minHeight: '100vh', background: `radial-gradient(circle at top,#ede9fe 0,${CREAM} 42%,#fff 100%)`, color: DEEP, fontFamily: 'var(--font-nunito)' }}>
    <header style={{ position: 'relative', minHeight: 520, overflow: 'hidden', display: 'grid', alignItems: 'end' }}>
      <Image src="/images/jr/lessons/gods-cutting/topic-gods-cutting-fal.png" alt={isRu ? 'Михаил держит грубый камень и огранённый бриллиант, пока Иуда защищает Вениамина' : 'Michael holds a rough stone and a cut diamond while Judah protects Benjamin'} fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(30,20,80,.05),rgba(30,20,80,.9))' }} />
      <div style={{ position: 'relative', width: 'min(1100px,92vw)', margin: '0 auto', padding: '80px 0 42px', color: '#fff' }}>
        <Link href="/lessons" style={{ color: '#fff', fontWeight: 900, textDecoration: 'none' }}>← {isRu ? 'Все уроки' : 'All lessons'}</Link>
        <p style={{ margin: '20px 0 6px', color: '#fde68a', fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>{isRu ? 'Интерактивный урок · Бытие 37–44' : 'Interactive lesson · Genesis 37–44'}</p>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-lora)', fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 1.02 }}>{isRu ? 'Божья огранка' : 'Shaped by God'}</h1>
        <p style={{ maxWidth: 720, fontSize: 'clamp(1.05rem,2.7vw,1.35rem)', lineHeight: 1.55, fontWeight: 750 }}>{isRu ? 'Как Бог изменил Иуду: из человека, который отдал брата ради себя, в человека, готового отдать себя ради брата.' : 'How God changed Judah—from a man who gave up a brother to save himself into a man willing to give himself for a brother.'}</p>
      </div>
    </header>

    <div style={{ width: 'min(900px,92vw)', margin: '0 auto', padding: '30px 0 70px' }}>
      <div aria-label={isRu ? `Прогресс ${percent}%` : `Progress ${percent}%`} style={{ position: 'sticky', top: 8, zIndex: 5, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(10px)', padding: 14, borderRadius: 18, marginBottom: 24, boxShadow: '0 8px 25px rgba(49,46,129,.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}><span>{isRu ? 'Огранено граней' : 'Facets polished'}</span><span>{completedCount}/17</span></div>
        <div style={{ height: 10, borderRadius: 999, background: '#ede9fe', marginTop: 8, overflow: 'hidden' }}><div style={{ height: '100%', width: `${percent}%`, background: `linear-gradient(90deg,${PURPLE},${GOLD})`, transition: 'width .3s' }} /></div>
      </div>

      <Panel>
        <p style={{ color: PURPLE, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '.08em' }}>{isRu ? 'Сначала пойми проповедь' : 'First, understand the sermon'}</p>
        <h2 style={{ fontFamily: 'var(--font-lora)', fontSize: 'clamp(1.8rem,5vw,2.6rem)' }}>{isRu ? 'Алмаз не начинает как бриллиант' : 'A diamond does not begin polished'}</h2>
        <p style={{ fontSize: '1.08rem', lineHeight: 1.7 }}>{isRu ? 'Проповедник сравнил сердце человека с грубым алмазом. Давление, отбор и огранка открывают грани. Но трудности сами не спасают и не делают нас святыми автоматически. Бог использует истину, совесть и обстоятельства, чтобы привести нас к покаянию и верной жизни.' : 'The preacher compared a human heart to a rough diamond. Pressure, selection, and cutting reveal its facets. But hardship does not save us or automatically make us holy. God uses truth, conscience, and circumstances to bring us toward repentance and faithful living.'}</p>
        <div style={{ padding: 16, borderRadius: 16, background: '#fff7ed', border: '1px solid #fdba74', lineHeight: 1.6, fontWeight: 750 }}><strong>{isRu ? 'Важная защита:' : 'Important safety guard:'}</strong> {isRu ? 'Не каждая трудность означает, что ты согрешил. Если кто-то причиняет боль, пугает или делает что-то небезопасное, сразу скажи родителю или другому надёжному взрослому. Не оставайся в опасности, чтобы «доказать веру».' : 'Not every hard thing means you sinned. If someone hurts, scares, or does something unsafe to you, tell a parent or another trusted adult immediately. Never stay in danger to “prove faith.”'}</div>
      </Panel>

      <Panel>
        <p style={{ color: PURPLE, fontWeight: 950 }}>{isRu ? 'ГРАНЬ 1 · СОБЕРИ ИСТОРИЮ' : 'FACET 1 · BUILD THE STORY'}</p>
        <h2>{isRu ? 'Нажимай шаги в правильном порядке' : 'Tap the steps in the right order'}</h2>
        <p>{isRu ? 'Сначала прочитай все карточки. Начни с Бытия 37.' : 'Read every card first. Begin with Genesis 37.'}</p>
        {progress.story < storyOrder.length ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
          {storyScrambled.map((id) => {
            const item = story.find((step) => step.id === id)!
            const done = storyOrder.indexOf(id) < progress.story
            return <button key={id} disabled={done} onClick={() => chooseStory(id)} style={{ ...choiceStyle, margin: 0, opacity: done ? .5 : 1, background: done ? '#ede9fe' : '#fff' }}><span style={{ fontSize: 28 }}>{item.icon}</span><br /><strong>{item.title}</strong><br /><small>{item.reference}</small><p style={{ marginBottom: 0, lineHeight: 1.45 }}>{item.text}</p></button>
          })}
        </div> : <div style={{ padding: 18, borderRadius: 16, background: '#ecfdf5', fontWeight: 900 }}>{isRu ? '✓ История собрана. Ты увидел путь от зависти к жертвенной любви.' : '✓ Story built. You found the path from jealousy to sacrificial love.'}</div>}
      </Panel>

      {progress.story >= 6 && <Panel>
        <p style={{ color: PURPLE, fontWeight: 950 }}>{isRu ? 'ГРАНЬ 2 · ТВОИ ВЫБОРЫ' : 'FACET 2 · YOUR CHOICES'}</p>
        <h2>{isRu ? 'Позволь Богу показать грубую грань' : 'Let God show the rough edge'}</h2>
        {progress.scenarios < scenarios.length ? <div>
          <div style={{ fontSize: 44 }}>{scenarios[progress.scenarios].icon}</div>
          <h3 style={{ fontSize: '1.3rem', lineHeight: 1.45 }}>{scenarios[progress.scenarios].prompt}</h3>
          {scenarios[progress.scenarios].choices.map((choice) => <button key={choice.text} onClick={() => chooseScenario(choice)} style={choiceStyle}>{choice.text}</button>)}
        </div> : <div style={{ padding: 18, borderRadius: 16, background: '#ecfdf5', fontWeight: 900 }}>{isRu ? '✓ Пять жизненных граней пройдено.' : '✓ Five real-life facets completed.'}</div>}
      </Panel>}

      {progress.scenarios >= 5 && <Panel>
        <p style={{ color: PURPLE, fontWeight: 950 }}>{isRu ? 'ГРАНЬ 3 · РЕШЕНИЕ ИУДЫ' : 'FACET 3 · JUDAH’S DECISION'}</p>
        <h2>{isRu ? 'Тот же выбор — другое сердце' : 'The same kind of choice—a different heart'}</h2>
        <p style={{ lineHeight: 1.7 }}>{isRu ? 'В Бытии 37 братья отдали Иосифа, чтобы спасти себя. В Бытии 44 Иосиф дал им возможность снова уйти домой без младшего брата. Что сделал изменённый Иуда?' : 'In Genesis 37 the brothers gave Joseph up to save themselves. In Genesis 44 Joseph gave them a chance to go home without their youngest brother. What did the changed Judah do?'}</p>
        {!progress.judah ? <>
          <button onClick={() => chooseJudah(false)} style={choiceStyle}>{isRu ? 'Оставил Вениамина и спас себя' : 'Left Benjamin and saved himself'}</button>
          <button onClick={() => chooseJudah(true)} style={choiceStyle}>{isRu ? 'Предложил себя вместо Вениамина' : 'Offered himself in Benjamin’s place'}</button>
        </> : <ScriptureBox value={scripture.changed} isRu={isRu} />}
      </Panel>}

      {progress.judah && <Panel>
        <p style={{ color: PURPLE, fontWeight: 950 }}>{isRu ? 'ГРАНЬ 4 · ПРОВЕРКА ИСТИНЫ' : 'FACET 4 · TRUTH CHECK'}</p>
        <h2>{isRu ? 'Кто на самом деле меняет сердце?' : 'Who truly changes a heart?'}</h2>
        {progress.truth < truths.length ? <>
          <p style={{ fontSize: '1.25rem', fontWeight: 850, lineHeight: 1.5 }}>{truths[progress.truth].text}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button onClick={() => chooseTruth(true)} style={{ ...choiceStyle, textAlign: 'center' }}>{isRu ? 'Верно' : 'True'}</button>
            <button onClick={() => chooseTruth(false)} style={{ ...choiceStyle, textAlign: 'center' }}>{isRu ? 'Неверно' : 'False'}</button>
          </div>
        </> : <ScriptureBox value={scripture.gospel} isRu={isRu} />}
      </Panel>}

      <div aria-live="polite" style={{ minHeight: 54, margin: '0 0 24px', padding: feedback ? 16 : 0, borderRadius: 16, background: feedback ? '#fef3c7' : 'transparent', color: '#78350f', fontWeight: 850 }}>{feedback}</div>

      {progress.complete && <Panel style={{ textAlign: 'center', background: 'linear-gradient(135deg,#ede9fe,#fef3c7)' }}>
        <div style={{ fontSize: 72 }}>💎</div>
        <h2 style={{ fontFamily: 'var(--font-lora)', fontSize: 'clamp(2rem,6vw,3rem)' }}>{isRu ? 'Урок завершён!' : 'Lesson complete!'}</h2>
        <p style={{ fontSize: '1.12rem', lineHeight: 1.7 }}>{isRu ? 'Бог любит не только «готовую драгоценность». Он встречает грешников, приводит к покаянию и меняет тех, кто доверяет Иисусу. На этой неделе спроси: «Господи, какую грубую грань Ты хочешь изменить во мне?»' : 'God does not only love the “finished jewel.” He meets sinners, brings us to repentance, and changes those who trust Jesus. This week ask, “Lord, what rough edge do You want to change in me?”'}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          <Link href="/lessons" style={{ ...choiceStyle, width: 'auto', textDecoration: 'none', background: PURPLE, color: '#fff' }}>{isRu ? 'Другой урок →' : 'Choose another lesson →'}</Link>
          <button onClick={() => { clearProgress(); setFeedback('') }} style={{ ...choiceStyle, width: 'auto' }}>{isRu ? 'Пройти снова' : 'Replay lesson'}</button>
        </div>
      </Panel>}
    </div>
  </main>
}
