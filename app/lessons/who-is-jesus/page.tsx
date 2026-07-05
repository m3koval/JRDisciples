'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { generateWordSearchWithCoords } from '@/lib/wordSearch'

// ─── Types ────────────────────────────────────────────────────────────────────
type Tile = { uid: string; word: string }

// ─── Section unlock requirements ─────────────────────────────────────────────
const SECTION_REQS: Record<number, string[]> = {
  1: ['lic'],
  2: ['match'],
  3: ['ws'],
  4: ['tf'],
  5: ['scramble'],
}

// ─── LLL card data ────────────────────────────────────────────────────────────
const LLL_EN = [
  { id:'liar',    icon:'🤥', frontTitle:'LIAR',    frontBody:"He knew He wasn't God, but He lied to control people.",                    backTitle:'❌ Not a liar...',          backBody:"Liars don't die for their own lies. His disciples spent years with Him and never caught a single deception. His moral teaching is so perfect the world still hasn't improved on it 2,000 years later.", backOk:false },
  { id:'lunatic', icon:'🤪', frontTitle:'LUNATIC', frontBody:"He truly believed He was God, but He was mentally ill.",                   backTitle:'❌ Not a lunatic...',        backBody:"His arguments were brilliant, calm, and unshakeable under pressure. Doctors and historians — even His enemies — describe Him as remarkably wise. A deranged person couldn't have taught the Sermon on the Mount.", backOk:false },
  { id:'lord',    icon:'👑', frontTitle:'LORD',    frontBody:"He really IS who He claimed to be — the Son of God.",                    backTitle:'✅ This is the only answer!', backBody:"Every alternative has been ruled out. He fulfilled hundreds of ancient prophecies, performed documented miracles, loved perfectly, and walked out of His own tomb. The evidence leads here.", backOk:true  },
]
const LLL_RU = [
  { id:'liar',    icon:'🤥', frontTitle:'ЛЖЕЦ',    frontBody:"Он знал, что Он не Бог, но лгал, чтобы управлять людьми.",                backTitle:'❌ Нет, не лжец...',         backBody:"Лжецы не умирают за собственную ложь. Его ученики провели с Ним годы и не поймали ни одного обмана. Его нравственное учение настолько совершенно, что мир за 2000 лет так и не смог его улучшить.", backOk:false },
  { id:'lunatic', icon:'🤪', frontTitle:'БЕЗУМЕЦ', frontBody:"Он действительно верил, что Он Бог, но был просто сумасшедшим.",          backTitle:'❌ Нет, не безумец...',      backBody:"Его слова были блестящими, спокойными и несокрушимыми. Даже Его враги называли Его исключительно мудрым. Безумный человек не смог бы произнести Нагорную проповедь.", backOk:false },
  { id:'lord',    icon:'👑', frontTitle:'ГОСПОДЬ', frontBody:"Он действительно тот, кем Себя называл — Сын Бога.",                    backTitle:'✅ Это единственный ответ!',  backBody:"Все альтернативы исключены. Он исполнил сотни пророчеств, совершил задокументированные чудеса, любил совершенно и вышел из собственной гробницы. Все свидетельства ведут сюда.", backOk:true  },
]

// ─── Match data ───────────────────────────────────────────────────────────────
const MATCH_LEFT_EN = [
  { id:'bethlehem', text:'"Born in Bethlehem"',            ref:'Micah 5:2 — written 700 yrs before Jesus' },
  { id:'virgin',    text:'"Born of a virgin"',             ref:'Isaiah 7:14 — written 700 yrs before Jesus' },
  { id:'silver',    text:'"Betrayed for 30 silver coins"', ref:'Zechariah 11:12 — written 500 yrs before' },
  { id:'pierced',   text:'"Hands and feet pierced"',       ref:'Psalm 22:16 — written 1,000 yrs before' },
]
const MATCH_RIGHT_EN = [
  { id:'pierced',   text:'Jesus was crucified — nails through hands and feet' },
  { id:'bethlehem', text:'Jesus was born in Bethlehem of Judea' },
  { id:'silver',    text:'Judas betrayed Jesus for exactly 30 silver coins' },
  { id:'virgin',    text:'Mary was a virgin when Jesus was born' },
]
const MATCH_LEFT_RU = [
  { id:'bethlehem', text:'"Рождён в Вифлееме"',            ref:'Мих. 5:2 — написано за 700 лет до Иисуса' },
  { id:'virgin',    text:'"Рождён от девы"',               ref:'Ис. 7:14 — написано за 700 лет до Иисуса' },
  { id:'silver',    text:'"Предан за 30 сребреников"',     ref:'Зах. 11:12 — написано за 500 лет' },
  { id:'pierced',   text:'"Пронзены руки и ноги"',         ref:'Пс. 22:16 — написано за 1000 лет' },
]
const MATCH_RIGHT_RU = [
  { id:'pierced',   text:'Иисус был распят — гвозди через руки и ноги' },
  { id:'bethlehem', text:'Иисус родился в Вифлееме Иудейском' },
  { id:'silver',    text:'Иуда предал Иисуса ровно за 30 монет' },
  { id:'virgin',    text:'Мария была девственницей при рождении Иисуса' },
]

// ─── True/False data ──────────────────────────────────────────────────────────
const TF_EN = [
  { id:'tf1', text:"Roman soldiers were not aware that Jesus had been placed in a tomb.", correct:false, explain:"The Romans sealed the tomb AND posted professional guards outside — they were very aware, and tried to prevent any resurrection claim." },
  { id:'tf2', text:"Over 500 people saw Jesus alive after His resurrection.", correct:true,  explain:"Paul wrote this in 1 Corinthians 15:6 — and noted most witnesses were still alive when he wrote it, meaning readers could go verify it!" },
  { id:'tf3', text:"The disciples were bold and brave on the day Jesus died.", correct:false, explain:"They were terrified and hiding behind locked doors (John 20:19). Seeing the risen Jesus is what transformed them into fearless missionaries." },
  { id:'tf4', text:"Jesus's enemies could never produce His body to stop Christianity.", correct:true,  explain:"If there was a body, they would have shown it immediately — it would have ended everything. The tomb stayed empty and no one could explain it away." },
  { id:'tf5', text:"Most of the disciples changed their story when threatened with death.", correct:false, explain:"Nearly all were executed for refusing to deny the resurrection. People lie to save their lives — but they don't die for what they know is a lie." },
]
const TF_RU = [
  { id:'tf1', text:"Римские солдаты не знали, что Иисуса положили в гробницу.", correct:false, explain:"Римляне запечатали гробницу И выставили профессиональных стражников — они прекрасно знали об этом и пытались предотвратить любые заявления о воскресении." },
  { id:'tf2', text:"Более 500 человек видели Иисуса живым после воскресения.", correct:true,  explain:"Павел написал об этом в 1 Кор. 15:6 и отметил, что большинство свидетелей ещё живы — читатели могли лично проверить это!" },
  { id:'tf3', text:"Ученики были смелыми и дерзкими в день смерти Иисуса.", correct:false, explain:"Они прятались в страхе за запертыми дверями (Ин. 20:19). Именно встреча с воскресшим Иисусом превратила их в бесстрашных миссионеров." },
  { id:'tf4', text:"Враги Иисуса так и не смогли предъявить Его тело, чтобы остановить христианство.", correct:true,  explain:"Если бы тело было, они бы немедленно его показали — это прекратило бы всё. Гробница оставалась пустой, и никто не мог этого объяснить." },
  { id:'tf5', text:"Большинство учеников отреклись от своих слов, когда им угрожала смерть.", correct:false, explain:"Почти все они были казнены, отказавшись отрицать воскресение. Люди лгут, чтобы спасти жизнь — но не умирают за то, что сами знают как ложь." },
]

// ─── Scramble tiles ───────────────────────────────────────────────────────────
// EN tiles shuffled (not in answer order)
const SC_TILES_EN: Tile[] = [
  {uid:'sc_3',word:'way,'},{uid:'sc_0',word:'I'},{uid:'sc_6',word:'and'},
  {uid:'sc_1',word:'am'},{uid:'sc_4',word:'the'},{uid:'sc_7',word:'the'},
  {uid:'sc_2',word:'the'},{uid:'sc_5',word:'truth,'},{uid:'sc_8',word:'life.'},
]
const SC_ANS_EN = ['i','am','the','way,','the','truth,','and','the','life.']

// RU tiles shuffled
const SC_TILES_RU: Tile[] = [
  {uid:'sc_3',word:'истина'},{uid:'sc_0',word:'Я'},{uid:'sc_5',word:'жизнь.'},
  {uid:'sc_1',word:'есмь'},{uid:'sc_4',word:'и'},{uid:'sc_2',word:'путь'},
  {uid:'sc_6',word:'и'},
]
const SC_ANS_RU = ['я','есмь','путь','и','истина','и','жизнь.']

