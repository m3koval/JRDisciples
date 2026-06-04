'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type EvidenceCard = {
  title: string
  body: string
  proof: string
}

const evidenceCards: EvidenceCard[] = [
  {
    title: 'Real history',
    body: 'The Bible talks about real places, rulers, families, journeys, cities, and events. Luke names leaders and locations because he is writing about things that happened in history, not a pretend land.',
    proof: 'Luke 1:1–4; Luke 2:1–2',
  },
  {
    title: 'Eyewitness testimony',
    body: 'An eyewitness is someone who saw something happen. The apostles said they saw Jesus, heard Him, touched Him, and then told others what they had seen.',
    proof: '1 John 1:1–3; 2 Peter 1:16',
  },
  {
    title: 'Careful copying',
    body: 'A manuscript is an old handwritten copy. Many manuscripts can be compared like puzzle pieces. Tiny copying differences are usually easy to spot because there are so many copies to check.',
    proof: 'Luke 1:3–4; Colossians 4:16',
  },
  {
    title: 'Honest about people',
    body: 'The Bible tells the truth about sin, fear, doubt, pride, repentance, and mercy. It does not hide the failures of its heroes, even when those failures are embarrassing.',
    proof: 'Mark 14:66–72; Psalm 51',
  },
  {
    title: 'One rescue story',
    body: 'Across many books and human authors, Scripture tells one great rescue story: God made the world, people sinned, Jesus came to rescue, and God will make all things new.',
    proof: 'Luke 24:44–47; Revelation 21:5',
  },
]

