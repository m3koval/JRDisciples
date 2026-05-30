import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN: QuestScene[] = [
  {
    id: 'entrance',
    place: 'The Cave Entrance',
    title: 'The lamb is lost',
    body: 'Mica sees his little sister crying. Her small wooden lamb rolled into the Cave of Echoes. The cave is dark, and everyone says it whispers scary things.',
    caption: 'Mica raises the lamp. The cave waits in the dark.',
    danger: 'The first echo whispers: “Turn back. You are too scared.”',
    echo: 'Turn back...',
    thought: 'Pray first?',
    prompt: 'What should Mica do first?',
    choices: [
      { label: 'Pray, lift the lamp, and take one careful step', good: true, response: 'Wise choice. Courage starts by trusting God, not by pretending the cave is easy.' },
      { label: 'Brag: “I am never scared!”', good: false, response: 'Not quite. Real courage tells the truth: “I am afraid, but God is with me.”' },
      { label: 'Run in without thinking', good: false, response: 'Slow down. Wisdom asks God for help before rushing into danger.' },
    ],
    truth: 'God helps me take the next right step.',
    verse: 'Psalm 56:3 — “When I am afraid, I put my trust in you.”',
    alt: 'Mica and Liora at the glowing cave entrance looking for the lost wooden lamb',
  },
  {
    id: 'whispers',
    place: 'The Whispering Tunnel',
    title: 'The cave tells a lie',
    body: 'Mica walks deeper. The walls sparkle like black glass. Suddenly the cave repeats a lie again and again.',
    caption: 'The tunnel sparkles, but the whisper is a lie.',
    danger: '“You are alone… alone… alone…”',
    echo: 'Alone...',
    thought: 'What is true?',
    prompt: 'Which truth should Mica answer with?',
    choices: [
      { label: '“God is with me wherever I go.”', good: true, response: 'Yes. God’s truth is stronger than fear’s echo.' },
      { label: '“Nothing scary will ever happen.”', good: false, response: 'Careful. God does not promise nothing scary will happen. He promises He is with His people.' },
      { label: '“I am the strongest kid here.”', good: false, response: 'That puts trust in self. Bible courage puts trust in God.' },
    ],
    truth: 'God is with me in scary places.',
    verse: 'Joshua 1:9 — “The Lord your God is with you wherever you go.”',
    alt: 'Mica holding a lantern in the whispering tunnel while golden light pushes back blue shadows',
  },
  {
    id: 'stones',
    place: 'The Cracked Stone Path',
    title: 'One step at a time',
    body: 'Mica finds a path of cracked stones over a deep shadow. He cannot see the whole way, but his lamp shows the next stone.',
    caption: 'Only the next stone is lit. That is enough for one step.',
    danger: 'The echo says: “If you cannot see the end, you should quit.”',
    echo: 'Quit now...',
    thought: 'Next step?',
    prompt: 'What is the faithful choice?',
    choices: [
      { label: 'Step only where the lamp gives light', good: true, response: 'Good. God often gives enough light for the next step, not the whole map.' },
      { label: 'Throw the lamp away and jump', good: false, response: 'That is reckless, not courageous. Courage walks with wisdom.' },
      { label: 'Sit down forever until fear disappears', good: false, response: 'Fear may not vanish first. With God’s help, Mica can obey while afraid.' },
    ],
    truth: 'God’s Word is a lamp for my path.',
    verse: 'Psalm 119:105 — “Your word is a lamp to my feet and a light to my path.”',
    alt: 'Mica carefully crossing glowing cracked stones with his lantern lighting the next step',
  },
  {
    id: 'rescue',
    place: 'The Deep Chamber',
    title: 'The lost lamb is found',
    body: 'At the deepest part of the cave, Mica sees the wooden lamb stuck between two rocks. The fear echo grows louder than before.',
    caption: 'The lamb is close. Fear gets loudest near the finish.',
    danger: '“You cannot finish. You should give up now.”',
    echo: 'Give up...',
    thought: 'Trust God.',
    thoughtSlot: 'bottom-right',
    prompt: 'What should Mica remember?',
    choices: [
      { label: '“When I am afraid, I put my trust in You.”', good: true, response: 'Yes. Mica reaches out, rescues the lamb, and turns toward the light.' },
      { label: '“I only obey when it feels easy.”', good: false, response: 'Following God is not only for easy moments. Faith keeps going with God.' },
      { label: '“I should listen to every voice I hear.”', good: false, response: 'No. We test voices by God’s Word. Fear lies, but God tells the truth.' },
    ],
    truth: 'I can trust God when I am afraid.',
    verse: 'Psalm 56:3 — “When I am afraid, I put my trust in you.”',
    alt: 'Mica rescuing the wooden lamb in the deep chamber as golden lantern light fills the cave',
  },
]