// ─── Content objects ──────────────────────────────────────────────────────────
const EN = {
  hero: {
    title:'Who Is Jesus?',
    subtitle:'The most important question ever asked',
    quote:'"But what about you — who do you say I am?"',
    quoteRef:'Matthew 16:15 — Jesus asking His disciples',
  },
  progress: '📖 PROGRESS',
  s1: {
    banner:'✝️ SECTION 1 · THE CLAIMS OF JESUS ✝️',
    eyebrow:'Who Did He Say He Was?',
    title:'He Said Things No One Else Dared Say',
    intro:"Most great teachers say 'Follow my teachings.' But Jesus made claims so specific and enormous that you cannot call Him 'just a good teacher' and walk away. A good teacher doesn't claim to BE God.",
    claims: [
      { quote:'"I am the way, the truth, and the life."', ref:'John 14:6' },
      { quote:'"I and the Father are one."',              ref:'John 10:30' },
      { quote:'"Before Abraham was born, I AM."',         ref:'John 8:58' },
    ],
    iamNote:'💡 "I AM" is the sacred name God gave Himself when speaking to Moses from the burning bush (Exodus 3:14). When Jesus said it, everyone understood what He was claiming.',
    lllTitle:'🕵️ Three Possibilities — Only One Fits',
    lllIntro:"C.S. Lewis, a famous author and former atheist, pointed out: if Jesus made these claims about being God, only three explanations are possible. Tap each card to examine the evidence.",
    lllInstruction:'Tap each card to flip it and see the evidence 👇',
    lllAllFlipped:"🎯 You've examined all three! Only one conclusion remains...",
    lllTruth:'👑 Jesus is LORD — exactly who He said He was!',
    lllVerse:"\"You are the Christ, the Son of the living God.\" — Peter's answer, Matthew 16:16",
    unlock:'🎉 Section 1 complete! Section 2 unlocked — scroll down!',
  },
  s2: {
    banner:'📜 SECTION 2 · WRITTEN IN ADVANCE 📜',
    eyebrow:'Prophecies Fulfilled',
    title:'History Written Hundreds of Years Early',
    intro:'The Old Testament — written centuries before Jesus was born — contains over 300 specific predictions about the coming Messiah. Every single one was fulfilled in Jesus. Here are four of the most striking.',
    matchTitle:'🔗 Match the Prophecy to Its Fulfillment',
    matchIntro:'Tap a PROPHECY (left), then tap the FULFILLMENT (right) that matches it. Get all 4!',
    matchCount:'Matched:',
    matchDone:'🌟 All 4 prophecies matched!',
    matchVerse:'"All this took place to fulfill what the Lord had spoken by the prophet." — Matthew 1:22',
    oddsNote:"🤯 Mathematicians calculated the odds of just 8 prophecies being fulfilled by accident: 1 in 100,000,000,000,000,000. That's not coincidence — that's God writing history in advance.",
    unlock:'🎉 Section 2 complete! Section 3 unlocked — scroll down!',
  },
  s3: {
    banner:'✨ SECTION 3 · MIRACLES ✨',
    eyebrow:'He Did What Only God Can Do',
    title:'He Acted With the Power of God',
    intro:"Jesus didn't just make claims — He backed them up with actions nobody could explain away. His enemies never denied the miracles happened. They just argued about where His power came from.",
    miracles: [
      { icon:'👁️', title:'Healed the Blind',    body:'A man born blind — physically impossible to heal, yet Jesus opened his eyes with mud. The religious leaders had no answer.',                     ref:'John 9' },
      { icon:'⛈️', title:'Calmed a Storm',       body:'The disciples panicked as waves swamped the boat. Jesus simply spoke to the wind and waves — and they instantly obeyed.',                      ref:'Mark 4' },
      { icon:'🍞', title:'Fed 5,000',             body:'Five loaves and two fish fed over 5,000 people — with twelve baskets of leftovers. Thousands of witnesses, no natural explanation.',         ref:'John 6' },
      { icon:'🌊', title:'Walked on Water',       body:'Peter got out of the boat and walked toward Jesus — until he looked away. Jesus walked on the surface of the sea as on dry ground.',           ref:'Matt 14' },
      { icon:'🪦', title:'Raised Lazarus',        body:"Four days dead, already buried. Jesus commanded 'Lazarus, come out!' — and he walked out in his grave clothes. Death obeyed His voice.",      ref:'John 11' },
      { icon:'🙌', title:'Fully Human Too',       body:'100% God AND 100% human (John 1:14). He got tired (John 4:6), hungry, sad. He understands everything you face — from the inside.',            ref:'John 1:14' },
    ],
    wsLabel:'🔍 Word Search: Names of Jesus',
    wsQ:'Find all 8 names and titles of Jesus hidden in the grid — words run in all 8 directions, even diagonally and backwards!',
    wsClear:'↩ Clear Selection',
    wsHint:'💡 Tap letters to select. Words hide in all 8 directions including diagonally!',
    wsDone:'🎉 You found all 8 names of Jesus!',
    wsVerse:'"His name is called the Word of God." — Revelation 19:13',
    unlock:'🎉 Section 3 complete! Section 4 unlocked — scroll down!',
  },
  s4: {
    banner:'🌅 SECTION 4 · THE RESURRECTION 🌅',
    eyebrow:"Death Didn't Win",
    title:'He Walked Out of Death',
    intro:"Every person who has ever lived faces one enemy nobody beats: death. Jesus died on a cross — confirmed by Roman soldiers, professionals at execution. His body was sealed in a tomb with guards posted outside. Three days later, the tomb was empty.",
    evidence: [
      { icon:'🔒', title:'The Sealed Tomb',       body:"The tomb was sealed with a 1–2 ton stone and a Roman seal. Breaking it was a capital offence. Guards were posted to stop any theft of the body. Yet the stone was rolled away.",  color:'#8a1a30' },
      { icon:'👥', title:'500+ Witnesses',         body:"Paul writes in 1 Cor 15:6 that Jesus appeared to more than 500 people — most of them still alive when he wrote. Anyone could interview the eyewitnesses.",                       color:'#1a4a8a' },
      { icon:'⚡', title:'The Transformation',    body:"These same disciples who hid behind locked doors on Friday were publicly preaching the resurrection six weeks later — willing to die for it. What changed? They saw Him alive.", color:'#1a6a30' },
      { icon:'📭', title:'The Empty Tomb',         body:"If the body was in the tomb, the authorities would have produced it immediately and ended Christianity in one afternoon. They never did. Because it wasn't there.",             color:'#7a4f00' },
    ],
    tfLabel:'✅ TRUE or FALSE? You be the detective!',
    tfIntro:'Tap TRUE or FALSE for each statement — then see the real evidence.',
    tfTrue:'TRUE', tfFalse:'FALSE',
    tfCount:'Answered:',
    tfDone:'🎉 All 5 examined — outstanding detective work!',
    tfVerse:'"He is not here; he has risen, just as he said." — Matthew 28:6',
    unlock:'🎉 Section 4 complete! Section 5 unlocked — scroll down!',
  },
  s5: {
    banner:'❤️ SECTION 5 · THE GOSPEL ❤️',
    eyebrow:'Why It Changes Everything for You',
    title:'The Verdict and Your Response',
    intro:"The evidence is in. Jesus is exactly who He claimed to be: the Son of God, fully human, fully divine, who came to earth on a rescue mission.",
    gospel: [
      { icon:'💔', title:'The Problem',   body:'Every person has sinned — fallen short of God\'s perfect standard. Sin separates us from God, who is perfectly holy.',                                                      ref:'Romans 3:23', color:'#8a1a30' },
      { icon:'⚖️', title:'The Penalty',   body:'The wages of sin is death — not just physical death, but eternal separation from God. This is justice: a holy God cannot overlook sin.',                                ref:'Romans 6:23a', color:'#7a4f00' },
      { icon:'🎁', title:'The Solution',  body:'But the gift of God is eternal life through Jesus Christ our Lord. Jesus took the penalty — died in our place — so we don\'t have to.',                                  ref:'Romans 6:23b', color:'#1a6a30' },
      { icon:'✅', title:'The Proof',     body:'The resurrection is God\'s receipt — proof that the payment was accepted. Jesus is alive, the debt is paid, and the door to God is wide open.',                           ref:'Romans 4:25',  color:'#1a4a8a' },
    ],
    scLabel:'📖 Memory Verse — John 14:6',
    scQ:'Arrange the tiles to complete what Jesus said. Tap to place, tap again to remove.',
    scHint:'"I am the ___, the ___, and the ___." — John 14:6',
    scCheck:'CHECK ✓',
    scDone:'🌟 "I am the way, the truth, and the life." — John 14:6',
    scErr:'❌ Not quite — keep trying!',
    questionTitle:'The Question That Changes Everything',
    question:'"But what about you — who do you say I am?"',
    questionRef:'— Matthew 16:15, Jesus to His disciples',
    invitation:"You've seen the evidence. Jesus isn't just a legend or a good teacher. He is the Son of God who died for you — with your name in mind — and rose again. Knowing about Jesus and actually knowing Jesus are two completely different things. One is information. The other changes everything. Have you ever personally said yes to Him? If you want to, you can talk to Him right now, in your own words. He's not far away. He's listening.",
    prayerTitle:'💬 A simple prayer:',
    prayer:'"Jesus, I believe You are the Son of God. I believe You died for my sins and rose again. Please forgive me and come into my life. I want to know You — not just know about You. Amen."',
    trophy:'👑 CASE CLOSED: JESUS IS LORD',
    trophyBody:"You've completed the \"Who Is Jesus?\" lesson! You are now equipped with evidence that will stay with you for life.",
    back:'← Back to Lessons',
  },
  lockMsg: (prev: number) => `Complete Section ${prev} to unlock this part!`,
  resetBtn:'↺ Reset My Progress',
  resetConfirm:'Reset all progress for this lesson?',
}