const caseFiles = [
  {
    label: '1',
    title: 'Not “telephone game” guessing',
    body: 'The New Testament was not passed down only by whispers. It was preached publicly, written down, copied, read in churches, and checked by people who cared deeply about the truth.',
  },
  {
    label: '2',
    title: 'Witnesses could be questioned',
    body: 'Paul said more than five hundred people saw the risen Jesus, and many were still alive when he wrote. That is a bold claim if people could check it.',
  },
  {
    label: '3',
    title: 'Copies help us check copies',
    body: 'Before printing presses, Christians copied Scripture by hand. When many old copies agree, and small differences can be compared, scholars can see what was written with strong confidence.',
  },
  {
    label: '4',
    title: 'Faith is not pretending',
    body: 'Christians trust the Bible because God is truthful and because He gave real reasons in history. Faith is trust with reasons, not closing our eyes to hard questions.',
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
  {
    question: 'What should we do when we have honest questions about the Bible?',
    answers: ['Hide them forever', 'Ask, study, pray, and look for truth carefully', 'Decide truth does not matter'],
    correct: 1,
  },
]

const scriptureEn = {
  luke: 'Inasmuch as many have undertaken to compile a narrative of the things that have been accomplished among us, just as those who from the beginning were eyewitnesses and ministers of the word have delivered them to us, it seemed good to me also, having followed all things closely for some time past, to write an orderly account for you, most excellent Theophilus, that you may have certainty concerning the things you have been taught.',
  lukeRef: 'Luke 1:1–4 (ESV)',
  timothy: 'All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness',
  timothyRef: '2 Timothy 3:16 (ESV)',
  peter: 'For we did not follow cleverly devised myths when we made known to you the power and coming of our Lord Jesus Christ, but we were eyewitnesses of his majesty.',
  peterRef: '2 Peter 1:16 (ESV)',
  corinthians: 'Then he appeared to more than five hundred brothers at one time, most of whom are still alive, though some have fallen asleep.',
  corinthiansRef: '1 Corinthians 15:6 (ESV)',
}

const scriptureRu = {
  luke: 'Как уже многие начали составлять повествования о совершенно известных между нами событиях, как передали нам то́ бывшие с самого начала очевидцами и служителями Слова, то рассудилось и мне, по тщательном исследовании всего сначала, по порядку описать тебе, достопочтенный Феофил, чтобы ты узнал твердое основание того учения, в котором был наставлен.',
  lukeRef: 'От Луки 1:1–4 (Синодальный перевод)',
  timothy: 'Все Писание богодухновенно и полезно для научения, для обличения, для исправления, для наставления в праведности',
  timothyRef: '2-е Тимофею 3:16 (Синодальный перевод)',
  peter: 'Ибо мы возвестили вам силу и пришествие Господа нашего Иисуса Христа, не хитросплетенным басням последуя, но быв очевидцами Его величия.',
  peterRef: '2-е Петра 1:16 (Синодальный перевод)',
  corinthians: 'потом явился более нежели пятистам братий в одно время, из которых бо́льшая часть доныне в живых, а некоторые и почили',
  corinthiansRef: '1-е Коринфянам 15:6 (Синодальный перевод)',
}

export default function CaseForChristBiblePage() {
  const { language } = useLanguage()
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const scripture = language === 'ru' ? scriptureRu : scriptureEn
  const isRu = language === 'ru'

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
              {isRu ? 'Дело о Христе для детей · Урок 1' : 'Case for Christ Kids · Lesson 1'}
            </p>
            <h1 style={{ margin: '0 0 14px', color: 'white', fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,5vw,3.4rem)', lineHeight: 1.05, textShadow: '0 3px 12px rgba(0,0,0,.28)' }}>
              {isRu ? 'Можно ли доверять Библии?' : 'Can We Trust the Bible?'}
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,.94)', fontFamily: 'var(--font-lora)', fontSize: '1.12rem', lineHeight: 1.75 }}>
              {isRu
                ? 'Иди по следу доказательств: настоящая история, свидетельства очевидцев, внимательное переписывание и верное Божье Слово.'
                : 'Follow the evidence trail: real history, eyewitness testimony, careful copying, and God’s faithful Word.'}
            </p>
            <div style={{ marginTop: 20, display: 'inline-flex', gap: 10, alignItems: 'center', padding: '10px 14px', borderRadius: 999, background: 'rgba(255,255,255,.14)', color: 'white', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>
              {isRu ? 'Прогресс' : 'Progress'}: {completeCount}/{evidenceCards.length + quiz.length}
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
          <p className="eyebrow">{isRu ? 'Главный вопрос' : 'Big Question'}</p>
          <h2 style={headingStyle}>
            {language === 'ru' ? 'Можно ли доверять Библии или это просто выдумка?' : 'Can we trust the Bible, or is it just a made-up story?'}
          </h2>
          <p style={bodyStyle}>
            {language === 'ru'
              ? 'Мы можем доверять Библии, потому что Бог дал нам Своё Слово, используя реальных людей, реальную историю, свидетельства очевидцев и тщательное переписывание, чтобы сохранить его для нас.'
              : 'We can trust the Bible because God gave His Word, and He used real people, real history, eyewitness testimony, and careful copying to preserve it for us.'}
          </p>
          <p style={bodyStyle}>
            {language === 'ru'
              ? 'Это не значит, что каждый вопрос решается легко. Это значит, что христиане верят Библии не потому, что притворяются. У нас есть веские причины слушать её, изучать её и строить свою жизнь на том, что говорит Бог.'
              : 'That does not mean every question is easy. It means Christians do not believe the Bible because we are pretending. We have good reasons to listen to it, study it, and build our lives on what God says.'}
          </p>
          <p style={bodyStyle}>
            This lesson does not ask kids to believe a thin answer like, “Just trust it.” It opens a case file: What kind of book is the Bible? Who wrote about Jesus? Were there witnesses? Were the words preserved carefully? What does Scripture say about itself?
          </p>
          <p style={{ ...bodyStyle, fontWeight: 800 }}>
            Evidence means clues and facts that help us know whether something is true.
          </p>
        </div>

        <div style={{ ...panelStyle('#eef7ff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Материалы дела' : 'Case File'}</p>
          <h2 style={headingStyle}>{isRu ? 'Что считается хорошим доказательством?' : 'What would count as good evidence?'}</h2>
          <p style={bodyStyle}>
            Some things can be proved with a measuring tape. History is different. For history, we ask: Did real people see it? Was it written close enough to the events? Did people preserve the message? Does it fit with what we know about the world? The Bible stands in that kind of historical light.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginTop: 18 }}>
            {caseFiles.map((file) => (
              <div key={file.title} style={{ background: '#fff', border: '1px solid rgba(13,58,106,.14)', borderRadius: 18, padding: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, display: 'grid', placeItems: 'center', background: '#ffdc73', color: '#0d3a6a', fontFamily: 'var(--font-nunito)', fontWeight: 950, marginBottom: 10 }}>
                  {file.label}
                </div>
                <h3 style={{ margin: '0 0 8px', color: '#0d3a6a', fontFamily: 'var(--font-nunito)', fontSize: '1.05rem' }}>{file.title}</h3>
                <p style={{ ...bodyStyle, margin: 0, fontSize: '.96rem' }}>{file.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 26 }}>
          <p className="eyebrow">{isRu ? 'След доказательств' : 'Evidence Trail'}</p>
          <h2 style={headingStyle}>{isRu ? 'Нажми на каждую карточку-подсказку' : 'Tap each clue card'}</h2>
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
                  {flipped[index] ? card.body : (isRu ? 'Нажми, чтобы исследовать эту подсказку.' : 'Tap to investigate this clue.')}
                </span>
                {flipped[index] && (
                  <span style={{ display: 'block', marginTop: 12, color: '#1a4a8a', fontFamily: 'var(--font-nunito)', fontWeight: 900 }}>
                    {isRu ? 'Проверь' : 'Check'}: {card.proof}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle('#fff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Библейская опора' : 'Bible Anchor'}</p>
          <h2 style={headingStyle}>{isRu ? 'Лука тщательно проверил историю' : 'Luke carefully checked the story'}</h2>
          <blockquote style={quoteStyle}>
            {scripture.luke}
            <footer style={quoteRefStyle}>{scripture.lukeRef}</footer>
          </blockquote>
          <p style={bodyStyle}>
            Luke was not saying, “Believe this because I said so.” He was saying, “This has been carefully checked.”
          </p>
          <blockquote style={quoteStyle}>
            {scripture.timothy}
            <footer style={quoteRefStyle}>{scripture.timothyRef}</footer>
          </blockquote>
          <p style={bodyStyle}>
            Scripture is not only a human book. God worked through human writers so His people would have His true Word.
          </p>
          <blockquote style={quoteStyle}>
            {scripture.peter}
            <footer style={quoteRefStyle}>{scripture.peterRef}</footer>
          </blockquote>
          <p style={bodyStyle}>
            Peter says the apostles were not spreading clever myths. They were telling what they saw.
          </p>
          <blockquote style={quoteStyle}>
            {scripture.corinthians}
            <footer style={quoteRefStyle}>{scripture.corinthiansRef}</footer>
          </blockquote>
          <p style={bodyStyle}>
            Paul pointed to living witnesses. In other words: “You can check this.” That is not how people usually talk when they are inventing a secret story.
          </p>
        </div>

        <div style={{ ...panelStyle('#eef7ff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Подумай' : 'Think It Through'}</p>
          <h2 style={headingStyle}>{isRu ? 'Игра в телефон или внимательное переписывание?' : 'Telephone vs. careful copy'}</h2>
          <p style={bodyStyle}>
            Imagine your class wants to know what happened at recess. One student says, “I heard a wild story from someone who heard it from someone else.” Another says, “I was there. I saw it. I wrote it down the same day. Other people who were there can tell you too.” Which report should you take more seriously?
          </p>
          <p style={bodyStyle}>
            Try this activity: whisper a sentence around the room, then compare it with written copies of the same sentence. Suggested sentence: “Luke carefully checked what eyewitnesses said about Jesus.” Written copies are easier to compare and check.
          </p>
          <p style={bodyStyle}>
            Important difference: the Bible is not like one whisper traveling through a long line. It is more like many careful written copies spread through many places. If one copy has a small mistake, the other copies help us notice and correct it.
          </p>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Честные ответы' : 'Honest Answers'}</p>
          <h2 style={headingStyle}>{isRu ? 'А как быть с трудными вопросами?' : 'What about hard questions?'}</h2>
          <p style={bodyStyle}>
            Trusting the Bible does not mean every question disappears in five seconds. It means we bring questions into the light instead of hiding them. Christians can study ancient languages, manuscripts, history, archaeology, and theology because all truth belongs to God.
          </p>
          <ul style={{ ...bodyStyle, paddingLeft: 22 }}>
            <li><strong>{isRu ? 'Переводы' : 'Translations'}:</strong> {isRu ? 'Библия была написана в основном на еврейском, арамейском и греческом языках. Хорошие переводы помогают нам читать эти слова на нашем языке.' : 'The Bible was written mostly in Hebrew, Aramaic, and Greek. Good translations help us read those words in our language.'}</li>
            <li><strong>{isRu ? 'Различия в копиях' : 'Copying differences'}:</strong> {isRu ? 'В рукописных копиях иногда есть маленькие различия, но сравнение многих копий помогает учёным увидеть, что было написано изначально.' : 'Handwritten copies sometimes have small differences, but comparing many copies helps scholars see what was originally written.'}</li>
            <li><strong>{isRu ? 'Чудеса' : 'Miracles'}:</strong> {isRu ? 'Если Бог сотворил мир, чудеса не невозможны. Вопрос в том, дал ли Бог надёжных свидетелей.' : 'If God made the world, then miracles are not impossible. The question is whether God gave good witnesses.'}</li>
            <li><strong>{isRu ? 'Вера' : 'Faith'}:</strong> {isRu ? 'Библейская вера — не выдумка. Это доверие Богу, Который говорит истину.' : 'Biblical faith is not make-believe. It is trusting the God who tells the truth.'}</li>
          </ul>
        </div>

        <div style={{ marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Проверка детектива' : 'Detective Check'}</p>
          <h2 style={headingStyle}>{isRu ? 'Выбери самый сильный ответ' : 'Choose the strongest answer'}</h2>
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
                    {answers[index] === item.correct ? (isRu ? 'Хорошая работа, детектив.' : 'Good detective work.') : (isRu ? 'Не совсем. Посмотри ещё раз на след доказательств и попробуй снова.' : 'Not quite. Look back at the evidence trail and try again.')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle('#fff7d6'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Для родителей и учителя' : 'Parent / Teacher Guide'}</p>
          <h2 style={headingStyle}>{isRu ? 'Помогите честным вопросам выйти на свет' : 'Guide honest questions into the light'}</h2>
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
            ← {isRu ? 'Назад к урокам' : 'Back to Lessons'}
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
