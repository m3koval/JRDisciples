'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const identityCards = [
  {
    title: 'Prophet',
    group: 'What some people guessed',
    detail: 'Some people thought Jesus was only one of the prophets. A prophet speaks God’s message, but Jesus is greater than every prophet.',
  },
  {
    title: 'Christ',
    group: 'What God revealed',
    detail: 'Christ means the promised King and Savior God sent. Peter confessed that Jesus is the Christ.',
  },
  {
    title: 'Son of the living God',
    group: 'What God revealed',
    detail: 'Jesus is the eternal Son. He was not created, and He did not become God later.',
  },
  {
    title: 'The Word',
    group: 'What John teaches',
    detail: 'John says the Word was with God and the Word was God. The Word became flesh and lived among us.',
  },
  {
    title: 'Savior',
    group: 'What we trust',
    detail: 'Jesus became truly human to save sinners and give life to those who believe in His name.',
  },
]

const teachingTrail = [
  'Jesus asked the most important question: “Who do you say that I am?”',
  'Peter confessed Jesus as the Christ, the Son of the living God.',
  'John says Jesus, the Word, was already with God and was God in the beginning.',
  'The Word became flesh: Jesus truly became human and lived among people.',
  'Believing means trusting Jesus, not only knowing facts about Him.',
]

const hardWords = [
  ['Christ', 'The promised King and Savior God sent. “Christ” means “Anointed One.”'],
  ['Son of God', 'Jesus’ special title showing His one-of-a-kind relationship with the Father, His divine identity, and His authority. It does not mean Jesus was created.'],
  ['Eternal', 'Having no beginning and no end.'],
  ['The Word', 'John’s name for Jesus in John 1. It shows that Jesus reveals God and was with God and was God from the beginning.'],
  ['Flesh', 'Real human life. Jesus became truly human, not pretend human.'],
  ['Trinity', 'One God in three persons: Father, Son, and Holy Spirit.'],
]

const questions = [
  {
    question: 'When the Bible calls Jesus “Son of God,” what mistake should we avoid?',
    answers: ['Thinking Jesus was created', 'Remembering Jesus is the eternal Son', 'Trusting what Scripture says'],
    correct: 0,
    feedback: 'Right. We should never think Jesus was created or became God later. Jesus is the eternal Son.',
  },
  {
    question: 'What does John 1 teach about the Word?',
    answers: ['The Word was only an angel', 'The Word was with God and was God', 'The Word started in Bethlehem'],
    correct: 1,
    feedback: 'Yes. John says the Word was with God and the Word was God, then the Word became flesh.',
  },
  {
    question: 'What does believing in Jesus mean?',
    answers: ['Only memorizing facts', 'Mocking people with questions', 'Trusting Jesus and having life in His name'],
    correct: 2,
    feedback: 'Good work. John wrote so we may believe Jesus is the Christ, the Son of God, and have life in His name.',
  },
]

const visuals = [
  {
    title: 'Bible Truth: The Word Became Flesh',
    image: '/images/jr/lessons/case-for-christ-gods-son/bible-truth.png',
    alt: 'An open Bible shines with creation light and a humble first-century village, showing that the eternal Word became human.',
    caption: 'The picture helps us remember John 1: Jesus did not begin at Bethlehem. The eternal Word became flesh and came near to save us.',
  },
  {
    title: 'Real Place: Caesarea Philippi',
    image: '/images/jr/lessons/case-for-christ-gods-son/artifact-reconstruction.png',
    alt: 'Original reconstruction of rocky cliffs, springs, ruins, and manuscript materials inspired by Caesarea Philippi.',
    caption: 'Original reconstruction: Jesus asked His disciples this identity question near Caesarea Philippi, a real place. This is artwork, not a verified photo.',
  },
  {
    title: 'Challenge: Identity Cards',
    image: '/images/jr/lessons/case-for-christ-gods-son/identity-challenge.png',
    alt: 'Junior Disciples children sort blank identity cards and glowing evidence tokens on an open Bible activity table.',
    caption: 'Use the card sort below to separate guesses from what God reveals in Scripture.',
  },
]