const RU = {
  hero: {
    title:'Кто такой Иисус?',
    subtitle:'Самый важный вопрос, который когда-либо задавали',
    quote:'«Вы же за кого почитаете Меня?»',
    quoteRef:'Матфей 16:15 — Иисус спрашивает Своих учеников',
  },
  progress: '📖 ПРОГРЕСС',
  s1: {
    banner:'✝️ РАЗДЕЛ 1 · ЗАЯВЛЕНИЯ ИИСУСА ✝️',
    eyebrow:'Что Он говорил о Себе?',
    title:'Он говорил то, чего никто другой не осмеливался',
    intro:"Большинство великих учителей говорят: «Следуй моим учениям». Но Иисус делал заявления настолько конкретные и грандиозные, что нельзя назвать Его «просто хорошим учителем» и уйти. Хороший учитель не утверждает, что он БОГ.",
    claims: [
      { quote:'«Я есмь путь и истина и жизнь.»',        ref:'Ин. 14:6' },
      { quote:'«Я и Отец — одно.»',                      ref:'Ин. 10:30' },
      { quote:'«Прежде нежели был Авраам, Я есмь.»',    ref:'Ин. 8:58' },
    ],
    iamNote:'💡 «Я ЕСМЬ» — это священное имя, которое Бог дал Себе, говоря с Моисеем у горящего куста (Исх. 3:14). Когда Иисус произнёс его, все поняли, что Он имел в виду.',
    lllTitle:'🕵️ Три варианта — и только один подходит',
    lllIntro:"К.С. Льюис, известный писатель и бывший атеист, указал: если Иисус делал эти заявления о том, что Он Бог, возможны только три объяснения. Нажми на каждую карточку, чтобы изучить доказательства.",
    lllInstruction:'Нажми на каждую карточку, чтобы перевернуть её и увидеть доказательства 👇',
    lllAllFlipped:"🎯 Ты изучил все три! Остаётся только один вывод...",
    lllTruth:'👑 Иисус — ГОСПОДЬ — именно тот, кем Себя называл!',
    lllVerse:"«Ты — Христос, Сын Бога Живого.» — ответ Петра, Матфей 16:16",
    unlock:'🎉 Раздел 1 завершён! Раздел 2 открыт — прокрути вниз!',
  },
  s2: {
    banner:'📜 РАЗДЕЛ 2 · НАПИСАНО ЗАРАНЕЕ 📜',
    eyebrow:'Исполненные пророчества',
    title:'История, написанная за сотни лет вперёд',
    intro:'Ветхий Завет — написанный за столетия до рождения Иисуса — содержит более 300 конкретных предсказаний о грядущем Мессии. Каждое из них исполнилось в Иисусе. Вот четыре самых поразительных.',
    matchTitle:'🔗 Сопоставь пророчество с его исполнением',
    matchIntro:'Нажми ПРОРОЧЕСТВО (слева), затем нажми ИСПОЛНЕНИЕ (справа), которое ему соответствует. Угадай все 4!',
    matchCount:'Совпало:',
    matchDone:'🌟 Все 4 пророчества сопоставлены!',
    matchVerse:'«Всё это произошло, да сбудется реченное Господом через пророка.» — Матфей 1:22',
    oddsNote:"🤯 Математики подсчитали вероятность случайного исполнения всего 8 пророчеств: 1 к 100 000 000 000 000 000. Это не совпадение — это Бог пишет историю заранее.",
    unlock:'🎉 Раздел 2 завершён! Раздел 3 открыт — прокрути вниз!',
  },
  s3: {
    banner:'✨ РАЗДЕЛ 3 · ЧУДЕСА ✨',
    eyebrow:'Он делал то, что может только Бог',
    title:'Он действовал с силой Бога',
    intro:"Иисус не просто делал заявления — Он подтверждал их действиями, которые никто не мог объяснить. Его враги никогда не отрицали, что чудеса происходили. Они просто спорили об источнике Его силы.",
    miracles: [
      { icon:'👁️', title:'Исцелил слепого',      body:'Человек, слепой от рождения — физически неизлечимый, — но Иисус открыл ему глаза с помощью грязи. Религиозные лидеры не нашли ответа.',           ref:'Ин. 9' },
      { icon:'⛈️', title:'Усмирил бурю',         body:'Ученики запаниковали, когда волны захлёстывали лодку. Иисус просто сказал ветру и волнам — и они мгновенно подчинились.',                          ref:'Мк. 4' },
      { icon:'🍞', title:'Накормил 5000',          body:'Пять хлебов и две рыбы насытили более 5000 человек — и осталось двенадцать корзин. Тысячи свидетелей, никакого естественного объяснения.',        ref:'Ин. 6' },
      { icon:'🌊', title:'Ходил по воде',          body:'Пётр вышел из лодки и пошёл к Иисусу — пока не отвёл взгляд. Иисус шёл по поверхности моря как по суше.',                                          ref:'Мф. 14' },
      { icon:'🪦', title:'Воскресил Лазаря',      body:'Четыре дня мёртвый, уже похороненный. Иисус сказал: «Лазарь, иди вон!» — и он вышел в погребальных пеленах. Смерть подчинилась Его голосу.',        ref:'Ин. 11' },
      { icon:'🙌', title:'Полностью Человек тоже', body:'100% Бог И 100% человек (Ин. 1:14). Он уставал (Ин. 4:6), голодал, скорбел. Он понимает всё, с чем ты сталкиваешься — изнутри.',                   ref:'Ин. 1:14' },
    ],
    wsLabel:'🔍 Поиск слов: Имена Иисуса',
    wsQ:'Найди все 8 имён и титулов Иисуса, спрятанных в сетке — слова идут во всех 8 направлениях, даже по диагонали и задом наперёд!',
    wsClear:'↩ Очистить выбор',
    wsHint:'💡 Нажимай буквы, чтобы выбрать. Слова спрятаны во всех 8 направлениях, включая диагональ!',
    wsDone:'🎉 Ты нашёл все 8 имён Иисуса!',
    wsVerse:'«Имя Ему: Слово Божие.» — Откровение 19:13',
    unlock:'🎉 Раздел 3 завершён! Раздел 4 открыт — прокрути вниз!',
  },
  s4: {
    banner:'🌅 РАЗДЕЛ 4 · ВОСКРЕСЕНИЕ 🌅',
    eyebrow:'Смерть не победила',
    title:'Он вышел из смерти',
    intro:"Каждый человек, когда-либо живший, сталкивается с одним врагом, которого никто не побеждает: смертью. Иисус умер на кресте — подтверждено римскими солдатами, профессионалами в казнях. Его тело было запечатано в гробнице с охраной снаружи. Три дня спустя гробница была пуста.",
    evidence: [
      { icon:'🔒', title:'Запечатанная гробница', body:"Гробница была запечатана камнем весом 1–2 тонны и римской печатью. Сломать её — значит подписать себе смертный приговор. У входа стояла стража. Тем не менее камень был отвален.",   color:'#8a1a30' },
      { icon:'👥', title:'500+ свидетелей',       body:"Павел пишет в 1 Кор. 15:6, что Иисус явился более чем 500 людям — большинство из них были живы, когда он писал. Любой мог опросить очевидцев.",                                color:'#1a4a8a' },
      { icon:'⚡', title:'Преображение',          body:"Те самые ученики, прятавшиеся за запертыми дверями в пятницу, уже через шесть недель открыто проповедовали воскресение — готовые умереть за это. Что изменилось? Они увидели Его живым.", color:'#1a6a30' },
      { icon:'📭', title:'Пустая гробница',       body:"Если бы тело было в гробнице, власти немедленно предъявили бы его и уничтожили христианство за одно послеполудни. Они этого не сделали. Потому что тела там не было.",           color:'#7a4f00' },
    ],
    tfLabel:'✅ ПРАВДА или ЛОЖЬ? Стань детективом!',
    tfIntro:'Нажми ПРАВДА или ЛОЖЬ для каждого утверждения — затем узнай настоящие факты.',
    tfTrue:'ПРАВДА', tfFalse:'ЛОЖЬ',
    tfCount:'Отвечено:',
    tfDone:'🎉 Все 5 изучены — отличная работа детектива!',
    tfVerse:'«Его нет здесь — Он воскрес, как и говорил.» — Матфей 28:6',
    unlock:'🎉 Раздел 4 завершён! Раздел 5 открыт — прокрути вниз!',
  },
  s5: {
    banner:'❤️ РАЗДЕЛ 5 · ЕВАНГЕЛИЕ ❤️',
    eyebrow:'Почему это меняет всё для тебя',
    title:'Вердикт и твой ответ',
    intro:"Доказательства собраны. Иисус именно тот, кем называл Себя: Сын Бога, полностью человек, полностью Бог, пришедший на землю с миссией спасения.",
    gospel: [
      { icon:'💔', title:'Проблема',    body:'Каждый человек согрешил — не достиг совершенного стандарта Бога. Грех отделяет нас от Бога, Который абсолютно свят.',                                                                        ref:'Рим. 3:23',  color:'#8a1a30' },
      { icon:'⚖️', title:'Наказание',  body:'Возмездие за грех — смерть: не только физическая, но вечное отделение от Бога. Это справедливость: святой Бог не может закрыть глаза на грех.',                                              ref:'Рим. 6:23а', color:'#7a4f00' },
      { icon:'🎁', title:'Решение',    body:'Но дар Бога — жизнь вечная во Христе Иисусе, Господе нашем. Иисус понёс наказание — умер вместо нас — чтобы нам не пришлось.',                                                                ref:'Рим. 6:23б', color:'#1a6a30' },
      { icon:'✅', title:'Доказательство', body:'Воскресение — это квитанция Бога: доказательство, что уплата принята. Иисус жив, долг погашен, и дверь к Богу широко открыта.',                                                           ref:'Рим. 4:25',  color:'#1a4a8a' },
    ],
    scLabel:'📖 Стих для запоминания — Ин. 14:6',
    scQ:'Расставь плитки, чтобы составить слова Иисуса. Нажми, чтобы поставить, нажми снова, чтобы убрать.',
    scHint:'«Я есмь ___, и ___, и ___.» — Ин. 14:6',
    scCheck:'ПРОВЕРИТЬ ✓',
    scDone:'🌟 «Я есмь путь и истина и жизнь.» — Ин. 14:6',
    scErr:'❌ Не совсем — продолжай пробовать!',
    questionTitle:'Вопрос, который меняет всё',
    question:'«Вы же за кого почитаете Меня?»',
    questionRef:'— Матфей 16:15, Иисус Своим ученикам',
    invitation:"Ты видел доказательства. Иисус — не просто легенда или хороший учитель. Он — Сын Бога, умерший за тебя — лично за тебя — и воскресший. Знать об Иисусе и знать Иисуса лично — это разные вещи. Одно — информация. Другое — меняет всё. Ты когда-нибудь лично говорил Ему «да»? Если хочешь, ты можешь поговорить с Ним прямо сейчас, своими словами. Он не далеко. Он слушает.",
    prayerTitle:'💬 Простая молитва:',
    prayer:'«Иисус, я верю, что Ты — Сын Бога. Я верю, что Ты умер за мои грехи и воскрес. Пожалуйста, прости меня и войди в мою жизнь. Я хочу знать Тебя — а не просто знать о Тебе. Аминь.»',
    trophy:'👑 ДЕЛО РАСКРЫТО: ИИСУС — ГОСПОДЬ',
    trophyBody:'Ты завершил урок «Кто такой Иисус?»! Теперь у тебя есть доказательства, которые останутся с тобой на всю жизнь.',
    back:'← Назад к урокам',
  },
  lockMsg: (prev: number) => `Заверши Раздел ${prev}, чтобы открыть эту часть!`,
  resetBtn:'↺ Сбросить прогресс',
  resetConfirm:'Сбросить весь прогресс по этому уроку?',
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const ACCENT = '#8a1a30'

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 22, padding: '22px 20px',
  boxShadow: '0 3px 18px rgba(0,0,0,.08)', marginBottom: 16,
}

