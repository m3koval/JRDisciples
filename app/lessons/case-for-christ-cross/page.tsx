'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

const anchors = ['Romans 5:6-11', '1 Peter 3:18', 'Isaiah 53:5-6']

const teachingTrail = [
  {
    title: '1. Sin is serious, not small',
    body: 'Sin is not only making a mistake. Sin is choosing what is wrong against God in our thoughts, words, actions, or desires. Because God is holy, He does not shrug at sin or pretend wrong is harmless.',
    picture: 'Child-clear picture: if someone breaks a window, saying sorry matters, but the broken window still needs to be dealt with. Sin breaks fellowship with God and harms people made in His image.',
  },
  {
    title: '2. God’s justice and mercy meet at the cross',
    body: 'Justice means God does what is right. Mercy means God shows kindness to people who deserve judgment. At the cross, God did not pretend sin was small, and He did not leave sinners without hope.',
    picture: 'The cross says, “Sin is worse than we thought, and God’s love is deeper than we imagined.”',
  },
  {
    title: '3. Jesus is the perfect Substitute',
    body: 'A substitute stands in someone else’s place. We could not pay for our sin by being extra good later. Jesus never sinned, obeyed the Father perfectly, and willingly stood in the place of sinners to bring them to God.',
    picture: 'The Father sent the Son, and the Son obeyed the Father. The cross shows one united rescue plan from God.',
  },
  {
    title: '4. The cross shows love, not fear pressure',
    body: 'Children do not need graphic details to understand salvation. The Bible says Jesus suffered and died, and that is serious enough. The main point is not, “Feel scared enough.” The main point is, “Look at how much God loves sinners. Trust Jesus.”',
    picture: 'Christians love Jesus because He first loved us.',
  },
  {
    title: '5. Jesus died to bring us to God',
    body: 'Forgiveness is not only getting out of trouble. Forgiveness brings us back into relationship with God. God welcomes repentant sinners through Christ.',
    picture: 'Repentance means turning away from sin and turning toward God. Faith means trusting Jesus to save you, not trying to save yourself.',
  },
  {
    title: '6. The resurrection proves the cross was not defeat',
    body: 'Jesus did not stay dead. The resurrection shows that Jesus truly won. God accepted Jesus’ sacrifice, death was defeated, and Jesus is alive as Lord.',
    picture: 'The Christian message is not, “Try harder and maybe God will like you.” It is, “Jesus has done what sinners could never do. Come to Him with trust.”',
  },
]

const bibleAnchors = [
  {
    ref: 'Romans 5:6-11',
    summary: 'Paul teaches that Christ died for us while we were still weak and sinful. God showed His love by sending Jesus to die for sinners, and believers are justified and reconciled to God through Him.',
    helps: 'The cross is love in action. God loved sinners enough to rescue them, not because they deserved it, but because He is gracious.',
  },
  {
    ref: '1 Peter 3:18',
    summary: 'Peter teaches that Christ suffered once for sins: the righteous One for the unrighteous, so that He might bring us to God.',
    helps: 'Jesus took our place to bring us home to God. The cross is substitution, which means one person stands in the place of another.',
  },
  {
    ref: 'Isaiah 53:5-6',
    summary: 'Isaiah looked ahead to the suffering Servant. Christians understand this passage as pointing to Jesus and His saving work on the cross.',
    helps: 'The cross was not a surprise ending. God had promised that His Servant would suffer to rescue His people.',
  },
]

const hardWords = [
  ['Sin', 'Choosing what is wrong against God in our thoughts, words, actions, or desires.'],
  ['Holy', 'Perfectly good, pure, and set apart from sin. God is holy.'],
  ['Justice', 'Doing what is right and dealing with wrong rightly.'],
  ['Mercy', 'Kindness God shows to people who deserve judgment.'],
  ['Grace', 'God’s kind favor that we do not earn.'],
  ['Substitute', 'Someone who stands in another person’s place.'],
  ['Righteous', 'Perfectly right with God. Jesus is righteous; sinners are not righteous on their own.'],
  ['Justified', 'Declared right with God because of what Jesus has done, not because we earned it.'],
  ['Sacrifice', 'A costly gift given to God. Jesus gave Himself to rescue sinners; this does not mean anyone paid money.'],
  ['Peace with God', 'Being brought out of guilt and separation into a restored relationship with God through Jesus.'],
  ['Repentance', 'Turning away from sin and turning toward God.'],
  ['Faith', 'Trusting God because He is true and trustworthy.'],
]

