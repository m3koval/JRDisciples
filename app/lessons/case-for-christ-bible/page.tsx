'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type EvidenceCard = {
  title: string
  body: string
}

const evidenceCards: EvidenceCard[] = [
  {
    title: 'Real history',
    body: 'The Bible talks about real places, rulers, families, journeys, cities, and events. Luke says he carefully investigated what happened.',
  },
  {
    title: 'Eyewitness testimony',
    body: 'An eyewitness is someone who saw something happen. The first Christians spoke publicly about Jesus while many people could still ask questions.',
  },
  {
    title: 'Careful copying',
    body: 'A manuscript is an old handwritten copy. Many manuscripts can be compared and checked, even when tiny copying differences appear.',
  },
  {
    title: 'Honest about people',
    body: 'The Bible tells the truth about sin, fear, doubt, pride, repentance, and mercy. It does not hide the failures of its heroes.',
  },
  {
    title: 'One rescue story',
    body: 'Across many books and human authors, Scripture tells one great story: God made the world, people sinned, Jesus came to rescue, and God will make all things new.',
  },
]

const quiz = [
  {
    question: 'What is an eyewitness?',
    answers: ['Someone who saw something happen', 'Someone who only guessed', 'Someone who tells a fairy tale'],
    correct: 0,
  },
  {
    question: 'What is a manuscript?',
    answers: ['A secret whisper', 'An old handwritten copy', 'A pretend map'],
    correct: 1,
  },
  {
    question: 'Why do many manuscripts help scholars?',
    answers: ['They can compare and check copies', 'They can ignore hard questions', 'They can invent new verses'],
    correct: 0,
  },
]

