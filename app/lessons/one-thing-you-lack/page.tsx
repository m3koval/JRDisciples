'use client'

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'

const ACCENT = '#b45309'
const ACCENT_DARK = '#78350f'
const GOLD = '#fbbf24'
const CREAM = '#fffbeb'
const STORAGE_KEY = 'one-thing-you-lack'
const PROGRESS_EVENT = 'one-thing-you-lack-progress'
const DEFAULT_PROGRESS = JSON.stringify({ unlocked: [1], done: [] })
let volatileProgress = DEFAULT_PROGRESS

function getProgressSnapshot(): string {
  try {
    volatileProgress = localStorage.getItem(STORAGE_KEY) ?? volatileProgress
  } catch {
    // Keep the lesson playable when a privacy policy blocks storage.
  }
  return volatileProgress
}

function subscribeToProgress(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange()
  }
  window.addEventListener('storage', handleStorage)
  window.addEventListener(PROGRESS_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(PROGRESS_EVENT, onStoreChange)
  }
}

function parseProgress(raw: string): { unlocked: Set<number>; done: Set<string> } {
  try {
    const saved = JSON.parse(raw) as { unlocked?: number[]; done?: string[] }
    return {
      unlocked: new Set(saved.unlocked?.length ? saved.unlocked : [1]),
      done: new Set(saved.done ?? []),
    }
  } catch {
    return { unlocked: new Set([1]), done: new Set() }
  }
}

