'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// ─── Theme ────────────────────────────────────────────────────────────────────
const ACCENT      = '#0e7490'
const ACCENT_DARK = '#155e75'
const ACCENT_GLOW = 'rgba(14,116,144,.15)'

// ─── Section unlock requirements ─────────────────────────────────────────────
const SECTION_REQS: Record<number, string[]> = {
  1: ['seq'],
  2: ['flip'],
  3: ['tf'],
  4: ['fish'],
}

// ─── Story sequence data ──────────────────────────────────────────────────────
const SEQ_CORRECT = ['a', 'b', 'c', 'd', 'e']

const SEQ_EN = [
  { id: 'a', emoji: '🚪', text: "Tax collectors ask Peter: 'Doesn't your teacher pay the temple tax?'" },
  { id: 'b', emoji: '💬', text: "Peter says 'Yes' — and heads into the house to talk to Jesus" },
  { id: 'c', emoji: '🤔', text: "Before Peter says a word, Jesus asks: 'Do kings tax their own sons — or others?'" },
  { id: 'd', emoji: '🎣', text: "Jesus sends Peter to the lake: 'The first fish you catch — look in its mouth'" },
  { id: 'e', emoji: '🪙', text: "Inside the fish's mouth: a coin — exactly enough for Jesus AND Peter" },
]
const SEQ_RU = [
  { id: 'a', emoji: '🚪', text: 'Сборщики налога спрашивают Петра: «Учитель ваш не даст ли дидрахмы?»' },
  { id: 'b', emoji: '💬', text: 'Пётр говорит «да» — и идёт в дом поговорить с Иисусом' },
  { id: 'c', emoji: '🤔', text: 'Прежде чем Пётр открыл рот, Иисус спрашивает: «Цари берут пошлину с сыновей своих — или с чужих?»' },
  { id: 'd', emoji: '🎣', text: 'Иисус посылает Петра к озеру: «Первую рыбу, что поймаешь, — открой ей рот»' },
  { id: 'e', emoji: '🪙', text: 'Во рту рыбы — монета, ровно на двоих: за Иисуса И за Петра' },
]

function shuffleIds(): string[] {
  const ids = [...SEQ_CORRECT]
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]]
  }
  return ids
}

// ─── Flip card data ───────────────────────────────────────────────────────────
const CARDS_EN = [
  {
    id: 'house',
    emoji: '👑',
    name: 'Whose House Is It?',
    role: 'Jesus is the Son',
    back: "The temple tax paid for God's house. But Jesus IS God's Son. Imagine charging a prince rent to live in his father's palace! Jesus didn't owe anything.",
  },
  {
    id: 'kind',
    emoji: '🕊️',
    name: 'Free — But Kind',
    role: 'He gave up His right',
    back: "Jesus had every right to refuse. But He said: 'so that we may not cause offense' — He gave up His right to keep peace and protect others' hearts. That's real strength.",
  },
  {
    id: 'atm',
    emoji: '🎣',
    name: 'The Strangest ATM Ever',
    role: 'God provides His way',
    back: "God's provision came through a fish's mouth! Not a money bag, not a rich friend — a fish. God is not limited to normal ways. He can provide however He wants.",
  },
  {
    id: 'two',
    emoji: '🤝',
    name: "'For Me and You'",
    role: 'One coin, two people',
    back: "The coin was exactly enough for TWO: Jesus and Peter. Jesus included Peter in the miracle. He doesn't just solve His own problems — He covers yours too.",
  },
]

const CARDS_RU = [
  {
    id: 'house',
    emoji: '👑',
    name: 'Чей это дом?',
    role: 'Иисус — Сын',
    back: 'Налог шёл на дом Божий. Но Иисус — СЫН Бога. Представь: брать с принца плату за жизнь во дворце его отца! Иисус ничего не был должен.',
  },
  {
    id: 'kind',
    emoji: '🕊️',
    name: 'Свободен — но добр',
    role: 'Он отказался от права',
    back: 'Иисус имел полное право отказаться. Но сказал: «чтобы нам не соблазнить их» — Он отказался от Своего права ради мира и сердец других. Вот настоящая сила.',
  },
  {
    id: 'atm',
    emoji: '🎣',
    name: 'Самый странный банкомат',
    role: 'Бог даёт по-Своему',
    back: 'Божье обеспечение пришло изо рта рыбы! Не кошелёк, не богатый друг — рыба. Бог не ограничен обычными способами. Он может дать как угодно.',
  },
  {
    id: 'two',
    emoji: '🤝',
    name: '«За Меня и за себя»',
    role: 'Одна монета — двое',
    back: 'Монеты хватило ровно на ДВОИХ: за Иисуса и за Петра. Иисус включил Петра в чудо. Он не решает только Свои вопросы — Он покрывает и твои.',
  },
]

// ─── True/False data ──────────────────────────────────────────────────────────
const TF_EN = [
  {
    id: 'q1',
    text: 'Peter told the tax collectors that Jesus does NOT pay the temple tax.',
    correct: false,
    explain: "Peter said 'Yes, he does' — right away. He was sure Jesus would do the right thing.",
  },
  {
    id: 'q2',
    text: 'Jesus asked Peter whether kings collect taxes from their own sons or from others.',
    correct: true,
    explain: 'Matthew 17:25 — Jesus asked it before Peter even brought the subject up. He already knew.',
  },
  {
    id: 'q3',
    text: "Jesus refused to pay the tax because He was God's Son.",
    correct: false,
    explain: "He had the right to refuse — but He paid anyway, 'so that we may not cause offense.' Humble strength.",
  },
  {
    id: 'q4',
    text: 'The coin was found inside the mouth of the first fish Peter caught.',
    correct: true,
    explain: "Matthew 17:27 — the very first fish, with the coin right in its mouth. God's timing is exact.",
  },
  {
    id: 'q5',
    text: 'The coin was only enough to pay for Jesus, so Peter had to find his own.',
    correct: false,
    explain: "The coin covered both: 'for my tax and yours.' Jesus included Peter in the miracle.",
  },
]

