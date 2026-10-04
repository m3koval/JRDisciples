// Scripture transcribed from the linked Bible.com ESV / RST passages.
// Explanations and historical illustrations are not Bible quotations.
export const sources = [
  ['1 Peter 1:17–21 · ESV', 'https://www.bible.com/bible/59/1PE.1.17-21.ESV'],
  ['1 Петра 1:17–21 · RST', 'https://www.bible.com/bible/167/1PE.1.17-21.RST'],
  ['Colossians 2:13–14 · ESV', 'https://www.bible.com/bible/59/COL.2.13-14.ESV'],
  ['Колоссянам 2:13–14 · RST', 'https://www.bible.com/bible/167/COL.2.13-14.RST'],
  ['National Park Service · New Salem', 'https://www.nps.gov/liho/learn/historyculture/newsalem.htm'],
  ['Surveyors Historical Society · Lincoln', 'http://www.surveyhistory.org/lincoln_the_surveyor1.htm'],
  ['The Royal Family · Richard I', 'https://www.royal.uk/richard-i'],
] as const
export const scriptureEn = {
  peter: 'And if you call on him as Father who judges impartially according to each one’s deeds, conduct yourselves with fear throughout the time of your exile, knowing that you were ransomed from the futile ways inherited from your forefathers, not with perishable things such as silver or gold, but with the precious blood of Christ, like that of a lamb without blemish or spot. He was foreknown before the foundation of the world but was made manifest in the last times for the sake of you who through him are believers in God, who raised him from the dead and gave him glory, so that your faith and hope are in God.',
  father: 'And if you call on him as Father who judges impartially according to each one’s deeds, conduct yourselves with fear throughout the time of your exile,',
  ransom: 'knowing that you were ransomed from the futile ways inherited from your forefathers, not with perishable things such as silver or gold, but with the precious blood of Christ, like that of a lamb without blemish or spot.',
  memory: 'but with the precious blood of Christ, like that of a lamb without blemish or spot.',
  hope: 'He was foreknown before the foundation of the world but was made manifest in the last times for the sake of you who through him are believers in God, who raised him from the dead and gave him glory, so that your faith and hope are in God.',
  colossians: 'And you, who were dead in your trespasses and the uncircumcision of your flesh, God made alive together with him, having forgiven us all our trespasses, by canceling the record of debt that stood against us with its legal demands. This he set aside, nailing it to the cross.',
}
export const scriptureRu = {
  peter: 'И если вы называете Отцем Того, Который нелицеприятно судит каждого по делам, то со страхом проводи́те время странствования вашего, зная, что не тленным серебром или золотом искуплены вы от суетной жизни, преданной вам от отцов, но драгоценною Кровию Христа, как непорочного и чистого Агнца, предназначенного еще прежде создания мира, но явившегося в последние времена для вас, уверовавших чрез Него в Бога, Который воскресил Его из мертвых и дал Ему славу, чтобы вы имели веру и упование на Бога.',
  father: 'И если вы называете Отцем Того, Который нелицеприятно судит каждого по делам, то со страхом проводи́те время странствования вашего,',
  ransom: 'зная, что не тленным серебром или золотом искуплены вы от суетной жизни, преданной вам от отцов, но драгоценною Кровию Христа, как непорочного и чистого Агнца,',
  memory: 'но драгоценною Кровию Христа, как непорочного и чистого Агнца,',
  hope: 'предназначенного еще прежде создания мира, но явившегося в последние времена для вас, уверовавших чрез Него в Бога, Который воскресил Его из мертвых и дал Ему славу, чтобы вы имели веру и упование на Бога.',
  colossians: 'и вас, которые были мертвы во грехах и в необрезании плоти вашей, оживил вместе с Ним, простив нам все грехи, истребив учением бывшее о нас рукописание, которое было против нас, и Он взял его от среды и пригвоздил ко кресту',
}
export type Language = 'en' | 'ru'
export type Stage = { title: string; short: string; image: string; alt: string; paragraphs: string[]; truth: string; verse: keyof typeof scriptureEn; ref: string; activity: string; instruction: string; hint: string; learn: string; question: string }
export type Question = { question: string; options: string[]; correct: number; explanation: string }
export const content = {
  en: {
    title: "Paid in Full",
    eyebrow: "A gift you could never buy",
    intro: "Lincoln’s tools had been sold. He needed them to work—but how could he get them back? Someone was about to give him an unexpected gift.",
    age: "Ages 6–11 · 30–40 minutes · Read together or explore",
    start: "Discover the gift",
    all: "All lessons",
    phases: [
      "See",
      "Do",
      "Feedback",
      "Learn"
    ],
    check: "Check my answer",
    hint: "Show a hint",
    hideHint: "Hide hint",
    retry: "Not yet — you can try again.",
    success: "You found it!",
    continue: "Discover why",
    next: "Next discovery",
    finish: "Finish the journey",
    reset: "Start over",
    resetConfirm: "Start this lesson again? Your lesson progress will be cleared.",
    back: "Review the lesson",
    replay: "Play again",
    progress: "Discoveries completed",
    choose: "Choose a home for this card",
    remove: "Remove",
    clear: "Clear my tiles",
    empty: "Your words will appear here",
    selected: "Your answer",
    wordBank: "Word bank",
    sequence: "Your timeline",
    moveUp: "Move up",
    moveDown: "Move down",
    question: "Question",
    outOf: "of",
    correct: "Correct",
    solved: "Completed",
    locked: "Not yet unlocked",
    guide: "Grown-ups: lesson plan, discussion & sources",
    fullReading: "Read the complete Bible passages",
    version: "ESV",
    peterRef: "1 Peter 1:17–21",
    colRef: "Colossians 2:13–14",
    memoryRef: "1 Peter 1:19",
    excerpt: "Bible text",
    review: "Your discovery notebook",
    completion: "A rescue worth remembering!",
    takeaway: "God is Father and fair Judge. I am a traveler. Jesus—not my good deeds—is my Savior.",
    grace: "Jesus’ love is a gift. We follow Him because we are thankful, not to earn His love.",
    save: "Finished discoveries are saved on this device.",
    missionTitle: "What will you do with this gift?",
    mission: "Choose one way to respond to Jesus’ love this week. Tell a grown-up your plan and ask God to help you.",
    missions: [
      "Tell the truth and ask forgiveness when you have done wrong.",
      "Invite a child who is left out to join a game.",
      "Help at home without asking for a prize.",
      "Read 1 Peter 1:17–21 with a trusted grown-up."
    ],
    prayerTitle: "Words you can pray",
    prayer: "Lord Jesus, I cannot buy forgiveness. Thank You for dying for sinners and rising again. Help me turn from sin, trust You, and love the people near me. Amen.",
    prayerNote: "You can also tell God what is on your heart in your own words.",
    stages: [
      {
        "title": "A loving Father who is always fair",
        "short": "Father & Judge",
        "image": "father-judge",
        "alt": "Children discovering care and fairness through an open Bible",
        "paragraphs": [
          "Before he became president, Abraham Lincoln had a store that failed. He owed money, and his tools for measuring land were sold. Then his friend James Short bought the tools and gave them back! Lincoln could work again.",
          "His friend paid the cost; Lincoln received the gift. The Bible tells us about a much greater gift. To understand it, first let’s meet the One who gives it.",
          "Peter reminds believers: God is your loving Father AND a fair Judge. You can come to Him for help. He knows the truth and calls wrong things wrong—even when His children do them. He judges impartially: fairly, without favorites."
        ],
        "truth": "God loves me and knows the truth. I can come to Him honestly.",
        "verse": "father",
        "ref": "1 Peter 1:17",
        "activity": "Care and fairness windows",
        "instruction": "Read each card. Does it show God’s care, His fairness, or both? Tap the matching window.",
        "hint": "Care and welcome belong in Father. Fair judgment belongs in Judge. Love AND truth together belong in Both.",
        "learn": "Imagine you took a friend’s toy and hid it. God’s love means you can come to Him instead of hiding. His fairness means taking the toy was still wrong. Tell the truth, return it, and ask forgiveness. This is reverence: loving God and taking His words seriously.",
        "question": "How can knowing God is loving AND fair help you tell the truth?"
      },
      {
        "title": "Remember where you are going",
        "short": "Travelers",
        "image": "travelers",
        "alt": "Children on a bright path helping a fellow traveler",
        "paragraphs": [
          "If God is our Father, our lasting home is with Him. Peter calls believers travelers: people who are on their way home. Imagine finding shiny stones beside the path. Would you stay there forever and forget where you were going?",
          "Toys, prizes, and games can be fun. But they are not our greatest treasure. Following Jesus helps us choose what matters: trusting God, keeping our promises, and loving the people beside us."
        ],
        "truth": "My home is with God. I can show His love along the way.",
        "verse": "father",
        "ref": "1 Peter 1:17",
        "activity": "Pack a traveler’s heart",
        "instruction": "Pack the attitudes that help you follow Jesus. Leave behind the ones that put you first and push others aside.",
        "hint": "Pack honesty, hope, and love for people. Leave behind pride, ignoring needs, and making possessions your greatest treasure.",
        "learn": "Suppose a new child is watching your game alone. You could keep playing—or make room for a new friend. Remembering our home with God helps us love people now. But what if we have already gone the wrong way? We need more than directions. We need a Savior.",
        "question": "Who could you welcome into your game this week?"
      },
      {
        "title": "Who can rescue us?",
        "short": "The rescue",
        "image": "redemption",
        "alt": "A bright cross and an empty tomb showing hope and new life",
        "paragraphs": [
          "We know we should tell the truth and love others. Yet we often choose ‘Me first!’ We have all sinned—done wrong against God. We cannot undo that by saving money or doing enough good things. We need forgiveness and a new way to live.",
          "Remember Lincoln’s friend? His help cost him something. Our rescue cost Jesus much more: His own life. Peter calls Him a spotless Lamb—a picture of a perfect sacrifice. Jesus never sinned, but He died on the cross for our sins.",
          "And He did not stay dead! God raised Jesus to life. This rescue was God’s plan before the world began. We can turn from sin and trust our living Savior."
        ],
        "truth": "Jesus gave His life and rose again. I can trust Him to rescue me.",
        "verse": "hope",
        "ref": "1 Peter 1:20–21",
        "activity": "Build the rescue timeline",
        "instruction": "Put the five moments in order with the up and down buttons. Then check your timeline.",
        "hint": "God’s plan → Jesus comes → the cross → resurrection → trusting Jesus.",
        "learn": "To redeem means to set free at a cost. Jesus paid that cost with His precious blood, not silver or gold. Repentance means turning from sin toward God. Faith means trusting Jesus. Because He is alive, our hope is in a living Savior.",
        "question": "What did Jesus give to rescue us—and what happened after He died?"
      },
      {
        "title": "A fresh start we could never buy",
        "short": "Paid in full",
        "image": "cover",
        "alt": "Children discovering a debt-paper illustration in the light of Scripture",
        "paragraphs": [
          "Imagine a record of all the wrong things you have done. Paul uses a debt record to explain our guilt before God. Through Jesus’ cross, God forgives and cancels that record. We cannot buy this forgiveness. We receive it by trusting Jesus.",
          "Lincoln’s friend gave back his tools. Jesus gives something far greater: forgiveness and new life with God. He frees us from living only for ourselves so we can follow Him. That is the gift behind ‘Paid in Full.’"
        ],
        "truth": "Jesus gives forgiveness and new life. Good deeds cannot buy His gift.",
        "verse": "colossians",
        "ref": "Colossians 2:13–14",
        "activity": "Build the precious promise",
        "instruction": "Tap the words to assemble 1 Peter 1:19. Tap a chosen word to remove it. You can peek at the verse any time.",
        "hint": "Read the verse slowly. Begin “but with the precious blood of Christ,” then describe the lamb.",
        "learn": "Remember the hidden toy? Trusting Jesus means turning toward Him and away from that wrong choice. Return the toy and ask forgiveness—not to buy God’s love, but because His love is changing how you live.",
        "question": "How would a thankful heart change what you do with the toy?"
      },
      {
        "title": "Let the gift change your next step",
        "short": "Live it",
        "image": "travelers",
        "alt": "Young travelers sharing help and kindness on the path",
        "paragraphs": [
          "How do you think Lincoln felt when his tools came back? A gift like that gives you a reason to be thankful. Jesus’ gift is greater still. He does not just forgive us—He frees us to live a new way.",
          "Remember the three truths: my Father loves me and judges fairly; my home is with God; Jesus gave His life to rescue me. Together, they help me tell the truth, welcome others, and follow Jesus with thanks."
        ],
        "truth": "I follow Jesus because of His love—not to earn it.",
        "verse": "ransom",
        "ref": "1 Peter 1:18–19",
        "activity": "What would you do?",
        "instruction": "Try six questions about the Bible and everyday choices. Read the explanation, then keep going.",
        "hint": "Remember our Father, our journey, and the rescue Jesus gave us.",
        "learn": "Choose one next step: tell the truth, welcome someone, share, or help at home. Tell a grown-up your plan. Ask God to help you carry it out. Gratitude becomes something we do.",
        "question": "What is one way you can thank Jesus through your choices tomorrow?"
      }
    ] satisfies Stage[],
    matchLabels: [
      "Father’s care",
      "Judge’s fairness",
      "Both together"
    ],
    matchCards: [
      {
        "text": "I can come to God for care and help.",
        "category": 0,
        "why": "A loving Father invites His children to draw near."
      },
      {
        "text": "Money and family names cannot buy God’s approval.",
        "category": 1,
        "why": "An impartial Judge does not favor the rich or important."
      },
      {
        "text": "God loves His children and takes their wrong choices seriously.",
        "category": 2,
        "why": "The same God is both loving Father and fair Judge."
      },
      {
        "text": "God sees the truth even when nobody else saw what happened.",
        "category": 1,
        "why": "God’s judgment is true; hiding does not change what is right."
      }
    ],
    sortLabels: [
      "Pack it",
      "Leave it behind"
    ],
    sortCards: [
      {
        "text": "Tell the truth even when it is hard.",
        "category": 0,
        "why": "Honesty honors the God before whom we live."
      },
      {
        "text": "Only my prizes and possessions matter.",
        "category": 1,
        "why": "Gifts can be enjoyed, but they must not become our greatest treasure."
      },
      {
        "text": "Heaven is my hope, so I will ignore a lonely neighbor.",
        "category": 1,
        "why": "Hope in God grows love for real people right now."
      },
      {
        "text": "Help at home because I am thankful for Jesus.",
        "category": 0,
        "why": "Service is a response to grace, not a price for it."
      },
      {
        "text": "Keep trusting God when following Jesus is hard.",
        "category": 0,
        "why": "Travelers remember their destination and hold on to hope."
      }
    ],
    timeline: [
      "Christ was foreknown before the world was made.",
      "Jesus appeared in the world for us.",
      "Sinless Jesus gave His life on the cross.",
      "God raised Jesus from the dead and gave Him glory.",
      "Through Jesus, we put our faith and hope in God."
    ],
    quiz: [
      {
        "question": "You hid a friend’s toy. God is loving AND fair. What does that mean?",
        "options": [
          "He will pretend nothing happened.",
          "I can come honestly to Him and admit the wrong.",
          "I must hide it from Him too."
        ],
        "correct": 1,
        "explanation": "God loves us and knows the truth. We can tell Him what happened, ask forgiveness, and return the toy."
      },
      {
        "question": "A new child is left out of your game. What fits a traveler following Jesus?",
        "options": [
          "Make room and invite the child to play.",
          "Ignore the child so I can win.",
          "Only play with children who give me things."
        ],
        "correct": 0,
        "explanation": "Our home is with God. Along the way, we can show His love to the people beside us."
      },
      {
        "question": "What did Jesus give to rescue us?",
        "options": [
          "Silver and gold.",
          "Someone else’s treasure.",
          "His own sinless life—His precious blood."
        ],
        "correct": 2,
        "explanation": "1 Peter 1:18–19 says our rescue cost Christ’s precious blood. He gave Himself for us."
      },
      {
        "question": "Why can we trust Jesus as our living Savior?",
        "options": [
          "His friends kept His story secret.",
          "God raised Him from the dead.",
          "He never really died."
        ],
        "correct": 1,
        "explanation": "Jesus truly died and rose again. Our faith and hope are in God, who raised Him (1 Peter 1:21)."
      },
      {
        "question": "Lincoln received his tools back. What greater gift does Jesus give?",
        "options": [
          "Forgiveness and new life with God.",
          "More toys than anyone else.",
          "A promise that following Him will always be easy."
        ],
        "correct": 0,
        "explanation": "Through Jesus’ cross, God cancels our record of guilt. Jesus also frees us to follow Him in a new way (Colossians 2:13–14)."
      },
      {
        "question": "How can you respond to Jesus’ gift?",
        "options": [
          "Keep doing wrong because nothing matters.",
          "Try to buy His love with good behavior.",
          "Turn from sin, trust Him, and follow Him with thanks."
        ],
        "correct": 2,
        "explanation": "Repentance is turning from sin toward God. Faith is trusting Jesus. Our changed choices are a thankful response to His love."
      }
    ] satisfies Question[],
    guideIntro: "Read and explore together at the child’s pace. Begin with Lincoln’s gift, then follow three connected truths: our loving and fair Father, our journey home, and Jesus’ costly rescue.",
    plan: [
      "Prepare a Bible, paper, pencils, and five timeline cards. Read with younger children.",
      "0–5 minutes — Tell the Lincoln story. Ask: what would you say to a friend who gave back something you really needed? Read 1 Peter 1:17–21 together.",
      "5–11 minutes — Match care and fairness. Use the hidden-toy example. Explain impartial as fair, without favorites, and reverence as loving respect.",
      "11–17 minutes — Pack a traveler’s heart. Ask how remembering our home with God changes the way we treat someone left out of a game.",
      "17–24 minutes — Read verses 18–21 and arrange the rescue timeline. Explain redemption as freedom at a cost. Connect Jesus’ death and resurrection to repentance and faith.",
      "24–30 minutes — Read Colossians 2:13–14. Explain the canceled record as forgiveness through Jesus. Assemble the memory verse.",
      "30–36 minutes — Work through the six questions. Ask the child to explain one answer in their own words.",
      "36–40 minutes — Return to Lincoln’s gift and Jesus’ greater gift. Choose a thankful next step and pray together."
    ],
    discussionTitle: "Discussion & suggested answers",
    discussions: [
      [
        "Does a loving Father call wrong things right?",
        "No. His love and fair judgment belong together. God’s impartiality rules out family, national, financial, or religious favoritism."
      ],
      [
        "Does fearing God mean we should hide from Him?",
        "No. Reverence takes His holiness seriously and draws near truthfully, relying on His mercy—not treating Him as cruel or sin as harmless."
      ],
      [
        "Why serve people if we are travelers?",
        "Our hope beyond this life helps us put people before temporary prizes. It does not excuse neglecting neighbors, creation, promises, or work."
      ],
      [
        "What can good deeds pay toward salvation?",
        "Nothing. Christ’s sacrifice is the basis of forgiveness. Good deeds express gratitude and changed life; they are fruit, not a price."
      ],
      [
        "What does canceled debt mean—and not mean?",
        "It pictures the removal of guilt in Christ. Borrowing money is not itself sin, poverty is not proof of wrongdoing, and earthly financial responsibilities are not automatically erased."
      ],
      [
        "What response does the gospel invite?",
        "Repentance and faith: turn from sin to God and rely on the crucified and risen Jesus. Do not imply automatic salvation for everyone or salvation by repeating a formula."
      ]
    ],
    notesTitle: "Helpful teaching notes & sources",
    notes: [
      "Read the full passages together: 1 Peter 1:17–21 and Colossians 2:13–14. English quotations use ESV; Russian quotations use the Synodal translation.",
      "For more discussion: Acts 10:34–35 shows Peter learning that God does not favor one nation. Deuteronomy 10:17–18 connects fair judgment with care. 1 Peter 2:11–12 connects our journey with good conduct.",
      "James Short bought and returned Lincoln’s surveying tools. Lincoln later repaid his debts. Compare the friend’s costly kindness with the much greater gift Jesus gives; the history sources are linked below."
    ],
  },
  ru: {
    title: "Оплачено полностью",
    eyebrow: "Дар, который нельзя купить",
    intro: "Инструменты Линкольна продали. Без них он не мог работать. Как их вернуть? Впереди его ждал неожиданный подарок.",
    age: "6–11 лет · 30–40 минут · Читай со взрослым или сам",
    start: "Узнать о подарке",
    all: "Все уроки",
    phases: [
      "Смотри",
      "Действуй",
      "Проверь",
      "Узнай"
    ],
    check: "Проверить ответ",
    hint: "Показать подсказку",
    hideHint: "Скрыть подсказку",
    retry: "Пока не получилось — попробуй ещё.",
    success: "Ты нашёл ответ!",
    continue: "Узнать почему",
    next: "Следующее открытие",
    finish: "Завершить путешествие",
    reset: "Начать сначала",
    resetConfirm: "Начать урок заново? Прогресс этого урока будет удалён.",
    back: "Повторить главное",
    replay: "Пройти ещё раз",
    progress: "Открытий завершено",
    choose: "Выбери место для карточки",
    remove: "Убрать",
    clear: "Убрать все слова",
    empty: "Здесь появятся твои слова",
    selected: "Твой ответ",
    wordBank: "Слова для стиха",
    sequence: "Твой порядок событий",
    moveUp: "Выше",
    moveDown: "Ниже",
    question: "Вопрос",
    outOf: "из",
    correct: "Верно",
    solved: "Готово",
    locked: "Пока закрыто",
    guide: "Взрослым: план урока, обсуждение и источники",
    fullReading: "Прочитать оба отрывка из Библии",
    version: "Синодальный перевод · RST",
    peterRef: "1 Петра 1:17–21",
    colRef: "Колоссянам 2:13–14",
    memoryRef: "1 Петра 1:19",
    excerpt: "Текст Библии",
    review: "Твоя тетрадь открытий",
    completion: "Спасение, о котором стоит помнить!",
    takeaway: "Бог — Отец и справедливый Судья. Я — странник. Меня спасает Иисус, а не мои добрые дела.",
    grace: "Любовь Иисуса — дар. Мы следуем за Ним из благодарности, а не чтобы заслужить Его любовь.",
    save: "Пройденные открытия сохраняются на этом устройстве.",
    missionTitle: "Как ты ответишь на этот дар?",
    mission: "Выбери один ответ на любовь Иисуса на этой неделе. Расскажи взрослому о своём плане и попроси Бога помочь.",
    missions: [
      "Скажи правду и попроси прощения, если поступил плохо.",
      "Пригласи в игру ребёнка, которого не принимают.",
      "Помоги дома, не прося награды.",
      "Прочитай 1 Петра 1:17–21 со взрослым, которому доверяешь."
    ],
    prayerTitle: "Можно помолиться так",
    prayer: "Господь Иисус, я не могу купить прощение. Спасибо, что Ты умер за грешников и воскрес. Помоги мне отвернуться от греха, доверять Тебе и любить людей рядом. Аминь.",
    prayerNote: "Ты можешь рассказать Богу о том, что у тебя на сердце, своими словами.",
    stages: [
      {
        "title": "Любящий Отец всегда справедлив",
        "short": "Отец и Судья",
        "image": "father-judge",
        "alt": "Дети узнают о заботе и справедливости через открытую Библию",
        "paragraphs": [
          "До того как стать президентом, Авраам Линкольн открыл магазин. Дело не удалось, а долги остались. Его инструменты для измерения земли продали. Но друг Джеймс Шорт купил их и вернул Линкольну! Теперь он снова мог работать.",
          "Друг заплатил, а Линкольн получил подарок. Библия рассказывает о гораздо большем даре. Чтобы понять его, сначала узнаем, какой Тот, Кто его даёт.",
          "Пётр напоминает верующим: Бог — ваш любящий Отец И справедливый Судья. К Нему можно прийти за помощью. Он знает правду и называет плохое плохим, даже когда так поступают Его дети. Он судит нелицеприятно: справедливо, без любимчиков."
        ],
        "truth": "Бог любит меня и знает правду. Я могу прийти к Нему честно.",
        "verse": "father",
        "ref": "1 Петра 1:17",
        "activity": "Окна заботы и справедливости",
        "instruction": "Прочитай карточку. Это о Божьей заботе, справедливости или об обеих истинах? Нажми на подходящее окно.",
        "hint": "Забота и принятие — к Отцу. Честный суд — к Судье. Любовь И правда вместе — в третье окно.",
        "learn": "Представь: ты взял игрушку друга и спрятал её. Божья любовь помогает прийти к Нему, а не прятаться. Его справедливость напоминает: брать чужое было плохо. Скажи правду, верни игрушку и попроси прощения. Это благоговение: любить Бога и серьёзно относиться к Его словам.",
        "question": "Как Божья любовь И справедливость помогут тебе сказать правду?"
      },
      {
        "title": "Помни, куда ты идёшь",
        "short": "Странники",
        "image": "travelers",
        "alt": "Дети на светлой тропе помогают попутчику",
        "paragraphs": [
          "Если Бог — наш Отец, наш вечный дом — с Ним. Пётр называет верующих странниками: людьми на пути домой. Представь, что у тропинки ты нашёл блестящие камешки. Неужели останешься там навсегда и забудешь про дом?",
          "Игрушки, призы и игры могут радовать. Но это не главное сокровище. Следуя за Иисусом, мы учимся выбирать важное: доверять Богу, держать слово и любить людей рядом."
        ],
        "truth": "Мой дом — с Богом. По дороге я могу проявлять Его любовь.",
        "verse": "father",
        "ref": "1 Петра 1:17",
        "activity": "Собери рюкзак сердца",
        "instruction": "Бери мысли, которые помогают следовать за Иисусом. Оставляй те, из-за которых думаешь только о себе и отталкиваешь других.",
        "hint": "Бери честность, надежду и любовь. Оставляй гордость, равнодушие и желание сделать вещи главным сокровищем.",
        "learn": "Новичок стоит один и смотрит, как вы играете. Можно продолжить игру, а можно пригласить нового друга. Помня о доме с Богом, мы учимся любить людей сейчас. А если мы уже пошли не туда? Нам мало знать дорогу. Нам нужен Спаситель.",
        "question": "Кого ты можешь пригласить в игру на этой неделе?"
      },
      {
        "title": "Кто может нас спасти?",
        "short": "Спасение",
        "image": "redemption",
        "alt": "Крест и пустая гробница в тёплом свете напоминают о надежде и новой жизни",
        "paragraphs": [
          "Мы знаем: нужно говорить правду и любить людей. Но часто выбираем: «Сначала я!» Все мы согрешили — поступали плохо перед Богом. Деньги и множество добрых дел не уберут нашу вину. Нам нужны прощение и новая жизнь.",
          "Помнишь друга Линкольна? Он заплатил за помощь. Наше спасение стоило Иисусу гораздо больше: Его собственной жизни. Пётр называет Его чистым Агнцем. Агнец — ягнёнок; здесь это образ совершенной жертвы. Иисус не грешил, но умер на кресте за наши грехи.",
          "И Он не остался мёртвым! Бог воскресил Иисуса. Этот замысел спасения был у Бога ещё до создания мира. Мы можем отвернуться от греха и довериться живому Спасителю."
        ],
        "truth": "Иисус отдал жизнь и воскрес. Я могу довериться Ему ради спасения.",
        "verse": "hope",
        "ref": "1 Петра 1:20–21",
        "activity": "Собери путь спасения",
        "instruction": "Расставь пять событий по порядку кнопками «Выше» и «Ниже». Затем проверь свой ответ.",
        "hint": "Божий замысел → приход Иисуса → крест → воскресение → доверие Иисусу.",
        "learn": "Искупить — значит освободить ценой выкупа. Иисус заплатил эту цену Своей драгоценной Кровью, а не серебром или золотом. Покаяние — поворот от греха к Богу. Вера — доверие Иисусу. Он жив, поэтому наша надежда — на живого Спасителя.",
        "question": "Что Иисус отдал ради нашего спасения и что произошло после Его смерти?"
      },
      {
        "title": "Новое начало, которое не купить",
        "short": "Оплачено",
        "image": "cover",
        "alt": "Дети рассматривают образ долговой записи в свете Писания",
        "paragraphs": [
          "Представь запись обо всех своих плохих поступках. Павел использует образ долговой записи, чтобы объяснить нашу вину перед Богом. Через крест Иисуса Бог прощает и уничтожает эту запись. Прощение нельзя купить. Его принимают, доверяясь Иисусу.",
          "Друг Линкольна вернул ему инструменты. Иисус даёт намного больше: прощение и новую жизнь с Богом. Он освобождает нас от жизни только для себя, чтобы мы следовали за Ним. Вот о каком даре напоминает название «Оплачено полностью»."
        ],
        "truth": "Иисус даёт прощение и новую жизнь. Добрыми делами Его дар не купить.",
        "verse": "colossians",
        "ref": "Колоссянам 2:13–14",
        "activity": "Собери драгоценные слова",
        "instruction": "Нажимай на слова и собери 1 Петра 1:19. Нажми на выбранное слово, чтобы убрать его. В стих можно подглядывать.",
        "hint": "Прочитай стих не спеша. Начни со слов «но драгоценною Кровию Христа,», а затем вспомни слова об Агнце.",
        "learn": "Помнишь спрятанную игрушку? Довериться Иисусу — значит повернуться к Нему и отвернуться от плохого поступка. Верни игрушку и попроси прощения: не чтобы купить Божью любовь, а потому что Его любовь меняет твою жизнь.",
        "question": "Как благодарность изменит твой поступок с игрушкой?"
      },
      {
        "title": "Пусть дар изменит твой следующий шаг",
        "short": "Живи так",
        "image": "travelers",
        "alt": "Юные странники помогают друг другу в пути",
        "paragraphs": [
          "Как ты думаешь, что почувствовал Линкольн, получив инструменты обратно? Такой подарок вызывает благодарность. Дар Иисуса ещё больше. Он не только прощает — Он освобождает нас для новой жизни.",
          "Запомни три истины: мой Отец любит меня и судит справедливо; мой дом — с Богом; Иисус отдал жизнь, чтобы спасти меня. Вместе они помогают говорить правду, принимать других и следовать за Иисусом с благодарностью."
        ],
        "truth": "Я следую за Иисусом из-за Его любви, а не чтобы её заслужить.",
        "verse": "ransom",
        "ref": "1 Петра 1:18–19",
        "activity": "Как бы ты поступил?",
        "instruction": "Ответь на шесть вопросов о Библии и обычных поступках. Прочитай объяснение и двигайся дальше.",
        "hint": "Вспомни нашего Отца, наш путь и спасение, которое подарил Иисус.",
        "learn": "Выбери один шаг: сказать правду, принять кого-то в игру, поделиться или помочь дома. Расскажи взрослому о своём плане. Попроси Бога помочь. Так благодарность становится делом.",
        "question": "Каким поступком ты можешь поблагодарить Иисуса завтра?"
      }
    ] satisfies Stage[],
    matchLabels: [
      "Забота Отца",
      "Справедливость Судьи",
      "Обе истины вместе"
    ],
    matchCards: [
      {
        "text": "Я могу прийти к Богу за заботой и помощью.",
        "category": 0,
        "why": "Любящий Отец зовёт Своих детей приближаться к Нему."
      },
      {
        "text": "Деньги и известная фамилия не купят Божье одобрение.",
        "category": 1,
        "why": "Нелицеприятный Судья не отдаёт предпочтение богатым и важным."
      },
      {
        "text": "Бог любит Своих детей и серьёзно относится к их плохим поступкам.",
        "category": 2,
        "why": "Один и тот же Бог — любящий Отец и справедливый Судья."
      },
      {
        "text": "Бог видит правду, даже если больше никто ничего не видел.",
        "category": 1,
        "why": "Божий суд правдив. Спрятаться — не значит стать правым."
      }
    ],
    sortLabels: [
      "Беру с собой",
      "Оставляю"
    ],
    sortCards: [
      {
        "text": "Говорить правду, даже когда трудно.",
        "category": 0,
        "why": "Честность выражает уважение к Богу, перед Которым мы живём."
      },
      {
        "text": "Важны только мои призы и вещи.",
        "category": 1,
        "why": "Подаркам можно радоваться, но они не должны стать главным сокровищем."
      },
      {
        "text": "Моя надежда на небеса, поэтому одинокий сосед мне не важен.",
        "category": 1,
        "why": "Надежда на Бога учит любить настоящих людей уже сейчас."
      },
      {
        "text": "Помогать дома из благодарности Иисусу.",
        "category": 0,
        "why": "Помощь — ответ на благодать, а не её цена."
      },
      {
        "text": "Доверять Богу, когда следовать за Иисусом трудно.",
        "category": 0,
        "why": "Странник помнит, куда идёт, и держится за надежду."
      }
    ],
    timeline: [
      "Христос предназначен ещё до создания мира.",
      "Иисус пришёл в мир ради нас.",
      "Безгрешный Иисус отдал жизнь на кресте.",
      "Бог воскресил Иисуса из мёртвых и дал Ему славу.",
      "Через Иисуса мы верим Богу и надеемся на Него."
    ],
    quiz: [
      {
        "question": "Ты спрятал игрушку друга. Бог любит тебя И судит справедливо. Что это значит?",
        "options": [
          "Он сделает вид, что ничего не случилось.",
          "Я могу честно прийти к Нему и признать плохой поступок.",
          "От Него тоже нужно спрятать игрушку."
        ],
        "correct": 1,
        "explanation": "Бог любит нас и знает правду. Мы можем рассказать Ему о случившемся, попросить прощения и вернуть игрушку."
      },
      {
        "question": "Новичка не принимают в игру. Как поступит странник, который следует за Иисусом?",
        "options": [
          "Пригласит его и найдёт ему место в игре.",
          "Не заметит его, чтобы самому победить.",
          "Будет играть только с теми, кто дарит ему вещи."
        ],
        "correct": 0,
        "explanation": "Наш дом — с Богом. По дороге мы можем проявлять Его любовь к людям рядом."
      },
      {
        "question": "Что Иисус отдал ради нашего спасения?",
        "options": [
          "Серебро и золото.",
          "Чужое сокровище.",
          "Свою безгрешную жизнь — Свою драгоценную Кровь."
        ],
        "correct": 2,
        "explanation": "1 Петра 1:18–19 говорит: наше спасение стоило драгоценной Крови Христа. Он отдал Себя за нас."
      },
      {
        "question": "Почему мы можем доверять Иисусу как живому Спасителю?",
        "options": [
          "Его друзья скрыли Его историю.",
          "Бог воскресил Его из мёртвых.",
          "Он на самом деле не умирал."
        ],
        "correct": 1,
        "explanation": "Иисус действительно умер и воскрес. Наша вера и надежда — на Бога, Который воскресил Его (1 Петра 1:21)."
      },
      {
        "question": "Линкольн получил инструменты обратно. Какой больший дар даёт Иисус?",
        "options": [
          "Прощение и новую жизнь с Богом.",
          "Больше игрушек, чем у всех.",
          "Обещание, что следовать за Ним всегда будет легко."
        ],
        "correct": 0,
        "explanation": "Через крест Иисуса Бог уничтожает запись о нашей вине. Иисус также освобождает нас для новой жизни с Ним (Колоссянам 2:13–14)."
      },
      {
        "question": "Как можно ответить на дар Иисуса?",
        "options": [
          "Продолжать делать плохое: теперь всё неважно.",
          "Попытаться купить Его любовь хорошим поведением.",
          "Отвернуться от греха, довериться Ему и следовать за Ним с благодарностью."
        ],
        "correct": 2,
        "explanation": "Покаяние — поворот от греха к Богу. Вера — доверие Иисусу. Наши изменившиеся поступки — благодарный ответ на Его любовь."
      }
    ] satisfies Question[],
    guideIntro: "Читайте и открывайте новое в удобном для ребёнка темпе. Начните с подарка Линкольну, затем свяжите три истины: любящий и справедливый Отец, наш путь домой и дорогое спасение Иисуса.",
    plan: [
      "Подготовьте Библию, бумагу, карандаши и пять карточек событий. Младшим детям помогайте читать.",
      "0–5 минут — Расскажите историю Линкольна. Спросите: что бы ты сказал другу, который вернул тебе очень нужную вещь? Прочитайте вместе 1 Петра 1:17–21.",
      "5–11 минут — Соедините мысли о заботе и справедливости. Обсудите спрятанную игрушку. Объясните: нелицеприятно — справедливо, без любимчиков; благоговение — любовь с глубоким уважением.",
      "11–17 минут — Соберите рюкзак сердца. Спросите, как память о доме с Богом меняет отношение к тому, кого не принимают в игру.",
      "17–24 минуты — Прочитайте стихи 18–21 и расставьте события спасения. Искупление — освобождение ценой выкупа. Свяжите смерть и воскресение Иисуса с покаянием и верой.",
      "24–30 минут — Прочитайте Колоссянам 2:13–14. Объясните уничтоженную запись как прощение через Иисуса. Соберите стих наизусть.",
      "30–36 минут — Ответьте на шесть вопросов. Попросите ребёнка объяснить один ответ своими словами.",
      "36–40 минут — Вернитесь к подарку Линкольну и большему дару Иисуса. Выберите шаг благодарности и помолитесь вместе."
    ],
    discussionTitle: "Обсуждение и примерные ответы",
    discussions: [
      [
        "Называет ли любящий Отец зло добром?",
        "Нет. Его любовь и справедливый суд неразделимы. Фамилия, народ, деньги и религиозное положение не дают преимуществ."
      ],
      [
        "Значит ли страх Божий, что надо прятаться от Него?",
        "Нет. Благоговение серьёзно относится к Его святости и честно приближается, надеясь на милость. Бог не жесток, а грех не безвреден."
      ],
      [
        "Зачем помогать людям, если мы странники?",
        "Надежда за пределами этой жизни помогает ценить людей выше временных призов. Она не отменяет заботу о ближних, природе, обещаниях и работе."
      ],
      [
        "Какую часть спасения оплачивают добрые дела?",
        "Никакую. Основание прощения — жертва Христа. Добрые дела выражают благодарность и новую жизнь: это плод, а не цена."
      ],
      [
        "Что значит уничтоженная запись, а что не значит?",
        "Это образ снятой вины во Христе. Заём сам по себе не грех, бедность не доказывает вину, а денежные обязанности не исчезают автоматически."
      ],
      [
        "К какому ответу зовёт Евангелие?",
        "К покаянию и вере: отвернуться от греха к Богу и довериться распятому и воскресшему Иисусу. Не учите автоматическому спасению всех или спасению за повторение формулы."
      ]
    ],
    notesTitle: "Пояснения и источники",
    notes: [
      "Прочитайте оба отрывка целиком: 1 Петра 1:17–21 и Колоссянам 2:13–14. Английские цитаты — ESV, русские — Синодальный перевод.",
      "Для дальнейшего обсуждения: Деяния 10:34–35 — Пётр узнаёт, что Бог не отдаёт предпочтения одному народу. Второзаконие 10:17–18 связывает справедливый суд с заботой. 1 Петра 2:11–12 связывает наш путь с добрыми поступками.",
      "Джеймс Шорт выкупил и вернул землемерные инструменты Линкольна. Позже Линкольн выплатил долги. Сравните щедрую помощь друга с гораздо большим даром Иисуса. Исторические источники приведены ниже."
    ],
  },
}
