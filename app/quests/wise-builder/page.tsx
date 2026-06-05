import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN = [
  {
    id: 'sand-start',
    place: 'The Sandy Yard',
    title: 'A tower that looks fast',
    body: 'Michael, Joseph, Rosie, and Gracie arrive at Builder’s Yard. A shiny sand tower rises quickly, but its walls wobble whenever the wind blows. Joseph wants to build fast so everyone can see it.',
    caption: 'The sand tower looks impressive, but the ground underneath is soft.',
    danger: 'The shortcut sign says: “Fast is better than faithful.”',
    echo: 'Build fast...',
    thought: 'Listen first.',
    prompt: 'What should Joseph do before building?',
    choices: [
      { label: 'Listen to Jesus’ words and choose the right foundation', good: true, response: 'Wise choice. Jesus says the wise builder hears His words and does them.' },
      { label: 'Build as fast as possible so people clap', good: false, response: 'That is too much throttle too early. A big tower on bad ground will not stand.' },
      { label: 'Copy the tallest tower without checking the ground', good: false, response: 'Copying what looks successful is not the same as wisdom. Check the foundation.' },
    ],
    truth: 'Wisdom starts by listening to Jesus.',
    verse: 'Matthew 7:24 — “Everyone then who hears these words of mine and does them will be like a wise man who built his house on the rock.”',
    alt: 'Joseph studying a wobbly sand tower while Michael Rosie and Gracie look at a glowing Bible foundation marker',
  },
  {
    id: 'rock-foundation',
    place: 'The Rock Foundation',
    title: 'Dig down to the rock',
    body: 'Rosie finds a flat stone under the sand with a glowing Bible resting on it. The rock is not flashy, but it is strong. Building here will take more patience.',
    caption: 'The strong place is hidden lower than the shiny sand.',
    danger: 'The sand whispers: “Doing what Jesus says is too hard.”',
    echo: 'Too hard...',
    thought: 'Obey Him.',
    prompt: 'Which foundation should the friends choose?',
    choices: [
      { label: 'Build on the rock by hearing and obeying Jesus', good: true, response: 'Yes. The wise builder does not only hear Jesus. He obeys Him.' },
      { label: 'Build on the sand because it is easier to dig', good: false, response: 'Easy ground can still be unsafe ground. Jesus calls us to obedience, not shortcuts.' },
      { label: 'Build half on rock and half on sand', good: false, response: 'Half obedience is still a weak foundation. Jesus is worth trusting fully.' },
    ],
    truth: 'Obedience is a strong foundation.',
    verse: 'Luke 6:48 — “he is like a man building a house, who dug deep and laid the foundation on the rock.”',
    alt: 'Rosie pointing to a glowing rock foundation under soft sand while the children prepare to build carefully',
  },
  {
    id: 'storm-test',
    place: 'The Storm Test',
    title: 'Rain on the roof',
    body: 'Clouds gather over Builder’s Yard. Rain taps the roof. Wind pushes against the walls. Gracie holds Rosie’s hand as the storm tests what the house is standing on.',
    caption: 'The storm does not create the foundation. It reveals it.',
    danger: 'The wind says: “If trouble comes, Jesus’ words must not work.”',
    echo: 'Give up...',
    thought: 'Stand on truth.',
    prompt: 'What should the children remember during the storm?',
    choices: [
      { label: 'Trouble can come, but Jesus’ words still stand', good: true, response: 'Right. Jesus never promised no storms. He taught us where to stand when storms come.' },
      { label: 'A Christian never has hard days', good: false, response: 'Careful. Jesus said rain and wind came to both houses. The difference was the foundation.' },
      { label: 'If life is hard, stop listening to Jesus', good: false, response: 'No. Storms are when we need His words even more.' },
    ],
    truth: 'Jesus’ words stand in the storm.',
    verse: 'Matthew 7:25 — “And the rain fell, and the floods came, and the winds blew and beat on that house, but it did not fall.”',
    alt: 'The children inside a small warm house on rock as gentle rain and wind test the walls without fear',
  },
  {
    id: 'house-stands',
    place: 'The House That Stands',
    title: 'The wise builder badge',
    body: 'When the storm passes, the sand tower has slumped into a silly pile, but the little house on the rock still stands. The friends thank Jesus for teaching them how to build a faithful life.',
    caption: 'The house stands because it was built on the right foundation.',
    danger: 'One last shortcut sign says: “Just hear the lesson. You do not need to live it.”',
    echo: 'Only hear...',
    thought: 'Do the Word.',
    prompt: 'What is the wise builder’s next step?',
    choices: [
      { label: 'Ask Jesus for help to obey one truth today', good: true, response: 'Good. Wise builders turn truth into faithful action, one step at a time.' },
      { label: 'Forget the lesson after the storm ends', good: false, response: 'The goal is not only to survive one storm. Jesus teaches us how to live.' },
      { label: 'Feel proud and call everyone else foolish', good: false, response: 'Wisdom should make us humble, thankful, and ready to help others.' },
    ],
    truth: 'I build my life on Jesus by doing what He says.',
    verse: 'James 1:22 — “But be doers of the word, and not hearers only, deceiving yourselves.”',
    alt: 'Michael Joseph Rosie and Gracie celebrating beside a warm little house standing on rock after the storm',
  },
] satisfies QuestScene[]

