'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function AloneWithGodFeature({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage()
  const ru = language === 'ru'
  if (compact) return <Link href="/lessons/alone-with-god" style={{ display: 'inline-flex', minHeight: 50, alignItems: 'center', justifyContent: 'center', padding: '13px 22px', margin: '0 0 22px', borderRadius: 15, background: '#f6c969', color: '#163f36', fontFamily: 'var(--font-nunito)', fontWeight: 900, textDecoration: 'none' }}>{ru ? 'Новый урок: Наедине с Богом' : 'New lesson: Alone with God'} →</Link>
  return <section style={{ padding: '30px 18px', background: '#fffaf0' }} aria-label={ru ? 'Урок недели' : 'Featured lesson'}>
    <Link href="/lessons/alone-with-god" style={{ display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden', minHeight: 360, maxWidth: 1100, margin: '0 auto', borderRadius: 28, color: 'white', textDecoration: 'none', background: '#173e3a', boxShadow: '0 15px 45px #173e3a25' }}>
      <Image src="/images/lessons/alone-with-god/hero.png" alt="" fill sizes="(min-width:1100px) 1100px, 100vw" style={{ objectFit: 'cover', objectPosition: '50% 40%' }} />
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(0deg,rgba(8,32,26,.98),rgba(8,32,26,.66) 42%,rgba(8,32,26,.04))' }} />
      <div style={{ position: 'relative', padding: '28px clamp(20px,4vw,44px)', maxWidth: 680, fontFamily: 'var(--font-nunito)' }}>
        <p style={{ color: '#f6c969', fontWeight: 900, marginBottom: 9 }}>{ru ? 'Урок недели · Матфея 6:6' : 'Featured lesson · Matthew 6:6'}</p>
        <h2 style={{ color: '#fff', fontFamily: 'var(--font-nunito)', fontSize: 'clamp(2rem,4vw,3.1rem)', fontWeight: 900, lineHeight: 1.12, marginBottom: 12 }}>{ru ? 'Наедине с Богом' : 'Alone with God'}</h2>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 18 }}>{ru ? 'Игра немного подождёт! Вместе с Мишей и Розой узнай, как говорить с Небесным Отцом. Библейские истории, задания и твоя тихая минутка.' : 'The game can wait a moment! Join Michael and Rosie to discover time with our heavenly Father. Bible stories, hands-on challenges, and your own quiet moment.'}</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 48, padding: '12px 20px', borderRadius: 14, background: '#f6c969', color: '#173e3a', fontWeight: 900 }}>{ru ? 'Открыть урок' : 'Explore the lesson'} →</span>
      </div>
    </Link>
  </section>
}