const scriptureEn = {
  matthew: 'He said to them, "But who do you say that I am?" Simon Peter replied, "You are the Christ, the Son of the living God."',
  matthewRef: 'Matthew 16:15–16 (ESV)',
  johnOne: 'In the beginning was the Word, and the Word was with God, and the Word was God. And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth.',
  johnOneRef: 'John 1:1, 14 (ESV)',
  johnTwenty: 'but these are written so that you may believe that Jesus is the Christ, the Son of God, and that by believing you may have life in his name.',
  johnTwentyRef: 'John 20:31 (ESV)',
}

const scriptureRu = {
  matthew: 'Он говорит им: а вы за кого почитаете Меня? Симон же Петр, отвечая, сказал: Ты — Христос, Сын Бога Живаго.',
  matthewRef: 'От Матфея 16:15–16 (Синодальный перевод)',
  johnOne: 'В начале было Слово, и Слово было у Бога, и Слово было Бог. И Слово стало плотию, и обитало с нами, полное благодати и истины; и мы видели славу Его, славу, как Единородного от Отца.',
  johnOneRef: 'От Иоанна 1:1, 14 (Синодальный перевод)',
  johnTwenty: 'Сие же написано, дабы вы уверовали, что Иисус есть Христос, Сын Божий, и, веруя, имели жизнь во имя Его.',
  johnTwentyRef: 'От Иоанна 20:31 (Синодальный перевод)',
}