const questions = [
  'What is the difference between a mistake and sin?',
  'Why would it be wrong for God to pretend sin does not matter?',
  'What does it mean that Jesus is our Substitute?',
  'How does the cross show God’s love?',
  'What does 1 Peter 3:18 say Jesus came to do for sinners?',
  'How do the cross and resurrection belong together?',
]

const copy = {
  en: {
    title: 'Why Did Jesus Have to Die?',
    intro: 'Follow the justice-and-mercy trail to see why the cross is serious, loving, and full of hope.',
    heroCaption: 'At the cross, God showed perfect justice and deep mercy so sinners can be reconciled to God.',
    bigQuestion: 'Why did Jesus have to die on the cross?',
    bigTruth: 'Jesus died because sinners need rescue, and God is both perfectly just and perfectly merciful. At the cross, Jesus lovingly took the place of sinners so that everyone who trusts Him can be forgiven, brought near to God, and reconciled to God.',
    recap: 'Child recap: We sinned. Jesus never sinned. Jesus died in the place of sinners and rose again so we can be forgiven and come to God.',
    back: '← Back to Lessons',
  },
  ru: {
    title: 'Почему Иисусу нужно было умереть?',
    intro: 'Проследи путь справедливости и милости: крест серьёзен, полон любви и даёт надежду.',
    heroCaption: 'На кресте Бог показал совершенную справедливость и глубокую милость, чтобы грешники могли быть примирены с Богом.',
    bigQuestion: 'Почему Иисусу нужно было умереть на кресте?',
    bigTruth: 'Иисус умер, потому что грешникам нужно спасение, а Бог совершенно справедлив и совершенно милостив. На кресте Иисус с любовью занял место грешников, чтобы каждый, кто доверяет Ему, мог быть прощён, приближён к Богу и примирён с Богом.',
    recap: 'Кратко для ребёнка: мы согрешили. Иисус никогда не согрешил. Иисус умер вместо грешников и воскрес, чтобы мы могли получить прощение и прийти к Богу.',
    russianSummary: 'Грех — это не просто ошибка, а выбор против Бога. Справедливость означает, что Бог правильно разбирается со злом. Милость означает, что Бог проявляет доброту к тем, кто заслуживает суда. Иисус — праведный Заместитель: Он добровольно занял место грешников, умер за нас и воскрес. Крест не нужен для страха или давления на детей; он показывает святую справедливость Бога, Его глубокую милость и любовь. Вера — это доверять Иисусу, а покаяние — отворачиваться от греха и поворачиваться к Богу.',
    back: '← Назад к урокам',
  },
}

