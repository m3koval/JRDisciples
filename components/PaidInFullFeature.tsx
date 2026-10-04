'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function PaidInFullFeature({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage()
  const ru = language === 'ru'
  if (compact) return <Link href="/lessons/paid-in-full" style={{ display: 'inline-flex', minHeight: 50, alignItems: 'center', justifyContent: 'center', padding: '13px 22px', margin: '0 0 22px', borderRadius: 15, background: '#f6c969', color: '#163f36', fontFamily: 'var(--font-nunito)', fontWeight: 900, textDecoration: 'none' }}>{ru ? 'Новый урок: Оплачено полностью' : 'New lesson: Paid in Full'} →</Link>
  return <section style={{ padding: '30px 18px', background: '#fffaf0' }} aria-label={ru ? 'Урок недели' : 'Featured lesson'}>
    <Link href="/lessons/paid-in-full" style={{ display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden', minHeight: 360, maxWidth: 1100, margin: '0 auto', borderRadius: 28, color: 'white', textDecoration: 'none', background: '#173e3a', boxShadow: '0 15px 45px #173e3a25' }}>
      <Image src="/images/jr/lessons/paid-in-full/cover.webp" alt="" fill sizes="(min-width:1100px) 1100px, 100vw" style={{ objectFit: 'cover', objectPosition: '50% 40%' }} />
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(0deg,rgba(8,32,26,.98),rgba(8,32,26,.66) 42%,rgba(8,32,26,.04))' }} />
      <div style={{ position: 'relative', padding: '28px clamp(20px,4vw,44px)', maxWidth: 680, fontFamily: 'var(--font-nunito)' }}>
        <p style={{ color: '#f6c969', fontWeight: 900, marginBottom: 9 }}>{ru ? 'УРОК НЕДЕЛИ · 1 ПЕТРА 1:17–21' : 'FEATURED LESSON · 1 PETER 1:17–21'}</p>
        <h2 style={{ color: '#fff', fontFamily: 'var(--font-nunito)', fontSize: 'clamp(2rem,4vw,3.1rem)', fontWeight: 900, lineHeight: 1.12, marginBottom: 12 }}>{ru ? 'Оплачено полностью' : 'Paid in Full'}</h2>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 18 }}>{ru ? 'Любящий Отец. Путь домой. Спасение дороже золота. Пять открытий, задачи и вопросы, которые помогут понять Божий дар.' : 'A loving Father. A journey home. A rescue more precious than gold. Five discoveries, hands-on puzzles, and questions to explore God’s gift.'}</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 48, padding: '12px 20px', borderRadius: 14, background: '#f6c969', color: '#173e3a', fontWeight: 900 }}>{ru ? 'Открыть урок' : 'Explore the lesson'} →</span>
      </div>
    </Link>
  </section>
}
