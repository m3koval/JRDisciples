'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function WhoAmIFeature() {
  const { language } = useLanguage()
  const ru = language === 'ru'
  return <section style={{ padding: '30px 18px', background: '#fff9ed' }} aria-label={ru ? 'Новый урок' : 'New lesson'}>
    <Link href="/lessons/who-am-i" style={{ display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden', minHeight: 380, maxWidth: 1100, margin: '0 auto', borderRadius: 28, color: 'white', textDecoration: 'none', background: '#234d49' }}>
      <Image src="/images/lessons/who-am-i/hero.png" alt="" fill sizes="(min-width:1100px) 1100px, 100vw" style={{ objectFit: 'cover', objectPosition: '50% 45%' }} />
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(0deg,rgba(10,32,28,.98),rgba(10,32,28,.8) 40%,rgba(10,32,28,.05))' }} />
      <div style={{ position: 'relative', padding: '30px clamp(20px,4vw,44px)', maxWidth: 720, fontFamily: 'var(--font-nunito)' }}>
        <p style={{ color: '#ffda8b', fontWeight: 900, marginBottom: 10 }}>{ru ? 'Новый урок · 1 Петра 2:9–10 · 20–30 минут' : 'New lesson · 1 Peter 2:9–10 · 20–30 minutes'}</p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-nunito)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>{ru ? 'Кто я?' : 'Who am I?'}</h2>
        <p style={{ lineHeight: 1.6, marginBottom: 20 }}>{ru ? 'Мишу выбрали последним. Узнай вместе с ним и Розой, что значит принадлежать Иисусу — и почему даже после обидного проигрыша можно проявить доброту.' : 'Michael was picked last. Join him and Rosie to discover what it means to belong to Jesus—and why even a disappointing game can become a chance to show kindness.'}</p>
        <span style={{ display: 'inline-flex', minHeight: 48, alignItems: 'center', padding: '12px 20px', borderRadius: 14, background: '#ffda8b', color: '#183f40', fontWeight: 900 }}>{ru ? 'Начать историю' : 'Begin the story'} →</span>
      </div>
    </Link>
  </section>
}