export default function CaseForChristGodsSonPage() {
  const { language } = useLanguage()
  const [opened, setOpened] = useState<Record<number, boolean>>({})
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const scripture = language === 'ru' ? scriptureRu : scriptureEn
  const isRu = language === 'ru'

  const progress = useMemo(() => {
    const openedCards = Object.values(opened).filter(Boolean).length
    const correctAnswers = questions.filter((item, index) => answers[index] === item.correct).length
    return openedCards + correctAnswers
  }, [answers, opened])

  return (
    <main style={{ background: '#fff8e8', color: '#203047' }}>
      <section style={{ background: 'linear-gradient(135deg,#4b2a7b,#0d3a6a)', padding: '46px 18px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 28, alignItems: 'center' }}>
          <div>
            <p style={eyebrowLight}>{isRu ? 'Дело о Христе для детей · Урок 3' : 'Case for Christ Kids · Lesson 3'}</p>
            <h1 style={{ margin: '0 0 14px', color: 'white', fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.05 }}>
              {isRu ? 'Иисус действительно Божий Сын?' : 'Is Jesus Really God\'s Son?'}
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,.94)', fontFamily: 'var(--font-lora)', fontSize: '1.12rem', lineHeight: 1.75 }}>
              {isRu
                ? 'Иди по следу личности Иисуса: исповедание Петра, свидетельство Иоанна и почему Иисус — Христос, вечный Сын Божий, истинный Бог и истинный человек.'
                : 'Follow the identity trail from Peter\'s confession to John\'s testimony: Jesus is the Christ, the eternal Son of God, truly God and truly human.'}
            </p>
            <div style={progressStyle}>{isRu ? 'Прогресс' : 'Progress'}: {progress}/{identityCards.length + questions.length}</div>
          </div>
          <figure style={{ margin: 0 }}>
            <img
              src="/images/jr/lessons/case-for-christ-gods-son/hero.png"
              alt="Junior Disciples children follow a glowing path across an open Bible landscape inspired by Caesarea Philippi."
              style={{ width: '100%', height: 'auto', borderRadius: 26, boxShadow: '0 20px 48px rgba(0,0,0,.28)', border: '1px solid rgba(255,255,255,.35)' }}
            />
          </figure>
        </div>
      </section>

      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '42px 18px' }}>
        <div style={panelStyle('#ffffff')}>
          <p className="eyebrow">Big Question</p>
          <h2 style={headingStyle}>
            {language === 'ru' ? 'Действительно ли Иисус — Сын Божий, и что это значит?' : 'Is Jesus really God\'s Son, and what does that mean?'}
          </h2>
          <p style={bodyStyle}>
            {language === 'ru'
              ? 'Иисус — Сын Божий: Он истинно Бог, стал истинно человеком и совершенно показывает нам Отца. «Сын Божий» не означает, что Иисус был создан Богом или стал Богом позднее.'
              : 'Jesus is the Son of God: He is truly God, truly became human, and perfectly shows us the Father. "Son of God" does not mean Jesus was created by God or became God later.'}
          </p>
          <p style={{ ...bodyStyle, fontWeight: 900, color: '#4b2a7b' }}>
            {language === 'ru'
              ? 'Для детей: Иисус — Бог Сын. Он никогда не был создан. Он стал человеком, чтобы спасти нас.'
              : 'Child recap: Jesus is God the Son. He was never created. He became human to save us.'}
          </p>
        </div>

        <div style={{ ...panelStyle('#eef7ff'), marginTop: 30 }}>
          <p className="eyebrow">Bible Anchor</p>
          <h2 style={headingStyle}>Peter&apos;s confession and John&apos;s testimony</h2>
          <blockquote style={quoteStyle}>
            {scripture.matthew}
            <footer style={quoteRefStyle}>{scripture.matthewRef}</footer>
          </blockquote>
          <blockquote style={quoteStyle}>
            {scripture.johnOne}
            <footer style={quoteRefStyle}>{scripture.johnOneRef}</footer>
          </blockquote>
          <blockquote style={quoteStyle}>
            {scripture.johnTwenty}
            <footer style={quoteRefStyle}>{scripture.johnTwentyRef}</footer>
          </blockquote>
        </div>

        <div style={{ marginTop: 30 }}>
          <p className="eyebrow">Visual Learning Pack</p>
          <h2 style={headingStyle}>See the truth, the place, and the challenge</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
            {visuals.map((visual) => (
              <figure key={visual.title} style={{ margin: 0, ...panelStyle('#ffffff'), padding: 14 }}>
                <img src={visual.image} alt={visual.alt} style={{ width: '100%', height: 'auto', borderRadius: 18, display: 'block' }} />
                <figcaption style={{ ...bodyStyle, marginTop: 12, fontSize: '.95rem' }}>
                  <strong style={{ color: '#0d3a6a', fontFamily: 'var(--font-nunito)' }}>{visual.title}:</strong> {visual.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30 }}>
          <p className="eyebrow">Teaching Trail</p>
          <h2 style={headingStyle}>Five stops on the identity trail</h2>
          <ol style={{ ...bodyStyle, paddingLeft: 24 }}>
            {teachingTrail.map((item) => <li key={item}>{item}</li>)}
          </ol>
          <p style={bodyStyle}>
            John wrote as testimony about what Jesus did and said, not just an idea someone made up. The Bible gives us true names and titles for Jesus so we do not have to guess who He is.
          </p>
        </div>

        <div style={{ marginTop: 30 }}>
          <p className="eyebrow">Identity Cards</p>
          <h2 style={headingStyle}>Tap each card and sort the clues</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>
            {identityCards.map((card, index) => (
              <button key={card.title} type="button" onClick={() => setOpened((current) => ({ ...current, [index]: !current[index] }))} style={{ ...cardStyle, borderColor: opened[index] ? '#f0b429' : '#d7e3f5' }}>
                <span style={cardTitle}>{card.title}</span>
                <span style={cardGroup}>{card.group}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-lora)', color: '#46556f', lineHeight: 1.6 }}>
                  {opened[index] ? card.detail : 'Tap to reveal this identity clue.'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle('#fff7d6'), marginTop: 30 }}>
          <p className="eyebrow">Hard Words</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 14 }}>
            {hardWords.map(([word, definition]) => (
              <div key={word} style={{ background: 'white', borderRadius: 18, padding: 16, border: '1px solid #f1d99a' }}>
                <h3 style={{ margin: '0 0 8px', color: '#8a5a00', fontFamily: 'var(--font-nunito)', fontWeight: 950 }}>{word}</h3>
                <p style={{ ...bodyStyle, margin: 0 }}>{definition}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <p className="eyebrow">Detective Check</p>
          <h2 style={headingStyle}>Choose the strongest answer</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {questions.map((item, index) => (
              <div key={item.question} style={panelStyle('#fff')}>
                <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--font-nunito)', color: '#0d3a6a', fontSize: '1.15rem' }}>{item.question}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {item.answers.map((answer, answerIndex) => {
                    const chosen = answers[index] === answerIndex
                    const correct = item.correct === answerIndex
                    return (
                      <button key={answer} type="button" onClick={() => setAnswers((current) => ({ ...current, [index]: answerIndex }))} style={{ ...answerStyle, background: chosen ? (correct ? '#d9f7df' : '#ffe0df') : '#f5f7fb', borderColor: chosen ? (correct ? '#2f9e44' : '#d9480f') : '#d7e3f5' }}>
                        {answer}
                      </button>
                    )
                  })}
                </div>
                {answers[index] !== undefined && <p style={{ ...bodyStyle, marginTop: 12, fontWeight: 800, color: answers[index] === item.correct ? '#1f7a35' : '#a33a10' }}>{answers[index] === item.correct ? item.feedback : 'Not quite. Follow the identity trail and try again.'}</p>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30 }}>
          <p className="eyebrow">Honest Question</p>
          <h2 style={headingStyle}>Do Christians believe in more than one God?</h2>
          <p style={bodyStyle}>
            No. Christians believe there is one God. The Bible teaches that the Father is God, the Son is God, and the Holy Spirit is God. They are not three separate gods, and they are not one person wearing three masks. God is one God in three persons.
          </p>
          <p style={bodyStyle}>
            The Son is God, and the Father is God, but the Son is not the Father. The Father sent the Son, the Son became human to save us, and the Holy Spirit helps us trust and follow Jesus.
          </p>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30 }}>
          <p className="eyebrow">Parent / Teacher Talk</p>
          <h2 style={headingStyle}>Teach a high truth carefully</h2>
          <ul style={{ ...bodyStyle, paddingLeft: 22 }}>
            <li>Do not make “Son of God” sound like Jesus was created. Better: “Jesus is the eternal Son.”</li>
            <li>Do not explain the Trinity with broken object lessons like water changing forms or one person wearing hats.</li>
            <li>Help children see that some true things are bigger than us. We cannot hold everything about God, but we can trust what God has told us.</li>
          </ul>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30, textAlign: 'center' }}>
          <p style={bodyStyle}>
            Father, thank You for revealing Jesus as the Christ, the Son of the living God. Lord Jesus, thank You for becoming truly human to save sinners and for showing us grace and truth. Holy Spirit, help us understand God&apos;s Word, trust Jesus with humble hearts, and follow Him with courage and love. In Jesus&apos; name, amen.
          </p>
          <Link href="/lessons" style={{ display: 'inline-block', marginTop: 16, fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#0d3a6a', textDecoration: 'none' }}>
            ← Back to Lessons
          </Link>
        </div>
      </section>
    </main>
  )
}

