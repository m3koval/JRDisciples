'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { lessons } from '@/data/lessons'
import { lessonsRu } from '@/data/lessons-ru'
import { generateWordSearchWithCoords } from '@/lib/wordSearch'

// ─── Types ──────────────────────────────────────────────────────────────────
type Tile = { uid: string; word: string }

// Word search grids are generated dynamically — see useEffect in component

// ─── Russian Scrambles ───────────────────────────────────────────────────────
const SC1_TILES_RU: Tile[] = [
  {uid:'s1_0',word:'над'},{uid:'s1_1',word:'Дух'},{uid:'s1_2',word:'водою'},
  {uid:'s1_3',word:'Божий'},{uid:'s1_4',word:'носился'},
]
const SC1_ANS_RU = ['дух','божий','носился','над','водою']

const SC2_TILES_RU: Tile[] = [
  {uid:'s2_0',word:'языки'},{uid:'s2_1',word:'из'},{uid:'s2_2',word:'них'},
  {uid:'s2_3',word:'огненные'},{uid:'s2_4',word:'почили'},{uid:'s2_5',word:'каждом'},{uid:'s2_6',word:'на'},
]
const SC2_ANS_RU = ['почили','на','каждом','из','них','огненные','языки']

// ─── Russian Fruits ──────────────────────────────────────────────────────────
const FRUITS_RU = [
  { icon:'❤️', name:'Любовь',        greek:'agápe',       bg:'#fff0e8', color:'#a03000', kid:'Забота о других, даже когда трудно — потому что Бог первым возлюбил нас!',         ex:'"Любите врагов ваших." — Матф. 5:44',                   ref:'1 Иоан. 4:19' },
  { icon:'😄', name:'Радость',       greek:'chará',        bg:'#fffbe8', color:'#806000', kid:'Глубокое счастье, которое не зависит от происходящего вокруг!',                   ex:'"Радость Господня — сила ваша." — Неем. 8:10',          ref:'Рим. 15:13' },
  { icon:'🕊️', name:'Мир',          greek:'eirḗnē',       bg:'#e8f4ff', color:'#0a5090', kid:'Спокойствие внутри, когда страшно — как Иисус спал в шторм!',                    ex:'"Мир Бога будет хранить сердца ваши." — Фил. 4:7',      ref:'Иоан. 14:27' },
  { icon:'⌛', name:'Долготерпение', greek:'makrothymía',  bg:'#f0fdf4', color:'#0a6830', kid:'Ждать без ропота! Авраам ждал 25 лет обещания Бога!',                             ex:'"Покорись Господу и жди Его." — Пс. 36:7',              ref:'Рим. 5:3–4' },
  { icon:'🤲', name:'Благость',      greek:'chrēstótēs',   bg:'#f3eeff', color:'#600090', kid:'Как добрый самаритянин — помогать незнакомцам, которым никто не помог!',          ex:'"Будьте добры друг к другу." — Еф. 4:32',               ref:'Лук. 10:33–34' },
  { icon:'✨', name:'Доброта',       greek:'agathōsýnē',   bg:'#edfaf2', color:'#0a6040', kid:'Делать правое, потому что мы любим Бога, а не ради похвалы!',                    ex:'"Побеждай зло добром." — Рим. 12:21',                   ref:'Матф. 5:16' },
  { icon:'🙏', name:'Верность',      greek:'pístis',       bg:'#fff5f5', color:'#900020', kid:'Даниил молился 3 раза в день, даже когда это было незаконно — вот верность!',     ex:'"Хорошо, добрый и верный раб!" — Матф. 25:21',         ref:'Дан. 6:10' },
  { icon:'🌸', name:'Кротость',      greek:'praýtēs',      bg:'#e8f4ff', color:'#0a4080', kid:'Мягкие слова и смиренное сердце — Иисус сказал "Я кроток и смирен сердцем".',    ex:'"Мягкий ответ отвращает гнев." — Прит. 15:1',           ref:'Матф. 11:29' },
  { icon:'🛡️', name:'Воздержание',  greek:'enkráteia',    bg:'#fff8e1', color:'#7a4f00', kid:'Иосиф убежал от искушения! Вот что значит воздержание от Духа!',                  ex:'"Владеющий духом своим — сильнее." — Прит. 16:32',      ref:'Быт. 39:12' },
]

// ─── Russian FITB ────────────────────────────────────────────────────────────
const FITB_ANSWERS_RU: Record<string, string> = {
  b1:'ЯЗЫКИ', b2:'ИСЦЕЛЕНИЕ', b3:'ПРОРОЧЕСТВО', b4:'МУДРОСТЬ', b5:'ВЕРА', b6:'УЧЕНИЕ',
}
const FITB_WORDS_RU = ['ИСЦЕЛЕНИЕ','МУДРОСТЬ','ПРОРОЧЕСТВО','ВЕРА','УЧЕНИЕ','ЯЗЫКИ']

// ─── Russian Decoder ─────────────────────────────────────────────────────────
const DECODER_KEYS_RU = [
  { emoji:'🧑', word:'ТОТ',    id:'d1' },
  { emoji:'🏠', word:'В',      id:'d2' },
  { emoji:'🙋', word:'ВАС',    id:'d3' },
  { emoji:'💪', word:'БОЛЬШЕ', id:'d4' },
  { emoji:'👤', word:'ЧЕМ',   id:'d5' },
  { emoji:'🌍', word:'В',      id:'d6' },
  { emoji:'🏙️', word:'МИРЕ',  id:'d7' },
]

// ─── Challenge unlock requirements per section ───────────────────────────────
const SECTION_REQS: Record<number, string[]> = {
  1: ['r1', 'r2'],
  2: ['ws'],
  3: ['match1', 'match2'],
  4: ['sc1', 'sc2'],
  5: ['fruits'],
  6: ['fitb'],
  7: ['decoder'],
}

// ─── Word search grid (8×6) ──────────────────────────────────────────────────
// (grids generated dynamically)

// ─── Scramble data ───────────────────────────────────────────────────────────
const SC1_TILES: Tile[] = [
  {uid:'s1_5',word:'hovering'},{uid:'s1_3',word:'God'},{uid:'s1_7',word:'the'},
  {uid:'s1_1',word:'Spirit'},{uid:'s1_4',word:'was'},{uid:'s1_0',word:'the'},
  {uid:'s1_2',word:'of'},{uid:'s1_8',word:'waters'},{uid:'s1_6',word:'over'},
]
const SC1_ANS = ['the','spirit','of','god','was','hovering','over','the','waters']

const SC2_TILES: Tile[] = [
  {uid:'s2_4',word:'rested'},{uid:'s2_1',word:'as'},{uid:'s2_8',word:'them'},
  {uid:'s2_0',word:'Tongues'},{uid:'s2_6',word:'each'},{uid:'s2_2',word:'of'},
  {uid:'s2_5',word:'on'},{uid:'s2_7',word:'of'},{uid:'s2_3',word:'fire'},
]
const SC2_ANS = ['tongues','as','of','fire','rested','on','each','of','them']

// ─── Fruit data ──────────────────────────────────────────────────────────────
const FRUITS = [
  { icon:'❤️', name:'Love',        greek:'agápe',       bg:'#fff0e8', color:'#a03000', kid:'Caring for others even when it\'s hard — because God first loved us!',         ex:'"Love your enemies." — Matt 5:44',                   ref:'1 John 4:19' },
  { icon:'😄', name:'Joy',         greek:'chará',        bg:'#fffbe8', color:'#806000', kid:'Deep happiness that doesn\'t depend on what\'s happening around you!',         ex:'"The joy of the Lord is your strength." — Neh 8:10',  ref:'Romans 15:13' },
  { icon:'🕊️', name:'Peace',       greek:'eirḗnē',      bg:'#e8f4ff', color:'#0a5090', kid:'Calm inside when things are scary — like Jesus sleeping in a storm!',          ex:'"The peace of God will guard your hearts." — Phil 4:7', ref:'John 14:27' },
  { icon:'⌛', name:'Patience',    greek:'makrothymía',  bg:'#f0fdf4', color:'#0a6830', kid:'Waiting without grumbling! Abraham waited 25 YEARS for God\'s promise!',        ex:'"Be still and wait patiently." — Ps 37:7',             ref:'Romans 5:3–4' },
  { icon:'🤲', name:'Kindness',    greek:'chrēstótēs',   bg:'#f3eeff', color:'#600090', kid:'Like the Good Samaritan — helping strangers nobody else would help!',          ex:'"Be kind to one another." — Eph 4:32',                 ref:'Luke 10:33–34' },
  { icon:'✨', name:'Goodness',    greek:'agathōsýnē',   bg:'#edfaf2', color:'#0a6040', kid:'Doing right because we love God — not just to show off!',                     ex:'"Overcome evil with good." — Rom 12:21',               ref:'Matthew 5:16' },
  { icon:'🙏', name:'Faithfulness',greek:'pístis',       bg:'#fff5f5', color:'#900020', kid:'Daniel prayed 3× a day even when it was ILLEGAL — that\'s faithfulness!',     ex:'"Well done, good and faithful servant!" — Matt 25:21', ref:'Daniel 6:10' },
  { icon:'🌸', name:'Gentleness',  greek:'praýtēs',      bg:'#e8f4ff', color:'#0a4080', kid:'Soft words and a humble heart — Jesus said "I am gentle and lowly."',         ex:'"A gentle answer turns away wrath." — Prov 15:1',      ref:'Matthew 11:29' },
  { icon:'🛡️', name:'Self-Control',greek:'enkráteia',   bg:'#fff8e1', color:'#7a4f00', kid:'Joseph RAN AWAY from temptation! That\'s the Spirit giving self-control!',     ex:'"He who rules his spirit is mighty." — Prov 16:32',    ref:'Genesis 39:12' },
]

// ─── Fill-in-blank answers ───────────────────────────────────────────────────
const FITB_ANSWERS: Record<string, string> = {
  b1:'TONGUES', b2:'HEALING', b3:'PROPHECY', b4:'WISDOM', b5:'FAITH', b6:'TEACHING',
}
const FITB_WORDS = ['HEALING','WISDOM','PROPHECY','FAITH','TEACHING','TONGUES']

// ─── Decoder ─────────────────────────────────────────────────────────────────
const DECODER_KEYS = [
  { emoji:'💪', word:'GREATER', id:'d1' },
  { emoji:'👆', word:'IS',      id:'d2' },
  { emoji:'🧑', word:'HE',      id:'d3' },
  { emoji:'👤', word:'WHO',     id:'d4' },
  { emoji:'👆', word:'IS',      id:'d5' },
  { emoji:'🏠', word:'IN',      id:'d6' },
  { emoji:'🙋', word:'YOU',     id:'d7' },
]

