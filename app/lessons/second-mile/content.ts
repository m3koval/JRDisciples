// Bible.com ESV (59) / Russian Synodal RST (167); verified before implementation.
export const images = ['00-cover', '01-road', '02-heart', '03-help', '04-grace', '05-complete'].map(name => `/images/jr/lessons/second-mile/${name}.webp`)
export const scriptureEn = [
  { reference: 'Matthew 5:41', text: 'And if anyone forces you to go one mile, go with him two miles.', url: 'https://www.bible.com/bible/59/MAT.5.41.ESV' },
  { reference: 'Matthew 5:44', text: 'But I say to you, Love your enemies and pray for those who persecute you', url: 'https://www.bible.com/bible/59/MAT.5.44.ESV' },
  { reference: 'Romans 12:21', text: 'Do not be overcome by evil, but overcome evil with good.', url: 'https://www.bible.com/bible/59/ROM.12.21.ESV' },
  { reference: 'Ephesians 2:8–9', text: 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.', url: 'https://www.bible.com/bible/59/EPH.2.8-10.ESV' },
]
export const scriptureRu = [
  { reference: 'Матфея 5:41', text: 'и кто принудит тебя идти с ним одно поприще, иди с ним два.', url: 'https://www.bible.com/bible/167/MAT.5.41.RST' },
  { reference: 'Матфея 5:44', text: 'А Я говорю вам: любите врагов ваших, благословляйте проклинающих вас, благотворите ненавидящим вас и молитесь за обижающих вас и гонящих вас', url: 'https://www.bible.com/bible/167/MAT.5.44.RST' },
  { reference: 'Римлянам 12:21', text: 'Не будь побежден злом, но побеждай зло добром.', url: 'https://www.bible.com/bible/167/ROM.12.21.RST' },
  { reference: 'Ефесянам 2:8–9', text: 'Ибо благодатью вы спасены через веру, и сие не от вас, Божий дар: не от дел, чтобы никто не хвалился.', url: 'https://www.bible.com/bible/167/EPH.2.8-10.RST' },
]
export const copy = {
  en: {
    title: 'The Second Mile', intro: 'Can I choose love when I feel like getting even? Walk with Michael, Joseph, Rosie, and Gracie. Discover the freedom Jesus gives us to do good.',
    start: 'Take the first step', next: 'Next step', play: 'Try the puzzle', check: 'Check my path', hint: 'Show a hint', undo: 'Undo last tile', clear: 'Clear tiles', retry: 'Not yet. You can try again!', success: 'You found it!', progress: 'Steps completed', all: 'All lessons', again: 'Explore again', saved: 'Your steps save on this device when storage is available.',
    titles: ['A surprising road', 'What is moving my heart?', 'Love with wise hands', 'A gift, not a wage'],
    teaching: [
      'Jesus spoke to people living under Roman rule. Being forced to carry a load could stir up anger. His surprising invitation: instead of getting even, freely choose generous love. Doing our ordinary duty is good too!',
      'The same helpful act can come from very different hearts. I might help to get praise, or help because someone matters. Jesus teaches us to love even enemies and pray for them. We can tell Him honestly when we feel hurt.',
      'Look: Joseph offers Michael water. Love notices a need. A classmate who hurt you drops some books. You can offer help without calling the hurt okay. If a request is dangerous, say no and tell a trusted adult.',
      'Grace means God’s kindness that we cannot earn. God does not sell salvation for good deeds. Jesus died for our sins and rose again. We receive God’s gift through faith in Jesus. Ephesians 2:10 teaches that we are made in Christ for good works. We serve in thanks, not to buy His love.',
    ],
    tasks: ['Build Jesus’ sentence. Tap the pieces in order.', 'Sort each thought. Tap a thought, then its heart basket.', 'Connect each situation to a wise, loving action. Tap one on each side.', 'Build the grace path. What comes first? Tap the cards in order.'],
    hints: ['Start with “And if anyone”. Read the verse again: one mile comes before two miles.', 'Love cares about the person. A bargain wants praise, payment, or revenge.', 'Books need helping hands. A lonely child needs welcome. Danger needs a trusted adult.', 'God gives first. We receive through faith. Good works are our thankful response, not the price.'],
    learns: ['The extra mile pictures willing love, not a new distance rule for children.', 'Jesus can free us from keeping a revenge score. Ask Him for a willing heart.', 'Kindness is not a trick to change someone. They may still be unkind. We can choose good and get help.', 'Grace comes first! Our help reflects God’s generosity; it never earns salvation.'],
    verseTiles: ['And if anyone', 'forces you to go', 'one mile,', 'go with him', 'two miles.'],
    baskets: ['A bargain / getting even', 'Generous love'],
    thoughts: ['I’ll help so everyone praises me.', 'I can help even if no one notices.', 'I’ll refuse to help just to get even.', 'I can pray for someone who hurt me.'],
    needs: ['Books fall on the floor', 'A child is left out', 'Someone asks for a dangerous secret'],
    actions: ['Tell a trusted adult', 'Offer to pick them up', 'Invite the child to join'],
    graceTiles: ['God gives salvation by grace', 'We receive through faith in Jesus', 'We do good in thankful love'],
    done: 'A heart free to love', doneText: 'You finished the learning trail! Your next step is not a bigger score. It is one small, safe act of love with Jesus’ help.',
    planTitle: 'Choose a step to try today', plans: ['Help tidy a shared space without asking for praise.', 'Welcome someone who is left out.', 'Pray for someone who was unkind; ask an adult for help if needed.'], planSaved: 'My step to try:', prayer: 'Jesus, thank You for Your gift of grace. Help me choose love instead of revenge. Give me wisdom to ask for help. Amen.',
    parent: 'For a grown-up', note: 'Read Matthew 5:38–48 and Ephesians 2:8–10 together. Our four child guides are fictional; their village examples apply Jesus’ teaching. The Roman-road scene illustrates the setting, not an additional Bible event or a precise legal reconstruction. Jesus calls us to willing enemy-love, not a new distance formula. Ask: What is the difference between loving freely and trying to buy approval? Kindness does not guarantee that mistreatment stops. Protect children and help them report harm. Completing this lesson measures learning, not faith or worth.',
    alts: ['The Junior Disciples discover a road of generous love', 'A Roman-road illustration of carrying a load', 'The friends consider a willing and generous heart', 'Michael brings an apple basket to a garden table while Joseph offers water', 'The friends learn that grace is a gift', 'The friends celebrate a new step of love'], nextLesson: 'Discover more about grace',
  },
  ru: {
    title: 'Второе поприще', intro: 'Можно ли выбрать любовь, когда хочется отомстить? Пройди путь с Мишуткой, Йосиком, Рози и Грейси. Иисус даёт нам свободу делать добро.',
    start: 'Сделать первый шаг', next: 'Следующий шаг', play: 'Решить задание', check: 'Проверить мой путь', hint: 'Показать подсказку', undo: 'Убрать последнюю карточку', clear: 'Убрать карточки', retry: 'Пока не так. Попробуй ещё!', success: 'Получилось!', progress: 'Пройдено шагов', all: 'Все уроки', again: 'Пройти ещё раз', saved: 'Шаги сохраняются на этом устройстве, если доступно хранилище.',
    titles: ['Необычная дорога', 'Что движет моим сердцем?', 'Любовь и мудрая помощь', 'Дар, а не плата'],
    teaching: [
      'Иисус говорил людям, жившим под властью Рима. Если человека заставляли нести груз, он мог сердиться. Иисус зовёт не мстить, а свободно выбирать щедрую любовь. Честно выполнять обычные обязанности — тоже хорошо! Поприще здесь означает меру пути.',
      'Помогать можно с разными мыслями. Можно ждать похвалы, а можно заботиться о человеке. Иисус учит любить даже врагов и молиться за них. Ему можно честно сказать, когда нам больно.',
      'Посмотри: Йосик предлагает Мишутке воду. Любовь замечает нужду. Тот, кто тебя обидел, уронил книги? Можно предложить помощь, не оправдывая обиду. Опасные просьбы выполнять не нужно: скажи «нет» и расскажи надёжному взрослому.',
      'Благодать — Божья доброта, которую нельзя заработать. Бог не продаёт спасение за добрые дела. Иисус умер за наши грехи и воскрес. Мы принимаем Божий дар через веру в Иисуса. Ефесянам 2:10 учит: мы созданы во Христе для добрых дел. Мы служим с благодарностью, а не покупаем Его любовь.',
    ],
    tasks: ['Собери слова Иисуса. Нажимай на части по порядку.', 'Разложи мысли. Нажми на мысль, затем на корзину.', 'Соедини ситуацию с мудрым добрым поступком. Нажми по одной карточке с каждой стороны.', 'Собери путь благодати. Что сначала? Нажимай карточки по порядку.'],
    hints: ['Начни со слов «и кто принудит тебя». Прочитай стих: сначала одно поприще, затем два.', 'Любовь заботится о человеке. Сделка ждёт похвалы, платы или мести.', 'Книги можно поднять. Одинокого ребёнка — пригласить. Об опасности надо сказать взрослому.', 'Сначала Бог даёт. Мы принимаем через веру. Добрые дела — ответ благодарности, а не цена.'],
    learns: ['Второе поприще — образ добровольной любви, а не новое правило расстояния для детей.', 'Иисус освобождает нас от желания мстить. Попроси Его помочь любить от сердца.', 'Доброта — не хитрость, чтобы изменить другого. Он может остаться недобрым. Мы можем делать добро и просить помощи.', 'Сначала благодать! Наша помощь отражает Божью щедрость, но ею нельзя заслужить спасение.'],
    verseTiles: ['и кто принудит тебя', 'идти с ним', 'одно поприще,', 'иди с ним', 'два.'],
    baskets: ['Сделка / месть', 'Щедрая любовь'],
    thoughts: ['Помогу, чтобы все меня хвалили.', 'Могу помочь, даже если никто не заметит.', 'Не помогу, чтобы отомстить.', 'Могу молиться за того, кто меня обидел.'],
    needs: ['Книги упали на пол', 'Ребёнка не берут в игру', 'Просят хранить опасный секрет'],
    actions: ['Рассказать надёжному взрослому', 'Предложить поднять книги', 'Пригласить ребёнка играть'],
    graceTiles: ['Бог даёт спасение по благодати', 'Мы принимаем через веру в Иисуса', 'Мы делаем добро с благодарной любовью'],
    done: 'Сердце, свободное любить', doneText: 'Ты прошёл учебный путь! Следующий шаг — не больше очков. Это один маленький и безопасный поступок любви с помощью Иисуса.',
    planTitle: 'Выбери шаг на сегодня', plans: ['Помочь убрать общее место, не требуя похвалы.', 'Принять в игру того, кто остался один.', 'Помолиться за обидчика; при необходимости попросить взрослого помочь.'], planSaved: 'Мой шаг:', prayer: 'Иисус, спасибо за Твой дар благодати. Помоги мне выбирать любовь, а не месть. Дай мудрость просить помощи. Аминь.',
    parent: 'Для взрослого', note: 'Прочитайте вместе Матфея 5:38–48 и Ефесянам 2:8–10. Наши четверо детей-проводников — вымышленные герои. Примеры из их жизни помогают применить учение Иисуса. Сцена на римской дороге показывает историческую обстановку. Это не отдельное библейское событие и не точное описание римских законов. Иисус зовёт добровольно любить даже врагов, а не даёт новую формулу расстояния. Обсудите: чем свободная любовь отличается от попытки купить одобрение? Доброта не гарантирует прекращения жестокости. Защищайте детей и помогайте им сообщать о вреде. Завершение урока показывает обучение, а не веру или ценность ребёнка.',
    alts: ['Юные ученики открывают путь щедрой любви', 'Историческая иллюстрация: груз на римской дороге', 'Друзья размышляют о щедром сердце', 'Мишутка ставит корзину яблок на садовый стол, а Йосик предлагает воду', 'Друзья узнают, что благодать — дар', 'Друзья радуются новому шагу любви'], nextLesson: 'Узнать больше о благодати',
  },
}
