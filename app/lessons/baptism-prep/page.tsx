'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type CheckOption = {
  text: string
  correct: boolean
  feedback: string
}

type PrepSection = {
  id: string
  icon: string
  image: string
  title: string
  bigIdea: string
  body: string[]
  activityTitle: string
  check: string
  options: CheckOption[]
}

type PrepQuestion = {
  question: string
  helper: string
}

type TruthCard = {
  text: string
  answer: 'is' | 'not'
  reason: string
}

const ACCENT = '#0a7090'
const ACCENT_DARK = '#0d3a6a'
const ACCENT_SOFT = '#e8f9ff'
const GOLD = '#f0a030'

const sectionsEn: PrepSection[] = [
  {
    id: 'story',
    icon: '🕊️',
    image: '/images/jr/lessons/baptism-prep/01-jesus-baptized-first.png',
    title: '1. Jesus Shows Us the Way',
    bigIdea: 'Jesus did not get baptized because He sinned. He was sinless. He obeyed the Father and showed the right path.',
    body: [
      'Jesus came to the Jordan River where John the Baptist was baptizing people. John was surprised because Jesus had no sin and did not need forgiveness.',
      'Jesus told John it was right to do this “to fulfill all righteousness.” That means Jesus was doing exactly what was right in God’s plan. Jesus obeyed the Father and stood with the people He came to save.',
      'When Jesus came up from the water, the Holy Spirit came down like a dove, and the Father spoke from heaven: “This is my beloved Son, with whom I am well pleased.”',
    ],
    activityTitle: 'Choose the clean line',
    check: 'Why did Jesus get baptized if He never sinned?',
    options: [
      { text: 'Because Jesus needed His sins washed away.', correct: false, feedback: 'Not quite. Jesus never sinned. He did not need forgiveness.' },
      { text: 'Because Jesus obeyed the Father and fulfilled righteousness.', correct: true, feedback: 'Yes. Jesus was baptized in perfect obedience and showed us the way.' },
      { text: 'Because John was stronger than Jesus.', correct: false, feedback: 'No. John knew Jesus was greater than he was.' },
    ],
  },
  {
    id: 'meaning',
    icon: '💧',
    image: '/images/jr/lessons/baptism-prep/02-baptism-sign.png',
    title: '2. Baptism Is a Sign, Not Magic Water',
    bigIdea: 'The water points to Jesus. The water does not save. Jesus saves.',
    body: [
      'Baptism is an outward sign people can see. It shows that a person trusts Jesus, belongs to Him, and wants to follow Him.',
      'The water reminds us of being washed clean, but the water itself does not wash away sin. Jesus saves us by His death and resurrection.',
      'That is why baptism is serious and joyful at the same time. It points away from our goodness and points to Jesus our Savior.',
    ],
    activityTitle: 'Spot the gospel truth',
    check: 'Who saves us: the water or Jesus?',
    options: [
      { text: 'Jesus saves us. Baptism points to what He has done.', correct: true, feedback: 'Correct. Salvation is by Jesus, and baptism is a visible sign of trusting Him.' },
      { text: 'The water saves us if the baptism is special enough.', correct: false, feedback: 'No. Water is a sign. Jesus is the Savior.' },
      { text: 'Our good behavior saves us after baptism.', correct: false, feedback: 'No. Good works do not save us. Jesus saves, then teaches us to follow Him.' },
    ],
  },
  {
    id: 'picture',
    icon: '🌅',
    image: '/images/jr/lessons/baptism-prep/03-new-life.png',
    title: '3. Baptism Pictures New Life',
    bigIdea: 'Going into and coming out of the water helps us remember Jesus’ death, burial, resurrection, and the new life He gives.',
    body: [
      'When someone goes into the water and comes out again, baptism gives us a picture of the good news: Jesus died, was buried, and rose again.',
      'It also shows that a believer has a new life with Jesus. We are not saying, “I am perfect now.” We are saying, “Jesus rescued me, and I want to walk with Him.”',
      'Baptism is a public way to say, “I trust Jesus and I want to follow Him.”',
    ],
    activityTitle: 'Match the picture',
    check: 'What Bible truth does baptism help us remember?',
    options: [
      { text: 'Jesus died, was buried, rose again, and gives new life.', correct: true, feedback: 'Yes. Baptism is a gospel picture.' },
      { text: 'A baptized person will never be tempted again.', correct: false, feedback: 'Not quite. Christians still need Jesus every day after baptism.' },
      { text: 'Baptism means I know every Bible answer.', correct: false, feedback: 'No. Baptism is not about knowing everything. It is about trusting and following Jesus.' },
    ],
  },
  {
    id: 'ready',
    icon: '❤️',
    image: '/images/jr/lessons/baptism-prep/04-ready-for-baptism.png',
    title: '4. Am I Ready for Baptism?',
    bigIdea: 'Ready does not mean “I know everything.” Ready means “I understand the gospel, trust Jesus, and want to follow Him.”',
    body: [
      'A child does not need to know every big Bible word perfectly before baptism. A trusted adult can help you see whether you can explain the good news in simple words.',
      'It is important to understand that we have sinned, Jesus died and rose again, and we need to trust Him for forgiveness and new life.',
      'It is also important to want to follow Jesus, not just copy a friend or make people clap. Baptism is about faith, obedience, and belonging to Jesus.',
    ],
    activityTitle: 'Readiness checkpoint',
    check: 'Which answer sounds most ready for baptism?',
    options: [
      { text: '“My friend is doing it, so I want people to clap for me too.”', correct: false, feedback: 'That sounds like pressure. It is wise to slow down and ask questions.' },
      { text: '“I trust Jesus, I know He died and rose for me, and I want to follow Him.”', correct: true, feedback: 'Yes. That is a simple, clear baptism-ready answer.' },
      { text: '“I want baptism so I will never make a mistake again.”', correct: false, feedback: 'Not quite. Baptism does not make us perfect. Jesus keeps helping us grow.' },
    ],
  },
  {
    id: 'church',
    icon: '🤝',
    image: '/images/jr/lessons/baptism-prep/05-gods-family.png',
    title: '5. Baptism Happens with God’s Family',
    bigIdea: 'Baptism is public because following Jesus is not hidden. God gives parents, pastors, teachers, and the church to help us.',
    body: [
      'Baptism is public. That means other people see it. Your parents, pastor, teacher, and church family can celebrate with you and pray for you.',
      'This lesson is a safe place to ask, “Why get baptized?” You can practice sharing your testimony: “I trust Jesus because…” and “I want to be baptized because…”',
      'Do not rush because of pressure. Take the next wise step: pray, talk with a trusted adult, and ask honest questions.',
    ],
    activityTitle: 'Choose the wise next step',
    check: 'What should you do if you still have baptism questions?',
    options: [
      { text: 'Hide the questions so nobody knows.', correct: false, feedback: 'No. Honest questions are welcome. Bring them into the light.' },
      { text: 'Talk with parents, a pastor, teacher, or trusted Christian adult.', correct: true, feedback: 'Correct. God gives wise adults to help you understand and prepare.' },
      { text: 'Get baptized fast so the questions go away.', correct: false, feedback: 'That is rushing. Slow is smooth, smooth is fast. Ask, pray, and prepare.' },
    ],
  },
]