// ─── Content objects ─────────────────────────────────────────────────────────
const EN = {
  hero: { title:'The Holy Spirit', subtitle:'Person · Presence · Power', quote:'"But the Helper, the Holy Spirit, whom the Father will send in my name, he will teach you all things."', quoteRef:'John 14:26 · ESV' },
  progress: '📖 PROGRESS',
  s1: {
    banner:'🔥 SECTION 1 · WHO IS THE HOLY SPIRIT? 🔥', eyebrow:'The Third Person of the Trinity', title:'Who Is the Holy Spirit?',
    intro:'The Holy Spirit is NOT a force, a feeling, or an energy — He is a real Person, equal with God the Father and Jesus the Son. He has always existed, and He lives inside every believer today.',
    kidNote:'👨‍👧 Ask a grown-up: "What does it mean that my body is a temple?"',
    trinity: [
      { bg:'#fffbe8', border:'#f0c040', icon:'☀️', name:'God the Father',      nameColor:'#7a5800', desc:'Our Creator and Heavenly Dad — who made everything and loves us with a perfect, forever love.', ref:'Genesis 1:1 · Matthew 6:9' },
      { bg:'#e8f0ff', border:'#6090e8', icon:'✝️', name:'God the Son',         nameColor:'#1a3a9a', desc:'Jesus came to earth, died for our sins, rose again, and went back to heaven to prepare a place for us.', ref:'John 3:16 · John 14:2' },
      { bg:'#fff0e8', border:'#e87030', icon:'🕊️', name:'God the Holy Spirit', nameColor:'#a03000', desc:'He lives INSIDE every believer — our Helper, Teacher, Comforter, and Guide, sent by Jesus Himself.', ref:'John 14:26 · 1 Cor 6:19' },
    ],
    pq:'"Go therefore and make disciples of all nations, baptising them in the name of the Father and of the Son and of the Holy Spirit."',
    pqRef:'Matthew 28:19 · ESV — All three Persons together at once',
    traits: [
      { icon:'🧠', title:'He Has a Mind',    body:'He thinks and knows everything — even the deep things of God. He searches all things and prays according to God\'s perfect will.', ref:'Romans 8:27 · 1 Cor 2:10' },
      { icon:'💔', title:'He Has Feelings',  body:'He can be grieved (made sad) by sin, and He loves with the love of God. He is not a machine — He is a Person who cares deeply.', ref:'Ephesians 4:30 · Romans 15:30' },
      { icon:'✅', title:'He Has a Will',    body:'He decides who gets which gifts — "apportioning to each one individually as he wills." He makes real choices with real purpose.', ref:'1 Corinthians 12:11' },
      { icon:'🏠', title:'He Lives In You!', body:'"Your body is a temple of the Holy Spirit within you." If you believe in Jesus, the Spirit of God literally lives inside you right now.', ref:'1 Corinthians 6:19' },
    ],
    r1Label:'🧩 Rebus Puzzle 1 of 2', r1Q:'Solve the picture equation — what does the Holy Spirit do for you?',
    r1Home:'HOME', r1Heart:'HEART', r1Placeholder:'He _ _ _ _ _ in you!',
    r1Hint:'💡 Hint: The Spirit makes your heart His home! (1 Cor 6:19)',
    r1Err:'❌ Not quite — try again! Think about where the Spirit makes His home.',
    r1Truth:'🏠 YES! The Holy Spirit LIVES in you — when you believe in Jesus!',
    r1TruthVerse:'"Do you not know that your body is a temple of the Holy Spirit within you?" — 1 Corinthians 6:19',
    r1Btn:'CHECK MY ANSWER ✓',
    r2Label:'🧩 Rebus Puzzle 2 of 2', r2Q:'How many Persons is God? The Father, Son, and Holy Spirit are all God — but only ONE God. What do we call that?',
    r2Father:'FATHER', r2Son:'SON', r2Spirit:'SPIRIT', r2Placeholder:'3 Persons, ___ God',
    r2Hint:'💡 Hint: Three different Persons, but only ___ God! Try: "Trinity" or "one God"',
    r2Err:'❌ Hint: Father + Son + Holy Spirit = three Persons, ___ God!',
    r2Truth:'✝️ THREE Persons — ONE God! That\'s called the Trinity!\nThe Father, Son, and Holy Spirit are each fully God, but there is only one God!',
    r2TruthVerse:'"Baptising them in the name of the Father and of the Son and of the Holy Spirit." — Matthew 28:19',
    r2Btn:'CHECK MY ANSWER ✓',
    unlock:'🎉 Section 1 complete! Section 2 is now unlocked — scroll down!',
  },
  s2: {
    banner:'🌊 SECTION 2 · SYMBOLS OF THE HOLY SPIRIT 💧', eyebrow:'Picture-Language from God', title:'Symbols of the Holy Spirit',
    intro:'God uses vivid picture-language throughout Scripture to help us understand the Holy Spirit. Each symbol reveals a different truth about who He is and what He does.',
    symbols: [
      { bg:'#e4f4ff', color:'#0a6090', icon:'🕊️', name:'The Dove',     kid:'Gentle, peaceful, and pure — just like the Holy Spirit! He descends softly, not by force.', verse:'"The Spirit of God descending like a dove."', ref:'Matthew 3:16' },
      { bg:'#fff3e0', color:'#a03000', icon:'🔥', name:'Fire',           kid:'Fire gives light, warmth, and power — and purifies. The Spirit lights up our hearts and burns away what\'s wrong.', verse:'"Divided tongues as of fire rested on each one."', ref:'Acts 2:3' },
      { bg:'#edfaf2', color:'#0a6830', icon:'💨', name:'Wind',           kid:'You can\'t see wind but you feel it! The Spirit is invisible but very real — you see His effects in people\'s lives.', verse:'"A sound like a mighty rushing wind."', ref:'Acts 2:2' },
      { bg:'#e8f0ff', color:'#1a3aaa', icon:'💧', name:'Living Water',   kid:'We NEED water to live — and we need the Spirit just as much. He flows from our innermost being!', verse:'"Out of his heart will flow rivers of living water."', ref:'John 7:38–39' },
      { bg:'#f8eeff', color:'#600090', icon:'🫙', name:'Anointing Oil',  kid:'Kings and priests were anointed with oil — chosen and set apart. The Spirit anoints US, marking us as God\'s own!', verse:'"You have been anointed by the Holy One."', ref:'1 John 2:20' },
      { bg:'#fff0ee', color:'#900020', icon:'🔏', name:'A Seal',         kid:'A royal seal meant "this belongs to the king." The Spirit is God\'s seal on us — we are His, and He guarantees it!', verse:'"Sealed with the promised Holy Spirit."', ref:'Ephesians 1:13–14' },
    ],
    pq:'"The wind blows where it wishes, and you hear its sound, but you do not know where it comes from or where it goes. So it is with everyone who is born of the Spirit."',
    pqRef:'John 3:8 · ESV — Jesus explaining the Spirit to Nicodemus',
    wsLabel:'🔍 Word Search Challenge', wsQ:'Find all 6 symbols in the 10×10 grid! Words hide in every direction — even diagonally and backwards. Tap each letter to select.',
    wsClear:'↩ Clear Selection', wsHint:'💡 Words can go in any of 8 directions. Tap every letter of a word to lock it in blue!',
    wsTruth:'🎉 Amazing — you found all 6 symbols!',
    wsTruthVerse:'Gentle like a Dove · Powerful like Fire · Invisible like Wind · Filling like Living Water · Anointing like Oil · Protecting like a Seal!',
    unlock:'🎉 Section 2 complete! Section 3 is now unlocked — scroll down!',
  },
  s3: {
    banner:'⚡ SECTION 3 · THE ROLES OF THE HOLY SPIRIT ⚡', eyebrow:'What He Actually Does', title:'The Roles of the Holy Spirit',
    intro:'Jesus called the Holy Spirit our "Helper" — in Greek: Paraclete, meaning "one who comes alongside." He has 8 amazing roles for every believer:',
    roles: [
      { color:'#5aaedc', icon:'🤝', name:'The Helper',       desc:'He comes alongside us — like the best friend who never leaves. When life feels hard, He is right there helping you carry it.', ref:'John 14:16' },
      { color:'#e87030', icon:'📚', name:'The Teacher',      desc:'When you read the Bible and suddenly understand it — that\'s the Holy Spirit! He opens our minds to God\'s truth.', ref:'John 14:26' },
      { color:'#9050d0', icon:'🪞', name:'The Convicter',    desc:'When we sin, the Spirit makes us feel it inside — not to condemn us but to lead us back to God\'s forgiveness.', ref:'John 16:8' },
      { color:'#40b870', icon:'🙏', name:'Prayer Helper',    desc:'When we don\'t know what to pray, the Spirit prays FOR us with prayers too deep for words. We are never alone!', ref:'Romans 8:26' },
      { color:'#f0c040', icon:'⚡', name:'Power-Giver',     desc:'Jesus told His disciples to wait for the Holy Spirit before doing anything — He is the source of God\'s power in us.', ref:'Acts 1:8' },
      { color:'#e84070', icon:'🧭', name:'The Guide',       desc:'Not sure which way to go? The Spirit is our guide into all truth — like a GPS for our hearts, pointing to God.', ref:'John 16:13' },
      { color:'#5070d8', icon:'🌱', name:'The Transformer', desc:'He changes us from the inside out — slowly growing love, joy, and peace. Only He can produce that kind of fruit.', ref:'Galatians 5:22' },
      { color:'#d04060', icon:'❤️', name:'The Comforter',   desc:'When we are sad, scared, or lonely — the Spirit is right there with God\'s comfort, pouring His love into our hearts.', ref:'Romans 5:5' },
    ],
    m1Label:'🔗 Match It — Round 1 of 2', m1Q:'Tap a ROLE (left), then tap its MEANING (right). Get all 4 right!',
    m1CountPrefix:'Matched:',
    m1Left: [{id:'helper',label:'🤝 The Helper'},{id:'teacher',label:'📚 The Teacher'},{id:'power',label:'⚡ Power-Giver'},{id:'comforter',label:'❤️ Comforter'}],
    m1Right: [{id:'teacher',label:'Explains the Bible so you understand it'},{id:'comforter',label:'Loves you when you feel sad or alone'},{id:'helper',label:'Comes alongside you like a best friend'},{id:'power',label:'Gives you strength to do what God asks'}],
    m1Truth:'🎉 Round 1 done! Great matching!',
    m1TruthVerse:'"I will ask the Father, and he will give you another Helper, to be with you forever." — John 14:16',
    m2Label:'🔗 Match It — Round 2 of 2', m2Q:'Four more roles! Tap a role, then its meaning.',
    m2Left: [{id:'guide',label:'🧭 The Guide'},{id:'prayer',label:'🙏 Prayer Helper'},{id:'convict',label:'🪞 Convicter'},{id:'transform',label:'🌱 Transformer'}],
    m2Right: [{id:'transform',label:'Grows love & kindness inside you'},{id:'guide',label:'Shows you which way is right'},{id:'prayer',label:'Prays when you have no words'},{id:'convict',label:'Shows us when we sin and leads us back'}],
    m2Truth:'🌟 All 8 roles mastered — incredible!',
    m2TruthVerse:'"The Spirit himself intercedes for us with groanings too deep for words." — Romans 8:26',
    unlock:'🎉 Section 3 complete! Section 4 is now unlocked — scroll down!',
  },
  s4: {
    banner:'📖 SECTION 4 · BIBLE STORIES OF THE HOLY SPIRIT 📖', eyebrow:'Old & New Testament', title:'Bible Stories of the Holy Spirit',
    intro:'The Holy Spirit has been active from the very first verse of the Bible! From Creation to Pentecost, He has always been at work.',
    stories: [
      { bg:'linear-gradient(180deg,#0d1f3c,#1a3a6e,#2255a4)', icon:'🌌', label:'In the Beginning', title:'The Spirit Hovers Over Creation', ref:'Genesis 1:1–2', refColor:'#0a6090', text:'Before anything existed — before light, land, or creatures — the Spirit of God was already present, hovering over the dark, empty waters like a bird brooding over a nest, full of creative power. The same Spirit who was there at the very beginning lives inside you today! 🌍✨', quote:'"The earth was without form and void… and the Spirit of God was hovering over the face of the waters."', qref:'Genesis 1:2 · ESV' },
      { bg:'linear-gradient(180deg,#87ceeb,#c8e8f5,#5cb85c 80%)', icon:'🕊️', label:'Jordan River', title:'The Spirit Descends on Jesus', ref:'Matthew 3:13–17', refColor:'#0a5070', text:'When Jesus came out of the Jordan River after being baptised, the heavens opened. The Holy Spirit descended visibly — like a dove — and rested on Jesus. At the same moment, the Father spoke from heaven. All three Persons of the Trinity were present at once! 🎉', quote:'"He saw the Spirit of God descending like a dove… a voice from heaven said, \'This is my beloved Son.\'"', qref:'Matthew 3:16–17 · ESV' },
      { bg:'linear-gradient(180deg,#1a4a1a,#2d6a2d,#4a9a4a)', icon:'🦴', label:'Valley of Dry Bones', title:'The Spirit Brings Dead Bones to Life', ref:'Ezekiel 37:1–14', refColor:'#166534', text:'God took Ezekiel to a valley of dry bones. God told him to speak to them. As he did, they rattled together, grew flesh, and stood up as a living army! God said: this is what His Spirit does — He brings the spiritually dead to life. Only God can do that! 💪', quote:'"I will put my Spirit within you, and you shall live."', qref:'Ezekiel 37:14 · ESV' },
      { bg:'linear-gradient(180deg,#1a0a00,#7c2d12,#ea580c)', icon:'🔥', label:'Acts 2 · Pentecost', title:'The Spirit Is Poured Out on All People', ref:'Acts 2:1–21', refColor:'#9a3412', text:'Fifty days after the resurrection, 120 believers gathered in Jerusalem. Suddenly a sound like a violent rushing wind filled the house! Tongues of fire rested on each person, and they were all filled with the Holy Spirit. 3,000 believed that day. The Church was born! 🌍🎉', quote:'"I will pour out my Spirit on all flesh… everyone who calls on the name of the Lord shall be saved."', qref:'Acts 2:17, 21 · ESV' },
      { bg:'linear-gradient(180deg,#2d0052,#6b21a8,#a855f7)', icon:'🎶', label:'Philippi Prison', title:'Worship in Prison — and God Shows Up', ref:'Acts 16:25–34', refColor:'#581c87', text:'Paul and Silas were in prison, feet in chains. At midnight they were praying and singing hymns! Suddenly an earthquake shook the foundations, all doors flew open, chains fell off. The jailer\'s whole family believed in Jesus that night. The Spirit moves powerfully in worship — even in the darkest places! 🎵⚡', quote:'"About midnight Paul and Silas were praying and singing hymns… a great earthquake shook the foundations."', qref:'Acts 16:25–26 · ESV' },
    ],
    sc1Label:'🌀 Story Scramble 1 of 2 — Genesis 1:2', sc1Q:'Tap the words in the right order to complete the verse about Creation! Green = correct position.',
    sc2Label:'🌀 Story Scramble 2 of 2 — Pentecost (Acts 2:3)', sc2Q:'What happened when the Holy Spirit came at Pentecost? Put the words in order!',
    scHintEmpty:'Tap words below to build the verse!',
    scResetBtn:'↩ Reset',
    sc1Truth:'🌌 Yes! The Spirit was there before ANYTHING existed!', sc1TruthVerse:'The same Spirit who hovered at Creation lives inside YOU right now!',
    sc2Truth:'🔥 Tongues of fire rested on each person — and 3,000 believed that day!', sc2TruthVerse:'"I will pour out my Spirit on all flesh… everyone who calls on the name of the Lord shall be saved." — Acts 2:17, 21',
    unlock:'🎉 Section 4 complete! Section 5 is now unlocked — scroll down!',
  },
  s5: {
    banner:'🌿 SECTION 5 · THE FRUIT OF THE SPIRIT 🌿', eyebrow:'Galatians 5:22–23', title:'The Fruit of the Spirit',
    intro:'When the Holy Spirit lives in us, He transforms our character from the inside out. These 9 qualities grow naturally as we stay connected to God — like a branch drawing life from the vine (John 15:4–5). We don\'t produce them by trying harder; He produces them in us.',
    fruitLabel:'👆 Tap-to-Reveal Challenge', fruitQ:'Tap each fruit to discover what it means! Reveal all 9 to complete this section.',
    fruitProgress: (n: number) => n < 9 ? `👆 TAP ANY FRUIT TO REVEAL! (${n}/9 revealed)` : '🌿 All 9 fruits revealed!',
    tapIndicator:'Tap ▾',
    fruitTruth:'🌿 WOW! You discovered all 9 fruits of the Spirit!',
    fruitTruthVerse:'"The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control." — Galatians 5:22–23',
    pq:'"The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control; against such things there is no law."',
    pqRef:'Galatians 5:22–23 · ESV',
    unlock:'🎉 Section 5 complete! Section 6 is now unlocked — scroll down!',
  },
  s6: {
    banner:'🎁 SECTION 6 · GIFTS OF THE HOLY SPIRIT 🎁', eyebrow:'1 Corinthians 12 · Romans 12 · Ephesians 4', title:'Gifts of the Holy Spirit',
    intro:'Beyond transforming our character, the Spirit equips each believer with supernatural gifts — not for personal glory, but to build up the church and advance God\'s Kingdom. "To each is given the manifestation of the Spirit for the common good." (1 Cor 12:7)',
    gifts: [
      { color:'#0369a1', icon:'🗣️', name:'Tongues & Interpretation', desc:'Praying or speaking in a language unknown to the speaker, with the gift of interpretation making it understood.' },
      { color:'#9a3412', icon:'📣', name:'Prophecy',                  desc:'Speaking a message from God that strengthens, encourages, and comforts the church.' },
      { color:'#166534', icon:'🩺', name:'Healing',                   desc:'Supernatural restoration of physical, emotional, or spiritual wholeness through prayer in Jesus\' name.' },
      { color:'#7e22ce', icon:'⚡', name:'Miracles',                  desc:'Acts of supernatural power beyond natural law — signs that reveal God\'s glory and confirm the gospel.' },
      { color:'#b45309', icon:'🧭', name:'Wisdom & Knowledge',        desc:'Spirit-given insight for a specific situation, or supernatural knowledge of facts not known naturally.' },
      { color:'#0e7490', icon:'🔍', name:'Discernment of Spirits',    desc:'Ability to distinguish what is from God, from human nature, or from evil spiritual forces.' },
      { color:'#4f46e5', icon:'🎓', name:'Teaching',                  desc:'The Spirit enables certain believers to explain Scripture with unusual clarity so others are changed by it.' },
      { color:'#065f46', icon:'🤲', name:'Faith & Generosity',        desc:'Extraordinary mountain-moving faith for specific situations; and supernatural liberality in giving.' },
    ],
    fitbLabel:'✏️ Fill in the Blank Challenge', fitbQ:'Tap a word from the bank, then tap the blank where it belongs. Tap a filled blank without a selection to return the word!',
    fitbKidNote:'💡 Tap a word → then tap the blank where it goes. Tap a filled blank to send the word back!',
    fitbSentences: [
      { id:'b1', pre:'1. Speaking in a special language given by the Spirit is the gift of', post:'.' },
      { id:'b2', pre:'2. When God heals someone\'s body through prayer, that\'s', post:'.' },
      { id:'b3', pre:'3. Sharing an encouraging message from God is', post:'.' },
      { id:'b4', pre:'4. Knowing exactly the right thing to say is the gift of', post:'.' },
      { id:'b5', pre:'5. Mountain-moving trust in God is the gift of', post:'.' },
      { id:'b6', pre:'6. Explaining the Bible so clearly that people understand it is', post:'.' },
    ],
    fitbCheckBtn:'CHECK ANSWERS ✓', fitbErr:'❌ Some answers are wrong or missing — check the highlighted ones!',
    fitbTruth:'🎁 You know all the gifts! Remember — they\'re for helping OTHERS!',
    fitbTruthVerse:'"To each is given the manifestation of the Spirit for the common good." — 1 Corinthians 12:7',
    unlock:'🎉 Section 6 complete! Section 7 is now unlocked — scroll down!',
  },
  s7: {
    banner:'❤️ SECTION 7 · LIVING WITH THE HOLY SPIRIT ❤️', eyebrow:'Ephesians 5 · Romans 8 · Galatians 5', title:'Living With the Holy Spirit',
    intro:'The Holy Spirit is not just a doctrine to believe — He is a Person to walk with every day. Scripture gives us clear guidance on how to relate to Him, cooperate with Him, and avoid hindering His work in our lives.',
    warningTitle:'Do Not Grieve the Holy Spirit',
    warningBody:'"Do not grieve the Holy Spirit of God, by whom you were sealed for the day of redemption. Let all bitterness and wrath and anger and clamour and slander be put away from you." Because He is a Person with feelings, sin grieves Him — especially bitterness and unforgiveness.',
    warningRef:'Ephesians 4:30–31 · ESV',
    pq:'"Do not quench the Spirit. Do not despise prophecies, but test everything; hold fast what is good."',
    pqRef:'1 Thessalonians 5:19–21 · ESV — We must not suppress His working',
    practices: [
      { n:1, title:'Be Filled Continually',        body:'Paul\'s command is present continuous — "keep on being filled." It\'s not a one-time event but an ongoing daily surrender to Him.', ref:'Ephesians 5:18' },
      { n:2, title:'Walk By the Spirit',            body:'"Walk by the Spirit, and you will not gratify the desires of the flesh." Follow His leading step by step, all day long.', ref:'Galatians 5:16' },
      { n:3, title:'Pray in the Spirit',            body:'"Praying at all times in the Spirit, with all prayer and supplication." Let the Spirit direct and empower your prayer life.', ref:'Ephesians 6:18 · Jude 1:20' },
      { n:4, title:'Be Led by the Spirit',          body:'"For all who are led by the Spirit of God are sons of God." He will guide your decisions, relationships, and your calling.', ref:'Romans 8:14' },
      { n:5, title:'Set Your Mind on the Spirit',   body:'"To set the mind on the Spirit is life and peace." What we meditate on shapes how the Spirit flows through us.', ref:'Romans 8:6' },
      { n:6, title:'The Spirit Helps in Weakness',  body:'"The Spirit helps us in our weakness… the Spirit himself intercedes for us with groanings too deep for words." You never pray alone.', ref:'Romans 8:26' },
    ],
    decoderLabel:'🔐 Emoji Decoder — Final Challenge!', decoderQ:'Each emoji = one word. Tap each key below to decode the hidden verse!',
    decoderDisplayTitle:'DECODE THE VERSE:', decoderKeyTitle:'THE KEY — TAP EACH ONE:',
    decoderCheckBtn:'REVEAL THE VERSE ✓',
    decoderErr: (n: number) => `🔐 Keep tapping! ${n} of 7 decoded.`,
    decoderTruth:'💙 GREATER IS HE WHO IS IN YOU! The Holy Spirit inside you is more powerful than ANYTHING in the world!',
    decoderTruthVerse:'"Greater is he who is in you than he who is in the world." — 1 John 4:4 · ESV',
    bigTitle:'The Big Message',
    bigBody:'The Holy Spirit is God — living INSIDE every believer right now.\nHe is your Helper, Teacher, Comforter, Guide, and Power-Giver.\nHe transforms your character, equips you with gifts,\nand makes absolutely certain you are never alone. 💛\n\n"Greater is He who is in you than he who is in the world." — 1 John 4:4',
    wonTitle:'You Did It All!', wonBody:'You completed every section of The Holy Spirit!\nGod is SO proud of you! 🌟',
    wonQuote:'"Greater is He who is in you than he who is in the world."', wonQuoteRef:'1 John 4:4 · ESV',
    wonBtn:'⭐ Keep Exploring!',
  },
  lockMsg: (prev: number) => `Complete Section ${prev} to unlock this part!`,
  resetBtn:'↺ Reset My Progress',
  resetConfirm:'Reset all progress for this lesson?',
  unlockBanner: (sec: number) => `🎉 Section ${sec} complete! Section ${sec + 1} is now unlocked — scroll down!`,
}

