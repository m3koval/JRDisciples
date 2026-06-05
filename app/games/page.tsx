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
    trend: 'Что мы заметили на CrazyGames',
    trendText: 'Лучшие игры часто дают простой цикл: быстро начать, попробовать ещё раз, улучшить рекорд, открыть следующий уровень. Поэтому главный первый формат здесь — мобильная игра на точность: отпусти пращу в правильный момент.',
    play: 'Играть',
    coming: 'Дальше можно добавить семейный лидерборд, значки, уровни сложности и недельные вызовы.'
  } : {
    eyebrow: 'Game Zone',
    title: 'Bible Games',
    intro: 'Short, fun games where winning helps kids remember God’s wisdom — not just chase points.',
    trend: 'What CrazyGames shows us',
    trendText: 'The best arcade games usually have a simple loop: start fast, try again, beat your score, unlock the next challenge. So the strongest first format here is a mobile-friendly timing game: release the sling at the right moment.',
    play: 'Play',
    coming: 'Next we can add family leaderboards, badges, difficulty ladders, and weekly challenges.'
  }

  const games = isRu ? [
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
  ] : [
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
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#081428,#0d1f3c 42%,#f7fbff)' }}>
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 18px 64px', color: '#fff' }}>
        <Link href="/" className="quest-back" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {isRu ? 'На главную' : 'Back Home'}</Link>
        <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 24 }}>{copy.eyebrow}</p>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2.3rem,8vw,4.8rem)', lineHeight: 1, margin: '8px 0 16px', color: '#fff' }}>{copy.title}</h1>
        <p style={{ maxWidth: 760, fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.75, color: 'rgba(255,255,255,.88)', fontSize: '1.05rem' }}>{copy.intro}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18, marginTop: 30 }}>
          <article style={{ borderRadius: 26, padding: 22, background: 'rgba(255,255,255,.1)', border: '2px solid rgba(126,200,227,.45)', boxShadow: '0 22px 70px rgba(0,0,0,.24)' }}>
            <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '1.25rem', color: '#ffd866', marginBottom: 10 }}>{copy.trend}</h2>
            <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.68, color: 'rgba(255,255,255,.88)' }}>{copy.trendText}</p>
          </article>

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
