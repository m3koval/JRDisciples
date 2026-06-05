'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

const questArt = {
  hub: '/images/jr/quests/quest-hub-map.png',
  fruit: '/images/jr/quests/fruit-of-spirit/00-cover-fruit-of-spirit.png',
  armor: '/images/jr/quests/armor-of-god/00-cover-armor-of-god.png',
  samaritan: '/images/jr/quests/good-samaritan/00-cover-good-samaritan.png',
  lostSheep: '/images/jr/quests/lost-sheep/00-cover-lost-sheep.png',
  courage: '/images/jr/quests/courage-quest/00-cover-courage-quest.png',
  forgiveness: '/images/jr/quests/forgiveness-bridge/00-cover-forgiveness-bridge.png',
  forest: '/images/jr/quests/forest-of-lies/00-cover-forest-of-lies.png',
  storm: '/images/jr/quests/storm-rescue/00-cover-storm-rescue.png',
  wiseBuilder: '/images/jr/quests/wise-builder/00-cover-wise-builder.png',
}

const copy = {
  en: {
    title: 'Bible Quests',
    subtitle: 'Interactive Adventures · Choose Truth · Follow Jesus',
    eyebrow: 'Choose Your Quest',
    heading: 'Step into the story',
    intro: 'Bible Quests are interactive adventures where kids face pressure, make choices, collect truth lights, and learn to follow Jesus one faithful step at a time.',
    activeBadge: 'Playable now',
    featured: 'Featured Quest',
    all: 'More playable quests',
    back: 'Back to Home',
    start: 'Start Quest',
    quests: [
      {
        href: '/quests/fruit-of-spirit',
        image: questArt.fruit,
        title: "Fruit of the Spirit Quest",
        desc: "Enter the garden, choose Spirit-grown responses, and learn how God grows love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.",
        truth: "Big truth: The Holy Spirit grows Jesus-like character in me.",
        verse: "Galatians 5:22–23",
      },
      {
        href: '/quests/armor-of-god',
        image: questArt.armor,
        title: "Armor of God Quest",
        desc: "Stand firm in the canyon, lift the shield of faith, take up God’s Word, and learn that God gives His people what they need for spiritual battles.",
        truth: "Big truth: God helps me stand firm in His strength.",
        verse: "Ephesians 6:10–18",
      },
      {
        href: '/quests/good-samaritan',
        image: questArt.samaritan,
        title: "Good Samaritan Quest",
        desc: "Walk Mercy Road, stop for a hurting neighbor, and learn that love is not only a feeling — it becomes costly kindness.",
        truth: "Big truth: Jesus teaches me to love my neighbor with mercy.",
        verse: "Luke 10:25–37",
      },
      {
        href: '/quests/lost-sheep',
        image: questArt.lostSheep,
        title: "Lost Sheep Quest",
        desc: "Follow the shepherd’s light through hills and thorns, find the wandering lamb, and learn that Jesus seeks and saves the lost.",
        truth: "Big truth: Jesus seeks lost sinners and rejoices to bring them home.",
        verse: "Luke 15:3–7",
      },
      {
        href: '/quests/courage-quest',
        image: questArt.courage,
        title: 'Courage Quest: The Cave of Echoes',
        desc: 'Enter a mysterious cave, answer fear with Scripture, rescue the lost lamb, and learn that courage means trusting God when you are afraid.',
        truth: 'Big truth: God helps me take the next right step.',
        verse: 'Psalm 56:3',
      },
      {
        href: '/quests/forgiveness-bridge',
        image: questArt.forgiveness,
        title: 'Forgiveness Bridge',
        desc: 'Choose mercy, repair the broken bridge, and learn how forgiveness heals what anger tries to break.',
        truth: 'Big truth: Because Jesus forgives me, I can forgive others.',
        verse: 'Ephesians 4:32',
      },
      {
        href: '/quests/forest-of-lies',
        image: questArt.forest,
        title: 'The Forest of Lies',
        desc: 'Follow truth lights through the forest, test every whisper, and learn how God’s Word helps us reject lies.',
        truth: 'Big truth: God’s truth helps me recognize and reject lies.',
        verse: 'John 8:32',
      },
      {
        href: '/quests/storm-rescue',
        image: questArt.storm,
        title: 'The Storm Rescue',
        desc: 'Trust Jesus in the wind and waves while helping a friend reach safe harbor.',
        truth: 'Big truth: Jesus is with me in the storm.',
        verse: 'Mark 4:39',
      },
      {
        href: '/quests/wise-builder',
        image: questArt.wiseBuilder,
        title: 'Wise Builder Quest: The House on the Rock',
        desc: 'Choose the right foundation, test the house in the storm, and learn why hearing Jesus must become faithful obedience.',
        truth: 'Big truth: I build my life on Jesus by doing what He says.',
        verse: 'Matthew 7:24',
      },
    ],
  },
  ru: {
    title: 'Библейские квесты',
    subtitle: 'Интерактивные приключения · Выбирай истину · Следуй за Иисусом',
    eyebrow: 'Выбери квест',
    heading: 'Войди в историю',
    intro: 'Библейские квесты — это интерактивные приключения, где дети делают выбор, собирают огни истины и учатся следовать за Иисусом шаг за шагом.',
    activeBadge: 'Можно играть',
    featured: 'Главный квест',
    all: 'Другие квесты',
    back: 'Назад на главную',
    start: 'Начать квест',
    quests: [
      {
        href: '/quests/fruit-of-spirit',
        image: questArt.fruit,
        title: "Квест плода Духа",
        desc: "Войди в сад, выбирай поступки, которые растит Дух, и узнай о любви, радости, мире, долготерпении, благости, милосердии, вере, кротости и воздержании.",
        truth: "Главная истина: Святой Дух растит во мне характер, похожий на Иисуса.",
        verse: "Галатам 5:22–23",
      },
      {
        href: '/quests/armor-of-god',
        image: questArt.armor,
        title: "Квест всеоружия Божьего",
        desc: "Стой крепко в ущелье, подними щит веры, возьми Божье Слово и узнай, что Бог даёт Своему народу всё нужное для духовной борьбы.",
        truth: "Главная истина: Бог помогает мне стоять крепко Его силой.",
        verse: "Ефесянам 6:10–18",
      },
      {
        href: '/quests/good-samaritan',
        image: questArt.samaritan,
        title: "Квест доброго самарянина",
        desc: "Иди по Дороге милости, остановись ради нуждающегося ближнего и узнай, что любовь — это не только чувство, а добрая помощь.",
        truth: "Главная истина: Иисус учит меня любить ближнего с милостью.",
        verse: "Луки 10:25–37",
      },
      {
        href: '/quests/lost-sheep',
        image: questArt.lostSheep,
        title: "Квест потерянной овечки",
        desc: "Иди за светом пастыря через холмы и колючки, найди заблудившегося ягнёнка и узнай, что Иисус ищет и спасает погибшее.",
        truth: "Главная истина: Иисус ищет погибших грешников и радуется, возвращая их домой.",
        verse: "Луки 15:3–7",
      },
      {
        href: '/quests/courage-quest',
        image: questArt.courage,
        title: 'Квест мужества: Пещера эха',
        desc: 'Войди в пещеру, ответь страху словами Писания, спаси потерянного ягнёнка и учись доверять Богу.',
        truth: 'Главная истина: Бог помогает мне сделать следующий правильный шаг.',
        verse: 'Псалом 55:4',
      },
      {
        href: '/quests/forgiveness-bridge',
        image: questArt.forgiveness,
        title: 'Мост прощения',
        desc: 'Выбери милость, почини мост и узнай, как прощение исцеляет то, что ломает гнев.',
        truth: 'Главная истина: Иисус прощает меня, и я могу прощать других.',
        verse: 'Ефесянам 4:32',
      },
      {
        href: '/quests/forest-of-lies',
        image: questArt.forest,
        title: 'Лес лжи',
        desc: 'Иди за огнями истины и узнай, как Божье Слово помогает отвергать ложь.',
        truth: 'Главная истина: Божья истина помогает мне распознавать ложь.',
        verse: 'Иоанна 8:32',
      },
      {
        href: '/quests/storm-rescue',
        image: questArt.storm,
        title: 'Спасение в буре',
        desc: 'Доверься Иисусу среди ветра и волн и помоги другу добраться до безопасной гавани.',
        truth: 'Главная истина: Иисус со мной в буре.',
        verse: 'Марка 4:39',
      },
      {
        href: '/quests/wise-builder',
        image: questArt.wiseBuilder,
        title: 'Квест мудрого строителя: Дом на камне',
        desc: 'Выбери правильное основание, пройди испытание бурей и узнай, почему слова Иисуса нужно не только слушать, но и исполнять.',
        truth: 'Главная истина: я строю жизнь на Иисусе, когда исполняю Его слова.',
        verse: 'Матфея 7:24',
      },
    ],
  },
}