function saveProgress(unlocked: Set<number>, done: Set<string>) {
  volatileProgress = JSON.stringify({ unlocked: [...unlocked], done: [...done] })
  try {
    localStorage.setItem(STORAGE_KEY, volatileProgress)
  } catch {
    // The in-memory snapshot still updates through PROGRESS_EVENT.
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

function clearProgress() {
  volatileProgress = DEFAULT_PROGRESS
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Reload below restores the in-memory default when storage is blocked.
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

const scriptureEn = {
  question: {
    reference: 'Matthew 19:16',
    translation: 'ESV',
    text: 'And behold, a man came up to him, saying, “Teacher, what good deed must I do to have eternal life?”',
    url: 'https://www.bible.com/bible/59/MAT.19.16.ESV',
  },
  call: {
    reference: 'Matthew 19:21',
    translation: 'ESV',
    text: 'Jesus said to him, “If you would be perfect, go, sell what you possess and give to the poor, and you will have treasure in heaven; and come, follow me.”',
    url: 'https://www.bible.com/bible/59/MAT.19.21.ESV',
  },
  love: {
    reference: 'Mark 10:21',
    translation: 'ESV',
    text: 'And Jesus, looking at him, loved him, and said to him, “You lack one thing: go, sell all that you have and give to the poor, and you will have treasure in heaven; and come, follow me.”',
    url: 'https://www.bible.com/bible/59/MRK.10.21.ESV',
  },
  impossible: {
    reference: 'Matthew 19:26',
    translation: 'ESV',
    text: 'But Jesus looked at them and said, “With man this is impossible, but with God all things are possible.”',
    url: 'https://www.bible.com/bible/59/MAT.19.26.ESV',
  },
}

const scriptureRu = {
  question: {
    reference: 'Матфея 19:16',
    translation: 'RST',
    text: 'И вот, некто, подойдя, сказал Ему: Учитель благий! что сделать мне доброго, чтобы иметь жизнь вечную?',
    url: 'https://www.bible.com/bible/167/MAT.19.16.RST',
  },
  call: {
    reference: 'Матфея 19:21',
    translation: 'RST',
    text: 'Иисус сказал ему: если хочешь быть совершенным, пойди, продай имение твое и раздай нищим; и будешь иметь сокровище на небесах; и приходи и следуй за Мною.',
    url: 'https://www.bible.com/bible/167/MAT.19.21.RST',
  },
  love: {
    reference: 'Марка 10:21',
    translation: 'RST',
    text: 'Иисус, взглянув на него, полюбил его и сказал ему: одного тебе недостает: пойди, всё, что имеешь, продай и раздай нищим, и будешь иметь сокровище на небесах; и приходи, последуй за Мною, взяв крест.',
    url: 'https://www.bible.com/bible/167/MRK.10.21.RST',
  },
  impossible: {
    reference: 'Матфея 19:26',
    translation: 'RST',
    text: 'А Иисус, воззрев, сказал им: человекам это невозможно, Богу же всё возможно.',
    url: 'https://www.bible.com/bible/167/MAT.19.26.RST',
  },
}

type Scripture = typeof scriptureEn.question

type StoryStep = { id: string; emoji: string; text: string }
const STORY_ORDER = ['ask', 'claim', 'call', 'leave', 'teach']
const STORY_SCRAMBLED = ['call', 'ask', 'teach', 'claim', 'leave']

const storyEn: StoryStep[] = [
  { id: 'ask', emoji: '🏃', text: 'A rich young man came to Jesus and asked what good deed would give him eternal life.' },
  { id: 'claim', emoji: '📋', text: 'Jesus named commandments. The man said he had kept them and asked what he still lacked.' },
  { id: 'call', emoji: '❤️', text: 'Jesus lovingly told him to give his wealth to the poor, treasure heaven, and follow Him.' },
  { id: 'leave', emoji: '😔', text: 'The man went away sorrowful because he had great possessions and would not release them.' },
  { id: 'teach', emoji: '🐪', text: 'Jesus taught that people cannot save themselves—but with God, salvation is possible.' },
]

const storyRu: StoryStep[] = [
  { id: 'ask', emoji: '🏃', text: 'Богатый юноша подошёл к Иисусу и спросил, какое доброе дело даст ему вечную жизнь.' },
  { id: 'claim', emoji: '📋', text: 'Иисус назвал заповеди. Юноша сказал, что соблюдал их, и спросил, чего ему ещё недостаёт.' },
  { id: 'call', emoji: '❤️', text: 'Иисус с любовью велел ему раздать богатство бедным, иметь сокровище на небе и следовать за Ним.' },
  { id: 'leave', emoji: '😔', text: 'Юноша ушёл с печалью: у него было много имущества, и он не захотел отпустить его.' },
  { id: 'teach', emoji: '🐪', text: 'Иисус объяснил: люди не могут спасти себя, но для Бога спасение возможно.' },
]

type MemoryCard = { id: string; pair: string; icon: string; text: string }
const memoryEn: MemoryCard[] = [
  { id: 'love-a', pair: 'love', icon: '👀', text: 'Jesus looked at him…' },
  { id: 'possible-b', pair: 'possible', icon: '✨', text: '…but possible with God.' },
  { id: 'follow-b', pair: 'follow', icon: '👣', text: '“…come, follow me.”' },
  { id: 'sorrow-a', pair: 'sorrow', icon: '🚶', text: 'The young man went away…' },
  { id: 'treasure-b', pair: 'treasure', icon: '☁️', text: '…treasure in heaven.' },
  { id: 'love-b', pair: 'love', icon: '❤️', text: '…and loved him.' },
  { id: 'lack-a', pair: 'lack', icon: '1️⃣', text: '“You lack one thing…”' },
  { id: 'sorrow-b', pair: 'sorrow', icon: '😔', text: '…sorrowful.' },
  { id: 'possible-a', pair: 'possible', icon: '🚫', text: 'Impossible with people…' },
  { id: 'treasure-a', pair: 'treasure', icon: '🤲', text: 'Give to the poor…' },
  { id: 'follow-a', pair: 'follow', icon: '➡️', text: 'Jesus said…' },
  { id: 'lack-b', pair: 'lack', icon: '👑', text: 'Jesus must be first.' },
]

const memoryRu: MemoryCard[] = [
  { id: 'love-a', pair: 'love', icon: '👀', text: 'Иисус взглянул на него…' },
  { id: 'possible-b', pair: 'possible', icon: '✨', text: '…но возможно Богу.' },
  { id: 'follow-b', pair: 'follow', icon: '👣', text: '«…следуй за Мною».' },
  { id: 'sorrow-a', pair: 'sorrow', icon: '🚶', text: 'Юноша отошёл…' },
  { id: 'treasure-b', pair: 'treasure', icon: '☁️', text: '…сокровище на небесах.' },
  { id: 'love-b', pair: 'love', icon: '❤️', text: '…и полюбил его.' },
  { id: 'lack-a', pair: 'lack', icon: '1️⃣', text: '«Одного тебе недостаёт…»' },
  { id: 'sorrow-b', pair: 'sorrow', icon: '😔', text: '…с печалью.' },
  { id: 'possible-a', pair: 'possible', icon: '🚫', text: 'Невозможно людям…' },
  { id: 'treasure-a', pair: 'treasure', icon: '🤲', text: 'Раздай бедным…' },
  { id: 'follow-a', pair: 'follow', icon: '➡️', text: 'Иисус сказал…' },
  { id: 'lack-b', pair: 'lack', icon: '👑', text: 'Иисус должен быть первым.' },
]

type Choice = { text: string; correct: boolean }
type HeartQuestion = { icon: string; prompt: string; choices: Choice[]; explain: string }

const heartEn: HeartQuestion[] = [
  {
    icon: '🎮',
    prompt: 'You are in the middle of a game. A parent says it is time to put it down and come to dinner. What shows that Jesus—not the game—is first?',
    choices: [
      { text: 'Pause or finish safely, then obey without pretending not to hear.', correct: true },
      { text: 'Ignore them because my game matters more right now.', correct: false },
    ],
    explain: 'Games can be enjoyed with gratitude. The heart test is whether you can put one down to obey and love your family.',
  },
  {
    icon: '🏆',
    prompt: 'Your friend wins the spot or prize you wanted. What keeps success from ruling your heart?',
    choices: [
      { text: 'Congratulate them honestly and keep doing my best.', correct: true },
      { text: 'Insult them or make excuses so I still look best.', correct: false },
    ],
    explain: 'Winning is not evil. But if you must hurt someone to protect your place, being first has become too important.',
  },
  {
    icon: '💵',
    prompt: 'You have saved some allowance and learn that someone needs help. What is a wise response?',
    choices: [
      { text: 'Ask a parent how I could help and choose generosity freely.', correct: true },
      { text: 'Decide I will never help because every dollar is only mine.', correct: false },
    ],
    explain: 'The lesson is not “money is bad.” Money is a tool. A follower of Jesus can hold it with an open hand.',
  },
  {
    icon: '📱',
    prompt: 'Friends might laugh if you tell the truth or include the lonely kid. Who comes first?',
    choices: [
      { text: 'Follow Jesus even when popularity costs me something.', correct: true },
      { text: 'Do whatever keeps everyone liking me.', correct: false },
    ],
    explain: 'Approval can become a master too. Jesus is worth more than always looking cool.',
  },
  {
    icon: '👟',
    prompt: 'You receive something you really wanted. How can you enjoy it without letting it own your heart?',
    choices: [
      { text: 'Thank God, care for it, and stay ready to share or obey.', correct: true },
      { text: 'Use it to prove I am more important than other kids.', correct: false },
    ],
    explain: 'Having a good gift is not the sin. Pride, greed, and refusing Jesus reveal the danger.',
  },
]

const heartRu: HeartQuestion[] = [
  {
    icon: '🎮',
    prompt: 'Ты играешь, а родитель зовёт ужинать. Как показать, что первым для тебя остаётся Иисус, а не игра?',
    choices: [
      { text: 'Поставить на паузу или безопасно закончить момент и послушаться без притворства.', correct: true },
      { text: 'Не отвечать, потому что сейчас моя игра важнее.', correct: false },
    ],
    explain: 'Игре можно радоваться с благодарностью. Проверка сердца — можешь ли ты отложить её, чтобы послушаться и проявить любовь к семье.',
  },
  {
    icon: '🏆',
    prompt: 'Друг получил место или приз, который хотел ты. Как не позволить успеху управлять сердцем?',
    choices: [
      { text: 'Искренне поздравить его и продолжать стараться.', correct: true },
      { text: 'Обидеть его или оправдываться, чтобы всё равно казаться лучшим.', correct: false },
    ],
    explain: 'Побеждать не плохо. Но если ради первого места ты ранишь другого, победа стала слишком важной.',
  },
  {
    icon: '💵',
    prompt: 'Ты накопил карманные деньги и узнал, что кому-то нужна помощь. Как поступить мудро?',
    choices: [
      { text: 'Спросить родителя, как помочь, и добровольно проявить щедрость.', correct: true },
      { text: 'Решить никогда не помогать, потому что каждая монета только моя.', correct: false },
    ],
    explain: 'Урок не говорит: «деньги — зло». Деньги — инструмент. Последователь Иисуса может держать их открытой рукой.',
  },
  {
    icon: '📱',
    prompt: 'Друзья могут смеяться, если ты скажешь правду или примешь одинокого ребёнка. Кто будет первым?',
    choices: [
      { text: 'Следовать за Иисусом, даже если из-за этого я стану менее популярным.', correct: true },
      { text: 'Делать всё, лишь бы всем нравиться.', correct: false },
    ],
    explain: 'Одобрение тоже может стать хозяином. Иисус дороже желания всегда выглядеть круто.',
  },
  {
    icon: '👟',
    prompt: 'Ты получил вещь, которую очень хотел. Как радоваться ей и не позволить ей завладеть сердцем?',
    choices: [
      { text: 'Поблагодарить Бога, беречь её и оставаться готовым делиться и слушаться.', correct: true },
      { text: 'Доказывать с её помощью, что я важнее других детей.', correct: false },
    ],
    explain: 'Хороший подарок сам по себе не грех. Опасность видна в гордости, жадности и отказе слушать Иисуса.',
  },
]

type TruthCheck = { statement: string; answer: boolean; explain: string }
const truthEn: TruthCheck[] = [
  { statement: 'Can perfect behavior or enough good deeds earn eternal life?', answer: false, explain: 'No. We cannot save ourselves or put God in our debt.' },
  { statement: 'Can God save sinners when saving themselves is impossible?', answer: true, explain: 'Yes. Jesus said, “With God all things are possible.”' },
  { statement: 'Is every person who owns money or nice things automatically evil?', answer: false, explain: 'No. The danger is loving gifts more than God and refusing His rule.' },
  { statement: 'May Jesus expose anything that competes for first place in our hearts?', answer: true, explain: 'Yes. He lovingly tells the truth and calls us to follow Him.' },
  { statement: 'Did selling possessions buy the young man a ticket to heaven?', answer: false, explain: 'No. Jesus exposed his ruler and called him to follow. Salvation is God’s work, not a purchase.' },
  { statement: 'Is Jesus worth more than possessions, popularity, winning, or comfort?', answer: true, explain: 'Yes. Good gifts cannot give eternal life. Jesus is Lord and Savior.' },
]

const truthRu: TruthCheck[] = [
  { statement: 'Можно ли заслужить вечную жизнь идеальным поведением или множеством добрых дел?', answer: false, explain: 'Нет. Мы не можем спасти себя и сделать Бога своим должником.' },
  { statement: 'Может ли Бог спасти грешников, когда самим спасти себя невозможно?', answer: true, explain: 'Да. Иисус сказал: «Богу же всё возможно».' },
  { statement: 'Каждый ли человек с деньгами или хорошими вещами автоматически злой?', answer: false, explain: 'Нет. Опасность — любить подарки больше Бога и отвергать Его власть.' },
  { statement: 'Может ли Иисус показать нам то, что борется за первое место в сердце?', answer: true, explain: 'Да. Он с любовью говорит правду и зовёт следовать за Ним.' },
  { statement: 'Могла ли продажа имущества купить юноше место на небе?', answer: false, explain: 'Нет. Иисус показал, что управляло юношей, и позвал его следовать. Спасение совершает Бог; его не покупают.' },
  { statement: 'Дороже ли Иисус имущества, популярности, побед и удобства?', answer: true, explain: 'Да. Хорошие дары не дают вечной жизни. Иисус — Господь и Спаситель.' },
]

const panel: CSSProperties = {
  borderRadius: 22,
  border: '1.5px solid rgba(255,255,255,.16)',
  background: 'rgba(255,255,255,.07)',
  padding: '22px 20px',
}

function ScriptureBox({ verse, isRu }: { verse: Scripture; isRu: boolean }) {
  return (
    <div style={{ ...panel, margin: '24px 0', borderColor: 'rgba(251,191,36,.5)', background: 'rgba(251,191,36,.08)' }}>
      <a href={verse.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
        <p style={{ margin: '0 0 9px', fontFamily: 'var(--font-nunito)', color: GOLD, fontSize: '.73rem', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {verse.reference} · {verse.translation} ↗
        </p>
      </a>
      <p style={{ margin: 0, color: 'rgba(255,255,255,.9)', fontFamily: 'var(--font-lora)', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.75 }}>
        “{verse.text}”
      </p>
      <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,.46)', fontFamily: 'var(--font-nunito)', fontSize: '.68rem', fontWeight: 800 }}>
        {isRu ? 'Точный текст и ссылка: Bible.com' : 'Exact text and source link: Bible.com'}
      </p>
    </div>
  )
}

function SectionBar({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`, padding: '14px 20px', textAlign: 'center' }}>
      <p style={{ margin: 0, color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, letterSpacing: 1.5, fontSize: '.85rem' }}>{children}</p>
    </div>
  )
}

function Activity({ label, intro, children }: { label: string; intro: string; children: ReactNode }) {
  return (
    <div style={panel}>
      <p style={{ margin: '0 0 6px', color: GOLD, fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.72rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</p>
      <p style={{ margin: '0 0 18px', color: 'rgba(255,255,255,.75)', fontFamily: 'var(--font-nunito)', fontWeight: 700, lineHeight: 1.55 }}>{intro}</p>
      {children}
    </div>
  )
}

function Locked({ number, isRu }: { number: number; isRu: boolean }) {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '52px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🔒</div>
      <p style={{ color: 'rgba(255,255,255,.55)', fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>
        {isRu ? `Заверши раздел ${number - 1}, чтобы открыть этот раздел.` : `Complete Section ${number - 1} to unlock this section.`}
      </p>
    </div>
  )
}

function ChoiceButton({ children, onClick, disabled, selected, correct }: { children: ReactNode; onClick: () => void; disabled?: boolean; selected?: boolean; correct?: boolean | null }) {
  const color = selected ? (correct ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,.2)'
  return (
    <button disabled={disabled} onClick={onClick} style={{ width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 14, border: `2px solid ${color}`, background: selected ? (correct ? 'rgba(34,197,94,.14)' : 'rgba(239,68,68,.14)') : 'rgba(255,255,255,.06)', color: '#fff', fontFamily: 'var(--font-nunito)', fontSize: '.93rem', fontWeight: 800, lineHeight: 1.45, cursor: disabled ? 'default' : 'pointer' }}>
      {children}
    </button>
  )
}

export default function OneThingYouLackPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const scripture = isRu ? scriptureRu : scriptureEn
  const story = isRu ? storyRu : storyEn
  const memory = isRu ? memoryRu : memoryEn
  const heart = isRu ? heartRu : heartEn
  const truth = isRu ? truthRu : truthEn

  const progressRaw = useSyncExternalStore(subscribeToProgress, getProgressSnapshot, () => DEFAULT_PROGRESS)
  const { unlocked, done } = useMemo(() => parseProgress(progressRaw), [progressRaw])
  const [won, setWon] = useState(false)
  const completionDialogRef = useRef<HTMLDivElement>(null)

  const [sequence, setSequence] = useState<string[]>([])
  const [sequenceWrong, setSequenceWrong] = useState(false)
  const [openCards, setOpenCards] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set())
  const [memoryBusy, setMemoryBusy] = useState(false)
  const [heartIndex, setHeartIndex] = useState(0)
  const [heartPick, setHeartPick] = useState<number | null>(null)
  const [heartFeedback, setHeartFeedback] = useState<'right' | 'wrong' | null>(null)
  const [truthIndex, setTruthIndex] = useState(0)
  const [truthPick, setTruthPick] = useState<boolean | null>(null)
  const [truthFeedback, setTruthFeedback] = useState<'right' | 'wrong' | null>(null)

  const storyById = useMemo(() => Object.fromEntries(story.map(step => [step.id, step])), [story])

  useEffect(() => {
    if (!won) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = completionDialogRef.current
    dialog?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setWon(false)
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const focusable = [...dialog.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')].filter(element => !element.hasAttribute('disabled'))
      if (!focusable.length) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [won])

  function solve(id: string, section: number) {
    if (done.has(id)) return
    const nextDone = new Set([...done, id])
    const nextUnlocked = new Set(unlocked)
    if (section < 4) {
      nextUnlocked.add(section + 1)
      saveProgress(nextUnlocked, nextDone)
      setTimeout(() => document.getElementById(`section-${section + 1}`)?.scrollIntoView({ behavior: 'smooth' }), 850)
    } else {
      saveProgress(nextUnlocked, nextDone)
      setTimeout(() => setWon(true), 500)
    }
  }

  function tapStory(id: string) {
    if (done.has('story') || sequence.includes(id)) return
    const expected = STORY_ORDER[sequence.length]
    if (id !== expected) {
      setSequenceWrong(true)
      setTimeout(() => { setSequence([]); setSequenceWrong(false) }, 700)
      return
    }
    const next = [...sequence, id]
    setSequence(next)
    if (next.length === STORY_ORDER.length) solve('story', 1)
  }

  function flipMemory(card: MemoryCard) {
    if (memoryBusy || done.has('memory') || openCards.includes(card.id) || matchedPairs.has(card.pair)) return
    const next = [...openCards, card.id]
    setOpenCards(next)
    if (next.length < 2) return
    setMemoryBusy(true)
    const first = memory.find(item => item.id === next[0])
    if (first?.pair === card.pair) {
      const pairs = new Set([...matchedPairs, card.pair])
      setMatchedPairs(pairs)
      setTimeout(() => {
        setOpenCards([])
        setMemoryBusy(false)
        if (pairs.size === 6) solve('memory', 2)
      }, 650)
    } else {
      setTimeout(() => { setOpenCards([]); setMemoryBusy(false) }, 900)
    }
  }

  function answerHeart(choiceIndex: number) {
    if (heartFeedback) return
    const chosen = heart[heartIndex].choices[choiceIndex]
    setHeartPick(choiceIndex)
    setHeartFeedback(chosen.correct ? 'right' : 'wrong')
    if (!chosen.correct) {
      setTimeout(() => { setHeartPick(null); setHeartFeedback(null) }, 950)
      return
    }
    setTimeout(() => {
      if (heartIndex === heart.length - 1) solve('heart', 3)
      else setHeartIndex(value => value + 1)
      setHeartPick(null)
      setHeartFeedback(null)
    }, 1250)
  }

  function answerTruth(answer: boolean) {
    if (truthFeedback) return
    const correct = truth[truthIndex].answer === answer
    setTruthPick(answer)
    setTruthFeedback(correct ? 'right' : 'wrong')
    if (!correct) {
      setTimeout(() => { setTruthPick(null); setTruthFeedback(null) }, 950)
      return
    }
    setTimeout(() => {
      if (truthIndex === truth.length - 1) solve('truth', 4)
      else setTruthIndex(value => value + 1)
      setTruthPick(null)
      setTruthFeedback(null)
    }, 1250)
  }

  function resetAll() {
    if (!confirm(isRu ? 'Сбросить весь прогресс урока?' : 'Reset all lesson progress?')) return
    clearProgress()
    window.location.reload()
  }

  const completed = ['story', 'memory', 'heart', 'truth'].filter(id => done.has(id)).length

  return (
    <>
      <style>{`
        @keyframes softGlow { 0%,100%{filter:drop-shadow(0 0 4px rgba(251,191,36,.3))} 50%{filter:drop-shadow(0 0 14px rgba(251,191,36,.75))} }
        @keyframes cardRise { from{transform:translateY(8px);opacity:.35} to{transform:translateY(0);opacity:1} }
      `}</style>

      {won && (
        <div ref={completionDialogRef} role="dialog" aria-modal="true" aria-labelledby="one-thing-complete-title" tabIndex={-1} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(28,13,4,.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 28, outline: 'none' }}>
          <div style={{ fontSize: '4.5rem', animation: 'softGlow 2s infinite' }}>👑</div>
          <h2 id="one-thing-complete-title" style={{ color: GOLD, fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 'clamp(1.5rem,5vw,2.3rem)', margin: '14px 0 10px' }}>
            {isRu ? 'Одного недостаёт: следовать за Иисусом' : 'One thing matters: follow Jesus'}
          </h2>
          <p style={{ maxWidth: 590, color: 'rgba(255,255,255,.84)', fontFamily: 'var(--font-lora)', lineHeight: 1.75 }}>
            {isRu
              ? 'Добрые дела не покупают вечную жизнь. Вещи сами по себе не зло. Но Иисус — Господь, и ничто не должно занять Его место. То, что невозможно нам, возможно Богу.'
              : 'Good deeds do not purchase eternal life. Possessions are not automatically evil. But Jesus is Lord, and nothing belongs in His place. What is impossible for us is possible with God.'}
          </p>
          <div style={{ ...panel, maxWidth: 560, margin: '14px 0 24px', color: CREAM, fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
            <strong>{isRu ? 'Вызов открытой руки:' : 'Open-Hand Challenge:'}</strong>{' '}
            {isRu
              ? 'На этой неделе выбери один честный шаг: поделиться, отложить экран, порадоваться чужой победе, дать часть карманных денег или сказать правду. Не чтобы заслужить спасение, а чтобы потренироваться следовать за Иисусом.'
              : 'This week choose one honest step: share, put down a screen, celebrate someone else’s win, give from your allowance, or tell the truth. Not to earn salvation—practice following Jesus.'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => setWon(false)} style={{ padding: '13px 24px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${GOLD},#d97706)`, color: '#3b1d05', fontFamily: 'var(--font-nunito)', fontWeight: 900, cursor: 'pointer' }}>{isRu ? '← Вернуться к уроку' : '← Back to lesson'}</button>
            <Link href="/lessons" style={{ padding: '13px 24px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,.25)', color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, textDecoration: 'none' }}>{isRu ? 'Все уроки' : 'All lessons'}</Link>
          </div>
        </div>
      )}

      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '54vh', padding: '72px 20px 56px', textAlign: 'center', background: '#451a03', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Image src="/images/jr/lessons/one-thing-you-lack/topic-one-thing-you-lack-fal.png" alt="" fill priority style={{ objectFit: 'cover', opacity: .42 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(28,13,4,.48),rgba(28,13,4,.9))' }} />
        <div style={{ position: 'relative', maxWidth: 720 }}>
          <div style={{ fontSize: '4.2rem', marginBottom: 14, animation: 'softGlow 2.4s infinite' }}>👑🤲</div>
          <p style={{ margin: '0 0 9px', color: '#fde68a', fontFamily: 'var(--font-nunito)', fontWeight: 900, letterSpacing: 2, fontSize: '.82rem', textTransform: 'uppercase' }}>{isRu ? 'Матфея 19:13–26' : 'Matthew 19:13–26'}</p>
          <h1 style={{ margin: '0 0 14px', color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 'clamp(2rem,6vw,3.3rem)', lineHeight: 1.12 }}>{isRu ? 'Одного тебе недостаёт' : 'One Thing You Lack'}</h1>
          <p style={{ maxWidth: 650, margin: '0 auto', color: 'rgba(255,255,255,.9)', fontFamily: 'var(--font-lora)', fontSize: '1.04rem', lineHeight: 1.75 }}>
            {isRu
              ? 'Он был богат вещами, но беден свободой: имущество управляло его сердцем. Иисус с любовью показал это и позвал его к единственному настоящему сокровищу — следовать за Ним.'
              : 'He was rich in things but poor in freedom: his possessions ruled his heart. Jesus lovingly exposed it and called him to the one treasure that matters most—following Him.'}
          </p>
        </div>
      </section>

      <div style={{ position: 'sticky', top: 0, zIndex: 20, padding: '10px 16px', textAlign: 'center', background: '#fffbeb', borderBottom: `2px solid ${ACCENT}` }}>
        <span style={{ color: ACCENT_DARK, fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{isRu ? 'ПРОГРЕСС' : 'PROGRESS'} · {[1,2,3,4].map(n => done.has(['story','memory','heart','truth'][n-1]) ? '⭐' : unlocked.has(n) ? '📖' : '🔒').join(' ')} · {completed}/4</span>
        <button onClick={resetAll} style={{ marginLeft: 14, border: 0, background: 'none', color: '#9a7b60', fontFamily: 'var(--font-nunito)', fontWeight: 800, cursor: 'pointer' }}>{isRu ? 'сбросить' : 'reset'}</button>
      </div>

      <section id="section-1" style={{ background: 'linear-gradient(180deg,#451a03,#5a2205)', paddingBottom: 8 }}>
        <SectionBar>{isRu ? '1 · БОГАТЫЙ, НО НЕ СВОБОДНЫЙ' : '1 · RICH, BUT NOT FREE'}</SectionBar>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '38px 20px 46px' }}>
          <h2 style={{ color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 'clamp(1.5rem,4vw,2.2rem)' }}>{isRu ? 'Что управляло им?' : 'What was ruling him?'}</h2>
          <p style={{ color: 'rgba(255,255,255,.82)', fontFamily: 'var(--font-lora)', lineHeight: 1.8 }}>
            {isRu
              ? 'В слайде проповеди он назван «бедным молодым рабом». Это не имя из Библии. Смысл такой: у юноши было много богатства, но он был не свободен отпустить его. Имущество стало хозяином сердца.'
              : 'The sermon slide calls him “the poor young slave.” That is not the Bible’s name for him. It means he owned great wealth, yet he was not free to release it. His possessions had become his heart’s master.'}
          </p>
          <p style={{ color: 'rgba(255,255,255,.82)', fontFamily: 'var(--font-lora)', lineHeight: 1.8 }}>
            {isRu
              ? 'Юноша начал с вопроса о добром деле. Он думал, будто вечную жизнь можно получить правильным результатом. Иисус не дал ему лёгкий балл. Он показал то место, где юноша не хотел отдать Богу первое место.'
              : 'The young man began by asking about a good deed. He thought eternal life could be gained with the right score. Jesus did not hand him an easy point. He revealed the place where the man would not let God be first.'}
          </p>
          <ScriptureBox verse={scripture.question} isRu={isRu} />
          <div style={{ ...panel, margin: '22px 0', borderColor: 'rgba(251,191,36,.5)', background: 'rgba(251,191,36,.08)' }}>
            <h3 style={{ marginTop: 0, color: '#fde68a', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{isRu ? '👐 Открытые руки, а не табель с оценками' : '👐 Open hands, not a perfect scorecard'}</h3>
            <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,.84)', fontFamily: 'var(--font-lora)', lineHeight: 1.75 }}>
              {isRu
                ? 'Прямо перед этим родители привели к Иисусу маленьких детей (Матфея 19:13–15). Им нечем было хвалиться и нечем было платить — они просто пришли. Богатый юноша пришёл с достижениями и руками, занятыми сокровищем, и спросил, что ещё ему сделать. Это не значит, что дети безгрешны. Это показывает, как принимают Божье Царство: как подарок Иисуса, а не как награду, которую мы заработали.'
                : 'Just before this, parents brought little children to Jesus (Matthew 19:13–15). They had no status to boast about and nothing with which to pay—they simply came. The rich young man came with achievements and hands full of treasure, asking what else he could do. This does not mean children are sinless. It shows how God’s kingdom is received: as Jesus’ gift, not a prize we earn.'}
            </p>
            <a href="https://www.youtube.com/watch?v=dx03mEwgHKM" target="_blank" rel="noreferrer" style={{ color: GOLD, fontFamily: 'var(--font-nunito)', fontSize: '.78rem', fontWeight: 900 }}>
              {isRu ? 'Сопоставлено с проповедью The Church of Eleven22 · Matthew S5E9 ↗' : 'Cross-reference: The Church of Eleven22 · Matthew S5E9 ↗'}
            </a>
          </div>
          <Activity label={isRu ? 'ЗАДАНИЕ 1 · СОБЕРИ ИСТОРИЮ' : 'ACTIVITY 1 · BUILD THE STORY'} intro={isRu ? 'Ты уже прочитал основу. Нажми события по порядку.' : 'You have the story primer. Tap the events in Bible order.'}>
            {done.has('story') && <p style={{ color: '#86efac', fontFamily: 'var(--font-nunito)', fontWeight: 900, textAlign: 'center' }}>✅ {isRu ? 'История собрана!' : 'Story complete!'}</p>}
            <div style={{ display: 'grid', gap: 10 }}>
              {(done.has('story') ? STORY_ORDER : STORY_SCRAMBLED).map(id => {
                const step = storyById[id]
                const chosen = sequence.includes(id) || done.has('story')
                return (
                  <button key={id} onClick={() => tapStory(id)} disabled={chosen} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '13px 15px', borderRadius: 14, border: `2px solid ${sequenceWrong ? '#ef4444' : chosen ? GOLD : 'rgba(255,255,255,.16)'}`, background: chosen ? 'rgba(251,191,36,.12)' : 'rgba(255,255,255,.05)', color: '#fff', textAlign: 'left', cursor: chosen ? 'default' : 'pointer' }}>
                    <span style={{ fontSize: '1.45rem' }}>{step.emoji}</span>
                    <span style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, lineHeight: 1.45 }}>{step.text}</span>
                  </button>
                )
              })}
            </div>
            {sequenceWrong && <p style={{ color: '#fca5a5', textAlign: 'center', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{isRu ? 'Не совсем — история перемешивается для новой попытки.' : 'Not quite—the story is resetting for another try.'}</p>}
          </Activity>
        </div>
      </section>

      <section id="section-2" style={{ background: 'linear-gradient(180deg,#5a2205,#3b1d0b)', paddingBottom: 8 }}>
        <SectionBar>{isRu ? '2 · ЛЮБЯЩИЙ СПАСИТЕЛЬ' : '2 · THE LOVING SAVIOR'}</SectionBar>
        {!unlocked.has(2) ? <Locked number={2} isRu={isRu} /> : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '38px 20px 46px' }}>
            <h2 style={{ color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 'clamp(1.5rem,4vw,2.2rem)' }}>{isRu ? 'Правда, сказанная с любовью' : 'Truth spoken with love'}</h2>
            <p style={{ color: 'rgba(255,255,255,.82)', fontFamily: 'var(--font-lora)', lineHeight: 1.8 }}>
              {isRu
                ? 'Матфей рассказывает разговор. Марк добавляет важную подробность: Иисус посмотрел на юношу и полюбил его. Любовь Иисуса не прячет опасную правду. Он хотел освободить юношу от ложного хозяина и позвал: «Следуй за Мною».'
                : 'Matthew records the conversation. Mark adds an important detail: Jesus looked at the man and loved him. Jesus’ love does not hide dangerous truth. He wanted to free the man from a false master and called, “Follow me.”'}
            </p>
            <ScriptureBox verse={scripture.love} isRu={isRu} />
            <Activity label={isRu ? 'ЗАДАНИЕ 2 · ПАМЯТЬ СЕРДЦА' : 'ACTIVITY 2 · HEART MEMORY'} intro={isRu ? 'Переворачивай плитки и соединяй две половины каждой истины. Найди 6 пар.' : 'Flip tiles and match the two halves of each truth. Find all 6 pairs.'}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 }}>
                {memory.map(card => {
                  const open = openCards.includes(card.id) || matchedPairs.has(card.pair) || done.has('memory')
                  return (
                    <button data-memory-id={card.id} key={card.id} onClick={() => flipMemory(card)} disabled={open || memoryBusy || done.has('memory')} aria-label={open ? card.text : isRu ? 'Закрытая плитка памяти' : 'Hidden memory tile'} style={{ minHeight: 132, padding: 12, borderRadius: 16, border: `2px solid ${matchedPairs.has(card.pair) || done.has('memory') ? '#22c55e' : open ? GOLD : 'rgba(255,255,255,.2)'}`, background: open ? 'rgba(251,191,36,.12)' : 'linear-gradient(145deg,#92400e,#451a03)', color: '#fff', cursor: open ? 'default' : 'pointer', transition: 'all .25s', animation: open ? 'cardRise .25s ease' : undefined }}>
                      {open ? <><div style={{ fontSize: '1.65rem', marginBottom: 7 }}>{card.icon}</div><div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.82rem', lineHeight: 1.35 }}>{card.text}</div></> : <><div style={{ fontSize: '2rem' }}>?</div><div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.72rem', opacity: .65 }}>{isRu ? 'ОТКРОЙ' : 'FLIP'}</div></>}
                    </button>
                  )
                })}
              </div>
              <p style={{ margin: '14px 0 0', textAlign: 'center', color: 'rgba(255,255,255,.6)', fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>{isRu ? `Найдено пар: ${matchedPairs.size}/6` : `Pairs found: ${matchedPairs.size}/6`}</p>
            </Activity>
          </div>
        )}
      </section>

      <section id="section-3" style={{ background: 'linear-gradient(180deg,#3b1d0b,#4a250d)', paddingBottom: 8 }}>
        <SectionBar>{isRu ? '3 · ЧТО МНЕ ДЕЛАТЬ?' : '3 · WHAT MUST I DO?'}</SectionBar>
        {!unlocked.has(3) ? <Locked number={3} isRu={isRu} /> : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '38px 20px 46px' }}>
            <h2 style={{ color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 'clamp(1.5rem,4vw,2.2rem)' }}>{isRu ? 'Не «вещи плохие», а «кто первый?»' : 'Not “things are bad,” but “who is first?”'}</h2>
            <p style={{ color: 'rgba(255,255,255,.82)', fontFamily: 'var(--font-lora)', lineHeight: 1.8 }}>
              {isRu
                ? 'Иисус дал этому юноше конкретное повеление, которое открыло его конкретного идола. Библия не говорит, что каждый человек обязан продать всё, чтобы заслужить спасение. Она учит, что Иисус — Господь: мы не можем держать что-то как неприкосновенного хозяина и одновременно говорить, что следуем за Ним.'
                : 'Jesus gave this man a specific command that exposed his specific idol. The Bible does not say every person must sell everything to earn salvation. It teaches that Jesus is Lord: we cannot protect something as an untouchable master while claiming to follow Him.'}
            </p>
            <ScriptureBox verse={scripture.call} isRu={isRu} />
            <Activity label={isRu ? 'ЗАДАНИЕ 3 · КТО НА ПЕРВОМ МЕСТЕ?' : 'ACTIVITY 3 · WHO IS FIRST?'} intro={isRu ? 'Выбери ответ, который показывает открытое для Иисуса сердце.' : 'Choose the response that shows a heart open to Jesus.'}>
              {!done.has('heart') ? (
                <>
                  <p style={{ color: GOLD, fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{heartIndex + 1}/{heart.length}</p>
                  <div style={{ ...panel, padding: 18, marginBottom: 14 }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>{heart[heartIndex].icon}</div>
                    <p style={{ margin: 0, color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, lineHeight: 1.55 }}>{heart[heartIndex].prompt}</p>
                  </div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {heart[heartIndex].choices.map((choice, index) => <ChoiceButton key={choice.text} onClick={() => answerHeart(index)} disabled={heartFeedback !== null} selected={heartPick === index} correct={heartPick === index ? choice.correct : null}>{choice.text}</ChoiceButton>)}
                  </div>
                  {heartFeedback && <p style={{ margin: '14px 0 0', color: heartFeedback === 'right' ? '#86efac' : '#fca5a5', fontFamily: 'var(--font-nunito)', fontWeight: 800, lineHeight: 1.55 }}>{heartFeedback === 'right' ? '✅ ' : '↻ '}{heart[heartIndex].explain}</p>}
                </>
              ) : <p style={{ color: '#86efac', textAlign: 'center', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>✅ {isRu ? 'Ты проверил все пять ситуаций.' : 'You worked through all five heart checks.'}</p>}
            </Activity>
          </div>
        )}
      </section>

      <section id="section-4" style={{ background: 'linear-gradient(180deg,#4a250d,#1c0d04)', paddingBottom: 20 }}>
        <SectionBar>{isRu ? '4 · ОН УШЁЛ С ПЕЧАЛЬЮ' : '4 · HE WENT AWAY SORROWFUL'}</SectionBar>
        {!unlocked.has(4) ? <Locked number={4} isRu={isRu} /> : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '38px 20px 54px' }}>
            <h2 style={{ color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 'clamp(1.5rem,4vw,2.2rem)' }}>{isRu ? 'Невозможно нам. Возможно Богу.' : 'Impossible for us. Possible with God.'}</h2>
            <p style={{ color: 'rgba(255,255,255,.82)', fontFamily: 'var(--font-lora)', lineHeight: 1.8 }}>
              {isRu
                ? 'Юноша ушёл с печалью. Иисус не побежал за ним, чтобы сделать цену ученичества удобнее. Затем Он сказал, что богатому войти в Царство труднее, чем верблюду пройти сквозь игольное ушко. Ученики поняли проблему и спросили: «Так кто же может спастись?»'
                : 'The man went away sorrowful. Jesus did not chase him down and make discipleship cheaper. Then He said it is easier for a camel to pass through a needle’s eye than for a rich person to enter God’s kingdom. The disciples understood the problem and asked, “Who then can be saved?”'}
            </p>
            <div style={{ ...panel, textAlign: 'center', margin: '22px 0' }}><div style={{ fontSize: '3.5rem' }}>🐪 ➜ 🪡</div><p style={{ color: '#fde68a', fontFamily: 'var(--font-nunito)', fontWeight: 900, marginBottom: 0 }}>{isRu ? 'Не секретные ворота и не маленький верблюд. Иисус рисует невозможную картину.' : 'Not a secret gate and not a tiny camel. Jesus is drawing an impossible picture.'}</p></div>
            <p style={{ color: 'rgba(255,255,255,.82)', fontFamily: 'var(--font-lora)', lineHeight: 1.8 }}>
              {isRu
                ? 'Вот хорошая новость: Иисус не сказал, что нужно постараться чуть сильнее. Он сказал, что спасение невозможно людям, но возможно Богу. Нам нужен Спаситель, а не просто лучший список дел.'
                : 'Here is the good news: Jesus did not say we merely need to try harder. He said salvation is impossible with people but possible with God. We need a Savior, not merely a better checklist.'}
            </p>
            <ScriptureBox verse={scripture.impossible} isRu={isRu} />
            <Activity label={isRu ? 'ЗАДАНИЕ 4 · ТОЧНО ЛИ ЭТО ЕВАНГЕЛИЕ?' : 'ACTIVITY 4 · IS THAT REALLY THE GOSPEL?'} intro={isRu ? 'Ответь «да» или «нет». Ошибка не наказывает — попробуй снова и закрепи истину.' : 'Answer yes or no. A miss does not punish you—try again and lock in the truth.'}>
              {!done.has('truth') ? (
                <>
                  <p style={{ color: GOLD, fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{truthIndex + 1}/{truth.length}</p>
                  <div style={{ ...panel, padding: 18, marginBottom: 14 }}><p style={{ margin: 0, color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, lineHeight: 1.55 }}>{truth[truthIndex].statement}</p></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <ChoiceButton onClick={() => answerTruth(true)} disabled={truthFeedback !== null} selected={truthPick === true} correct={truthPick === true ? truth[truthIndex].answer : null}>✅ {isRu ? 'ДА' : 'YES'}</ChoiceButton>
                    <ChoiceButton onClick={() => answerTruth(false)} disabled={truthFeedback !== null} selected={truthPick === false} correct={truthPick === false ? !truth[truthIndex].answer : null}>❌ {isRu ? 'НЕТ' : 'NO'}</ChoiceButton>
                  </div>
                  {truthFeedback && <p style={{ margin: '14px 0 0', color: truthFeedback === 'right' ? '#86efac' : '#fca5a5', fontFamily: 'var(--font-nunito)', fontWeight: 800, lineHeight: 1.55 }}>{truthFeedback === 'right' ? '✅ ' : '↻ '}{truth[truthIndex].explain}</p>}
                </>
              ) : <p style={{ color: '#86efac', textAlign: 'center', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>✅ {isRu ? 'Истина закреплена. То, что невозможно нам, возможно Богу.' : 'Truth locked in. What is impossible for us is possible with God.'}</p>}
            </Activity>

            <div style={{ ...panel, marginTop: 24, borderColor: 'rgba(134,239,172,.5)', background: 'rgba(34,197,94,.08)' }}>
              <h3 style={{ color: '#86efac', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>{isRu ? '🙏 Молитва открытых рук' : '🙏 Open-Hand Prayer'}</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,.84)', fontFamily: 'var(--font-lora)', lineHeight: 1.75, fontStyle: 'italic' }}>
                {isRu
                  ? 'Иисус, Ты дороже всего, что у меня есть. Покажи, если что-то пытается занять Твоё место в моём сердце. Я не могу спасти себя. Спасибо, что Богу возможно невозможное. Помоги мне доверять Тебе и следовать за Тобой. Аминь.'
                  : 'Jesus, You are worth more than anything I own. Show me if something is trying to take Your place in my heart. I cannot save myself. Thank You that what is impossible for me is possible with God. Help me trust You and follow You. Amen.'}
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
