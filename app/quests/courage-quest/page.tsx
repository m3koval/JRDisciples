'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type Scene = {
  id: 'entrance' | 'whispers' | 'stones' | 'rescue'
  place: string
  title: string
  body: string
  danger: string
  prompt: string
  choices: { label: string; good: boolean; response: string }[]
  truth: string
  verse: string
  alt: string
}

const EN: Scene[] = [
  {
    id: 'entrance',
    place: 'The Cave Entrance',
    title: 'The lamb is lost',
    body: 'Mica sees his little sister crying. Her small wooden lamb rolled into the Cave of Echoes. The cave is dark, and everyone says it whispers scary things.',
    danger: 'The first echo whispers: “Turn back. You are too scared.”',
    prompt: 'What should Mica do first?',
    choices: [
      { label: 'Pray, lift the lamp, and take one careful step', good: true, response: 'Wise choice. Courage starts by trusting God, not by pretending the cave is easy.' },
      { label: 'Brag: “I am never scared!”', good: false, response: 'Not quite. Real courage tells the truth: “I am afraid, but God is with me.”' },
      { label: 'Run in without thinking', good: false, response: 'Slow down. Wisdom asks God for help before rushing into danger.' },
    ],
    truth: 'God helps me take the next right step.',
    verse: 'Psalm 56:3 — “When I am afraid, I put my trust in you.”',
    alt: 'Mica and Liora at the glowing cave entrance looking for the lost wooden lamb',
  },
  {
    id: 'whispers',
    place: 'The Whispering Tunnel',
    title: 'The cave tells a lie',
    body: 'Mica walks deeper. The walls sparkle like black glass. Suddenly the cave repeats a lie again and again.',
    danger: '“You are alone… alone… alone…”',
    prompt: 'Which truth should Mica answer with?',
    choices: [
      { label: '“God is with me wherever I go.”', good: true, response: 'Yes. God’s truth is stronger than fear’s echo.' },
      { label: '“Nothing scary will ever happen.”', good: false, response: 'Careful. God does not promise nothing scary will happen. He promises He is with His people.' },
      { label: '“I am the strongest kid here.”', good: false, response: 'That puts trust in self. Bible courage puts trust in God.' },
    ],
    truth: 'God is with me in scary places.',
    verse: 'Joshua 1:9 — “The Lord your God is with you wherever you go.”',
    alt: 'Mica holding a lantern in the whispering tunnel while golden light pushes back blue shadows',
  },
  {
    id: 'stones',
    place: 'The Cracked Stone Path',
    title: 'One step at a time',
    body: 'Mica finds a path of cracked stones over a deep shadow. He cannot see the whole way, but his lamp shows the next stone.',
    danger: 'The echo says: “If you cannot see the end, you should quit.”',
    prompt: 'What is the faithful choice?',
    choices: [
      { label: 'Step only where the lamp gives light', good: true, response: 'Good. God often gives enough light for the next step, not the whole map.' },
      { label: 'Throw the lamp away and jump', good: false, response: 'That is reckless, not courageous. Courage walks with wisdom.' },
      { label: 'Sit down forever until fear disappears', good: false, response: 'Fear may not vanish first. With God’s help, Mica can obey while afraid.' },
    ],
    truth: 'God’s Word is a lamp for my path.',
    verse: 'Psalm 119:105 — “Your word is a lamp to my feet and a light to my path.”',
    alt: 'Mica carefully crossing glowing cracked stones with his lantern lighting the next step',
  },
  {
    id: 'rescue',
    place: 'The Deep Chamber',
    title: 'The lost lamb is found',
    body: 'At the deepest part of the cave, Mica sees the wooden lamb stuck between two rocks. The fear echo grows louder than before.',
    danger: '“You cannot finish. You should give up now.”',
    prompt: 'What should Mica remember?',
    choices: [
      { label: '“When I am afraid, I put my trust in You.”', good: true, response: 'Yes. Mica reaches out, rescues the lamb, and turns toward the light.' },
      { label: '“I only obey when it feels easy.”', good: false, response: 'Following God is not only for easy moments. Faith keeps going with God.' },
      { label: '“I should listen to every voice I hear.”', good: false, response: 'No. We test voices by God’s Word. Fear lies, but God tells the truth.' },
    ],
    truth: 'I can trust God when I am afraid.',
    verse: 'Psalm 56:3 — “When I am afraid, I put my trust in you.”',
    alt: 'Mica rescuing the wooden lamb in the deep chamber as golden lantern light fills the cave',
  },
]

