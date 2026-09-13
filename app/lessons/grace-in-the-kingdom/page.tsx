'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const PURPLE = '#6d28d9'
const NAVY = '#20123d'
const GOLD = '#f59e0b'
const CREAM = '#fff9e8'
const HERO = '/images/jr/lessons/grace-in-the-kingdom/topic-grace-in-the-kingdom.png'
const VISUALS = {
  calling: '/images/jr/lessons/grace-in-the-kingdom/01-calling-times.png',
  payment: '/images/jr/lessons/grace-in-the-kingdom/02-payment-comparison.png',
  gift: '/images/jr/lessons/grace-in-the-kingdom/03-gift-versus-wages.png',
  cross: '/images/jr/lessons/grace-in-the-kingdom/04-cross-gospel.png',
  pardon: '/images/jr/lessons/grace-in-the-kingdom/05-sentry-pardon.png',
  complete: '/images/jr/lessons/grace-in-the-kingdom/06-completion-home.png',
}

const scriptureEn = {
  kingdom: {
    reference: 'Matthew 20:1', translation: 'ESV',
    text: 'For the kingdom of heaven is like a master of a house who went out early in the morning to hire laborers for his vineyard.',
    url: 'https://www.bible.com/bible/59/MAT.20.1.ESV',
  },
  generous: {
    reference: 'Matthew 20:15', translation: 'ESV',
    text: 'Am I not allowed to do what I choose with what belongs to me? Or do you begrudge my generosity?',
    url: 'https://www.bible.com/bible/59/MAT.20.15.ESV',
  },
  gospel: {
    reference: 'Ephesians 2:8–9', translation: 'ESV',
    text: 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.',
    url: 'https://www.bible.com/bible/59/EPH.2.8-9.ESV',
  },
}

const scriptureRu = {
  kingdom: {
    reference: 'Матфея 20:1', translation: 'RST',
    text: 'Ибо Царство Небесное подобно хозяину дома, который вышел рано поутру нанять работников в виноградник свой',
    url: 'https://www.bible.com/bible/167/MAT.20.1.RST',
  },
  generous: {
    reference: 'Матфея 20:15', translation: 'RST',
    text: 'разве я не властен в своем делать, что́ хочу? или глаз твой завистлив оттого, что я добр?',
    url: 'https://www.bible.com/bible/167/MAT.20.15.RST',
  },
  gospel: {
    reference: 'Ефесянам 2:8–9', translation: 'RST',
    text: 'Ибо благодатью вы спасены через веру, и сие не от вас, Божий дар: не от дел, чтобы никто не хвалился.',
    url: 'https://www.bible.com/bible/167/EPH.2.8-9.RST',
  },
}

type Scripture = typeof scriptureEn.kingdom
type Choice = { text: string; correct: boolean; explain: string }
type Scenario = { emoji: string; prompt: string; choices: Choice[] }
type Truth = { statement: string; answer: boolean; explain: string }

const scenariosEn: Scenario[] = [
  {
    emoji: '⚽', prompt: 'A new player joins near the end, and the coach gives everyone the same team snack. What is the grace-shaped response?',
    choices: [
      { text: 'Complain because I was here longer', correct: false, explain: 'That sounds like the first workers. Comparison can make a generous gift feel unfair.' },
      { text: 'Thank the coach and welcome the new player', correct: true, explain: 'Yes. Grace celebrates generosity instead of keeping score against another person.' },
    ],
  },
  {
    emoji: '🧩', prompt: 'Your friend finally understands something that took you weeks to learn. What should you do?',
    choices: [
      { text: 'Celebrate and help them take the next step', correct: true, explain: 'Grace is glad when another person receives help.' },
      { text: 'Make sure everyone knows I learned it first', correct: false, explain: 'Grace leaves no room for boasting. Every ability is something we received.' },
    ],
  },
  {
    emoji: '🙏', prompt: 'You obeyed all week. Does God now owe you salvation?',
    choices: [
      { text: 'Yes—good behavior purchases eternal life', correct: false, explain: 'No. Our obedience matters, but it cannot purchase rescue from sin. Jesus saves.' },
      { text: 'No—salvation is God’s gift received through faith', correct: true, explain: 'Exactly. We obey because we belong to Jesus, not to make Him owe us.' },
    ],
  },
]