const sectionsRu: PrepSection[] = [
  {
    id: 'story',
    icon: '🕊️',
    image: '/images/jr/lessons/baptism-prep/01-jesus-baptized-first.png',
    title: '1. Иисус показывает нам путь',
    bigIdea: 'Иисус крестился не потому, что согрешил. Он безгрешен. Он послушался Отца и показал правильный путь.',
    body: [
      'Иисус пришёл к реке Иордан, где Иоанн Креститель крестил людей. Иоанн удивился, потому что у Иисуса не было греха и Ему не нужно было прощение.',
      'Иисус сказал Иоанну, что так нужно «исполнить всякую правду». Это значит, что Иисус делал именно то, что было правильно по Божьему плану. Иисус слушался Отца и встал рядом с людьми, которых пришёл спасти.',
      'Когда Иисус вышел из воды, Святой Дух сошёл как голубь, а Отец сказал с небес: «Сей есть Сын Мой возлюбленный, в Котором Моё благоволение».',
    ],
    activityTitle: 'Выбери верный путь',
    check: 'Почему Иисус крестился, если Он никогда не грешил?',
    options: [
      { text: 'Потому что Иисусу нужно было смыть Свои грехи.', correct: false, feedback: 'Не совсем. Иисус никогда не грешил. Ему не нужно было прощение.' },
      { text: 'Потому что Иисус послушался Отца и исполнил всякую правду.', correct: true, feedback: 'Да. Иисус крестился в совершенном послушании и показал нам путь.' },
      { text: 'Потому что Иоанн был сильнее Иисуса.', correct: false, feedback: 'Нет. Иоанн знал, что Иисус больше него.' },
    ],
  },
  {
    id: 'meaning',
    icon: '💧',
    image: '/images/jr/lessons/baptism-prep/02-baptism-sign.png',
    title: '2. Крещение — это знак, а не волшебная вода',
    bigIdea: 'Вода указывает на Иисуса. Вода не спасает. Спасает Иисус.',
    body: [
      'Крещение — это внешний знак, который люди могут увидеть. Оно показывает, что человек доверяет Иисусу, принадлежит Ему и хочет следовать за Ним.',
      'Вода напоминает нам об очищении, но сама вода не смывает грех. Нас спасает Иисус Своей смертью и воскресением.',
      'Поэтому крещение — серьёзный и радостный шаг. Оно показывает не нашу доброту, а Иисуса, нашего Спасителя.',
    ],
    activityTitle: 'Найди истину Евангелия',
    check: 'Кто спасает нас: вода или Иисус?',
    options: [
      { text: 'Иисус спасает нас. Крещение указывает на то, что Он сделал.', correct: true, feedback: 'Верно. Спасение даёт Иисус, а крещение — видимый знак доверия Ему.' },
      { text: 'Вода спасает нас, если крещение достаточно особенное.', correct: false, feedback: 'Нет. Вода — знак. Иисус — Спаситель.' },
      { text: 'Наше хорошее поведение спасает нас после крещения.', correct: false, feedback: 'Нет. Добрые дела не спасают. Иисус спасает, а потом учит нас следовать за Ним.' },
    ],
  },
  {
    id: 'picture',
    icon: '🌅',
    image: '/images/jr/lessons/baptism-prep/03-new-life.png',
    title: '3. Крещение показывает новую жизнь',
    bigIdea: 'Погружение в воду и выход из неё помогают помнить смерть, погребение и воскресение Иисуса, а также новую жизнь, которую Он даёт.',
    body: [
      'Когда человек погружается в воду и выходит из неё, крещение показывает благую весть: Иисус умер, был погребён и воскрес.',
      'Оно также показывает, что верующий имеет новую жизнь с Иисусом. Мы не говорим: «Теперь я идеальный». Мы говорим: «Иисус спас меня, и я хочу идти с Ним».',
      'Крещение — это открытый способ сказать: «Я доверяю Иисусу и хочу следовать за Ним».',
    ],
    activityTitle: 'Соедини картину с истиной',
    check: 'Какую библейскую истину помогает помнить крещение?',
    options: [
      { text: 'Иисус умер, был погребён, воскрес и даёт новую жизнь.', correct: true, feedback: 'Да. Крещение — картина Евангелия.' },
      { text: 'Крещёный человек больше никогда не будет искушаем.', correct: false, feedback: 'Не совсем. Христианам всё равно нужен Иисус каждый день после крещения.' },
      { text: 'Крещение означает, что я знаю все ответы из Библии.', correct: false, feedback: 'Нет. Крещение не о том, чтобы знать всё. Оно о доверии Иисусу и следовании за Ним.' },
    ],
  },
  {
    id: 'ready',
    icon: '❤️',
    image: '/images/jr/lessons/baptism-prep/04-ready-for-baptism.png',
    title: '4. Готов ли я к крещению?',
    bigIdea: 'Готовность не значит «я знаю всё». Готовность значит: «я понимаю Евангелие, доверяю Иисусу и хочу следовать за Ним».',
    body: [
      'Ребёнку не нужно идеально знать все большие библейские слова перед крещением. Доверенный взрослый может помочь тебе понять, можешь ли ты простыми словами объяснить благую весть.',
      'Важно понимать: мы согрешили, Иисус умер и воскрес, и нам нужно доверять Ему для прощения и новой жизни.',
      'Также важно хотеть следовать за Иисусом, а не просто повторить за другом или получить похвалу. Крещение — это вера, послушание и принадлежность Иисусу.',
    ],
    activityTitle: 'Проверка готовности',
    check: 'Какой ответ больше похож на готовность к крещению?',
    options: [
      { text: '«Мой друг крестится, и я тоже хочу, чтобы мне хлопали».', correct: false, feedback: 'Это похоже на давление. Лучше остановиться и задать вопросы.' },
      { text: '«Я доверяю Иисусу, знаю, что Он умер и воскрес за меня, и хочу следовать за Ним».', correct: true, feedback: 'Да. Это простой и ясный ответ готовности к крещению.' },
      { text: '«Я хочу креститься, чтобы больше никогда не ошибаться».', correct: false, feedback: 'Не совсем. Крещение не делает нас идеальными. Иисус продолжает помогать нам расти.' },
    ],
  },
  {
    id: 'church',
    icon: '🤝',
    image: '/images/jr/lessons/baptism-prep/05-gods-family.png',
    title: '5. Крещение происходит с Божьей семьёй',
    bigIdea: 'Крещение открытое, потому что следование за Иисусом не скрывают. Бог даёт родителей, пасторов, учителей и церковь, чтобы помогать нам.',
    body: [
      'Крещение открытое. Это значит, что другие люди его видят. Родители, пастор, учитель и церковная семья могут радоваться с тобой и молиться за тебя.',
      'Урок «Зачем креститься?» — безопасное место для вопросов. Ты можешь потренироваться рассказывать своё свидетельство: «Я доверяю Иисусу, потому что…» и «Я хочу креститься, потому что…».',
      'Не спеши из-за давления. Сделай следующий мудрый шаг: молись, поговори с доверенным взрослым и задавай честные вопросы.',
    ],
    activityTitle: 'Выбери мудрый следующий шаг',
    check: 'Что делать, если у тебя ещё есть вопросы о крещении?',
    options: [
      { text: 'Спрятать вопросы, чтобы никто не узнал.', correct: false, feedback: 'Нет. Честные вопросы можно задавать. Выноси их на свет.' },
      { text: 'Поговорить с родителями, пастором, учителем или доверенным христианским взрослым.', correct: true, feedback: 'Верно. Бог даёт мудрых взрослых, чтобы помочь тебе понять и подготовиться.' },
      { text: 'Поскорее креститься, чтобы вопросы исчезли.', correct: false, feedback: 'Это спешка. Не торопись: молись, спрашивай и готовься.' },
    ],
  },
]