const RU: Scene[] = [
  {
    id: 'entrance', place: 'Вход в пещеру', title: 'Потерянный ягнёнок', body: 'Мика видит, что его маленькая сестра плачет. Её деревянный ягнёнок укатился в Пещеру эха. В пещере темно, и все говорят, что она шепчет страшные слова.', danger: 'Первое эхо шепчет: «Поверни назад. Тебе слишком страшно».', prompt: 'Что Мике сделать сначала?',
    choices: [
      { label: 'Помолиться, поднять светильник и сделать один осторожный шаг', good: true, response: 'Мудрый выбор. Мужество начинается с доверия Богу.' },
      { label: 'Похвастаться: «Мне никогда не страшно!»', good: false, response: 'Не совсем. Настоящее мужество говорит правду: «Мне страшно, но Бог со мной».' },
      { label: 'Бежать внутрь не думая', good: false, response: 'Не спеши. Мудрость просит Бога о помощи.' },
    ], truth: 'Бог помогает мне сделать следующий правильный шаг.', verse: 'Псалом 55:4 — «Когда я в страхе, на Тебя я уповаю».', alt: 'Мика и Лиора у светящегося входа в пещеру ищут потерянного деревянного ягнёнка',
  },
  {
    id: 'whispers', place: 'Шепчущий туннель', title: 'Пещера говорит ложь', body: 'Мика идёт глубже. Стены сверкают, как чёрное стекло. Вдруг пещера повторяет ложь снова и снова.', danger: '«Ты один… один… один…»', prompt: 'Какой истиной должен ответить Мика?',
    choices: [
      { label: '«Бог со мной, куда бы я ни пошёл.»', good: true, response: 'Да. Божья истина сильнее эха страха.' },
      { label: '«Со мной никогда не случится ничего страшного.»', good: false, response: 'Осторожно. Бог обещает быть с нами, а не то, что никогда не будет страшно.' },
      { label: '«Я самый сильный ребёнок здесь.»', good: false, response: 'Это доверие себе. Библейское мужество доверяет Богу.' },
    ], truth: 'Бог со мной в страшных местах.', verse: 'Иисус Навин 1:9 — «Господь Бог твой с тобою везде, куда ни пойдёшь».', alt: 'Мика держит светильник в шепчущем туннеле, а золотой свет отгоняет синие тени',
  },
  {
    id: 'stones', place: 'Тропа треснувших камней', title: 'Шаг за шагом', body: 'Мика видит каменную тропу над глубокой тенью. Он не видит весь путь, но светильник показывает следующий камень.', danger: 'Эхо говорит: «Если ты не видишь конец пути, лучше остановись».', prompt: 'Какой выбор верный?',
    choices: [
      { label: 'Ступить туда, где светильник показывает путь', good: true, response: 'Хорошо. Бог часто даёт свет для следующего шага.' },
      { label: 'Бросить светильник и прыгнуть', good: false, response: 'Это безрассудство, а не мужество. Мужество идёт вместе с мудростью.' },
      { label: 'Сесть навсегда, пока страх не исчезнет', good: false, response: 'Страх может не исчезнуть сразу. С Божьей помощью можно повиноваться даже когда страшно.' },
    ], truth: 'Слово Божие — светильник для моего пути.', verse: 'Псалом 118:105 — «Слово Твоё — светильник ноге моей и свет стезе моей».', alt: 'Мика осторожно идёт по светящимся камням, а светильник показывает следующий шаг',
  },
  {
    id: 'rescue', place: 'Глубокий зал', title: 'Ягнёнок найден', body: 'В самой глубокой части пещеры Мика видит деревянного ягнёнка между двумя камнями. Эхо страха становится ещё громче.', danger: '«Ты не справишься. Сдавайся сейчас».', prompt: 'Что Мике нужно вспомнить?',
    choices: [
      { label: '«Когда я в страхе, на Тебя я уповаю.»', good: true, response: 'Да. Мика достаёт ягнёнка и идёт обратно к свету.' },
      { label: '«Я слушаюсь только когда легко.»', good: false, response: 'Следовать за Богом нужно не только в лёгкие моменты.' },
      { label: '«Я должен слушать каждый голос.»', good: false, response: 'Нет. Мы проверяем голоса Божьим Словом.' },
    ], truth: 'Я могу доверять Богу, когда мне страшно.', verse: 'Псалом 55:4 — «Когда я в страхе, на Тебя я уповаю».', alt: 'Мика спасает деревянного ягнёнка в глубоком зале, а золотой свет наполняет пещеру',
  },
]