const RU = {
  hero: { title:'Святой Дух', subtitle:'Личность · Присутствие · Сила', quote:'«Утешитель же, Дух Святой, которого пошлёт Отец во имя Моё, научит вас всему.»', quoteRef:'Иоанна 14:26' },
  progress: '📖 ПРОГРЕСС',
  s1: {
    banner:'🔥 РАЗДЕЛ 1 · КТО ТАКОЙ СВЯТОЙ ДУХ? 🔥', eyebrow:'Третья Личность Святой Троицы', title:'Кто такой Святой Дух?',
    intro:'Святой Дух — настоящая Личность, равная Богу Отцу и Иисусу Сыну. Он существует вечно и живёт в каждом верующем сегодня. Он — не просто чувство и не энергия, а живой Бог, который знает тебя по имени!',
    kidNote:'👨‍👧 Спроси взрослого: «Что значит, что твоё тело — это храм?»',
    trinity: [
      { bg:'#fffbe8', border:'#f0c040', icon:'☀️', name:'Бог Отец',         nameColor:'#7a5800', desc:'Наш Творец и Небесный Отец — Который создал всё и любит нас совершенной, вечной любовью.', ref:'Бытие 1:1 · Матфей 6:9' },
      { bg:'#e8f0ff', border:'#6090e8', icon:'✝️', name:'Бог Сын',          nameColor:'#1a3a9a', desc:'Иисус пришёл на землю, умер за наши грехи, воскрес и вернулся на небо приготовить нам место.', ref:'Иоанна 3:16 · Иоанна 14:2' },
      { bg:'#fff0e8', border:'#e87030', icon:'🕊️', name:'Бог Святой Дух',  nameColor:'#a03000', desc:'Он живёт ВНУТРИ каждого верующего — наш Помощник, Учитель, Утешитель и Наставник, посланный Самим Иисусом.', ref:'Иоанна 14:26 · 1 Кор. 6:19' },
    ],
    pq:'"Идите, научите все народы, крестя их во имя Отца и Сына и Святого Духа."',
    pqRef:'Матфей 28:19 · Синод. — Все три Личности вместе',
    traits: [
      { icon:'🧠', title:'У Него есть Разум',    body:'Он думает и знает всё — даже глубины Бога. Он ходатайствует по воле Бога.', ref:'Рим. 8:27 · 1 Кор. 2:10' },
      { icon:'💔', title:'У Него есть Чувства',  body:'Его можно огорчить грехом. Он любит любовью Бога. Он не машина — Он Личность, которая глубоко заботится.', ref:'Еф. 4:30 · Рим. 15:30' },
      { icon:'✅', title:'У Него есть Воля',    body:'Он решает, кому какие дары дать — "каждому особо, как Ему угодно." Он принимает настоящие решения с настоящей целью.', ref:'1 Кор. 12:11' },
      { icon:'🏠', title:'Он живёт в тебе!', body:'"Тело ваше есть храм живущего в вас Святого Духа." Если ты веришь в Иисуса, Дух Божий буквально живёт в тебе прямо сейчас.', ref:'1 Кор. 6:19' },
    ],
    r1Label:'🧩 Ребус 1 из 2', r1Q:'Реши уравнение с картинками — что делает Святой Дух для тебя?',
    r1Home:'ДОМ', r1Heart:'СЕРДЦЕ', r1Placeholder:'Он _ _ _ _ _ _ в тебе!',
    r1Hint:'💡 Подсказка: Дух делает твоё сердце Своим домом! (1 Кор. 6:19)',
    r1Err:'❌ Неверно — попробуй ещё! Подумай, где Дух устраивает Свой дом.',
    r1Truth:'🏠 ДА! Святой Дух ЖИВЁТ в тебе — когда ты веришь в Иисуса!',
    r1TruthVerse:'"Разве не знаете, что тела ваши суть храм живущего в вас Святого Духа?" — 1 Коринфянам 6:19',
    r1Btn:'ПРОВЕРИТЬ МОЙ ОТВЕТ ✓',
    r2Label:'🧩 Ребус 2 из 2', r2Q:'Сколько Личностей у Бога? Отец, Сын и Святой Дух — все Бог, но только ОДИН Бог. Как это называется?',
    r2Father:'ОТЕЦ', r2Son:'СЫН', r2Spirit:'ДУХ', r2Placeholder:'3 Личности, ___ Бог',
    r2Hint:'💡 Подсказка: Три разных Личности, но только ___ Бог! Попробуй: «Троица» или «один Бог»',
    r2Err:'❌ Подсказка: Отец + Сын + Святой Дух = три Личности, ___ Бог!',
    r2Truth:'✝️ ТРИ Личности — ОДИН Бог! Это называется Троица!\nОтец, Сын и Святой Дух — каждый полностью Бог, но Бог один!',
    r2TruthVerse:'"Крестя их во имя Отца и Сына и Святого Духа." — Матфей 28:19',
    r2Btn:'ПРОВЕРИТЬ МОЙ ОТВЕТ ✓',
    unlock:'🎉 Раздел 1 завершён! Раздел 2 теперь открыт — прокрути вниз!',
  },
  s2: {
    banner:'🌊 РАЗДЕЛ 2 · СИМВОЛЫ СВЯТОГО ДУХА 💧', eyebrow:'Образный язык Бога', title:'Символы Святого Духа',
    intro:'Бог использует яркий образный язык во всём Писании, чтобы помочь нам понять Святого Духа. Каждый символ раскрывает разную истину о том, кто Он и что делает.',
    symbols: [
      { bg:'#e4f4ff', color:'#0a6090', icon:'🕊️', name:'Голубь',           kid:'Нежный, мирный и чистый — как Святой Дух! Он сходит тихо, без принуждения.', verse:'"Дух Божий сходил на Него, как голубь."', ref:'Матфей 3:16' },
      { bg:'#fff3e0', color:'#a03000', icon:'🔥', name:'Огонь',              kid:'Огонь даёт свет, тепло и силу — и очищает. Дух освещает наши сердца и сжигает всё лишнее.', verse:'"Разделяющиеся языки, как бы огненные, почили на каждом из них."', ref:'Деяния 2:3' },
      { bg:'#edfaf2', color:'#0a6830', icon:'💨', name:'Ветер',              kid:'Ветер не видишь, но чувствуешь! Дух невидим, но очень реален — Его действие видно в жизнях людей.', verse:'"Сделался шум с неба, как бы от несущегося сильного ветра."', ref:'Деяния 2:2' },
      { bg:'#e8f0ff', color:'#1a3aaa', icon:'💧', name:'Живая вода',        kid:'Вода нужна нам для жизни — и Дух нужен нам так же. Он течёт из сердца верующего!', verse:'"Из чрева его потекут реки воды живой."', ref:'Иоанна 7:38–39' },
      { bg:'#f8eeff', color:'#600090', icon:'🫙', name:'Помазанное масло',   kid:'Царей и священников помазывали маслом — избирали и отделяли. Дух помазывает НАС, отмечая нас как принадлежащих Богу!', verse:'"Вы имеете помазание от Святого."', ref:'1 Иоан. 2:20' },
      { bg:'#fff0ee', color:'#900020', icon:'🔏', name:'Печать',             kid:'Царская печать означала «это принадлежит царю». Дух — Божья печать на нас — мы Его, и Он гарантирует это!', verse:'"Запечатлены обетованным Святым Духом."', ref:'Еф. 1:13–14' },
    ],
    pq:'"Дух дышит, где хочет, и голос его слышишь, а не знаешь, откуда приходит и куда уходит: так бывает со всяким, рождённым от Духа."',
    pqRef:'Иоанна 3:8 · Синод. — Иисус объясняет Духа Никодиму',
    wsLabel:'🔍 Задание — Поиск слов', wsQ:'Найди все 6 символов в сетке 10×10! Слова спрятаны во всех направлениях — даже по диагонали и задом наперёд. Нажимай каждую букву.',
    wsClear:'↩ Очистить выбор', wsHint:'💡 Слова идут в любом из 8 направлений. Нажми все буквы слова, чтобы оно зафиксировалось синим!',
    wsTruth:'🎉 Потрясающе — ты нашёл все 6 символов!',
    wsTruthVerse:'Нежный как Голубь · Мощный как Огонь · Невидимый как Ветер · Наполняющий как Живая Вода · Помазывающий как Масло · Защищающий как Печать!',
    unlock:'🎉 Раздел 2 завершён! Раздел 3 теперь открыт — прокрути вниз!',
  },
  s3: {
    banner:'⚡ РАЗДЕЛ 3 · РОЛИ СВЯТОГО ДУХА ⚡', eyebrow:'Что Он на самом деле делает', title:'Роли Святого Духа',
    intro:'Иисус назвал Святого Духа нашим «Помощником» — по-гречески: Параклет, означает «тот, кто приходит рядом». У Него 8 удивительных ролей для каждого верующего:',
    roles: [
      { color:'#5aaedc', icon:'🤝', name:'Помощник',          desc:'Он приходит рядом — как лучший друг, который никогда не уходит. Когда жизнь тяжела, Он помогает нести это.', ref:'Иоан. 14:16' },
      { color:'#e87030', icon:'📚', name:'Учитель',            desc:'Когда читаешь Библию и вдруг понимаешь — это Святой Дух! Он открывает наш разум для Божьей истины.', ref:'Иоан. 14:26' },
      { color:'#9050d0', icon:'🪞', name:'Обличитель',         desc:'Когда мы грешим, Дух даёт нам это почувствовать — не чтобы осудить, а чтобы привести нас обратно к Божьему прощению.', ref:'Иоан. 16:8' },
      { color:'#40b870', icon:'🙏', name:'Помощник в молитве', desc:'Когда не знаем, о чём молиться, Дух молится за нас молитвами глубже слов. Мы никогда не одни!', ref:'Рим. 8:26' },
      { color:'#f0c040', icon:'⚡', name:'Податель силы',      desc:'Иисус велел ученикам ждать Святого Духа прежде, чем делать что-либо — Он источник Божьей силы в нас.', ref:'Деян. 1:8' },
      { color:'#e84070', icon:'🧭', name:'Наставник',          desc:'Не знаешь, куда идти? Дух — наш наставник во всей истине — как навигатор для нашего сердца, указывающий к Богу.', ref:'Иоан. 16:13' },
      { color:'#5070d8', icon:'🌱', name:'Преобразователь',    desc:'Он меняет нас изнутри — медленно взращивая любовь, радость и мир. Только Он может принести такой плод.', ref:'Гал. 5:22' },
      { color:'#d04060', icon:'❤️', name:'Утешитель',          desc:'Когда нам грустно, страшно или одиноко — Дух прямо рядом с Божьим утешением, изливая Его любовь в наши сердца.', ref:'Рим. 5:5' },
    ],
    m1Label:'🔗 Сопоставь — Раунд 1 из 2', m1Q:'Нажми РОЛЬ (слева), затем её ЗНАЧЕНИЕ (справа). Угадай все 4!',
    m1CountPrefix:'Совпало:',
    m1Left: [{id:'helper',label:'🤝 Помощник'},{id:'teacher',label:'📚 Учитель'},{id:'power',label:'⚡ Податель силы'},{id:'comforter',label:'❤️ Утешитель'}],
    m1Right: [{id:'teacher',label:'Открывает Библию, чтобы ты понял её'},{id:'comforter',label:'Любит тебя, когда тебе грустно или одиноко'},{id:'helper',label:'Всегда рядом, как лучший друг'},{id:'power',label:'Даёт силу делать то, что просит Бог'}],
    m1Truth:'🎉 Раунд 1 пройден! Отличное совпадение!',
    m1TruthVerse:'"Я умолю Отца, и даст вам другого Утешителя, да пребудет с вами вовек." — Иоанна 14:16',
    m2Label:'🔗 Сопоставь — Раунд 2 из 2', m2Q:'Ещё четыре роли! Нажми роль, затем её значение.',
    m2Left: [{id:'guide',label:'🧭 Наставник'},{id:'prayer',label:'🙏 Помощник в молитве'},{id:'convict',label:'🪞 Обличитель'},{id:'transform',label:'🌱 Преобразователь'}],
    m2Right: [{id:'transform',label:'Взращивает любовь и доброту внутри тебя'},{id:'guide',label:'Показывает, который путь правильный'},{id:'prayer',label:'Молится, когда у тебя нет слов'},{id:'convict',label:'Показывает, когда мы грешим, и ведёт обратно к Богу'}],
    m2Truth:'🌟 Все 8 ролей выучены — невероятно!',
    m2TruthVerse:'"Сам Дух ходатайствует за нас воздыханиями неизреченными." — Римлянам 8:26',
    unlock:'🎉 Раздел 3 завершён! Раздел 4 теперь открыт — прокрути вниз!',
  },
  s4: {
    banner:'📖 РАЗДЕЛ 4 · БИБЛЕЙСКИЕ ИСТОРИИ О СВЯТОМ ДУХЕ 📖', eyebrow:'Ветхий и Новый Завет', title:'Библейские истории о Святом Духе',
    intro:'Святой Дух действовал с самого первого стиха Библии! От Сотворения до Пятидесятницы Он всегда был в действии.',
    stories: [
      { bg:'linear-gradient(180deg,#0d1f3c,#1a3a6e,#2255a4)', icon:'🌌', label:'В начале', title:'Дух носился над Сотворением', ref:'Бытие 1:1–2', refColor:'#0a6090', text:'До того как что-либо существовало — до света, суши и живых существ — Дух Божий уже был здесь, носясь над тёмными, пустыми водами, как птица над гнездом, полный творческой силы. Тот же Дух, Который был там с самого начала, живёт в тебе сегодня! 🌍✨', quote:'"Земля же была безвидна и пуста... и Дух Божий носился над водою."', qref:'Бытие 1:2 · Синод.' },
      { bg:'linear-gradient(180deg,#87ceeb,#c8e8f5,#5cb85c 80%)', icon:'🕊️', label:'Река Иордан', title:'Дух сходит на Иисуса', ref:'Матфей 3:13–17', refColor:'#0a5070', text:'Когда Иисус вышел из воды Иордана после крещения, небеса раскрылись. Святой Дух видимо сошёл — как голубь — и остался на Иисусе. В тот же момент Отец говорил с неба. Все три Личности Троицы были одновременно! 🎉', quote:'"Он увидел Духа Божия, Который сходил, как голубь... голос с небес: «Сей есть Сын Мой возлюбленный.»"', qref:'Матфей 3:16–17 · Синод.' },
      { bg:'linear-gradient(180deg,#1a4a1a,#2d6a2d,#4a9a4a)', icon:'🦴', label:'Долина сухих костей', title:'Дух оживляет мёртвые кости', ref:'Иезекииль 37:1–14', refColor:'#166534', text:'Бог привёл Иезекииля в долину сухих костей. Бог велел ему говорить к ним. Кости сдвинулись, обросли плотью и встали как живое воинство! Бог сказал: вот что делает Его Дух — Он оживляет духовно мёртвых. Только Бог может это! 💪', quote:'"Вложу в вас дух Мой, и оживёте."', qref:'Иезекииль 37:14 · Синод.' },
      { bg:'linear-gradient(180deg,#1a0a00,#7c2d12,#ea580c)', icon:'🔥', label:'Деяния 2 · Пятидесятница', title:'Дух излился на всех людей', ref:'Деяния 2:1–21', refColor:'#9a3412', text:'Через пятьдесят дней после Воскресения 120 верующих собрались в Иерусалиме. Внезапно поднялся шум с неба, как от несущегося ветра! Огненные языки почили на каждом, и все исполнились Святого Духа. В тот день уверовало 3000 человек. Родилась Церковь! 🌍🎉', quote:'"Излию от Духа Моего на всякую плоть... всякий, кто призовёт имя Господне, спасётся."', qref:'Деяния 2:17, 21 · Синод.' },
      { bg:'linear-gradient(180deg,#2d0052,#6b21a8,#a855f7)', icon:'🎶', label:'Темница в Филиппах', title:'Поклонение в темнице — и Бог приходит', ref:'Деяния 16:25–34', refColor:'#581c87', text:'Павел и Сила были в темнице, ноги в колодках. В полночь они молились и пели гимны! Внезапно земля затряслась, двери открылись, цепи упали. Вся семья тюремщика уверовала в Иисуса той ночью. Дух мощно движется в поклонении — даже в самых тёмных местах! 🎵⚡', quote:'"Около полуночи Павел и Сила, молясь, воспевали Бога... сделалось великое землетрясение."', qref:'Деяния 16:25–26 · Синод.' },
    ],
    sc1Label:'🌀 Скрэмбл 1 из 2 — Бытие 1:2', sc1Q:'Нажимай слова в правильном порядке, чтобы составить стих о Сотворении! Зелёный = верная позиция.',
    sc2Label:'🌀 Скрэмбл 2 из 2 — Пятидесятница (Деяния 2:3)', sc2Q:'Что случилось, когда Святой Дух пришёл в Пятидесятницу? Поставь слова по порядку!',
    scHintEmpty:'Нажимай слова снизу, чтобы составить стих!',
    scResetBtn:'↩ Сброс',
    sc1Truth:'🌌 Да! Дух был там ДО того, как всё началось!', sc1TruthVerse:'Тот же Дух, который носился над водами при Сотворении, живёт в ТЕБЕ прямо сейчас!',
    sc2Truth:'🔥 Огненные языки почили на каждом — и 3000 уверовали в тот день!', sc2TruthVerse:'"Излию от Духа Моего на всякую плоть... всякий, кто призовёт имя Господне, спасётся." — Деяния 2:17, 21',
    unlock:'🎉 Раздел 4 завершён! Раздел 5 теперь открыт — прокрути вниз!',
  },
  s5: {
    banner:'🌿 РАЗДЕЛ 5 · ПЛОД ДУХА 🌿', eyebrow:'Галатам 5:22–23', title:'Плод Духа',
    intro:'Когда Святой Дух живёт в нас, Он преобразует наш характер изнутри. Эти 9 качеств растут естественно, когда мы остаёмся связанными с Богом — как ветвь, питаемая от лозы (Иоан. 15:4–5). Мы не производим их усилием — Он производит их в нас.',
    fruitLabel:'👆 Задание — Открывай одно за другим', fruitQ:'Нажми на каждый плод, чтобы узнать, что он означает! Открой все 9, чтобы завершить раздел.',
    fruitProgress: (n: number) => n < 9 ? `👆 НАЖМИ НА ЛЮБОЙ ПЛОД! (${n}/9 открыто)` : '🌿 Все 9 плодов открыты!',
    tapIndicator:'Нажми ▾',
    fruitTruth:'🌿 ВАУ! Ты открыл все 9 плодов Духа!',
    fruitTruthVerse:'"Плод же Духа: любовь, радость, мир, долготерпение, благость, доброта, верность, кротость, воздержание." — Галатам 5:22–23',
    pq:'«Плод же Духа: любовь, радость, мир, долготерпение, благость, доброта, верность, кротость, воздержание; на таковых нет закона.»',
    pqRef:'Галатам 5:22–23 · Синод.',
    unlock:'🎉 Раздел 5 завершён! Раздел 6 теперь открыт — прокрути вниз!',
  },
  s6: {
    banner:'🎁 РАЗДЕЛ 6 · ДАРЫ СВЯТОГО ДУХА 🎁', eyebrow:'1 Кор. 12 · Рим. 12 · Еф. 4', title:'Дары Святого Духа',
    intro:'Помимо преобразования нашего характера, Дух наделяет каждого верующего сверхъестественными дарами — не для личной славы, а для назидания церкви и распространения Царства Бога. «Каждому даётся проявление Духа на пользу» (1 Кор. 12:7)',
    gifts: [
      { color:'#0369a1', icon:'🗣️', name:'Языки и истолкование', desc:'Молитва или речь на языке, неизвестном говорящему, с даром истолкования, делающим её понятной.' },
      { color:'#9a3412', icon:'📣', name:'Пророчество',          desc:'Произнесение послания от Бога, которое укрепляет, ободряет и утешает церковь.' },
      { color:'#166534', icon:'🩺', name:'Исцеление',            desc:'Сверхъестественное восстановление физического, эмоционального или духовного здоровья через молитву во имя Иисуса.' },
      { color:'#7e22ce', icon:'⚡', name:'Чудеса',               desc:'Действия сверхъестественной силы, превосходящие законы природы — знамения, открывающие Божью славу.' },
      { color:'#b45309', icon:'🧭', name:'Мудрость и знание',    desc:'Данный Духом совет для конкретной ситуации или сверхъестественное знание фактов, неизвестных естественным путём.' },
      { color:'#0e7490', icon:'🔍', name:'Различение духов',     desc:'Способность распознать, что от Бога, что от человеческой природы, а что от злых духовных сил.' },
      { color:'#4f46e5', icon:'🎓', name:'Учение',               desc:'Дух даёт некоторым верующим объяснять Писание с необычной ясностью, так что другие меняются от него.' },
      { color:'#065f46', icon:'🤲', name:'Вера и щедрость',      desc:'Необычная вера, двигающая горы в конкретных ситуациях; и сверхъестественная щедрость в даянии.' },
    ],
    fitbLabel:'✏️ Задание — Заполни пропуски', fitbQ:'Нажми слово из банка, затем пропуск, куда оно подходит. Нажми заполненный пропуск без выбора, чтобы вернуть слово!',
    fitbKidNote:'💡 Нажми слово → затем пропуск. Нажми заполненный пропуск, чтобы вернуть слово обратно!',
    fitbSentences: [
      { id:'b1', pre:'1. Говорить на особом языке, данном Духом Святым — это дар', post:'.' },
      { id:'b2', pre:'2. Когда Бог исцеляет тело через молитву, это', post:'.' },
      { id:'b3', pre:'3. Делиться ободряющим посланием от Бога — это', post:'.' },
      { id:'b4', pre:'4. Знать именно то, что нужно сказать — это дар', post:'.' },
      { id:'b5', pre:'5. Непоколебимое доверие Богу — это дар', post:'.' },
      { id:'b6', pre:'6. Объяснять Библию так ясно, что люди понимают — это', post:'.' },
    ],
    fitbCheckBtn:'ПРОВЕРИТЬ ОТВЕТЫ ✓', fitbErr:'❌ Некоторые ответы неверны или отсутствуют — проверь выделенные!',
    fitbTruth:'🎁 Ты знаешь все дары! Помни — они нужны для помощи ДРУГИМ!',
    fitbTruthVerse:'"Каждому даётся проявление Духа на пользу." — 1 Коринфянам 12:7',
    unlock:'🎉 Раздел 6 завершён! Раздел 7 теперь открыт — прокрути вниз!',
  },
  s7: {
    banner:'❤️ РАЗДЕЛ 7 · ЖИЗНЬ СО СВЯТЫМ ДУХОМ ❤️', eyebrow:'Еф. 5 · Рим. 8 · Гал. 5', title:'Жизнь со Святым Духом',
    intro:'Святой Дух — это не просто учение, в которое надо верить — Он Личность, с которой нужно ходить каждый день. Писание ясно учит, как относиться к Нему, сотрудничать с Ним и не мешать Его работе в нашей жизни.',
    warningTitle:'Не огорчай Святого Духа',
    warningBody:'"Не огорчайте Святого Духа Божия, которым вы запечатлены в день искупления. Всякое раздражение и ярость, и гнев, и крик, и злоречие со всякою злобою да будут удалены от вас." Потому что Он — Личность с чувствами, грех огорчает Его — особенно горечь и непрощение.',
    warningRef:'Ефесянам 4:30–31 · Синод.',
    pq:'"Духа не угашайте. Пророчества не уничижайте. Всё испытывайте, хорошего держитесь."',
    pqRef:'1 Фессалоникийцам 5:19–21 · Синод. — Не подавляйте Его действие',
    practices: [
      { n:1, title:'Непрестанно наполняйся',      body:'Повеление Павла стоит в настоящем продолженном времени — "продолжай наполняться". Это не единоразовое событие, а ежедневная сдача Ему.', ref:'Ефесянам 5:18' },
      { n:2, title:'Ходи по Духу',                body:'"Поступайте по духу, и вы не будете исполнять вожделений плоти." Следуй Его водительству шаг за шагом весь день.', ref:'Галатам 5:16' },
      { n:3, title:'Молись в Духе',               body:'"Молясь всегда с молитвою и прошением в Духе." Позволь Духу направлять и усиливать твою молитвенную жизнь.', ref:'Еф. 6:18 · Иуды 1:20' },
      { n:4, title:'Будь водим Духом',             body:'"Ибо все, водимые Духом Божиим, суть сыны Божии." Он будет направлять твои решения, отношения и призвание.', ref:'Римлянам 8:14' },
      { n:5, title:'Думай о духовном',             body:'"Помышления духовные — жизнь и мир." То, о чём мы размышляем, влияет на то, как Дух течёт через нас.', ref:'Римлянам 8:6' },
      { n:6, title:'Дух помогает в немощи',        body:'"Дух подкрепляет нас в немощах наших... Сам Дух ходатайствует за нас воздыханиями неизреченными." Ты никогда не молишься один.', ref:'Римлянам 8:26' },
    ],
    decoderLabel:'🔐 Дешифровщик — Финальное задание!', decoderQ:'Каждый эмодзи = одно слово. Нажимай каждый ключ ниже, чтобы расшифровать скрытый стих!',
    decoderDisplayTitle:'РАСШИФРУЙ СТИХ:', decoderKeyTitle:'КЛЮЧ — НАЖМИ КАЖДЫЙ:',
    decoderCheckBtn:'ОТКРЫТЬ СТИХ ✓',
    decoderErr: (n: number) => `🔐 Продолжай нажимать! ${n} из 7 расшифровано.`,
    decoderTruth:'💙 ТОТ В ВАС БОЛЬШЕ! Святой Дух в тебе сильнее ВСЕГО в мире!',
    decoderTruthVerse:'"Тот, Кто в вас, больше того, кто в мире." — 1 Иоанна 4:4 · Синод.',
    bigTitle:'Главная мысль',
    bigBody:'Святой Дух — это Бог, живущий ВНУТРИ каждого верующего прямо сейчас.\nОн твой Помощник, Учитель, Утешитель, Наставник и Податель силы.\nОн преобразует твой характер, наделяет тебя дарами\nи гарантирует, что ты никогда не будешь один. 💛\n\n«Тот, Кто в вас, больше того, кто в мире.» — 1 Иоанна 4:4',
    wonTitle:'Ты прошёл всё!', wonBody:'Ты завершил все разделы урока о Святом Духе!\nБог так гордится тобой! 🌟',
    wonQuote:'"Тот, Кто в вас, больше того, кто в мире."', wonQuoteRef:'1 Иоанна 4:4 · Синод.',
    wonBtn:'⭐ Продолжай исследовать!',
  },
  lockMsg: (prev: number) => `Заверши Раздел ${prev}, чтобы открыть эту часть!`,
  resetBtn:'↺ Сбросить прогресс',
  resetConfirm:'Сбросить весь прогресс по этому уроку?',
  unlockBanner: (sec: number) => `🎉 Раздел ${sec} завершён! Раздел ${sec + 1} теперь открыт — прокрути вниз!`,
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: '#fff', borderRadius: 22, padding: '22px 20px',
  boxShadow: '0 3px 18px rgba(0,0,0,.08)', marginBottom: 16,
}
const roleCard = (color: string): React.CSSProperties => ({
  ...card, borderLeft: `6px solid ${color}`,
})
const symCard = (bg: string): React.CSSProperties => ({
  borderRadius: 22, padding: '22px 18px', textAlign: 'center',
  boxShadow: '0 3px 18px rgba(0,0,0,.08)', background: bg,
})