const RU = [
  {
    id: 'sand-start', place: 'Песочный двор', title: 'Башня, построенная слишком быстро', body: 'Мишутка, Йосик, Рози и Грейси приходят во Двор строителей. Блестящая песочная башня быстро растёт вверх, но стены качаются, когда дует ветер. Йосик хочет строить быстро, чтобы все увидели.', caption: 'Песочная башня выглядит красиво, но земля под ней мягкая.', danger: 'Табличка-подсказка говорит: «Быстро лучше, чем верно».', echo: 'Строй быстро...', thought: 'Сначала слушай.', prompt: 'Что Йосику сделать перед строительством?',
    choices: [
      { label: 'Послушать слова Иисуса и выбрать правильное основание', good: true, response: 'Мудрый выбор. Иисус говорит, что мудрый строитель слышит Его слова и исполняет их.' },
      { label: 'Строить как можно быстрее, чтобы все похвалили', good: false, response: 'Слишком рано слишком много скорости. Большая башня на плохом основании не устоит.' },
      { label: 'Скопировать самую высокую башню, не проверяя землю', good: false, response: 'Копировать то, что выглядит успешным, — не то же самое, что мудрость. Проверь основание.' },
    ], truth: 'Мудрость начинается с того, что мы слушаем Иисуса.', verse: 'Матфея 7:24 — «Всякого, кто слушает слова Мои сии и исполняет их, уподоблю мужу благоразумному, который построил дом свой на камне»', alt: 'Йосик смотрит на шаткую песочную башню, а Мишутка, Рози и Грейси видят светящийся знак библейского основания',
  },
  {
    id: 'rock-foundation', place: 'Каменное основание', title: 'Докопаться до камня', body: 'Рози находит под песком ровный камень, а на нём светится открытая Библия. Камень не такой яркий, как песочная башня, но он крепкий. Строить здесь нужно терпеливо.', caption: 'Крепкое место скрыто глубже, чем блестящий песок.', danger: 'Песок шепчет: «Исполнять слова Иисуса слишком трудно».', echo: 'Слишком трудно...', thought: 'Повинуйся Ему.', prompt: 'Какое основание выбрать друзьям?',
    choices: [
      { label: 'Строить на камне: слушать Иисуса и исполнять Его слова', good: true, response: 'Да. Мудрый строитель не только слышит Иисуса. Он повинуется Ему.' },
      { label: 'Строить на песке, потому что так легче', good: false, response: 'Лёгкое основание может быть опасным. Иисус зовёт нас к послушанию, а не к лёгким обходным путям.' },
      { label: 'Построить половину на камне, половину на песке', good: false, response: 'Половинчатое послушание — слабое основание. Иисусу можно доверять полностью.' },
    ], truth: 'Послушание — крепкое основание.', verse: 'Луки 6:48 — «он подобен человеку, строящему дом, который копал, углубился и положил основание на камне»', alt: 'Рози показывает светящееся каменное основание под мягким песком, а дети готовятся строить осторожно',
  },
  {
    id: 'storm-test', place: 'Испытание бурей', title: 'Дождь на крыше', body: 'Над Двором строителей собираются облака. Дождь стучит по крыше. Ветер давит на стены. Грейси держит Рози за руку, а буря проверяет, на чём стоит дом.', caption: 'Буря не создаёт основание. Она показывает, какое оно.', danger: 'Ветер говорит: «Если пришла трудность, слова Иисуса не работают».', echo: 'Сдавайся...', thought: 'Стой на истине.', prompt: 'Что детям помнить во время бури?',
    choices: [
      { label: 'Трудности бывают, но слова Иисуса стоят крепко', good: true, response: 'Верно. Иисус не обещал жизнь без бурь. Он учит, где стоять, когда бури приходят.' },
      { label: 'У христиан никогда не бывает трудных дней', good: false, response: 'Осторожно. Иисус сказал, что дождь и ветер пришли к обоим домам. Разница была в основании.' },
      { label: 'Если трудно, перестать слушать Иисуса', good: false, response: 'Нет. В бурю Его слова нужны нам ещё больше.' },
    ], truth: 'Слова Иисуса стоят крепко в бурю.', verse: 'Матфея 7:25 — «и пошел дождь, и разлились реки, и подули ветры, и устремились на дом тот, и он не упал»', alt: 'Дети внутри маленького тёплого дома на камне, а спокойный дождь и ветер испытывают стены',
  },
  {
    id: 'house-stands', place: 'Дом, который устоял', title: 'Значок мудрого строителя', body: 'Когда буря проходит, песочная башня превращается в смешную кучу песка, но маленький дом на камне стоит. Друзья благодарят Иисуса за то, что Он учит строить верную жизнь.', caption: 'Дом устоял, потому что был построен на правильном основании.', danger: 'Последняя табличка говорит: «Просто слушай урок. Жить по нему не нужно».', echo: 'Только слушай...', thought: 'Исполняй Слово.', prompt: 'Какой следующий шаг мудрого строителя?',
    choices: [
      { label: 'Попросить Иисуса помочь исполнить одну истину сегодня', good: true, response: 'Хорошо. Мудрые строители превращают истину в верный поступок, шаг за шагом.' },
      { label: 'Забыть урок, когда буря закончилась', good: false, response: 'Цель не просто пережить одну бурю. Иисус учит нас жить.' },
      { label: 'Гордиться собой и называть всех остальных глупыми', good: false, response: 'Мудрость делает нас смиренными, благодарными и готовыми помогать другим.' },
    ], truth: 'Я строю жизнь на Иисусе, когда исполняю Его слова.', verse: 'Иакова 1:22 — «Будьте же исполнители слова, а не слышатели только, обманывающие самих себя.»', alt: 'Мишутка, Йосик, Рози и Грейси радуются возле тёплого маленького дома на камне после бури',
  },
] satisfies QuestScene[]