const prepQuestionsEn: PrepQuestion[] = [
  { question: 'Who is Jesus?', helper: 'The Son of God, the Savior, the risen King.' },
  { question: 'What is sin?', helper: 'Disobeying God in our hearts, words, and actions.' },
  { question: 'What did Jesus do for sinners?', helper: 'He died on the cross and rose again to save us.' },
  { question: 'Do I trust Jesus?', helper: 'Not just knowing facts, but depending on Him as Savior and Lord.' },
  { question: 'Why do I want to be baptized?', helper: 'To obey Jesus and show publicly that I belong to Him.' },
]

const prepQuestionsRu: PrepQuestion[] = [
  { question: 'Кто такой Иисус?', helper: 'Сын Божий, Спаситель и воскресший Царь.' },
  { question: 'Что такое грех?', helper: 'Непослушание Богу в сердце, словах и поступках.' },
  { question: 'Что Иисус сделал для грешников?', helper: 'Он умер на кресте и воскрес, чтобы спасти нас.' },
  { question: 'Доверяю ли я Иисусу?', helper: 'Не просто знаю факты, а полагаюсь на Него как на Спасителя и Господа.' },
  { question: 'Почему я хочу креститься?', helper: 'Чтобы слушаться Иисуса и открыто показать, что я принадлежу Ему.' },
]