export default function CaseForChristCrossPage() {
  const { language } = useLanguage()
  const isRu = language === 'ru'
  const text = language === 'ru' ? copy.ru : copy.en

  return (
    <main style={{ background: '#fff8e8', color: '#203047' }}>
      <section style={{ background: 'linear-gradient(135deg,#4a1230,#0d3a6a)', padding: '46px 18px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28, alignItems: 'center' }}>
          <div>
            <p style={eyebrowLight}>{isRu ? 'Дело о Христе для детей · Урок 5' : 'Case for Christ Kids · Lesson 5'}</p>
            <h1 style={{ margin: '0 0 14px', color: 'white', fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,5vw,3.4rem)', lineHeight: 1.05 }}>
              {text.title}
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,.94)', fontFamily: 'var(--font-lora)', fontSize: '1.12rem', lineHeight: 1.75 }}>
              {text.intro}
            </p>
            <div style={anchorWrapStyle}>{anchors.map((anchor) => <span key={anchor} style={anchorPillStyle}>{anchor}</span>)}<span style={anchorPillStyle}>{isRu ? 'Кратко по ESV' : 'ESV summaries'}</span></div>
          </div>
          <figure style={heroFigureStyle}>
            <img src="/images/jr/lessons/case-for-christ-cross/hero.png" alt="Children seeing a hopeful symbolic cross where justice and mercy meet" style={imageStyle} />
            <figcaption style={captionStyle}>{text.heroCaption}</figcaption>
          </figure>
        </div>
      </section>

      <section style={{ maxWidth: 1020, margin: '0 auto', padding: '42px 18px' }}>
        <div style={panelStyle('#ffffff')}>
          <p className="eyebrow">{isRu ? 'Главный вопрос' : 'Big Question'}</p>
          <h2 style={headingStyle}>{text.bigQuestion}</h2>
          <p style={bodyStyle}>
            {text.bigTruth}
          </p>
          <p style={{ ...bodyStyle, fontWeight: 800 }}>
            {text.recap}
          </p>
        </div>

        {language === 'ru' && (
          <div style={{ ...panelStyle('#fff7d6'), marginTop: 30 }}>
            <p className="eyebrow">Русское резюме</p>
            <h2 style={headingStyle}>Справедливость, милость и любовь на кресте</h2>
            <p style={bodyStyle}>{copy.ru.russianSummary}</p>
          </div>
        )}

        <div style={{ ...panelStyle('#eef7ff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Библейская опора' : 'Bible Anchor'}</p>
          <h2 style={headingStyle}>{isRu ? 'Любовь, замещение и спасение' : 'Love, substitution, and rescue'}</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {bibleAnchors.map((anchor) => (
              <article key={anchor.ref} style={miniCardStyle}>
                <h3 style={miniTitleStyle}>{anchor.ref}</h3>
                <p style={bodyStyle}>{anchor.summary}</p>
                <p style={{ ...bodyStyle, marginBottom: 0 }}><strong>{isRu ? 'Что это помогает увидеть' : 'What this helps us see'}:</strong> {anchor.helps}</p>
              </article>
            ))}
          </div>
        </div>

        <figure style={{ ...figurePanelStyle, marginTop: 30 }}>
          <img src="/images/jr/lessons/case-for-christ-cross/bible-truth.png" alt="Children learning from an open Bible about the righteous One for the unrighteous" style={imageStyle} />
          <figcaption style={captionStyle}>The Bible teaches the saving message in words; lesson labels are shown in the page text, not in the image.</figcaption>
        </figure>

        <div style={{ marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'След доказательств / урока' : 'Evidence / Teaching Trail'}</p>
          <h2 style={headingStyle}>{isRu ? 'Шесть шагов через крест и воскресение' : 'Six steps through the cross and resurrection'}</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {teachingTrail.map((step) => (
              <article key={step.title} style={panelStyle('#ffffff')}>
                <h3 style={miniTitleStyle}>{step.title}</h3>
                <p style={bodyStyle}>{step.body}</p>
                <p style={{ ...bodyStyle, marginBottom: 0, fontWeight: 800 }}>{step.picture}</p>
              </article>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle('#fff7d6'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Объяснение трудных слов' : 'Hard Words Defined'}</p>
          <h2 style={headingStyle}>{isRu ? 'Важные евангельские слова' : 'Important gospel words'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
            {hardWords.map(([word, meaning]) => (
              <div key={word} style={wordCardStyle}>
                <strong style={{ color: '#0d3a6a' }}>{word}</strong>
                <p style={{ margin: '6px 0 0', lineHeight: 1.55 }}>{meaning}</p>
              </div>
            ))}
          </div>
        </div>

        <figure style={{ ...figurePanelStyle, marginTop: 30 }}>
          <img src="/images/jr/lessons/case-for-christ-cross/artifact-reconstruction.png" alt="Child-safe reconstruction of first-century Roman crucifixion context with distant symbolic crosses" style={imageStyle} />
          <figcaption style={captionStyle}>Original child-safe reconstruction of first-century Roman crucifixion context; not a photograph and not a graphic depiction. Historical context only; Scripture supplies the saving message.</figcaption>
        </figure>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Честный вопрос' : 'Honest Question'}</p>
          <h2 style={headingStyle}>{isRu ? 'Если Бог любит людей, почему Он не мог просто простить грех без смерти Иисуса?' : 'If God loves people, why could He not just forgive sin without Jesus dying?'}</h2>
          <p style={bodyStyle}>
            God’s love is not pretend love, and God’s justice is not pretend justice. If God ignored sin, He would not be treating evil as evil. But if God only gave sinners the judgment they deserved, we would have no hope.
          </p>
          <p style={bodyStyle}>
            At the cross, God made a way to forgive sinners without pretending sin is small. Jesus, who never sinned, took the place of sinners. He carried the punishment we deserved so we could receive mercy we did not deserve.
          </p>
          <p style={{ ...bodyStyle, marginBottom: 0, fontWeight: 800 }}>
            So the cross shows both truths at once: God is more holy than we often realize, and God is more loving than we could ever earn.
          </p>
        </div>

        <div style={{ ...panelStyle('#eef7ff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Интерактивное задание' : 'Interactive Activity'}</p>
          <h2 style={headingStyle}>{isRu ? 'Две карточки: справедливость и милость' : 'The Two Cards: Justice and Mercy'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, alignItems: 'center' }}>
            <div>
              <p style={bodyStyle}><strong>Supplies:</strong> two index cards, a marker, a small toy figure or paper person, and a small paper heart.</p>
              <ol style={{ ...bodyStyle, paddingLeft: 22 }}>
                <li>Write <strong>Justice</strong> on one card and <strong>Mercy</strong> on the other.</li>
                <li>Ask whether wrong should be ignored. Place the Justice card beside the person.</li>
                <li>Ask what hope sinners would have without mercy. Place the Mercy card beside the person.</li>
                <li>Explain: at the cross, God did not ignore sin, and He did not leave sinners without hope.</li>
                <li>Place the paper heart near both cards and say, “The cross shows God’s justice and mercy together.”</li>
              </ol>
              <p style={{ ...bodyStyle, marginBottom: 0 }}><strong>Challenge:</strong> Explain Sin, Substitute, Justice, Mercy, and Peace with God in one sentence each.</p>
            </div>
            <figure style={{ margin: 0 }}>
              <img src="/images/jr/lessons/case-for-christ-cross/justice-mercy-cards.png" alt="Blank activity cards for a justice and mercy lesson" style={imageStyle} />
              <figcaption style={captionStyle}>Activity words should be written or rendered by the teacher and page text.</figcaption>
            </figure>
          </div>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Разговор с родителем / учителем' : 'Parent / Teacher Talk'}</p>
          <h2 style={headingStyle}>{isRu ? 'Учите о кресте тепло и бережно' : 'Teach the cross with warmth and care'}</h2>
          <p style={bodyStyle}>
            This lesson handles one of the deepest truths in Christianity. Keep the tone warm, steady, and careful. Children do not need graphic descriptions of crucifixion to understand the gospel. They need clear categories: sin is real, God is holy, Jesus is righteous, Jesus willingly took the place of sinners, and forgiveness comes through trusting Him.
          </p>
          <ul style={{ ...bodyStyle, paddingLeft: 22 }}>
            <li><strong>Avoid this:</strong> making the cross sound like the Father was angry at Jesus as an unwilling victim. <strong>Better:</strong> the Father sent the Son, and Jesus willingly gave Himself in love.</li>
            <li><strong>Avoid this:</strong> using fear pressure with children. <strong>Better:</strong> the cross is serious because sin is serious, but the main invitation is to trust Jesus.</li>
          </ul>
          <h3 style={miniTitleStyle}>{isRu ? 'Вопросы для разговора' : 'Conversation Questions'}</h3>
          <ol style={{ ...bodyStyle, paddingLeft: 22 }}>
            {questions.map((question) => <li key={question}>{question}</li>)}
          </ol>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30, textAlign: 'center' }}>
          <p style={bodyStyle}>
            Father, thank You for loving sinners and sending Jesus to rescue us. Lord Jesus, thank You for willingly dying in the place of sinners and rising again. Help us understand that sin is serious, Your mercy is deep, and Your love is true. Give us humble hearts to repent, trust You, and follow You. In Jesus’ name, amen.
          </p>
          <Link href="/lessons" style={{ display: 'inline-block', marginTop: 16, fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#0d3a6a', textDecoration: 'none' }}>
            {text.back}
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

const anchorWrapStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10,
  marginTop: 20,
}

const anchorPillStyle = {
  display: 'inline-flex',
  padding: '9px 12px',
  borderRadius: 999,
  background: 'rgba(255,255,255,.15)',
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

const miniCardStyle = {
  background: '#fff',
  border: '1px solid rgba(13,58,106,.12)',
  borderRadius: 18,
  padding: 18,
}

const miniTitleStyle = {
  margin: '0 0 10px',
  color: '#0d3a6a',
  fontFamily: 'var(--font-nunito)',
  fontWeight: 950,
  fontSize: '1.16rem',
}

const wordCardStyle = {
  background: '#fff',
  border: '1px solid rgba(13,58,106,.12)',
  borderRadius: 16,
  padding: 14,
  fontFamily: 'var(--font-lora)',
  color: '#40506a',
}

const heroFigureStyle = {
  margin: 0,
  background: 'rgba(255,255,255,.12)',
  border: '1px solid rgba(255,255,255,.28)',
  borderRadius: 26,
  padding: 16,
}

const figurePanelStyle = {
  background: '#fff',
  border: '1px solid rgba(13,58,106,.12)',
  borderRadius: 22,
  padding: 16,
  boxShadow: '0 12px 32px rgba(13,58,106,.08)',
}

const imageStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: 18,
  display: 'block',
}

const captionStyle = {
  marginTop: 10,
  fontFamily: 'var(--font-nunito)',
  fontSize: '.9rem',
  lineHeight: 1.5,
  color: '#5d6472',
  fontWeight: 800,
}
