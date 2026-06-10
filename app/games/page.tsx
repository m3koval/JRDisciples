'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function GamesPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'

  const copy = isRu ? {
    eyebrow: 'Игровая зона',
    title: 'Библейские игры',
    intro: 'Короткие, весёлые игры, где победа помогает запомнить Божью мудрость, а не просто набрать очки.',
    play: 'Играть',
    coming: 'Скоро появятся новые игры — побей свой рекорд и заглядывай ещё!'
  } : {
    eyebrow: 'Game Zone',
    title: 'Bible Games',
    intro: 'Short, fun games where winning helps kids remember God’s wisdom — not just chase points.',
    play: 'Play',
    coming: 'More games are on the way — beat your best score and check back soon!'
  }

  const games = isRu ? [
    {
      href: '/games/shield-of-faith',
      emoji: '🛡️🔥',
      label: 'Новый шутер',
      title: 'Щит Веры',
      desc: 'Раскалённые стрелы летят со всех сторон — собирай доспехи Бога, стреляй Словом и пройди 10 волн тьмы. Ефесянам 6:16.',
      details: ['10 волн', 'доспехи', 'рекорд', 'тач-экран'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(147,197,253,.42),transparent 25%),linear-gradient(135deg,#0c1a4a,#1e3a5f)',
      border: 'rgba(147,197,253,.85)'
    },
    {
      href: '/games/shepherd-light-adventure',
      emoji: '🐑✨',
      label: 'Премиум приключение',
      title: 'Приключение Света Пастыря',
      desc: 'Веди Михаила, собирай Свет Пастыря и помогай ягненку вернуться домой — Евангелие внутри игры, не викторина.',
      details: ['приключение', 'Евангелие', 'тач-экран', 'сюжет'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(254,243,199,.62),transparent 25%),linear-gradient(135deg,#0f766e,#365314)',
      border: 'rgba(254,243,199,.94)'
    },
    {
      href: '/games/manna-trail',
      emoji: '🍞🐍',
      label: 'Классическая змейка',
      title: 'Тропа манны',
      desc: 'Старая добрая «змейка»: собирай манну с неба, лови золотые слова и складывай стих — уровень за уровнем быстрее!',
      details: ['клавиатура', 'свайп', 'стихи', 'рекорд'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(253,230,138,.5),transparent 25%),linear-gradient(135deg,#0c4a6e,#14532d)',
      border: 'rgba(253,230,138,.92)'
    },
    {
      href: '/games/faithful-archer',
      emoji: '🏹✨',
      label: 'Новая аркада',
      title: 'Верный лучник',
      desc: 'Тяни, целься и отпускай стрелу. Попадай в щиты, колокольчики и фонари, чтобы открывать Божью мудрость.',
      details: ['тач-экран', 'меткость', 'рекорд', 'мудрость'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(255,226,122,.56),transparent 25%),linear-gradient(135deg,#2563eb,#166534)',
      border: 'rgba(255,226,122,.92)'
    },
    {
      href: '/games/faith-over-giants',
      emoji: '🛡️🍇',
      label: 'Новая стратегия',
      title: 'Вера сильнее великанов',
      desc: '10 уровней мужества: сражайся с великанами, отвечай на Божье Слово, зарабатывай монеты на усиления.',
      details: ['10 уровней', 'монеты', 'усиления', 'детям'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(255,216,102,.52),transparent 25%),linear-gradient(135deg,#7c3f16,#14532d)',
      border: 'rgba(255,216,102,.92)'
    },
    {
      href: '/games/david-sling-challenge',
      emoji: '🪨🎯',
      label: 'Главная игра',
      title: 'Праща Давида',
      desc: 'Раскрути пращу, отпусти в нужный момент и проходи уровни сложности. Истина: битва принадлежит Господу.',
      details: ['тайминг', 'уровни', 'мобильно', 'рекорд'],
      bg: 'radial-gradient(circle at 72% 22%,rgba(255,216,102,.55),transparent 24%),linear-gradient(135deg,#365314,#0f3b2e)',
      border: 'rgba(255,216,102,.9)'
    },
    {
      href: '/games/truth-runner',
      emoji: '✨🏃‍♂️',
      label: 'Аркада',
      title: 'Путь истины',
      desc: 'Собирай свет истины, избегай шёпота лжи и открывай короткую библейскую мудрость.',
      details: ['1 игрок', 'быстро', 'рекорд', 'мудрость'],
      bg: 'radial-gradient(circle at 70% 20%,rgba(126,200,227,.45),transparent 26%),linear-gradient(135deg,#17437a,#102a52)',
      border: 'rgba(126,200,227,.82)'
    },
    {
      href: '/games/spot-the-difference',
      emoji: '🔍✨',
      label: 'Найди отличия',
      title: 'Библейские сцены',
      desc: 'Найди 5 отличий в двух картинках с чудесами из Библии. Каждое отличие рассказывает историю!',
      details: ['4 сцены', 'наблюдение', 'чудеса', 'детям'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(34,197,94,.3),transparent 25%),linear-gradient(135deg,#064e3b,#1e3a5f)',
      border: 'rgba(34,197,94,.7)'
    },
    {
      href: '/games/escape-room-daniel',
      emoji: '🦁🗝️',
      label: 'Комната-загадка',
      title: 'Яма со львами',
      desc: '4 комнаты, 4 загадки — пройди путь Даниила от указа царя до чуда Бога. Даниил 6.',
      details: ['4 комнаты', 'загадки', 'история', 'Даниил'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(167,139,250,.4),transparent 25%),linear-gradient(135deg,#0c0a1e,#2c1810)',
      border: 'rgba(167,139,250,.75)'
    },
  ] : [
    {
      href: '/games/shield-of-faith',
      emoji: '🛡️🔥',
      label: 'New Shooter',
      title: 'Shield of Faith',
      desc: 'Fiery darts fly from every direction — collect God\'s armor, fire the Word, and survive 10 waves of darkness. Ephesians 6:16.',
      details: ['10 waves', 'armor', 'best score', 'touch-screen'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(147,197,253,.42),transparent 25%),linear-gradient(135deg,#0c1a4a,#1e3a5f)',
      border: 'rgba(147,197,253,.85)'
    },
    {
      href: '/games/shepherd-light-adventure',
      emoji: '🐑✨',
      label: 'Premium Adventure',
      title: 'Shepherd Light Adventure',
      desc: 'Guide Michael, gather Shepherd Light, and help the lamb come home — gospel truth inside gameplay, not a quiz.',
      details: ['adventure', 'gospel', 'touch-screen', 'story'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(254,243,199,.62),transparent 25%),linear-gradient(135deg,#0f766e,#365314)',
      border: 'rgba(254,243,199,.94)'
    },
    {
      href: '/games/manna-trail',
      emoji: '🍞🐍',
      label: 'Classic Snake',
      title: 'Manna Trail',
      desc: 'Snake like the good old days: gather manna from heaven, catch golden words, and build the verse — faster every level!',
      details: ['keyboard', 'swipe', 'verses', 'best score'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(253,230,138,.5),transparent 25%),linear-gradient(135deg,#0c4a6e,#14532d)',
      border: 'rgba(253,230,138,.92)'
    },
    {
      href: '/games/faithful-archer',
      emoji: '🏹✨',
      label: 'New Arcade',
      title: 'Faithful Archer',
      desc: 'Pull, aim, and release. Hit shields, bells, and lanterns to unlock Bible wisdom through the game loop.',
      details: ['touch-screen', 'aim', 'best score', 'wisdom'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(255,226,122,.56),transparent 25%),linear-gradient(135deg,#2563eb,#166534)',
      border: 'rgba(255,226,122,.92)'
    },
    {
      href: '/games/faith-over-giants',
      emoji: '🛡️🍇',
      label: 'New Strategy',
      title: 'Faith Over Giants',
      desc: '10 courage levels: tap to fight the giants, answer God’s Word, and earn coins for power-ups.',
      details: ['10 levels', 'coins', 'power-ups', 'kid-safe'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(255,216,102,.52),transparent 25%),linear-gradient(135deg,#7c3f16,#14532d)',
      border: 'rgba(255,216,102,.92)'
    },
    {
      href: '/games/david-sling-challenge',
      emoji: '🪨🎯',
      label: 'Featured Game',
      title: 'David Sling Challenge',
      desc: 'Swing the sling, release at the right moment, and clear harder levels. Big truth: the battle belongs to the Lord.',
      details: ['timing', 'levels', 'mobile', 'best score'],
      bg: 'radial-gradient(circle at 72% 22%,rgba(255,216,102,.55),transparent 24%),linear-gradient(135deg,#365314,#0f3b2e)',
      border: 'rgba(255,216,102,.9)'
    },
    {
      href: '/games/truth-runner',
      emoji: '✨🏃‍♂️',
      label: 'Arcade',
      title: 'Truth Runner',
      desc: 'Collect truth lights, avoid whispering lies, and unlock short Bible wisdom as you score.',
      details: ['1 player', 'quick', 'best score', 'wisdom'],
      bg: 'radial-gradient(circle at 70% 20%,rgba(126,200,227,.45),transparent 26%),linear-gradient(135deg,#17437a,#102a52)',
      border: 'rgba(126,200,227,.82)'
    },
    {
      href: '/games/spot-the-difference',
      emoji: '🔍✨',
      label: 'Puzzle',
      title: 'Spot the Difference',
      desc: 'Find 5 differences in two Bible miracle scenes. Every difference you spot teaches the story!',
      details: ['4 scenes', 'observation', 'miracles', 'kid-safe'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(34,197,94,.3),transparent 25%),linear-gradient(135deg,#064e3b,#1e3a5f)',
      border: 'rgba(34,197,94,.7)'
    },
    {
      href: '/games/escape-room-daniel',
      emoji: '🦁🗝️',
      label: 'Escape Room',
      title: "Lion's Den",
      desc: '4 rooms, 4 puzzles — follow Daniel\'s journey from the king\'s decree to God\'s miracle. Daniel 6.',
      details: ['4 rooms', 'puzzles', 'story', 'Daniel'],
      bg: 'radial-gradient(circle at 72% 18%,rgba(167,139,250,.4),transparent 25%),linear-gradient(135deg,#0c0a1e,#2c1810)',
      border: 'rgba(167,139,250,.75)'
    },
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#081428,#0d1f3c 42%,#f7fbff)' }}>
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 18px 64px', color: '#fff' }}>
        <Link href="/" className="quest-back" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {isRu ? 'На главную' : 'Back Home'}</Link>
        <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 24 }}>{copy.eyebrow}</p>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2.3rem,8vw,4.8rem)', lineHeight: 1, margin: '8px 0 16px', color: '#fff' }}>{copy.title}</h1>
        <p style={{ maxWidth: 760, fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.75, color: 'rgba(255,255,255,.88)', fontSize: '1.05rem' }}>{copy.intro}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18, marginTop: 30 }}>
          {games.map((game) => (
            <Link key={game.href} href={game.href} style={{ position: 'relative', overflow: 'hidden', minHeight: 330, borderRadius: 30, padding: 24, textDecoration: 'none', color: 'inherit', background: game.bg, border: `4px solid ${game.border}`, boxShadow: '0 28px 80px rgba(0,0,0,.34)' }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px)', backgroundSize: '42px 42px', opacity: .45 }} />
              <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: 10 }}>{game.emoji}</div>
                  <p className="puzzle-label" style={{ color: '#ffd866' }}>{game.label}</p>
                  <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '2rem', lineHeight: 1.05, margin: '4px 0 10px', color: '#fff' }}>{game.title}</h2>
                  <p style={{ fontFamily: 'var(--font-lora)', color: 'rgba(255,255,255,.92)', lineHeight: 1.6, fontWeight: 700 }}>{game.desc}</p>
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    {game.details.map((d) => <span key={d} style={{ borderRadius: 999, padding: '7px 10px', background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.78rem' }}>{d}</span>)}
                  </div>
                  <span className="pz-btn" style={{ display: 'inline-flex', width: 'auto', padding: '12px 24px', background: 'linear-gradient(180deg,#fbbf24,#f97316)', color: '#3b2307' }}>{copy.play} →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p style={{ marginTop: 22, fontFamily: 'var(--font-nunito)', color: '#dbeafe', fontWeight: 800 }}>{copy.coming}</p>
      </section>
    </main>
  )
}
