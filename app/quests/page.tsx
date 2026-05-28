'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

const questArt = {
  hub: '/images/jr/quests/quest-hub-map.png',
  courage: '/images/jr/quests/courage-quest/00-cover-courage-quest.png',
  forgiveness: '/images/jr/quests/forgiveness-bridge-teaser.png',
  forest: '/images/jr/quests/forest-of-lies-teaser.png',
  storm: '/images/jr/quests/storm-rescue-teaser.png',
}

const copy = {
  en: {
    title: 'Bible Quests',
    subtitle: 'Interactive Adventures · Choose Truth · Follow Jesus',
    eyebrow: 'Choose Your Quest',
    heading: 'Step into the story',
    intro: 'Bible Quests are interactive adventures where kids face danger, make choices, collect truth, and learn to trust God one brave step at a time.',
    activeBadge: 'Playable now',
    firstQuest: 'First Quest',
    courageTitle: 'Courage Quest: The Cave of Echoes',
    courageDesc: 'Enter a mysterious cave, answer fear with Scripture, rescue the lost lamb, and learn that courage means trusting God when you are afraid.',
    courageTruth: 'Big truth: God helps me take the next right step.',
    verse: 'Psalm 56:3',
    start: 'Start Courage Quest',
    next: 'Coming next',
    comingIntro: 'More adventures are being prepared for Junior Disciples.',
    forgiveness: 'Forgiveness Bridge',
    forgivenessDesc: 'Choose mercy, cross the bridge, and learn how forgiveness heals what anger breaks.',
    forest: 'The Forest of Lies',
    forestDesc: 'Follow truth lights through the trees and learn how God’s Word helps us reject lies.',
    storm: 'The Storm Rescue',
    stormDesc: 'Trust Jesus in the wind and waves while helping a friend reach safe harbor.',
    locked: 'Coming soon',
    back: 'Back to Home',
  },
  ru: {
    title: 'Библейские квесты',
    subtitle: 'Интерактивные приключения · Выбирай истину · Следуй за Иисусом',
    eyebrow: 'Выбери квест',
    heading: 'Войди в историю',
    intro: 'Библейские квесты — это интерактивные приключения, где дети встречают опасность, делают выбор, собирают истины и учатся доверять Богу шаг за шагом.',
    activeBadge: 'Можно играть',
    firstQuest: 'Первый квест',
    courageTitle: 'Квест мужества: Пещера эха',
    courageDesc: 'Войди в таинственную пещеру, ответь страху словами Писания, спаси потерянного ягнёнка и узнай: мужество — это доверять Богу, когда страшно.',
    courageTruth: 'Главная истина: Бог помогает мне сделать следующий правильный шаг.',
    verse: 'Псалом 55:4',
    start: 'Начать квест мужества',
    next: 'Скоро',
    comingIntro: 'Новые приключения готовятся для Junior Disciples.',
    forgiveness: 'Мост прощения',
    forgivenessDesc: 'Выбери милость, перейди мост и узнай, как прощение исцеляет то, что ломает гнев.',
    forest: 'Лес лжи',
    forestDesc: 'Иди за огнями истины через деревья и узнай, как Божье Слово помогает отвергать ложь.',
    storm: 'Спасение в буре',
    stormDesc: 'Доверься Иисусу среди ветра и волн и помоги другу добраться до безопасной гавани.',
    locked: 'Скоро',
    back: 'Назад на главную',
  },
}