const ui = {
  en: {
    quest: 'Courage Quest', title: 'The Cave of Echoes', subtitle: 'An interactive Bible adventure about courage, fear, and trusting God.', start: 'Begin Adventure', continue: 'Continue', tryAgain: 'Try another answer', truthLight: 'Truth Lights', completed: 'Quest Complete', badge: 'Courage Quest Badge', badgeLine: 'I can trust God when I am afraid.', bigTruth: 'Big Truth', parent: 'Parent / Teacher Talk', questions: ['Was Mica afraid?', 'Did God make the cave disappear?', 'What Bible truth helped Mica keep going?', 'What is one brave right thing you can do this week?'], prayer: 'Lord, when I am afraid, help me trust You. Give me courage to do what is right, one step at a time. In Jesus’ name, amen.', replay: 'Play Again', back: 'All Quests', correct: 'Truth light collected!', almost: 'Not the right line yet.', verses: 'Psalm 56:3 · Joshua 1:9 · Psalm 119:105', mission: 'Rescue the lamb. Answer fear with truth. Collect four truth lights.', scene: 'Scene', of: 'of', path: 'Quest Path', finalVerse: '“When I am afraid, I put my trust in you.”', finish: 'Finish Quest'
  },
  ru: {
    quest: 'Квест мужества', title: 'Пещера эха', subtitle: 'Интерактивное библейское приключение о мужестве, страхе и доверии Богу.', start: 'Начать приключение', continue: 'Продолжить', tryAgain: 'Попробовать другой ответ', truthLight: 'Огни истины', completed: 'Квест завершён', badge: 'Значок квеста мужества', badgeLine: 'Я могу доверять Богу, когда мне страшно.', bigTruth: 'Главная истина', parent: 'Вопросы для родителей / учителя', questions: ['Мике было страшно?', 'Бог убрал пещеру?', 'Какая библейская истина помогла Мике идти дальше?', 'Какой один смелый и правильный шаг ты можешь сделать на этой неделе?'], prayer: 'Господь, когда мне страшно, помоги мне доверять Тебе. Дай мне мужество поступать правильно, шаг за шагом. Во имя Иисуса, аминь.', replay: 'Играть снова', back: 'Все квесты', correct: 'Огонь истины собран!', almost: 'Пока не тот путь.', verses: 'Псалом 55:4 · Иисус Навин 1:9 · Псалом 118:105', mission: 'Спаси ягнёнка. Ответь страху истиной. Собери четыре огня истины.', scene: 'Сцена', of: 'из', path: 'Путь квеста', finalVerse: '«Когда я в страхе, на Тебя я уповаю».', finish: 'Завершить квест'
  },
}

