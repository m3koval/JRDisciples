'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const witnesses = [
  {
    name: 'Peter / Cephas',
    detail: 'Paul says Jesus appeared to Cephas. Peter later preached the resurrection with courage.',
    source: '1 Corinthians 15:5',
  },
  {
    name: 'The twelve',
    detail: 'Jesus appeared to the disciples, and they carried the good news into the world.',
    source: '1 Corinthians 15:5',
  },
  {
    name: 'More than five hundred',
    detail: 'Paul points to a large group of witnesses, many still alive when he wrote.',
    source: '1 Corinthians 15:6',
  },
  {
    name: 'James and the apostles',
    detail: 'The risen Jesus appeared to leaders who became bold witnesses for Him.',
    source: '1 Corinthians 15:7',
  },
  {
    name: 'Thomas',
    detail: 'Jesus met Thomas in his honest question and called him to believe.',
    source: 'John 20:24-31',
  },
]

const trail = [
  'Jesus died for our sins according to the Scriptures.',
  'Jesus was buried, so the tomb was not just a rumor or a sad memory.',
  'Jesus was raised on the third day according to the Scriptures.',
  'Jesus appeared to real witnesses who said they saw Him alive.',
]

const questions = [
  {
    question: 'What does resurrection mean?',
    answers: ['A happy memory', 'Coming back from death to bodily life', 'A secret dream'],
    correct: 1,
  },
  {
    question: 'How did Jesus treat Thomas?',
    answers: ['He mocked him', 'He ignored him forever', 'He answered him and called him to believe'],
    correct: 2,
  },
  {
    question: 'What is a faithful response to the risen Jesus?',
    answers: ['Worship, trust, repentance, and witness', 'Winning arguments proudly', 'Pretending questions do not exist'],
    correct: 0,
  },
]

const scriptureEn = {
  corinthians: 'For I delivered to you as of first importance what I also received: that Christ died for our sins in accordance with the Scriptures, that he was buried, that he was raised on the third day in accordance with the Scriptures, and that he appeared to Cephas, then to the twelve. Then he appeared to more than five hundred brothers at one time, most of whom are still alive, though some have fallen asleep. Then he appeared to James, then to all the apostles. Last of all, as to one untimely born, he appeared also to me.',
  corinthiansRef: '1 Corinthians 15:3–8 (ESV)',
  thomas: 'Then he said to Thomas, "Put your finger here, and see my hands; and put out your hand, and place it in my side. Do not disbelieve, but believe." Thomas answered him, "My Lord and my God!" Jesus said to him, "Have you believed because you have seen me? Blessed are those who have not seen and yet have believed."',
  thomasRef: 'John 20:27–29 (ESV)',
}

const scriptureRu = {
  corinthians: 'Ибо я первоначально преподал вам, что и сам принял, то есть, что Христос умер за грехи наши, по Писанию, и что Он погребен был, и что воскрес в третий день, по Писанию, и что явился Кифе, потом двенадцати; потом явился более нежели пятистам братий в одно время, из которых бо́льшая часть доныне в живых, а некоторые и почили; потом явился Иакову, также всем Апостолам; а после всех явился и мне, как некоему извергу.',
  corinthiansRef: '1-е Коринфянам 15:3–8 (Синодальный перевод)',
  thomas: 'Потом говорит Фоме: подай перст твой сюда и посмотри руки Мои; подай руку твою и вложи в ребра Мои; и не будь неверующим, но верующим. Фома сказал Ему в ответ: Господь мой и Бог мой! Иисус говорит ему: ты поверил, потому что увидел Меня; блаженны невидевшие и уверовавшие.',
  thomasRef: 'От Иоанна 20:27–29 (Синодальный перевод)',
}

