'use client'

import { useState, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// ─── Theme ────────────────────────────────────────────────────────────────────
// Warm brick & stone — Jesus the Builder
const ACCENT      = '#c2410c'
const ACCENT_DARK = '#7c2d12'
const ACCENT_GLOW = 'rgba(194,65,12,.15)'

const STORAGE_UNLOCKED = 'church-build_unlocked'
const STORAGE_DONE = 'church-build_done'
const STORAGE_PROGRESS = 'church-build_progress_v2'
const PROGRESS_EVENT = 'church-build-progress'
const DEFAULT_PROGRESS = JSON.stringify({ unlocked: [1], done: [] })
const COMPLETION_ORDER = ['tf', 'sort', 'flip', 'wall'] as const
let churchStorageDisabled = false
let volatileProgress = DEFAULT_PROGRESS

type StoredProgress = { unlocked: number[]; done: string[] }

function normalizeProgress(value: unknown): StoredProgress {
  const record = value && typeof value === 'object' ? value as Partial<StoredProgress> : {}
  const rawDone = Array.isArray(record.done) ? record.done.filter((id): id is string => typeof id === 'string') : []
  const done: string[] = []
  for (const id of COMPLETION_ORDER) {
    if (!rawDone.includes(id)) break
    done.push(id)
  }
  const unlocked = [1]
  if (done.includes('tf')) unlocked.push(2)
  if (done.includes('sort')) unlocked.push(3)
  if (done.includes('flip')) unlocked.push(4)
  return { unlocked, done }
}

function getProgressSnapshot() {
  if (typeof window === 'undefined' || churchStorageDisabled) return volatileProgress
  try {
    const current = localStorage.getItem(STORAGE_PROGRESS)
    if (current) {
      volatileProgress = JSON.stringify(normalizeProgress(JSON.parse(current)))
    } else {
      const legacyDone = JSON.parse(localStorage.getItem(STORAGE_DONE) ?? '[]')
      volatileProgress = JSON.stringify(normalizeProgress({ done: legacyDone }))
    }
  } catch {
    churchStorageDisabled = true
  }
  return volatileProgress
}

function subscribeToProgress(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if ([STORAGE_PROGRESS, STORAGE_UNLOCKED, STORAGE_DONE].includes(event.key ?? '')) onStoreChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(PROGRESS_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(PROGRESS_EVENT, onStoreChange)
  }
}

function saveProgress(done: Set<string>) {
  volatileProgress = JSON.stringify(normalizeProgress({ done: [...done] }))
  if (!churchStorageDisabled) {
    try { localStorage.setItem(STORAGE_PROGRESS, volatileProgress) } catch { churchStorageDisabled = true }
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

function removeStoredProgress() {
  volatileProgress = DEFAULT_PROGRESS
  if (!churchStorageDisabled) {
    for (const key of [STORAGE_PROGRESS, STORAGE_UNLOCKED, STORAGE_DONE]) {
      try { localStorage.removeItem(key) } catch { churchStorageDisabled = true; break }
    }
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

const SCRIPTURE_EN = {
  matthew16: 'I will build my church, and the gates of hell shall not prevail against it.',
  luke2: 'And Jesus increased in wisdom and in stature and in favor with God and man.',
  mark3: 'And he appointed twelve (whom he also named apostles) so that they might be with him and he might send them out to preach',
  peter2: 'you yourselves like living stones are being built up as a spiritual house',
  matthew28: 'Go therefore and make disciples of all nations',
}

const SCRIPTURE_RU = {
  matthew16: 'Я создам Церковь Мою, и врата ада не одолеют ее',
  luke2: 'Иисус же преуспевал в премудрости и возрасте и в любви у Бога и человеков.',
  mark3: 'И поставил из них двенадцать, чтобы с Ним были и чтобы посылать их на проповедь',
  peter2: 'и сами, как живые камни, устрояйте из себя дом духовный',
  matthew28: 'Итак идите, научите все народы',
}

const SCRIPTURE_LINKS = {
  en: [
    ['Matthew 16:18', 'https://www.bible.com/bible/59/MAT.16.18.ESV'],
    ['Luke 2:52', 'https://www.bible.com/bible/59/LUK.2.52.ESV'],
    ['Mark 3:14', 'https://www.bible.com/bible/59/MRK.3.14.ESV'],
    ['1 Peter 2:5', 'https://www.bible.com/bible/59/1PE.2.5.ESV'],
    ['Matthew 28:19', 'https://www.bible.com/bible/59/MAT.28.19.ESV'],
  ],
  ru: [
    ['Матфея 16:18', 'https://www.bible.com/bible/167/MAT.16.18.RST'],
    ['Луки 2:52', 'https://www.bible.com/bible/167/LUK.2.52.RST'],
    ['Марка 3:14', 'https://www.bible.com/bible/167/MRK.3.14.RST'],
    ['1 Петра 2:5', 'https://www.bible.com/bible/167/1PE.2.5.RST'],
    ['Матфея 28:19', 'https://www.bible.com/bible/167/MAT.28.19.RST'],
  ],
} as const

// ─── Section unlock requirements ─────────────────────────────────────────────
const SECTION_REQS: Record<number, string[]> = {
  1: ['tf'],
  2: ['sort'],
  3: ['flip'],
  4: ['wall'],
}

// ─── True/False data ──────────────────────────────────────────────────────────
const TF_EN = [
  {
    id: 'q1',
    text: 'The Church that Jesus builds is a building made of bricks and stone.',
    correct: false,
    explain: 'The Church is people — everyone who trusts and follows Jesus. A building is just where the Church meets!',
  },
  {
    id: 'q2',
    text: "Jesus said 'I will build My Church' — He is the builder.",
    correct: true,
    explain: "Matthew 16:18. It is His Church and His promise. Everyone who trusts Jesus belongs to His people.",
  },
  {
    id: 'q3',
    text: 'Jesus promised that the gates of hell will not overcome His Church.',
    correct: true,
    explain: 'Nothing can stop what Jesus builds — no enemy, no darkness, not even hell itself.',
  },
  {
    id: 'q4',
    text: 'The Church only started because people decided to make a club about Jesus.',
    correct: false,
    explain: 'Jesus promised to build His Church. It is His work and His plan, not a club people invented.',
  },
  {
    id: 'q5',
    text: 'Kids are too young to be part of the Church Jesus is building.',
    correct: false,
    explain: "Jesus welcomes children. A child who trusts and follows Him is not a second-class part of God's people.",
  },
]

const TF_RU = [
  {
    id: 'q1',
    text: 'Церковь, которую строит Иисус, — это здание из кирпичей и камня.',
    correct: false,
    explain: 'Церковь — это люди: все, кто верит в Иисуса и следует за Ним. Здание — лишь место, где Церковь собирается!',
  },
  {
    id: 'q2',
    text: 'Иисус сказал: «Я создам Церковь Мою» — строитель именно Он.',
    correct: true,
    explain: 'Матфея 16:18. Это Его Церковь и Его обещание. Каждый, кто верит в Иисуса, принадлежит к Его народу.',
  },
  {
    id: 'q3',
    text: 'Иисус обещал, что врата ада не одолеют Его Церковь.',
    correct: true,
    explain: 'Ничто не остановит то, что строит Иисус, — ни враг, ни тьма, ни даже сам ад.',
  },
  {
    id: 'q4',
    text: 'Церковь появилась просто потому, что люди решили создать кружок про Иисуса.',
    correct: false,
    explain: 'Иисус обещал создать Свою Церковь. Это Его труд и Его план, а не придуманный людьми кружок.',
  },
  {
    id: 'q5',
    text: 'Дети слишком малы, чтобы быть частью Церкви, которую строит Иисус.',
    correct: false,
    explain: 'Иисус принимает детей. Ребёнок, который верит в Него и следует за Ним, — не второстепенная часть Божьего народа.',
  },
]

// ─── Grow-sort data (Luke 2:52 — four directions of growth) ──────────────────
type GrowCat = 'wisdom' | 'body' | 'god' | 'people'

const GROW_CATS: { id: GrowCat; emoji: string; en: string; ru: string }[] = [
  { id: 'wisdom', emoji: '🧠', en: 'Wisdom', ru: 'Мудрость' },
  { id: 'body',   emoji: '💪', en: 'Body',   ru: 'Тело' },
  { id: 'god',    emoji: '❤️', en: 'God',    ru: 'Бог' },
  { id: 'people', emoji: '🤝', en: 'People', ru: 'Люди' },
]

const GROW_ITEMS: { id: string; cat: GrowCat; en: string; ru: string }[] = [
  { id: 'w1', cat: 'wisdom', en: 'Learning to read the Bible',       ru: 'Учиться читать Библию' },
  { id: 'w2', cat: 'wisdom', en: 'Asking good questions',            ru: 'Задавать хорошие вопросы' },
  { id: 'b1', cat: 'body',   en: 'Eating healthy and sleeping well', ru: 'Есть полезную еду и высыпаться' },
  { id: 'b2', cat: 'body',   en: 'Playing and exercising',           ru: 'Играть и заниматься спортом' },
  { id: 'g1', cat: 'god',    en: 'Praying every day',                ru: 'Молиться каждый день' },
  { id: 'g2', cat: 'god',    en: 'Worshiping with all your heart',   ru: 'Прославлять Бога от всего сердца' },
  { id: 'p1', cat: 'people', en: 'Sharing with your sister or brother', ru: 'Делиться с братом или сестрой' },
  { id: 'p2', cat: 'people', en: 'Being a good friend',              ru: 'Быть хорошим другом' },
]

// Fixed presentation order (mixed so categories don't come in pairs)
const GROW_ORDER = ['b1', 'g1', 'w1', 'p2', 'g2', 'b2', 'p1', 'w2']

// ─── Flip card data — how Jesus built His team ────────────────────────────────
const CARDS_EN = [
  {
    id: 'gather',
    emoji: '🤝',
    name: 'He Gathered',
    role: 'He built relationships',
    back: 'Jesus appointed twelve to be with Him. They walked and ate with Him, asked questions, watched His life, and learned through a real relationship.',
  },
  {
    id: 'show',
    emoji: '👣',
    name: 'He Showed',
    role: 'Deed and word',
    back: "Jesus did not only talk. The sermon points to the upper room: their Teacher knelt and washed His disciples' feet, then taught them to follow His example. He taught by deed and word.",
  },
  {
    id: 'send',
    emoji: '📨',
    name: 'He Sent',
    role: 'He assigned and sent disciples',
    back: 'Jesus gave His disciples real responsibility and sent them to serve. He knew they would make mistakes, but He taught and corrected them. We do not earn salvation by serving; people Jesus saves are invited to join His mission.',
  },
]

const CARDS_RU = [
  {
    id: 'gather',
    emoji: '🤝',
    name: 'Он собирал',
    role: 'Он строил отношения',
    back: 'Иисус поставил двенадцать, чтобы они были с Ним. Они ходили и ели с Ним, задавали вопросы, наблюдали за Его жизнью и учились через настоящие отношения.',
  },
  {
    id: 'show',
    emoji: '👣',
    name: 'Он показывал',
    role: 'Дело и слово',
    back: 'Иисус не только говорил. В проповеди вспоминается горница: Учитель встал на колени и умыл ноги ученикам, а затем учил их следовать Его примеру. Он учил делом и словом.',
  },
  {
    id: 'send',
    emoji: '📨',
    name: 'Он посылал',
    role: 'Он поручал и посылал учеников',
    back: 'Иисус давал ученикам настоящую ответственность и посылал их служить. Он знал, что они будут ошибаться, но учил и исправлял их. Служением мы не зарабатываем спасение; люди, которых спас Иисус, приглашены участвовать в Его деле.',
  },
]

// ─── Living stones wall data ──────────────────────────────────────────────────
const STONES: { id: string; emoji: string; en: string; ru: string }[] = [
  { id: 'crowds',     emoji: '👥', en: 'The crowds on the hill',  ru: 'Толпы на холме' },
  { id: 'zacchaeus',  emoji: '🌳', en: 'Zacchaeus in the tree',   ru: 'Закхей на дереве' },
  { id: 'well',       emoji: '🏺', en: 'The woman at the well',   ru: 'Женщина у колодца' },
  { id: 'freedman',   emoji: '🌊', en: 'The man Jesus set free',   ru: 'Человек, которого освободил Иисус' },
  { id: 'twelve',     emoji: '🎣', en: 'The twelve disciples',    ru: 'Двенадцать учеников' },
  { id: 'pastor',     emoji: '📖', en: 'Your pastor',             ru: 'Твой пастор' },
  { id: 'parents',    emoji: '🏠', en: 'Your parents',            ru: 'Твои родители' },
  { id: 'missionary', emoji: '✈️', en: 'A missionary far away',   ru: 'Миссионер в далёкой стране' },
  { id: 'friend',     emoji: '🎒', en: 'Your friend at school',   ru: 'Твой друг в школе' },
  { id: 'you',        emoji: '⭐', en: 'YOU — trust Jesus?',         ru: 'ТЫ — веришь Иисусу?' },
]

// Wall shape: 4 rows of slots, rendered top→bottom, FILLED bottom→up like a
// real wall. Each entry is a list of slot indices (slot 0 = first stone laid).
const WALL_ROWS: number[][] = [
  [8, 9],       // top row       (2 stones)
  [5, 6, 7],    //               (3 stones)
  [3, 4],       //               (2 stones)
  [0, 1, 2],    // bottom row    (3 stones) — laid first
]
const WALL_TOTAL = 10

function LockedPlaceholder({ secNum, light, isRu }: { secNum: number; light?: boolean; isRu: boolean }) {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
      <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: light ? 'rgba(124,45,18,.6)' : 'rgba(255,255,255,.5)', fontSize: '1rem' }}>
        {isRu
          ? `Заверши Раздел ${secNum - 1}, чтобы открыть этот раздел!`
          : `Complete Section ${secNum - 1} to unlock this section!`}
      </p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function JesusBuildsHisChurchPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  // ── Progress ───────────────────────────────────────────────────────────────
  const progressSnapshot = useSyncExternalStore(subscribeToProgress, getProgressSnapshot, () => DEFAULT_PROGRESS)
  const storedProgress = useMemo(() => normalizeProgress(JSON.parse(progressSnapshot)), [progressSnapshot])
  const unlocked = useMemo(() => new Set(storedProgress.unlocked), [storedProgress])
  const done = useMemo(() => new Set(storedProgress.done), [storedProgress])
  const [won, setWon] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const winHeadingRef = useRef<HTMLHeadingElement>(null)
  const winDialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!won) return
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    winHeadingRef.current?.focus()
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setWon(false)
      if (event.key !== 'Tab') return
      const focusable = winDialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === winHeadingRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleDialogKeys)
    return () => {
      window.removeEventListener('keydown', handleDialogKeys)
      previousFocusRef.current?.focus()
    }
  }, [won])

  function solve(id: string, sec: number) {
    if (done.has(id)) return
    const newDone = new Set([...done, id])
    saveProgress(newDone)
    const reqs = SECTION_REQS[sec]
    if (reqs.every(r => newDone.has(r))) {
      if (sec < 4) {
        setAnnouncement(isRu ? `Раздел ${sec} завершён. Раздел ${sec + 1} открыт.` : `Section ${sec} complete. Section ${sec + 1} unlocked.`)
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        setTimeout(() => {
          document.getElementById(`sec-${sec + 1}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        }, reduceMotion ? 0 : 2000)
      } else {
        setTimeout(() => setWon(true), 700)
      }
    }
  }

  const secDoneCount = Object.entries(SECTION_REQS).filter(([, reqs]) => reqs.every(r => done.has(r))).length

  function progressIcon(secNum: number): string {
    const reqs = SECTION_REQS[secNum]
    if (reqs.every(r => done.has(r))) return '⭐'
    if (unlocked.has(secNum)) return '📖'
    return '🔒'
  }


  // ── Activity 1: True/False (one at a time) ─────────────────────────────────
  const [tfIdx, setTfIdx] = useState(0)
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean | null>>({})
  const [tfFlash, setTfFlash] = useState<'correct' | 'wrong' | null>(null)

  const TF_ACTIVE = isRu ? TF_RU : TF_EN

  function answerTf(id: string, answer: boolean) {
    if (tfAnswers[id] !== undefined) return
    const q = TF_ACTIVE.find(q => q.id === id)
    if (!q) return
    const isCorrect = answer === q.correct
    setTfFlash(isCorrect ? 'correct' : 'wrong')
    if (!isCorrect) {
      setAnnouncement(isRu ? 'Пока неверно. Попробуй ещё раз.' : 'Not quite. Try again.')
      setTimeout(() => setTfFlash(null), 850)
      return
    }
    setAnnouncement(isRu ? 'Верно!' : 'Correct!')
    const next = { ...tfAnswers, [id]: answer }
    setTfAnswers(next)
    setTimeout(() => {
      setTfFlash(null)
      if (tfIdx < TF_ACTIVE.length - 1) {
        setTfIdx(i => i + 1)
      } else {
        solve('tf', 1)
      }
    }, 1000)
  }

  const tfScore = Object.entries(tfAnswers).filter(([id, ans]) => {
    const q = TF_ACTIVE.find(q => q.id === id)
    return q && ans === q.correct
  }).length

  // ── Activity 2: Grow like Jesus (sort into 4 columns) ──────────────────────
  const [sortIdx, setSortIdx] = useState(0)                       // pointer into GROW_ORDER
  const [sortPlaced, setSortPlaced] = useState<Record<GrowCat, string[]>>({
    wisdom: [], body: [], god: [], people: [],
  })
  const [sortWrongCat, setSortWrongCat] = useState<GrowCat | null>(null)
  const [sortFlash, setSortFlash] = useState(false)               // green flash on correct

  const growById = Object.fromEntries(GROW_ITEMS.map(i => [i.id, i]))
  const sortCurrent = sortIdx < GROW_ORDER.length ? growById[GROW_ORDER[sortIdx]] : null

  function sortTap(cat: GrowCat) {
    if (done.has('sort') || !sortCurrent || sortFlash || sortWrongCat) return
    if (sortCurrent.cat === cat) {
      setAnnouncement(isRu ? 'Верно!' : 'Correct!')
      setSortFlash(true)
      const itemId = sortCurrent.id
      setTimeout(() => {
        setSortPlaced(prev => ({ ...prev, [cat]: [...prev[cat], itemId] }))
        setSortFlash(false)
        const nextIdx = sortIdx + 1
        setSortIdx(nextIdx)
        if (nextIdx === GROW_ORDER.length) solve('sort', 2)
      }, 450)
    } else {
      setAnnouncement(isRu ? 'Не сюда. Попробуй другую сторону роста.' : 'Not there. Try another growth area.')
      setSortWrongCat(cat)
      setTimeout(() => setSortWrongCat(null), 550)
    }
  }

  // ── Activity 3: Flip cards ─────────────────────────────────────────────────
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  function flipCard(id: string) {
    if (done.has('flip')) return
    const next = new Set([...flipped, id])
    setFlipped(next)
    if (CARDS_EN.every(c => next.has(c.id))) solve('flip', 3)
  }

  const CARDS_ACTIVE = isRu ? CARDS_RU : CARDS_EN

  // ── Activity 4: Build the wall of living stones ────────────────────────────
  const [wallPlaced, setWallPlaced] = useState<string[]>([])      // stone ids, in placement order
  const [wallFlying, setWallFlying] = useState<string | null>(null)

  const wallComplete = wallPlaced.length === WALL_TOTAL || (done.has('wall') && wallPlaced.length === 0)
  // After a reload the placement order is gone — rebuild the wall in canonical order
  const wallEffective = done.has('wall') && wallPlaced.length === 0
    ? STONES.map(s => s.id)
    : wallPlaced

  function tapStone(id: string) {
    if (done.has('wall') || wallFlying || wallPlaced.includes(id)) return
    setWallFlying(id)
    // wallFlying blocks other taps during the flight, so the closure value is safe
    const next = [...wallPlaced, id]
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (next.length === WALL_TOTAL) {
      saveProgress(new Set([...done, 'wall']))
      setTimeout(() => setWon(true), reduceMotion ? 0 : 2220)
    }
    setTimeout(() => {
      setWallFlying(null)
      setWallPlaced(next)
    }, reduceMotion ? 0 : 420)
  }

  const stoneById = Object.fromEntries(STONES.map(s => [s.id, s]))
  const stoneLabel = (id: string) => (isRu ? stoneById[id].ru : stoneById[id].en)

  function resetAll(confirmFirst = true) {
    if (confirmFirst && !confirm(isRu ? 'Сбросить весь прогресс?' : 'Reset all progress?')) return
    removeStoredProgress()
    setWon(false)
    setAnnouncement('')
    setTfIdx(0)
    setTfAnswers({})
    setTfFlash(null)
    setSortIdx(0)
    setSortPlaced({ wisdom: [], body: [], god: [], people: [] })
    setSortWrongCat(null)
    setSortFlash(false)
    setFlipped(new Set())
    setWallPlaced([])
    setWallFlying(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ════════════════════ JSX ══════════════════════════════════════════════════
  return (
    <>
      {/* ── Animations ──────────────────────────────────────────────────── */}
      <style>{`
        @keyframes stoneFly {
          0%   { transform: translateY(0) scale(1); opacity: 1; }
          55%  { transform: translateY(-38px) scale(1.12); opacity: 1; }
          100% { transform: translateY(-90px) scale(.55); opacity: 0; }
        }
        @keyframes stoneLand {
          0%   { transform: translateY(-26px) scale(.6); opacity: 0; }
          65%  { transform: translateY(3px) scale(1.06); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes wallGlow {
          0%, 100% { box-shadow: 0 0 18px rgba(251,191,36,.35); }
          50%      { box-shadow: 0 0 42px rgba(251,191,36,.75); }
        }
        @keyframes crossRise {
          0%   { transform: translateY(24px) scale(.5); opacity: 0; }
          60%  { transform: translateY(-4px) scale(1.15); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes sortWiggle {
          0%, 100% { transform: translateX(0); }
          25%      { transform: translateX(-6px) rotate(-2deg); }
          50%      { transform: translateX(6px) rotate(2deg); }
          75%      { transform: translateX(-3px) rotate(-1deg); }
        }
        @keyframes chipPop {
          0%   { transform: scale(.4); opacity: 0; }
          65%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* ── Win Screen ──────────────────────────────────────────────────── */}
      {won && (
        <div ref={winDialogRef} role="dialog" aria-modal="true" aria-labelledby="church-win-heading" style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(20,7,2,.97)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 30, overflowY: 'auto',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🧱⛪</div>
          <h2 id="church-win-heading" ref={winHeadingRef} tabIndex={-1} style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#fdba74',
            marginBottom: 14, lineHeight: 1.3, maxWidth: 520,
          }}>
            {isRu
              ? 'Иисус до сих пор строит Свою Церковь. Каждый, кто верит в Него и следует за Ним, — один из Его живых камней.'
              : 'Jesus is still building His Church. Everyone who trusts and follows Him is one of His living stones.'}
          </h2>
          <div style={{
            fontFamily: 'var(--font-lora)', fontStyle: 'italic',
            fontSize: '0.95rem', color: 'rgba(253,186,116,.85)',
            lineHeight: 1.8, maxWidth: 500, marginBottom: 28,
            padding: '16px 20px', background: 'rgba(194,65,12,.2)',
            borderRadius: 14, border: '1.5px solid rgba(194,65,12,.4)',
          }}>
            {isRu
              ? `«${SCRIPTURE_RU.matthew28}…» — Матфея 28:19 (RST)`
              : `“${SCRIPTURE_EN.matthew28}…” — Matthew 28:19 (ESV)`}
          </div>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 800,
            fontSize: '0.9rem', color: '#fbbf24', lineHeight: 1.6,
            maxWidth: 460, marginBottom: 28,
          }}>
            {isRu
              ? '🧱 Не забудь «Вызов строителя»: вместе с родителем или надёжным взрослым прояви доброту к одному человеку, пригласи одного или молись об одном по имени на этой неделе.'
              : "🧱 Don't forget the Builder's Challenge: with a parent or trusted adult, show kindness to one person, invite one, or pray for one by name this week."}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => setWon(false)} style={{
              padding: '14px 32px',
              background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
              color: '#fff', border: 'none', borderRadius: 18,
              fontFamily: 'var(--font-nunito)', fontSize: '1rem', fontWeight: 900, cursor: 'pointer',
            }}>
              {isRu ? '← Вернуться к уроку' : '← Back to Lesson'}
            </button>
            <button
              onClick={() => resetAll(false)}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg,#fbbf24,#d97706)',
                color: '#3b2307', border: 'none', borderRadius: 18,
                fontFamily: 'var(--font-nunito)', fontSize: '1rem', fontWeight: 900, cursor: 'pointer',
              }}
            >
              {isRu ? '🔄 Пройти заново' : '🔄 Do It Again'}
            </button>
            <Link href="/lessons" style={{
              padding: '14px 32px',
              background: 'rgba(255,255,255,.08)',
              color: 'rgba(255,255,255,.8)', border: '1.5px solid rgba(255,255,255,.2)',
              borderRadius: 18, fontFamily: 'var(--font-nunito)', fontSize: '1rem',
              fontWeight: 900, cursor: 'pointer', textDecoration: 'none',
              display: 'inline-block',
            }}>
              {isRu ? 'Все уроки' : 'All Lessons'}
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '52vh',
        background: 'linear-gradient(180deg,#1c0a03,#3b1508 40%,#fdf1e7)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '64px 20px 52px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🧱⛪</div>
        <h1 style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 900,
          fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: '#fdba74',
          marginBottom: 10, lineHeight: 1.2,
        }}>
          {isRu ? 'Церковь — как строил её Иисус' : 'The Church — How Jesus Built It'}
        </h1>
        <p style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 800,
          fontSize: '0.95rem', color: 'rgba(253,186,116,.75)',
          letterSpacing: 2, textTransform: 'uppercase', marginBottom: 22,
        }}>
          {isRu ? 'Матфея 16:18' : 'Matthew 16:18'}
        </p>
        <div style={{
          fontFamily: 'var(--font-lora)', fontStyle: 'italic',
          fontSize: '1.05rem', color: 'rgba(255,255,255,.7)',
          maxWidth: 540, lineHeight: 1.75, marginBottom: 28,
        }}>
          {isRu
            ? `«${SCRIPTURE_RU.matthew16}». — Матфея 16:18 (RST)`
            : `“${SCRIPTURE_EN.matthew16}” — Matthew 16:18 (ESV)`}
        </div>
        <p style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 700,
          fontSize: '0.9rem', color: 'rgba(255,255,255,.55)',
          maxWidth: 480, lineHeight: 1.65, marginBottom: 12,
        }}>
          {isRu
            ? 'Иисус обещал Сам создать Свою Церковь. Он возрастал, созидал учеников и посылал их достигать других. Сегодня Он продолжает строить Свой народ — всех, кто верит в Него и следует за Ним.'
            : 'Jesus promised to build His Church Himself. He grew, built up disciples, and sent them to reach others. Today He continues building His people — everyone who trusts and follows Him.'}
        </p>
        <p style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 800,
          fontSize: '0.84rem', color: '#fed7aa', maxWidth: 570, lineHeight: 1.65, margin: 0,
        }}>
          {isRu
            ? '🪧 В проповеди эти три слова названы путевыми знаками, которые помогают Божьему народу помнить верный путь: ВОЗРАСТАТЬ · СОЗИДАТЬ · ДОСТИГАТЬ (Иеремия 31:21).'
            : '🪧 The sermon calls these three words road markers that help God’s people remember the faithful path: GROW · BUILD UP · REACH (Jeremiah 31:21).'}
        </p>
      </section>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div style={{
        background: ACCENT_GLOW,
        borderTop: `2px solid ${ACCENT}`,
        borderBottom: `2px solid ${ACCENT}`,
        padding: '10px 20px', textAlign: 'center',
      }}>
        <span
          role="progressbar"
          aria-label={isRu ? 'Прогресс урока' : 'Lesson progress'}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={secDoneCount}
          style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 900,
          fontSize: '0.95rem', color: ACCENT_DARK, letterSpacing: 1,
        }}>
          {isRu ? '📖 ПРОГРЕСС' : '📖 PROGRESS'}{' '}
          {[1, 2, 3, 4].map(n => progressIcon(n)).join(' ')}{' '}
          {secDoneCount}/4
        </span>
        <button onClick={() => resetAll()} style={{
          marginLeft: 16, fontFamily: 'var(--font-nunito)', fontSize: '0.7rem',
          fontWeight: 900, color: '#aaa', background: 'none', border: 'none',
          cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1,
        }}>
          {isRu ? 'сбросить' : 'reset'}
        </button>
      </div>
      <div role="status" aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
        {announcement}
      </div>

      {/* ════════════════ SECTION 1 · NOT A BUILDING ════════════════════ */}
      <section id="sec-1" style={{
        background: 'linear-gradient(180deg,#2b1207,#361809)',
        padding: '0 0 8px',
      }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
            color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '🧱 РАЗДЕЛ 1 · НЕ ЗДАНИЕ 🧱' : '🧱 SECTION 1 · NOT A BUILDING 🧱'}
          </p>
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
            color: '#fb923c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
          }}>
            {isRu ? 'Самое большое обещание' : 'The Biggest Promise'}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#fff',
            marginBottom: 20, lineHeight: 1.2,
          }}>
            {isRu ? 'Не здание' : 'Not a Building'}
          </h2>

          <p style={{
            fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
            lineHeight: 1.8, marginBottom: 16,
          }}>
            {isRu
              ? 'Когда Иисус сказал: «Я создам Церковь Мою», Он говорил не о стенах, кирпичах и крыше. Церковь, которую Он строит, — это ЛЮДИ: все, кто верит в Иисуса и следует за Ним.'
              : "When Jesus said, 'I will build my church,' He was not talking about walls, bricks, or a roof. The Church He builds is PEOPLE: everyone who trusts Jesus and follows Him."}
          </p>
          <p style={{
            fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
            lineHeight: 1.8, marginBottom: 16,
          }}>
            {isRu
              ? 'И Он дал обещание, которое не может дать ни один строитель на земле: эту стройку ничто не остановит. Ни враги, ни тьма — ни даже врата ада. То, что строит Иисус, — устоит.'
              : 'And He attached a promise that no builder on earth could ever make: nothing can stop this building. Not enemies, not darkness — not even the gates of hell. What Jesus builds, stands.'}
          </p>

          {/* Callout */}
          <div style={{
            margin: '24px 0 28px', padding: '18px 22px',
            background: 'rgba(255,255,255,.06)', borderRadius: 16,
            border: `1.5px solid ${ACCENT}`,
            borderLeft: `5px solid ${ACCENT}`,
          }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 800,
              fontSize: '0.97rem', color: '#fdba74', lineHeight: 1.7, margin: 0,
            }}>
              {isRu
                ? '💡 Главная мысль: Церковь — это не просто место, куда ходят. Это Божий народ, собранный вокруг Иисуса. И Строитель — Сам Иисус.'
                : "💡 The big idea: the Church is not merely a place you go. It is God's people gathered around Jesus. And the Builder is Jesus Himself."}
            </p>
          </div>

          <div style={{
            margin: '0 0 28px', padding: '18px 22px',
            background: 'rgba(74,222,128,.08)', borderRadius: 16,
            border: '1.5px solid rgba(74,222,128,.45)',
          }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 800,
              fontSize: '0.95rem', color: '#bbf7d0', lineHeight: 1.7, margin: 0,
            }}>
              {isRu
                ? '✝️ Благая весть: Иисус умер за наши грехи и воскрес. Мы становимся частью Его народа по Божьей благодати, когда верим в Иисуса и следуем за Ним. Рост, служение, посещение церкви и завершение этого урока не могут заслужить спасение.'
                : '✝️ The good news: Jesus died for our sins and rose again. We become part of His people by God’s grace when we trust and follow Jesus. We do not earn salvation by growing, serving, attending church, or finishing this lesson.'}
            </p>
          </div>

          {/* Verse */}
          <div style={{
            padding: '18px 22px', marginBottom: 28,
            background: 'rgba(255,255,255,.04)', borderRadius: 14,
            border: '1.5px solid rgba(255,255,255,.14)',
          }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
              color: '#fb923c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Матфея 16:18 · RST' : 'Matthew 16:18 · ESV'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontStyle: 'italic',
              fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
            }}>
              {isRu
                ? `«${SCRIPTURE_RU.matthew16}».`
                : `“${SCRIPTURE_EN.matthew16}”`}
            </p>
          </div>

          {/* ── Activity 1: True/False ────────────────────────────────── */}
          <div style={{
            background: 'rgba(255,255,255,.06)', borderRadius: 22,
            border: '1.5px solid rgba(255,255,255,.14)', padding: '22px 20px', marginTop: 8,
          }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
              color: '#fb923c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
            }}>
              {isRu ? '✅ АКТИВНОСТЬ 1 · ПРАВДА ИЛИ НЕТ?' : '✅ ACTIVITY 1 · TRUE OR NOT?'}
            </p>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 700,
              fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', marginBottom: 18,
            }}>
              {isRu
                ? 'Нажми «Правда» или «Неправда» для каждого утверждения о Церкви!'
                : 'Tap TRUE or FALSE for each statement about the Church!'}
            </p>

            {done.has('tf') ? (
              <div>
                <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#fdba74', marginBottom: 6 }}>
                    {Object.keys(tfAnswers).length > 0
                      ? (isRu
                        ? `Ты ответил на все вопросы! Счёт: ${tfScore}/5`
                        : `You answered all questions! Score: ${tfScore}/5`)
                      : (isRu ? 'Раздел пройден! Вот все ответы:' : 'Section complete! Here are all the answers:')}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 700,
                    fontSize: '0.9rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.65,
                    maxWidth: 420, margin: '0 auto',
                  }}>
                    {isRu
                      ? 'Запомни: Церковь — это люди, Строитель — Иисус, и Его стройку не остановит никто.'
                      : 'Remember: the Church is people, the Builder is Jesus, and nothing can stop what He builds.'}
                  </p>
                </div>

                {/* Answer review — every statement, its verdict, and why */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {TF_ACTIVE.map(q => (
                    <div key={q.id} style={{
                      padding: '14px 16px', borderRadius: 14,
                      background: q.correct ? 'rgba(74,222,128,.08)' : 'rgba(248,113,113,.08)',
                      border: `1.5px solid ${q.correct ? 'rgba(74,222,128,.45)' : 'rgba(248,113,113,.45)'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                        <span style={{
                          flexShrink: 0, padding: '3px 10px', borderRadius: 999,
                          background: q.correct ? 'rgba(74,222,128,.18)' : 'rgba(248,113,113,.18)',
                          color: q.correct ? '#4ade80' : '#f87171',
                          fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                        }}>
                          {q.correct ? (isRu ? '✅ ПРАВДА' : '✅ TRUE') : (isRu ? '❌ НЕПРАВДА' : '❌ FALSE')}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-nunito)', fontWeight: 700,
                          fontSize: '0.9rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.45,
                        }}>
                          {q.text}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                        fontSize: '0.85rem', color: 'rgba(255,255,255,.6)',
                        lineHeight: 1.6, margin: 0, paddingLeft: 4,
                      }}>
                        💡 {q.explain}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Progress indicator */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  {TF_ACTIVE.map((q, i) => (
                    <div key={q.id} style={{
                      flex: 1, height: 4, borderRadius: 4,
                      background: tfAnswers[q.id] !== undefined
                        ? (tfAnswers[q.id] === q.correct ? '#4ade80' : '#f87171')
                        : i === tfIdx ? ACCENT : 'rgba(255,255,255,.15)',
                      transition: 'background .3s',
                    }} />
                  ))}
                </div>

                {/* Current question */}
                {tfIdx < TF_ACTIVE.length && (
                  <div style={{
                    borderRadius: 16, padding: '20px 18px', marginBottom: 14,
                    background: tfFlash === 'correct' ? 'rgba(74,222,128,.2)'
                      : tfFlash === 'wrong' ? 'rgba(248,113,113,.2)'
                      : 'rgba(255,255,255,.05)',
                    border: `2px solid ${tfFlash === 'correct' ? '#4ade80'
                      : tfFlash === 'wrong' ? '#f87171'
                      : 'rgba(255,255,255,.14)'}`,
                    transition: 'all .25s',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-nunito)', fontWeight: 700,
                      fontSize: '0.85rem', color: '#fb923c', marginBottom: 10,
                      letterSpacing: 1, textTransform: 'uppercase',
                    }}>
                      {isRu ? `Вопрос ${tfIdx + 1} из 5` : `Question ${tfIdx + 1} of 5`}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-nunito)', fontWeight: 700,
                      fontSize: '1rem', color: '#fff', marginBottom: 18, lineHeight: 1.5,
                    }}>
                      {TF_ACTIVE[tfIdx].text}
                    </p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {([true, false] as boolean[]).map(val => (
                        <button
                          key={String(val)}
                          onClick={() => answerTf(TF_ACTIVE[tfIdx].id, val)}
                          disabled={tfFlash !== null}
                          style={{
                            flex: 1, padding: '12px 0', borderRadius: 12,
                            background: val ? 'rgba(74,222,128,.15)' : 'rgba(248,113,113,.15)',
                            border: `2px solid ${val ? '#4ade80' : '#f87171'}`,
                            color: val ? '#4ade80' : '#f87171',
                            fontFamily: 'var(--font-nunito)', fontWeight: 900,
                            fontSize: '0.95rem', cursor: tfFlash !== null ? 'default' : 'pointer',
                            opacity: tfFlash !== null ? 0.6 : 1,
                          }}
                        >
                          {val ? (isRu ? '✅ Правда' : '✅ True') : (isRu ? '❌ Неправда' : '❌ False')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 2 · GROW LIKE JESUS ═══════════════════ */}
      <section id="sec-2" style={{
        background: 'linear-gradient(180deg,#361809,#2b1207)',
        padding: '0 0 8px',
      }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
            color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '🌱 РАЗДЕЛ 2 · РАСТИ, КАК ИИСУС 🌱' : '🌱 SECTION 2 · GROW LIKE JESUS 🌱'}
          </p>
        </div>

        {!unlocked.has(2) ? (
          <LockedPlaceholder secNum={2} isRu={isRu} />
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
              color: '#fb923c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Иисус РОС' : 'Jesus GREW'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#fff',
              marginBottom: 20, lineHeight: 1.2,
            }}>
              {isRu ? 'Расти, как Иисус' : 'Grow Like Jesus'}
            </h2>

            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'Прежде чем строить Свою Церковь, Иисус Сам РОС. Библия даёт одно удивительное предложение обо всём Его детстве — Лука 2:52 — и называет четыре стороны роста: в мудрости, в теле, в любви у Бога и в любви у людей.'
                : 'Before Jesus built His Church, He GREW. The Bible gives us one amazing sentence about His whole childhood — Luke 2:52 — and it names four ways He grew: in wisdom, in body, in favor with God, and in favor with people.'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'Это и твой план роста! Строитель сначала тренируется, а потом строит. Каждый раз, когда ты учишься, отдыхаешь, молишься или любишь, — ты растёшь так, как рос Иисус.'
                : "That's your growth plan too! A builder trains before he builds. Every time you learn, rest, pray, or love, you are growing the way Jesus grew."}
            </p>

            {/* Callout */}
            <div style={{
              margin: '24px 0 28px', padding: '18px 22px',
              background: 'rgba(255,255,255,.06)', borderRadius: 16,
              border: `1.5px solid ${ACCENT}`,
              borderLeft: `5px solid ${ACCENT}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 800,
                fontSize: '0.97rem', color: '#fdba74', lineHeight: 1.7, margin: 0,
              }}>
                {isRu
                  ? '💡 Расти — это не только становиться выше. Иисус рос сразу в ЧЕТЫРЁХ направлениях: ум, тело, Бог, люди. Проповедник напомнил: мудрость — не просто много знать, а применять истину в жизни. Знание должно становиться верным поступком.'
                  : '💡 Growing is not only about getting taller. Jesus grew in FOUR directions: mind, body, God, and people. The preacher reminded us that wisdom is not merely knowing a lot; it is using truth in real life. Knowledge should become faithful action.'}
              </p>
            </div>

            {/* Verse */}
            <div style={{
              padding: '18px 22px', marginBottom: 28,
              background: 'rgba(255,255,255,.04)', borderRadius: 14,
              border: '1.5px solid rgba(255,255,255,.14)',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: '#fb923c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
              }}>
                {isRu ? 'Луки 2:52 · RST' : 'Luke 2:52 · ESV'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
              }}>
                {isRu
                  ? `«${SCRIPTURE_RU.luke2}»`
                  : `“${SCRIPTURE_EN.luke2}”`}
              </p>
            </div>

            {/* ── Activity 2: Sort into 4 growth areas ─────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,.06)', borderRadius: 22,
              border: '1.5px solid rgba(255,255,255,.14)', padding: '22px 20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: '#fb923c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '🌱 АКТИВНОСТЬ 2 · ЧЕТЫРЕ СТОРОНЫ РОСТА' : '🌱 ACTIVITY 2 · FOUR WAYS TO GROW'}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', marginBottom: 18,
              }}>
                {isRu
                  ? 'Прочитай карточку и нажми, В КАКОЙ стороне роста ей место!'
                  : 'Read the card, then tap WHICH growth area it belongs to!'}
              </p>

              {done.has('sort') ? (
                <div>
                  <div style={{ textAlign: 'center', padding: '4px 0 16px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#fdba74', margin: 0 }}>
                      {isRu
                        ? 'Отлично! Вот все четыре стороны роста — как у Иисуса:'
                        : 'Great job! Here are all four growth areas — just like Jesus:'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {GROW_CATS.map(cat => (
                      <div key={cat.id} style={{
                        flex: '1 1 45%', minWidth: 200, padding: '14px 14px',
                        borderRadius: 14, background: ACCENT_GLOW,
                        border: `2px solid ${ACCENT}`,
                      }}>
                        <p style={{
                          fontFamily: 'var(--font-nunito)', fontWeight: 900,
                          fontSize: '0.9rem', color: '#fdba74', margin: '0 0 10px',
                          textAlign: 'center',
                        }}>
                          {cat.emoji} {isRu ? cat.ru : cat.en}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {GROW_ITEMS.filter(i => i.cat === cat.id).map(item => (
                            <div key={item.id} style={{
                              padding: '8px 12px', borderRadius: 10,
                              background: 'rgba(74,222,128,.1)',
                              border: '1.5px solid rgba(74,222,128,.4)',
                              fontFamily: 'var(--font-nunito)', fontWeight: 700,
                              fontSize: '0.82rem', color: 'rgba(255,255,255,.85)',
                              lineHeight: 1.4,
                            }}>
                              ✅ {isRu ? item.ru : item.en}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress dots */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                    {GROW_ORDER.map((id, i) => (
                      <div key={id} style={{
                        flex: 1, height: 4, borderRadius: 4,
                        background: i < sortIdx ? '#4ade80' : i === sortIdx ? ACCENT : 'rgba(255,255,255,.15)',
                        transition: 'background .3s',
                      }} />
                    ))}
                  </div>

                  {/* Current item */}
                  {sortCurrent && (
                    <div style={{
                      borderRadius: 16, padding: '18px 16px', marginBottom: 14,
                      background: sortFlash ? 'rgba(74,222,128,.2)' : 'rgba(255,255,255,.05)',
                      border: `2px solid ${sortFlash ? '#4ade80' : 'rgba(255,255,255,.14)'}`,
                      transition: 'all .25s', textAlign: 'center',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-nunito)', fontWeight: 700,
                        fontSize: '0.8rem', color: '#fb923c', marginBottom: 8,
                        letterSpacing: 1, textTransform: 'uppercase',
                      }}>
                        {isRu ? `Карточка ${sortIdx + 1} из ${GROW_ORDER.length}` : `Card ${sortIdx + 1} of ${GROW_ORDER.length}`}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-nunito)', fontWeight: 900,
                        fontSize: '1.05rem', color: '#fff', margin: 0, lineHeight: 1.5,
                      }}>
                        {isRu ? sortCurrent.ru : sortCurrent.en}
                      </p>
                    </div>
                  )}

                  {/* 4 category buttons */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                    {GROW_CATS.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => sortTap(cat.id)}
                        style={{
                          flex: '1 1 42%', minWidth: 130, minHeight: 54,
                          padding: '12px 10px', borderRadius: 14,
                          background: sortWrongCat === cat.id ? 'rgba(248,113,113,.2)' : 'rgba(255,255,255,.07)',
                          border: `2px solid ${sortWrongCat === cat.id ? '#f87171' : ACCENT}`,
                          color: sortWrongCat === cat.id ? '#f87171' : '#fdba74',
                          fontFamily: 'var(--font-nunito)', fontWeight: 900,
                          fontSize: '0.95rem', cursor: 'pointer',
                          animation: sortWrongCat === cat.id ? 'sortWiggle .5s ease' : undefined,
                          transition: 'all .2s',
                        }}
                      >
                        {cat.emoji} {isRu ? cat.ru : cat.en}
                      </button>
                    ))}
                  </div>
                  {sortWrongCat && (
                    <p style={{
                      textAlign: 'center', color: '#f87171',
                      fontFamily: 'var(--font-nunito)', fontWeight: 900,
                      margin: '-6px 0 14px', fontSize: '0.88rem',
                    }}>
                      {isRu ? 'Хм, не сюда — попробуй другую сторону роста!' : 'Hmm, not there — try another growth area!'}
                    </p>
                  )}

                  {/* Live columns filling up */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {GROW_CATS.map(cat => (
                      <div key={cat.id} style={{
                        flex: '1 1 45%', minWidth: 150, padding: '10px 10px',
                        borderRadius: 12, background: 'rgba(255,255,255,.04)',
                        border: '1.5px dashed rgba(255,255,255,.2)',
                      }}>
                        <p style={{
                          fontFamily: 'var(--font-nunito)', fontWeight: 900,
                          fontSize: '0.78rem', color: 'rgba(255,255,255,.6)',
                          margin: '0 0 6px', textAlign: 'center',
                        }}>
                          {cat.emoji} {isRu ? cat.ru : cat.en} · {sortPlaced[cat.id].length}/2
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {sortPlaced[cat.id].map(itemId => (
                            <div key={itemId} style={{
                              padding: '6px 10px', borderRadius: 8,
                              background: 'rgba(74,222,128,.12)',
                              border: '1.5px solid rgba(74,222,128,.4)',
                              fontFamily: 'var(--font-nunito)', fontWeight: 700,
                              fontSize: '0.76rem', color: 'rgba(255,255,255,.8)',
                              lineHeight: 1.35,
                              animation: 'chipPop .35s ease',
                            }}>
                              {isRu ? growById[itemId].ru : growById[itemId].en}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 3 · BUILD LIKE JESUS ══════════════════ */}
      <section id="sec-3" style={{
        background: 'linear-gradient(180deg,#2b1207,#361809)',
        padding: '0 0 8px',
      }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
            color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '🛠️ РАЗДЕЛ 3 · СТРОЙ, КАК ИИСУС 🛠️' : '🛠️ SECTION 3 · BUILD LIKE JESUS 🛠️'}
          </p>
        </div>

        {!unlocked.has(3) ? (
          <LockedPlaceholder secNum={3} isRu={isRu} />
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
              color: '#fb923c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Иисус СТРОИЛ' : 'Jesus BUILT'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#fff',
              marginBottom: 20, lineHeight: 1.2,
            }}>
              {isRu ? 'Строй, как Иисус' : 'Build Like Jesus'}
            </h2>

            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'Иисус вырос — и начал строить. Но Он не нанимал рабочих и не покупал кирпичи. Он шёл вдоль озера и звал рыбаков по имени. Его строительный материал — всегда люди, а Его способ строить — любовь.'
                : 'Jesus grew up — and then He started building. But He did not hire workers or buy bricks. He walked along a lake and called fishermen by name. His building material was always people, and His building method was love.'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'Открой каждую карточку и узнай три способа, которыми Иисус созидал учеников: отношения, пример и служение.'
                : 'Flip each card to discover three ways Jesus built up His disciples: relationships, example, and ministry.'}
            </p>

            {/* Callout */}
            <div style={{
              margin: '24px 0 28px', padding: '18px 22px',
              background: 'rgba(255,255,255,.06)', borderRadius: 16,
              border: `1.5px solid ${ACCENT}`,
              borderLeft: `5px solid ${ACCENT}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 800,
                fontSize: '0.97rem', color: '#fdba74', lineHeight: 1.7, margin: 0,
              }}>
                {isRu
                  ? '💡 Иисус собирал людей и строил отношения, показывал пример делом и словом, а затем поручал служение и посылал учеников.'
                  : '💡 Jesus gathered people and built relationships, showed an example in deed and word, then assigned ministry and sent disciples.'}
              </p>
            </div>

            {/* ── Activity 3: Flip Cards ────────────────────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,.06)', borderRadius: 22,
              border: '1.5px solid rgba(255,255,255,.14)', padding: '22px 20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: '#fb923c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '🃏 АКТИВНОСТЬ 3 · ИНСТРУМЕНТЫ СТРОИТЕЛЯ' : "🃏 ACTIVITY 3 · THE BUILDER'S TOOLS"}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', marginBottom: 18,
              }}>
                {isRu
                  ? 'Нажми на каждую карточку и узнай, КАК Иисус строил Свою команду!'
                  : 'Tap each card to discover HOW Jesus built His team!'}
              </p>

              {done.has('flip') && (
                <div style={{ textAlign: 'center', padding: '4px 0 18px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#fdba74', margin: 0 }}>
                    {isRu
                      ? 'Ты нашёл все три способа! Перечитай их ниже.'
                      : 'You found all three methods! Read them again below.'}
                  </p>
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
                {CARDS_ACTIVE.map(c => {
                  const isFlipped = done.has('flip') || flipped.has(c.id)
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => !isFlipped && flipCard(c.id)}
                      aria-expanded={isFlipped}
                      aria-label={isFlipped ? `${c.name}: ${c.back}` : `${c.name}. ${isRu ? 'Открыть карточку' : 'Reveal card'}`}
                      style={{
                        flex: '1 1 180px', maxWidth: 240,
                        minHeight: 230, perspective: '700px',
                        cursor: isFlipped ? 'default' : 'pointer', userSelect: 'none',
                        appearance: 'none', padding: 0, background: 'none', border: 'none', color: 'inherit',
                      }}
                    >
                      <div style={{
                        position: 'relative', width: '100%', height: '100%', minHeight: 230,
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.55s ease',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}>
                        {/* Front */}
                        <div aria-hidden={isFlipped} style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                          borderRadius: 18, padding: '18px 14px',
                          background: 'rgba(255,255,255,.07)',
                          border: '2px solid rgba(255,255,255,.18)',
                          textAlign: 'center',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{c.emoji}</div>
                          <div style={{
                            fontFamily: 'var(--font-nunito)', fontWeight: 900,
                            fontSize: '0.95rem', color: '#fdba74', marginBottom: 6,
                          }}>
                            {c.name}
                          </div>
                          <div style={{
                            fontFamily: 'var(--font-nunito)', fontWeight: 700,
                            fontSize: '0.78rem', color: 'rgba(255,255,255,.5)', marginBottom: 10,
                          }}>
                            {c.role}
                          </div>
                          <div style={{
                            fontFamily: 'var(--font-nunito)', fontSize: '0.65rem',
                            fontWeight: 900, letterSpacing: 1, color: 'rgba(255,255,255,.3)',
                            textTransform: 'uppercase',
                          }}>
                            {isRu ? 'Нажми ▾' : 'Tap ▾'}
                          </div>
                        </div>
                        {/* Back */}
                        <div aria-hidden={!isFlipped} style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          borderRadius: 18, padding: '16px 13px',
                          background: ACCENT_GLOW,
                          border: `2px solid ${ACCENT}`,
                          textAlign: 'center',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{ fontSize: '1.3rem', marginBottom: 5 }}>{c.emoji}</div>
                          <div style={{
                            fontFamily: 'var(--font-nunito)', fontWeight: 900,
                            fontSize: '0.85rem', color: '#fdba74', marginBottom: 8,
                          }}>
                            {c.name}
                          </div>
                          <p style={{
                            fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                            fontSize: '0.8rem', color: 'rgba(255,255,255,.85)',
                            lineHeight: 1.55, margin: 0,
                          }}>
                            {c.back}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              {!done.has('flip') && (
                <p style={{
                  fontFamily: 'var(--font-nunito)', fontWeight: 700,
                  fontSize: '0.82rem', color: 'rgba(255,255,255,.45)',
                  textAlign: 'center', marginTop: 14,
                }}>
                  {isRu
                    ? `Открыто: ${flipped.size} из ${CARDS_ACTIVE.length}`
                    : `Revealed: ${flipped.size} of ${CARDS_ACTIVE.length}`}
                </p>
              )}
            </div>

            {/* Verse */}
            <div style={{
              padding: '18px 22px', marginTop: 24,
              background: 'rgba(255,255,255,.04)', borderRadius: 14,
              border: '1.5px solid rgba(255,255,255,.14)',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: '#fb923c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
              }}>
                {isRu ? 'Марка 3:14 · RST' : 'Mark 3:14 · ESV'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
              }}>
                {isRu
                  ? `«${SCRIPTURE_RU.mark3}»`
                  : `“${SCRIPTURE_EN.mark3}”`}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 4 · REACH: BUILD THE WALL ═════════════ */}
      {/* Light background from the start — the section's text colors are dark,
          so a tall dark→light gradient would swallow the heading at the top */}
      <section id="sec-4" style={{
        background: 'linear-gradient(180deg,#f5e3d3,#fdf1e7)',
        padding: '0 0 8px',
      }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
            color: '#fff', margin: 0, letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '⛪ РАЗДЕЛ 4 · ДОСТИГАЙ: ПОСТРОЙ СТЕНУ ⛪' : '⛪ SECTION 4 · REACH: BUILD THE WALL ⛪'}
          </p>
        </div>

        {!unlocked.has(4) ? (
          <LockedPlaceholder secNum={4} light isRu={isRu} />
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
              color: ACCENT_DARK, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Иисус ДОСТИГАЛ' : 'Jesus REACHED'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: ACCENT_DARK,
              marginBottom: 20, lineHeight: 1.2,
            }}>
              {isRu ? 'Многие, один и новые' : 'The Many, the One, and the New'}
            </h2>

            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: '#5c2a10',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'Иисус достигал МНОГИХ: Он проповедовал большим толпам на склонах холмов и у моря. Он также встречался с ОДНИМ человеком лично: с женщиной у колодца, с Закхеем и со страдавшим человеком за озером, которого другие боялись, а Иисус освободил.'
                : 'Jesus reached the MANY: He preached to large crowds on hillsides and by the sea. He also met the ONE personally: the woman at the well, Zacchaeus, and a suffering man across the lake whom others feared but Jesus set free.'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: '#5c2a10',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'И Он достигал НОВЫХ через подготовленных учеников: Иисус послал их нести Евангелие за пределы мест Его земного служения. Ученик учил ученика, друг рассказывал другу — и так добрая весть дошла до нас.'
                : 'And He reached the NEW through prepared disciples: Jesus sent them to carry the Gospel beyond the places of His earthly ministry. Disciple taught disciple, friend told friend—and that is how the good news reached us.'}
            </p>

            <div style={{
              margin: '8px 0 24px', padding: '16px 20px', background: '#fff7ed',
              borderRadius: 14, border: '1.5px solid #ea580c', color: '#7c2d12',
            }}>
              <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, margin: '0 0 8px' }}>
                {isRu ? 'Три вопроса из проповеди:' : 'The sermon’s three questions:'}
              </p>
              <p style={{ fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.75, margin: 0 }}>
                {isRu
                  ? 'В чём я возрастаю? Кого я созидаю? Кого я достигаю? Для каждого верующего это ответственность и возможность подражать Иисусу.'
                  : 'What am I growing in? Whom am I building up? Whom am I reaching? For every believer, this is a responsibility and an opportunity to imitate Jesus.'}
              </p>
            </div>

            {/* Callout */}
            <div style={{
              margin: '24px 0 28px', padding: '18px 22px',
              background: 'rgba(194,65,12,.08)', borderRadius: 16,
              border: `1.5px solid ${ACCENT}`,
              borderLeft: `5px solid ${ACCENT}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 800,
                fontSize: '0.97rem', color: ACCENT_DARK, lineHeight: 1.7, margin: 0,
              }}>
                {isRu
                  ? '💡 Каждый камень — человек, которого Иисус достигает и зовёт верить в Него и следовать за Ним. Один камень задаёт вопрос лично тебе.'
                  : '💡 Every stone is someone Jesus reaches and calls to trust and follow Him. One stone asks the question personally of you.'}
              </p>
            </div>

            {/* ── Activity 4: Living stones wall builder ───────────────── */}
            <div style={{
              background: 'rgba(255,255,255,.7)', borderRadius: 22,
              border: `1.5px solid ${ACCENT}`, padding: '22px 20px', marginBottom: 28,
              boxShadow: `0 4px 20px ${ACCENT_GLOW}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: ACCENT_DARK, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '🧱 АКТИВНОСТЬ 4 · СТЕНА ИЗ ЖИВЫХ КАМНЕЙ' : '🧱 ACTIVITY 4 · THE WALL OF LIVING STONES'}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.95rem', color: ACCENT_DARK, marginBottom: 18,
              }}>
                {isRu
                  ? 'Нажимай на камни внизу — каждый ляжет в стену. Здесь нет неправильных ответов: Церковь строится из ЛЮДЕЙ, камень за камнем!'
                  : 'Tap the stones below — each one flies into the wall. There are no wrong answers here: the Church is built out of PEOPLE, one stone at a time!'}
              </p>

              {/* Cross + light when complete */}
              {wallComplete && (
                <div style={{
                  textAlign: 'center', marginBottom: 8,
                  animation: 'crossRise .9s ease',
                }}>
                  <span style={{
                    fontSize: '2.6rem', display: 'inline-block',
                    filter: 'drop-shadow(0 0 14px rgba(251,191,36,.9))',
                  }}>
                    ✝️
                  </span>
                </div>
              )}

              {/* The wall */}
              <div style={{
                padding: '18px 12px 14px', borderRadius: 18, marginBottom: 16,
                background: 'linear-gradient(180deg,#fde8d2,#f7d9bd)',
                border: `2px solid ${ACCENT_DARK}`,
                animation: wallComplete ? 'wallGlow 2.2s ease-in-out infinite' : undefined,
                transition: 'box-shadow .4s',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxWidth: 560, margin: '0 auto' }}>
                  {WALL_ROWS.map((rowSlots, rowIdx) => (
                    <div key={rowIdx} style={{
                      display: 'flex', gap: 7,
                      // Brickwork offset: 2-stone rows sit inset from the edges
                      padding: rowSlots.length === 2 ? '0 12%' : '0',
                    }}>
                      {rowSlots.map(slotIdx => {
                        const stoneId = wallEffective[slotIdx]
                        const filled = stoneId !== undefined
                        const isNewest = !done.has('wall') && filled && slotIdx === wallEffective.length - 1
                        const isYou = stoneId === 'you'
                        return (
                          <div key={slotIdx} style={{
                            flex: 1, minHeight: 54,
                            borderRadius: 9,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            padding: '6px 4px', textAlign: 'center',
                            background: filled
                              ? isYou
                                ? 'linear-gradient(135deg,#fbbf24,#d97706)'
                                : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`
                              : 'rgba(124,45,18,.06)',
                            border: filled
                              ? isYou ? '2px solid #fde68a' : '2px solid #431407'
                              : '2px dashed rgba(124,45,18,.35)',
                            boxShadow: isYou ? '0 0 16px rgba(251,191,36,.75)' : undefined,
                            animation: isNewest ? 'stoneLand .45s ease' : undefined,
                          }}>
                            {filled ? (
                              <>
                                <span style={{ fontSize: '1.05rem', lineHeight: 1.2 }}>{stoneById[stoneId].emoji}</span>
                                <span style={{
                                  fontFamily: 'var(--font-nunito)', fontWeight: 900,
                                  fontSize: '0.62rem', color: isYou ? '#431407' : '#ffedd5', lineHeight: 1.25,
                                }}>
                                  {stoneLabel(stoneId)}
                                </span>
                              </>
                            ) : (
                              <span style={{
                                fontFamily: 'var(--font-nunito)', fontWeight: 900,
                                fontSize: '0.85rem', color: 'rgba(124,45,18,.3)',
                              }}>
                                ▫
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {wallComplete ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 900,
                    color: ACCENT_DARK, fontSize: '1.05rem', marginBottom: 14,
                  }}>
                    {isRu ? '🎉 Стена построена! Церковь стоит!' : '🎉 The wall is built! The Church stands!'}
                  </p>
                  <div style={{
                    fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                    fontSize: '1rem', color: ACCENT_DARK, padding: '14px 18px',
                    background: ACCENT_GLOW, borderRadius: 12,
                    border: `1.5px solid ${ACCENT}`, marginBottom: 14,
                  }}>
                    {isRu
                      ? `«${SCRIPTURE_RU.peter2}». — 1 Петра 2:5 (RST)`
                      : `“${SCRIPTURE_EN.peter2}.” — 1 Peter 2:5 (ESV)`}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 800,
                    fontSize: '0.92rem', color: '#5c2a10', lineHeight: 1.65,
                    maxWidth: 520, margin: '0 auto',
                  }}>
                    {isRu
                      ? 'Посмотри на стену — многие, один человек, новые… и место для ТЕБЯ. Иисус и сегодня строит Свою Церковь. Когда ты веришь в Него и следуешь за Ним, Он соединяет тебя со Своим народом.'
                      : 'Look at the wall — the many, the one, the new… and a place for YOU. Jesus is still building His Church today. When you trust and follow Him, He joins you to His people.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Stone pool */}
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 900,
                    fontSize: '0.72rem', color: ACCENT_DARK, letterSpacing: 2,
                    textTransform: 'uppercase', marginBottom: 10, textAlign: 'center',
                  }}>
                    {isRu ? '👇 Живые камни — нажми, чтобы положить в стену' : '👇 Living stones — tap to lay them in the wall'}
                  </p>
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    {STONES.filter(s => !wallPlaced.includes(s.id)).map(s => (
                      <button
                        key={s.id}
                        onClick={() => tapStone(s.id)}
                        style={{
                          minHeight: 48, padding: '10px 14px', borderRadius: 10,
                          background: wallFlying === s.id
                            ? `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`
                            : 'linear-gradient(135deg,#efdcc7,#e2c6a8)',
                          border: `2px solid ${wallFlying === s.id ? '#431407' : ACCENT}`,
                          color: wallFlying === s.id ? '#ffedd5' : ACCENT_DARK,
                          fontFamily: 'var(--font-nunito)', fontWeight: 900,
                          fontSize: '0.85rem', cursor: wallFlying ? 'default' : 'pointer',
                          userSelect: 'none',
                          animation: wallFlying === s.id ? 'stoneFly .42s ease forwards' : undefined,
                        }}
                      >
                        {s.emoji} {isRu ? s.ru : s.en}
                      </button>
                    ))}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 700,
                    fontSize: '0.82rem', color: 'rgba(124,45,18,.7)',
                    textAlign: 'center', margin: 0,
                  }}>
                    {isRu
                      ? `Положено камней: ${wallPlaced.length} из ${WALL_TOTAL}`
                      : `Stones laid: ${wallPlaced.length} of ${WALL_TOTAL}`}
                  </p>
                </>
              )}
            </div>

            {/* ── The Builder's Challenge: this week's call to action ───── */}
            {wallComplete && (
              <div style={{
                padding: '24px 22px', marginBottom: 28,
                background: 'linear-gradient(135deg,#fbbf2418,#f9731618)', borderRadius: 18,
                border: '2px solid #d97706',
              }}>
                <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 8 }}>🧱</div>
                <p style={{
                  fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
                  color: '#b45309', letterSpacing: 2, textTransform: 'uppercase',
                  textAlign: 'center', marginBottom: 10,
                }}>
                  {isRu ? 'Задание на неделю · Вызов строителя' : "This Week's Mission · The Builder's Challenge"}
                </p>
                <p style={{
                  fontFamily: 'var(--font-lora)', fontSize: '0.98rem', color: '#78350f',
                  lineHeight: 1.7, marginBottom: 14, textAlign: 'center',
                }}>
                  {isRu
                    ? 'Иисус достигал многих, одного и новых. На этой неделе будь строителем:'
                    : 'Jesus reached the many, the one, and the new. This week, be a builder:'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {(isRu ? [
                    ['🙋', 'Вместе с родителем, учителем или надёжным взрослым прояви доброту к тому, кто остался один'],
                    ['🏠', 'Спроси родителя или опекуна, прежде чем приглашать друга в церковь или детский клуб'],
                    ['🙏', 'Молись: выбери одного человека и молись о нём по имени каждый день на этой неделе'],
                  ] : [
                    ['🙋', 'With a parent, teacher, or trusted adult, be kind to a kid who is left out'],
                    ['🏠', "Ask your parent or guardian before inviting a friend to church or kids' club"],
                    ['🙏', 'Pray: pick one person and pray for them by name every day this week'],
                  ]).map(([icon, text]) => (
                    <div key={text} style={{
                      display: 'flex', gap: 10, alignItems: 'center',
                      padding: '10px 14px', borderRadius: 12,
                      background: 'rgba(255,255,255,.65)', border: '1.5px solid rgba(217,119,6,.35)',
                    }}>
                      <span style={{ fontSize: '1.15rem' }}>{icon}</span>
                      <span style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.88rem', color: '#78350f', lineHeight: 1.45 }}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
                <p style={{
                  fontFamily: 'var(--font-nunito)', fontWeight: 800,
                  fontSize: '0.85rem', color: '#b45309',
                  lineHeight: 1.6, textAlign: 'center', margin: 0,
                }}>
                  {isRu
                    ? 'Помни: строителям не нужны аплодисменты. Иисус видит каждый верный шаг.'
                    : "Remember: builders don't need applause. Jesus sees every faithful step."}
                </p>
              </div>
            )}

            {/* Final verse */}
            <div style={{
              padding: '22px', marginBottom: 28,
              background: ACCENT_GLOW, borderRadius: 16,
              border: `2px solid ${ACCENT}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: ACCENT_DARK, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10,
              }}>
                {isRu ? 'Матфея 28:19 · RST' : 'Matthew 28:19 · ESV'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: ACCENT_DARK, lineHeight: 1.8, margin: 0,
              }}>
                {isRu
                  ? `«${SCRIPTURE_RU.matthew28}…»`
                  : `“${SCRIPTURE_EN.matthew28}…”`}
              </p>
              <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '0.78rem', color: ACCENT_DARK, lineHeight: 1.7, margin: '14px 0 0' }}>
                {isRu ? 'Проверенные места Писания: ' : 'Verified Scripture: '}
                {(isRu ? SCRIPTURE_LINKS.ru : SCRIPTURE_LINKS.en).map(([label, url], index, links) => (
                  <span key={url}>
                    <a href={url} target="_blank" rel="noreferrer" style={{ color: ACCENT_DARK, fontWeight: 800 }}>{label}</a>
                    {index < links.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── Back link ────────────────────────────────────────────────────── */}
      <section style={{
        background: '#fdf1e7', padding: '28px 20px', textAlign: 'center',
        borderTop: `2px solid ${ACCENT}`,
      }}>
        <Link href="/lessons" style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 800,
          color: ACCENT_DARK, textDecoration: 'none', fontSize: '1rem',
        }}>
          ← {isRu ? 'Все уроки' : 'All Lessons'}
        </Link>
      </section>
    </>
  )
}