export default function CaseForChristBiblePage() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const completeCount = useMemo(() => {
    const cards = Object.values(flipped).filter(Boolean).length
    const correct = quiz.filter((item, index) => answers[index] === item.correct).length
    return cards + correct
  }, [answers, flipped])

  return (
    <main style={{ background: '#fff8e8', color: '#203047' }}>
      <section style={{ background: 'linear-gradient(135deg,#0d3a6a,#1d5fa7)', padding: '44px 18px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28, alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 10px', color: '#ffdc73', fontFamily: 'var(--font-nunito)', fontWeight: 900, letterSpacing: 1.4, textTransform: 'uppercase' }}>
              Case for Christ Kids · Lesson 1
            </p>
            <h1 style={{ margin: '0 0 14px', color: 'white', fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,5vw,3.4rem)', lineHeight: 1.05, textShadow: '0 3px 12px rgba(0,0,0,.28)' }}>
              Can We Trust the Bible?
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,.94)', fontFamily: 'var(--font-lora)', fontSize: '1.12rem', lineHeight: 1.75 }}>
              Follow the evidence trail: real history, eyewitness testimony, careful copying, and God’s faithful Word.
            </p>
            <div style={{ marginTop: 20, display: 'inline-flex', gap: 10, alignItems: 'center', padding: '10px 14px', borderRadius: 999, background: 'rgba(255,255,255,.14)', color: 'white', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>
              Progress: {completeCount}/{evidenceCards.length + quiz.length}
            </div>
          </div>
          <img
            src="/images/jr/lessons/case-for-christ-bible/hero.png"
            alt="Children investigating Bible manuscripts around an open glowing Bible"
            style={{ width: '100%', height: 'auto', borderRadius: 24, boxShadow: '0 18px 44px rgba(0,0,0,.28)' }}
          />
        </div>
      </section>

      <section style={{ maxWidth: 980, margin: '0 auto', padding: '42px 18px' }}>
        <div style={panelStyle('#ffffff')}>
          <p className="eyebrow">Big Question</p>
          <h2 style={headingStyle}>Can we trust the Bible, or is it just a made-up story?</h2>
          <p style={bodyStyle}>
            We can trust the Bible because God gave His Word, and He used real people, real history, eyewitness testimony, and careful copying to preserve it for us.
          </p>
          <p style={bodyStyle}>
            That does not mean every question is easy. It means Christians do not believe the Bible because we are pretending. We have good reasons to listen to it, study it, and build our lives on what God says.
          </p>
          <p style={{ ...bodyStyle, fontWeight: 800 }}>
            Evidence means clues and facts that help us know whether something is true.
          </p>
        </div>

        <div style={{ marginTop: 26 }}>
          <p className="eyebrow">Evidence Trail</p>
          <h2 style={headingStyle}>Tap each clue card</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>
            {evidenceCards.map((card, index) => (
              <button
                key={card.title}
                type="button"
                onClick={() => setFlipped((current) => ({ ...current, [index]: !current[index] }))}
                style={{ ...cardStyle, borderColor: flipped[index] ? '#f0b429' : '#d7e3f5' }}
              >
                <span style={{ display: 'block', color: '#0d3a6a', fontFamily: 'var(--font-nunito)', fontWeight: 950, fontSize: '1.1rem', marginBottom: 8 }}>
                  {index + 1}. {card.title}
                </span>
                <span style={{ display: 'block', fontFamily: 'var(--font-lora)', color: '#46556f', lineHeight: 1.6 }}>
                  {flipped[index] ? card.body : 'Tap to investigate this clue.'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle('#fff'), marginTop: 30 }}>
          <p className="eyebrow">Bible Anchor</p>
          <h2 style={headingStyle}>Luke carefully checked the story</h2>
          <blockquote style={quoteStyle}>
            Since many have undertaken to set in order a narrative concerning those matters which have been fulfilled among us, even as those who from the beginning were eyewitnesses and servants of the word delivered them to us, it seemed good to me also, having traced the course of all things accurately from the first, to write to you in order, most excellent Theophilus; that you might know the certainty concerning the things in which you were instructed.
            <footer style={quoteRefStyle}>Luke 1:1–4, WEB</footer>
          </blockquote>
          <p style={bodyStyle}>
            Luke was not saying, “Believe this because I said so.” He was saying, “This has been carefully checked.”
          </p>
          <blockquote style={quoteStyle}>
            Every Scripture is God-breathed and profitable for teaching, for reproof, for correction, and for instruction in righteousness,
            <footer style={quoteRefStyle}>2 Timothy 3:16, WEB</footer>
          </blockquote>
          <p style={bodyStyle}>
            Scripture is not only a human book. God worked through human writers so His people would have His true Word.
          </p>
        </div>

        <div style={{ ...panelStyle('#eef7ff'), marginTop: 30 }}>
          <p className="eyebrow">Think It Through</p>
          <h2 style={headingStyle}>Telephone vs. careful copy</h2>
          <p style={bodyStyle}>
            Imagine your class wants to know what happened at recess. One student says, “I heard a wild story from someone who heard it from someone else.” Another says, “I was there. I saw it. I wrote it down the same day. Other people who were there can tell you too.” Which report should you take more seriously?
          </p>
          <p style={bodyStyle}>
            Try this activity: whisper a sentence around the room, then compare it with written copies of the same sentence. Suggested sentence: “Luke carefully checked what eyewitnesses said about Jesus.” Written copies are easier to compare and check.
          </p>
        </div>

        <div style={{ marginTop: 30 }}>
          <p className="eyebrow">Detective Check</p>
          <h2 style={headingStyle}>Choose the strongest answer</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {quiz.map((item, index) => (
              <div key={item.question} style={panelStyle('#fff')}>
                <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--font-nunito)', color: '#0d3a6a', fontSize: '1.15rem' }}>{item.question}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {item.answers.map((answer, answerIndex) => {
                    const chosen = answers[index] === answerIndex
                    const correct = item.correct === answerIndex
                    return (
                      <button
                        key={answer}
                        type="button"
                        onClick={() => setAnswers((current) => ({ ...current, [index]: answerIndex }))}
                        style={{ ...answerStyle, background: chosen ? (correct ? '#d9f7df' : '#ffe0df') : '#f5f7fb', borderColor: chosen ? (correct ? '#2f9e44' : '#d9480f') : '#d7e3f5' }}
                      >
                        {answer}
                      </button>
                    )
                  })}
                </div>
                {answers[index] !== undefined && (
                  <p style={{ ...bodyStyle, marginTop: 12, fontWeight: 800, color: answers[index] === item.correct ? '#1f7a35' : '#a33a10' }}>
                    {answers[index] === item.correct ? 'Good detective work.' : 'Not quite. Look back at the evidence trail and try again.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle('#fff7d6'), marginTop: 30 }}>
          <p className="eyebrow">Parent / Teacher Guide</p>
          <h2 style={headingStyle}>Guide honest questions into the light</h2>
          <ul style={{ ...bodyStyle, paddingLeft: 22 }}>
            <li>Faith does not mean believing with no reasons. Faith means trusting God, and God has given us good reasons.</li>
            <li>Questions are not something to hide. Honest questions can help children learn truth with humility.</li>
            <li>If children ask about translations, explain that the Bible was first written mostly in Hebrew and Greek. Good translations may use slightly different English words while teaching the same truth from the original manuscripts.</li>
          </ul>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30, textAlign: 'center' }}>
          <p style={bodyStyle}>
            Father, thank You for giving us Your Word. Help us listen carefully, ask honest questions, and trust what is true. Thank You for sending Jesus and for preserving the good news about Him. Teach us to love Your Word and obey You with glad hearts. In Jesus’ name, amen.
          </p>
          <Link href="/lessons" style={{ display: 'inline-block', marginTop: 16, fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#0d3a6a', textDecoration: 'none' }}>
            ← Back to Lessons
          </Link>
        </div>
      </section>
    </main>
  )
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