export default function QuestsPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [featured, ...more] = c.quests

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
        .featured-quest:hover .featured-img,.quest-card:hover img { transform: scale(1.045); }
        .featured-media { min-height: 360px; position: relative; overflow: hidden; background: #0d1f3c; }
        .featured-img,.quest-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .7s ease; animation: imageBreathe 9s ease-in-out infinite alternate; }
        .featured-media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg,transparent 35%,rgba(8,20,40,.42)); }
        .featured-copy { padding: clamp(24px,4vw,40px); display: flex; flex-direction: column; justify-content: center; }
        .status-pill { display: inline-flex; width: fit-content; border-radius: 999px; padding: 8px 12px; background: #eef2ff; color: #4338ca; font-family: var(--font-nunito); font-weight: 1000; font-size: .78rem; text-transform: uppercase; letter-spacing: 1.4px; margin-bottom: 12px; }
        .featured-title { font-family: var(--font-cinzel); color: var(--deep); font-size: clamp(1.9rem,5vw,3rem); line-height: 1.08; margin-bottom: 14px; }
        .featured-desc,.quest-card p { font-family: var(--font-lora); color: #374151; font-weight: 700; line-height: 1.7; margin-bottom: 14px; }
        .featured-truth,.quest-truth { border-radius: 18px; background: #fff7ed; border: 2px solid #fed7aa; padding: 14px 16px; color: #7c2d12; font-family: var(--font-nunito); font-weight: 900; }
        .quest-start-cta { margin-top: 20px; display: inline-flex; justify-content: center; align-items: center; min-height: 52px; width: fit-content; border-radius: 999px; padding: 0 24px; background: linear-gradient(180deg,#6366f1,#4338ca); color: #fff; font-family: var(--font-nunito); font-weight: 1000; box-shadow: 0 12px 26px rgba(79,70,229,.26); }
        .coming-header { margin: 46px 0 20px; text-align: center; }
        .coming-title { font-family: var(--font-cinzel); color: var(--deep); font-size: clamp(1.8rem,5vw,2.6rem); margin-bottom: 8px; }
        .quest-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 18px; }
        .quest-card { position: relative; min-height: 360px; border-radius: 30px; overflow: hidden; border: 4px solid rgba(79,70,229,.75); box-shadow: 0 22px 56px rgba(13,31,60,.2); text-decoration: none; color: inherit; background: #0d1f3c; }
        .quest-card-media { position: absolute; inset: 0; overflow: hidden; background: #0d1f3c; }
        .quest-card-media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg,rgba(7,18,36,.08),rgba(7,18,36,.3) 36%,rgba(7,18,36,.92)); }
        .quest-card-copy { position: relative; z-index: 1; min-height: 360px; padding: 20px; display: flex; flex-direction: column; justify-content: flex-end; }
        .quest-card h3 { font-family: var(--font-nunito); font-weight: 1000; color: #fff; font-size: clamp(1.35rem,4vw,1.9rem); line-height: 1.05; margin-bottom: 10px; text-shadow: 0 8px 26px rgba(0,0,0,.45); }
        .quest-card p { color: rgba(255,255,255,.95); text-shadow: 0 5px 18px rgba(0,0,0,.45); }
        .quest-card .status-pill { margin-bottom: 8px; background: rgba(255,216,102,.94); color: #3b2307; }
        .quest-card .quest-truth { margin-bottom: 0; background: rgba(255,247,237,.92); }
        .quest-card .quest-start-cta { margin-top: 14px; }
        .back-link { display: block; margin-top: 28px; text-align: center; color: var(--fire); font-family: var(--font-nunito); font-weight: 900; text-decoration: none; }
        @keyframes questMapDrift { from { transform: scale(1.04) translate3d(-10px,-6px,0); } to { transform: scale(1.1) translate3d(12px,8px,0); } }
        @keyframes orbFloat { 0%,100% { transform: translate3d(0,0,0) scale(.8); opacity: .35; } 50% { transform: translate3d(18px,-44px,0) scale(1.2); opacity: 1; } }
        @keyframes imageBreathe { from { transform: scale(1); } to { transform: scale(1.035); } }
        @media (max-width: 860px) { .featured-quest { grid-template-columns: 1fr; } .featured-media { min-height: 280px; } .quest-grid { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) { .quest-index-hero::before,.truth-orbs span,.featured-img,.quest-card img { animation: none !important; } .featured-quest:hover .featured-img,.quest-card:hover img { transform: none; } }
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
          <Link href={featured.href} className="featured-quest">
            <div className="featured-media">
              <img className="featured-img" src={featured.image} alt={featured.title} />
            </div>
            <div className="featured-copy">
              <span className="status-pill">{c.activeBadge} · {featured.verse}</span>
              <p className="quest-kicker">{c.featured}</p>
              <h2 className="featured-title">{featured.title}</h2>
              <p className="featured-desc">{featured.desc}</p>
              <div className="featured-truth">{featured.truth}</div>
              <span className="quest-start-cta">{c.start}</span>
            </div>
          </Link>

          <div className="coming-header">
            <p className="quest-kicker">{c.activeBadge}</p>
            <h2 className="coming-title">{c.all}</h2>
          </div>

          <div className="quest-grid">
            {more.map(item => (
              <Link className="quest-card" href={item.href} key={item.href}>
                <div className="quest-card-media"><img src={item.image} alt={item.title} /></div>
                <div className="quest-card-copy">
                  <span className="status-pill">{item.verse}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="quest-truth">{item.truth}</div>
                  <span className="quest-start-cta">{c.start}</span>
                </div>
              </Link>
            ))}
          </div>

          <Link href="/" className="back-link">{c.back}</Link>
        </div>
      </section>
    </main>
  )
}