const truthCardsEn: TruthCard[] = [
  { text: 'A public sign that I trust and follow Jesus', answer: 'is', reason: 'Yes. Baptism is public and points to faith in Jesus.' },
  { text: 'Magic water that saves me by itself', answer: 'not', reason: 'Correct. Jesus saves; the water is a sign.' },
  { text: 'A picture of Jesus’ death, burial, and resurrection', answer: 'is', reason: 'Yes. Baptism helps us remember the gospel.' },
  { text: 'Something to do just because friends are doing it', answer: 'not', reason: 'Correct. Baptism should not be rushed because of pressure.' },
]

const truthCardsRu: TruthCard[] = [
  { text: 'Открытый знак, что я доверяю Иисусу и следую за Ним', answer: 'is', reason: 'Да. Крещение открыто показывает веру в Иисуса.' },
  { text: 'Волшебная вода, которая сама по себе спасает меня', answer: 'not', reason: 'Верно. Спасает Иисус; вода — это знак.' },
  { text: 'Картина смерти, погребения и воскресения Иисуса', answer: 'is', reason: 'Да. Крещение помогает помнить Евангелие.' },
  { text: 'То, что нужно сделать просто потому, что друзья делают', answer: 'not', reason: 'Верно. Крещение не должно быть поспешным из-за давления.' },
]