// ─── Helper: section lock overlay ────────────────────────────────────────────
function LockCard({ msg }: { msg: string }) {
  return (
    <div style={{
      textAlign: 'center', padding: '48px 24px',
      background: 'rgba(255,255,255,0.6)', borderRadius: 24,
      border: '3px dashed #ccc',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔒</div>
      <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, color: '#888', fontSize: '1.05rem' }}>
        {msg}
      </p>
    </div>
  )
}

// ─── Helper: truth banner ─────────────────────────────────────────────────────
function TruthBanner({ show, color, children }: { show: boolean; color: string; children: React.ReactNode }) {
  if (!show) return null
  return (
    <div style={{
      background: color, color: '#fff', borderRadius: 14,
      padding: '16px 18px', marginTop: 14, textAlign: 'center',
      fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1rem', lineHeight: 1.6,
      animation: 'pop-in 0.45s cubic-bezier(.34,1.56,.64,1) both',
    }}>
      {children}
    </div>
  )
}

// ─── Helper: section-complete unlock banner ───────────────────────────────────
function UnlockBanner({ msg }: { msg: string }) {
  return (
    <div style={{
      marginTop: 24, background: 'linear-gradient(135deg,#1a6a30,#2d8a50)',
      color: '#fff', borderRadius: 16, padding: '18px 22px', textAlign: 'center',
      fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1.05rem',
      animation: 'pop-in 0.5s cubic-bezier(.34,1.56,.64,1) both',
    }}>
      {msg}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
export default function WhoIsJesusLesson() {
  const { language } = useLanguage()
  const L = language === 'ru' ? RU : EN
  const isRu = language === 'ru'

  // ─── Word search state ────────────────────────────────────────────────────────
  const [wsGrid,   setWsGrid]   = useState<string[][]>([])
  const [wsCoords, setWsCoords] = useState<Record<string, [number, number][]>>({})
  const [wsSel,    setWsSel]    = useState<Set<string>>(new Set())
  const [wsFound,  setWsFound]  = useState<Set<string>>(new Set())
  const [wsStart,  setWsStart]  = useState<[number,number]|null>(null)

  // ─── Progress state ───────────────────────────────────────────────────────────
  const [unlocked, setUnlocked] = useState<Set<number>>(() => {
    try {
      const u = typeof window !== 'undefined' && localStorage.getItem('wij_unlocked')
      if (u) return new Set(JSON.parse(u) as number[])
    } catch { /* ignore */ }
    return new Set([1])
  })
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      const d = typeof window !== 'undefined' && localStorage.getItem('wij_done')
      if (d) return new Set(JSON.parse(d) as string[])
    } catch { /* ignore */ }
    return new Set()
  })
  const [won, setWon] = useState(false)

  useEffect(() => {
    localStorage.setItem('wij_unlocked', JSON.stringify([...unlocked]))
    localStorage.setItem('wij_done',     JSON.stringify([...done]))
  }, [unlocked, done])

  // ─── Word search init ─────────────────────────────────────────────────────────
  useEffect(() => {
    const wordList = isRu
      ? ['СПАСИТЕЛЬ', 'СВЕТ', 'ПУТЬ', 'ЖИЗНЬ', 'ПАСТЫРЬ', 'БОГ', 'СЛОВО', 'ЦАРЬ']
      : ['SAVIOR', 'KING', 'SHEPHERD', 'LIGHT', 'TRUTH', 'LORD', 'WORD', 'WAY']
    const alpha = isRu
      ? 'АБВГДЕЖЗИКЛМНОПРСТУХЦЧШЩЫЬ'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const { grid, coords } = generateWordSearchWithCoords(wordList, 10, 10, alpha)
    /* eslint-disable react-hooks/set-state-in-effect */
    setWsGrid(grid)
    setWsCoords(coords)
    setWsSel(new Set())
    setWsFound(new Set())
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isRu]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── solve() ─────────────────────────────────────────────────────────────────
  function solve(id: string, sec: number) {
    if (done.has(id)) return
    const newDone = new Set([...done, id])
    setDone(newDone)
    const reqs = SECTION_REQS[sec]
    if (reqs.every(r => newDone.has(r))) {
      if (sec < 5) {
        setUnlocked(prev => new Set([...prev, sec + 1]))
        setTimeout(() => {
          document.getElementById(`sec-${sec + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 700)
      } else {
        setTimeout(() => setWon(true), 700)
      }
    }
  }

  const secDoneCount = Object.entries(SECTION_REQS).filter(([, reqs]) => reqs.every(r => done.has(r))).length
  const stars = '⭐'.repeat(secDoneCount) + '☆'.repeat(5 - secDoneCount)

  // ─── Section 1: LLL flip cards ────────────────────────────────────────────────
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  function flipCard(id: string) {
    const next = new Set([...flipped, id])
    setFlipped(next)
    const LLL = isRu ? LLL_RU : LLL_EN
    if (LLL.every(c => next.has(c.id))) {
      solve('lic', 1)
    }
  }

  // ─── Section 2: Match game ────────────────────────────────────────────────────
  const [matchSel,   setMatchSel]   = useState<string|null>(null)
  const [matchDone,  setMatchDone]  = useState<Set<string>>(new Set())
  const [matchWrong, setMatchWrong] = useState<string|null>(null)
  const [matchSide,  setMatchSide]  = useState<'left'|'right'|null>(null)

  function pickMatchLeft(id: string) {
    if (matchDone.has(id)) return
    if (matchSide === 'left' && matchSel === id) {
      setMatchSel(null); setMatchSide(null); return
    }
    if (matchSide === 'right' && matchSel !== null) {
      // left + right already pending? check
      const leftId = id
      const rightId = matchSel
      attemptMatch(leftId, rightId)
    } else {
      setMatchSel(id)
      setMatchSide('left')
    }
  }

  function pickMatchRight(id: string) {
    if (matchDone.has(id)) return
    if (matchSide === 'right' && matchSel === id) {
      setMatchSel(null); setMatchSide(null); return
    }
    if (matchSide === 'left' && matchSel !== null) {
      attemptMatch(matchSel, id)
    } else {
      setMatchSel(id)
      setMatchSide('right')
    }
  }

  function attemptMatch(leftId: string, rightId: string) {
    if (leftId === rightId) {
      const nm = new Set([...matchDone, leftId])
      setMatchDone(nm)
      setMatchSel(null); setMatchSide(null)
      if (nm.size === 4) solve('match', 2)
    } else {
      setMatchWrong(leftId + '|' + rightId)
      setTimeout(() => {
        setMatchWrong(null)
        setMatchSel(null)
        setMatchSide(null)
      }, 500)
    }
  }

  function matchItemStyle(
    id: string,
    side: 'left'|'right',
    isMatchDone: Set<string>,
    mSel: string|null,
    mSide: 'left'|'right'|null,
    mWrong: string|null,
  ): React.CSSProperties {
    const isDone = isMatchDone.has(id)
    const isSel  = mSel === id && mSide === side
    const wrongParts = mWrong ? mWrong.split('|') : []
    const isWrong = wrongParts.length === 2 && (
      (side === 'left'  && wrongParts[0] === id) ||
      (side === 'right' && wrongParts[1] === id)
    )
    return {
      padding: '12px 10px', borderRadius: 14, cursor: isDone ? 'default' : 'pointer',
      fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '0.88rem',
      border: `3px solid ${isDone ? '#40b870' : isWrong ? '#e04040' : isSel ? ACCENT : '#ddd'}`,
      background: isDone ? '#edfaf2' : isWrong ? '#fff0f0' : isSel ? ACCENT : '#fafafa',
      color: isDone ? '#0a6830' : isWrong ? '#c00' : isSel ? '#fff' : '#334',
      textAlign: 'center', lineHeight: 1.4, transition: 'background .15s, border-color .15s',
      animation: isWrong ? 'shake 0.35s ease' : undefined,
      userSelect: 'none',
    }
  }

  // ─── Section 3: Word search ───────────────────────────────────────────────────
  function wsLine(r1: number, c1: number, r2: number, c2: number): [number,number][] | null {
    const dr = r2 - r1, dc = c2 - c1
    const len = Math.max(Math.abs(dr), Math.abs(dc))
    if (len === 0) return [[r1, c1]]
    if (Math.abs(dr) !== 0 && Math.abs(dc) !== 0 && Math.abs(dr) !== Math.abs(dc)) return null
    const sr = dr === 0 ? 0 : dr / Math.abs(dr)
    const sc = dc === 0 ? 0 : dc / Math.abs(dc)
    return Array.from({ length: len + 1 }, (_, i) => [r1 + i * sr, c1 + i * sc] as [number,number])
  }

  function wsClick(r: number, c: number) {
    for (const [word, coords] of Object.entries(wsCoords)) {
      if (wsFound.has(word) && coords.some(([rr, cc]) => rr === r && cc === c)) return
    }
    if (!wsStart) {
      setWsStart([r, c])
      setWsSel(new Set([`${r},${c}`]))
      return
    }
    const [sr, sc] = wsStart
    if (sr === r && sc === c) {
      setWsStart(null)
      setWsSel(new Set())
      return
    }
    const line = wsLine(sr, sc, r, c)
    if (!line) {
      setWsStart([r, c])
      setWsSel(new Set([`${r},${c}`]))
      return
    }
    const selSet = new Set(line.map(([rr, cc]) => `${rr},${cc}`))
    for (const [word, coords] of Object.entries(wsCoords)) {
      if (wsFound.has(word)) continue
      const wordKeys = coords.map(([rr, cc]) => `${rr},${cc}`)
      if (selSet.size === wordKeys.length && wordKeys.every(k => selSet.has(k))) {
        const newFound = new Set([...wsFound, word])
        setWsFound(newFound)
        setWsSel(new Set())
        setWsStart(null)
        if (newFound.size === Object.keys(wsCoords).length) solve('ws', 3)
        return
      }
    }
    setWsSel(selSet)
    setWsStart(null)
    setTimeout(() => setWsSel(new Set()), 600)
  }

  function wsCellState(r: number, c: number): 'found' | 'selected' | 'normal' {
    for (const [word, coords] of Object.entries(wsCoords)) {
      if (wsFound.has(word) && coords.some(([rr, cc]) => rr === r && cc === c)) return 'found'
    }
    return wsSel.has(`${r},${c}`) ? 'selected' : 'normal'
  }

  // ─── Section 4: True/False ────────────────────────────────────────────────────
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean|null>>({})

  function answerTf(id: string, answer: boolean) {
    if (tfAnswers[id] !== undefined && tfAnswers[id] !== null) return
    const TF = isRu ? TF_RU : TF_EN
    const next = { ...tfAnswers, [id]: answer }
    setTfAnswers(next)
    const allDone = TF.every(q => next[q.id] !== undefined && next[q.id] !== null)
    if (allDone) solve('tf', 4)
  }

  // ─── Section 5: Scramble ──────────────────────────────────────────────────────
  const [scrambleOrder, setScrambleOrder] = useState<string[]>([])
  const [scrambleErr,   setScrambleErr]   = useState('')

  const SC_TILES_ACTIVE = isRu ? SC_TILES_RU : SC_TILES_EN
  const SC_ANS_ACTIVE   = isRu ? SC_ANS_RU   : SC_ANS_EN

  function addScrambleTile(uid: string) {
    if (scrambleOrder.includes(uid)) return
    setScrambleOrder(prev => [...prev, uid])
  }

  function removeScrambleTile(uid: string) {
    setScrambleOrder(prev => prev.filter(u => u !== uid))
  }

  function checkScramble() {
    const placed = scrambleOrder.map(uid => {
      const t = SC_TILES_ACTIVE.find(tt => tt.uid === uid)
      return t ? t.word.toLowerCase() : ''
    })
    if (placed.length === SC_ANS_ACTIVE.length && placed.every((w, i) => w === SC_ANS_ACTIVE[i])) {
      setScrambleErr('')
      solve('scramble', 5)
    } else {
      const msg = isRu ? '❌ Не совсем — продолжай пробовать!' : '❌ Not quite — keep trying!'
      setScrambleErr(msg)
      setTimeout(() => setScrambleErr(''), 2500)
    }
  }

  // ─── Reset all progress ───────────────────────────────────────────────────────
  function resetAll() {
    if (!confirm(L.resetConfirm)) return
    localStorage.removeItem('wij_unlocked')
    localStorage.removeItem('wij_done')
    setUnlocked(new Set([1]))
    setDone(new Set())
    setWon(false)
    setFlipped(new Set())
    setMatchSel(null); setMatchDone(new Set()); setMatchWrong(null); setMatchSide(null)
    setWsSel(new Set()); setWsFound(new Set())
    setTfAnswers({})
    setScrambleOrder([]); setScrambleErr('')
  }

  // ─── Shared layout constants ──────────────────────────────────────────────────
  const secPad: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '44px 18px 52px' }
  const tileBase: React.CSSProperties = {
    padding: '9px 13px', borderRadius: 12, color: '#fff',
    fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
    cursor: 'pointer', userSelect: 'none', display: 'inline-block',
  }
  const sectionImg = (src: string, alt: string) => (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <img
        src={src} alt={alt}
        style={{ maxWidth: 600, width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 8px 28px rgba(0,0,0,.14)' }}
      />
    </div>
  )

  const LLL_ACTIVE = isRu ? LLL_RU : LLL_EN
  const TF_ACTIVE  = isRu ? TF_RU  : TF_EN
  const MATCH_LEFT_ACTIVE  = isRu ? MATCH_LEFT_RU  : MATCH_LEFT_EN
  const MATCH_RIGHT_ACTIVE = isRu ? MATCH_RIGHT_RU : MATCH_RIGHT_EN

  // ════════════════════ JSX ═══════════════════════════════════════════════════
  return (
    <>
      {/* ── Win Screen ──────────────────────────────────────────── */}
      {won && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,18,40,.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 30,
          animation: 'pop-in .4s ease',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>👑✝️🌅</div>
          <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '2rem', color: '#fff', marginBottom: 14, textShadow: `0 0 40px rgba(138,26,48,.8)` }}>
            {L.s5.trophy}
          </h2>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: 'rgba(255,255,255,.85)', lineHeight: 1.7, marginBottom: 28, fontSize: '1.05rem', maxWidth: 440 }}>
            {L.s5.trophyBody}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setWon(false)}
              style={{ padding: '14px 32px', background: `linear-gradient(135deg,${ACCENT},#c0294a)`, color: '#fff', border: 'none', borderRadius: 18, fontFamily: 'var(--font-nunito)', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer' }}
            >
              {L.s5.back}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('wij_unlocked')
                localStorage.removeItem('wij_done')
                window.location.reload()
              }}
              style={{ padding: '14px 32px', background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#3b2307', border: 'none', borderRadius: 18, fontFamily: 'var(--font-nunito)', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer' }}
            >
              {isRu ? '🔄 Пройти заново' : '🔄 Do It Again'}
            </button>
          </div>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '70vh',
        background: `radial-gradient(ellipse at 50% 50%,#3a0a18 0%,#1e0510 35%,#0d0608 60%,#060204 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px 100px', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 800, marginBottom: 40, zIndex: 10 }}>
          <img
            src="/images/jr/who-is-jesus-hero.png"
            alt="Who Is Jesus?"
            style={{ width: '100%', height: 'auto', borderRadius: 24, filter: 'drop-shadow(0 20px 50px rgba(0,0,0,.4))' }}
          />
        </div>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,6vw,3.2rem)', color: '#fff', textShadow: `0 0 30px rgba(200,80,80,.8)`, marginBottom: 10, lineHeight: 1.2 }}>
          {L.hero.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--flame2)', marginBottom: 20 }}>
          {L.hero.subtitle}
        </p>
        <blockquote style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', color: 'rgba(255,255,255,.9)', fontSize: '1rem', borderLeft: `3px solid rgba(200,100,100,.7)`, paddingLeft: 16, textAlign: 'left', maxWidth: 480, lineHeight: 1.85 }}>
          {L.hero.quote}
          <span style={{ display: 'block', fontStyle: 'normal', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.72rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--flame2)', marginTop: 8 }}>{L.hero.quoteRef}</span>
        </blockquote>
      </section>

      {/* ── Progress Bar ─────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 52, zIndex: 99,
        background: `linear-gradient(90deg,#1a0a10,#3a1020)`,
        padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `2px solid rgba(200,80,80,.2)`,
      }}>
        <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.76rem', fontWeight: 900, color: 'rgba(255,255,255,.7)', whiteSpace: 'nowrap', letterSpacing: 1 }}>
          {L.progress}
        </span>
        <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,.12)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(secDoneCount / 5) * 100}%`, background: `linear-gradient(90deg,${ACCENT},#c0294a)`, borderRadius: 10, transition: 'width .5s cubic-bezier(.34,1.56,.64,1)' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1rem', letterSpacing: 2, minWidth: 80, textAlign: 'right' }}>{stars}</span>
      </div>

      {/* ════════ SECTION 1 — THE CLAIMS ═══════════════════════════ */}
      <div id="sec-1" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner" style={{ background: `linear-gradient(135deg,${ACCENT},#c0294a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s1.banner}
        </div>
        <div className="alt-bg2">
          <div style={secPad}>
            <p className="eyebrow">{L.s1.eyebrow}</p>
            <h2 className="sec-title">{L.s1.title}</h2>
            <p className="sec-intro">{L.s1.intro}</p>

            {sectionImg('/images/jr/who-is-jesus-claims.png', 'Claims of Jesus')}

            {/* I AM claim cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14, marginBottom: 20 }}>
              {L.s1.claims.map((c, i) => (
                <div key={i} style={{ borderRadius: 20, padding: '22px 18px', textAlign: 'center', background: '#fff', border: `3px solid ${ACCENT}22`, boxShadow: '0 3px 14px rgba(0,0,0,.07)' }}>
                  <blockquote style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--deep)', lineHeight: 1.7, marginBottom: 8 }}>
                    {c.quote}
                  </blockquote>
                  <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.72rem', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: ACCENT }}>{c.ref}</span>
                </div>
              ))}
            </div>

            {/* I AM note */}
            <div className="kid-note" style={{ marginBottom: 24 }}>{L.s1.iamNote}</div>

            {/* LLL puzzle box */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: ACCENT }}>
              <p className="puzzle-label">{L.s1.lllTitle}</p>
              <p className="puzzle-q">{L.s1.lllIntro}</p>
              <p className="pz-hint">{L.s1.lllInstruction}</p>

              {/* Three cards */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 14 }}>
                {LLL_ACTIVE.map(c => {
                  const isFlipped = flipped.has(c.id)
                  return (
                    <div
                      key={c.id}
                      onClick={() => !done.has('lic') && !isFlipped && flipCard(c.id)}
                      style={{
                        flex: '1 1 200px', maxWidth: 260, minHeight: 160,
                        borderRadius: 18, padding: '20px 16px',
                        cursor: isFlipped ? 'default' : 'pointer',
                        userSelect: 'none',
                        background: isFlipped
                          ? (c.backOk ? '#edfaf2' : '#fff0f0')
                          : '#fff',
                        border: `3px solid ${isFlipped ? (c.backOk ? '#40b870' : '#e04040') : '#ddd'}`,
                        boxShadow: '0 3px 14px rgba(0,0,0,.09)',
                        transition: 'background .3s, border-color .3s',
                        textAlign: 'center',
                      }}
                    >
                      {!isFlipped ? (
                        <>
                          <div style={{ fontSize: '2.4rem', marginBottom: 8 }}>{c.icon}</div>
                          <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.95rem', color: 'var(--deep)', marginBottom: 8 }}>{c.frontTitle}</div>
                          <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.83rem', fontWeight: 700, color: '#556', lineHeight: 1.6 }}>{c.frontBody}</p>
                          <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa', marginTop: 10 }}>
                            {isRu ? 'Нажми ▾' : 'Tap ▾'}
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.88rem', color: c.backOk ? '#0a6830' : '#c00', marginBottom: 8 }}>{c.backTitle}</div>
                          <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.82rem', fontWeight: 700, color: '#334', lineHeight: 1.65 }}>{c.backBody}</p>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* All flipped note */}
              {flipped.size === 3 && !done.has('lic') && (
                <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.9rem', textAlign: 'center', color: ACCENT, marginTop: 8 }}>
                  {L.s1.lllAllFlipped}
                </p>
              )}

              <TruthBanner show={done.has('lic')} color={ACCENT}>
                {L.s1.lllTruth}
                <span className="truth-verse">{L.s1.lllVerse}</span>
              </TruthBanner>
            </div>

            {done.has('lic') && <UnlockBanner msg={L.s1.unlock} />}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">📜</span><div className="div-line"/></div>

      {/* ════════ SECTION 2 — PROPHECIES ═══════════════════════════ */}
      <div id="sec-2" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner" style={{ background: `linear-gradient(135deg,#6b2a00,#b06010)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s2.banner}
        </div>
        <div className="alt-bg">
          <div style={secPad}>
            {!unlocked.has(2) ? <LockCard msg={L.lockMsg(1)} /> : (
              <>
                <p className="eyebrow">{L.s2.eyebrow}</p>
                <h2 className="sec-title">{L.s2.title}</h2>
                <p className="sec-intro">{L.s2.intro}</p>

                {sectionImg('/images/jr/who-is-jesus-prophecy.png', 'Prophecies')}

                {/* Match activity */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#6b2a00' }}>
                  <p className="puzzle-label">{L.s2.matchTitle}</p>
                  <p className="puzzle-q">{L.s2.matchIntro}</p>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.9rem', fontWeight: 900, textAlign: 'center', color: '#888', marginBottom: 12 }}>
                    {L.s2.matchCount} {matchDone.size} / 4
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {/* Left column — prophecies */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {MATCH_LEFT_ACTIVE.map(item => (
                        <div
                          key={item.id}
                          onClick={() => !done.has('match') && pickMatchLeft(item.id)}
                          style={matchItemStyle(item.id, 'left', matchDone, matchSide === 'left' ? matchSel : null, matchSide, matchWrong)}
                        >
                          <div style={{ fontStyle: 'italic', marginBottom: 4 }}>{item.text}</div>
                          <div style={{ fontSize: '.72rem', opacity: .7, fontStyle: 'normal' }}>{item.ref}</div>
                        </div>
                      ))}
                    </div>
                    {/* Right column — fulfillments (already in shuffled order) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {MATCH_RIGHT_ACTIVE.map(item => (
                        <div
                          key={item.id}
                          onClick={() => !done.has('match') && pickMatchRight(item.id)}
                          style={matchItemStyle(item.id, 'right', matchDone, matchSide === 'right' ? matchSel : null, matchSide, matchWrong)}
                        >
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  <TruthBanner show={done.has('match')} color="#6b2a00">
                    {L.s2.matchDone}
                    <span className="truth-verse">{L.s2.matchVerse}</span>
                  </TruthBanner>
                </div>

                {/* Odds note */}
                {done.has('match') && (
                  <div className="kid-note" style={{ marginBottom: 16 }}>{L.s2.oddsNote}</div>
                )}

                {done.has('match') && <UnlockBanner msg={L.s2.unlock} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">✨</span><div className="div-line"/></div>

      {/* ════════ SECTION 3 — MIRACLES ═════════════════════════════ */}
      <div id="sec-3" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner" style={{ background: `linear-gradient(135deg,#0a3a60,#0a7090)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s3.banner}
        </div>
        <div className="alt-bg4">
          <div style={secPad}>
            {!unlocked.has(3) ? <LockCard msg={L.lockMsg(2)} /> : (
              <>
                <p className="eyebrow">{L.s3.eyebrow}</p>
                <h2 className="sec-title">{L.s3.title}</h2>
                <p className="sec-intro">{L.s3.intro}</p>

                {sectionImg('/images/jr/who-is-jesus-miracles.png', 'Miracles of Jesus')}

                {/* Miracle cards — 3x2 grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginBottom: 28 }}>
                  {L.s3.miracles.map(m => (
                    <div key={m.title} style={{ ...card, borderTop: `5px solid #0a7090` }}>
                      <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 8 }}>{m.icon}</span>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.88rem', color: '#0a5070', marginBottom: 6 }}>{m.title}</div>
                      <p style={{ fontSize: '.88rem', fontWeight: 700, color: '#334', lineHeight: 1.7, marginBottom: 6 }}>{m.body}</p>
                      <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#0a7090' }}>{m.ref}</span>
                    </div>
                  ))}
                </div>

                {/* Word search */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#0a7090' }}>
                  <p className="puzzle-label">{L.s3.wsLabel}</p>
                  <p className="puzzle-q">{L.s3.wsQ}</p>

                  {/* Word list */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                    {Object.keys(wsCoords).map(w => (
                      <span key={w} style={{
                        fontFamily: 'var(--font-nunito)', fontSize: '.88rem', fontWeight: 900,
                        padding: '5px 12px', borderRadius: 20,
                        background: wsFound.has(w) ? '#0a7090' : '#eee',
                        color: wsFound.has(w) ? '#fff' : '#555',
                        textDecoration: wsFound.has(w) ? 'line-through' : 'none',
                      }}>
                        {w}
                      </span>
                    ))}
                  </div>

                  {/* 10×10 grid */}
                  <div style={{ overflowX: 'auto', textAlign: 'center', paddingBottom: 6 }}>
                    {wsGrid.length === 0 ? (
                      <p style={{ fontFamily: 'var(--font-nunito)', color: '#aaa', padding: 20 }}>
                        {isRu ? 'Составляю пазл…' : 'Building puzzle…'}
                      </p>
                    ) : (
                      <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(10, clamp(28px, 7.5vw, 38px))', gap: 3, background: '#e8e8e8', borderRadius: 14, padding: 8 }}>
                        {wsGrid.map((row, r) => row.map((letter, c) => {
                          const state = wsCellState(r, c)
                          return (
                            <div
                              key={`${r}-${c}`}
                              onClick={() => !done.has('ws') && wsClick(r, c)}
                              className="word-cell"
                              style={{
                                width: 'clamp(28px, 7.5vw, 38px)',
                                height: 'clamp(28px, 7.5vw, 38px)',
                                fontSize: 'clamp(0.68rem, 2vw, 0.85rem)',
                                background: state === 'found' ? '#0a7090' : state === 'selected' ? '#fff0aa' : '#fff',
                                color: state === 'found' ? '#fff' : 'var(--text)',
                                cursor: done.has('ws') ? 'default' : 'pointer',
                                transform: state === 'selected' ? 'scale(1.08)' : 'none',
                              }}
                            >
                              {letter}
                            </div>
                          )
                        }))}
                      </div>
                    )}
                  </div>

                  <p className="pz-hint">{L.s3.wsHint}</p>
                  {!done.has('ws') && (
                    <button className="pz-btn" style={{ background: '#888', marginTop: 8 }} onClick={() => setWsSel(new Set())}>
                      {L.s3.wsClear}
                    </button>
                  )}
                  <TruthBanner show={done.has('ws')} color="#0a7090">
                    {L.s3.wsDone}
                    <span className="truth-verse">{L.s3.wsVerse}</span>
                  </TruthBanner>
                </div>

                {done.has('ws') && <UnlockBanner msg={L.s3.unlock} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">🌅</span><div className="div-line"/></div>

      {/* ════════ SECTION 4 — THE RESURRECTION ════════════════════ */}
      <div id="sec-4" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner" style={{ background: `linear-gradient(135deg,#1a3a00,#2a6a10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s4.banner}
        </div>
        <div className="alt-bg2">
          <div style={secPad}>
            {!unlocked.has(4) ? <LockCard msg={L.lockMsg(3)} /> : (
              <>
                <p className="eyebrow">{L.s4.eyebrow}</p>
                <h2 className="sec-title">{L.s4.title}</h2>
                <p className="sec-intro">{L.s4.intro}</p>

                {sectionImg('/images/jr/who-is-jesus-resurrection.png', 'The Resurrection')}

                {/* Evidence cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginBottom: 28 }}>
                  {L.s4.evidence.map(e => (
                    <div key={e.title} style={{ ...card, borderLeft: `6px solid ${e.color}` }}>
                      <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 8 }}>{e.icon}</span>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.9rem', color: e.color, marginBottom: 6 }}>{e.title}</div>
                      <p style={{ fontSize: '.88rem', fontWeight: 700, color: '#334', lineHeight: 1.7 }}>{e.body}</p>
                    </div>
                  ))}
                </div>

                {/* True/False activity */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#1a6a30' }}>
                  <p className="puzzle-label">{L.s4.tfLabel}</p>
                  <p className="puzzle-q">{L.s4.tfIntro}</p>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.9rem', fontWeight: 900, textAlign: 'center', color: '#888', marginBottom: 14 }}>
                    {L.s4.tfCount} {Object.keys(tfAnswers).filter(k => tfAnswers[k] !== null && tfAnswers[k] !== undefined).length} / 5
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {TF_ACTIVE.map(q => {
                      const ans = tfAnswers[q.id]
                      const answered = ans !== undefined && ans !== null
                      const correct  = answered && (ans === q.correct)
                      return (
                        <div key={q.id} style={{
                          borderRadius: 16, padding: '16px 18px',
                          background: answered ? (correct ? '#edfaf2' : '#fff0f0') : '#fafafa',
                          border: `2px solid ${answered ? (correct ? '#40b870' : '#e04040') : '#ddd'}`,
                        }}>
                          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '.95rem', color: '#334', marginBottom: 12, lineHeight: 1.5 }}>{q.text}</p>
                          {!answered ? (
                            <div style={{ display: 'flex', gap: 10 }}>
                              <button
                                onClick={() => answerTf(q.id, true)}
                                style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '2px solid #40b870', background: '#f0fdf4', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.88rem', color: '#1a6a30', cursor: 'pointer' }}
                              >{L.s4.tfTrue}</button>
                              <button
                                onClick={() => answerTf(q.id, false)}
                                style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '2px solid #e04040', background: '#fff0f0', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.88rem', color: '#c00', cursor: 'pointer' }}
                              >{L.s4.tfFalse}</button>
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.82rem', marginBottom: 6, color: correct ? '#0a6830' : '#c00' }}>
                                {correct
                                  ? (isRu ? '✅ Правильно!' : '✅ Correct!')
                                  : (isRu ? '❌ Неверно' : '❌ Incorrect')}
                                {' '}
                                ({ans ? L.s4.tfTrue : L.s4.tfFalse})
                              </div>
                              <p style={{ fontSize: '.85rem', fontWeight: 700, color: '#445', lineHeight: 1.6 }}>{q.explain}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <TruthBanner show={done.has('tf')} color="#1a6a30">
                    {L.s4.tfDone}
                    <span className="truth-verse">{L.s4.tfVerse}</span>
                  </TruthBanner>
                </div>

                {done.has('tf') && <UnlockBanner msg={L.s4.unlock} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">❤️</span><div className="div-line"/></div>

      {/* ════════ SECTION 5 — THE GOSPEL ═══════════════════════════ */}
      <div id="sec-5" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner" style={{ background: `linear-gradient(135deg,#1a0040,#400090)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s5.banner}
        </div>
        <div className="alt-bg3">
          <div style={secPad}>
            {!unlocked.has(5) ? <LockCard msg={L.lockMsg(4)} /> : (
              <>
                <p className="eyebrow">{L.s5.eyebrow}</p>
                <h2 className="sec-title">{L.s5.title}</h2>
                <p className="sec-intro">{L.s5.intro}</p>

                {sectionImg('/images/jr/who-is-jesus-gospel.png', 'The Gospel')}

                {/* Gospel cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 16, marginBottom: 28 }}>
                  {L.s5.gospel.map(g => (
                    <div key={g.title} style={{ ...card, borderTop: `5px solid ${g.color}` }}>
                      <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 8 }}>{g.icon}</span>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.88rem', color: g.color, marginBottom: 6 }}>{g.title}</div>
                      <p style={{ fontSize: '.88rem', fontWeight: 700, color: '#334', lineHeight: 1.7, marginBottom: 6 }}>{g.body}</p>
                      <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: g.color }}>{g.ref}</span>
                    </div>
                  ))}
                </div>

                {/* Memory verse scramble */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: ACCENT }}>
                  <p className="puzzle-label">{L.s5.scLabel}</p>
                  <p className="puzzle-q">{L.s5.scQ}</p>
                  <p className="pz-hint">{L.s5.scHint}</p>

                  {/* Placed tiles zone */}
                  <div style={{
                    minHeight: 58, border: `3px dashed ${done.has('scramble') ? '#40b870' : '#ccc'}`,
                    borderRadius: 14, display: 'flex', flexWrap: 'wrap', gap: 8,
                    padding: 10, justifyContent: 'center', marginBottom: 10,
                    background: done.has('scramble') ? '#edfaf2' : '#fafafa',
                  }}>
                    {scrambleOrder.length === 0 && (
                      <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.85rem', color: '#ccc', fontWeight: 800, alignSelf: 'center' }}>
                        {isRu ? 'Нажимай плитки снизу...' : 'Tap tiles below...'}
                      </span>
                    )}
                    {scrambleOrder.map(uid => {
                      const tile = SC_TILES_ACTIVE.find(t => t.uid === uid)
                      if (!tile) return null
                      return (
                        <div
                          key={uid}
                          onClick={() => !done.has('scramble') && removeScrambleTile(uid)}
                          style={{ ...tileBase, background: ACCENT }}
                        >
                          {tile.word}
                        </div>
                      )
                    })}
                  </div>

                  {/* Source tiles */}
                  {!done.has('scramble') && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 10 }}>
                      {SC_TILES_ACTIVE.map(tile => (
                        <div
                          key={tile.uid}
                          onClick={() => addScrambleTile(tile.uid)}
                          style={{
                            ...tileBase,
                            background: scrambleOrder.includes(tile.uid) ? 'rgba(138,26,48,.25)' : ACCENT,
                            opacity: scrambleOrder.includes(tile.uid) ? 0.4 : 1,
                            cursor: scrambleOrder.includes(tile.uid) ? 'default' : 'pointer',
                          }}
                        >
                          {tile.word}
                        </div>
                      ))}
                    </div>
                  )}

                  {!done.has('scramble') && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <button className="pz-btn" style={{ background: ACCENT, flex: 2 }} onClick={checkScramble}>
                        {L.s5.scCheck}
                      </button>
                      <button
                        className="pz-btn"
                        style={{ background: '#888', flex: 1 }}
                        onClick={() => setScrambleOrder([])}
                      >
                        {isRu ? '↩ Сброс' : '↩ Reset'}
                      </button>
                    </div>
                  )}

                  {scrambleErr && <p className="pz-error">{scrambleErr}</p>}
                  <TruthBanner show={done.has('scramble')} color={ACCENT}>
                    {L.s5.scDone}
                  </TruthBanner>
                </div>

                {/* The Big Question — shown after scramble complete */}
                {done.has('scramble') && (
                  <div style={{
                    marginTop: 32, background: `linear-gradient(135deg,#0d1f3c,#1a3060)`,
                    borderRadius: 28, padding: '36px 28px', textAlign: 'center', color: '#fff',
                    boxShadow: `0 8px 32px rgba(138,26,48,.3)`,
                    animation: 'pop-in 0.5s cubic-bezier(.34,1.56,.64,1) both',
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: 14 }}>✝️ 👑 ❤️</div>
                    <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.2rem,4vw,1.7rem)', lineHeight: 1.3, marginBottom: 16, color: '#fff' }}>
                      {L.s5.questionTitle}
                    </h2>
                    <blockquote style={{
                      fontFamily: 'var(--font-lora)', fontStyle: 'italic',
                      fontSize: 'clamp(1rem,3vw,1.25rem)', color: 'rgba(255,255,255,.95)',
                      borderLeft: `4px solid ${ACCENT}`, paddingLeft: 18, textAlign: 'left',
                      maxWidth: 540, margin: '0 auto 8px', lineHeight: 1.75,
                    }}>
                      {L.s5.question}
                    </blockquote>
                    <span style={{ display: 'block', fontFamily: 'var(--font-nunito)', fontSize: '.78rem', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--flame2)', marginBottom: 24 }}>
                      {L.s5.questionRef}
                    </span>

                    <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 700, fontSize: '.98rem', opacity: .9, lineHeight: 1.85, maxWidth: 560, margin: '0 auto 24px', textAlign: 'left' }}>
                      {L.s5.invitation}
                    </p>

                    <div style={{
                      background: 'rgba(255,255,255,.08)', borderRadius: 16, padding: '20px 22px',
                      maxWidth: 520, margin: '0 auto 28px', textAlign: 'left',
                    }}>
                      <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.82rem', letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--flame2)', marginBottom: 10 }}>
                        {L.s5.prayerTitle}
                      </div>
                      <blockquote style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(255,255,255,.9)', lineHeight: 1.8, borderLeft: `3px solid var(--flame2)`, paddingLeft: 14 }}>
                        {L.s5.prayer}
                      </blockquote>
                    </div>

                    {/* Trophy */}
                    <div style={{
                      background: `linear-gradient(135deg,${ACCENT},#c0294a)`,
                      borderRadius: 20, padding: '24px 20px',
                      maxWidth: 500, margin: '0 auto',
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>👑</div>
                      <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(.95rem,3vw,1.3rem)', color: '#fff', marginBottom: 8 }}>
                        {L.s5.trophy}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '.9rem', color: 'rgba(255,255,255,.88)', lineHeight: 1.7 }}>
                        {L.s5.trophyBody}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Reset button ─────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '24px 18px', background: 'var(--cream)' }}>
        <button onClick={resetAll} style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '.8rem', color: '#aaa', background: 'none', border: '1px solid #ddd', borderRadius: 20, padding: '6px 16px', cursor: 'pointer' }}>
          {L.resetBtn}
        </button>
      </div>
    </>
  )
}