const RU: QuestScene[] = [
  {
    id: 'entrance', place: 'Вход в пещеру', title: 'Потерянный ягнёнок', body: 'Мика видит, что его маленькая сестра плачет. Её деревянный ягнёнок укатился в Пещеру эха. В пещере темно, и все говорят, что она шепчет страшные слова.', caption: 'Мика поднимает светильник. Пещера ждёт в темноте.', danger: 'Первое эхо шепчет: «Поверни назад. Тебе слишком страшно».', echo: 'Назад...', thought: 'Сначала молитва?', prompt: 'Что Мике сделать сначала?',
    choices: [
      { label: 'Помолиться, поднять светильник и сделать один осторожный шаг', good: true, response: 'Мудрый выбор. Мужество начинается с доверия Богу.' },
      { label: 'Похвастаться: «Мне никогда не страшно!»', good: false, response: 'Не совсем. Настоящее мужество говорит правду: «Мне страшно, но Бог со мной».' },
      { label: 'Бежать внутрь не думая', good: false, response: 'Не спеши. Мудрость просит Бога о помощи.' },
    ], truth: 'Бог помогает мне сделать следующий правильный шаг.', verse: 'Псалом 55:4 — «Когда я в страхе, на Тебя я уповаю».', alt: 'Мика и Лиора у светящегося входа в пещеру ищут потерянного деревянного ягнёнка',
  },
  {
    id: 'whispers', place: 'Шепчущий туннель', title: 'Пещера говорит ложь', body: 'Мика идёт глубже. Стены сверкают, как чёрное стекло. Вдруг пещера повторяет ложь снова и снова.', caption: 'Туннель сверкает, но шёпот говорит ложь.', danger: '«Ты один… один… один…»', echo: 'Один...', thought: 'Что правда?', prompt: 'Какой истиной должен ответить Мика?',
    choices: [
      { label: '«Бог со мной, куда бы я ни пошёл.»', good: true, response: 'Да. Божья истина сильнее эха страха.' },
      { label: '«Со мной никогда не случится ничего страшного.»', good: false, response: 'Осторожно. Бог обещает быть с нами, а не то, что никогда не будет страшно.' },
      { label: '«Я самый сильный ребёнок здесь.»', good: false, response: 'Это доверие себе. Библейское мужество доверяет Богу.' },
    ], truth: 'Бог со мной в страшных местах.', verse: 'Иисус Навин 1:9 — «Господь Бог твой с тобою везде, куда ни пойдёшь».', alt: 'Мика держит светильник в шепчущем туннеле, а золотой свет отгоняет синие тени',
  },
  {
    id: 'stones', place: 'Тропа треснувших камней', title: 'Шаг за шагом', body: 'Мика видит каменную тропу над глубокой тенью. Он не видит весь путь, но светильник показывает следующий камень.', caption: 'Освещён только следующий камень. Этого достаточно для одного шага.', danger: 'Эхо говорит: «Если ты не видишь конец пути, лучше остановись».', echo: 'Стой...', thought: 'Следующий шаг?', prompt: 'Какой выбор верный?',
    choices: [
      { label: 'Ступить туда, где светильник показывает путь', good: true, response: 'Хорошо. Бог часто даёт свет для следующего шага.' },
      { label: 'Бросить светильник и прыгнуть', good: false, response: 'Это безрассудство, а не мужество. Мужество идёт вместе с мудростью.' },
      { label: 'Сесть навсегда, пока страх не исчезнет', good: false, response: 'Страх может не исчезнуть сразу. С Божьей помощью можно повиноваться даже когда страшно.' },
    ], truth: 'Слово Божие — светильник для моего пути.', verse: 'Псалом 118:105 — «Слово Твоё — светильник ноге моей и свет стезе моей».', alt: 'Мика осторожно идёт по светящимся камням, а светильник показывает следующий шаг',
  },
  {
    id: 'rescue', place: 'Глубокий зал', title: 'Ягнёнок найден', body: 'В самой глубокой части пещеры Мика видит деревянного ягнёнка между двумя камнями. Эхо страха становится ещё громче.', caption: 'Ягнёнок близко. Страх громче всего перед победой.', danger: '«Ты не справишься. Сдавайся сейчас».', echo: 'Сдавайся...', thought: 'Доверяй Богу.', thoughtSlot: 'bottom-right', prompt: 'Что Мике нужно вспомнить?',
    choices: [
      { label: '«Когда я в страхе, на Тебя я уповаю.»', good: true, response: 'Да. Мика достаёт ягнёнка и идёт обратно к свету.' },
      { label: '«Я слушаюсь только когда легко.»', good: false, response: 'Следовать за Богом нужно не только в лёгкие моменты.' },
      { label: '«Я должен слушать каждый голос.»', good: false, response: 'Нет. Мы проверяем голоса Божьим Словом.' },
    ], truth: 'Я могу доверять Богу, когда мне страшно.', verse: 'Псалом 55:4 — «Когда я в страхе, на Тебя я уповаю».', alt: 'Мика спасает деревянного ягнёнка в глубоком зале, а золотой свет наполняет пещеру',
  },
]