const TF_RU = [
  {
    id: 'q1',
    text: 'Пётр сказал сборщикам, что Иисус НЕ платит налог на храм.',
    correct: false,
    explain: 'Пётр сразу сказал «да». Он был уверен, что Иисус поступит правильно.',
  },
  {
    id: 'q2',
    text: 'Иисус спросил Петра: цари берут пошлину со своих сыновей или с чужих?',
    correct: true,
    explain: 'Матф. 17:25 — Иисус спросил прежде, чем Пётр заговорил. Он уже знал.',
  },
  {
    id: 'q3',
    text: 'Иисус отказался платить налог, потому что Он Сын Бога.',
    correct: false,
    explain: 'Он имел право отказаться — но заплатил, «чтобы нам не соблазнить их». Смиренная сила.',
  },
  {
    id: 'q4',
    text: 'Монета нашлась во рту первой рыбы, которую поймал Пётр.',
    correct: true,
    explain: 'Матф. 17:27 — самая первая рыба, и монета прямо во рту. Божий расчёт точен.',
  },
  {
    id: 'q5',
    text: 'Монеты хватило только за Иисуса, и Петру пришлось искать свою.',
    correct: false,
    explain: 'Монеты хватило на двоих: «за Меня и за себя». Иисус включил Петра в чудо.',
  },
]

// ─── Fishing activity data ────────────────────────────────────────────────────
const FISH_WORDS_EN = ['YOUR', 'FATHER', 'KNOWS', 'WHAT', 'YOU', 'NEED']
const FISH_WORDS_RU = ['ОТЕЦ', 'ВАШ', 'ЗНАЕТ', 'ЧТО', 'НУЖНО']

// Lake "swim lanes": vertical position (%), drift duration (s), start offset (s),
// direction (1 = left→right, -1 = right→left)
const LAKE_SLOTS = [
  { top: 4,  dur: 15, delay: 0,   dir: 1 },
  { top: 20, dur: 19, delay: -7,  dir: -1 },
  { top: 36, dur: 13, delay: -3,  dir: 1 },
  { top: 52, dur: 17, delay: -10, dir: -1 },
  { top: 68, dur: 14, delay: -5,  dir: 1 },
  { top: 82, dur: 18, delay: -12, dir: -1 },
]
// Which lane each verse word swims in (scrambled so the verse isn't top-to-bottom)
const FISH_SLOT_EN = [2, 5, 0, 3, 1, 4]
const FISH_SLOT_RU = [4, 1, 3, 0, 2]

