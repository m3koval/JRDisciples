'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// ─── Theme ────────────────────────────────────────────────────────────────────
// Warm brick & stone — Jesus the Builder
const ACCENT      = '#c2410c'
const ACCENT_DARK = '#7c2d12'
const ACCENT_GLOW = 'rgba(194,65,12,.15)'

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
    explain: 'The Church is people — everyone who loves and follows Jesus. A building is just where the Church meets!',
  },
  {
    id: 'q2',
    text: "Jesus said 'I will build My Church' — He is the builder.",
    correct: true,
    explain: "Matthew 16:18. It's His project, His Church, His promise. We get to be part of it.",
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
    explain: 'Jesus Himself started it, chose it, and builds it. It was His plan from the beginning.',
  },
  {
    id: 'q5',
    text: 'Kids are too young to be part of the Church Jesus is building.',
    correct: false,
    explain: "Jesus said 'Let the little children come to me.' You are a real part of His Church right now — not someday.",
  },
]

const TF_RU = [
  {
    id: 'q1',
    text: 'Церковь, которую строит Иисус, — это здание из кирпичей и камня.',
    correct: false,
    explain: 'Церковь — это люди: все, кто любит Иисуса и идёт за Ним. Здание — лишь место, где Церковь собирается!',
  },
  {
    id: 'q2',
    text: 'Иисус сказал: «Я создам Церковь Мою» — строитель именно Он.',
    correct: true,
    explain: 'Матф. 16:18. Это Его проект, Его Церковь, Его обещание. А нам дано быть её частью.',
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
    explain: 'Иисус Сам начал её, Сам избрал и Сам строит. Это был Его план с самого начала.',
  },
  {
    id: 'q5',
    text: 'Дети слишком малы, чтобы быть частью Церкви, которую строит Иисус.',
    correct: false,
    explain: 'Иисус сказал: «Пустите детей приходить ко Мне». Ты — настоящая часть Его Церкви уже сейчас, а не когда-нибудь потом.',
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
    role: 'Friendship first',
    back: "Jesus didn't wait for people to find Him. He walked up to fishermen and tax collectors and said 'Follow Me.' He built friendships first — the Church began as friends around Jesus.",
  },
  {
    id: 'show',
    emoji: '👣',
    name: 'He Showed',
    role: 'Deed and word',
    back: "Jesus didn't just talk. He washed feet, fed the hungry, forgave enemies — and THEN said 'do as I have done.' He taught by deed and word.",
  },
  {
    id: 'send',
    emoji: '📨',
    name: 'He Sent',
    role: 'Real jobs for real friends',
    back: "Jesus gave His friends real jobs: 'Go, preach, heal.' He trusted them with His mission even before they were perfect. He still gives real jobs to His people — including you.",
  },
  {
    id: 'pray',
    emoji: '🙏',
    name: 'He Prayed',
    role: 'All night with the Father',
    back: 'Before choosing the twelve, Jesus prayed all night. He built His Church on His knees first. Every strong thing He built started with talking to the Father.',
  },
]

const CARDS_RU = [
  {
    id: 'gather',
    emoji: '🤝',
    name: 'Он собирал',
    role: 'Сначала дружба',
    back: 'Иисус не ждал, пока люди Его найдут. Он Сам подходил к рыбакам и сборщикам налогов и говорил: «Иди за Мной». Сначала Он строил дружбу — Церковь началась как друзья рядом с Иисусом.',
  },
  {
    id: 'show',
    emoji: '👣',
    name: 'Он показывал',
    role: 'Дело и слово',
    back: 'Иисус не просто говорил. Он умывал ноги, кормил голодных, прощал врагов — и ТОЛЬКО ПОТОМ сказал: «делайте, как Я сделал вам». Он учил делом и словом.',
  },
  {
    id: 'send',
    emoji: '📨',
    name: 'Он посылал',
    role: 'Настоящие поручения',
    back: 'Иисус давал Своим друзьям настоящие поручения: «Идите, проповедуйте, исцеляйте». Он доверил им Своё дело ещё до того, как они стали совершенными. Он и сегодня даёт настоящие поручения Своим людям — и тебе тоже.',
  },
  {
    id: 'pray',
    emoji: '🙏',
    name: 'Он молился',
    role: 'Всю ночь с Отцом',
    back: 'Прежде чем избрать двенадцать, Иисус молился всю ночь. Сначала Он строил Свою Церковь на коленях. Всё крепкое, что Он строил, начиналось с разговора с Отцом.',
  },
]