const questImages: Record<string, string> = {
  cover: '/images/jr/quests/courage-quest/00-cover-courage-quest.png',
  entrance: '/images/jr/quests/courage-quest/01-scene-cave-entrance.png',
  whispers: '/images/jr/quests/courage-quest/02-scene-whispering-tunnel.png',
  stones: '/images/jr/quests/courage-quest/03-scene-cracked-stone-path.png',
  rescue: '/images/jr/quests/courage-quest/04-scene-deep-chamber-rescue.png',
  badge: '/images/jr/quests/courage-quest/05-badge-quest-complete.png',
}

export default function CourageQuestPage() {
  const { language } = useLanguage()
  const scenes = language === 'ru' ? RU : EN
  const t = ui[language]
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [solved, setSolved] = useState<boolean[]>(() => scenes.map(() => false))
  const [finished, setFinished] = useState(false)
  const feedbackRef = useRef<HTMLDivElement | null>(null)

  const scene = scenes[index]
  const lights = solved.filter(Boolean).length
  const progress = useMemo(() => Math.round((lights / scenes.length) * 100), [lights, scenes.length])
  const chosen = selected !== null ? scene.choices[selected] : null

  useEffect(() => {
    if (selected !== null) {
      window.requestAnimationFrame(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }, [selected])

  function choose(choiceIndex: number) {
    setSelected(choiceIndex)
    if (scene.choices[choiceIndex].good) {
      setSolved(prev => prev.map((v, i) => i === index ? true : v))
    }
  }

  function next() {
    setSelected(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (index === scenes.length - 1) {
      setFinished(true)
      return
    }
    setIndex(i => Math.min(i + 1, scenes.length - 1))
  }

  function replay() {
    setStarted(false)
    setFinished(false)
    setIndex(0)
    setSelected(null)
    setSolved(scenes.map(() => false))
  }

  return (
    <main className="courage-page">
      <style>{`
        .courage-page { min-height: 100vh; background: radial-gradient(circle at top,#152a5c,#081428 56%,#050914); color: #fff; overflow: hidden; }
        .courage-shell { max-width: 1160px; margin: 0 auto; padding: 24px 18px 60px; }
        .quest-back { display: inline-flex; align-items: center; color: #ffd866; font-family: var(--font-nunito); font-weight: 1000; text-decoration: none; margin-bottom: 18px; }
        .adventure-frame { position: relative; border-radius: 36px; overflow: hidden; min-height: 680px; box-shadow: 0 32px 100px rgba(0,0,0,.42); border: 4px solid rgba(255,216,102,.72); isolation: isolate; background: #0d1f3c; }
        .adventure-frame::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(180deg,rgba(8,20,40,.24),rgba(8,20,40,.88)), var(--frame-image); background-size: cover; background-position: center; transform: scale(1.03); animation: cinematicDrift 16s ease-in-out infinite alternate; z-index: -3; }
        .adventure-frame::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 48% 42%,rgba(255,216,102,.24),transparent 28%), linear-gradient(90deg,rgba(8,20,40,.84),rgba(8,20,40,.16) 50%,rgba(8,20,40,.78)); z-index: -2; }
        .truth-particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: -1; }
        .truth-particles span { position: absolute; width: 10px; height: 10px; border-radius: 999px; background: radial-gradient(circle,#fff8bd 0 22%,#fbbf24 46%,transparent 74%); box-shadow: 0 0 22px rgba(251,191,36,.9),0 0 46px rgba(251,191,36,.35); animation: particleRise var(--speed,8s) ease-in-out infinite; animation-delay: var(--delay,0s); opacity: .8; }
        .truth-particles span:nth-child(1) { left: 9%; top: 74%; --speed: 8s; --delay: -1s; }
        .truth-particles span:nth-child(2) { left: 26%; top: 28%; --speed: 7s; --delay: -3s; width: 7px; height: 7px; }
        .truth-particles span:nth-child(3) { left: 48%; top: 80%; --speed: 9s; --delay: -2s; }
        .truth-particles span:nth-child(4) { left: 73%; top: 28%; --speed: 7.5s; --delay: -4s; width: 8px; height: 8px; }
        .truth-particles span:nth-child(5) { left: 88%; top: 68%; --speed: 8.5s; --delay: -5s; }
        .hero-content { width: min(650px,100%); padding: clamp(18px,4vw,40px); padding-top: 18px; min-height: 520px; display: flex; align-items: flex-start; }
        .story-card { position: relative; background: rgba(255,255,255,.94); color: var(--text); border-radius: 32px; padding: clamp(18px,3vw,30px); border: 3px solid rgba(255,216,102,.86); box-shadow: 0 22px 70px rgba(0,0,0,.28); backdrop-filter: blur(12px); }
        .quest-kicker { font-family: var(--font-nunito); color: #4f46e5; font-size: .72rem; letter-spacing: 3px; text-transform: uppercase; font-weight: 1000; margin-bottom: 6px; }
        .quest-title { font-family: var(--font-cinzel); color: var(--deep); font-size: clamp(2rem,6vw,3.7rem); line-height: .98; margin: 0 0 10px; }
        .quest-subtitle { font-family: var(--font-lora); color: #374151; font-weight: 700; line-height: 1.55; font-size: 1rem; margin-bottom: 12px; }
        .verse-strip { border-radius: 18px; background: #fff7ed; border: 2px solid #fed7aa; padding: 11px 13px; color: #7c2d12; font-family: var(--font-nunito); font-weight: 900; margin: 12px 0; }
        .quest-button { display: inline-flex; width: fit-content; min-height: 54px; align-items: center; justify-content: center; border: none; border-radius: 999px; padding: 0 26px; background: linear-gradient(180deg,#6366f1,#4338ca); color: #fff; font-family: var(--font-nunito); font-weight: 1000; cursor: pointer; box-shadow: 0 14px 28px rgba(79,70,229,.28); transition: transform .18s, filter .18s; }
        .quest-button:hover { transform: translateY(-1px); filter: brightness(1.08); }
        .quest-button.green { background: linear-gradient(180deg,#22c55e,#15803d); }
        .quest-stage { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(360px,.95fr); gap: 24px; align-items: stretch; padding: clamp(16px,3vw,28px); }
        .scene-media { position: relative; border-radius: 30px; overflow: hidden; min-height: 610px; border: 3px solid rgba(255,255,255,.22); background: #0d1f3c; box-shadow: 0 24px 70px rgba(0,0,0,.32); }
        .scene-media img { width: 100%; height: 100%; object-fit: cover; display: block; animation: imageBreathe 10s ease-in-out infinite alternate; }
        .scene-media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg,transparent 48%,rgba(8,20,40,.46)); }
        .scene-card { background: rgba(255,255,255,.96); color: var(--text); border-radius: 30px; padding: clamp(20px,3vw,32px); border: 3px solid rgba(255,216,102,.82); box-shadow: 0 24px 70px rgba(0,0,0,.28); align-self: start; }
        .progress-label { display: flex; justify-content: space-between; gap: 16px; color: #fff7d6; font-family: var(--font-nunito); font-weight: 1000; text-transform: uppercase; letter-spacing: 1.4px; font-size: .78rem; margin-bottom: 10px; }
        .progress-track { height: 14px; border-radius: 999px; background: rgba(255,255,255,.2); overflow: hidden; margin-bottom: 18px; }
        .progress-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#fbbf24,#fef08a); transition: width .35s ease; }
        .scene-title { font-family: var(--font-cinzel); color: var(--deep); font-size: clamp(1.75rem,5vw,3rem); line-height: 1.05; margin: 0 0 12px; }
        .scene-body { font-family: var(--font-lora); color: #374151; font-weight: 700; font-size: 1.03rem; line-height: 1.75; }
        .echo-box { margin: 18px 0; border-radius: 18px; padding: 15px 16px; color: #fff7d6; background: linear-gradient(135deg,#111827,#1f2937); border-left: 6px solid #fbbf24; font-family: var(--font-nunito); font-weight: 1000; line-height: 1.55; }
        .prompt { font-family: var(--font-nunito); color: var(--deep); font-size: 1.12rem; font-weight: 1000; margin: 16px 0 10px; }
        .choice { width: 100%; min-height: 56px; text-align: left; border: 2px solid #e5e7eb; background: #fff; color: var(--text); border-radius: 18px; padding: 15px 16px; margin: 10px 0; font-family: var(--font-nunito); font-weight: 1000; cursor: pointer; line-height: 1.35; transition: transform .15s, border-color .15s, background .15s, box-shadow .15s; }
        .choice:hover { transform: translateY(-1px); border-color: #7ec8e3; background: #f0f9ff; box-shadow: 0 10px 22px rgba(13,31,60,.08); }
        .choice.good { border-color: #16a34a; background: #ecfdf5; }
        .choice.bad { border-color: #dc2626; background: #fff1f2; }
        .truth-panel { border-radius: 22px; padding: 16px; margin-top: 16px; background: linear-gradient(135deg,#fff7ed,#fffbeb); border: 2px solid #fed7aa; color: #7c2d12; font-family: var(--font-nunito); font-weight: 900; line-height: 1.55; }
        .badge-card { max-width: 860px; margin: clamp(18px,4vw,44px) auto; background: rgba(255,255,255,.96); color: var(--text); border-radius: 34px; padding: clamp(22px,5vw,44px); text-align: center; border: 4px solid #f0c040; box-shadow: 0 30px 90px rgba(0,0,0,.36); }
        .badge-image { width: min(430px,100%); border-radius: 30px; border: 4px solid #f0c040; box-shadow: 0 22px 54px rgba(79,70,229,.22); margin: 0 auto 22px; display: block; }
        .parent-box { text-align: left; max-width: 720px; margin: 22px auto; background: #fff; border-radius: 24px; padding: 22px; border: 2px solid #e5e7eb; }
        .parent-box h2 { font-family: var(--font-nunito); font-weight: 1000; color: var(--deep); margin-bottom: 8px; }
        .parent-box ol { font-family: var(--font-lora); color: #374151; line-height: 1.8; padding-left: 22px; font-weight: 700; }
        .prayer-box { margin-top: 16px; border-radius: 18px; background: #fff7ed; border: 2px solid #fed7aa; padding: 14px 16px; color: #7c2d12; font-family: var(--font-nunito); font-weight: 900; line-height: 1.6; }
        @keyframes cinematicDrift { from { transform: scale(1.03) translate3d(-8px,-4px,0); } to { transform: scale(1.1) translate3d(12px,8px,0); } }
        @keyframes particleRise { 0%,100% { transform: translate3d(0,0,0) scale(.8); opacity: .32; } 50% { transform: translate3d(20px,-48px,0) scale(1.2); opacity: 1; } }
        @keyframes imageBreathe { from { transform: scale(1); } to { transform: scale(1.045); } }
        @media (max-width: 900px) { .adventure-frame { min-height: auto; } .hero-content { min-height: 520px; } .quest-stage { grid-template-columns: 1fr; } .scene-media { min-height: 360px; } }
        @media (max-width: 560px) { .courage-shell { padding: 16px 10px 42px; } .adventure-frame { border-radius: 24px; } .scene-card,.story-card,.badge-card { border-radius: 24px; } .hero-content { min-height: 500px; padding: 18px; } }
        @media (prefers-reduced-motion: reduce) { .adventure-frame::before,.truth-particles span,.scene-media img { animation: none !important; } .quest-button:hover,.choice:hover { transform: none; } }
      `}</style>

      <div className="courage-shell">
        <Link href="/quests" className="quest-back">{t.back}</Link>

        {!started ? (
          <section className="adventure-frame" style={{ ['--frame-image' as string]: `url(${questImages.cover})` }}>
            <div className="truth-particles" aria-hidden="true"><span /><span /><span /><span /><span /></div>
            <div className="hero-content">
              <div className="story-card">
                <p className="quest-kicker">{t.quest}</p>
                <h1 className="quest-title">{t.title}</h1>
                <p className="quest-subtitle">{t.subtitle}</p>
                <div className="verse-strip">{t.verses}</div>
                <p className="quest-subtitle">{t.mission}</p>
                <button type="button" className="quest-button" onClick={() => setStarted(true)}>{t.start}</button>
              </div>
            </div>
          </section>
        ) : finished ? (
          <section className="badge-card">
            <img className="badge-image" src={questImages.badge} alt="Mica and Liora celebrating with the Courage Quest badge" />
            <p className="quest-kicker">{t.completed}</p>
            <h1 className="quest-title">{t.badge}</h1>
            <p className="quest-subtitle" style={{ color: '#4f46e5', fontFamily: 'var(--font-nunito)', fontWeight: 1000 }}>{t.badgeLine}</p>
            <div className="pull-quote" style={{ maxWidth: 720, margin: '20px auto' }}>
              <p className="pq-text">{t.finalVerse}</p>
              <span className="pq-ref">Psalm 56:3</span>
            </div>
            <div className="parent-box">
              <h2>{t.parent}</h2>
              <ol>{t.questions.map(q => <li key={q}>{q}</li>)}</ol>
              <div className="prayer-box">{t.prayer}</div>
            </div>
            <button className="quest-button" onClick={replay}>{t.replay}</button>
          </section>
        ) : (
          <section className="adventure-frame" style={{ ['--frame-image' as string]: `url(${questImages[scene.id]})` }}>
            <div className="truth-particles" aria-hidden="true"><span /><span /><span /><span /><span /></div>
            <div className="quest-stage">
              <div>
                <div className="progress-label">
                  <span>{t.path}</span>
                  <span>{t.truthLight}: {lights}/{scenes.length}</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                <div className="scene-media">
                  <img src={questImages[scene.id]} alt={scene.alt} />
                </div>
              </div>

              <div className="scene-card">
                <p className="quest-kicker">{t.scene} {index + 1} {t.of} {scenes.length} · {scene.place}</p>
                <h1 className="scene-title">{scene.title}</h1>
                <p className="scene-body">{scene.body}</p>
                <div className="echo-box">{scene.danger}</div>
                <h2 className="prompt">{scene.prompt}</h2>

                {scene.choices.map((choice, i) => {
                  const picked = selected === i
                  return (
                    <button key={choice.label} onClick={() => choose(i)} className={`choice ${picked ? choice.good ? 'good' : 'bad' : ''}`}>
                      {choice.label}
                    </button>
                  )
                })}

                {chosen && (
                  <div className="truth-panel" ref={feedbackRef}>
                    <strong>{chosen.good ? t.correct : t.almost}</strong>
                    <p style={{ marginTop: 6 }}>{chosen.response}</p>
                    {chosen.good && (
                      <>
                        <hr style={{ border: 0, borderTop: '1px solid rgba(124,45,18,.2)', margin: '12px 0' }} />
                        <p>{t.bigTruth}: {scene.truth}</p>
                        <p style={{ fontStyle: 'italic', marginTop: 4 }}>{scene.verse}</p>
                        <button className="quest-button green" onClick={next}>{index === scenes.length - 1 ? t.finish : t.continue}</button>
                      </>
                    )}
                    {!chosen.good && <p style={{ marginTop: 8 }}>{t.tryAgain}</p>}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