const defaultAnswersEn = [
  'I trust Jesus because...',
  'Jesus died and rose again to...',
  'I want to be baptized because...',
]

const defaultAnswersRu = [
  'Я доверяю Иисусу, потому что...',
  'Иисус умер и воскрес, чтобы...',
  'Я хочу креститься, потому что...',
]

export default function BaptismPrepPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const languageKey = isRu ? 'ru' : 'en'
  const sections = isRu ? sectionsRu : sectionsEn
  const prepQuestions = isRu ? prepQuestionsRu : prepQuestionsEn
  const truthCards = isRu ? truthCardsRu : truthCardsEn
  const defaultAnswers = isRu ? defaultAnswersRu : defaultAnswersEn

  const [sectionChoices, setSectionChoices] = useState<Record<string, number | null>>({})
  const [truthChoices, setTruthChoices] = useState<Record<number, 'is' | 'not' | null>>({})
  const [testimonyByLanguage, setTestimonyByLanguage] = useState<Record<'en' | 'ru', string[]>>({ en: ['', '', ''], ru: ['', '', ''] })
  const testimonyLines = testimonyByLanguage[languageKey]

  const completedSections = useMemo(
    () => sections.filter((section) => {
      const selected = sectionChoices[section.id]
      return selected !== undefined && selected !== null && section.options[selected]?.correct
    }).length,
    [sectionChoices, sections]
  )

  const completedTruthCards = truthCards.filter((card, index) => truthChoices[index] === card.answer).length
  const totalSteps = sections.length + truthCards.length
  const completedSteps = completedSections + completedTruthCards
  const progress = Math.round((completedSteps / totalSteps) * 100)

  const chooseSectionOption = (sectionId: string, optionIndex: number) => {
    setSectionChoices((current) => ({ ...current, [sectionId]: optionIndex }))
  }

  const chooseTruth = (index: number, answer: 'is' | 'not') => {
    setTruthChoices((current) => ({ ...current, [index]: answer }))
  }

  const updateTestimony = (index: number, value: string) => {
    setTestimonyByLanguage((current) => ({
      ...current,
      [languageKey]: current[languageKey].map((line, lineIndex) => lineIndex === index ? value : line),
    }))
  }

  return (
    <main style={{ background: 'linear-gradient(180deg,#effbff,#fff7df)', color: '#203047' }}>
      <section style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, padding: '52px 18px', textAlign: 'center' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontSize: '4.4rem', marginBottom: 12 }}>💧🕊️</div>
          <p style={{ color: '#c9f7ff', fontFamily: 'var(--font-nunito)', fontWeight: 950, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
            {isRu ? 'Детский урок о крещении' : 'Children’s Baptism Lesson'}
          </p>
          <h1 style={{ color: '#fff', fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,5vw,3.2rem)', margin: '0 0 14px', textShadow: '0 3px 16px rgba(0,0,0,.28)' }}>
            {isRu ? 'Зачем Креститься' : 'Why Get Baptized?'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.94)', fontFamily: 'var(--font-lora)', fontSize: '1.08rem', lineHeight: 1.75, margin: '0 auto', maxWidth: 780 }}>
            {isRu
              ? 'Интерактивный урок для детей о крещении Иисуса, Евангелии, послушании и о том, зачем последователи Иисуса крестятся — без давления.'
              : 'An interactive lesson for children about Jesus’ baptism, the gospel, obedience, and why followers of Jesus get baptized — without pressure.'}
          </p>

          <div style={{ margin: '26px auto 0', maxWidth: 620, padding: 16, background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.28)', borderRadius: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 950, marginBottom: 8 }}>
              <span>{isRu ? 'Проверки понимания' : 'Understanding Checks'}</span>
              <span>{completedSteps}/{totalSteps}</span>
            </div>
            <div
              aria-label={isRu ? 'Проверки понимания' : 'Understanding checks'}
              aria-valuemax={totalSteps}
              aria-valuemin={0}
              aria-valuenow={completedSteps}
              role="progressbar"
              style={{ height: 14, background: 'rgba(255,255,255,.22)', borderRadius: 999, overflow: 'hidden' }}
            >
              <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#ffe08a,#ffffff)', transition: 'width .25s ease' }} />
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 980, margin: '0 auto', padding: '42px 18px 58px' }}>
        <Link href="/lessons" style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: ACCENT_DARK, textDecoration: 'none' }}>
          ← {isRu ? 'Все уроки' : 'All Lessons'}
        </Link>

        <div className="kid-note" style={{ marginTop: 24, borderColor: '#bfeaf4', background: '#ffffff' }}>
          {isRu
            ? '💡 Крещение — важный шаг. Этот урок помогает понять, но не давит. Если у тебя есть вопросы, поговори с родителями, пастором или учителем. В разных церквях могут объяснять некоторые детали немного по-разному, поэтому готовься вместе со своей церковной семьёй.'
            : '💡 Baptism is an important step. This lesson helps you understand without pressure. If you have questions, talk with your parents, pastor, or teacher. Different churches may explain some details a little differently, so prepare with your own church family.'}
        </div>

        <div className="pull-quote" style={{ background: '#ffffff', borderColor: '#bfeaf4' }}>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 950, fontSize: '.72rem', letterSpacing: '3px', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>
            {isRu ? 'Библейский якорь' : 'Bible Anchor'}
          </p>
          <p className="pq-text">
            {isRu
              ? '«Сей есть Сын Мой возлюбленный, в Котором Моё благоволение.» — Матфея 3:17'
              : '“This is my beloved Son, with whom I am well pleased.” — Matthew 3:17'}
          </p>
        </div>

        {sections.map((section) => {
          const selectedIndex = sectionChoices[section.id]
          const selectedOption = selectedIndex !== undefined && selectedIndex !== null ? section.options[selectedIndex] : null

          return (
            <article key={section.id} className="puzzle-box" style={{ ['--pz-color' as string]: ACCENT, marginTop: 24, background: '#fff' }}>
              <p className="puzzle-label">{section.icon} {isRu ? 'Раздел' : 'Section'}</p>
              <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 950, color: ACCENT_DARK, marginBottom: 10, fontSize: 'clamp(1.35rem,3vw,1.8rem)' }}>
                {section.title}
              </h2>
              <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: ACCENT_DARK, background: ACCENT_SOFT, border: '2px solid #bfeaf4', borderRadius: 14, padding: 14, lineHeight: 1.55, margin: '0 0 16px' }}>
                🎯 {section.bigIdea}
              </p>
              <Image
                src={section.image}
                alt={section.title}
                width={1024}
                height={768}
                sizes="(max-width: 980px) 100vw, 940px"
                style={{ width: '100%', height: 'auto', borderRadius: 18, display: 'block', margin: '0 0 18px', boxShadow: '0 12px 34px rgba(10,112,144,.18)' }}
              />
              <div style={{ display: 'grid', gap: 12 }}>
                {section.body.map((paragraph) => (
                  <p key={paragraph} style={{ fontFamily: isRu ? 'var(--font-nunito)' : 'var(--font-lora)', fontSize: '1rem', lineHeight: 1.82, color: '#333', margin: 0 }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div style={{ marginTop: 18, padding: 16, borderRadius: 16, background: ACCENT_SOFT, border: '2px solid #bfeaf4' }}>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 950, color: ACCENT_DARK, margin: '0 0 6px' }}>
                  {section.activityTitle}
                </p>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, margin: '0 0 12px', color: '#26364f' }}>{section.check}</p>
                <div style={{ display: 'grid', gap: 10 }}>
                  {section.options.map((option, optionIndex) => {
                    const isSelected = selectedIndex === optionIndex
                    const border = isSelected ? (option.correct ? '#2a8f55' : '#b5415a') : '#bfeaf4'
                    const background = isSelected ? (option.correct ? '#f4fff8' : '#fff6f8') : '#fff'

                    return (
                      <button
                        key={option.text}
                        type="button"
                        onClick={() => chooseSectionOption(section.id, optionIndex)}
                        style={{ cursor: 'pointer', textAlign: 'left', border: `2px solid ${border}`, background, color: '#26364f', borderRadius: 14, padding: '12px 14px', fontFamily: 'var(--font-nunito)', fontWeight: 850, lineHeight: 1.5 }}
                      >
                        {isSelected ? (option.correct ? '✅ ' : '↩️ ') : '○ '} {option.text}
                      </button>
                    )
                  })}
                </div>
                {selectedOption && (
                  <p style={{ fontFamily: 'var(--font-lora)', margin: '12px 0 0', color: selectedOption.correct ? '#236c43' : '#8a3347', lineHeight: 1.65 }}>
                    <strong>{selectedOption.correct ? (isRu ? 'Верно:' : 'Correct:') : (isRu ? 'Попробуй ещё:' : 'Try again:')}</strong> {selectedOption.feedback}
                  </p>
                )}
              </div>
            </article>
          )
        })}

        <section className="puzzle-box" style={{ ['--pz-color' as string]: GOLD, marginTop: 28, background: '#fffdf5' }}>
          <p className="puzzle-label">🧭 {isRu ? 'Что такое крещение?' : 'What Is Baptism?'}</p>
          <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 950, color: '#8a5400', marginBottom: 12 }}>
            {isRu ? 'Сортировка: крещение — это / не это' : 'Sort It: Baptism Is / Is Not'}
          </h2>
          <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.7, color: '#4b4b4b' }}>
            {isRu
              ? 'Нажми, к какой стороне относится каждая карточка. Это помогает отличить Евангелие от путаницы.'
              : 'Tap which side each card belongs on. This helps separate the gospel from confusion.'}
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            {truthCards.map((card, index) => {
              const choice = truthChoices[index]
              const correct = choice === card.answer
              return (
                <div key={card.text} style={{ border: '2px solid #f4d28a', borderRadius: 16, background: '#fff', padding: 14 }}>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 950, color: '#5d3b00', margin: '0 0 10px' }}>{card.text}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <button type="button" onClick={() => chooseTruth(index, 'is')} style={{ cursor: 'pointer', border: `2px solid ${choice === 'is' ? (correct ? '#2a8f55' : '#b5415a') : '#f4d28a'}`, background: choice === 'is' ? (correct ? '#f4fff8' : '#fff6f8') : '#fffdf5', borderRadius: 999, padding: '9px 14px', fontFamily: 'var(--font-nunito)', fontWeight: 950, color: '#5d3b00' }}>
                      {isRu ? 'Крещение — это' : 'Baptism IS'}
                    </button>
                    <button type="button" onClick={() => chooseTruth(index, 'not')} style={{ cursor: 'pointer', border: `2px solid ${choice === 'not' ? (correct ? '#2a8f55' : '#b5415a') : '#f4d28a'}`, background: choice === 'not' ? (correct ? '#f4fff8' : '#fff6f8') : '#fffdf5', borderRadius: 999, padding: '9px 14px', fontFamily: 'var(--font-nunito)', fontWeight: 950, color: '#5d3b00' }}>
                      {isRu ? 'Крещение — не это' : 'Baptism is NOT'}
                    </button>
                  </div>
                  {choice && (
                    <p style={{ fontFamily: 'var(--font-lora)', color: correct ? '#236c43' : '#8a3347', lineHeight: 1.6, margin: '10px 0 0' }}>
                      {correct ? '✅ ' : '↩️ '} {correct ? card.reason : (isRu ? 'Почти. Подумай ещё раз: спасает ли это Иисус или путает нас?' : 'Almost. Think again: does this point to Jesus, or does it confuse us?')}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="puzzle-box" style={{ ['--pz-color' as string]: '#7b56d9', marginTop: 28, background: '#fbf8ff' }}>
          <p className="puzzle-label">📝 {isRu ? 'Вопросы для разговора' : 'Talk-It-Through Questions'}</p>
          <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 950, color: '#5537a0', marginBottom: 12 }}>
            {isRu ? 'Потренируйся отвечать простыми словами' : 'Practice Answering in Simple Words'}
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {prepQuestions.map((item, index) => (
              <div key={item.question} style={{ padding: 14, borderRadius: 14, background: '#fff', border: '2px solid #d6c7ff' }}>
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 950, color: '#5537a0', margin: '0 0 4px' }}>
                  {index + 1}. {item.question}
                </p>
                <p style={{ fontFamily: isRu ? 'var(--font-nunito)' : 'var(--font-lora)', color: '#4b4b4b', lineHeight: 1.6, margin: 0 }}>{item.helper}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="puzzle-box" style={{ ['--pz-color' as string]: '#2a8f55', marginTop: 28, background: '#f4fff8' }}>
          <p className="puzzle-label">🎤 {isRu ? 'Моё короткое свидетельство' : 'My Short Testimony'}</p>
          <h2 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 950, color: '#236c43', marginBottom: 12 }}>
            {isRu ? 'Скажи это взрослому вслух' : 'Say It Out Loud to an Adult'}
          </h2>
          <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.7, color: '#355042' }}>
            {isRu
              ? 'Эти строки не решают всё за тебя. Они помогают начать честный разговор с родителями, пастором или учителем.'
              : 'These lines do not decide everything for you. They help start an honest conversation with your parents, pastor, or teacher.'}
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            {testimonyLines.map((line, index) => (
              <textarea
                key={index}
                aria-label={defaultAnswers[index]}
                placeholder={defaultAnswers[index]}
                value={line}
                onChange={(event) => updateTestimony(index, event.target.value)}
                rows={2}
                style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #b7e4c7', borderRadius: 14, padding: 12, fontFamily: 'var(--font-nunito)', fontWeight: 800, color: '#26364f', resize: 'vertical' }}
              />
            ))}
          </div>
        </section>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', marginTop: 28 }}>
          <div className="puzzle-box" style={{ ['--pz-color' as string]: '#2a8f55', background: '#f4fff8' }}>
            <p className="puzzle-label">✅ {isRu ? 'Помни' : 'Remember'}</p>
            <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.7, margin: 0 }}>
              {isRu
                ? 'Крещение важно, потому что Иисус повелел ученикам креститься. Но спасение — через веру в Иисуса, а не через воду.'
                : 'Baptism matters because Jesus commanded His disciples to be baptized. But salvation is through faith in Jesus, not through water.'}
            </p>
          </div>
          <div className="puzzle-box" style={{ ['--pz-color' as string]: '#b5415a', background: '#fff6f8' }}>
            <p className="puzzle-label">🛑 {isRu ? 'Не спеши из-за давления' : 'Do Not Rush from Pressure'}</p>
            <p style={{ fontFamily: 'var(--font-lora)', lineHeight: 1.7, margin: 0 }}>
              {isRu
                ? 'Если ты не уверен, это нормально задавать вопросы. Мудрый следующий шаг — молиться и говорить с доверенными взрослыми.'
                : 'If you are not sure, it is okay to ask questions. The wise next step is to pray and talk with trusted adults.'}
            </p>
          </div>
        </div>

        <div className="pull-quote" style={{ marginTop: 28, background: completedSteps === totalSteps ? '#f4fff8' : '#ffffff', borderColor: completedSteps === totalSteps ? '#9bd8b2' : '#bfeaf4' }}>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 950, color: completedSteps === totalSteps ? '#236c43' : ACCENT_DARK, margin: '0 0 8px' }}>
            {completedSteps === totalSteps ? (isRu ? '🎉 Проверки пройдены' : '🎉 Checks Complete') : (isRu ? 'Продолжай проверять понимание' : 'Keep Checking Understanding')}
          </p>
          <p className="pq-text">
            {completedSteps === totalSteps
              ? (isRu ? 'Это не решает вопрос крещения за тебя. Теперь расскажи свои ответы доверенному взрослому и попроси его помочь тебе сделать следующий мудрый шаг.' : 'This does not decide baptism for you. Now share your answers with a trusted adult and ask them to help you take the next wise step.')
              : (isRu ? 'Пройди проверки понимания, но помни: цель — не набрать очки, а понять Иисуса и ответить с верой.' : 'Complete the understanding checks, but remember: the goal is not points. The goal is to understand Jesus and respond with faith.')}
          </p>
        </div>

        <div style={{ marginTop: 34, textAlign: 'center' }}>
          <Link href="/stories/jesus-baptism" className="pz-btn" style={{ display: 'inline-block', background: ACCENT, color: '#fff', textDecoration: 'none', padding: '14px 24px', borderRadius: 14, marginRight: 10 }}>
            {isRu ? 'Прочитать историю о крещении Иисуса' : 'Read the Jesus Baptism Story'} →
          </Link>
          <Link href="/lessons" style={{ display: 'inline-block', fontFamily: 'var(--font-nunito)', fontWeight: 900, color: ACCENT_DARK, textDecoration: 'none', padding: '14px 10px' }}>
            ← {isRu ? 'Назад к урокам' : 'Back to Lessons'}
          </Link>
        </div>
      </section>
    </main>
  )
}