const scenariosRu: Scenario[] = [
  {
    emoji: '⚽', prompt: 'Новый игрок пришёл почти в конце, а тренер дал всем одинаковое угощение. Как ответить с благодатью?',
    choices: [
      { text: 'Жаловаться, потому что я был здесь дольше', correct: false, explain: 'Так рассуждали первые работники. Сравнение мешает радоваться щедрому подарку.' },
      { text: 'Поблагодарить тренера и принять нового игрока', correct: true, explain: 'Верно. Благодать радуется щедрости и не считает себя лучше другого.' },
    ],
  },
  {
    emoji: '🧩', prompt: 'Друг наконец понял то, что ты учил несколько недель. Как поступить?',
    choices: [
      { text: 'Порадоваться и помочь ему сделать следующий шаг', correct: true, explain: 'Благодать радуется, когда другой человек получает помощь.' },
      { text: 'Напомнить всем, что я понял это раньше', correct: false, explain: 'Благодать не оставляет места хвастовству. Все способности мы получили.' },
    ],
  },
  {
    emoji: '🙏', prompt: 'Ты хорошо слушался всю неделю. Теперь Бог обязан дать тебе спасение?',
    choices: [
      { text: 'Да — хорошим поведением можно купить вечную жизнь', correct: false, explain: 'Нет. Послушание важно, но оно не может спасти нас от греха. Спасает Иисус.' },
      { text: 'Нет — спасение есть Божий дар, принимаемый верой', correct: true, explain: 'Именно. Мы слушаемся, потому что принадлежим Иисусу, а не чтобы Бог стал нашим должником.' },
    ],
  },
]

const truthsEn: Truth[] = [
  { statement: 'Grace means God pretends sin is harmless.', answer: false, explain: 'Grace is costly. Jesus faced the judgment our sin deserves and gives believers His righteousness.' },
  { statement: 'The vineyard owner treated the first workers unjustly.', answer: false, explain: 'He paid exactly what he promised. His generosity to the last workers did not wrong the first.' },
  { statement: 'Salvation is God’s gift, not a prize for outperforming someone else.', answer: true, explain: 'That is the good news of Ephesians 2:8–9.' },
  { statement: 'Grace should make us thankful, humble, and ready to show grace.', answer: true, explain: 'Yes. Grace changes how we see God, ourselves, and other people.' },
]

const truthsRu: Truth[] = [
  { statement: 'Благодать означает, что Бог считает грех безобидным.', answer: false, explain: 'Нет. Благодать дорого стоила: Иисус понёс суд за наш грех и даёт верующим Свою праведность.' },
  { statement: 'Хозяин виноградника поступил несправедливо с первыми работниками.', answer: false, explain: 'Он заплатил им ровно столько, сколько обещал. Щедрость к последним не была злом против первых.' },
  { statement: 'Спасение — Божий дар, а не приз за победу над другими.', answer: true, explain: 'Это добрая весть из Ефесянам 2:8–9.' },
  { statement: 'Благодать учит нас благодарности, смирению и милости к людям.', answer: true, explain: 'Верно. Благодать меняет наш взгляд на Бога, себя и других.' },
]

function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <section style={{ background: '#fff', borderRadius: 26, padding: 'clamp(20px,4vw,38px)', boxShadow: '0 18px 50px rgba(64,35,105,.12)', border: '1px solid rgba(109,40,217,.13)', ...style }}>{children}</section>
}

function ScriptureBox({ value, isRu }: { value: Scripture; isRu: boolean }) {
  return <div style={{ padding: 20, borderRadius: 20, background: '#fffaf0', border: '2px solid rgba(245,158,11,.28)', margin: '18px 0' }}>
    <a href={value.url} target="_blank" rel="noreferrer" style={{ color: PURPLE, fontWeight: 900, textDecoration: 'none' }}>{value.reference} · {value.translation} ↗</a>
    <blockquote style={{ margin: '12px 0 6px', color: NAVY, fontFamily: 'var(--font-lora)', fontSize: 'clamp(1rem,2.4vw,1.2rem)', lineHeight: 1.7 }}>“{value.text}”</blockquote>
    <small style={{ color: '#6b7280', fontWeight: 700 }}>{isRu ? 'Точный текст и ссылка: Bible.com' : 'Exact text and source link: Bible.com'}</small>
  </div>
}

function LessonImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return <figure style={{ margin: '18px 0', overflow: 'hidden', borderRadius: 22, background: '#f3e8ff', boxShadow: '0 12px 30px rgba(64,35,105,.12)' }}>
    <div style={{ position: 'relative', aspectRatio: '4 / 3' }}><Image src={src} alt={alt} fill sizes="(max-width: 720px) 100vw, 720px" style={{ objectFit: 'cover' }} /></div>
    <figcaption style={{ padding: '11px 15px 13px', color: '#5b506d', fontWeight: 750, lineHeight: 1.45 }}>{caption}</figcaption>
  </figure>
}

export default function GraceInTheKingdomPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const scripture = isRu ? scriptureRu : scriptureEn
  const scenarios = isRu ? scenariosRu : scenariosEn
  const truths = isRu ? truthsRu : truthsEn
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [truthIndex, setTruthIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [practiceDone, setPracticeDone] = useState(false)
  const [complete, setComplete] = useState(false)
  const progress = useMemo(() => complete ? 100 : practiceDone ? 75 + truthIndex * 6 : 25 + scenarioIndex * 15, [complete, practiceDone, scenarioIndex, truthIndex])

  function choose(choice: Choice) {
    if (feedback) return
    setFeedback({ ok: choice.correct, text: choice.explain })
    if (!choice.correct) return
    window.setTimeout(() => {
      setFeedback(null)
      if (scenarioIndex < scenarios.length - 1) setScenarioIndex((value) => value + 1)
      else setPracticeDone(true)
    }, 900)
  }

  function answerTruth(answer: boolean) {
    if (feedback) return
    const item = truths[truthIndex]
    const ok = answer === item.answer
    setFeedback({ ok, text: ok ? item.explain : (isRu ? 'Вернись к библейской истине и попробуй ещё раз.' : 'Return to the Bible truth and try again.') })
    if (!ok) return
    window.setTimeout(() => {
      setFeedback(null)
      if (truthIndex < truths.length - 1) setTruthIndex((value) => value + 1)
      else setComplete(true)
    }, 900)
  }

  function restart() {
    setScenarioIndex(0); setTruthIndex(0); setFeedback(null); setPracticeDone(false); setComplete(false)
  }

  return <main style={{ minHeight: '100vh', background: `radial-gradient(circle at top,#f5e8ff 0,${CREAM} 44%,#fff 100%)`, color: NAVY }}>
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px clamp(16px,4vw,44px) 70px' }}>
      <Link href="/lessons" style={{ color: PURPLE, fontWeight: 900, textDecoration: 'none' }}>← {isRu ? 'Все уроки' : 'All lessons'}</Link>

      <header style={{ position: 'relative', overflow: 'hidden', borderRadius: 30, margin: '18px 0 22px', minHeight: 430, display: 'grid', alignItems: 'end', boxShadow: '0 25px 65px rgba(32,18,61,.22)' }}>
        <Image src={HERO} alt={isRu ? 'Хозяин виноградника щедро платит работникам, а Майкл читает Библию' : 'A vineyard owner generously pays workers while Michael reads the Bible'} fill priority sizes="(max-width: 1080px) 100vw, 1080px" style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(20,8,40,.05) 22%,rgba(20,8,40,.9) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(24px,5vw,54px)', color: '#fff' }}>
          <div style={{ color: '#fde68a', fontWeight: 950, letterSpacing: '.06em', textTransform: 'uppercase' }}>{isRu ? 'Матфея 20:1–16 · Дар, а не приз' : 'Matthew 20:1–16 · A gift, not a prize'}</div>
          <h1 style={{ margin: '10px 0', fontFamily: 'var(--font-lora)', fontSize: 'clamp(2.35rem,7vw,5rem)', lineHeight: .98 }}>{isRu ? 'Благодать в Царстве Небесном' : 'Grace in the Kingdom of Heaven'}</h1>
          <p style={{ maxWidth: 720, margin: 0, fontSize: 'clamp(1rem,2.5vw,1.25rem)', lineHeight: 1.6, fontWeight: 750 }}>{isRu ? 'Иисус показывает Царство, где Божья щедрость разрушает гордость и спасение принимают как дар.' : 'Jesus shows a Kingdom where God’s generosity overturns pride and salvation is received as a gift.'}</p>
        </div>
      </header>

      <div aria-label={isRu ? 'Прогресс урока' : 'Lesson progress'} style={{ height: 12, background: '#e9d5ff', borderRadius: 999, overflow: 'hidden', marginBottom: 24 }}><div style={{ height: '100%', width: `${Math.min(100, progress)}%`, background: `linear-gradient(90deg,${PURPLE},${GOLD})`, transition: 'width .3s ease' }} /></div>

      <div style={{ display: 'grid', gap: 22 }}>
        <Card>
          <h2 style={{ marginTop: 0, fontSize: 'clamp(1.55rem,4vw,2.25rem)' }}>{isRu ? '1. Войди в историю' : '1. Enter the story'}</h2>
          <LessonImage src={VISUALS.calling} alt={isRu ? 'Хозяин зовёт работников в виноградник в разное время дня, а Майкл читает Библию' : 'The owner calls workers into the vineyard at different times while Michael reads the Bible'} caption={isRu ? 'Хозяин продолжал звать работников — утром, днём и почти в конце дня.' : 'The owner kept calling workers—morning, midday, and almost at the end of the day.'} />
          <p style={{ lineHeight: 1.75, fontSize: '1.06rem' }}>{isRu ? 'Хозяин снова и снова зовёт работников в виноградник: рано утром, позже и почти в конце дня. Вечером он проявляет удивительную щедрость. Первые работники получают обещанное, но сердятся, когда последние тоже получают полный динарий.' : 'A master keeps calling workers into his vineyard: early, later, and almost at the end of the day. At evening he shows surprising generosity. The first workers receive exactly what he promised, but they become angry when the last workers also receive a full denarius.'}</p>
          <ScriptureBox value={scripture.kingdom} isRu={isRu} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
            {(isRu ? ['Рано утром — призван', 'В полдень — призван', 'Поздно — призван', 'Вечером — щедрый хозяин'] : ['Early — called', 'Midday — called', 'Late — called', 'Evening — generous master']).map((item, index) => <div key={item} style={{ borderRadius: 18, padding: 17, background: index === 3 ? '#fef3c7' : '#f3e8ff', fontWeight: 900, textAlign: 'center' }}>{index === 3 ? '🎁' : '🍇'}<br />{item}</div>)}
          </div>
        </Card>

        <Card>
          <h2 style={{ marginTop: 0 }}>{isRu ? '2. Четыре окна благодати' : '2. Four windows into grace'}</h2>
          <p style={{ lineHeight: 1.75 }}>{isRu ? 'Смотри не только на монету, а на доброго Хозяина. Иисус учит нас видеть Божий характер и радоваться тому, что Он зовёт людей к Себе.' : 'Do not stare only at the coin; look at the good Master. Jesus teaches us to see God’s character and rejoice that He calls people to Himself.'}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            <LessonImage src={VISUALS.payment} alt={isRu ? 'Хозяин одинаково платит работникам, пока некоторые сравнивают себя с другими' : 'The owner pays workers equally while some compare themselves with others'} caption={isRu ? 'Одинаковая монета раскрыла разные сердца: благодарность или ропот.' : 'The same coin revealed different hearts: gratitude or grumbling.'} />
            <LessonImage src={VISUALS.gift} alt={isRu ? 'Майкл видит путь Божьего дара и тяжёлый путь попыток заслужить спасение' : 'Michael sees the path of God’s gift and the heavy path of trying to earn salvation'} caption={isRu ? 'Спасение — Божий дар. Его принимают верой, а не зарабатывают.' : 'Salvation is God’s gift. It is received by faith, not earned.'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
            {[
              { emoji: '📣', en: ['Called by grace', 'The workers did not hire themselves. God lovingly calls people who cannot rescue themselves.'], ru: ['Призваны благодатью', 'Работники не могли нанять сами себя. Бог с любовью зовёт людей, которые не могут спасти себя.'] },
              { emoji: '🎁', en: ['Gift, not wages', 'Sin earns death, but eternal life is God’s gift in Jesus. Salvation is received by faith, never achieved by keeping score.'], ru: ['Дар, а не плата', 'Грех приносит смерть, но вечная жизнь — Божий дар в Иисусе. Спасение принимают верой, а не зарабатывают подсчётом заслуг.'] },
              { emoji: '👑', en: ['The Master is generous', 'The owner kept his promise to the first workers and chose to be generous to the last. God is always right, and He is more generous than we deserve.'], ru: ['Хозяин щедр', 'Хозяин исполнил обещание первым и проявил щедрость к последним. Бог всегда прав и щедрее, чем мы заслуживаем.'] },
              { emoji: '❤️', en: ['Jesus is the treasure', 'The greatest blessing is not getting more stuff than someone else. It is knowing Jesus and belonging to Him.'], ru: ['Иисус — наше сокровище', 'Главное благословение — не получить больше вещей, чем другой. Главное — знать Иисуса и принадлежать Ему.'] },
            ].map((item) => { const copy = isRu ? item.ru : item.en; return <article key={copy[0]} style={{ padding: 19, borderRadius: 20, background: '#faf5ff' }}><div style={{ fontSize: 34 }}>{item.emoji}</div><h3>{copy[0]}</h3><p style={{ lineHeight: 1.65 }}>{copy[1]}</p></article> })}
          </div>
          <ScriptureBox value={scripture.generous} isRu={isRu} />
          <div style={{ padding: 18, borderLeft: `6px solid ${PURPLE}`, background: '#f5f3ff', borderRadius: 14, fontWeight: 800, lineHeight: 1.65 }}>{isRu ? 'Ловушка сравнения: первые работники были довольны обещанной платой, пока не посмотрели на подарок другим. Сравнение превращает благодарность в ропот. Благодать учит нас говорить: «Спасибо, Господи», и радоваться, когда Он добр к другому.' : 'The comparison trap: the first workers were content with the promised pay until they looked at someone else’s gift. Comparison turns gratitude into grumbling. Grace teaches us to say, “Thank You, Lord,” and rejoice when He is kind to another person.'}</div>
        </Card>

        <Card>
          <h2 style={{ marginTop: 0 }}>{isRu ? '3. Серьёзная вина и настоящее помилование' : '3. Serious guilt and real pardon'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            <LessonImage src={VISUALS.pardon} alt={isRu ? 'Президент вручает раскаявшемуся часовому помилование, пока Майкл читает Библию' : 'A president gives a remorseful sentry a pardon while Michael reads the Bible'} caption={isRu ? 'Вина была настоящей — и помилование было незаслуженным даром.' : 'The guilt was real—and the pardon was an undeserved gift.'} />
            <LessonImage src={VISUALS.cross} alt={isRu ? 'Майкл и дети смотрят на пустой крест в свете восхода' : 'Michael and children look toward the empty cross in the sunrise'} caption={isRu ? 'На кресте мы видим: Бог справедлив, и Бог даёт благодать верующим в Иисуса.' : 'At the cross we see that God is just and gives grace to those who trust Jesus.'} />
          </div>
          <p style={{ lineHeight: 1.75 }}>{isRu ? 'В проповеди прозвучал рассказ о часовом времён Гражданской войны в Америке. Он уснул на посту и получил серьёзный приговор, потому что его задача защищала других. Президент помиловал его. Смысл не в том, что проступок был маленьким. Помилование велико именно потому, что вина была настоящей.' : 'The sermon told of a Civil War sentry who fell asleep on duty and received a serious sentence because his watch protected others. The president pardoned him. The point is not that his offense was tiny. The pardon is great precisely because the guilt was real.'}</p>
          <div style={{ padding: 18, borderLeft: `6px solid ${GOLD}`, background: '#fffbeb', borderRadius: 14, fontWeight: 800 }}>{isRu ? 'Благодать не называет зло добром. Она даёт виновному незаслуженное спасение — за счёт того, кто проявляет милость.' : 'Grace does not rename evil as good. It gives undeserved rescue to the guilty—at the cost carried by the giver of mercy.'}</div>
        </Card>

        {!practiceDone ? <Card>
          <h2 style={{ marginTop: 0 }}>{isRu ? `4. Выбор благодати · ${scenarioIndex + 1}/${scenarios.length}` : `4. Grace choice · ${scenarioIndex + 1}/${scenarios.length}`}</h2>
          <div style={{ fontSize: 44 }}>{scenarios[scenarioIndex].emoji}</div>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.6, fontWeight: 850 }}>{scenarios[scenarioIndex].prompt}</p>
          <div style={{ display: 'grid', gap: 12 }}>{scenarios[scenarioIndex].choices.map((choice) => <button key={choice.text} type="button" onClick={() => choose(choice)} disabled={Boolean(feedback)} style={{ padding: 16, borderRadius: 16, border: '2px solid #ddd6fe', background: '#fff', color: NAVY, textAlign: 'left', font: 'inherit', fontWeight: 850, cursor: 'pointer' }}>{choice.text}</button>)}</div>
          {feedback && <p role="status" style={{ padding: 14, borderRadius: 14, background: feedback.ok ? '#dcfce7' : '#fee2e2', fontWeight: 800 }}>{feedback.ok ? '✓ ' : '↺ '}{feedback.text}</p>}
        </Card> : !complete ? <Card>
          <h2 style={{ marginTop: 0 }}>{isRu ? `5. Проверка Евангелия · ${truthIndex + 1}/${truths.length}` : `5. Gospel truth check · ${truthIndex + 1}/${truths.length}`}</h2>
          <ScriptureBox value={scripture.gospel} isRu={isRu} />
          <p style={{ fontSize: '1.18rem', lineHeight: 1.6, fontWeight: 900 }}>{truths[truthIndex].statement}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => answerTruth(true)} disabled={Boolean(feedback)} style={{ flex: 1, minWidth: 140, padding: 15, border: 0, borderRadius: 16, color: '#fff', background: '#15803d', font: 'inherit', fontWeight: 950 }}>{isRu ? 'Правда' : 'True'}</button>
            <button type="button" onClick={() => answerTruth(false)} disabled={Boolean(feedback)} style={{ flex: 1, minWidth: 140, padding: 15, border: 0, borderRadius: 16, color: '#fff', background: '#b91c1c', font: 'inherit', fontWeight: 950 }}>{isRu ? 'Неправда' : 'False'}</button>
          </div>
          {feedback && <p role="status" style={{ padding: 14, borderRadius: 14, background: feedback.ok ? '#dcfce7' : '#fee2e2', fontWeight: 800 }}>{feedback.ok ? '✓ ' : '↺ '}{feedback.text}</p>}
        </Card> : <Card style={{ textAlign: 'center', background: 'linear-gradient(135deg,#f3e8ff,#fffbeb)' }}>
          <div style={{ fontSize: 68 }}>🎁</div>
          <h2 style={{ fontSize: 'clamp(2rem,6vw,3.5rem)', margin: '5px 0' }}>{isRu ? 'Дар принят!' : 'Gift received!'}</h2>
          <LessonImage src={VISUALS.complete} alt={isRu ? 'Майкл и работники вместе радуются у открытых ворот виноградника' : 'Michael and the workers celebrate together at the open vineyard gate'} caption={isRu ? 'Мы ещё не дома. Пока Бог даёт время, служим доброму Хозяину с благодарностью.' : 'We are not home yet. While God gives us time, we serve the good Master with gratitude.'} />
          <p style={{ maxWidth: 700, margin: '14px auto', lineHeight: 1.7, fontSize: '1.08rem' }}>{isRu ? 'Ты увидел правильную линию: грех серьёзен, Божья благодать щедра, спасение даёт Иисус, а благодарное сердце перестаёт хвалиться и учится милости.' : 'You found the right line: sin is serious, God’s grace is generous, Jesus gives salvation, and a thankful heart stops boasting and learns to show mercy.'}</p>
          <ScriptureBox value={scripture.gospel} isRu={isRu} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}><Link href="/lessons" style={{ padding: '14px 20px', borderRadius: 15, background: PURPLE, color: '#fff', textDecoration: 'none', fontWeight: 950 }}>{isRu ? 'Следующий урок' : 'Choose another lesson'}</Link><button type="button" onClick={restart} style={{ padding: '14px 20px', borderRadius: 15, border: `2px solid ${PURPLE}`, background: '#fff', color: PURPLE, font: 'inherit', fontWeight: 950 }}>{isRu ? 'Пройти ещё раз' : 'Do it again'}</button></div>
        </Card>}

        <Card style={{ background: '#f8fafc' }}>
          <h2 style={{ marginTop: 0 }}>{isRu ? 'Для разговора с родителями' : 'Parent conversation'}</h2>
          <ul style={{ lineHeight: 1.8 }}><li>{isRu ? 'Когда тебе трудно радоваться добру, которое получил другой?' : 'When is it difficult to celebrate good given to someone else?'}</li><li>{isRu ? 'Почему спасение нельзя заработать?' : 'Why can salvation never be earned?'}</li><li>{isRu ? 'Кому мы можем показать незаслуженную доброту на этой неделе?' : 'Who can we show undeserved kindness to this week?'}</li></ul>
          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 0 }}>{isRu ? 'Урок основан на Матфея 19:16–20:16 и проповеди о призыве, мудрости и любви благодати. Добрые дела не спасают; они являются плодом жизни с Иисусом.' : 'This lesson follows Matthew 19:16–20:16 and the sermon’s call, wisdom, and love of grace. Good works do not save; they are fruit of life with Jesus.'}</p>
        </Card>
      </div>
    </div>
  </main>
}