export default function QuestsPage() {
  const { language } = useLanguage()
  const c = copy[language]

  const coming = [
    { title: c.forgiveness, desc: c.forgivenessDesc, image: questArt.forgiveness },
    { title: c.forest, desc: c.forestDesc, image: questArt.forest },
    { title: c.storm, desc: c.stormDesc, image: questArt.storm },
  ]

  return (
    <main className="quest-index-page">
      <style>{`
        .quest-index-page { background: #081428; min-height: 100vh; color: #fff; overflow: hidden; }
        .quest-index-hero { position: relative; min-height: 68vh; display: grid; align-items: center; padding: 56px 18px; isolation: isolate; }
        .quest-index-hero::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(180deg,rgba(8,20,40,.32),rgba(8,20,40,.82)), url('${questArt.hub}'); background-size: cover; background-position: center; transform: scale(1.04); animation: questMapDrift 18s ease-in-out infinite alternate; z-index: -2; }
        .quest-index-hero::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 22% 22%,rgba(255,216,102,.36),transparent 28%), radial-gradient(circle at 78% 12%,rgba(126,200,227,.24),transparent 28%), linear-gradient(90deg,rgba(8,20,40,.86),rgba(8,20,40,.22),rgba(8,20,40,.82)); z-index: -1; }
        .quest-index-wrap { max-width: 1120px; margin: 0 auto; width: 100%; }
        .quest-hero-panel { width: min(720px,100%); background: rgba(255,255,255,.92); color: var(--text); border: 4px solid rgba(255,216,102,.85); border-radius: 34px; padding: clamp(24px,5vw,46px); box-shadow: 0 28px 90px rgba(0,0,0,.36); backdrop-filter: blur(10px); }
        .quest-kicker { font-family: var(--font-nunito); font-weight: 1000; color: #4f46e5; letter-spacing: 3px; text-transform: uppercase; font-size: .78rem; margin-bottom: 8px; }
        .quest-index-title { font-family: var(--font-cinzel); color: var(--deep); font-size: clamp(2.5rem,9vw,5.6rem); line-height: .95; margin: 0 0 12px; }
        .quest-index-subtitle { font-family: var(--font-nunito); font-weight: 1000; color: #92400e; letter-spacing: 1.2px; text-transform: uppercase; font-size: .9rem; margin-bottom: 16px; }
        .quest-index-intro { font-family: var(--font-lora); color: #374151; font-weight: 700; line-height: 1.75; font-size: 1.08rem; max-width: 58ch; }
        .truth-orbs { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .truth-orbs span { position: absolute; width: 12px; height: 12px; border-radius: 999px; background: radial-gradient(circle,#fff8bd 0 25%,#fbbf24 48%,transparent 72%); box-shadow: 0 0 24px rgba(251,191,36,.9); animation: orbFloat 7s ease-in-out infinite; }
        .truth-orbs span:nth-child(1) { left: 12%; top: 72%; animation-delay: -1s; }
        .truth-orbs span:nth-child(2) { left: 36%; top: 18%; animation-delay: -3s; width: 8px; height: 8px; }
        .truth-orbs span:nth-child(3) { left: 68%; top: 64%; animation-delay: -2s; }
        .truth-orbs span:nth-child(4) { left: 86%; top: 28%; animation-delay: -4s; width: 9px; height: 9px; }
        .quest-index-body { background: linear-gradient(180deg,#fff7ed,#fdf8f0 38%,#e8f4ff); padding: 48px 18px 64px; color: var(--text); }
        .featured-quest { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(320px,.95fr); gap: 26px; align-items: stretch; background: #fff; border-radius: 34px; border: 4px solid rgba(255,216,102,.78); overflow: hidden; box-shadow: 0 24px 70px rgba(13,31,60,.18); text-decoration: none; color: inherit; }
        .featured-quest:hover .featured-img { transform: scale(1.045); }
        .featured-media { min-height: 360px; position: relative; overflow: hidden; background: #0d1f3c; }
        .featured-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .7s ease; animation: imageBreathe 9s ease-in-out infinite alternate; }
        .featured-media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg,transparent 35%,rgba(8,20,40,.42)); }
        .featured-copy { padding: clamp(24px,4vw,40px); display: flex; flex-direction: column; justify-content: center; }
        .status-pill { display: inline-flex; width: fit-content; border-radius: 999px; padding: 8px 12px; background: #eef2ff; color: #4338ca; font-family: var(--font-nunito); font-weight: 1000; font-size: .78rem; text-transform: uppercase; letter-spacing: 1.4px; margin-bottom: 12px; }
        .featured-title { font-family: var(--font-cinzel); color: var(--deep); font-size: clamp(1.9rem,5vw,3rem); line-height: 1.08; margin-bottom: 14px; }
        .featured-desc { font-family: var(--font-lora); color: #374151; font-weight: 700; line-height: 1.75; margin-bottom: 14px; }
        .featured-truth { border-radius: 18px; background: #fff7ed; border: 2px solid #fed7aa; padding: 14px 16px; color: #7c2d12; font-family: var(--font-nunito); font-weight: 900; }
        .quest-start-cta { margin-top: 20px; display: inline-flex; justify-content: center; align-items: center; min-height: 52px; width: fit-content; border-radius: 999px; padding: 0 24px; background: linear-gradient(180deg,#6366f1,#4338ca); color: #fff; font-family: var(--font-nunito); font-weight: 1000; box-shadow: 0 12px 26px rgba(79,70,229,.26); }
        .coming-header { margin: 46px 0 20px; text-align: center; }
        .coming-title { font-family: var(--font-cinzel); color: var(--deep); font-size: clamp(1.8rem,5vw,2.6rem); margin-bottom: 8px; }
        .coming-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 18px; }
        .coming-card { background: rgba(255,255,255,.92); border-radius: 26px; overflow: hidden; border: 2px solid rgba(13,31,60,.08); box-shadow: 0 18px 42px rgba(13,31,60,.12); }
        .coming-card img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; }
        .coming-copy { padding: 18px; }
        .coming-copy h3 { font-family: var(--font-nunito); font-weight: 1000; color: var(--deep); font-size: 1.2rem; margin-bottom: 8px; }
        .coming-copy p { font-family: var(--font-lora); color: #4b5563; font-weight: 700; line-height: 1.6; font-size: .96rem; }
        .locked-pill { display: inline-flex; margin-top: 12px; border-radius: 999px; padding: 7px 11px; background: #fef3c7; color: #92400e; font-family: var(--font-nunito); font-weight: 1000; font-size: .75rem; text-transform: uppercase; letter-spacing: 1.2px; }
        .back-link { display: block; margin-top: 28px; text-align: center; color: var(--fire); font-family: var(--font-nunito); font-weight: 900; text-decoration: none; }
        @keyframes questMapDrift { from { transform: scale(1.04) translate3d(-10px,-6px,0); } to { transform: scale(1.1) translate3d(12px,8px,0); } }
        @keyframes orbFloat { 0%,100% { transform: translate3d(0,0,0) scale(.8); opacity: .35; } 50% { transform: translate3d(18px,-44px,0) scale(1.2); opacity: 1; } }
        @keyframes imageBreathe { from { transform: scale(1); } to { transform: scale(1.035); } }
        @media (max-width: 860px) { .featured-quest { grid-template-columns: 1fr; } .featured-media { min-height: 280px; } .coming-grid { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) { .quest-index-hero::before,.truth-orbs span,.featured-img { animation: none !important; } .featured-quest:hover .featured-img { transform: none; } }
      `}</style>

      <section className="quest-index-hero">
        <div className="truth-orbs" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="quest-index-wrap">
          <div className="quest-hero-panel">
            <p className="quest-kicker">{c.eyebrow}</p>
            <h1 className="quest-index-title">{c.title}</h1>
            <p className="quest-index-subtitle">{c.subtitle}</p>
            <p className="quest-index-intro">{c.intro}</p>
          </div>
        </div>
      </section>

      <section className="quest-index-body">
        <div className="quest-index-wrap">
          <Link href="/quests/courage-quest" className="featured-quest">
            <div className="featured-media">
              <img className="featured-img" src={questArt.courage} alt={c.courageTitle} />
            </div>
            <div className="featured-copy">
              <span className="status-pill">{c.activeBadge} · {c.verse}</span>
              <p className="quest-kicker">{c.firstQuest}</p>
              <h2 className="featured-title">{c.courageTitle}</h2>
              <p className="featured-desc">{c.courageDesc}</p>
              <div className="featured-truth">{c.courageTruth}</div>
              <span className="quest-start-cta">{c.start}</span>
            </div>
          </Link>

          <div className="coming-header">
            <p className="quest-kicker">{c.next}</p>
            <h2 className="coming-title">{c.comingIntro}</h2>
          </div>

          <div className="coming-grid">
            {coming.map(item => (
              <article className="coming-card" key={item.title}>
                <img src={item.image} alt={item.title} />
                <div className="coming-copy">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span className="locked-pill">{c.locked}</span>
                </div>
              </article>
            ))}
          </div>

          <Link href="/" className="back-link">{c.back}</Link>
        </div>
      </section>
    </main>
  )
}
