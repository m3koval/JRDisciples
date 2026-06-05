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
    trendText: 'Самые заметные направления: популярные игры месяца, лидерборды, игры с друзьями, .io/аркада и простые циклы “сыграй ещё раз”. Поэтому первый прототип — быстрый аркадный забег с очками, личным рекордом и мудростью из Писания.',
    gameTitle: 'Путь истины',
    gameDesc: 'Собирай свет истины, избегай шёпота лжи и открывай короткую библейскую мудрость.',
    play: 'Играть',
    details: ['1 игрок', '2 минуты', 'личный рекорд', 'лидерборд позже'],
    coming: 'Дальше можно добавить семейный лидерборд, значки и уровни по темам: истина, милость, мудрость, мужество.'
  } : {
    eyebrow: 'Game Zone',
    title: 'Bible Games',
    intro: 'Short, fun games where winning helps kids remember God’s wisdom — not just chase points.',
    trend: 'What CrazyGames shows us',
    trendText: 'The strongest patterns are monthly popular games, leaderboards, with-friends play, .io/arcade loops, and “one more round” simplicity. So the first prototype is a quick arcade runner with score, personal best, and Scripture wisdom rewards.',
    gameTitle: 'Truth Runner',
    gameDesc: 'Collect truth lights, avoid whispering lies, and unlock short Bible wisdom as you score.',
    play: 'Play',
    details: ['1 player', '2 minutes', 'personal best', 'leaderboard later'],
    coming: 'Next we can add family leaderboards, badges, and themed levels: truth, mercy, wisdom, courage.'
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#081428,#0d1f3c 42%,#f7fbff)' }}>
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 18px 64px', color: '#fff' }}>
        <Link href="/" className="quest-back" style={{ color: '#ffd866', fontFamily: 'var(--font-nunito)', fontWeight: 1000, textDecoration: 'none' }}>← {isRu ? 'На главную' : 'Back Home'}</Link>
        <p className="eyebrow" style={{ color: '#7ec8e3', marginTop: 24 }}>{copy.eyebrow}</p>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2.3rem,8vw,4.8rem)', lineHeight: 1, margin: '8px 0 16px', color: '#fff' }}>{copy.title}</h1>
        <p style={{ maxWidth: 720, fontFamily: 'var(--font-lora)', fontWeight: 700, lineHeight: 1.75, color: 'rgba(255,255,255,.88)', fontSize: '1.05rem' }}>{copy.intro}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18, marginTop: 30 }}>
          <article style={{ borderRadius: 26, padding: 22, background: 'rgba(255,255,255,.1)', border: '2px solid rgba(126,200,227,.45)', boxShadow: '0 22px 70px rgba(0,0,0,.24)' }}>
            <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '1.25rem', color: '#ffd866', marginBottom: 10 }}>{copy.trend}</h2>
            <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.68, color: 'rgba(255,255,255,.88)' }}>{copy.trendText}</p>
          </article>

          <Link href="/games/truth-runner" style={{ position: 'relative', overflow: 'hidden', minHeight: 330, borderRadius: 30, padding: 24, textDecoration: 'none', color: 'inherit', background: 'radial-gradient(circle at 70% 20%,rgba(255,216,102,.5),transparent 26%),linear-gradient(135deg,#17437a,#102a52)', border: '4px solid rgba(255,216,102,.84)', boxShadow: '0 28px 80px rgba(0,0,0,.34)' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px)', backgroundSize: '42px 42px', opacity: .45 }} />
            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: 10 }}>✨🏃‍♂️</div>
                <p className="puzzle-label" style={{ color: '#ffd866' }}>{isRu ? 'Первая игра' : 'First Game'}</p>
                <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 1000, fontSize: '2rem', lineHeight: 1.05, margin: '4px 0 10px', color: '#fff' }}>{copy.gameTitle}</h2>
                <p style={{ fontFamily: 'var(--font-lora)', color: 'rgba(255,255,255,.92)', lineHeight: 1.6, fontWeight: 700 }}>{copy.gameDesc}</p>
              </div>
              <div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {copy.details.map((d) => <span key={d} style={{ borderRadius: 999, padding: '7px 10px', background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.78rem' }}>{d}</span>)}
                </div>
                <span className="pz-btn" style={{ display: 'inline-flex', width: 'auto', padding: '12px 24px', background: 'linear-gradient(180deg,#fbbf24,#f97316)', color: '#3b2307' }}>{copy.play} →</span>
              </div>
            </div>
          </Link>
        </div>

        <p style={{ marginTop: 22, fontFamily: 'var(--font-nunito)', color: '#dbeafe', fontWeight: 800 }}>{copy.coming}</p>
      </section>
    </main>
  )
}
