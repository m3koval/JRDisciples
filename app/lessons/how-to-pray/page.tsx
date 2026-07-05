'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// ─── Theme ────────────────────────────────────────────────────────────────────
const ACCENT      = '#7c3aed'
const ACCENT_DARK = '#4c1d95'
const ACCENT_GLOW = 'rgba(124,58,237,.15)'

// ─── Section unlock requirements ─────────────────────────────────────────────
const SECTION_REQS: Record<number, string[]> = {
  1: ['flip'],
  2: ['sort'],
  3: ['worry'],
  4: ['prayer'],
}

// ─── Section 1: Flip card data ────────────────────────────────────────────────
const FLIP_CARDS_EN = [
  {
    id: 'father',
    front: 'God is FATHER 👨',
    back: "He's not a stranger. He loves you more than the greatest parent ever could. You can talk to Him like a Dad.",
  },
  {
    id: 'holy',
    front: 'God is HOLY ✨',
    back: 'He is perfectly good — no evil, no mistakes. When we pray, we come to Someone truly great.',
  },
  {
    id: 'close',
    front: 'God is CLOSE 🤲',
    back: 'He is not far away in space. The Holy Spirit lives IN you right now. He\'s already here.',
  },
  {
    id: 'listening',
    front: 'God is LISTENING 👂',
    back: 'He hears every word before you even say it out loud. Nothing is too small or too big for Him.',
  },
]
const FLIP_CARDS_RU = [
  {
    id: 'father',
    front: 'Бог — ОТЕЦ 👨',
    back: 'Он не чужой. Он любит тебя больше, чем любой родитель. Говори с Ним как с Папой.',
  },
  {
    id: 'holy',
    front: 'Бог — СВЯТОЙ ✨',
    back: 'Он совершенно хорош — без зла, без ошибок. В молитве мы приходим к по-настоящему великому Богу.',
  },
  {
    id: 'close',
    front: 'Бог — РЯДОМ 🤲',
    back: 'Он не далеко где-то. Святой Дух живёт В тебе прямо сейчас. Он уже здесь.',
  },
  {
    id: 'listening',
    front: 'Бог — СЛЫШИТ 👂',
    back: 'Он слышит каждое слово ещё до того, как ты его скажешь. Ничто не слишком мало или велико.',
  },
]

// ─── Section 2: Sort activity data ───────────────────────────────────────────
type SortItem = { id: string; textEn: string; textRu: string; answer: 'HUMBLE' | 'PROUD' }
const SORT_ITEMS: SortItem[] = [
  { id: 's1', textEn: "I did everything right today — I don't need God's help.",       textRu: 'Сегодня я всё сделал правильно — мне не нужна помощь Бога.', answer: 'PROUD'  },
  { id: 's2', textEn: 'God, please forgive me for getting angry at my sister.',          textRu: 'Боже, прости меня за злость на сестру.',                       answer: 'HUMBLE' },
  { id: 's3', textEn: "I never mess up as much as other kids.",                          textRu: 'Я никогда не ошибаюсь так, как другие дети.',                  answer: 'PROUD'  },
  { id: 's4', textEn: "I made a mistake. I'm sorry. Can we talk?",                      textRu: 'Я ошибся. Прости. Можем поговорить?',                         answer: 'HUMBLE' },
  { id: 's5', textEn: "I'm fine on my own — I'll figure it out.",                       textRu: 'Я справлюсь сам — разберусь.',                                 answer: 'PROUD'  },
  { id: 's6', textEn: "I need You, God. I can't do this without You.",                  textRu: 'Мне нужен Ты, Боже. Я не могу без Тебя.',                     answer: 'HUMBLE' },
]

// ─── Section 3: Worry tiles ───────────────────────────────────────────────────
const WORRY_TILES = [
  { id: 'w1', emoji: '🎒', en: 'School is hard',    ru: 'В школе трудно'             },
  { id: 'w2', emoji: '🥺', en: 'Feeling lonely',    ru: 'Чувствую себя одиноким'     },
  { id: 'w3', emoji: '🤒', en: 'Getting sick',       ru: 'Болею'                      },
  { id: 'w4', emoji: '👨‍👩‍👧', en: 'My family',        ru: 'Моя семья'                 },
  { id: 'w5', emoji: '😨', en: 'Something scary',   ru: 'Что-то страшное'            },
]

// ─── Section 4: Prayer builder data ──────────────────────────────────────────
const PRAISE_EN  = ['Holy', 'My Father', 'Always with me', 'Listening right now', 'Powerful', 'Good']
const PRAISE_RU  = ['Святой', 'Мой Отец', 'Всегда со мной', 'Слушаешь меня', 'Всесильный', 'Добрый']

const HONEST_EN  = ['Getting angry', 'Being unkind', 'Worrying instead of praying', 'Not listening to my parents', 'Being selfish']
const HONEST_RU  = ['Злость', 'Грубость', 'Беспокойство вместо молитвы', 'Непослушание родителям', 'Эгоизм']

const ASKING_EN  = ['School', 'Feeling brave', 'My family', 'A friend', 'Not being afraid', 'Something I can\'t say']
const ASKING_RU  = ['Школой', 'Смелостью', 'Моей семьёй', 'Другом', 'Страхом', 'Тем, что трудно сказать']