// ─── Helper: section lock overlay ────────────────────────────────────────────
function LockCard({ msg }: { prevSec?: number; msg: string }) {
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

// ─── Helper: section-complete unlock banner ────────────────────────────────────
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
export default function HolySpiritLesson() {
  const { language } = useLanguage()
  void (language === 'ru' ? lessonsRu[0] : lessons[0]) // currentLesson reserved for future use

  const L = language === 'ru' ? RU : EN
  const isRu = language === 'ru'

  // dynamic word-search grid — generated in useEffect below
  const [wsGrid,   setWsGrid]   = useState<string[][]>([])
  const [wsCoords, setWsCoords] = useState<Record<string, [number, number][]>>({})
  const [wsSel,   setWsSel]   = useState<Set<string>>(new Set())
  const [wsFound, setWsFound] = useState<Set<string>>(new Set())
  const [wsStart, setWsStart] = useState<[number,number]|null>(null)

  // active scramble data
  const SC1_TILES_ACTIVE = isRu ? SC1_TILES_RU : SC1_TILES
  const SC1_ANS_ACTIVE   = isRu ? SC1_ANS_RU   : SC1_ANS
  const SC2_TILES_ACTIVE = isRu ? SC2_TILES_RU : SC2_TILES
  const SC2_ANS_ACTIVE   = isRu ? SC2_ANS_RU   : SC2_ANS
  // active fruit data
  const FRUITS_ACTIVE    = isRu ? FRUITS_RU     : FRUITS
  // active FITB data
  const FITB_ANSWERS_ACTIVE = isRu ? FITB_ANSWERS_RU : FITB_ANSWERS
  const FITB_WORDS_ACTIVE   = isRu ? FITB_WORDS_RU   : FITB_WORDS
  // active decoder data
  const DECODER_KEYS_ACTIVE = isRu ? DECODER_KEYS_RU : DECODER_KEYS

  // ─── Progress state ──────────────────────────────────────────────────────────
  const [unlocked, setUnlocked] = useState<Set<number>>(() => {
    try {
      const u = typeof window !== 'undefined' && localStorage.getItem('hs_unlocked')
      if (u) return new Set(JSON.parse(u) as number[])
    } catch {}
    return new Set([1])
  })
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      const d = typeof window !== 'undefined' && localStorage.getItem('hs_done')
      if (d) return new Set(JSON.parse(d) as string[])
    } catch {}
    return new Set()
  })
  const [won, setWon]           = useState(false)

  useEffect(() => {
    localStorage.setItem('hs_unlocked', JSON.stringify([...unlocked]))
    localStorage.setItem('hs_done',     JSON.stringify([...done]))
  }, [unlocked, done])

  useEffect(() => {
    const wordList = isRu
      ? ['ГОЛУБЬ', 'ОГОНЬ', 'ВЕТЕР', 'ВОДА', 'МАСЛО', 'ПЕЧАТЬ']
      : ['DOVE', 'FIRE', 'WIND', 'OIL', 'WATER', 'SEAL']
    const alpha = isRu ? 'АБВГДЕЖЗИКЛМНОПРСТУХ' : 'ABCDEFGHIKLMNOPRSTUW'
    const { grid, coords } = generateWordSearchWithCoords(wordList, 10, 10, alpha)
    /* eslint-disable react-hooks/set-state-in-effect */
    setWsGrid(grid)
    setWsCoords(coords)
    setWsSel(new Set())
    setWsFound(new Set())
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isRu]) // eslint-disable-line react-hooks/exhaustive-deps

  function solve(id: string, sec: number) {
    if (done.has(id)) return
    const newDone = new Set([...done, id])
    setDone(newDone)
    const reqs = SECTION_REQS[sec]
    if (reqs.every(r => newDone.has(r))) {
      if (sec < 7) {
        setUnlocked(prev => new Set([...prev, sec + 1]))
        setTimeout(() => {
          document.getElementById(`sec-${sec + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 700)
      } else {
        setTimeout(() => setWon(true), 700)
      }
    }
  }

  const secDoneCount = Object.entries(SECTION_REQS).filter(([,reqs]) => reqs.every(r => done.has(r))).length
  const stars = '⭐'.repeat(secDoneCount) + '☆'.repeat(7 - secDoneCount)

  // ─── Section 1: Rebus ────────────────────────────────────────────────────────
  const [r1, setR1] = useState('')
  const [r2, setR2] = useState('')
  const [r1Err, setR1Err] = useState('')
  const [r2Err, setR2Err] = useState('')

  function checkR1() {
    const v = r1.trim().toLowerCase()
    const ok = isRu
      ? ['живёт','живет','живёт в','живет в'].some(a => v === a || v.startsWith(a))
      : ['lives','lives in','lives inside'].some(a => v === a || v.startsWith(a))
    if (ok) {
      solve('r1', 1)
    } else {
      setR1Err(L.s1.r1Err)
      setTimeout(() => setR1Err(''), 2500)
    }
  }
  function checkR2() {
    const v = r2.trim().toLowerCase()
    const ok = isRu
      ? ['троица','один бог','единый бог','3 в 1','три в одном','три личности один'].some(a => v === a || v.startsWith(a))
      : ['trinity','3 in 1','three in one','one god','three persons one god','3 persons one god'].some(a => v === a || v.startsWith(a))
    if (ok) {
      solve('r2', 1)
    } else {
      setR2Err(L.s1.r2Err)
      setTimeout(() => setR2Err(''), 2500)
    }
  }

  // ─── Section 2: Word search ──────────────────────────────────────────────────

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
      if (wsFound.has(word) && coords.some(([rr,cc]) => rr === r && cc === c)) return
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
      const wordKeys = coords.map(([rr,cc]) => `${rr},${cc}`)
      if (selSet.size === wordKeys.length && wordKeys.every(k => selSet.has(k))) {
        const newFound = new Set([...wsFound, word])
        setWsFound(newFound)
        setWsSel(new Set())
        setWsStart(null)
        if (newFound.size === Object.keys(wsCoords).length) solve('ws', 2)
        return
      }
    }
    setWsSel(selSet)
    setWsStart(null)
    setTimeout(() => setWsSel(new Set()), 600)
  }

  function wsCellState(r: number, c: number): 'found' | 'selected' | 'normal' {
    for (const [word, coords] of Object.entries(wsCoords)) {
      if (wsFound.has(word) && coords.some(([rr,cc]) => rr === r && cc === c)) return 'found'
    }
    return wsSel.has(`${r},${c}`) ? 'selected' : 'normal'
  }

  // ─── Section 3: Match games ───────────────────────────────────────────────────
  const [m1L, setM1L] = useState<string|null>(null)
  const [m1R, setM1R] = useState<string|null>(null)
  const [m1Matched, setM1Matched] = useState<Set<string>>(new Set())
  const [m1Shake,   setM1Shake]   = useState<Set<string>>(new Set())
  const [m2L, setM2L] = useState<string|null>(null)
  const [m2R, setM2R] = useState<string|null>(null)
  const [m2Matched, setM2Matched] = useState<Set<string>>(new Set())
  const [m2Shake,   setM2Shake]   = useState<Set<string>>(new Set())

  function doMatch(
    newLeft: string|null, newRight: string|null,
    matched: Set<string>,
    setMatched: (s: Set<string>) => void,
    setL: (v: string|null) => void,
    setR: (v: string|null) => void,
    setShake: (s: Set<string>) => void,
    challengeId: string,
  ) {
    if (!newLeft || !newRight) return
    if (newLeft === newRight) {
      const nm = new Set([...matched, newLeft])
      setMatched(nm)
      setL(null); setR(null)
      if (nm.size === 4) solve(challengeId, 3)
    } else {
      setShake(new Set([newLeft, newRight]))
      setTimeout(() => { setShake(new Set()); setL(null); setR(null) }, 700)
    }
  }

  function pickLeft1(id: string)  { if (m1Matched.has(id)) return; setM1L(id); doMatch(id, m1R, m1Matched, setM1Matched, setM1L, setM1R, setM1Shake, 'match1') }
  function pickRight1(id: string) { if (m1Matched.has(id)) return; setM1R(id); doMatch(m1L, id, m1Matched, setM1Matched, setM1L, setM1R, setM1Shake, 'match1') }
  function pickLeft2(id: string)  { if (m2Matched.has(id)) return; setM2L(id); doMatch(id, m2R, m2Matched, setM2Matched, setM2L, setM2R, setM2Shake, 'match2') }
  function pickRight2(id: string) { if (m2Matched.has(id)) return; setM2R(id); doMatch(m2L, id, m2Matched, setM2Matched, setM2L, setM2R, setM2Shake, 'match2') }

  function matchItemStyle(id: string, side: 'L'|'R', isLeft: boolean,
    lSel: string|null, rSel: string|null,
    matched: Set<string>, shake: Set<string>,
    color: string
  ): React.CSSProperties {
    const sel = isLeft ? lSel === id : rSel === id
    const isMatched = matched.has(id)
    const isShake = shake.has(id)
    return {
      padding: '12px 10px', borderRadius: 14, cursor: isMatched ? 'default' : 'pointer',
      fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '0.88rem',
      border: `3px solid ${isMatched ? '#40b870' : sel ? color : '#ddd'}`,
      background: isMatched ? '#edfaf2' : sel ? color : '#fafafa',
      color: isMatched ? '#0a6830' : sel ? '#fff' : '#334',
      textAlign: 'center', lineHeight: 1.4, transition: 'background .15s, border-color .15s',
      animation: isShake ? 'shake 0.35s ease' : undefined,
      userSelect: 'none',
    }
  }

  // ─── Section 4: Scramble ──────────────────────────────────────────────────────
  const [az1,     setAz1]     = useState<Tile[]>([])
  const [az2,     setAz2]     = useState<Tile[]>([])
  const [az1Used, setAz1Used] = useState<Set<string>>(new Set())
  const [az2Used, setAz2Used] = useState<Set<string>>(new Set())

  function addToAz1(tile: Tile) {
    if (az1Used.has(tile.uid)) return
    const newUsed = new Set([...az1Used, tile.uid])
    const newAz   = [...az1, tile]
    setAz1Used(newUsed); setAz1(newAz)
    if (newAz.length === SC1_ANS_ACTIVE.length && newAz.every((t,i) => t.word.toLowerCase() === SC1_ANS_ACTIVE[i])) solve('sc1', 4)
  }
  function removeFromAz1(tile: Tile) {
    setAz1Used(p => { const n = new Set(p); n.delete(tile.uid); return n })
    setAz1(p => p.filter(t => t.uid !== tile.uid))
  }
  function addToAz2(tile: Tile) {
    if (az2Used.has(tile.uid)) return
    const newUsed = new Set([...az2Used, tile.uid])
    const newAz   = [...az2, tile]
    setAz2Used(newUsed); setAz2(newAz)
    if (newAz.length === SC2_ANS_ACTIVE.length && newAz.every((t,i) => t.word.toLowerCase() === SC2_ANS_ACTIVE[i])) solve('sc2', 4)
  }
  function removeFromAz2(tile: Tile) {
    setAz2Used(p => { const n = new Set(p); n.delete(tile.uid); return n })
    setAz2(p => p.filter(t => t.uid !== tile.uid))
  }
  function scTileColor(tile: Tile, i: number, ans: string[]) {
    return ans[i] && tile.word.toLowerCase() === ans[i] ? '#2d8a50' : '#1a3a6e'
  }
  function scHint(az: Tile[], ans: string[]) {
    if (!az.length) return L.s4.scHintEmpty
    const ok = az.filter((t,i) => ans[i] && t.word.toLowerCase() === ans[i]).length
    if (isRu) {
      const wordForm = az.length === 1 ? 'слово' : 'слов'
      return `✅ ${ok} из ${az.length} ${wordForm} на правильном месте!`
    }
    return `✅ ${ok} of ${az.length} word${az.length > 1 ? 's' : ''} in the right spot!`
  }
  function resetSc1() { setAz1([]); setAz1Used(new Set()) }
  function resetSc2() { setAz2([]); setAz2Used(new Set()) }

  // ─── Section 5: Fruit reveal ───────────────────────────────────────────────────
  const [fruitsOpen, setFruitsOpen] = useState<Set<number>>(new Set())
  function revealFruit(i: number) {
    const next = new Set([...fruitsOpen, i])
    setFruitsOpen(next)
    if (next.size === 9) solve('fruits', 5)
  }

  // ─── Section 6: Fill-in-blank ─────────────────────────────────────────────────
  const [wbSel,     setWbSel]     = useState<string|null>(null)
  const [bk,        setBk]        = useState<Record<string,string>>({b1:'',b2:'',b3:'',b4:'',b5:'',b6:''})
  const [fitbErr,   setFitbErr]   = useState('')
  const [fitbCheck, setFitbCheck] = useState(false)

  const usedWords = Object.values(bk).filter(Boolean)
  function wb6Pick(word: string) {
    if (usedWords.includes(word)) return
    setWbSel(prev => prev === word ? null : word)
  }
  function wb6Drop(id: string) {
    if (bk[id] && !wbSel) { setBk(p => ({...p, [id]: ''})); return }
    if (!wbSel) return
    setBk(p => ({...p, [id]: wbSel}))
    setWbSel(null)
  }
  function blankBorder(id: string) {
    if (!fitbCheck || !bk[id]) return bk[id] ? '#40b870' : '#ccc'
    return bk[id] === FITB_ANSWERS_ACTIVE[id] ? '#40b870' : '#e04040'
  }
  function checkFitb() {
    setFitbCheck(true)
    if (Object.entries(FITB_ANSWERS_ACTIVE).every(([id, ans]) => bk[id] === ans)) {
      setFitbErr('')
      solve('fitb', 6)
    } else {
      setFitbErr(L.s6.fitbErr)
      setTimeout(() => { setFitbErr(''); setFitbCheck(false) }, 3000)
    }
  }

  // ─── Section 7: Decoder ───────────────────────────────────────────────────────
  const [decoded, setDecoded] = useState<Record<string,string>>({})
  const [decErr,  setDecErr]  = useState('')

  function decodeKey(id: string, word: string) {
    if (decoded[id]) return
    const next = {...decoded, [id]: word}
    setDecoded(next)
    if (Object.keys(next).length >= 7) solve('decoder', 7)
  }
  function checkDecoder() {
    if (Object.keys(decoded).length >= 7) { solve('decoder', 7) }
    else { setDecErr(L.s7.decoderErr(Object.keys(decoded).length)); setTimeout(() => setDecErr(''), 2000) }
  }

  // ─── Reset all progress ────────────────────────────────────────────────────────
  function resetAll() {
    if (!confirm(L.resetConfirm)) return
    localStorage.removeItem('hs_unlocked'); localStorage.removeItem('hs_done')
    setUnlocked(new Set([1])); setDone(new Set()); setWon(false)
    setR1(''); setR2(''); setR1Err(''); setR2Err('')
    setWsSel(new Set()); setWsFound(new Set())
    setM1L(null); setM1R(null); setM1Matched(new Set()); setM1Shake(new Set())
    setM2L(null); setM2R(null); setM2Matched(new Set()); setM2Shake(new Set())
    setAz1([]); setAz2([]); setAz1Used(new Set()); setAz2Used(new Set())
    setFruitsOpen(new Set())
    setWbSel(null); setBk({b1:'',b2:'',b3:'',b4:'',b5:'',b6:''}); setFitbErr(''); setFitbCheck(false)
    setDecoded({}); setDecErr('')
  }

  // ════════════════════ JSX ════════════════════════════════════════════════════

  const secPad: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '44px 18px 52px' }
  const tileBase: React.CSSProperties = {
    padding: '9px 13px', borderRadius: 12, color: '#fff',
    fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '0.9rem',
    cursor: 'pointer', userSelect: 'none', display: 'inline-block',
  }
  const ansTile = (tile: Tile, i: number, ans: string[]): React.CSSProperties => ({
    ...tileBase, background: scTileColor(tile, i, ans),
    boxShadow: ans[i] && tile.word.toLowerCase() === ans[i] ? '0 0 0 3px #86efac' : 'none',
  })

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
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉🕊️🔥</div>
          <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '2rem', color: '#fff', marginBottom: 14, textShadow: '0 0 40px rgba(255,179,71,.8)' }}>
            {L.s7.wonTitle}
          </h2>
          <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: 'rgba(255,255,255,.85)', lineHeight: 1.7, marginBottom: 20, fontSize: '1.05rem' }}>
            {L.s7.wonBody.split('\n').map((line, i) => <span key={i}>{line}{i < L.s7.wonBody.split('\n').length - 1 && <br />}</span>)}
          </p>
          <blockquote style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(255,255,255,.75)', borderLeft: '3px solid var(--flame2)', paddingLeft: 14, textAlign: 'left', maxWidth: 380, lineHeight: 1.8, marginBottom: 28 }}>
            {L.s7.wonQuote}
            <span style={{ display: 'block', fontStyle: 'normal', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.72rem', letterSpacing: 1, textTransform: 'uppercase', color: 'var(--flame2)', marginTop: 6 }}>{L.s7.wonQuoteRef}</span>
          </blockquote>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setWon(false)}
              style={{ padding: '14px 32px', background: 'linear-gradient(135deg,var(--fire),var(--flame2))', color: '#fff', border: 'none', borderRadius: 18, fontFamily: 'var(--font-nunito)', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer' }}
            >
              {L.s7.wonBtn}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('hs_unlocked')
                localStorage.removeItem('hs_done')
                window.location.reload()
              }}
              style={{ padding: '14px 32px', background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#3b2307', border: 'none', borderRadius: 18, fontFamily: 'var(--font-nunito)', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer' }}
            >
              {isRu ? '🔄 Пройти заново' : '🔄 Do It Again'}
            </button>
          </div>
        </div>
      )}

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '70vh',
        background: 'radial-gradient(ellipse at 50% 50%,#2a1050 0%,#1a0f40 35%,#0d1f3c 60%,#060e20 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px 100px', overflow: 'hidden',
      }}>
        {/* Hero Image */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 800, marginBottom: 40, zIndex: 10 }}>
          <img
            src="/images/jr/holy-spirit-hero.png"
            alt="The Holy Spirit"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 24,
              filter: 'drop-shadow(0 20px 50px rgba(0,0,0,.3))',
            }}
          />
        </div>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem,6vw,3.2rem)', color: '#fff', textShadow: '0 0 30px rgba(126,200,227,.8)', marginBottom: 10, lineHeight: 1.2 }}>
          {L.hero.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--flame2)', marginBottom: 20 }}>
          {L.hero.subtitle}
        </p>
        <blockquote style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', color: 'rgba(255,255,255,.9)', fontSize: '1rem', borderLeft: '3px solid rgba(126,200,227,.7)', paddingLeft: 16, textAlign: 'left', maxWidth: 480, lineHeight: 1.85 }}>
          {L.hero.quote}
          <span style={{ display: 'block', fontStyle: 'normal', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.72rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--flame2)', marginTop: 8 }}>{L.hero.quoteRef}</span>
        </blockquote>
      </section>

      {/* ── Progress Bar ───────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 52, zIndex: 99,
        background: 'linear-gradient(90deg,#0a1228,#1a3060)',
        padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '2px solid rgba(126,200,227,.2)',
      }}>
        <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.76rem', fontWeight: 900, color: 'rgba(255,255,255,.7)', whiteSpace: 'nowrap', letterSpacing: 1 }}>
          {L.progress}
        </span>
        <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,.12)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(secDoneCount / 7) * 100}%`, background: 'linear-gradient(90deg,#ffb347,#ff6b1a)', borderRadius: 10, transition: 'width .5s cubic-bezier(.34,1.56,.64,1)' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1rem', letterSpacing: 2, minWidth: 110, textAlign: 'right' }}>{stars}</span>
      </div>

      {/* ════════ SECTION 1 — WHO IS HE ═══════════════════════════ */}
      <div id="sec-1" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s1.banner}
        </div>
        <div className="alt-bg3">
          <div style={secPad}>
            <p className="eyebrow">{L.s1.eyebrow}</p>
            <h2 className="sec-title">{L.s1.title}</h2>
            <p className="sec-intro">{L.s1.intro}</p>
            <div className="kid-note">{L.s1.kidNote}</div>

            {/* Trinity Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
              {L.s1.trinity.map(p => (
                <div key={p.name} style={{ borderRadius: 20, padding: '24px 18px', textAlign: 'center', border: `3px solid ${p.border}`, background: p.bg }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: 8 }}>{p.icon}</span>
                  <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.9rem', color: p.nameColor, marginBottom: 8 }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.88rem', fontWeight: 700, color: '#445', lineHeight: 1.65 }}>{p.desc}</div>
                  <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: p.nameColor, marginTop: 6 }}>{p.ref}</div>
                </div>
              ))}
            </div>

            {/* Pull quote */}
            <div className="pull-quote" style={{ marginBottom: 28 }}>
              <p className="pq-text">{L.s1.pq}</p>
              <span className="pq-ref">{L.s1.pqRef}</span>
            </div>

            {/* Trait cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginBottom: 28 }}>
              {L.s1.traits.map(t => (
                <div key={t.title} style={card}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '2rem', flexShrink: 0 }}>{t.icon}</span>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1rem', color: 'var(--deep)', marginBottom: 4 }}>{t.title}</h4>
                      <p style={{ fontSize: '.88rem', fontWeight: 700, color: '#445', lineHeight: 1.65 }}>{t.body}</p>
                      <small style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, color: 'var(--fire)', letterSpacing: 1, textTransform: 'uppercase' }}>{t.ref}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Challenges ── */}
            {/* Rebus 1 */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: '#e87030' }}>
              <p className="puzzle-label">{L.s1.r1Label}</p>
              <p className="puzzle-q">{L.s1.r1Q}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2.4rem', display: 'block' }}>🏠</span><span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa' }}>{L.s1.r1Home}</span></div>
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.4rem', fontWeight: 900, color: '#ccc' }}>+</span>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2.4rem', display: 'block' }}>❤️</span><span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa' }}>{L.s1.r1Heart}</span></div>
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.4rem', fontWeight: 900, color: '#ccc' }}>=</span>
                <input
                  value={r1} onChange={e => setR1(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkR1()}
                  disabled={done.has('r1')}
                  placeholder={L.s1.r1Placeholder}
                  style={{ minWidth: 140, height: 42, border: `3px dashed ${done.has('r1') ? '#40b870' : '#ccc'}`, borderRadius: 12, background: done.has('r1') ? '#edfaf2' : '#fafafa', fontFamily: 'var(--font-nunito)', fontWeight: 900, textAlign: 'center', fontSize: '0.95rem', padding: '0 8px' }}
                />
              </div>
              {!done.has('r1') && <button className="pz-btn" style={{ background: '#e87030' }} onClick={checkR1}>{L.s1.r1Btn}</button>}
              <p className="pz-hint">{L.s1.r1Hint}</p>
              {r1Err && <p className="pz-error">{r1Err}</p>}
              <TruthBanner show={done.has('r1')} color="#e87030">
                {L.s1.r1Truth}
                <span className="truth-verse">{L.s1.r1TruthVerse}</span>
              </TruthBanner>
            </div>

            {/* Rebus 2 */}
            <div className="puzzle-box" style={{ ['--pz-color' as string]: '#1a3a8e' }}>
              <p className="puzzle-label">{L.s1.r2Label}</p>
              <p className="puzzle-q">{L.s1.r2Q}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2.4rem', display: 'block' }}>☀️</span><span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa' }}>{L.s1.r2Father}</span></div>
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.4rem', fontWeight: 900, color: '#ccc' }}>+</span>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2.4rem', display: 'block' }}>✝️</span><span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa' }}>{L.s1.r2Son}</span></div>
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.4rem', fontWeight: 900, color: '#ccc' }}>+</span>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2.4rem', display: 'block' }}>🕊️</span><span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#aaa' }}>{L.s1.r2Spirit}</span></div>
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '1.4rem', fontWeight: 900, color: '#ccc' }}>=</span>
                <input
                  value={r2} onChange={e => setR2(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkR2()}
                  disabled={done.has('r2')}
                  placeholder={L.s1.r2Placeholder}
                  style={{ minWidth: 140, height: 42, border: `3px dashed ${done.has('r2') ? '#40b870' : '#ccc'}`, borderRadius: 12, background: done.has('r2') ? '#edfaf2' : '#fafafa', fontFamily: 'var(--font-nunito)', fontWeight: 900, textAlign: 'center', fontSize: '0.95rem', padding: '0 8px' }}
                />
              </div>
              {!done.has('r2') && <button className="pz-btn" style={{ background: '#1a3a8e' }} onClick={checkR2}>{L.s1.r2Btn}</button>}
              <p className="pz-hint">{L.s1.r2Hint}</p>
              {r2Err && <p className="pz-error">{r2Err}</p>}
              <TruthBanner show={done.has('r2')} color="#1a3a8e">
                {L.s1.r2Truth.split('\n').map((line, i) => <span key={i}>{line}{i < L.s1.r2Truth.split('\n').length - 1 && <br />}</span>)}
                <span className="truth-verse">{L.s1.r2TruthVerse}</span>
              </TruthBanner>
            </div>

            {done.has('r1') && done.has('r2') && <UnlockBanner msg={L.s1.unlock} />}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">🕊️</span><div className="div-line"/></div>

      {/* ════════ SECTION 2 — SYMBOLS ══════════════════════════════ */}
      <div id="sec-2" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s2.banner}
        </div>
        <div className="alt-bg2">
          <div style={secPad}>
            {!unlocked.has(2) ? <LockCard prevSec={1} msg={L.lockMsg(1)} /> : (
              <>
                <p className="eyebrow">{L.s2.eyebrow}</p>
                <h2 className="sec-title">{L.s2.title}</h2>
                <p className="sec-intro">{L.s2.intro}</p>

                {/* Symbols illustration */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <img src="/images/jr/holy-spirit-symbols.png" alt="Holy Spirit Symbols" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }} />
                </div>

                {/* Symbol cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(185px,1fr))', gap: 18, marginBottom: 28 }}>
                  {L.s2.symbols.map(s => (
                    <div key={s.name} style={symCard(s.bg)}>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: 10 }}>{s.icon}</span>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.85rem', fontWeight: 700, color: s.color, marginBottom: 8 }}>{s.name}</div>
                      <div style={{ fontSize: '.88rem', fontWeight: 700, color: '#445', lineHeight: 1.65, marginBottom: 8 }}>{s.kid}</div>
                      <div style={{ fontSize: '.8rem', fontStyle: 'italic', color: '#556', lineHeight: 1.6, marginBottom: 4 }}>{s.verse}</div>
                      <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.72rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: s.color }}>{s.ref}</div>
                    </div>
                  ))}
                </div>

                <div className="pull-quote" style={{ marginBottom: 28 }}>
                  <p className="pq-text">{L.s2.pq}</p>
                  <span className="pq-ref">{L.s2.pqRef}</span>
                </div>

                {/* Word search challenge */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#0a6090' }}>
                  <p className="puzzle-label">{L.s2.wsLabel}</p>
                  <p className="puzzle-q">{L.s2.wsQ}</p>

                  {/* Word list */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                    {Object.keys(wsCoords).map(w => (
                      <span key={w} style={{
                        fontFamily: 'var(--font-nunito)', fontSize: '.88rem', fontWeight: 900,
                        padding: '5px 12px', borderRadius: 20,
                        background: wsFound.has(w) ? '#0a6090' : '#eee',
                        color: wsFound.has(w) ? '#fff' : '#555',
                        textDecoration: wsFound.has(w) ? 'line-through' : 'none',
                      }}>
                        {isRu
                          ? (w === 'ГОЛУБЬ' ? '🕊️' : w === 'ОГОНЬ' ? '🔥' : w === 'ВЕТЕР' ? '💨' : w === 'ВОДА' ? '💧' : w === 'МАСЛО' ? '🫙' : '🔏')
                          : (w === 'DOVE' ? '🕊️' : w === 'FIRE' ? '🔥' : w === 'WIND' ? '💨' : w === 'WATER' ? '💧' : w === 'OIL' ? '🫙' : '🔏')
                        } {w}
                      </span>
                    ))}
                  </div>

                  {/* Grid — 10×10, all 8 directions */}
                  <div style={{ overflowX: 'auto', textAlign: 'center', paddingBottom: 6 }}>
                    {wsGrid.length === 0 ? (
                      <p style={{ fontFamily: 'var(--font-nunito)', color: '#aaa', padding: 20 }}>Building puzzle…</p>
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
                                background: state === 'found' ? '#0a6090' : state === 'selected' ? '#fff0aa' : '#fff',
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

                  <p className="pz-hint">{L.s2.wsHint}</p>
                  {!done.has('ws') && <button className="pz-btn" style={{ background: '#888', marginTop: 8 }} onClick={() => setWsSel(new Set())}>{L.s2.wsClear}</button>}
                  <TruthBanner show={done.has('ws')} color="#0a6090">
                    {L.s2.wsTruth}
                    <span className="truth-verse">{L.s2.wsTruthVerse}</span>
                  </TruthBanner>
                </div>

                {done.has('ws') && <UnlockBanner msg={L.s2.unlock} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">⚡</span><div className="div-line"/></div>

      {/* ════════ SECTION 3 — ROLES ════════════════════════════════ */}
      <div id="sec-3" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s3.banner}
        </div>
        <div className="alt-bg5">
          <div style={secPad}>
            {!unlocked.has(3) ? <LockCard prevSec={2} msg={L.lockMsg(2)} /> : (
              <>
                <p className="eyebrow">{L.s3.eyebrow}</p>
                <h2 className="sec-title">{L.s3.title}</h2>
                <p className="sec-intro">{L.s3.intro}</p>

                {/* Role cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginBottom: 28 }}>
                  {L.s3.roles.map(r => (
                    <div key={r.name} style={roleCard(r.color)}>
                      <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 8 }}>{r.icon}</span>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.88rem', color: r.color, marginBottom: 8 }}>{r.name}</div>
                      <div style={{ fontSize: '.9rem', fontWeight: 700, color: '#334', lineHeight: 1.75, marginBottom: 8 }}>{r.desc}</div>
                      <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: r.color }}>{r.ref}</div>
                    </div>
                  ))}
                </div>

                {/* Match Round 1 */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#9050d0' }}>
                  <p className="puzzle-label">{L.s3.m1Label}</p>
                  <p className="puzzle-q">{L.s3.m1Q}</p>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.9rem', fontWeight: 900, textAlign: 'center', color: '#888', marginBottom: 10 }}>
                    {L.s3.m1CountPrefix} {m1Matched.size} / 4
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {L.s3.m1Left.map(item => (
                        <div key={item.id} onClick={() => !done.has('match1') && pickLeft1(item.id)}
                          style={matchItemStyle(item.id,'L',true,m1L,m1R,m1Matched,m1Shake,'#9050d0')}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {L.s3.m1Right.map(item => (
                        <div key={item.id} onClick={() => !done.has('match1') && pickRight1(item.id)}
                          style={matchItemStyle(item.id,'R',false,m1L,m1R,m1Matched,m1Shake,'#9050d0')}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <TruthBanner show={done.has('match1')} color="#9050d0">
                    {L.s3.m1Truth}
                    <span className="truth-verse">{L.s3.m1TruthVerse}</span>
                  </TruthBanner>
                </div>

                {/* Match Round 2 */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#e84070' }}>
                  <p className="puzzle-label">{L.s3.m2Label}</p>
                  <p className="puzzle-q">{L.s3.m2Q}</p>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.9rem', fontWeight: 900, textAlign: 'center', color: '#888', marginBottom: 10 }}>
                    {L.s3.m1CountPrefix} {m2Matched.size} / 4
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {L.s3.m2Left.map(item => (
                        <div key={item.id} onClick={() => !done.has('match2') && pickLeft2(item.id)}
                          style={matchItemStyle(item.id,'L',true,m2L,m2R,m2Matched,m2Shake,'#e84070')}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {L.s3.m2Right.map(item => (
                        <div key={item.id} onClick={() => !done.has('match2') && pickRight2(item.id)}
                          style={matchItemStyle(item.id,'R',false,m2L,m2R,m2Matched,m2Shake,'#e84070')}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <TruthBanner show={done.has('match2')} color="#e84070">
                    {L.s3.m2Truth}
                    <span className="truth-verse">{L.s3.m2TruthVerse}</span>
                  </TruthBanner>
                </div>

                {done.has('match1') && done.has('match2') && <UnlockBanner msg={L.s3.unlock} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">📖</span><div className="div-line"/></div>

      {/* ════════ SECTION 4 — STORIES ══════════════════════════════ */}
      <div id="sec-4" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s4.banner}
        </div>
        <div className="alt-bg">
          <div style={secPad}>
            {!unlocked.has(4) ? <LockCard prevSec={3} msg={L.lockMsg(3)} /> : (
              <>
                <p className="eyebrow">{L.s4.eyebrow}</p>
                <h2 className="sec-title">{L.s4.title}</h2>
                <p className="sec-intro">{L.s4.intro}</p>

                {/* Story cards */}
                {L.s4.stories.map(s => (
                  <div key={s.title} style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 22, boxShadow: '0 4px 28px rgba(0,0,0,.09)', display: 'grid', gridTemplateColumns: '140px 1fr' }}>
                    <div style={{ background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, padding: '20px 8px' }}>
                      <span style={{ fontSize: '3.5rem' }}>{s.icon}</span>
                      <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.65rem', fontWeight: 900, color: 'rgba(255,255,255,.75)', letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' }}>{s.label}</span>
                    </div>
                    <div style={{ padding: '20px 22px', background: '#fff' }}>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1rem', color: s.refColor, marginBottom: 6 }}>{s.title}</div>
                      <span style={{ fontFamily: 'var(--font-nunito)', display: 'inline-block', fontSize: '.7rem', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20, marginBottom: 10, background: '#f0f8ff', color: s.refColor }}>{s.ref}</span>
                      <p style={{ fontSize: '.9rem', fontWeight: 700, lineHeight: 1.8, color: '#334', marginBottom: 10 }}>{s.text}</p>
                      <blockquote style={{ fontSize: '.88rem', fontStyle: 'italic', borderLeft: `3px solid ${s.refColor}`, paddingLeft: 12, lineHeight: 1.75, color: '#556' }}>
                        {s.quote}
                        <span style={{ display: 'block', fontStyle: 'normal', fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: s.refColor, marginTop: 4 }}>{s.qref}</span>
                      </blockquote>
                    </div>
                  </div>
                ))}

                {/* Scramble challenges */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#1a3a6e' }}>
                  <p className="puzzle-label">{L.s4.sc1Label}</p>
                  <p className="puzzle-q">{L.s4.sc1Q}</p>
                  {/* Answer zone */}
                  <div style={{ minHeight: 58, border: `3px dashed ${done.has('sc1') ? '#40b870' : '#ccc'}`, borderRadius: 14, display: 'flex', flexWrap: 'wrap', gap: 8, padding: 10, justifyContent: 'center', marginBottom: 8, background: done.has('sc1') ? '#edfaf2' : '#fafafa' }}>
                    {az1.map((tile, i) => (
                      <div key={tile.uid} onClick={() => !done.has('sc1') && removeFromAz1(tile)} style={ansTile(tile, i, SC1_ANS_ACTIVE)}>{tile.word}</div>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.85rem', fontWeight: 900, textAlign: 'center', color: az1.some((t,i) => SC1_ANS_ACTIVE[i] && t.word.toLowerCase() === SC1_ANS_ACTIVE[i]) ? '#2d8a50' : '#aaa', marginBottom: 8 }}>
                    {scHint(az1, SC1_ANS_ACTIVE)}
                  </p>
                  {/* Source tiles */}
                  {!done.has('sc1') && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                      {SC1_TILES_ACTIVE.map(tile => (
                        <div key={tile.uid} onClick={() => addToAz1(tile)} style={{ ...tileBase, background: az1Used.has(tile.uid) ? 'rgba(26,58,110,.28)' : '#1a3a6e', opacity: az1Used.has(tile.uid) ? 0.4 : 1, cursor: az1Used.has(tile.uid) ? 'default' : 'pointer' }}>{tile.word}</div>
                      ))}
                    </div>
                  )}
                  {!done.has('sc1') && <button className="pz-btn pz-btn-reset" onClick={resetSc1} style={{ background: '#888', marginTop: 0 }}>{L.s4.scResetBtn}</button>}
                  <TruthBanner show={done.has('sc1')} color="#1a3a6e">
                    {L.s4.sc1Truth}
                    <span className="truth-verse">{L.s4.sc1TruthVerse}</span>
                  </TruthBanner>
                </div>

                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#ea580c' }}>
                  <p className="puzzle-label">{L.s4.sc2Label}</p>
                  <p className="puzzle-q">{L.s4.sc2Q}</p>
                  <div style={{ minHeight: 58, border: `3px dashed ${done.has('sc2') ? '#40b870' : '#ccc'}`, borderRadius: 14, display: 'flex', flexWrap: 'wrap', gap: 8, padding: 10, justifyContent: 'center', marginBottom: 8, background: done.has('sc2') ? '#edfaf2' : '#fafafa' }}>
                    {az2.map((tile, i) => (
                      <div key={tile.uid} onClick={() => !done.has('sc2') && removeFromAz2(tile)} style={{ ...tileBase, background: SC2_ANS_ACTIVE[i] && tile.word.toLowerCase() === SC2_ANS_ACTIVE[i] ? '#2d8a50' : '#ea580c', boxShadow: SC2_ANS_ACTIVE[i] && tile.word.toLowerCase() === SC2_ANS_ACTIVE[i] ? '0 0 0 3px #86efac' : 'none' }}>{tile.word}</div>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.85rem', fontWeight: 900, textAlign: 'center', color: az2.some((t,i) => SC2_ANS_ACTIVE[i] && t.word.toLowerCase() === SC2_ANS_ACTIVE[i]) ? '#2d8a50' : '#aaa', marginBottom: 8 }}>
                    {scHint(az2, SC2_ANS_ACTIVE)}
                  </p>
                  {!done.has('sc2') && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                      {SC2_TILES_ACTIVE.map(tile => (
                        <div key={tile.uid} onClick={() => addToAz2(tile)} style={{ ...tileBase, background: az2Used.has(tile.uid) ? 'rgba(234,88,12,.28)' : '#ea580c', opacity: az2Used.has(tile.uid) ? 0.4 : 1, cursor: az2Used.has(tile.uid) ? 'default' : 'pointer' }}>{tile.word}</div>
                      ))}
                    </div>
                  )}
                  {!done.has('sc2') && <button className="pz-btn pz-btn-reset" onClick={resetSc2} style={{ background: '#888', marginTop: 0 }}>{L.s4.scResetBtn}</button>}
                  <TruthBanner show={done.has('sc2')} color="#ea580c">
                    {L.s4.sc2Truth}
                    <span className="truth-verse">{L.s4.sc2TruthVerse}</span>
                  </TruthBanner>
                </div>

                {done.has('sc1') && done.has('sc2') && <UnlockBanner msg={L.s4.unlock} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">🌿</span><div className="div-line"/></div>

      {/* ════════ SECTION 5 — FRUIT ════════════════════════════════ */}
      <div id="sec-5" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s5.banner}
        </div>
        <div className="alt-bg4">
          <div style={secPad}>
            {!unlocked.has(5) ? <LockCard prevSec={4} msg={L.lockMsg(4)} /> : (
              <>
                <p className="eyebrow">{L.s5.eyebrow}</p>
                <h2 className="sec-title">{L.s5.title}</h2>
                <p className="sec-intro">{L.s5.intro}</p>

                {/* Fruit garden illustration */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <img src="/images/jr/holy-spirit-fruit-garden.png" alt="Fruit of the Spirit" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }} />
                </div>

                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#40b870' }}>
                  <p className="puzzle-label">{L.s5.fruitLabel}</p>
                  <p className="puzzle-q">{L.s5.fruitQ}</p>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.82rem', fontWeight: 800, color: '#888', textAlign: 'center', marginBottom: 14, letterSpacing: 1 }}>
                    {L.s5.fruitProgress(fruitsOpen.size)}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 11 }}>
                    {FRUITS_ACTIVE.map((f, i) => (
                      <div
                        key={f.name}
                        onClick={() => !done.has('fruits') && revealFruit(i)}
                        style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 2px 14px rgba(0,0,0,.09)', cursor: fruitsOpen.has(i) ? 'default' : 'pointer', userSelect: 'none', overflow: 'hidden' }}
                      >
                        <div style={{ background: fruitsOpen.has(i) ? f.bg : '#fff', borderRadius: fruitsOpen.has(i) ? '16px 16px 0 0' : 16, padding: '13px 9px 9px', transition: 'background .25s' }}>
                          <span style={{ fontSize: '1.9rem', display: 'block', marginBottom: 4 }}>{f.icon}</span>
                          <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.85rem', color: 'var(--deep)', marginBottom: 1 }}>{f.name}</div>
                          <span style={{ fontFamily: 'var(--font-lora)', fontSize: '.58rem', color: '#bbb', fontStyle: 'italic', display: 'block' }}>{f.greek}</span>
                          {!fruitsOpen.has(i) && <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.58rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: f.color, opacity: .65, marginTop: 3 }}>{L.s5.tapIndicator}</div>}
                        </div>
                        {fruitsOpen.has(i) && (
                          <div style={{ background: f.bg, borderRadius: '0 0 16px 16px', padding: '10px 11px 14px' }}>
                            <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.78rem', fontWeight: 700, color: '#334', lineHeight: 1.6, display: 'block', marginBottom: 5 }}>{f.kid}</span>
                            <div style={{ fontSize: '.72rem', fontStyle: 'italic', color: f.color, fontWeight: 700, lineHeight: 1.5, borderLeft: `3px solid ${f.color}`, paddingLeft: 7 }}>{f.ex}</div>
                            <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.6rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', color: '#bbb', marginTop: 4, display: 'block' }}>{f.ref}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <TruthBanner show={done.has('fruits')} color="#1a6a30">
                    {L.s5.fruitTruth}
                    <span className="truth-verse">{L.s5.fruitTruthVerse}</span>
                  </TruthBanner>
                </div>

                <div className="pull-quote" style={{ marginTop: 8 }}>
                  <p className="pq-text">{L.s5.pq}</p>
                  <span className="pq-ref">{L.s5.pqRef}</span>
                </div>

                {done.has('fruits') && <UnlockBanner msg={L.s5.unlock} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">🎁</span><div className="div-line"/></div>

      {/* ════════ SECTION 6 — GIFTS ════════════════════════════════ */}
      <div id="sec-6" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s6.banner}
        </div>
        <div className="alt-bg3">
          <div style={secPad}>
            {!unlocked.has(6) ? <LockCard prevSec={5} msg={L.lockMsg(5)} /> : (
              <>
                <p className="eyebrow">{L.s6.eyebrow}</p>
                <h2 className="sec-title">{L.s6.title}</h2>
                <p className="sec-intro">{L.s6.intro}</p>

                {/* Gifts constellation illustration */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <img src="/images/jr/holy-spirit-gifts.png" alt="Gifts of the Holy Spirit" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }} />
                </div>

                {/* Gift reference cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14, marginBottom: 28 }}>
                  {L.s6.gifts.map(g => (
                    <div key={g.name} style={{ ...card, borderTop: `5px solid ${g.color}` }}>
                      <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>{g.icon}</span>
                      <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '.85rem', color: g.color, marginBottom: 7 }}>{g.name}</div>
                      <div style={{ fontSize: '.88rem', fontWeight: 700, color: '#445', lineHeight: 1.7 }}>{g.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Fill-in-blank challenge */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#4f46e5' }}>
                  <p className="puzzle-label">{L.s6.fitbLabel}</p>
                  <p className="puzzle-q">{L.s6.fitbQ}</p>
                  <div className="kid-note">{L.s6.fitbKidNote}</div>

                  {/* Word bank */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '12px 0' }}>
                    {FITB_WORDS_ACTIVE.map(word => {
                      const isUsed = usedWords.includes(word)
                      const isSel = wbSel === word
                      return (
                        <span key={word} onClick={() => !done.has('fitb') && wb6Pick(word)} style={{
                          padding: '7px 14px', borderRadius: 20,
                          background: isSel ? '#4f46e5' : isUsed ? '#ddd' : '#e8f0ff',
                          color: isSel ? '#fff' : isUsed ? '#aaa' : '#1a3a8a',
                          fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.88rem',
                          cursor: isUsed ? 'default' : 'pointer',
                          border: `2px solid ${isSel ? '#4f46e5' : 'transparent'}`,
                          transform: isSel ? 'scale(1.06)' : 'none',
                          transition: 'all .15s',
                        }}>{word}</span>
                      )
                    })}
                  </div>

                  {/* Sentences */}
                  {L.s6.fitbSentences.map(s => (
                    <div key={s.id} style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic', fontSize: '1rem', lineHeight: 2.4, color: '#334', margin: '6px 0' }}>
                      {s.pre}{' '}
                      <span
                        onClick={() => !done.has('fitb') && wb6Drop(s.id)}
                        style={{
                          display: 'inline-block', minWidth: 100, borderBottom: `3px solid ${done.has('fitb') ? '#40b870' : blankBorder(s.id)}`,
                          background: 'transparent', fontFamily: 'var(--font-nunito)', fontWeight: 900,
                          color: bk[s.id] ? (done.has('fitb') ? '#0a6830' : 'var(--deep)') : '#ccc',
                          padding: '0 6px 2px', textAlign: 'center', cursor: 'pointer', borderRadius: 4,
                          fontSize: '.95rem', verticalAlign: 'bottom',
                        }}
                      >{bk[s.id] || '        '}</span>
                      {s.post}
                    </div>
                  ))}

                  {!done.has('fitb') && <button className="pz-btn" style={{ background: '#4f46e5', marginTop: 16 }} onClick={checkFitb}>{L.s6.fitbCheckBtn}</button>}
                  {fitbErr && <p className="pz-error">{fitbErr}</p>}
                  <TruthBanner show={done.has('fitb')} color="#4f46e5">
                    {L.s6.fitbTruth}
                    <span className="truth-verse">{L.s6.fitbTruthVerse}</span>
                  </TruthBanner>
                </div>

                {done.has('fitb') && <UnlockBanner msg={L.s6.unlock} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider"><div className="div-line"/><span className="div-icon">❤️</span><div className="div-line"/></div>

      {/* ════════ SECTION 7 — LIVING ════════════════════════════════ */}
      <div id="sec-7" style={{ scrollMarginTop: 100 }}>
        <div className="sec-banner sb-7" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {L.s7.banner}
        </div>
        <div className="alt-bg2">
          <div style={secPad}>
            {!unlocked.has(7) ? <LockCard prevSec={6} msg={L.lockMsg(6)} /> : (
              <>
                <p className="eyebrow">{L.s7.eyebrow}</p>
                <h2 className="sec-title">{L.s7.title}</h2>
                <p className="sec-intro">{L.s7.intro}</p>

                {/* Warning bar */}
                <div style={{ background: 'linear-gradient(135deg,#7c0a02,#b91c1c)', color: '#fff', borderRadius: 20, padding: '22px 20px', marginBottom: 22, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '2.2rem', flexShrink: 0 }}>⚠️</span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1rem', marginBottom: 6 }}>{L.s7.warningTitle}</h3>
                    <p style={{ fontSize: '.9rem', fontWeight: 700, lineHeight: 1.75, opacity: .92 }}>
                      {L.s7.warningBody}
                    </p>
                    <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.72rem', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--flame2)', marginTop: 6, display: 'block' }}>{L.s7.warningRef}</span>
                  </div>
                </div>

                <div className="pull-quote" style={{ marginBottom: 22 }}>
                  <p className="pq-text">{L.s7.pq}</p>
                  <span className="pq-ref">{L.s7.pqRef}</span>
                </div>

                {/* Practice list */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14, marginBottom: 28 }}>
                  {L.s7.practices.map(p => (
                    <div key={p.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', ...card }}>
                      <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--fire),var(--flame2))', color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.n}</div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '1rem', color: 'var(--deep)', marginBottom: 4 }}>{p.title}</h4>
                        <p style={{ fontSize: '.88rem', fontWeight: 700, color: '#445', lineHeight: 1.7 }}>{p.body}</p>
                        <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, color: 'var(--fire)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 4, display: 'block' }}>{p.ref}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Decoder challenge */}
                <div className="puzzle-box" style={{ ['--pz-color' as string]: '#0369a1' }}>
                  <p className="puzzle-label">{L.s7.decoderLabel}</p>
                  <p className="puzzle-q">{L.s7.decoderQ}</p>

                  {/* Decode display */}
                  <div style={{ textAlign: 'center', margin: '14px 0' }}>
                    <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, color: '#aaa', letterSpacing: 2, marginBottom: 10 }}>{L.s7.decoderDisplayTitle}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                      {DECODER_KEYS_ACTIVE.map(k => (
                        <div key={k.id} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.8rem' }}>{k.emoji}</div>
                          <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: '.9rem', background: decoded[k.id] ? '#c8e8ff' : '#e8f4ff', borderRadius: 8, padding: '4px 8px', minWidth: 28, border: `2px solid ${decoded[k.id] ? '#0369a1' : '#ccc'}`, color: 'var(--deep)', transition: 'all .25s' }}>
                            {decoded[k.id] || '?????'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keys */}
                  <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '.7rem', fontWeight: 900, color: '#aaa', letterSpacing: 2, textAlign: 'center', marginBottom: 10 }}>{L.s7.decoderKeyTitle}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
                    {DECODER_KEYS_ACTIVE.map(k => (
                      <button key={k.id} onClick={() => !done.has('decoder') && decodeKey(k.id, k.word)}
                        style={{ padding: '6px 10px', borderRadius: 10, fontFamily: 'var(--font-nunito)', fontSize: '.8rem', fontWeight: 900, background: decoded[k.id] ? '#c8e8ff' : '#fff', border: `2px solid ${decoded[k.id] ? '#0369a1' : '#ddd'}`, color: decoded[k.id] ? '#0369a1' : '#445', cursor: done.has('decoder') ? 'default' : 'pointer' }}>
                        {k.emoji} = {k.word}
                      </button>
                    ))}
                  </div>

                  {!done.has('decoder') && <button className="pz-btn" style={{ background: '#0369a1' }} onClick={checkDecoder}>{L.s7.decoderCheckBtn}</button>}
                  {decErr && <p className="pz-error">{decErr}</p>}
                  <TruthBanner show={done.has('decoder')} color="#0369a1">
                    {L.s7.decoderTruth}
                    <span className="truth-verse">{L.s7.decoderTruthVerse}</span>
                  </TruthBanner>
                </div>

                {done.has('decoder') && (
                  <div style={{ margin: '28px 18px 0', background: 'linear-gradient(135deg,#0a1a4e,#1a3a8e,#2255b4)', borderRadius: 28, padding: '32px 24px', textAlign: 'center', color: '#fff', boxShadow: '0 8px 32px rgba(10,26,78,.4)' }}>
                    <div style={{ fontSize: '2.2rem', marginBottom: 12, letterSpacing: 4 }}>🕊️ 🔥 ❤️ ⚡ 🌱</div>
                    <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.6rem', lineHeight: 1.2, marginBottom: 10 }}>{L.s7.bigTitle}</h2>
                    <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '.98rem', fontWeight: 700, opacity: .9, lineHeight: 1.85 }}>
                      {L.s7.bigBody.split('\n').map((line, i, arr) => <span key={i}>{line}{i < arr.length - 1 && <br />}</span>)}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Reset button ────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '24px 18px', background: 'var(--cream)' }}>
        <button onClick={resetAll} style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: '.8rem', color: '#aaa', background: 'none', border: '1px solid #ddd', borderRadius: 20, padding: '6px 16px', cursor: 'pointer' }}>
          {L.resetBtn}
        </button>
      </div>
    </>
  )
}