// ─── Living stones wall data ──────────────────────────────────────────────────
const STONES: { id: string; emoji: string; en: string; ru: string }[] = [
  { id: 'crowds',     emoji: '👥', en: 'The crowds on the hill',  ru: 'Толпы на холме' },
  { id: 'zacchaeus',  emoji: '🌳', en: 'Zacchaeus in the tree',   ru: 'Закхей на дереве' },
  { id: 'well',       emoji: '🏺', en: 'The woman at the well',   ru: 'Женщина у колодца' },
  { id: 'bartimaeus', emoji: '👁️', en: 'Blind Bartimaeus',        ru: 'Слепой Вартимей' },
  { id: 'twelve',     emoji: '🎣', en: 'The twelve disciples',    ru: 'Двенадцать учеников' },
  { id: 'pastor',     emoji: '📖', en: 'Your pastor',             ru: 'Твой пастор' },
  { id: 'parents',    emoji: '🏠', en: 'Your parents',            ru: 'Твои родители' },
  { id: 'missionary', emoji: '✈️', en: 'A missionary far away',   ru: 'Миссионер в далёкой стране' },
  { id: 'friend',     emoji: '🎒', en: 'Your friend at school',   ru: 'Твой друг в школе' },
  { id: 'you',        emoji: '⭐', en: 'YOU',                     ru: 'ТЫ' },
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function JesusBuildsHisChurchPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  // ── Progress ───────────────────────────────────────────────────────────────
  const [unlocked, setUnlocked] = useState<Set<number>>(() => {
    try {
      const u = typeof window !== 'undefined' && localStorage.getItem('church-build_unlocked')
      if (u) return new Set(JSON.parse(u) as number[])
    } catch { /* ignore */ }
    return new Set([1])
  })
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      const d = typeof window !== 'undefined' && localStorage.getItem('church-build_done')
      if (d) return new Set(JSON.parse(d) as string[])
    } catch { /* ignore */ }
    return new Set()
  })
  const [won, setWon] = useState(false)

  useEffect(() => {
    localStorage.setItem('church-build_unlocked', JSON.stringify([...unlocked]))
    localStorage.setItem('church-build_done',     JSON.stringify([...done]))
  }, [unlocked, done])

  function solve(id: string, sec: number) {
    if (done.has(id)) return
    const newDone = new Set([...done, id])
    setDone(newDone)
    const reqs = SECTION_REQS[sec]
    if (reqs.every(r => newDone.has(r))) {
      if (sec < 4) {
        setUnlocked(prev => new Set([...prev, sec + 1]))
        setTimeout(() => {
          document.getElementById(`sec-${sec + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 2000)
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

  function resetAll() {
    if (!confirm(isRu ? 'Сбросить весь прогресс?' : 'Reset all progress?')) return
    localStorage.removeItem('church-build_unlocked')
    localStorage.removeItem('church-build_done')
    window.location.reload()
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

  const wallComplete = done.has('wall') || wallPlaced.length === WALL_TOTAL
  // After a reload the placement order is gone — rebuild the wall in canonical order
  const wallEffective = done.has('wall') && wallPlaced.length < WALL_TOTAL
    ? STONES.map(s => s.id)
    : wallPlaced

  function tapStone(id: string) {
    if (done.has('wall') || wallFlying || wallPlaced.includes(id)) return
    setWallFlying(id)
    // wallFlying blocks other taps during the flight, so the closure value is safe
    const next = [...wallPlaced, id]
    setTimeout(() => {
      setWallFlying(null)
      setWallPlaced(next)
      if (next.length === WALL_TOTAL) {
        // Let the glow + cross celebration breathe before the win screen
        setTimeout(() => solve('wall', 4), 1800)
      }
    }, 420)
  }

  const stoneById = Object.fromEntries(STONES.map(s => [s.id, s]))
  const stoneLabel = (id: string) => (isRu ? stoneById[id].ru : stoneById[id].en)

  // ── Locked section placeholder ─────────────────────────────────────────────
  function LockedPlaceholder({ secNum, light }: { secNum: number; light?: boolean }) {
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
      `}</style>

      {/* ── Win Screen ──────────────────────────────────────────────────── */}
      {won && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(20,7,2,.97)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 30, overflowY: 'auto',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🧱⛪</div>
          <h2 style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#fdba74',
            marginBottom: 14, lineHeight: 1.3, maxWidth: 520,
          }}>
            {isRu
              ? 'Иисус до сих пор строит Свою Церковь — и ты один из Его живых камней.'
              : 'Jesus is still building His Church — and you are one of His living stones.'}
          </h2>
          <div style={{
            fontFamily: 'var(--font-lora)', fontStyle: 'italic',
            fontSize: '0.95rem', color: 'rgba(253,186,116,.85)',
            lineHeight: 1.8, maxWidth: 500, marginBottom: 28,
            padding: '16px 20px', background: 'rgba(194,65,12,.2)',
            borderRadius: 14, border: '1.5px solid rgba(194,65,12,.4)',
          }}>
            {isRu
              ? '"Идите, научите все народы…" — Мф 28:19'
              : '"Go and make disciples of all nations…" — Matthew 28:19'}
          </div>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 800,
            fontSize: '0.9rem', color: '#fbbf24', lineHeight: 1.6,
            maxWidth: 460, marginBottom: 28,
          }}>
            {isRu
              ? '🧱 Не забудь «Вызов строителя»: достигни одного, пригласи одного или молись об одном по имени — каждый день на этой неделе.'
              : "🧱 Don't forget the Builder's Challenge: reach one, invite one, or pray for one by name — every day this week."}
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
              onClick={() => {
                localStorage.removeItem('church-build_unlocked')
                localStorage.removeItem('church-build_done')
                window.location.reload()
              }}
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
          {isRu ? 'Иисус строит Свою Церковь' : 'Jesus Builds His Church'}
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
            ? '"Я создам Церковь Мою, и врата ада не одолеют её." — Мф 16:18'
            : '"I will build My Church, and the gates of hell will not overcome it." — Matthew 16:18'}
        </div>
        <p style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 700,
          fontSize: '0.9rem', color: 'rgba(255,255,255,.55)',
          maxWidth: 480, lineHeight: 1.65,
        }}>
          {isRu
            ? 'Иисус вырос в доме плотника — Иосиф научил Его работать с деревом и камнем. Но Его главная стройка — не дом. Однажды Он посмотрел на Своих друзей и объявил самый большой план в истории: «Я создам Церковь Мою». И Он строит её до сих пор — из людей. Из тебя.'
            : "Jesus grew up in a carpenter's home — Joseph taught Him to work with wood and stone. But His greatest building project was never a house. One day He looked at His friends and announced the biggest plan in history: 'I will build My Church.' And He is still building it today — out of people. Out of you."}
        </p>
      </section>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div style={{
        background: ACCENT_GLOW,
        borderTop: `2px solid ${ACCENT}`,
        borderBottom: `2px solid ${ACCENT}`,
        padding: '10px 20px', textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 900,
          fontSize: '0.95rem', color: ACCENT_DARK, letterSpacing: 1,
        }}>
          {isRu ? '📖 ПРОГРЕСС' : '📖 PROGRESS'}{' '}
          {[1, 2, 3, 4].map(n => progressIcon(n)).join(' ')}{' '}
          {secDoneCount}/4
        </span>
        <button onClick={resetAll} style={{
          marginLeft: 16, fontFamily: 'var(--font-nunito)', fontSize: '0.7rem',
          fontWeight: 900, color: '#aaa', background: 'none', border: 'none',
          cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1,
        }}>
          {isRu ? 'сбросить' : 'reset'}
        </button>
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
              ? 'Когда Иисус сказал: «Я создам Церковь Мою», ученики могли представить молотки, камни и строительные леса. Но Иисус говорил не о стенах, кирпичах и крыше. Церковь, которую Он строит, состоит из ЛЮДЕЙ — из всех, кто любит Его и идёт за Ним.'
              : "When Jesus said 'I will build My Church,' the disciples might have pictured hammers, stones, and scaffolding. But Jesus wasn't talking about walls, bricks, or a roof. The Church He builds is made of PEOPLE — everyone who loves Him and follows Him."}
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
                ? '💡 Главная мысль: Церковь — это не место, куда ходят, а люди, к которым ты принадлежишь. И Строитель — Сам Иисус.'
                : "💡 The big idea: the Church is not a place you go — it's a people you belong to. And the Builder is Jesus Himself."}
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
              {isRu ? 'Матфея 16:18' : 'Matthew 16:18'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontStyle: 'italic',
              fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
            }}>
              {isRu
                ? '"Я создам Церковь Мою, и врата ада не одолеют её."'
                : '"I will build My Church, and the gates of hell will not overcome it."'}
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
          <LockedPlaceholder secNum={2} />
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
                  ? '💡 Расти — это не только становиться выше. Иисус рос сразу в ЧЕТЫРЁХ направлениях: ум, тело, Бог, люди.'
                  : '💡 Growing is not only about getting taller. Jesus grew in FOUR directions at once — mind, body, God, people.'}
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
                {isRu ? 'Луки 2:52' : 'Luke 2:52'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
              }}>
                {isRu
                  ? '"Иисус же преуспевал в премудрости и возрасте и в любви у Бога и человеков."'
                  : '"And Jesus grew in wisdom and stature, and in favor with God and man."'}
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
          <LockedPlaceholder secNum={3} />
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
                ? 'Открой каждую карточку и узнай четыре способа, которыми Иисус строил Свою команду — самую первую Церковь.'
                : 'Flip each card to discover the four ways Jesus built His team — the very first Church.'}
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
                  ? '💡 Иисус строил дружбой, примером, доверием и молитвой. Эти четыре инструмента работают и сегодня — и все они помещаются в твоих руках.'
                  : '💡 Jesus built with friendship, example, trust, and prayer. Four tools that still work today — and they all fit in your hands.'}
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
                      ? 'Ты нашёл все четыре инструмента строителя! Перечитай их ниже.'
                      : "You found all four of the Builder's tools! Read them again below."}
                  </p>
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
                {CARDS_ACTIVE.map(c => {
                  const isFlipped = done.has('flip') || flipped.has(c.id)
                  return (
                    <div
                      key={c.id}
                      onClick={() => !isFlipped && flipCard(c.id)}
                      style={{
                        flex: '1 1 180px', maxWidth: 240,
                        minHeight: 230, perspective: '700px',
                        cursor: isFlipped ? 'default' : 'pointer', userSelect: 'none',
                      }}
                    >
                      <div style={{
                        position: 'relative', width: '100%', height: '100%', minHeight: 230,
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.55s ease',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}>
                        {/* Front */}
                        <div style={{
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
                        <div style={{
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
                    </div>
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
                {isRu ? 'Марка 3:14' : 'Mark 3:14'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
              }}>
                {isRu
                  ? '"И поставил из них двенадцать, чтобы с Ним были и чтобы посылать их на проповедь."'
                  : '"He appointed twelve that they might be with him and that he might send them out to preach."'}
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
          <LockedPlaceholder secNum={4} light />
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
                ? 'Иисус достигал МНОГИХ: Он проповедовал огромным толпам на склонах холмов и у моря. Но Он достигал и ОДНОГО: Он никогда не проходил мимо человека, которого не замечали остальные, — Закхея на дереве, женщины у колодца, слепого Вартимея, кричащего у дороги.'
                : 'Jesus reached the MANY: He preached to huge crowds on hillsides and by the sea. But He also reached the ONE: He never walked past the person everyone else ignored — Zacchaeus up in his tree, the woman at the well, blind Bartimaeus shouting by the road.'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: '#5c2a10',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'И Он достигал НОВЫХ: Он готовил Своих друзей, чтобы ОНИ достигли людей, которых Он не встретил лицом к лицу. Ученик учил ученика, друг рассказывал другу — две тысячи лет — и так добрая весть дошла до ТЕБЯ.'
                : 'And He reached the NEW: He trained His friends so THEY could reach people He never met face to face. Disciple taught disciple, friend told friend, for two thousand years — and that is how the good news reached YOU.'}
            </p>

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
                  ? '💡 Каждый камень в этой стене — человек, которого достиг Иисус. Нажимай на камни и строй Церковь — и посмотри внимательно: один из камней — это ты.'
                  : '💡 Every stone in this wall is a person Jesus reached. Tap the stones and build the Church — and look carefully: one of the stones is you.'}
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
                      ? '"И сами, как живые камни, устройте из себя дом духовный." — 1 Пет 2:5'
                      : '"You also, like living stones, are being built into a spiritual house." — 1 Peter 2:5'}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 800,
                    fontSize: '0.92rem', color: '#5c2a10', lineHeight: 1.65,
                    maxWidth: 520, margin: '0 auto',
                  }}>
                    {isRu
                      ? 'Посмотри на стену — толпы, один человек, новые… и ТЫ. Иисус и сегодня строит Свою Церковь, и ты — один из Его живых камней.'
                      : 'Look at the wall — the crowds, the one, the new… and YOU. Jesus is still building His Church today, and you are one of His living stones.'}
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
                    ['🙋', 'Достигни ОДНОГО: поговори с ребёнком, с которым никто не разговаривает, — узнай, как его зовут'],
                    ['🏠', 'Пригласи: позови друга, двоюродного брата или сестру в церковь или детский клуб'],
                    ['🙏', 'Молись: выбери одного человека и молись о нём по имени каждый день на этой неделе'],
                  ] : [
                    ['🙋', 'Reach ONE: talk to the kid nobody talks to — learn their name'],
                    ['🏠', "Invite: bring a friend or cousin to church or kids' club"],
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
                    ? 'Секретное правило: строителям не нужны аплодисменты. Иисус видит каждый камень.'
                    : "Secret rule: builders don't need applause. Jesus sees every stone."}
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
                {isRu ? 'Матфея 28:19' : 'Matthew 28:19'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: ACCENT_DARK, lineHeight: 1.8, margin: 0,
              }}>
                {isRu
                  ? '"Идите, научите все народы…"'
                  : '"Go and make disciples of all nations…"'}
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