// ─── Component ────────────────────────────────────────────────────────────────
export default function CoinInTheFishPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  // ── Progress ───────────────────────────────────────────────────────────────
  const [unlocked, setUnlocked] = useState<Set<number>>(() => {
    try {
      const u = typeof window !== 'undefined' && localStorage.getItem('coin-fish_unlocked')
      if (u) return new Set(JSON.parse(u) as number[])
    } catch { /* ignore */ }
    return new Set([1])
  })
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      const d = typeof window !== 'undefined' && localStorage.getItem('coin-fish_done')
      if (d) return new Set(JSON.parse(d) as string[])
    } catch { /* ignore */ }
    return new Set()
  })
  const [won, setWon] = useState(false)

  useEffect(() => {
    localStorage.setItem('coin-fish_unlocked', JSON.stringify([...unlocked]))
    localStorage.setItem('coin-fish_done',     JSON.stringify([...done]))
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

  // ── Activity 1: Sequence ──────────────────────────────────────────────────
  const [seqShuffled] = useState<string[]>(shuffleIds)
  const [seqOrder, setSeqOrder] = useState<string[]>([])
  const [seqErr, setSeqErr] = useState(false)

  function seqTap(id: string) {
    if (done.has('seq') || seqOrder.includes(id)) return
    const next = [...seqOrder, id]
    if (next.length === SEQ_CORRECT.length) {
      if (next.every((v, i) => v === SEQ_CORRECT[i])) {
        setSeqOrder(next)
        solve('seq', 1)
      } else {
        setSeqErr(true)
        setTimeout(() => { setSeqOrder([]); setSeqErr(false) }, 800)
      }
      return
    }
    setSeqOrder(next)
  }

  // ── Activity 2: Flip cards ─────────────────────────────────────────────────
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  function flipCard(id: string) {
    if (done.has('flip')) return
    const next = new Set([...flipped, id])
    setFlipped(next)
    const CARDS = isRu ? CARDS_RU : CARDS_EN
    if (CARDS.every(c => next.has(c.id))) solve('flip', 2)
  }

  // ── Activity 3: True / Fishy (one at a time) ──────────────────────────────
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
        solve('tf', 3)
      }
    }, 1000)
  }

  // ── Activity 4: Cast Your Line (fishing) ──────────────────────────────────
  const [fishCaught, setFishCaught] = useState(0)          // how many verse words are landed
  const [fishFlash, setFishFlash]   = useState<number | null>(null)  // fish turning into a coin
  const [fishWrong, setFishWrong]   = useState<number | null>(null)  // fish wiggling "not me!"
  const [versePeek, setVersePeek]   = useState(false)      // hint: show the target verse

  const FISH_WORDS = isRu ? FISH_WORDS_RU : FISH_WORDS_EN
  const FISH_SLOTS = isRu ? FISH_SLOT_RU  : FISH_SLOT_EN

  function tapFish(i: number) {
    if (done.has('fish') || fishFlash !== null || i < fishCaught) return
    if (i === fishCaught) {
      setFishFlash(i)
      const next = i + 1
      const total = FISH_WORDS.length
      setTimeout(() => {
        setFishFlash(null)
        setFishCaught(next)
        if (next === total) solve('fish', 4)
      }, 650)
    } else {
      setFishWrong(i)
      setTimeout(() => setFishWrong(null), 500)
    }
  }

  function resetAll() {
    if (!confirm(isRu ? 'Сбросить весь прогресс?' : 'Reset all progress?')) return
    localStorage.removeItem('coin-fish_unlocked')
    localStorage.removeItem('coin-fish_done')
    window.location.reload()
  }

  // ── Language-dependent refs ────────────────────────────────────────────────
  const CARDS_ACTIVE = isRu ? CARDS_RU : CARDS_EN
  const SEQ_ACTIVE   = isRu ? SEQ_RU   : SEQ_EN
  const seqById      = Object.fromEntries(SEQ_ACTIVE.map(e => [e.id, e]))

  // ── Locked section placeholder ─────────────────────────────────────────────
  function LockedPlaceholder({ secNum, light }: { secNum: number; light?: boolean }) {
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
        <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: light ? 'rgba(21,94,117,.6)' : 'rgba(255,255,255,.5)', fontSize: '1rem' }}>
          {isRu
            ? `Заверши Раздел ${secNum - 1}, чтобы открыть этот раздел!`
            : `Complete Section ${secNum - 1} to unlock this section!`}
        </p>
      </div>
    )
  }

  // ── TF score after done ───────────────────────────────────────────────────
  const tfScore = Object.entries(tfAnswers).filter(([id, ans]) => {
    const q = TF_ACTIVE.find(q => q.id === id)
    return q && ans === q.correct
  }).length

  // ════════════════════ JSX ══════════════════════════════════════════════════
  return (
    <>
      {/* ── Animations ──────────────────────────────────────────────────── */}
      <style>{`
        @keyframes fishDriftR {
          0%   { left: -14%; }
          100% { left: 104%; }
        }
        @keyframes fishDriftL {
          0%   { left: 104%; }
          100% { left: -14%; }
        }
        @keyframes fishWiggle {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25%      { transform: translateX(-7px) rotate(-9deg); }
          50%      { transform: translateX(7px) rotate(9deg); }
          75%      { transform: translateX(-4px) rotate(-5deg); }
        }
        @keyframes coinCatch {
          0%   { transform: scale(1); opacity: 1; }
          45%  { transform: scale(1.65) rotate(12deg); opacity: 1; }
          100% { transform: scale(.4) translateY(30px); opacity: 0; }
        }
        @keyframes coinLand {
          0%   { transform: scale(.4); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fishBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
      `}</style>

      {/* ── Win Screen ──────────────────────────────────────────────────── */}
      {won && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(2,18,24,.97)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 30,
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🪙</div>
          <h2 style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#67e8f9',
            marginBottom: 14, lineHeight: 1.3, maxWidth: 480,
          }}>
            {isRu ? 'Бог даёт — иногда даже изо рта рыбы.' : "God provides — sometimes from a fish's mouth."}
          </h2>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 700,
            color: 'rgba(255,255,255,.8)', lineHeight: 1.7, marginBottom: 28,
            fontSize: '0.98rem', maxWidth: 460,
          }}>
            {isRu
              ? 'Иисус — Сын Царя, который всё равно заплатил. Он отказался от Своих прав ради других — и покрывает то, что должен ты.'
              : "Jesus is the King's Son who paid anyway. He gave up His rights for others — and He covers what you owe too."}
          </p>
          <div style={{
            fontFamily: 'var(--font-lora)', fontStyle: 'italic',
            fontSize: '0.95rem', color: 'rgba(103,232,249,.85)',
            lineHeight: 1.8, maxWidth: 500, marginBottom: 32,
            padding: '16px 20px', background: 'rgba(14,116,144,.2)',
            borderRadius: 14, border: '1.5px solid rgba(14,116,144,.4)',
          }}>
            {isRu
              ? '"Пойди на море, брось уду, и первую рыбу, которая попадётся, возьми; и, открыв у ней рот, найдёшь статир; возьми его и отдай им за Меня и за себя." — Мф 17:27'
              : '"Go to the lake and throw out your line. Take the first fish you catch; open its mouth and you will find a coin. Take it and give it to them for my tax and yours." — Matthew 17:27'}
          </div>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 800,
            fontSize: '0.9rem', color: '#fbbf24', lineHeight: 1.6,
            maxWidth: 440, marginBottom: 28,
          }}>
            {isRu
              ? '🪙 Не забудь «Вызов монеты»: сделай на этой неделе одно дело, которое ты не обязан делать, — добровольно, ради другого.'
              : "🪙 Don't forget your Coin Challenge: this week, do one thing you don't have to do — willingly, for someone else."}
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
        background: 'linear-gradient(180deg,#042f3c,#0a4356 40%,#e0f7fa)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '64px 20px 52px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🐟🪙</div>
        <h1 style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 900,
          fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: '#67e8f9',
          marginBottom: 10, lineHeight: 1.2,
        }}>
          {isRu ? 'Монета во рту рыбы' : "The Coin in the Fish's Mouth"}
        </h1>
        <p style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 800,
          fontSize: '0.95rem', color: 'rgba(103,232,249,.75)',
          letterSpacing: 2, textTransform: 'uppercase', marginBottom: 22,
        }}>
          {isRu ? 'Матфея 17:24–27' : 'Matthew 17:24–27'}
        </p>
        <div style={{
          fontFamily: 'var(--font-lora)', fontStyle: 'italic',
          fontSize: '1.05rem', color: 'rgba(255,255,255,.7)',
          maxWidth: 540, lineHeight: 1.75, marginBottom: 28,
        }}>
          {isRu
            ? '"…открыв у ней рот, найдёшь статир; возьми его и отдай им за Меня и за себя." — Мф 17:27'
            : '"…open its mouth and you will find a coin. Take it and give it to them for my tax and yours." — Matthew 17:27'}
        </div>
        <p style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 700,
          fontSize: '0.9rem', color: 'rgba(255,255,255,.55)',
          maxWidth: 480, lineHeight: 1.65,
        }}>
          {isRu
            ? 'После горы Преображения и урока о горчичном зерне Иисус и ученики приходят в Капернаум. У двери — сборщики налога на храм. И Иисус решает вопрос самым необычным способом в истории: рыбалкой.'
            : 'After the mountain of the Transfiguration and the mustard seed lesson, Jesus and the disciples arrive in Capernaum. Temple tax collectors are at the door. And Jesus solves the problem in the strangest way in history: with a fishing trip.'}
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

      {/* ════════════════ SECTION 1 · THE QUESTION AT THE DOOR ══════════ */}
      <section id="sec-1" style={{
        background: 'linear-gradient(180deg,#0a4356,#0d4f66)',
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
            {isRu ? '🚪 РАЗДЕЛ 1 · ВОПРОС У ДВЕРИ 🚪' : '🚪 SECTION 1 · THE QUESTION AT THE DOOR 🚪'}
          </p>
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
            color: '#22d3ee', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
          }}>
            {isRu ? 'История Матфея 17:24–27' : 'The Story of Matthew 17:24–27'}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#fff',
            marginBottom: 20, lineHeight: 1.2,
          }}>
            {isRu ? 'Вопрос у двери' : 'The Question at the Door'}
          </h2>

          <p style={{
            fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
            lineHeight: 1.8, marginBottom: 16,
          }}>
            {isRu
              ? 'В Капернауме каждый взрослый платил особый налог — на храм в Иерусалиме, дом Божий. Сборщики подходят к Петру с вопросом: «Учитель ваш не даст ли дидрахмы?» Пётр отвечает: «Да, конечно платит» — и идёт в дом рассказать об этом Иисусу.'
              : "In Capernaum, every grown-up paid a special tax — for the temple in Jerusalem, God's house. The collectors come up to Peter with a question: \"Doesn't your teacher pay the temple tax?\" Peter answers, \"Yes, of course he does\" — and heads into the house to tell Jesus about it."}
          </p>
          <p style={{
            fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
            lineHeight: 1.8, marginBottom: 16,
          }}>
            {isRu
              ? 'Но Пётр не успевает сказать ни слова. Иисус спрашивает первым: «Как тебе кажется, Симон? Цари земные с кого берут пошлину — с сыновей своих или с чужих?» Иисус уже знал весь разговор у двери. А потом Он отправляет Петра на самую удивительную рыбалку в его жизни.'
              : "But Peter doesn't get a single word out. Jesus asks first: \"What do you think, Simon? From whom do the kings of the earth collect taxes — from their own sons, or from others?\" Jesus already knew the whole conversation at the door. And then He sends Peter on the most amazing fishing trip of his life."}
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
              fontSize: '0.97rem', color: '#67e8f9', lineHeight: 1.7, margin: 0,
            }}>
              {isRu
                ? '💡 Заметь: Иисус ответил на вопрос Петра прежде, чем тот его задал. Иисус знал о разговоре у двери. Он знает всё — и то, что нужно тебе.'
                : "💡 Notice: Jesus answered Peter's question before Peter even asked it. Jesus knew the conversation at the door. He knows everything — including what you need."}
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
              color: '#22d3ee', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Матфея 17:24–25а' : 'Matthew 17:24–25a'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontStyle: 'italic',
              fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
            }}>
              {isRu
                ? '"Когда же пришли они в Капернаум, то подошли к Петру собиратели дидрахм и сказали: Учитель ваш не даст ли дидрахмы? Он говорит: да."'
                : '"After Jesus and his disciples arrived in Capernaum, the collectors of the two-drachma temple tax came to Peter and asked, \'Doesn\'t your teacher pay the temple tax?\' \'Yes, he does,\' he replied."'}
            </p>
          </div>

          {/* ── Activity 1: Sequence ──────────────────────────────────── */}
          <div style={{
            background: 'rgba(255,255,255,.06)', borderRadius: 22,
            border: '1.5px solid rgba(255,255,255,.14)', padding: '22px 20px', marginTop: 8,
          }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
              color: '#22d3ee', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
            }}>
              {isRu ? '📋 АКТИВНОСТЬ 1 · РАССТАВЬ ПО ПОРЯДКУ' : '📋 ACTIVITY 1 · PUT IT IN ORDER'}
            </p>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 700,
              fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', marginBottom: 16,
            }}>
              {isRu
                ? 'Нажимай события в правильном порядке — от первого до последнего!'
                : 'Tap the events in the correct order — first to last!'}
            </p>

            {done.has('seq') ? (
              <div>
                <div style={{ textAlign: 'center', padding: '4px 0 16px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#67e8f9', margin: 0 }}>
                    {isRu ? 'Отлично! Вот вся история по порядку:' : 'Great job! Here is the whole story in order:'}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {SEQ_CORRECT.map((id, i) => {
                    const ev = seqById[id]
                    return (
                      <div key={id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', borderRadius: 12,
                        background: ACCENT_GLOW,
                        border: `2px solid ${ACCENT}`,
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          background: '#4ade80', color: '#052e16',
                          fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: '1.2rem' }}>{ev.emoji}</span>
                        <span style={{
                          fontFamily: 'var(--font-nunito)', fontWeight: 700,
                          fontSize: '0.9rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.4,
                        }}>
                          {ev.text}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {seqShuffled.map(id => {
                  const ev = seqById[id]
                  const pos = seqOrder.indexOf(id)
                  const selected = pos >= 0
                  return (
                    <div
                      key={id}
                      onClick={() => seqTap(id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', borderRadius: 12,
                        cursor: selected ? 'default' : 'pointer',
                        background: seqErr ? 'rgba(224,64,64,.15)' : selected ? ACCENT_GLOW : 'rgba(255,255,255,.05)',
                        border: `2px solid ${seqErr ? '#e04040' : selected ? ACCENT : 'rgba(255,255,255,.14)'}`,
                        transition: 'all .2s', userSelect: 'none',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: selected ? ACCENT : 'rgba(255,255,255,.12)',
                        color: selected ? '#fff' : 'rgba(255,255,255,.4)',
                        fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {selected ? pos + 1 : '?'}
                      </div>
                      <span style={{ fontSize: '1.2rem' }}>{ev.emoji}</span>
                      <span style={{
                        fontFamily: 'var(--font-nunito)', fontWeight: 700,
                        fontSize: '0.9rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.4,
                      }}>
                        {ev.text}
                      </span>
                    </div>
                  )
                })}
                {seqErr && (
                  <p style={{
                    textAlign: 'center', color: '#f87171',
                    fontFamily: 'var(--font-nunito)', fontWeight: 900, marginTop: 4,
                  }}>
                    {isRu ? '❌ Попробуй ещё раз!' : '❌ Not quite! Try again.'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 2 · THE KING'S KIDS DON'T PAY ═════════ */}
      <section id="sec-2" style={{
        background: 'linear-gradient(180deg,#0d4f66,#0a4356)',
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
            {isRu ? "👑 РАЗДЕЛ 2 · ДЕТИ ЦАРЯ НЕ ПЛАТЯТ 👑" : "👑 SECTION 2 · THE KING'S KIDS DON'T PAY 👑"}
          </p>
        </div>

        {!unlocked.has(2) ? (
          <LockedPlaceholder secNum={2} />
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
              color: '#22d3ee', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Что это значит' : 'What It Means'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#fff',
              marginBottom: 20, lineHeight: 1.2,
            }}>
              {isRu ? 'Дети Царя не платят' : "The King's Kids Don't Pay"}
            </h2>

            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'Вопрос Иисуса про царей — не просто загадка. Это подсказка о том, кто Он. Цари не берут налоги со своих детей. Храм — дом Его Отца. Значит, Сын свободен.'
                : "Jesus' question about kings isn't just a riddle. It's a clue about who He is. Kings don't tax their own children. The temple is His Father's house. So the Son is free."}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 28,
            }}>
              {isRu
                ? 'Но что Иисус делает со Своей свободой? Открой каждую карточку — в этой короткой истории спрятаны четыре больших сокровища.'
                : 'But what does Jesus do with His freedom? Flip each card — this short story has four big treasures hidden inside.'}
            </p>

            {/* ── Activity 2: Flip Cards ────────────────────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,.06)', borderRadius: 22,
              border: '1.5px solid rgba(255,255,255,.14)', padding: '22px 20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: '#22d3ee', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '🃏 АКТИВНОСТЬ 2 · ОТКРОЙ СОКРОВИЩА' : '🃏 ACTIVITY 2 · UNCOVER THE TREASURES'}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', marginBottom: 18,
              }}>
                {isRu
                  ? 'Нажми на каждую карточку, чтобы узнать, что скрыто в этой истории!'
                  : 'Tap each card to discover what this story is really saying!'}
              </p>

              {done.has('flip') && (
                <div style={{ textAlign: 'center', padding: '4px 0 18px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#67e8f9', margin: 0 }}>
                    {isRu ? 'Ты нашёл все четыре сокровища! Перечитай их ниже.' : "You've found all four treasures! Read them again below."}
                  </p>
                </div>
              )}
              {(
                <>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
                    {CARDS_ACTIVE.map(c => {
                      const isFlipped = done.has('flip') || flipped.has(c.id)
                      return (
                        <div
                          key={c.id}
                          onClick={() => !isFlipped && flipCard(c.id)}
                          style={{
                            flex: '1 1 180px', maxWidth: 240,
                            minHeight: 210, perspective: '700px',
                            cursor: isFlipped ? 'default' : 'pointer', userSelect: 'none',
                          }}
                        >
                          <div style={{
                            position: 'relative', width: '100%', height: '100%', minHeight: 210,
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
                                fontSize: '0.95rem', color: '#67e8f9', marginBottom: 6,
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
                              borderRadius: 18, padding: '18px 14px',
                              background: ACCENT_GLOW,
                              border: `2px solid ${ACCENT}`,
                              textAlign: 'center',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{c.emoji}</div>
                              <div style={{
                                fontFamily: 'var(--font-nunito)', fontWeight: 900,
                                fontSize: '0.85rem', color: '#67e8f9', marginBottom: 10,
                              }}>
                                {c.name}
                              </div>
                              <p style={{
                                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                                fontSize: '0.83rem', color: 'rgba(255,255,255,.85)',
                                lineHeight: 1.65, margin: 0,
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
                </>
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
                color: '#22d3ee', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
              }}>
                {isRu ? 'Матфея 17:26–27' : 'Matthew 17:26–27'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
              }}>
                {isRu
                  ? '"Пётр говорит Ему: с посторонних. Иисус сказал ему: итак сыны свободны; но, чтобы нам не соблазнить их, пойди на море, брось уду, и первую рыбу, которая попадётся, возьми, и, открыв у ней рот, найдёшь статир; возьми его и отдай им за Меня и за себя."'
                  : '"\'From others,\' Peter answered. \'Then the sons are exempt,\' Jesus said to him. \'But so that we may not cause offense, go to the lake and throw out your line. Take the first fish you catch; open its mouth and you will find a coin. Take it and give it to them for my tax and yours.\'"'}
              </p>
            </div>

            {/* ── The Pattern: Son of God → willing payment ─────────────── */}
            <div style={{
              marginTop: 24, padding: '22px 18px',
              background: 'rgba(255,255,255,.05)', borderRadius: 20,
              border: `2px solid ${ACCENT}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: '#22d3ee', letterSpacing: 2, textTransform: 'uppercase',
                textAlign: 'center', marginBottom: 4,
              }}>
                {isRu ? '🔍 Секретный узор Матфея' : "🔍 Matthew's Secret Pattern"}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.88rem', color: 'rgba(255,255,255,.7)',
                textAlign: 'center', marginBottom: 18, lineHeight: 1.55,
              }}>
                {isRu
                  ? 'Смотри, как Матфей повторяет одно и то же — три раза подряд:'
                  : 'Watch how Matthew repeats the same beat — three times in a row:'}
              </p>

              {(isRu ? [
                { son: '«Ты — Сын Бога Живого!» — Пётр', sonRef: 'Мф 16:16', pay: '«Мне должно пострадать и быть убитым… и воскреснуть»', payRef: 'Мф 16:21' },
                { son: '«Сей есть Сын Мой Возлюбленный!» — Бог Отец', sonRef: 'Мф 17:5', pay: '«Сын Человеческий предан будет… убьют Его, и в третий день воскреснет»', payRef: 'Мф 17:22–23' },
                { son: '«Итак, сыны свободны»', sonRef: 'Мф 17:26', pay: '«…возьми монету и отдай — за Меня и за себя»', payRef: 'Мф 17:27' },
              ] : [
                { son: '"You are the Son of the living God!" — Peter', sonRef: 'Matt 16:16', pay: '"I must suffer and be killed… and be raised"', payRef: 'Matt 16:21' },
                { son: '"This is My beloved Son!" — God the Father', sonRef: 'Matt 17:5', pay: '"The Son of Man will be betrayed and killed… and on the third day rise"', payRef: 'Matt 17:22–23' },
                { son: '"Then the sons are free"', sonRef: 'Matt 17:26', pay: '"…take the coin and pay — for Me and you"', payRef: 'Matt 17:27' },
              ]).map((row, i) => (
                <div key={i} style={{
                  display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'stretch',
                  marginBottom: 10,
                }}>
                  <div style={{
                    flex: '1 1 46%', minWidth: 130, padding: '12px 14px', borderRadius: 12,
                    background: 'rgba(103,232,249,.1)', border: '1.5px solid rgba(103,232,249,.4)',
                  }}>
                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.68rem', color: '#67e8f9', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>
                      👑 {isRu ? 'Сын Божий' : 'Son of God'} · {row.sonRef}
                    </p>
                    <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.82rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.5, margin: 0 }}>
                      {row.son}
                    </p>
                  </div>
                  <div style={{
                    flex: '1 1 46%', minWidth: 130, padding: '12px 14px', borderRadius: 12,
                    background: 'rgba(251,191,36,.08)', border: '1.5px solid rgba(251,191,36,.4)',
                  }}>
                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.68rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>
                      {i === 2 ? '🪙' : '✝️'} {isRu ? 'Готов заплатить' : 'Willing to Pay'} · {row.payRef}
                    </p>
                    <p style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.82rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.5, margin: 0 }}>
                      {row.pay}
                    </p>
                  </div>
                </div>
              ))}

              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900,
                fontSize: '0.85rem', color: '#fbbf24', textAlign: 'center',
                margin: '16px 0 12px', letterSpacing: 1,
              }}>
                {isRu
                  ? 'СЫН БОЖИЙ → ГОТОВ ЗАПЛАТИТЬ → СЫН БОЖИЙ → ГОТОВ ЗАПЛАТИТЬ'
                  : 'SON OF GOD → WILLING TO PAY → SON OF GOD → WILLING TO PAY'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontSize: '0.95rem',
                color: 'rgba(255,255,255,.85)', lineHeight: 1.75,
                textAlign: 'center', margin: 0,
              }}>
                {isRu
                  ? 'Видишь? Каждый раз, когда Матфей показывает, что Иисус — СЫН Бога, он тут же показывает: Сын ГОТОВ заплатить. Монеты хватило, чтобы заплатить налог на храм. Но никакая монета на земле не может заплатить за грех. Поэтому Сын выбрал крест: Он умер и воскрес на третий день — точно так, как обещал. Монета покрыла налог Петра. Смерть и воскресение Иисуса покрывают тебя.'
                  : "See it? Every time Matthew shows that Jesus is God's SON, he immediately shows the Son CHOOSING to pay. A coin was enough to pay the temple tax. But no coin on earth can pay for sin. That's why the Son chose the cross: He died and rose on the third day — exactly what He said He would do. The coin covered Peter's tax. Jesus' death and resurrection covers you."}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 3 · TRUE OR FISHY? ════════════════════ */}
      <section id="sec-3" style={{
        background: 'linear-gradient(180deg,#0a4356,#0d4f66)',
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
            {isRu ? '🐟 РАЗДЕЛ 3 · ПРАВДА ИЛИ ВЫДУМКА? 🐟' : '🐟 SECTION 3 · TRUE OR FISHY? 🐟'}
          </p>
        </div>

        {!unlocked.has(3) ? (
          <LockedPlaceholder secNum={3} />
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 40px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
              color: '#22d3ee', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
            }}>
              {isRu ? 'Проверь себя' : 'Check Yourself'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#fff',
              marginBottom: 20, lineHeight: 1.2,
            }}>
              {isRu ? 'Правда или выдумка?' : 'True or Fishy?'}
            </h2>

            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'Эта история короткая — всего четыре стиха. Но в ней легко запутаться: кто что сказал, кто заплатил и на кого хватило монеты. Насколько внимательно ты слушал?'
                : "This story is short — just four verses. But it's easy to get the details tangled: who said what, who paid, and who the coin covered. How closely were you listening?"}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: 'rgba(255,255,255,.8)',
              lineHeight: 1.8, marginBottom: 28,
            }}>
              {isRu
                ? 'Некоторые из этих утверждений — правда. А некоторые — выдумка, скользкая, как рыба. Поймаешь разницу?'
                : "Some of these statements are true. Some are fishy — slippery, like a fish. Can you catch the difference?"}
            </p>

            {/* ── Activity 3: True/Fishy one-at-a-time ─────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,.06)', borderRadius: 22,
              border: '1.5px solid rgba(255,255,255,.14)', padding: '22px 20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: '#22d3ee', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '✅ АКТИВНОСТЬ 3 · ПРАВДА ИЛИ ВЫДУМКА?' : '✅ ACTIVITY 3 · TRUE OR FISHY?'}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', marginBottom: 18,
              }}>
                {isRu
                  ? 'Нажми «Правда» или «Выдумка 🐟» для каждого утверждения!'
                  : "Tap TRUE or FISHY 🐟 for each statement!"}
              </p>

              {done.has('tf') ? (
                <div>
                  <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#67e8f9', marginBottom: 6 }}>
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
                        ? 'Иисус никогда не использовал силу для Себя одного. Каждое чудо помогало кому-то. Даже эта монета — половина была для Петра.'
                        : "Jesus never used His power selfishly. Every miracle helped someone. Even this coin — half of it was for Peter."}
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
                            {q.correct ? (isRu ? '✅ ПРАВДА' : '✅ TRUE') : (isRu ? '🐟 ВЫДУМКА' : '🐟 FISHY')}
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
                        fontSize: '0.85rem', color: '#22d3ee', marginBottom: 10,
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
                            {val ? (isRu ? '✅ Правда' : '✅ True') : (isRu ? '🐟 Выдумка' : '🐟 Fishy')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
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
                color: '#22d3ee', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
              }}>
                {isRu ? 'Матфея 17:25б' : 'Matthew 17:25b'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, margin: 0,
              }}>
                {isRu
                  ? '"…Иисус, предупредив его, сказал: как тебе кажется, Симон? цари земные с кого берут пошлины или подати? с сынов ли своих, или с посторонних?"'
                  : '"\'What do you think, Simon?\' he asked. \'From whom do the kings of the earth collect duty and taxes — from their own sons or from others?\'"'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 4 · CAST YOUR LINE ════════════════════ */}
      {/* Light background from the start — the section's text colors are dark,
          so a tall dark→light gradient would swallow the heading at the top */}
      <section id="sec-4" style={{
        background: 'linear-gradient(180deg,#c9ecf4,#e0f7fa)',
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
            {isRu ? '🎣 РАЗДЕЛ 4 · ЗАБРОСЬ УДОЧКУ 🎣' : '🎣 SECTION 4 · CAST YOUR LINE 🎣'}
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
              {isRu ? 'Бог знает, что тебе нужно' : 'God Knows What You Need'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: ACCENT_DARK,
              marginBottom: 20, lineHeight: 1.2,
            }}>
              {isRu ? 'Забрось удочку' : 'Cast Your Line'}
            </h2>

            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: '#134e5e',
              lineHeight: 1.8, marginBottom: 16,
            }}>
              {isRu
                ? 'Пётр был рыбаком всю жизнь — но такой рыбалки у него ещё не было. Одна удочка. Одна рыба. Одна монета — ровно столько, сколько нужно, ровно в тот момент, когда нужно.'
                : "Peter had been a fisherman all his life — but he'd never been on a fishing trip like this. One line. One fish. One coin — exactly enough, exactly on time."}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1.02rem', color: '#134e5e',
              lineHeight: 1.8, marginBottom: 28,
            }}>
              {isRu
                ? 'Теперь твоя очередь. В озере плавают рыбы, и каждая несёт одно слово стиха. Лови их по порядку — и собери обещание, которое Иисус доказал у этого самого озера.'
                : "Now it's your turn. Fish are swimming in the lake, and each one carries a word of a verse. Catch them in order — and build the promise Jesus proved at this very lake."}
            </p>

            {/* ── Activity 4: Fishing for the verse ────────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,.7)', borderRadius: 22,
              border: `1.5px solid ${ACCENT}`, padding: '22px 20px', marginBottom: 28,
              boxShadow: `0 4px 20px ${ACCENT_GLOW}`,
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.72rem',
                color: ACCENT_DARK, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '🎣 АКТИВНОСТЬ 4 · ПОЙМАЙ СТИХ' : '🎣 ACTIVITY 4 · CATCH THE VERSE'}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.95rem', color: ACCENT_DARK, marginBottom: 18,
              }}>
                {isRu
                  ? 'Лови рыб ПО ПОРЯДКУ слов стиха! Не та рыба — вильнёт хвостом и уплывёт.'
                  : "Tap the fish IN THE ORDER of the verse words! Tap the wrong fish and it just wiggles away."}
              </p>

              {/* Verse peek hint */}
              {!done.has('fish') && (
                <div style={{ marginBottom: 16 }}>
                  <button
                    onClick={() => setVersePeek(v => !v)}
                    style={{
                      padding: '8px 16px', borderRadius: 999,
                      background: versePeek ? ACCENT : 'rgba(14,116,144,.1)',
                      color: versePeek ? '#fff' : ACCENT_DARK,
                      border: `1.5px solid ${ACCENT}`,
                      fontFamily: 'var(--font-nunito)', fontWeight: 900,
                      fontSize: '0.8rem', cursor: 'pointer',
                    }}
                  >
                    {versePeek
                      ? (isRu ? '🙈 Скрыть стих' : '🙈 Hide the verse')
                      : (isRu ? '📜 Подсмотреть стих' : '📜 Peek at the verse')}
                  </button>
                  {versePeek && (
                    <p style={{
                      marginTop: 10, marginBottom: 0, padding: '10px 16px',
                      background: 'rgba(14,116,144,.08)', borderRadius: 12,
                      border: `1.5px dashed ${ACCENT}`,
                      fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                      fontSize: '0.95rem', color: ACCENT_DARK, textAlign: 'center',
                    }}>
                      {isRu ? '«Отец ваш знает, что нужно»' : '"Your Father knows what you need"'}
                    </p>
                  )}
                </div>
              )}

              {done.has('fish') ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🎣🪙⭐</div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 900,
                    color: ACCENT_DARK, fontSize: '1.05rem', marginBottom: 12,
                  }}>
                    {isRu
                      ? 'Отличный улов! Ты собрал весь стих!'
                      : 'Great catch! You landed the whole verse!'}
                  </p>
                  <div style={{
                    fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                    fontSize: '1rem', color: ACCENT_DARK, padding: '12px 18px',
                    background: ACCENT_GLOW, borderRadius: 12,
                    border: `1.5px solid ${ACCENT}`,
                  }}>
                    {isRu
                      ? '«Отец ваш знает, что нужно» — Мф 6:8'
                      : '"Your Father knows what you need" — Matthew 6:8'}
                  </div>
                </div>
              ) : (
                <>
                  {/* The lake */}
                  <div style={{
                    position: 'relative', height: 340, overflow: 'hidden',
                    borderRadius: 20, marginBottom: 14,
                    background: 'linear-gradient(180deg,#67e8f9,#22d3ee 30%,#0e7490 75%,#155e75)',
                    border: `2px solid ${ACCENT_DARK}`,
                  }}>
                    {/* water sparkle */}
                    <div style={{
                      position: 'absolute', top: 8, left: 0, right: 0, textAlign: 'center',
                      fontSize: '0.85rem', opacity: .6, pointerEvents: 'none',
                    }}>
                      〰️〰️〰️〰️〰️
                    </div>
                    {FISH_WORDS.map((word, i) => {
                      if (i < fishCaught) return null // already caught & landed
                      const slot = LAKE_SLOTS[FISH_SLOTS[i]]
                      const catching = fishFlash === i
                      const wiggling = fishWrong === i
                      return (
                        <div
                          key={`${isRu ? 'ru' : 'en'}-${i}`}
                          onClick={() => tapFish(i)}
                          style={{
                            position: 'absolute',
                            top: `${slot.top}%`,
                            animationName: slot.dir === 1 ? 'fishDriftR' : 'fishDriftL',
                            animationDuration: `${slot.dur}s`,
                            animationTimingFunction: 'linear',
                            animationIterationCount: 'infinite',
                            animationDelay: `${slot.delay}s`,
                            animationPlayState: catching ? 'paused' : 'running',
                            cursor: 'pointer', userSelect: 'none',
                            textAlign: 'center', zIndex: 2,
                            // Generous invisible hit area for small thumbs on a moving target
                            padding: '10px 14px', margin: '-10px -14px',
                          }}
                        >
                          <div style={{
                            animation: wiggling
                              ? 'fishWiggle .45s ease'
                              : catching
                              ? 'coinCatch .65s ease forwards'
                              : `fishBob ${2.2 + (i % 3) * 0.6}s ease-in-out infinite`,
                          }}>
                            <div style={{
                              fontSize: '2.1rem', lineHeight: 1,
                              transform: !catching && slot.dir === 1 ? 'scaleX(-1)' : undefined,
                              filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.3))',
                            }}>
                              {catching ? '🪙' : '🐟'}
                            </div>
                            <div style={{
                              marginTop: 2, padding: '3px 9px', borderRadius: 999,
                              background: 'rgba(255,255,255,.92)',
                              border: `1.5px solid ${ACCENT_DARK}`,
                              fontFamily: 'var(--font-nunito)', fontWeight: 900,
                              fontSize: '0.72rem', color: ACCENT_DARK,
                              display: 'inline-block', whiteSpace: 'nowrap',
                            }}>
                              {word}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Answer row — the landed words */}
                  <div style={{
                    minHeight: 56, padding: '10px 12px',
                    background: 'rgba(14,116,144,.08)',
                    borderRadius: 12,
                    border: `2px dashed ${ACCENT}`,
                    display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
                    justifyContent: 'center', marginBottom: 10,
                  }}>
                    {fishCaught === 0 ? (
                      <span style={{
                        fontFamily: 'var(--font-nunito)', fontSize: '0.85rem',
                        color: 'rgba(21,94,117,.5)', fontWeight: 700,
                      }}>
                        {isRu ? '🪣 Твоё ведро пока пустое — лови первую рыбу!' : '🪣 Your bucket is empty — catch the first fish!'}
                      </span>
                    ) : (
                      FISH_WORDS.map((word, i) =>
                        i < fishCaught ? (
                          <span key={i} style={{
                            padding: '9px 14px', borderRadius: 10,
                            background: ACCENT, color: '#fff',
                            border: `2px solid ${ACCENT_DARK}`,
                            fontFamily: 'var(--font-nunito)', fontWeight: 900,
                            fontSize: '0.9rem', display: 'inline-block',
                            animation: i === fishCaught - 1 ? 'coinLand .4s ease' : undefined,
                          }}>
                            🪙 {word}
                          </span>
                        ) : (
                          <span key={i} style={{
                            padding: '9px 14px', borderRadius: 10,
                            background: 'rgba(255,255,255,.5)',
                            border: '2px dashed rgba(21,94,117,.35)',
                            fontFamily: 'var(--font-nunito)', fontWeight: 900,
                            fontSize: '0.9rem', color: 'rgba(21,94,117,.35)',
                            display: 'inline-block',
                          }}>
                            ・・・
                          </span>
                        )
                      )
                    )}
                  </div>

                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 700,
                    fontSize: '0.82rem', color: 'rgba(21,94,117,.7)',
                    textAlign: 'center', margin: 0,
                  }}>
                    {isRu
                      ? `Поймано: ${fishCaught} из ${FISH_WORDS.length}`
                      : `Caught: ${fishCaught} of ${FISH_WORDS.length}`}
                  </p>
                </>
              )}
            </div>

            {/* Post-fishing connection + reflection */}
            {done.has('fish') && (
              <>
                <div style={{
                  padding: '22px', marginBottom: 20,
                  background: '#fff', borderRadius: 18,
                  border: `2px solid ${ACCENT}`,
                  boxShadow: `0 6px 24px ${ACCENT_GLOW}`,
                }}>
                  <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 12 }}>🐟➡️🪙</div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 800,
                    fontSize: '0.98rem', color: ACCENT_DARK,
                    lineHeight: 1.7, textAlign: 'center', margin: 0,
                  }}>
                    {isRu
                      ? 'Иисус доказал это у озера: Бог знал о налоге прежде вопроса Петра, и монета уже была готова. Отец ваш знает, что вам нужно — прежде вашей просьбы. (Мф 6:8)'
                      : 'Jesus proved it at the lake: God knew about the tax before Peter asked, and He had the coin ready. Your Father knows what you need — before you ask Him. (Matthew 6:8)'}
                  </p>
                </div>

                <div style={{
                  padding: '24px 22px', marginBottom: 20,
                  background: ACCENT_GLOW, borderRadius: 18,
                  border: `2px solid ${ACCENT}`,
                }}>
                  <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 14 }}>🙏</div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 900,
                    fontSize: '1.05rem', color: ACCENT_DARK,
                    lineHeight: 1.65, textAlign: 'center', marginBottom: 0,
                  }}>
                    {isRu
                      ? 'Есть ли что-то, что нужно твоей семье прямо сейчас? Расскажи Богу — Он может ответить так, как никто не ожидает.'
                      : 'Is there something your family needs right now? Tell God about it — He may answer in a way nobody expects.'}
                  </p>
                </div>

                {/* ── The Coin Challenge: this week's call to action ──────── */}
                <div style={{
                  padding: '24px 22px', marginBottom: 28,
                  background: 'linear-gradient(135deg,#fbbf2418,#f9731618)', borderRadius: 18,
                  border: '2px solid #d97706',
                }}>
                  <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 8 }}>🪙</div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.75rem',
                    color: '#b45309', letterSpacing: 2, textTransform: 'uppercase',
                    textAlign: 'center', marginBottom: 10,
                  }}>
                    {isRu ? 'Задание на неделю · Вызов монеты' : "This Week's Mission · The Coin Challenge"}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-lora)', fontSize: '0.98rem', color: '#78350f',
                    lineHeight: 1.7, marginBottom: 14, textAlign: 'center',
                  }}>
                    {isRu
                      ? 'Иисус сделал то, что НЕ был должен делать — добровольно, ради других. Теперь твоя очередь. Выбери на этой неделе ОДНО дело, которое ты не обязан делать, — и сделай его с радостью:'
                      : "Jesus did something He did NOT have to do — willingly, for others. Now it's your turn. Pick ONE thing this week that you don't have to do — and do it anyway, with joy:"}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    {(isRu ? [
                      ['🚪', 'Пропусти кого-то вперёд — уступи своё место или очередь'],
                      ['🧹', 'Сделай дело по дому, о котором никто не просил'],
                      ['🎁', 'Поделись тем, что принадлежит тебе'],
                      ['🤝', 'Помоги брату, сестре или другу с чем-то трудным'],
                    ] : [
                      ['🚪', 'Let someone go first — give up your spot or your turn'],
                      ['🧹', 'Do a chore nobody asked you to do'],
                      ['🎁', 'Share something that belongs to you'],
                      ['🤝', 'Help a sibling or friend with something hard'],
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
                      ? 'Секретное правило: не объявляй об этом и не жди награды. Сделай тихо — как Сын, который заплатил монетой из рыбы.'
                      : "Secret rule: don't announce it, don't expect a reward. Do it quietly — like the Son who paid with a coin from a fish."}
                  </p>
                </div>
              </>
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
                {isRu ? 'Матфея 6:8' : 'Matthew 6:8'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '1rem', color: ACCENT_DARK, lineHeight: 1.8, margin: 0,
              }}>
                {isRu
                  ? '"…знает Отец ваш, в чём вы имеете нужду, прежде вашего прошения у Него."'
                  : '"…your Father knows what you need before you ask him."'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── Back link ────────────────────────────────────────────────────── */}
      <section style={{
        background: '#e0f7fa', padding: '28px 20px', textAlign: 'center',
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
