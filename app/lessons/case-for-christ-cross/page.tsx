'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

const anchors = ['Romans 5:6-11', '1 Peter 3:18', 'Isaiah 53:5-6']
const anchorsRu = ['Римлянам 5:6–11', '1-е Петра 3:18', 'Исаия 53:5–6']

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

const teachingTrailRu = [
  { title: '1. Грех серьёзен, а не мал', body: 'Грех — это не только ошибка. Грех — это выбор против Бога в мыслях, словах, делах или желаниях. Бог свят, поэтому Он не делает вид, что зло безвредно.', picture: 'Понятный пример: если кто-то разбил окно, извиниться важно, но разбитое окно всё равно нужно исправить. Грех разрушает общение с Богом и вредит людям, созданным по Его образу.' },
  { title: '2. Божья справедливость и милость встречаются на кресте', body: 'Справедливость означает, что Бог поступает правильно. Милость означает, что Бог проявляет доброту к тем, кто заслуживает суда. На кресте Бог не сделал вид, что грех мал, и не оставил грешников без надежды.', picture: 'Крест говорит: «Грех хуже, чем мы думали, а Божья любовь глубже, чем мы могли представить».' },
  { title: '3. Иисус — совершенный Заместитель', body: 'Заместитель становится на место другого. Мы не могли оплатить свой грех тем, что потом будем очень хорошими. Иисус никогда не грешил, совершенно повиновался Отцу и добровольно занял место грешников, чтобы привести их к Богу.', picture: 'Отец послал Сына, и Сын послушался Отца. Крест показывает единый Божий план спасения.' },
  { title: '4. Крест показывает любовь, а не давление страхом', body: 'Детям не нужны подробности насилия, чтобы понять спасение. Библия говорит, что Иисус страдал и умер, и этого достаточно серьёзно. Главная мысль не «испугайся сильнее», а «посмотри, как Бог любит грешников; доверься Иисусу».', picture: 'Христиане любят Иисуса, потому что Он прежде возлюбил нас.' },
  { title: '5. Иисус умер, чтобы привести нас к Богу', body: 'Прощение — это не только избежать наказания. Прощение возвращает нас в отношения с Богом. Бог принимает кающихся грешников через Христа.', picture: 'Покаяние означает отвернуться от греха и повернуться к Богу. Вера означает доверять Иисусу, а не пытаться спасти себя.' },
  { title: '6. Воскресение доказывает, что крест не был поражением', body: 'Иисус не остался мёртвым. Воскресение показывает, что Иисус действительно победил. Бог принял жертву Иисуса, смерть побеждена, и Иисус жив как Господь.', picture: 'Христианская весть не такая: «Старайся сильнее, и, может быть, Бог тебя примет». Она такая: «Иисус сделал то, чего грешники никогда не могли сделать. Приди к Нему с доверием».' },
]

const bibleAnchorsRu = [
  { ref: 'Римлянам 5:6–11', summary: 'Павел учит, что Христос умер за нас, когда мы ещё были немощными и грешными. Бог показал Свою любовь, послав Иисуса умереть за грешников, и верующие оправданы и примирены с Богом через Него.', helps: 'Крест — это любовь в действии. Бог возлюбил грешников достаточно сильно, чтобы спасти их не потому, что они заслужили это, а потому что Он благ.' },
  { ref: '1-е Петра 3:18', summary: 'Пётр учит, что Христос однажды пострадал за грехи: Праведник за неправедных, чтобы привести нас к Богу.', helps: 'Иисус занял наше место, чтобы привести нас домой к Богу. Крест — это замещение: один становится на место другого.' },
  { ref: 'Исаия 53:5–6', summary: 'Исаия заранее смотрел на страдающего Раба. Христиане понимают этот отрывок как указание на Иисуса и Его спасительный труд на кресте.', helps: 'Крест не был неожиданной концовкой. Бог обещал, что Его Раб будет страдать, чтобы спасти Свой народ.' },
]

