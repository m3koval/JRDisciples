export type Scene = {
  title: string; paragraphs: string[]; verses: string[]; kind: 'choice' | 'select' | 'order' | 'memory' | 'match';
  task: string; options: string[]; answer: number[]; hint: string; truth: string;
}
export const copy = {
  en: {
    title: 'Alone with God', eyebrow: 'A little pause. A real conversation.',
    intro: 'One more level! Michael’s game is getting exciting. But Rosie has a question that makes him look up. Come with them and discover why time with our heavenly Father is worth a pause.',
    alt: 'Michael praying beside an open Bible in the warm morning light.',
    all: 'All lessons', start: 'Join Michael and Rosie', play: 'Let’s try it', next: 'Keep going', back: 'Read the story again',
    progress: 'Discoveries', check: 'Check my answer', clear: 'Try a new order', retry: 'Not quite yet.', success: 'You found it!',
    hint: 'A little help', memory: 'Memory verse', source: 'Read in the Bible', again: 'Explore again',
    guide: 'For a parent or teacher', done: 'The game can wait a moment',
    doneText: 'The next morning, Michael reaches for his game. Then he puts it down. “I want to talk to my Father first.” Later he can play, help Rosie, and talk to God again. There is so much to share with his Father!',
    responseTitle: 'Your own quiet moment', response: 'You can talk to God now, aloud or silently. Thank Him, tell Him what is on your heart, ask forgiveness, or ask for help. You do not have to tell us or anyone in the group your prayer.',
    privacy: 'Your prayer is between you and God. You do not have to share it.',
    planTitle: 'What small step would help you?', plans: ['Put my game aside before breakfast and talk to God.', 'Find a quiet, safe spot and read a Bible verse with help.', 'Remember to talk to God during my day, too.'],
    planReply: 'You can try that. If you forget, you can begin again—God’s love is not a reward for a perfect routine.',
    nextLesson: 'Learn more: How to pray', printable: 'Take the lesson home', englishPdf: 'English printable (PDF)', russianPdf: 'Russian printable (PDF)',
    printHelp: 'LETTER paper • landscape • print both sides, flip on the LONG edge • fold in half.',
    adult: [
      'Read together with children about ages 6–11. Pause for their questions. Michael and Rosie are an invented everyday story; the Bible accounts are retold, and the displayed quotations are exact ESV / Russian Synodal (RST) text.',
      'The heart of the lesson: God loved us first; Christ died for sinners (1 John 4:19; Romans 5:8). Prayer responds to His grace. It does not earn reconciliation, forgiveness, or affection. Explain trusting Jesus without pressuring a public response.',
      'Matthew 6:6 contrasts sincere prayer to the Father with showing off. It is not a ban on praying together. A closed door, silence, an early hour, and long prayers do not make prayer magical. A child can choose a safe quiet place without hiding from a caregiver. Never require children to stay awake all night.',
      'Read Mark 1:35–38 and Luke 6:12–13 in context: Jesus sought His Father amid people’s demands and before choosing the twelve. Luke 11:1 records a disciple asking Him to teach them to pray; do not add a claim that disciples never asked about miracles.',
      'Read Ephesians 6:10–18 together: prayer belongs with depending on God in spiritual struggle. It is not a spell or a promise that every problem disappears. Help children pray and also take wise action, tell the truth, and ask a trusted adult for help.',
      'Psalm 63 in English is Psalm 62 in Russian. The psalm expresses thirst for God and joy in His love. Ask: What do you enjoy about knowing God, not only about receiving gifts? Invite a private response; do not grade the child’s prayer.'
    ],
    matchPrompts: ['Before a hard choice', 'When a friend is hurting', 'When I want to hide a lie'],
    matchAnswers: ['Ask God for wisdom.', 'Pray for my friend and offer help.', 'Ask forgiveness and tell the truth.'],
    scenes: [
      { title: 'Who loved first?', verses: ['love', 'grace'], kind: 'choice', paragraphs: [
        '“One more level!” Michael says.',
        'Rosie sits beside him. “You said you wanted to pray this morning.”',
        '“I forgot. Will God only love me if I remember every day?”',
        '“Let’s look in the Bible,” Rosie says. God did not wait for us to become good enough. He loved us first. Jesus died for us while we were still sinners, to bring us back to God.',
        '“So prayer isn’t how I buy His love?” Michael asks. Right! We come to God because of His love, not to earn it. Michael pauses his game. He can come honestly, even after forgetting.'
      ], task: 'Help Michael finish the thought: I can come to God…', options: ['because I have never forgotten to pray.', 'because He loved us first, not because I earned His love.', 'only after I pray longer than everyone else.'], answer: [1], hint: 'Look for who loved first. God’s love is not a prize for a perfect morning.', truth: 'God takes the first step in love. We respond by trusting Jesus and coming to our Father.' },
      { title: 'A conversation, not a show', verses: ['private'], kind: 'select', paragraphs: [
        'Michael turns the sound down. “Should I say a really fancy prayer so everybody hears?”',
        '“Who are you talking to?” Rosie asks.',
        '“God,” he says. “Not an audience!”',
        'Jesus taught His followers to pray to their Father in private. A quiet place helps us pay attention. Our Father hears us in noisy places, too.',
        '“I could put my game down and sit over there,” Michael says. You do not need an appointment to talk to your heavenly Father. A small morning pause is a good place to begin.'
      ], task: 'Choose TWO things that help Michael turn his attention to the Father.', options: ['Use huge words to impress Rosie.', 'Put the game aside for a little while.', 'Tell God honestly what is on his heart.', 'Wait for a perfectly silent house or do not pray.'], answer: [1, 2], hint: 'One choice removes a distraction. Another makes this an honest conversation, not a performance.', truth: 'Quiet helps us pay attention. We talk honestly with our Father because He loves us.' },
      { title: 'Even when everyone wanted Jesus', verses: ['morning', 'night'], kind: 'order', paragraphs: [
        '“Was Jesus ever busy?” Michael asks. Very busy! People came to Him for help. Mark tells us that Jesus got up while it was still dark and went to a lonely place to pray. When His friends found Him, He went on to preach in other towns.',
        'Luke tells us about another time: Jesus spent the night praying to God. When day came, He chose twelve apostles from His disciples. He did not let important work crowd out time with His Father.',
        '“I can talk to God before a hard choice, too,” Michael says. Before your next hard choice, pause and ask your Father for help.'
      ], task: 'Put Luke’s account in order. Tap all three, then check.', options: ['Jesus goes to the mountain to pray.', 'He spends the night in prayer to God.', 'When day comes, He chooses twelve apostles.'], answer: [0, 1, 2], hint: 'First the mountain, then a night of prayer, then the choice when day comes.', truth: 'Prayer mattered to Jesus, even with crowds to help and important choices to make.' },
      { title: 'Can you teach me?', verses: ['teach'], kind: 'choice', paragraphs: [
        '“But I don’t always know what to say,” Michael admits. Rosie points to another Bible story. A disciple watched Jesus pray and asked Him to teach them to pray.',
        'You can learn, too! Speak to God in your own words. Thank Him. Ask for help to do what is right. Tell Him you are sorry for sin. Pray for someone else.',
        'The Bible teaches us what God is like and how to follow Him. Michael opens his Bible: “Let’s learn from Jesus.”'
      ], task: 'Michael feels stuck. Which next step follows the disciple’s example?', options: ['Ask to learn from Jesus and begin with honest words.', 'Pretend he already knows everything about prayer.', 'Give up until he can make a perfect speech.'], answer: [0], hint: 'The disciple did not pretend. He asked Jesus to teach him.', truth: 'You do not have to be an expert to begin. Jesus teaches His followers to pray.' },
      { title: 'Only in the morning?', verses: ['continual'], kind: 'memory', paragraphs: [
        'At breakfast, Michael asks, “If I prayed already, is that all for today?”',
        'Rosie smiles. “Can you talk to someone you love more than once?”',
        'Paul tells believers to keep praying. That does not mean talking without taking a breath or never doing your schoolwork. Keep turning to God through your day: when you are thankful, worried, sorry, or need help.',
        'A morning time can help you begin. You can also pray on the way to school or before bed. Let’s remember this very short Bible verse together.'
      ], task: 'Build the memory verse. Tap the words in order, then check.', options: [], answer: [], hint: 'Read the verse, say it aloud if you like, then try the words again.', truth: 'Keep coming back to God. He is not only part of your morning.' },
      { title: 'When doing right feels hard', verses: ['struggle'], kind: 'match', paragraphs: [
        'Later, Michael knocks over Rosie’s model. He wants to hide it. “I need help to tell the truth,” he thinks. This is a moment to pray—and then do what is right.',
        'Paul writes about standing firm with God’s help in a spiritual struggle. He tells believers to pray for others, too. We depend on God instead of facing temptation alone. He gives us strength to obey, even when it is hard.',
        'Michael can ask forgiveness and help fix the model. When a problem is too big, he can pray and ask a trusted grown-up for help.'
      ], task: 'Match each moment with a way to pray and respond.', options: [], answer: [], hint: 'Wisdom helps with a choice. Care reaches a friend. Forgiveness and truth belong with a lie.', truth: 'We pray for God’s help, pray for others, and take the next right step.' },
      { title: 'More than a wish list', verses: ['longing', 'delight'], kind: 'choice', paragraphs: [
        '“I ask God for lots of things,” Michael says. “Can I talk to Him when I don’t need a new thing?”',
        '“Of course!” Rosie says. “You can thank Him and enjoy knowing Him.”',
        'In the psalm, David longs for God like a thirsty person longs for water. He praises God because His steadfast love is better than life. God Himself matters more than the gifts He gives.',
        'Michael’s game is still there. But he has found a better reason to pause: not to win a prize, not to impress Rosie, but to spend time with his heavenly Father.'
      ], task: 'Tomorrow morning, what would show what Michael has learned?', options: ['Pray only if he wants a new game.', 'Count his words so he can beat Rosie’s prayer.', 'Put the game aside, thank God for His love, and talk honestly with Him.'], answer: [2], hint: 'David delights in God Himself, not just in getting something from Him.', truth: 'We can enjoy God’s gifts and love the Giver most. Time with our Father is worth a pause.' }
    ] as Scene[]
  },
  ru: {
    title: 'Наедине с Богом', eyebrow: 'Остановись на минутку. Поговори с Отцом.',
    intro: 'Ещё один уровень! Миша увлёкся игрой. Но Роза задаёт вопрос, и он наконец поднимает глаза. Пойдём с ними и узнаем, почему стоит отложить игру ради разговора с Небесным Отцом.',
    alt: 'Миша молится рядом с открытой Библией в тёплом утреннем свете.',
    all: 'Все уроки', start: 'Пойдём с Мишей и Розой', play: 'Попробуем вместе', next: 'Идём дальше', back: 'Прочитать ещё раз',
    progress: 'Открытия', check: 'Проверить ответ', clear: 'Собрать заново', retry: 'Пока не совсем так.', success: 'Верно!',
    hint: 'Нужна подсказка?', memory: 'Стих на память', source: 'Прочитать в Библии', again: 'Пройти ещё раз',
    guide: 'Родителям и учителям', done: 'Игра немного подождёт',
    doneText: 'На следующее утро Миша тянется к игре. Потом откладывает её. «Сначала хочу поговорить с моим Отцом». Позже он сможет поиграть, помочь Розе и снова помолиться. Как много всего можно рассказать Отцу!',
    responseTitle: 'Твоя тихая минутка', response: 'Ты можешь поговорить с Богом сейчас: вслух или про себя. Поблагодари Его, расскажи, что у тебя на сердце, попроси прощения или помощи. Не нужно рассказывать нам или всей группе, о чём ты молился.',
    privacy: 'Это твой разговор с Богом. Не обязательно рассказывать о нём другим.',
    planTitle: 'Какой маленький шаг поможет тебе?', plans: ['До завтрака отложить игру и поговорить с Богом.', 'Найти спокойное, безопасное место и с чьей-то помощью прочитать стих.', 'Вспоминать о Боге и молиться в течение дня.'],
    planReply: 'Попробуй. А если забудешь — начни снова. Божья любовь не награда за идеальный распорядок.',
    nextLesson: 'Узнать больше: как молиться', printable: 'Возьми урок домой', englishPdf: 'Лист на английском (PDF)', russianPdf: 'Лист на русском (PDF)',
    printHelp: 'Бумага LETTER • альбомная ориентация • печать с двух сторон, переворот по ДЛИННОМУ краю • сложить пополам.',
    adult: [
      'Читайте вместе с детьми примерно 6–11 лет и давайте время для вопросов. Миша и Роза — герои вымышленной бытовой истории. Библейские события пересказаны, а выделенные цитаты приведены точно по ESV / Синодальному переводу (RST).',
      'Главное: Бог первым возлюбил нас; Христос умер за грешников (1 Иоанна 4:19; Римлянам 5:8). Молитва — ответ на благодать, а не плата за примирение, прощение или любовь. Расскажите о доверии Иисусу без требования публичного решения.',
      'В Матфея 6:6 искренняя молитва Отцу противопоставлена желанию показаться перед людьми. Совместная молитва не запрещается. Закрытая дверь, тишина, ранний час и длина молитвы не дают ей особой силы. Ребёнок может выбрать безопасное тихое место, не скрываясь от взрослых. Не просите детей бодрствовать всю ночь.',
      'Прочитайте Марка 1:35–38 и Луки 6:12–13 в контексте. Иисус молился среди забот о людях и перед выбором двенадцати. В Луки 11:1 ученик просит научить их молиться. Не добавляйте недоказанное утверждение, будто ученики никогда не просили научить их чудесам.',
      'Прочитайте Ефесянам 6:10–18: в духовной борьбе мы полагаемся на Бога и молимся. Молитва — не заклинание и не обещание исчезновения всех трудностей. Учите детей молиться и действовать мудро: говорить правду, помогать и обращаться за помощью к надёжному взрослому.',
      'Псалом 63 в английской Библии — это Псалом 62 в русской. Давид жаждет Бога и радуется Его любви. Спросите: чему ты радуешься в Самом Боге, а не только в Его подарках? Предложите личную молитву без обязательного ответа вслух и без оценки.'
    ],
    matchPrompts: ['Перед трудным выбором', 'Когда другу тяжело', 'Когда хочется скрыть ложь'],
    matchAnswers: ['Попросить у Бога мудрости.', 'Помолиться за друга и предложить помощь.', 'Попросить прощения и сказать правду.'],
    scenes: [
      { title: 'Кто полюбил первым?', verses: ['love', 'grace'], kind: 'choice', paragraphs: [
        '«Ещё один уровень!» — говорит Миша.',
        'Роза садится рядом. «Ты ведь хотел утром помолиться».',
        '«Забыл… А Бог будет любить меня, только если я каждый день буду помнить?»',
        '«Давай откроем Библию», — предлагает Роза. Бог не ждал, пока мы станем достаточно хорошими. Он первым полюбил нас. Иисус умер за нас, когда мы были ещё грешниками, чтобы вернуть нас к Богу.',
        '«Значит, молитвой я не покупаю Его любовь?» — спрашивает Миша. Верно! Мы приходим к Богу благодаря Его любви, а не чтобы её заслужить. Миша ставит игру на паузу. Он может прийти к Богу честно, даже если раньше забыл о Нём.'
      ], task: 'Помоги Мише закончить мысль: я могу прийти к Богу…', options: ['потому что никогда не забывал молиться.', 'потому что Он первым полюбил нас, а не потому, что я заслужил любовь.', 'только если помолюсь дольше всех.'], answer: [1], hint: 'Кто полюбил первым? Божья любовь — не приз за утро без ошибок.', truth: 'Бог первым проявил любовь. Мы отвечаем Ему: доверяем Иисусу и приходим к Отцу.' },
      { title: 'Разговор, а не выступление', verses: ['private'], kind: 'select', paragraphs: [
        'Миша убавляет звук. «А надо сказать очень красивую молитву, чтобы все услышали?»',
        '«А с кем ты разговариваешь?» — спрашивает Роза.',
        '«С Богом. Не со зрителями!»',
        'Иисус учил молиться Отцу наедине. Тихое место помогает не отвлекаться. Наш Отец слышит нас и там, где шумно.',
        '«Отложу игру и посижу вон там», — решает Миша. К Небесному Отцу не нужно записываться на приём. Можно начать с небольшой утренней молитвы.'
      ], task: 'Выбери ДВА шага, которые помогут Мише обратиться к Отцу.', options: ['Говорить сложными словами, чтобы удивить Розу.', 'Ненадолго отложить игру.', 'Честно рассказать Богу, что у него на сердце.', 'Не молиться, пока во всём доме не станет совершенно тихо.'], answer: [1, 2], hint: 'Один шаг убирает то, что отвлекает. Другой помогает говорить честно, а не выступать.', truth: 'В тишине легче не отвлекаться. Мы искренне говорим с Отцом, Который любит нас.' },
      { title: 'Даже когда все искали Иисуса', verses: ['morning', 'night'], kind: 'order', paragraphs: [
        '«А Иисус бывал занят?» — спрашивает Миша. Ещё как! Люди приходили к Нему за помощью. Марк рассказывает: Иисус встал, когда было ещё темно, ушёл в пустынное место и молился. Когда ученики нашли Его, Он пошёл проповедовать в другие селения.',
        'А Лука рассказывает о другом случае: Иисус всю ночь молился Богу. Когда настал день, Он выбрал из учеников двенадцать апостолов. Важные дела не вытеснили общение с Отцом.',
        '«Перед трудным выбором я тоже могу помолиться», — говорит Миша. Перед трудным решением остановись и попроси Отца о помощи.'
      ], task: 'Собери события из рассказа Луки по порядку. Нажми на все три, потом проверь.', options: ['Иисус поднимается на гору помолиться.', 'Он проводит ночь в молитве к Богу.', 'Когда наступает день, Он выбирает двенадцать апостолов.'], answer: [0, 1, 2], hint: 'Сначала гора, потом ночь в молитве, затем выбор учеников с наступлением дня.', truth: 'Иисус находил время для Отца, даже когда Его ждали люди и предстояли важные решения.' },
      { title: 'А меня можно научить?', verses: ['teach'], kind: 'choice', paragraphs: [
        '«Я не всегда знаю, что сказать», — признаётся Миша. Роза находит ещё один рассказ. Ученик видел, как Иисус молится, и попросил научить их молиться.',
        'Ты тоже можешь учиться! Говори с Богом своими словами. Поблагодари Его. Попроси помочь поступить правильно. Скажи, что сожалеешь о грехе. Помолись за другого человека.',
        'Из Библии мы узнаём, какой Бог и как следовать за Ним. Миша открывает Библию: «Давай учиться у Иисуса».'
      ], task: 'Миша не знает, с чего начать. Какой шаг похож на поступок ученика?', options: ['Учиться у Иисуса и начать с простых, честных слов.', 'Сделать вид, что он уже всё знает о молитве.', 'Ждать, пока сможет произнести безупречную речь.'], answer: [0], hint: 'Ученик не притворялся. Он попросил Иисуса научить его.', truth: 'Чтобы начать, не нужно всё уметь. Иисус учит Своих учеников молиться.' },
      { title: 'Только утром?', verses: ['continual'], kind: 'memory', paragraphs: [
        'За завтраком Миша спрашивает: «Я уже помолился. На сегодня всё?»',
        'Роза улыбается: «А с тем, кого любишь, можно поговорить ещё раз?»',
        'Павел призывает верующих постоянно обращаться к Богу. Это не значит говорить без остановки и не делать уроки. Снова и снова обращайся к Богу: когда радуешься, тревожишься, просишь прощения или нуждаешься в помощи.',
        'Утренняя молитва — хорошее начало. Но можно молиться и по дороге в школу, и перед сном. Давай запомним короткий стих из Библии.'
      ], task: 'Собери стих на память. Нажимай на слова по порядку, потом проверь.', options: [], answer: [], hint: 'Прочитай стих, повтори его вслух, если хочешь, и снова собери слова.', truth: 'Обращайся к Богу снова и снова. Общение с Ним не заканчивается утром.' },
      { title: 'Когда трудно поступить правильно', verses: ['struggle'], kind: 'match', paragraphs: [
        'Позже Миша нечаянно ломает Розину постройку. Хочется всё скрыть. «Мне нужна помощь, чтобы сказать правду», — думает он. Самое время помолиться, а потом поступить правильно.',
        'Павел пишет, как с Божьей помощью оставаться верным в духовной борьбе. Он зовёт молиться и за других. Мы просим Бога помочь нам не поддаться греху и поступить правильно, даже когда это трудно.',
        'Миша может попросить прощения и помочь починить постройку. А если беда слишком большая, можно помолиться и обратиться к надёжному взрослому.'
      ], task: 'Подбери к каждой ситуации молитву и следующий шаг.', options: [], answer: [], hint: 'Для выбора нужна мудрость. Другу нужна забота. Вместо лжи нужны прощение и правда.', truth: 'Мы просим Божьей помощи, молимся за других и поступаем правильно.' },
      { title: 'Не только список желаний', verses: ['longing', 'delight'], kind: 'choice', paragraphs: [
        '«Я много всего прошу у Бога, — говорит Миша. — А можно поговорить с Ним, когда мне не нужна новая вещь?»',
        '«Конечно! — отвечает Роза. — Можно благодарить Его и радоваться тому, что ты Его знаешь».',
        'В псалме Давид жаждет Бога, как человек в жаркой пустыне жаждет воды. Он славит Бога: Его милость лучше жизни. Сам Бог дороже всех Его подарков.',
        'Игра никуда не исчезла. Но теперь Миша знает, ради чего её отложить. Не ради приза и не чтобы удивить Розу, а чтобы побыть с Небесным Отцом.'
      ], task: 'Как Миша может применить урок завтра утром?', options: ['Молиться, только если хочется новую игру.', 'Считать слова, чтобы обогнать Розу.', 'Отложить игру, поблагодарить Бога за любовь и честно поговорить с Ним.'], answer: [2], hint: 'Давид радуется Самому Богу, а не только подаркам от Него.', truth: 'Можно радоваться Божьим дарам и больше всего любить Самого Бога. Ради общения с Отцом стоит остановиться.' }
    ] as Scene[]
  }
}