const ui: Record<'en' | 'ru', QuestUi> = {
  en: {
    quest: 'Wise Builder Quest', title: 'The House on the Rock', subtitle: 'An interactive Bible adventure about hearing Jesus, obeying His words, and building a life that stands.', start: 'Begin Adventure', chooseStep: 'Choose the Next Step', continue: 'Continue', tryAgain: 'Try another answer', truthLight: 'Truth Lights', completed: 'Quest Complete', badge: 'Wise Builder Badge', badgeLine: 'I build my life on Jesus by doing what He says.', bigTruth: 'Big Truth', parent: 'Parent / Teacher Talk', questions: ['What made one house wise and the other foolish?', 'Did both houses face a storm?', 'What is one thing Jesus teaches that you can obey this week?', 'Why is hearing God’s Word not enough by itself?'], prayer: 'Lord Jesus, help me not only hear Your words but do them. Build my life on You, the true Rock. Give me wisdom, courage, and obedience today. Amen.', replay: 'Play Again', back: 'All Quests', correct: 'Truth light collected!', almost: 'Not the right line yet.', verses: 'Matthew 7:24–27 · Luke 6:47–49 · James 1:22', mission: 'Choose the right foundation. Test the house in the storm. Learn to hear and obey Jesus.', scene: 'Scene', of: 'of', path: 'Quest Path', finalVerse: 'Everyone then who hears these words of mine and does them will be like a wise man who built his house on the rock.', finalVerseRef: 'Matthew 7:24', finish: 'Finish Quest'
  },
  ru: {
    quest: 'Квест мудрого строителя', title: 'Дом на камне', subtitle: 'Интерактивное библейское приключение о том, как слушать Иисуса, исполнять Его слова и строить жизнь, которая устоит.', start: 'Начать приключение', chooseStep: 'Выбрать следующий шаг', continue: 'Продолжить', tryAgain: 'Попробовать другой ответ', truthLight: 'Огни истины', completed: 'Квест завершён', badge: 'Значок мудрого строителя', badgeLine: 'Я строю жизнь на Иисусе, когда исполняю Его слова.', bigTruth: 'Главная истина', parent: 'Вопросы для родителей / учителя', questions: ['Почему один строитель был мудрым, а другой неразумным?', 'Пришла ли буря к обоим домам?', 'Какую одну заповедь Иисуса ты можешь исполнить на этой неделе?', 'Почему мало только слушать Божье Слово?'], prayer: 'Господь Иисус, помоги мне не только слушать Твои слова, но и исполнять их. Построй мою жизнь на Тебе, истинном Камне. Дай мне мудрость, смелость и послушание сегодня. Аминь.', replay: 'Играть снова', back: 'Все квесты', correct: 'Огонь истины собран!', almost: 'Пока не тот путь.', verses: 'Матфея 7:24–27 · Луки 6:47–49 · Иакова 1:22', mission: 'Выбери правильное основание. Проверь дом бурей. Учись слушать Иисуса и повиноваться Ему.', scene: 'Сцена', of: 'из', path: 'Путь квеста', finalVerse: 'Всякого, кто слушает слова Мои сии и исполняет их, уподоблю мужу благоразумному, который построил дом свой на камне.', finalVerseRef: 'Матфея 7:24', finish: 'Завершить квест'
  },
}

const questImages: Record<string, string> & { cover: string; badge: string } = {
  cover: '/images/jr/quests/wise-builder/00-cover-wise-builder.png',
  'sand-start': '/images/jr/quests/wise-builder/01-scene-sandy-yard.png',
  'rock-foundation': '/images/jr/quests/wise-builder/02-scene-rock-foundation.png',
  'storm-test': '/images/jr/quests/wise-builder/03-scene-storm-test.png',
  'house-stands': '/images/jr/quests/wise-builder/04-scene-house-stands.png',
  badge: '/images/jr/quests/wise-builder/05-badge-quest-complete.png',
}

export default function WiseBuilderPage() {
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} nextQuest={{ href: '/quests/courage-quest', label: { en: 'Play Next Quest: Courage Quest', ru: 'Следующий квест: Квест мужества' } }} />
}