const hardWordsRu = [
  ['Грех', 'Выбор против Бога в мыслях, словах, делах или желаниях.'],
  ['Святой', 'Совершенно добрый, чистый и отделённый от греха. Бог свят.'],
  ['Справедливость', 'Поступать правильно и правильно разбираться со злом.'],
  ['Милость', 'Доброта Бога к людям, которые заслуживают суда.'],
  ['Благодать', 'Добрая милость Бога, которую мы не зарабатываем.'],
  ['Заместитель', 'Тот, кто становится на место другого.'],
  ['Праведный', 'Совершенно правый перед Богом. Иисус праведен; грешники сами по себе не праведны.'],
  ['Оправданный', 'Объявленный правым перед Богом благодаря тому, что сделал Иисус, а не потому, что мы это заслужили.'],
  ['Жертва', 'Дорогой дар Богу. Иисус отдал Себя, чтобы спасти грешников; это не значит, что кто-то заплатил деньги.'],
  ['Мир с Богом', 'Переход от вины и разделения к восстановленным отношениям с Богом через Иисуса.'],
  ['Покаяние', 'Отвернуться от греха и повернуться к Богу.'],
  ['Вера', 'Доверие Богу, потому что Он истинен и достоин доверия.'],
]

const questionsRu = [
  'Чем ошибка отличается от греха?',
  'Почему было бы неправильно, если бы Бог сделал вид, что грех не важен?',
  'Что значит, что Иисус — наш Заместитель?',
  'Как крест показывает Божью любовь?',
  'Что 1-е Петра 3:18 говорит о том, ради чего Иисус пришёл к грешникам?',
  'Как крест и воскресение связаны друг с другом?',
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
  const anchorList = isRu ? bibleAnchorsRu : bibleAnchors
  const trailList = isRu ? teachingTrailRu : teachingTrail
  const hardWordList = isRu ? hardWordsRu : hardWords
  const questionList = isRu ? questionsRu : questions
  const heroAnchors = isRu ? anchorsRu : anchors

  return (
    <main style={{ background: '#fff8e8', color: '#203047' }}>
      <section style={{ background: 'linear-gradient(135deg,#4a1230,#0d3a6a)', padding: '46px 18px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28, alignItems: 'center' }}>
          <div>
            <p style={{ ...eyebrowLight, letterSpacing: isRu ? 0.5 : 1.4, textTransform: isRu ? 'none' : 'uppercase' }}>{isRu ? 'Дело о Христе для детей · Урок 5' : 'Case for Christ Kids · Lesson 5'}</p>
            <h1 style={{ margin: '0 0 14px', color: 'white', fontFamily: isRu ? 'var(--font-nunito)' : 'var(--font-cinzel)', fontSize: isRu ? 'clamp(2rem,7vw,3rem)' : 'clamp(2rem,5vw,3.4rem)', lineHeight: isRu ? 1.12 : 1.05, letterSpacing: isRu ? '-0.03em' : 0 }}>
              {text.title}
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,.94)', fontFamily: isRu ? 'var(--font-nunito)' : 'var(--font-lora)', fontSize: isRu ? 'clamp(1rem,3vw,1.08rem)' : '1.12rem', lineHeight: isRu ? 1.55 : 1.75 }}>
              {text.intro}
            </p>
            <div style={anchorWrapStyle}>{heroAnchors.map((anchor) => <span key={anchor} style={anchorPillStyle}>{anchor}</span>)}</div>
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
            {anchorList.map((anchor) => (
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
          <figcaption style={captionStyle}>{isRu ? 'Библия учит спасительной вести словами; подписи урока показаны в тексте страницы, а не внутри изображения.' : 'The Bible teaches the saving message in words; lesson labels are shown in the page text, not in the image.'}</figcaption>
        </figure>

        <div style={{ marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'След доказательств / урока' : 'Evidence / Teaching Trail'}</p>
          <h2 style={headingStyle}>{isRu ? 'Шесть шагов через крест и воскресение' : 'Six steps through the cross and resurrection'}</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {trailList.map((step) => (
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
            {hardWordList.map(([word, meaning]) => (
              <div key={word} style={wordCardStyle}>
                <strong style={{ color: '#0d3a6a' }}>{word}</strong>
                <p style={{ margin: '6px 0 0', lineHeight: 1.55 }}>{meaning}</p>
              </div>
            ))}
          </div>
        </div>

        <figure style={{ ...figurePanelStyle, marginTop: 30 }}>
          <img src="/images/jr/lessons/case-for-christ-cross/artifact-reconstruction.png" alt="Child-safe reconstruction of first-century Roman crucifixion context with distant symbolic crosses" style={imageStyle} />
          <figcaption style={captionStyle}>{isRu ? 'Оригинальная безопасная для детей реконструкция исторического контекста римского распятия первого века; это не фотография и не подробное изображение страдания. Исторический контекст только помогает; спасительную весть даёт Писание.' : 'Original child-safe reconstruction of first-century Roman crucifixion context; not a photograph and not a graphic depiction. Historical context only; Scripture supplies the saving message.'}</figcaption>
        </figure>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Честный вопрос' : 'Honest Question'}</p>
          <h2 style={headingStyle}>{isRu ? 'Если Бог любит людей, почему Он не мог просто простить грех без смерти Иисуса?' : 'If God loves people, why could He not just forgive sin without Jesus dying?'}</h2>
          <p style={bodyStyle}>
            {isRu ? 'Божья любовь не притворная, и Божья справедливость не притворная. Если бы Бог игнорировал грех, Он не относился бы ко злу как ко злу. Но если бы Бог дал грешникам только тот суд, которого они заслуживают, у нас не было бы надежды.' : 'God’s love is not pretend love, and God’s justice is not pretend justice. If God ignored sin, He would not be treating evil as evil. But if God only gave sinners the judgment they deserved, we would have no hope.'}
          </p>
          <p style={bodyStyle}>
            {isRu ? 'На кресте Бог открыл путь прощения для грешников, не притворяясь, что грех мал. Иисус, Который никогда не грешил, занял место грешников. Он понёс наказание, которое заслужили мы, чтобы мы получили милость, которую не заслужили.' : 'At the cross, God made a way to forgive sinners without pretending sin is small. Jesus, who never sinned, took the place of sinners. He carried the punishment we deserved so we could receive mercy we did not deserve.'}
          </p>
          <p style={{ ...bodyStyle, marginBottom: 0, fontWeight: 800 }}>
            {isRu ? 'Поэтому крест показывает две истины сразу: Бог святее, чем мы часто понимаем, и Бог любит глубже, чем мы могли бы заслужить.' : 'So the cross shows both truths at once: God is more holy than we often realize, and God is more loving than we could ever earn.'}
          </p>
        </div>

        <div style={{ ...panelStyle('#eef7ff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Интерактивное задание' : 'Interactive Activity'}</p>
          <h2 style={headingStyle}>{isRu ? 'Две карточки: справедливость и милость' : 'The Two Cards: Justice and Mercy'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, alignItems: 'center' }}>
            <div>
              <p style={bodyStyle}><strong>{isRu ? 'Нужно:' : 'Supplies:'}</strong> {isRu ? 'две карточки, маркер, маленькая фигурка или бумажный человечек и маленькое бумажное сердце.' : 'two index cards, a marker, a small toy figure or paper person, and a small paper heart.'}</p>
              <ol style={{ ...bodyStyle, paddingLeft: 22 }}>
                {isRu ? (
                  <>
                    <li>Напишите <strong>Справедливость</strong> на одной карточке и <strong>Милость</strong> на другой.</li>
                    <li>Спросите, можно ли просто игнорировать зло. Положите карточку «Справедливость» рядом с фигуркой человека.</li>
                    <li>Спросите, какая надежда была бы у грешников без милости. Положите карточку «Милость» рядом с фигуркой человека.</li>
                    <li>Объясните: на кресте Бог не проигнорировал грех и не оставил грешников без надежды.</li>
                    <li>Положите бумажное сердце рядом с обеими карточками и скажите: «Крест показывает Божью справедливость и милость вместе».</li>
                  </>
                ) : (
                  <>
                    <li>Write <strong>Justice</strong> on one card and <strong>Mercy</strong> on the other.</li>
                    <li>Ask whether wrong should be ignored. Place the Justice card beside the person.</li>
                    <li>Ask what hope sinners would have without mercy. Place the Mercy card beside the person.</li>
                    <li>Explain: at the cross, God did not ignore sin, and He did not leave sinners without hope.</li>
                    <li>Place the paper heart near both cards and say, “The cross shows God’s justice and mercy together.”</li>
                  </>
                )}
              </ol>
              <p style={{ ...bodyStyle, marginBottom: 0 }}><strong>{isRu ? 'Задание:' : 'Challenge:'}</strong> {isRu ? 'Объясни слова «грех», «Заместитель», «справедливость», «милость» и «мир с Богом» одним предложением каждое.' : 'Explain Sin, Substitute, Justice, Mercy, and Peace with God in one sentence each.'}</p>
            </div>
            <figure style={{ margin: 0 }}>
              <img src="/images/jr/lessons/case-for-christ-cross/justice-mercy-cards.png" alt={isRu ? 'Пустые карточки для урока о справедливости и милости' : 'Blank activity cards for a justice and mercy lesson'} style={imageStyle} />
              <figcaption style={captionStyle}>{isRu ? 'Слова для задания учитель пишет на карточках сам; страница даёт текст отдельно.' : 'Activity words should be written or rendered by the teacher and page text.'}</figcaption>
            </figure>
          </div>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30 }}>
          <p className="eyebrow">{isRu ? 'Разговор с родителем / учителем' : 'Parent / Teacher Talk'}</p>
          <h2 style={headingStyle}>{isRu ? 'Учите о кресте тепло и бережно' : 'Teach the cross with warmth and care'}</h2>
          <p style={bodyStyle}>
            {isRu
              ? 'Этот урок касается одной из самых глубоких истин христианской веры. Держите тон тёплым, спокойным и бережным. Детям не нужны подробные описания распятия, чтобы понять Евангелие. Им нужны ясные категории: грех реален, Бог свят, Иисус праведен, Иисус добровольно занял место грешников, и прощение приходит через доверие Ему.'
              : 'This lesson handles one of the deepest truths in Christianity. Keep the tone warm, steady, and careful. Children do not need graphic descriptions of crucifixion to understand the gospel. They need clear categories: sin is real, God is holy, Jesus is righteous, Jesus willingly took the place of sinners, and forgiveness comes through trusting Him.'}
          </p>
          <ul style={{ ...bodyStyle, paddingLeft: 22 }}>
            <li><strong>{isRu ? 'Избегайте этого:' : 'Avoid this:'}</strong> {isRu ? 'не говорите о кресте так, будто Отец разгневался на Иисуса как на жертву против Его воли.' : 'making the cross sound like the Father was angry at Jesus as an unwilling victim.'} <strong>{isRu ? 'Лучше:' : 'Better:'}</strong> {isRu ? 'Отец послал Сына, и Иисус добровольно отдал Себя в любви.' : 'the Father sent the Son, and Jesus willingly gave Himself in love.'}</li>
            <li><strong>{isRu ? 'Избегайте этого:' : 'Avoid this:'}</strong> {isRu ? 'не давите на детей страхом.' : 'using fear pressure with children.'} <strong>{isRu ? 'Лучше:' : 'Better:'}</strong> {isRu ? 'крест серьёзен, потому что грех серьёзен, но главный призыв — довериться Иисусу.' : 'the cross is serious because sin is serious, but the main invitation is to trust Jesus.'}</li>
          </ul>
          <h3 style={miniTitleStyle}>{isRu ? 'Вопросы для разговора' : 'Conversation Questions'}</h3>
          <ol style={{ ...bodyStyle, paddingLeft: 22 }}>
            {questionList.map((question) => <li key={question}>{question}</li>)}
          </ol>
        </div>

        <div style={{ ...panelStyle('#ffffff'), marginTop: 30, textAlign: 'center' }}>
          <p style={bodyStyle}>
            {isRu
              ? 'Отец, спасибо, что Ты любишь грешников и послал Иисуса спасти нас. Господь Иисус, спасибо, что Ты добровольно умер вместо грешников и воскрес. Помоги нам понять, что грех серьёзен, Твоя милость глубока, и Твоя любовь истинна. Дай нам смиренные сердца, чтобы каяться, доверять Тебе и следовать за Тобой. Во имя Иисуса, аминь.'
              : 'Father, thank You for loving sinners and sending Jesus to rescue us. Lord Jesus, thank You for willingly dying in the place of sinners and rising again. Help us understand that sin is serious, Your mercy is deep, and Your love is true. Give us humble hearts to repent, trust You, and follow You. In Jesus’ name, amen.'}
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