const eyebrowLight = {
  margin: '0 0 10px',
  color: '#ffdc73',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 900,
  letterSpacing: 1.4,
  textTransform: 'uppercase' as const,
}

const progressStyle = {
  marginTop: 20,
  display: 'inline-flex',
  padding: '10px 14px',
  borderRadius: 999,
  background: 'rgba(255,255,255,.14)',
  color: 'white',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 900,
}

const headingStyle = {
  margin: '0 0 14px',
  color: '#0d3a6a',
  fontFamily: 'var(--font-cinzel)',
  fontSize: 'clamp(1.45rem,3vw,2.15rem)',
  lineHeight: 1.12,
}

const bodyStyle = {
  fontFamily: 'var(--font-lora)',
  fontSize: '1rem',
  lineHeight: 1.78,
  color: '#40506a',
}

const panelStyle = (background: string) => ({
  background,
  border: '1px solid rgba(13,58,106,.12)',
  borderRadius: 22,
  padding: '24px',
  boxShadow: '0 12px 32px rgba(13,58,106,.08)',
})

const quoteStyle = {
  margin: '16px 0',
  borderLeft: '5px solid #f0b429',
  padding: '14px 18px',
  background: 'white',
  borderRadius: 16,
  fontFamily: 'var(--font-lora)',
  color: '#31415d',
  lineHeight: 1.75,
}

const quoteRefStyle = {
  marginTop: 10,
  color: '#0d3a6a',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 900,
}

const cardStyle = {
  textAlign: 'left' as const,
  cursor: 'pointer',
  background: '#fff',
  border: '2px solid #d7e3f5',
  borderRadius: 20,
  padding: 18,
  minHeight: 176,
  boxShadow: '0 10px 24px rgba(13,58,106,.08)',
}

const cardTitle = {
  display: 'block',
  color: '#0d3a6a',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 950,
  fontSize: '1.1rem',
  marginBottom: 6,
}

const cardGroup = {
  display: 'inline-block',
  marginBottom: 10,
  padding: '5px 9px',
  borderRadius: 999,
  background: '#fff7d6',
  color: '#8a5a00',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 900,
  fontSize: '.78rem',
}

const answerStyle = {
  border: '2px solid #d7e3f5',
  borderRadius: 999,
  padding: '10px 14px',
  cursor: 'pointer',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 900,
  color: '#203047',
}