export default function CaseForChristResurrectionPage() {
  const { language } = useLanguage()
  const [opened, setOpened] = useState<Record<number, boolean>>({})
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const scripture = language === 'ru' ? scriptureRu : scriptureEn
  const isRu = language === 'ru'

  const progress = useMemo(() => {
    const witnessCount = Object.values(opened).filter(Boolean).length
    const correctCount = questions.filter((item, index) => answers[index] === item.correct).length
    return witnessCount + correctCount
  }, [answers, opened])

  return (
    <main style={{ background: '#fff8e8', color: '#203047' }}>
      <section style={{ background: 'linear-gradient(135deg,#5b1530,#0d3a6a)', padding: '46px 18px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 26, alignItems: 'center' }}>
          <div>
            <p style={eyebrowLight}>{isRu ? 'Дело о Христе для детей · Урок 2' : 'Case for Christ Kids · Lesson 2'}</p>
            <h1 style={{ margin: '0 0 14px', color: 'white', fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,5vw,3.4rem)', lineHeight: 1.05 }}>
              {isRu ? 'Иисус действительно воскрес из мёртвых?' : 'Did Jesus Really Rise from the Dead?'}
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,.94)', fontFamily: 'var(--font-lora)', fontSize: '1.12rem', lineHeight: 1.75 }}>
              {isRu
                ? 'Изучи библейский след свидетелей с честными вопросами, смиренной верой и уверенностью в воскресшем Господе.'
                : 'Examine the Bible\'s witness trail with honest questions, humble faith, and confidence in the risen Lord.'}
            </p>
            <div style={progressStyle}>{isRu ? 'Прогресс' : 'Progress'}: {progress}/{witnesses.length + questions.length}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.28)', borderRadius: 26, padding: 24 }}>
            <p style={{ margin: '0 0 10px', color: '#ffdc73', fontFamily: 'var(--font-nunito)', fontWeight: 950 }}>Big Truth</p>
            <p style={{ margin: 0, color: 'white', fontFamily: 'var(--font-lora)', fontSize: '1.08rem', lineHeight: 1.75 }}>
              Christians believe Jesus rose bodily from the dead because God&apos;s Word says it happened, His followers saw Him alive, and the earliest Christian message was built on His death, burial, resurrection, and appearances.
            </p>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 980, margin: '0 auto', padding: '42px 18px' }}>
        <div style={panelStyle('#ffffff')}>
          <p className="eyebrow">Big Question</p>
          <h2 style={headingStyle}>
            {language === 'ru' ? 'Воскрес ли Иисус на самом деле или Его друзья просто желали этого?' : 'Did Jesus rise, or did His friends only wish it was true?'}
          </h2>
          <p style={bodyStyle}>
            {language === 'ru'
              ? 'Библия не говорит детям делать вид, что вопросы глупы. Фома задавал серьёзные вопросы. Павел называл реальных свидетелей. Бог призывает нас внимательно смотреть, смиренно слушать и доверять воскресшему Иисусу.'
              : 'The Bible does not tell kids to pretend questions are silly. Thomas had a serious question. Paul named real witnesses. God invites us to look carefully, listen humbly, and trust the risen Jesus.'}
          </p>
        </div>

        <div style={{ ...panelStyle('#eef7ff'), marginTop: 30 }}>
          <p className="eyebrow">Bible Anchor</p>
          <h2 style={headingStyle}>Death, burial, resurrection, appearances</h2>
          <blockquote style={quoteStyle}>
            {scripture.corinthians}
            <footer style={quoteRefStyle}>{scripture.corinthiansRef}</footer>
          </blockquote>
          <blockquote style={quoteStyle}>
            {scripture.thomas}
            <footer style={quoteRefStyle}>{scripture.thomasRef}</footer>
          </blockquote>
        </div>

        <div style={{ marginTop: 30 }}>
          <p className="eyebrow">Witness Web</p>
          <h2 style={headingStyle}>Tap each witness card</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>
            {witnesses.map((witness, index) => (
              <button key={witness.name} type="button" onClick={() => setOpened((current) => ({ ...current, [index]: !current[index] }))} style={{ ...cardStyle, borderColor: opened[index] ? '#f0b429' : '#d7e3f5' }}>
                <span style={cardTitle}>{witness.name}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-lora)', color: '#46556f', lineHeight: 1.6 }}>
                  {opened[index] ? witness.detail : 'Tap to add this witness to the web.'}
                </span>
                {opened[index] && <span style={cardSource}>Check: {witness.source}</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle('#fff'), marginTop: 30 }}>
          <p className="eyebrow">Evidence Trail</p>
          <h2 style={headingStyle}>Four parts of the first Christian message</h2>
          <ol style={{ ...bodyStyle, paddingLeft: 24 }}>
            {trail.map((item) => <li key={item}>{item}</li>)}
          </ol>
          <p style={bodyStyle}>
            Evidence helps us think carefully, but evidence does not force every heart to trust God. Faith is trusting the true God, not pretending there are no questions.
          </p>
        </div>

        <div style={{ ...panelStyle('#fff7d6'), marginTop: 30 }}>
          <p className="eyebrow">Hard Words</p>
          <ul style={{ ...bodyStyle, paddingLeft: 22 }}>
            <li><strong>Resurrection:</strong> Jesus rose bodily from the dead and will never die again.</li>
            <li><strong>Witness:</strong> A person who saw something happen and can tell others about it.</li>
            <li><strong>Gospel:</strong> The good news that Jesus died for our sins, rose again, and gives forgiveness and life to those who trust Him.</li>
            <li><strong>Faith:</strong> Trusting God because He is true and trustworthy.</li>
          </ul>
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
                {answers[index] !== undefined && <p style={{ ...bodyStyle, marginTop: 12, fontWeight: 800, color: answers[index] === item.correct ? '#1f7a35' : '#a33a10' }}>{answers[index] === item.correct ? 'Good detective work.' : 'Not quite. Follow the witness trail and try again.'}</p>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30 }}>
          <p className="eyebrow">Parent / Teacher Talk</p>
          <h2 style={headingStyle}>Build confidence without pride</h2>
          <p style={bodyStyle}>
            Children should not leave thinking, “People who doubt are dumb.” They should leave thinking, “Jesus is alive, truth matters, and I can bring honest questions into the light.”
          </p>
          <ul style={{ ...bodyStyle, paddingLeft: 22 }}>
            <li>Do not overstate the evidence. God gives strong reasons to believe, and we ask Him for humble hearts.</li>
            <li>Do not shame questions. Honest questions can become a path toward deeper trust when brought to God&apos;s Word.</li>
            <li>The right response to the risen Jesus is worship, trust, repentance, and faithful witness.</li>
          </ul>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30, textAlign: 'center' }}>
          <p style={bodyStyle}>
            Father, thank You for raising Jesus from the dead. Help us ask honest questions with humble hearts, trust Your Word, follow the risen Lord, and speak about Him with courage and kindness. In Jesus&apos; name, amen.
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

const cardStyle = {
  textAlign: 'left' as const,
  cursor: 'pointer',
  background: '#fff',
  border: '2px solid #d7e3f5',
  borderRadius: 20,
  padding: 18,
  minHeight: 166,
  boxShadow: '0 10px 24px rgba(13,58,106,.08)',
}

const cardTitle = {
  display: 'block',
  color: '#0d3a6a',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 950,
  fontSize: '1.1rem',
  marginBottom: 8,
}

const cardSource = {
  display: 'block',
  marginTop: 12,
  color: '#1a4a8a',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 900,
}

const quoteStyle = {
  margin: '16px 0',
  padding: '18px 20px',
  background: '#fff8e8',
  borderLeft: '5px solid #f0b429',
  borderRadius: 14,
  color: '#38445c',
  fontFamily: 'var(--font-lora)',
  lineHeight: 1.75,
}

const quoteRefStyle = {
  marginTop: 10,
  color: '#0d3a6a',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 900,
}

const answerStyle = {
  cursor: 'pointer',
  border: '2px solid #d7e3f5',
  borderRadius: 999,
  padding: '10px 14px',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 900,
  color: '#203047',
}