const ui: Record<'en' | 'ru', QuestUi> = {
  en: {
    quest: 'Courage Quest', title: 'The Cave of Echoes', subtitle: 'An interactive Bible adventure about courage, fear, and trusting God.', start: 'Begin Adventure', chooseStep: 'Choose the Next Step', continue: 'Continue', tryAgain: 'Try another answer', truthLight: 'Truth Lights', completed: 'Quest Complete', badge: 'Courage Quest Badge', badgeLine: 'I can trust God when I am afraid.', bigTruth: 'Big Truth', parent: 'Parent / Teacher Talk', questions: ['Was Mica afraid?', 'Did God make the cave disappear?', 'What Bible truth helped Mica keep going?', 'What is one brave right thing you can do this week?'], prayer: 'Lord, when I am afraid, help me trust You. Give me courage to do what is right, one step at a time. In Jesus’ name, amen.', replay: 'Play Again', back: 'All Quests', correct: 'Truth light collected!', almost: 'Not the right line yet.', verses: 'Psalm 56:3 · Joshua 1:9 · Psalm 119:105', mission: 'Rescue the lamb. Answer fear with truth. Collect four truth lights.', scene: 'Scene', of: 'of', path: 'Quest Path', finalVerse: '“When I am afraid, I put my trust in you.”', finish: 'Finish Quest'
  },
  ru: {
    quest: 'Квест мужества', title: 'Пещера эха', subtitle: 'Интерактивное библейское приключение о мужестве, страхе и доверии Богу.', start: 'Начать приключение', chooseStep: 'Выбрать следующий шаг', continue: 'Продолжить', tryAgain: 'Попробовать другой ответ', truthLight: 'Огни истины', completed: 'Квест завершён', badge: 'Значок квеста мужества', badgeLine: 'Я могу доверять Богу, когда мне страшно.', bigTruth: 'Главная истина', parent: 'Вопросы для родителей / учителя', questions: ['Мике было страшно?', 'Бог убрал пещеру?', 'Какая библейская истина помогла Мике идти дальше?', 'Какой один смелый и правильный шаг ты можешь сделать на этой неделе?'], prayer: 'Господь, когда мне страшно, помоги мне доверять Тебе. Дай мне мужество поступать правильно, шаг за шагом. Во имя Иисуса, аминь.', replay: 'Играть снова', back: 'Все квесты', correct: 'Огонь истины собран!', almost: 'Пока не тот путь.', verses: 'Псалом 55:4 · Иисус Навин 1:9 · Псалом 118:105', mission: 'Спаси ягнёнка. Ответь страху истиной. Собери четыре огня истины.', scene: 'Сцена', of: 'из', path: 'Путь квеста', finalVerse: '«Когда я в страхе, на Тебя я уповаю».', finish: 'Завершить квест'
  },
}

const questImages: Record<string, string> & { cover: string; badge: string } = {
  cover: '/images/jr/quests/courage-quest/00-cover-courage-quest.png',
  entrance: '/images/jr/quests/courage-quest/01-scene-cave-entrance.png',
  whispers: '/images/jr/quests/courage-quest/02-scene-whispering-tunnel.png',
  stones: '/images/jr/quests/courage-quest/03-scene-cracked-stone-path.png',
  rescue: '/images/jr/quests/courage-quest/04-scene-deep-chamber-rescue.png',
  badge: '/images/jr/quests/courage-quest/05-badge-quest-complete.png',
}

export default function CourageQuestPage() {
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} />
}