// ─── Component ────────────────────────────────────────────────────────────────
export default function HowToPrayPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  // ── Progress ───────────────────────────────────────────────────────────────
  const [unlocked, setUnlocked] = useState<Set<number>>(() => {
    try {
      const u = typeof window !== 'undefined' && localStorage.getItem('how-to-pray_unlocked')
      if (u) return new Set(JSON.parse(u) as number[])
    } catch { /* ignore */ }
    return new Set([1])
  })
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      const d = typeof window !== 'undefined' && localStorage.getItem('how-to-pray_done')
      if (d) return new Set(JSON.parse(d) as string[])
    } catch { /* ignore */ }
    return new Set()
  })
  const [won, setWon] = useState(false)

  useEffect(() => {
    localStorage.setItem('how-to-pray_unlocked', JSON.stringify([...unlocked]))
    localStorage.setItem('how-to-pray_done',     JSON.stringify([...done]))
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
        }, 1800)
      } else {
        setTimeout(() => setWon(true), 700)
      }
    }
  }

  const secDoneCount = Object.entries(SECTION_REQS).filter(([, reqs]) => reqs.every(r => done.has(r))).length
  const progressIcons = Array.from({ length: 4 }, (_, i) =>
    i < secDoneCount ? '⭐' : unlocked.has(i + 1) ? '☆' : '🔒'
  ).join(' ')

  // ── Activity 1: Flip cards ────────────────────────────────────────────────
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  function flipCard(id: string) {
    if (done.has('flip')) return
    const next = new Set([...flipped, id])
    setFlipped(next)
    const cards = isRu ? FLIP_CARDS_RU : FLIP_CARDS_EN
    if (cards.every(c => next.has(c.id))) solve('flip', 1)
  }

  // ── Activity 2: Sort activity ─────────────────────────────────────────────
  const [sortAnswers, setSortAnswers] = useState<Record<string, 'HUMBLE' | 'PROUD' | null>>({})
  const [sortChecked, setSortChecked] = useState<Record<string, boolean>>({})

  function placeSortItem(id: string, column: 'HUMBLE' | 'PROUD') {
    if (done.has('sort')) return
    const item = SORT_ITEMS.find(s => s.id === id)
    if (!item) return
    const isCorrect = item.answer === column
    const newAnswers = { ...sortAnswers, [id]: column }
    const newChecked = { ...sortChecked, [id]: true }
    setSortAnswers(newAnswers)
    setSortChecked(newChecked)
    if (SORT_ITEMS.every(s => newAnswers[s.id] === s.answer)) {
      solve('sort', 2)
    }
  }

  function resetSort() {
    setSortAnswers({})
    setSortChecked({})
  }

  // ── Activity 3: Worry tiles ───────────────────────────────────────────────
  const [givenWorries, setGivenWorries] = useState<Set<string>>(new Set())

  function giveWorry(id: string) {
    if (done.has('worry')) return
    const next = new Set([...givenWorries, id])
    setGivenWorries(next)
    if (WORRY_TILES.every(w => next.has(w.id))) solve('worry', 3)
  }

  // ── Activity 4: Prayer builder ────────────────────────────────────────────
  const [praiseSelected,  setPraiseSelected]  = useState<Set<string>>(new Set())
  const [honestSelected,  setHonestSelected]  = useState<Set<string>>(new Set())
  const [askingSelected,  setAskingSelected]  = useState<Set<string>>(new Set())
  const [prayerBuilt,     setPrayerBuilt]     = useState(false)

  function togglePraise(item: string) {
    if (prayerBuilt) return
    setPraiseSelected(prev => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }
  function toggleHonest(item: string) {
    if (prayerBuilt) return
    setHonestSelected(prev => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }
  function toggleAsking(item: string) {
    if (prayerBuilt) return
    setAskingSelected(prev => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }

  const prayerReady = praiseSelected.size > 0 && honestSelected.size > 0 && askingSelected.size > 0

  function buildPrayer() {
    if (!prayerReady) return
    setPrayerBuilt(true)
  }

  function completePrayer() {
    solve('prayer', 4)
  }

  function resetAll() {
    if (!confirm(isRu ? 'Сбросить весь прогресс?' : 'Reset all progress?')) return
    localStorage.removeItem('how-to-pray_unlocked')
    localStorage.removeItem('how-to-pray_done')
    window.location.reload()
  }

  // ── Active data refs ───────────────────────────────────────────────────────
  const FLIP_ACTIVE   = isRu ? FLIP_CARDS_RU : FLIP_CARDS_EN
  const PRAISE_ACTIVE = isRu ? PRAISE_RU     : PRAISE_EN
  const HONEST_ACTIVE = isRu ? HONEST_RU     : HONEST_EN
  const ASKING_ACTIVE = isRu ? ASKING_RU     : ASKING_EN

  // ── Option chip style ──────────────────────────────────────────────────────
  function chipStyle(selected: boolean): React.CSSProperties {
    return {
      padding: '9px 16px',
      borderRadius: 20,
      border: `2px solid ${selected ? ACCENT : 'rgba(255,255,255,.22)'}`,
      background: selected ? ACCENT : 'rgba(255,255,255,.08)',
      color: selected ? '#fff' : 'rgba(255,255,255,.85)',
      fontFamily: 'var(--font-nunito)',
      fontWeight: 800,
      fontSize: '0.88rem',
      cursor: 'pointer',
      userSelect: 'none' as const,
      transition: 'all .18s',
      transform: selected ? 'scale(1.04)' : 'scale(1)',
      boxShadow: selected ? `0 0 0 3px ${ACCENT_GLOW}` : 'none',
    }
  }

  // ════════════════════ JSX ══════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#1a0a2e,#1f0f3c 40%,#f0eaff)', fontFamily: 'var(--font-lora), serif' }}>

      {/* ── Win Screen ────────────────────────────────────────────── */}
      {won && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,4,28,.97)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 30,
        }}>
          <div style={{ fontSize: '4.5rem', marginBottom: 18 }}>🙏</div>
          <h2 style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: 'clamp(1.4rem,4vw,2rem)',
            color: '#e9d5ff', marginBottom: 16, lineHeight: 1.35, maxWidth: 480,
            textShadow: `0 0 40px ${ACCENT_GLOW}`,
          }}>
            {isRu
              ? 'Молитва — это просто разговор с Отцом, который уже любит тебя.'
              : 'Prayer is just talking to your Father who already loves you.'}
          </h2>
          <div style={{
            fontFamily: 'var(--font-lora)', fontStyle: 'italic',
            fontSize: '1rem', color: 'rgba(233,213,255,.8)',
            lineHeight: 1.75, maxWidth: 460,
            padding: '18px 22px',
            background: 'rgba(124,58,237,.18)',
            borderRadius: 16, border: `1.5px solid ${ACCENT}`,
            marginBottom: 28,
          }}>
            {isRu
              ? '"Не заботьтесь ни о чём, но всегда в молитве и прошении с благодарением открывайте свои желания пред Богом." — Фил. 4:6'
              : '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." — Philippians 4:6'}
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => setWon(false)} style={{
              padding: '13px 30px',
              background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
              color: '#fff', border: 'none', borderRadius: 18,
              fontFamily: 'var(--font-nunito)', fontSize: '1rem', fontWeight: 900, cursor: 'pointer',
            }}>
              {isRu ? '← Вернуться к уроку' : '← Back to Lesson'}
            </button>
            <Link href="/lessons" style={{
              padding: '13px 30px',
              background: 'rgba(255,255,255,.1)',
              color: '#e9d5ff', border: `2px solid ${ACCENT}`, borderRadius: 18,
              fontFamily: 'var(--font-nunito)', fontSize: '1rem', fontWeight: 900,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            }}>
              {isRu ? 'Все уроки' : 'All Lessons'}
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        background: `radial-gradient(ellipse at 50% 35%, rgba(124,58,237,.45) 0%, rgba(26,10,46,.0) 70%), linear-gradient(180deg,#1a0a2e,#2d1060)`,
        padding: '64px 20px 52px',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ fontSize: '5rem', marginBottom: 20, filter: 'drop-shadow(0 4px 24px rgba(124,58,237,.6))' }}>🙏</div>
        <h1 style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 900,
          fontSize: 'clamp(1.9rem,5.5vw,3rem)',
          color: '#e9d5ff', marginBottom: 10,
          textShadow: `0 2px 24px rgba(124,58,237,.5)`,
        }}>
          {isRu ? 'Как разговаривать с Богом' : 'How to Talk to God'}
        </h1>
        <p style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 800,
          fontSize: '0.95rem', color: 'rgba(233,213,255,.75)',
          letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20,
        }}>
          {isRu ? 'Урок о молитве · Ages 6–12' : 'A Lesson on Prayer · Ages 6–12'}
        </p>
        <div style={{
          fontFamily: 'var(--font-lora)', fontStyle: 'italic',
          fontSize: '1.05rem', color: 'rgba(233,213,255,.72)',
          maxWidth: 520, lineHeight: 1.75,
        }}>
          {isRu
            ? '"Не заботьтесь ни о чём, но всегда в молитве... открывайте свои желания пред Богом." — Фил. 4:6'
            : '"Do not be anxious about anything, but in every situation, by prayer... present your requests to God." — Philippians 4:6'}
        </div>
      </section>

      {/* ── Progress bar ──────────────────────────────────────────── */}
      <div style={{
        background: ACCENT_GLOW,
        borderBottom: `2px solid ${ACCENT}`,
        padding: '10px 20px', textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 900,
          fontSize: '0.95rem', color: ACCENT_DARK, letterSpacing: 1,
        }}>
          {isRu ? '🙏 ПРОГРЕСС' : '🙏 PROGRESS'} {progressIcons} {secDoneCount}/4
        </span>
        <button onClick={resetAll} style={{
          marginLeft: 16,
          fontFamily: 'var(--font-nunito)', fontSize: '0.7rem', fontWeight: 900,
          color: '#aaa', background: 'none', border: 'none', cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          {isRu ? 'сбросить' : 'reset'}
        </button>
      </div>

      {/* ════════════════ SECTION 1 — WHO ARE YOU TALKING TO? ════════ */}
      <section id="sec-1" style={{ padding: '0 0 8px' }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: '0.9rem', color: '#fff', margin: 0,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '👨 РАЗДЕЛ 1 · КТО ПРИНИМАЕТ ТВОЮ МОЛИТВУ? 👨' : '👨 SECTION 1 · WHO ARE YOU TALKING TO? 👨'}
          </p>
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 44px' }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: '0.78rem', color: ACCENT,
            letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6,
          }}>
            {isRu ? 'Познакомься с Богом' : 'Get to Know God First'}
          </p>
          <h2 style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: 'clamp(1.5rem,4vw,2.1rem)',
            color: '#1a0a2e', marginBottom: 18, lineHeight: 1.2,
          }}>
            {isRu ? 'Кто принимает твою молитву?' : 'Who Are You Talking To?'}
          </h2>
          <p style={{
            fontFamily: 'var(--font-lora)', fontSize: '1rem',
            color: '#3b2468', lineHeight: 1.75, marginBottom: 14,
          }}>
            {isRu
              ? 'Прежде чем молиться, важно понять — кому ты молишься! Бог — не далёкая невидимая сила. Он личность, и вот четыре важные вещи, которые нужно знать о Нём.'
              : 'Before you pray, it helps to know who you\'re praying to! God isn\'t a faraway invisible force. He is a Person, and here are four important things to know about Him.'}
          </p>
          <p style={{
            fontFamily: 'var(--font-lora)', fontSize: '1rem',
            color: '#3b2468', lineHeight: 1.75, marginBottom: 18,
          }}>
            {isRu
              ? 'Даниил знал Бога лично — и поэтому молился Ему даже под угрозой смерти (Даниил 6). Когда знаешь, кому молишься, молитва становится естественной!'
              : 'Daniel knew God personally — that\'s why he prayed even when his life was in danger (Daniel 6). When you know who you\'re praying to, prayer feels natural!'}
          </p>

          {/* Activity 1: Flip cards */}
          <div style={{
            background: 'rgba(124,58,237,.07)', borderRadius: 22,
            border: `1.5px solid rgba(124,58,237,.22)`,
            padding: '24px 20px', marginTop: 12,
          }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: '0.72rem', color: ACCENT,
              letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6,
            }}>
              {isRu ? '🃏 АКТИВНОСТЬ 1 · ПЕРЕВЕРНИ ВСЕ КАРТОЧКИ' : '🃏 ACTIVITY 1 · FLIP ALL CARDS'}
            </p>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 700,
              fontSize: '0.93rem', color: '#3b2468', marginBottom: 16,
            }}>
              {isRu
                ? 'Нажми на каждую карточку, чтобы узнать что-то важное о Боге!'
                : 'Tap each card to discover something important about God!'}
            </p>

            {done.has('flip') && (
              <div style={{ textAlign: 'center', padding: '4px 0 18px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>✅</div>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#2a7a2a', margin: 0 }}>
                  {isRu ? 'Ты познакомился с Богом, с Которым разговариваешь! Перечитай карточки ниже.' : "You've met the God you're talking to! Read the cards again below."}
                </p>
              </div>
            )}
            <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
                  {FLIP_ACTIVE.map(card => {
                    const isFlipped = done.has('flip') || flipped.has(card.id)
                    return (
                      <div
                        key={card.id}
                        onClick={() => !isFlipped && flipCard(card.id)}
                        style={{
                          flex: '1 1 180px', maxWidth: 240, minHeight: 200,
                          perspective: '800px',
                          cursor: isFlipped ? 'default' : 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        <div style={{
                          position: 'relative', width: '100%', height: '100%', minHeight: 200,
                          transformStyle: 'preserve-3d',
                          transition: 'transform 0.55s ease',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}>
                          {/* Front */}
                          <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            borderRadius: 18, padding: '22px 14px',
                            background: '#fff',
                            border: `2.5px solid rgba(124,58,237,.22)`,
                            boxShadow: '0 4px 18px rgba(124,58,237,.12)',
                            textAlign: 'center',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                          }}>
                            <div style={{
                              fontFamily: 'var(--font-nunito)', fontWeight: 900,
                              fontSize: '1rem', color: ACCENT_DARK, lineHeight: 1.35, marginBottom: 16,
                            }}>
                              {card.front}
                            </div>
                            <div style={{
                              fontFamily: 'var(--font-nunito)', fontSize: '0.65rem',
                              fontWeight: 900, letterSpacing: 2, color: '#bbb',
                              textTransform: 'uppercase',
                            }}>
                              {isRu ? 'Нажми ▾' : 'Tap ▾'}
                            </div>
                          </div>
                          {/* Back */}
                          <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            borderRadius: 18, padding: '18px 14px',
                            background: ACCENT_GLOW,
                            border: `2.5px solid ${ACCENT}`,
                            boxShadow: '0 4px 18px rgba(124,58,237,.18)',
                            textAlign: 'center',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                          }}>
                            <div style={{
                              fontFamily: 'var(--font-nunito)', fontWeight: 900,
                              fontSize: '0.78rem', color: ACCENT, marginBottom: 10,
                            }}>
                              {card.front}
                            </div>
                            <p style={{
                              fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                              fontSize: '0.83rem', color: '#3b2468',
                              lineHeight: 1.6, margin: 0,
                            }}>
                              {card.back}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {!done.has('flip') && (
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 800,
                    fontSize: '0.82rem', color: '#888',
                    textAlign: 'center', marginTop: 14,
                  }}>
                    {isRu
                      ? `Открыто: ${flipped.size} из ${FLIP_ACTIVE.length}`
                      : `Revealed: ${flipped.size} of ${FLIP_ACTIVE.length}`}
                  </p>
                )}
            </>
          </div>

          {/* Daniel connection callout — shown after section 1 done */}
          {done.has('flip') && (
            <div style={{
              marginTop: 28, padding: '20px 22px',
              background: 'rgba(124,58,237,.1)',
              border: `2px solid ${ACCENT}`,
              borderRadius: 16,
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900,
                fontSize: '0.75rem', color: ACCENT,
                letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
              }}>
                🦁 {isRu ? 'Связь с Даниилом' : 'Daniel Connection'}
              </p>
              <p style={{
                fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                fontSize: '0.97rem', color: '#3b2468', lineHeight: 1.7, margin: 0,
              }}>
                {isRu
                  ? 'Даниил молился Богу, которого знал ЛИЧНО — не чужому. Поэтому он не боялся, даже когда ждали львы.'
                  : "Daniel prayed to a God he KNEW personally — not a stranger. That's why he wasn't afraid even with the lions waiting."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ SECTION 2 — COME HONEST ════════════════════ */}
      <section id="sec-2" style={{ padding: '0 0 8px', background: 'rgba(255,255,255,.03)' }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: '0.9rem', color: '#fff', margin: 0,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '🙇 РАЗДЕЛ 2 · ПРИХОДИ ЧЕСТНЫМ 🙇' : '🙇 SECTION 2 · COME HONEST 🙇'}
          </p>
        </div>

        {!unlocked.has(2) ? (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
            <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: '#9ca3af', fontSize: '1rem' }}>
              {isRu ? 'Заверши Раздел 1, чтобы открыть этот раздел!' : 'Complete Section 1 to unlock this section!'}
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 44px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: '0.78rem', color: ACCENT,
              letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6,
            }}>
              {isRu ? 'Матфея 6:9–13 · Молитва Господня' : 'Matthew 6:9–13 · The Lord\'s Prayer'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.1rem)',
              color: '#e9d5ff', marginBottom: 18, lineHeight: 1.2,
            }}>
              {isRu ? 'Приходи честным' : 'Come Honest'}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1rem',
              color: 'rgba(233,213,255,.8)', lineHeight: 1.75, marginBottom: 14,
            }}>
              {isRu
                ? 'Иисус научил нас, что молитва — это не соревнование в том, кто звучит умнее или лучше. Бог хочет, чтобы мы приходили к Нему честно. Это значит — признавать, что нам нужна Его помощь, и просить прощения, когда мы ошибаемся.'
                : "Jesus taught us that prayer isn't a competition to see who sounds smartest or best. God wants us to come to Him honestly. That means admitting we need His help and asking forgiveness when we mess up."}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1rem',
              color: 'rgba(233,213,255,.8)', lineHeight: 1.75, marginBottom: 24,
            }}>
              {isRu
                ? 'В Молитве Господней Иисус показывает нам разницу между тем, кто приходит к Богу с гордостью, и тем, кто приходит со смирением. Пройди сортировку и узнай разницу!'
                : "In the Lord's Prayer, Jesus shows us the difference between coming to God with pride vs. humility. Sort the statements below and discover the difference!"}
            </p>

            {/* Activity 2: Sort */}
            <div style={{
              background: 'rgba(255,255,255,.06)', borderRadius: 22,
              border: '1.5px solid rgba(255,255,255,.14)',
              padding: '24px 20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900,
                fontSize: '0.72rem', color: ACCENT,
                letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '⚖️ АКТИВНОСТЬ 2 · РАССОРТИРУЙ ВЫСКАЗЫВАНИЯ' : '⚖️ ACTIVITY 2 · SORT THE STATEMENTS'}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.93rem', color: 'rgba(233,213,255,.85)', marginBottom: 20,
              }}>
                {isRu
                  ? 'Нажми «Смиренно» или «Гордо» для каждого высказывания!'
                  : 'Tap HUMBLE or PROUD for each statement!'}
              </p>

              {done.has('sort') ? (
                <>
                  <div style={{ textAlign: 'center', padding: '4px 0 18px' }}>
                    <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>✅</div>
                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#4ade80', margin: 0 }}>
                      {isRu ? 'Отлично! Ты понимаешь разницу! Посмотри ещё раз ниже, что куда относится.' : 'Great job! You understand the difference! Review below which attitude is which.'}
                    </p>
                    <div style={{
                      marginTop: 18, padding: '16px 18px',
                      background: 'rgba(124,58,237,.2)', borderRadius: 14,
                      border: `1.5px solid ${ACCENT}`,
                      fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                      fontSize: '0.97rem', color: '#e9d5ff', lineHeight: 1.7,
                    }}>
                      {isRu
                        ? '"И прости нам долги наши, как и мы прощаем должникам нашим." — Матфея 6:12'
                        : '"Forgive us our debts, as we also have forgiven our debtors." — Matthew 6:12'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    {(['HUMBLE', 'PROUD'] as const).map(col => {
                      const isHumble = col === 'HUMBLE'
                      const colColor = isHumble ? '#4ade80' : '#f87171'
                      return (
                        <div key={col} style={{
                          flex: '1 1 280px',
                          background: isHumble ? 'rgba(74,222,128,.12)' : 'rgba(248,113,113,.12)',
                          border: `1.5px solid ${isHumble ? 'rgba(74,222,128,.5)' : 'rgba(248,113,113,.5)'}`,
                          borderRadius: 14, padding: '16px 14px',
                        }}>
                          <p style={{
                            fontFamily: 'var(--font-nunito)', fontWeight: 900,
                            fontSize: '0.82rem', color: colColor,
                            letterSpacing: 2, textTransform: 'uppercase',
                            textAlign: 'center', marginBottom: 12,
                          }}>
                            {isHumble
                              ? (isRu ? '🙇 СМИРЕННО' : '🙇 HUMBLE')
                              : (isRu ? '😤 ГОРДО' : '😤 PROUD')}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {SORT_ITEMS.filter(s => s.answer === col).map(item => (
                              <div key={item.id} style={{
                                background: 'rgba(255,255,255,.06)',
                                border: '1.5px solid rgba(255,255,255,.14)',
                                borderRadius: 12, padding: '10px 12px',
                              }}>
                                <p style={{
                                  fontFamily: 'var(--font-nunito)', fontWeight: 700,
                                  fontSize: '0.9rem', color: 'rgba(233,213,255,.9)',
                                  lineHeight: 1.45, margin: 0,
                                }}>
                                  <span style={{ color: colColor, fontWeight: 900 }}>✓ </span>
                                  {isRu ? item.textRu : item.textEn}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {SORT_ITEMS.map(item => {
                    const placed = sortAnswers[item.id]
                    const checked = sortChecked[item.id]
                    const isCorrect = placed === item.answer
                    return (
                      <div key={item.id} style={{
                        background: checked
                          ? isCorrect ? 'rgba(74,222,128,.12)' : 'rgba(248,113,113,.12)'
                          : 'rgba(255,255,255,.06)',
                        border: `1.5px solid ${checked
                          ? isCorrect ? 'rgba(74,222,128,.5)' : 'rgba(248,113,113,.5)'
                          : 'rgba(255,255,255,.14)'}`,
                        borderRadius: 14, padding: '14px 16px',
                        transition: 'all .2s',
                      }}>
                        <p style={{
                          fontFamily: 'var(--font-nunito)', fontWeight: 700,
                          fontSize: '0.93rem', color: 'rgba(233,213,255,.9)',
                          marginBottom: checked ? 8 : 10, lineHeight: 1.45,
                        }}>
                          {isRu ? item.textRu : item.textEn}
                        </p>
                        {checked ? (
                          <div style={{
                            fontFamily: 'var(--font-nunito)', fontWeight: 800,
                            fontSize: '0.82rem',
                            color: isCorrect ? '#4ade80' : '#f87171',
                          }}>
                            {isCorrect
                              ? (isRu ? `✅ Верно! Это — ${item.answer === 'HUMBLE' ? 'СМИРЕННО' : 'ГОРДО'}` : `✅ Correct! That's ${item.answer}`)
                              : (isRu ? `❌ Не совсем. Это — ${item.answer === 'HUMBLE' ? 'СМИРЕННО' : 'ГОРДО'}` : `❌ Not quite. That's ${item.answer}`)}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => placeSortItem(item.id, 'HUMBLE')} style={{
                              flex: 1, padding: '9px 0', borderRadius: 10,
                              background: 'rgba(74,222,128,.15)',
                              border: '2px solid rgba(74,222,128,.4)',
                              color: '#4ade80',
                              fontFamily: 'var(--font-nunito)', fontWeight: 900,
                              fontSize: '0.88rem', cursor: 'pointer',
                            }}>
                              {isRu ? '🙇 Смиренно' : '🙇 Humble'}
                            </button>
                            <button onClick={() => placeSortItem(item.id, 'PROUD')} style={{
                              flex: 1, padding: '9px 0', borderRadius: 10,
                              background: 'rgba(248,113,113,.15)',
                              border: '2px solid rgba(248,113,113,.4)',
                              color: '#f87171',
                              fontFamily: 'var(--font-nunito)', fontWeight: 900,
                              fontSize: '0.88rem', cursor: 'pointer',
                            }}>
                              {isRu ? '😤 Гордо' : '😤 Proud'}
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {Object.keys(sortChecked).length > 0 && !done.has('sort') && (
                    <button onClick={resetSort} style={{
                      marginTop: 4, padding: '9px 20px', borderRadius: 10, alignSelf: 'flex-start',
                      background: 'rgba(255,255,255,.08)', border: '1.5px solid rgba(255,255,255,.2)',
                      color: 'rgba(255,255,255,.6)',
                      fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                    }}>
                      {isRu ? '↺ Попробовать снова' : '↺ Try again'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 3 — GIVE YOUR WORRIES ══════════════ */}
      <section id="sec-3" style={{ padding: '0 0 8px' }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: '0.9rem', color: '#fff', margin: 0,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '🕊️ РАЗДЕЛ 3 · ОТДАЙ СВОИ ЗАБОТЫ БОГУ 🕊️' : '🕊️ SECTION 3 · GIVE YOUR WORRIES TO GOD 🕊️'}
          </p>
        </div>

        {!unlocked.has(3) ? (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
            <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: '#9ca3af', fontSize: '1rem' }}>
              {isRu ? 'Заверши Раздел 2, чтобы открыть этот раздел!' : 'Complete Section 2 to unlock this section!'}
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 44px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: '0.78rem', color: ACCENT,
              letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6,
            }}>
              {isRu ? 'Филиппийцам 4:6–7 · Не тревожься' : 'Philippians 4:6–7 · Don\'t Be Anxious'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.1rem)',
              color: '#1a0a2e', marginBottom: 18, lineHeight: 1.2,
            }}>
              {isRu ? 'Отдай свои заботы Богу' : 'Give Your Worries to God'}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1rem',
              color: '#3b2468', lineHeight: 1.75, marginBottom: 14,
            }}>
              {isRu
                ? 'У всех детей (и взрослых тоже!) бывают вещи, которые их тревожат. Апостол Павел написал что-то удивительное: не нужно тревожиться — вместо этого можно молиться! Бог хочет, чтобы ты «переложил» Ему все свои беспокойства.'
                : 'Every kid (and adult!) has things that worry them. The Apostle Paul wrote something amazing: instead of being anxious, you can pray! God wants you to hand your worries over to Him.'}
            </p>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1rem',
              color: '#3b2468', lineHeight: 1.75, marginBottom: 24,
            }}>
              {isRu
                ? 'Нажми на каждую заботу ниже, чтобы «отдать» её Богу. Посмотри, что происходит, когда ты отдаёшь их все!'
                : 'Tap each worry below to "hand it over" to God. See what happens when you give them all away!'}
            </p>

            {/* Activity 3: Worry tiles */}
            <div style={{
              background: 'rgba(124,58,237,.07)', borderRadius: 22,
              border: `1.5px solid rgba(124,58,237,.22)`,
              padding: '24px 20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 900,
                fontSize: '0.72rem', color: ACCENT,
                letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6,
              }}>
                {isRu ? '🤲 АКТИВНОСТЬ 3 · ОТДАЙ ВСЕ ЗАБОТЫ' : '🤲 ACTIVITY 3 · HAND OVER YOUR WORRIES'}
              </p>
              <p style={{
                fontFamily: 'var(--font-nunito)', fontWeight: 700,
                fontSize: '0.93rem', color: '#3b2468', marginBottom: 20,
              }}>
                {isRu
                  ? 'Нажми на каждую карточку с заботой, чтобы отдать её Богу!'
                  : 'Tap each worry card to give it to God!'}
              </p>

              {done.has('worry') && (
                <>
                  <div style={{
                    padding: '20px 22px',
                    background: ACCENT_GLOW,
                    border: `2px solid ${ACCENT}`,
                    borderRadius: 16, textAlign: 'center', marginBottom: 16,
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: 10 }}>🕊️</div>
                    <p style={{
                      fontFamily: 'var(--font-nunito)', fontWeight: 900,
                      fontSize: '0.95rem', color: '#2a7a2a', marginBottom: 12,
                    }}>
                      {isRu
                        ? '✅ Ты отдал Богу все свои заботы! Посмотри на них ещё раз ниже.'
                        : '✅ You handed every worry to God! See them all below.'}
                    </p>
                    <div style={{
                      fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                      fontSize: '0.97rem', color: ACCENT_DARK,
                      lineHeight: 1.75,
                    }}>
                      {isRu
                        ? '"И мир Божий, который превыше всякого ума, соблюдёт сердца ваши и помышления ваши во Христе Иисусе." — Фил. 4:7'
                        : '"And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." — Philippians 4:7'}
                    </div>
                  </div>
                  <div style={{
                    padding: '14px 18px',
                    background: 'rgba(124,58,237,.1)',
                    border: `1.5px solid rgba(124,58,237,.3)`,
                    borderRadius: 12, textAlign: 'center', marginBottom: 24,
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-nunito)', fontWeight: 800,
                      fontSize: '0.88rem', color: '#3b2468', lineHeight: 1.6, margin: 0,
                    }}>
                      🦁 {isRu
                        ? 'Даниил молился С БЛАГОДАРНОСТЬЮ даже в опасности (Даниил 6:10). И ты тоже можешь!'
                        : 'Daniel prayed WITH THANKSGIVING even in danger (Daniel 6:10). You can too.'}
                    </p>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: done.has('worry') ? 0 : 24 }}>
                {WORRY_TILES.map(tile => {
                  const given = done.has('worry') || givenWorries.has(tile.id)
                  return (
                    <div
                      key={tile.id}
                      onClick={() => !given && giveWorry(tile.id)}
                      style={{
                        flex: '1 1 140px', maxWidth: 180, minHeight: 120,
                        borderRadius: 18, padding: '18px 12px',
                        background: given
                          ? `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`
                          : '#fff',
                        border: `2.5px solid ${given ? ACCENT_DARK : 'rgba(124,58,237,.25)'}`,
                        boxShadow: given ? `0 4px 24px rgba(124,58,237,.3)` : '0 2px 12px rgba(0,0,0,.08)',
                        cursor: given ? 'default' : 'pointer',
                        userSelect: 'none',
                        textAlign: 'center',
                        transition: 'all .3s',
                        transform: given ? 'scale(1.04)' : 'scale(1)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <div style={{ fontSize: given ? '1.6rem' : '2rem', transition: 'font-size .3s' }}>
                        {given ? '✅' : tile.emoji}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-nunito)', fontWeight: 800,
                        fontSize: '0.88rem',
                        color: given ? '#fff' : '#3b2468',
                        lineHeight: 1.35,
                      }}>
                        {isRu ? tile.ru : tile.en}
                      </div>
                      {given && (
                        <div style={{
                          fontFamily: 'var(--font-nunito)', fontWeight: 900,
                          fontSize: '0.72rem', color: 'rgba(255,255,255,.8)',
                          letterSpacing: 1, textTransform: 'uppercase',
                        }}>
                          {isRu ? 'Отдано Богу' : 'Given to God'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {!done.has('worry') && (
                <p style={{
                  fontFamily: 'var(--font-nunito)', fontWeight: 800,
                  fontSize: '0.85rem', color: '#6b5a8a',
                  textAlign: 'center', margin: 0,
                }}>
                  {isRu
                    ? `Отдано: ${givenWorries.size} из ${WORRY_TILES.length}`
                    : `Handed over: ${givenWorries.size} of ${WORRY_TILES.length}`}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ════════════════ SECTION 4 — BUILD A PRAYER ═════════════════ */}
      <section id="sec-4" style={{ padding: '0 0 8px', background: 'rgba(255,255,255,.03)' }}>
        <div style={{
          background: `linear-gradient(135deg,${ACCENT_DARK},${ACCENT})`,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 900,
            fontSize: '0.9rem', color: '#fff', margin: 0,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {isRu ? '🏗️ РАЗДЕЛ 4 · ПОСТРОЙ МОЛИТВУ 🏗️' : '🏗️ SECTION 4 · BUILD A PRAYER 🏗️'}
          </p>
        </div>

        {!unlocked.has(4) ? (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
            <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: '#9ca3af', fontSize: '1rem' }}>
              {isRu ? 'Заверши Раздел 3, чтобы открыть этот раздел!' : 'Complete Section 3 to unlock this section!'}
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px 48px' }}>
            <p style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: '0.78rem', color: ACCENT,
              letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6,
            }}>
              {isRu ? 'Матфея 6:9 · Структура Молитвы Господней' : 'Matthew 6:9 · Lord\'s Prayer Structure'}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900,
              fontSize: 'clamp(1.5rem,4vw,2.1rem)',
              color: '#e9d5ff', marginBottom: 18, lineHeight: 1.2,
            }}>
              {isRu ? 'Построй свою молитву' : 'Build a Prayer'}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lora)', fontSize: '1rem',
              color: 'rgba(233,213,255,.8)', lineHeight: 1.75, marginBottom: 24,
            }}>
              {isRu
                ? 'Иисус дал нам структуру молитвы в Матфея 6:9–13. Давай используем её, чтобы построить настоящую молитву — твою собственную! Выбирай слова из каждого шага.'
                : "Jesus gave us a prayer structure in Matthew 6:9–13. Let's use it to build a real prayer — your own! Pick words from each step."}
            </p>

            {/* Opening verse */}
            <div style={{
              padding: '16px 20px', marginBottom: 28,
              background: 'rgba(124,58,237,.15)',
              border: `1.5px solid ${ACCENT}`,
              borderRadius: 14,
              fontFamily: 'var(--font-lora)', fontStyle: 'italic',
              fontSize: '0.95rem', color: '#e9d5ff', lineHeight: 1.7,
              textAlign: 'center',
            }}>
              {isRu
                ? '"Отче наш, сущий на небесах! Да святится имя Твоё..." — Матфея 6:9'
                : '"Our Father in heaven, hallowed be your name..." — Matthew 6:9'}
            </div>

            {done.has('prayer') ? (
              <div style={{
                background: 'rgba(124,58,237,.15)', borderRadius: 22,
                border: `2px solid ${ACCENT}`, padding: '28px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🙏⭐🙏</div>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#4ade80', fontSize: '1.05rem', marginBottom: 16 }}>
                  {isRu ? 'Твоя молитва готова! Бог слышит каждое слово.' : 'Your prayer is complete! God hears every word.'}
                </p>
                <div style={{
                  background: 'rgba(255,255,255,.08)', borderRadius: 16,
                  padding: '22px 20px', textAlign: 'left',
                  fontFamily: 'var(--font-lora)', fontSize: '1rem',
                  color: '#e9d5ff', lineHeight: 1.85,
                }}>
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.78rem', color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      {isRu ? '✨ ХВАЛА' : '✨ PRAISE'}
                    </span>
                    <span style={{ fontStyle: 'italic' }}>
                      {praiseSelected.size > 0
                        ? <>
                            {isRu ? 'Боже, Ты — ' : 'God, You are '}
                            {[...praiseSelected].map(k => {
                              const idx = PRAISE_EN.indexOf(k)
                              return isRu ? PRAISE_RU[idx] : k
                            }).join(', ')}.
                          </>
                        : (isRu ? '"Боже, Ты — ..."' : '"God, You are ..."')}
                    </span>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.78rem', color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      {isRu ? '🙇 ЧЕСТНОСТЬ' : '🙇 HONEST'}
                    </span>
                    <span style={{ fontStyle: 'italic' }}>
                      {honestSelected.size > 0
                        ? <>
                            {isRu ? 'Прости меня за: ' : 'Please forgive me for: '}
                            {[...honestSelected].map(k => {
                              const idx = HONEST_EN.indexOf(k)
                              return isRu ? HONEST_RU[idx] : k
                            }).join(', ')}.
                          </>
                        : (isRu ? '"Прости меня за ..."' : '"Please forgive me for ..."')}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.78rem', color: ACCENT, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      {isRu ? '🙏 ПРОСЬБА' : '🙏 ASKING'}
                    </span>
                    <span style={{ fontStyle: 'italic' }}>
                      {askingSelected.size > 0
                        ? <>
                            {isRu ? 'Помоги мне с: ' : 'I need Your help with: '}
                            {[...askingSelected].map(k => {
                              const idx = ASKING_EN.indexOf(k)
                              return isRu ? ASKING_RU[idx] : k
                            }).join(', ')}.
                          </>
                        : (isRu ? '"Мне нужна Твоя помощь с ..."' : '"I need Your help with ..."')}
                    </span>
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.15)', fontStyle: 'italic', color: 'rgba(233,213,255,.7)', fontSize: '0.95rem' }}>
                    {isRu ? 'Аминь. 🙏' : 'Amen. 🙏'}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Step 1: Praise */}
                <div style={{
                  background: 'rgba(255,255,255,.06)', borderRadius: 18,
                  border: '1.5px solid rgba(255,255,255,.14)', padding: '20px 18px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 900,
                    fontSize: '0.75rem', color: ACCENT,
                    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
                  }}>
                    {isRu ? 'ШАГ 1 — ХВАЛА' : 'STEP 1 — PRAISE'}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 800,
                    fontSize: '1rem', color: '#e9d5ff', marginBottom: 16,
                  }}>
                    {isRu ? '"Боже, Ты — ..."' : '"God, You are ..."'}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {PRAISE_ACTIVE.map((opt, i) => {
                      const key = PRAISE_EN[i]
                      return (
                        <button key={key} onClick={() => togglePraise(key)} style={chipStyle(praiseSelected.has(key))}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {praiseSelected.size > 0 && (
                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.78rem', color: '#a78bfa', marginTop: 10 }}>
                      ✓ {isRu ? `Выбрано: ${praiseSelected.size}` : `Selected: ${praiseSelected.size}`}
                    </p>
                  )}
                </div>

                {/* Step 2: Honest */}
                <div style={{
                  background: 'rgba(255,255,255,.06)', borderRadius: 18,
                  border: '1.5px solid rgba(255,255,255,.14)', padding: '20px 18px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 900,
                    fontSize: '0.75rem', color: ACCENT,
                    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
                  }}>
                    {isRu ? 'ШАГ 2 — ЧЕСТНОСТЬ' : 'STEP 2 — HONEST'}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 800,
                    fontSize: '1rem', color: '#e9d5ff', marginBottom: 16,
                  }}>
                    {isRu ? '"Прости меня за ..."' : '"Please forgive me for ..."'}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {HONEST_ACTIVE.map((opt, i) => {
                      const key = HONEST_EN[i]
                      return (
                        <button key={key} onClick={() => toggleHonest(key)} style={chipStyle(honestSelected.has(key))}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {honestSelected.size > 0 && (
                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.78rem', color: '#a78bfa', marginTop: 10 }}>
                      ✓ {isRu ? `Выбрано: ${honestSelected.size}` : `Selected: ${honestSelected.size}`}
                    </p>
                  )}
                </div>

                {/* Step 3: Asking */}
                <div style={{
                  background: 'rgba(255,255,255,.06)', borderRadius: 18,
                  border: '1.5px solid rgba(255,255,255,.14)', padding: '20px 18px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 900,
                    fontSize: '0.75rem', color: ACCENT,
                    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
                  }}>
                    {isRu ? 'ШАГ 3 — ПРОСЬБА' : 'STEP 3 — ASKING'}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-nunito)', fontWeight: 800,
                    fontSize: '1rem', color: '#e9d5ff', marginBottom: 16,
                  }}>
                    {isRu ? '"Мне нужна Твоя помощь с ..."' : '"I need Your help with ..."'}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {ASKING_ACTIVE.map((opt, i) => {
                      const key = ASKING_EN[i]
                      return (
                        <button key={key} onClick={() => toggleAsking(key)} style={chipStyle(askingSelected.has(key))}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {askingSelected.size > 0 && (
                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '0.78rem', color: '#a78bfa', marginTop: 10 }}>
                      ✓ {isRu ? `Выбрано: ${askingSelected.size}` : `Selected: ${askingSelected.size}`}
                    </p>
                  )}
                </div>

                {/* Preview / Build button */}
                {!prayerBuilt ? (
                  <button
                    onClick={buildPrayer}
                    disabled={!prayerReady}
                    style={{
                      padding: '14px 0', borderRadius: 16,
                      background: prayerReady
                        ? `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`
                        : 'rgba(255,255,255,.1)',
                      color: prayerReady ? '#fff' : 'rgba(255,255,255,.4)',
                      border: 'none',
                      fontFamily: 'var(--font-nunito)', fontWeight: 900,
                      fontSize: '1.05rem', cursor: prayerReady ? 'pointer' : 'not-allowed',
                      transition: 'all .2s',
                    }}
                  >
                    {prayerReady
                      ? (isRu ? '🙏 Посмотреть молитву!' : '🙏 See My Prayer!')
                      : (isRu ? 'Выбери хотя бы по одному из каждого шага' : 'Pick at least one from each step')}
                  </button>
                ) : (
                  <>
                    {/* Prayer preview card */}
                    <div style={{
                      background: 'rgba(124,58,237,.18)', borderRadius: 18,
                      border: `2px solid ${ACCENT}`, padding: '24px 22px',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-nunito)', fontWeight: 900,
                        fontSize: '0.75rem', color: ACCENT,
                        letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14,
                        textAlign: 'center',
                      }}>
                        🙏 {isRu ? 'ТВОЯ МОЛИТВА' : 'YOUR PRAYER'}
                      </p>
                      <div style={{
                        fontFamily: 'var(--font-lora)', fontSize: '1rem',
                        color: '#e9d5ff', lineHeight: 1.85,
                      }}>
                        <p style={{ marginBottom: 12, fontStyle: 'italic', color: 'rgba(233,213,255,.7)', fontSize: '0.9rem' }}>
                          {isRu
                            ? '"Отче наш, сущий на небесах! Да святится имя Твоё..."'
                            : '"Our Father in heaven, hallowed be your name..."'}
                        </p>
                        <p style={{ marginBottom: 12 }}>
                          <strong style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.82rem', color: '#a78bfa', display: 'block', marginBottom: 4 }}>
                            {isRu ? '✨ ХВАЛА' : '✨ PRAISE'}
                          </strong>
                          {isRu ? 'Боже, Ты — ' : 'God, You are '}
                          {[...praiseSelected].map(k => {
                            const idx = PRAISE_EN.indexOf(k)
                            return isRu ? PRAISE_RU[idx] : k
                          }).join(', ')}.
                        </p>
                        <p style={{ marginBottom: 12 }}>
                          <strong style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.82rem', color: '#a78bfa', display: 'block', marginBottom: 4 }}>
                            {isRu ? '🙇 ЧЕСТНОСТЬ' : '🙇 HONEST'}
                          </strong>
                          {isRu ? 'Прости меня за: ' : 'Please forgive me for: '}
                          {[...honestSelected].map(k => {
                            const idx = HONEST_EN.indexOf(k)
                            return isRu ? HONEST_RU[idx] : k
                          }).join(', ')}.
                        </p>
                        <p style={{ marginBottom: 16 }}>
                          <strong style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.82rem', color: '#a78bfa', display: 'block', marginBottom: 4 }}>
                            {isRu ? '🙏 ПРОСЬБА' : '🙏 ASKING'}
                          </strong>
                          {isRu ? 'Мне нужна Твоя помощь с: ' : 'I need Your help with: '}
                          {[...askingSelected].map(k => {
                            const idx = ASKING_EN.indexOf(k)
                            return isRu ? ASKING_RU[idx] : k
                          }).join(', ')}.
                        </p>
                        <p style={{ fontStyle: 'italic', color: 'rgba(233,213,255,.7)' }}>
                          {isRu ? 'Аминь. 🙏' : 'Amen. 🙏'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={completePrayer}
                      style={{
                        padding: '14px 0', borderRadius: 16,
                        background: `linear-gradient(135deg,#059669,#065f46)`,
                        color: '#fff', border: 'none',
                        fontFamily: 'var(--font-nunito)', fontWeight: 900,
                        fontSize: '1.05rem', cursor: 'pointer',
                      }}
                    >
                      {isRu ? '✅ Молитва завершена!' : '✅ Prayer Complete!'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Back link ──────────────────────────────────────────────── */}
      <section style={{ padding: '28px 20px', textAlign: 'center' }}>
        <Link href="/lessons" style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 800,
          color: ACCENT, textDecoration: 'none',
          fontSize: '1rem',
        }}>
          ← {isRu ? 'Все уроки' : 'All Lessons'}
        </Link>
      </section>

    </div>
  )
}
