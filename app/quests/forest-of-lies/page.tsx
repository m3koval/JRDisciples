import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN = [
  {
    "id": "forked-path",
    "place": "The Forked Path",
    "title": "Two signs in the forest",
    "body": "Michael, Rosie, and Joseph enter a toy-brick forest where glowing leaves float like little lanterns. Two wooden signs point opposite directions, but one sign is crooked and covered with shadowy vines.",
    "caption": "Two paths appear, but only one lines up with the truth light.",
    "danger": "A whisper says: “Any path is fine if it feels easy.”",
    "echo": "Easy path...",
    "thought": "Test it.",
    "prompt": "How should Joseph choose the path?",
    "choices": [
      {
        "label": "Compare the signs with the truth light from God’s Word",
        "good": true,
        "response": "Good. God’s Word helps Joseph test what he sees and hears."
      },
      {
        "label": "Pick the path with the biggest shortcut sign",
        "good": false,
        "response": "Shortcuts can lie. Easy is not always faithful."
      },
      {
        "label": "Follow the darkest path because it seems exciting",
        "good": false,
        "response": "Exciting is not the same as true. Wisdom looks for God’s light."
      }
    ],
    "truth": "God’s Word helps me test the path.",
    "verse": "Psalm 119:105 — “Your word is a lamp to my feet...”",
    "alt": "Joseph holding a small open Bible lantern at a forked forest path with Michael and Rosie studying two wooden signs"
  },
  {
    "id": "mirror-lake",
    "place": "Mirror Lake",
    "title": "The mirror tells a lie",
    "body": "At Mirror Lake, the water shows Joseph looking small and useless. The reflection is not telling the truth; it is twisting what God made.",
    "caption": "The reflection looks real, but God’s truth is stronger than a lying mirror.",
    "danger": "The lake whispers: “You are not important.”",
    "echo": "Not important...",
    "thought": "Made by God.",
    "prompt": "What truth should Joseph answer with?",
    "choices": [
      {
        "label": "God made me on purpose, and I belong to Him",
        "good": true,
        "response": "Yes. God’s truth names Joseph better than the lying reflection does."
      },
      {
        "label": "I am only important if everyone claps for me",
        "good": false,
        "response": "That gives people the job only God can hold. Your worth comes from Him."
      },
      {
        "label": "Maybe the lie is true if I feel sad",
        "good": false,
        "response": "Feelings matter, but feelings are not always the truth."
      }
    ],
    "truth": "God made me on purpose.",
    "verse": "Psalm 139:14 — “I am fearfully and wonderfully made.”",
    "alt": "Joseph standing before a glowing mirror lake while the false reflection fades under golden Bible light"
  },
  {
    "id": "vine-maze",
    "place": "The Vine Maze",
    "title": "Twisted words",
    "body": "The path squeezes into a maze of soft green vines. Some vines twist true words into almost-truths. Rosie sees a vine shaped like a question mark.",
    "caption": "Almost-truths can trap the feet if no one checks the words carefully.",
    "danger": "The vine whispers: “God only loves you when you are perfect.”",
    "echo": "Be perfect first...",
    "thought": "Grace is true.",
    "prompt": "Which answer cuts the vine?",
    "choices": [
      {
        "label": "Jesus loves sinners and calls us to follow Him",
        "good": true,
        "response": "Truth cuts the vine. Jesus does not wait for perfect people before showing grace."
      },
      {
        "label": "I should hide from God until I never sin",
        "good": false,
        "response": "Hiding keeps the vine wrapped tight. God calls us to come to Him."
      },
      {
        "label": "Sin does not matter at all",
        "good": false,
        "response": "Sin matters, and grace is real. Jesus forgives and changes us."
      }
    ],
    "truth": "Jesus gives grace and calls me to follow.",
    "verse": "Romans 5:8 — “While we were still sinners, Christ died for us.”",
    "alt": "Rosie using warm truth light to part twisting green vines while Michael and Joseph follow through the maze"
  },
  {
    "id": "truth-tree",
    "place": "The Truth Tree",
    "title": "The forest opens",
    "body": "At the center of the forest stands a huge tree with glowing fruit like little truth lights. The lies grow quiet as the children speak God’s Word together.",
    "caption": "The forest opens when truth is spoken with faith.",
    "danger": "One last whisper says: “Keep truth to yourself.”",
    "echo": "Stay quiet...",
    "thought": "Speak truth.",
    "prompt": "What should the friends do with the truth they found?",
    "choices": [
      {
        "label": "Speak it, remember it, and help others find the path",
        "good": true,
        "response": "Yes. Truth is a gift to live by and share with love."
      },
      {
        "label": "Hide it so no one else gets any",
        "good": false,
        "response": "God’s truth is not treasure to hoard. It gives light to others too."
      },
      {
        "label": "Trade it for an easier-looking map",
        "good": false,
        "response": "A false map cannot lead home. Stay with God’s Word."
      }
    ],
    "truth": "God’s truth sets me free.",
    "verse": "John 8:32 — “You will know the truth, and the truth will set you free.”",
    "alt": "Michael Rosie and Joseph gathered under a giant glowing truth tree as the dark forest opens into warm light"
  }
] satisfies QuestScene[]

const RU = [
  {
    "id": "forked-path",
    "place": "Развилка в лесу",
    "title": "Две таблички в лесу",
    "body": "Мишутка, Рози и Йосик входят в яркий лес из игрушечных кирпичиков. Светящиеся листья парят, как маленькие фонарики. Две деревянные таблички указывают в разные стороны, но одна стоит криво и оплетена тёмными лианами.",
    "caption": "Перед друзьями два пути, но только один согласуется со светом истины.",
    "danger": "Шёпот говорит: «Любой путь хорош, если он кажется лёгким.»",
    "echo": "Лёгкий путь...",
    "thought": "Проверь.",
    "prompt": "Как Йосику выбрать путь?",
    "choices": [
      { "label": "Сравнить таблички со светом Божьего Слова", "good": true, "response": "Верно. Божье Слово помогает Йосику проверять то, что он видит и слышит." },
      { "label": "Выбрать путь с самой большой табличкой «срезать дорогу»", "good": false, "response": "Короткий путь может обмануть. Легко — не всегда верно." },
      { "label": "Пойти по самому тёмному пути, потому что он кажется интересным", "good": false, "response": "Интересно — не то же самое, что истинно. Мудрость ищет Божий свет." }
    ],
    "truth": "Божье Слово помогает мне проверять путь.",
    "verse": "Псалом 118:105 — «Слово Твоё — светильник ноге моей...»",
    "alt": "Йосик держит маленький открытый библейский фонарь у развилки, а Мишутка и Рози изучают две деревянные таблички"
  },
  {
    "id": "mirror-lake",
    "place": "Зеркальное озеро",
    "title": "Зеркало говорит ложь",
    "body": "У Зеркального озера вода показывает Йосика маленьким и бесполезным. Отражение говорит неправду: оно искажает то, что создал Бог.",
    "caption": "Отражение выглядит настоящим, но Божья истина сильнее лживого зеркала.",
    "danger": "Озеро шепчет: «Ты не важен.»",
    "echo": "Не важен...",
    "thought": "Создан Богом.",
    "prompt": "Какой истиной Йосик должен ответить?",
    "choices": [
      { "label": "Бог создал меня с целью, и я принадлежу Ему", "good": true, "response": "Да. Божья истина говорит о Йосике лучше, чем лживое отражение." },
      { "label": "Я важен только тогда, когда все мне хлопают", "good": false, "response": "Это отдаёт людям место, которое принадлежит только Богу. Твоя ценность от Него." },
      { "label": "Может быть, ложь правда, если мне грустно", "good": false, "response": "Чувства важны, но чувства не всегда говорят истину." }
    ],
    "truth": "Бог создал меня с целью.",
    "verse": "Псалом 138:14 — «Дивно устроен я.»",
    "alt": "Йосик стоит перед светящимся зеркальным озером, а ложное отражение исчезает в золотом библейском свете"
  },
  {
    "id": "vine-maze",
    "place": "Лабиринт лиан",
    "title": "Искажённые слова",
    "body": "Тропа сужается и входит в лабиринт мягких зелёных лиан. Некоторые лианы искажают истинные слова, делая их почти правдой. Рози замечает лиану в форме вопросительного знака.",
    "caption": "Почти-правда может запутать ноги, если никто внимательно не проверяет слова.",
    "danger": "Лиана шепчет: «Бог любит тебя только когда ты совершенен.»",
    "echo": "Сначала стань совершенным...",
    "thought": "Благодать истинна.",
    "prompt": "Какой ответ разрежет лиану?",
    "choices": [
      { "label": "Иисус любит грешников и зовёт нас следовать за Ним", "good": true, "response": "Истина разрезает лиану. Иисус не ждёт, пока люди станут совершенными, чтобы явить благодать." },
      { "label": "Мне надо прятаться от Бога, пока я совсем не перестану грешить", "good": false, "response": "Прятки только сильнее затягивают лиану. Бог зовёт нас прийти к Нему." },
      { "label": "Грех совсем не имеет значения", "good": false, "response": "Грех имеет значение, и благодать реальна. Иисус прощает и меняет нас." }
    ],
    "truth": "Иисус даёт благодать и зовёт меня следовать за Ним.",
    "verse": "К Римлянам 5:8 — «Христос умер за нас, когда мы были ещё грешниками.»",
    "alt": "Рози тёплым светом истины раздвигает зелёные лианы, а Мишутка и Йосик идут через лабиринт"
  },
  {
    "id": "truth-tree",
    "place": "Дерево истины",
    "title": "Лес открывается",
    "body": "В центре леса стоит огромное дерево со светящимися плодами, похожими на маленькие огни истины. Ложь затихает, когда дети вместе произносят Божье Слово.",
    "caption": "Лес открывается, когда истину говорят с верой.",
    "danger": "Последний шёпот говорит: «Оставь истину только себе.»",
    "echo": "Молчи...",
    "thought": "Говори истину.",
    "prompt": "Что друзьям делать с найденной истиной?",
    "choices": [
      { "label": "Говорить её, помнить её и помогать другим найти путь", "good": true, "response": "Да. Истина — это дар, чтобы жить по ней и делиться ею с любовью." },
      { "label": "Спрятать её, чтобы никому другому не досталось", "good": false, "response": "Божья истина не сокровище для жадности. Она даёт свет и другим." },
      { "label": "Обменять её на карту, которая выглядит легче", "good": false, "response": "Ложная карта не приведёт домой. Держись Божьего Слова." }
    ],
    "truth": "Божья истина делает меня свободным.",
    "verse": "От Иоанна 8:32 — «И познаете истину, и истина сделает вас свободными.»",
    "alt": "Мишутка, Рози и Йосик стоят под огромным светящимся деревом истины, а тёмный лес открывается в тёплый свет"
  }
] satisfies QuestScene[]

const ui = {
  "en": {
    "quest": "The Forest of Lies",
    "title": "The Forest of Lies",
    "subtitle": "Follow truth lights through the trees and learn how God’s Word helps us reject lies.",
    "start": "Begin Adventure",
    "chooseStep": "Choose the Next Step",
    "continue": "Continue",
    "tryAgain": "Try another answer",
    "truthLight": "Truth Lights",
    "completed": "Quest Complete",
    "badge": "The Forest of Lies Badge",
    "badgeLine": "God’s truth helps me recognize and reject lies.",
    "bigTruth": "Big Truth",
    "parent": "Parent / Teacher Talk",
    "questions": [
      "What choice helped the children follow God?",
      "Which lie or fear tried to pull them off track?",
      "What Bible truth answered the problem?",
      "How can we practice this truth this week?"
    ],
    "prayer": "Lord Jesus, help me remember Your truth and choose the right way with a soft heart. Amen.",
    "replay": "Play Again",
    "back": "All Quests",
    "correct": "Truth light collected!",
    "almost": "Not the right line yet.",
    "verses": "John 8:32",
    "mission": "Follow truth lights. Test every whisper. Collect four truth lights.",
    "scene": "Scene",
    "of": "of",
    "path": "Quest Path",
    "finalVerse": "God’s truth helps me recognize and reject lies.",
    "finish": "Finish Quest"
  },
  "ru": {
    "quest": "Лес лжи",
    "title": "Лес лжи",
    "subtitle": "Иди за огнями истины и узнай, как Божье Слово помогает распознавать ложь.",
    "start": "Начать приключение",
    "chooseStep": "Выбрать следующий шаг",
    "continue": "Продолжить",
    "tryAgain": "Попробовать другой ответ",
    "truthLight": "Огни истины",
    "completed": "Квест завершён",
    "badge": "Значок: Лес лжи",
    "badgeLine": "Божья истина помогает мне распознавать ложь.",
    "bigTruth": "Главная истина",
    "parent": "Вопросы для родителей / учителя",
    "questions": [
      "Какой выбор помог детям следовать за Богом?",
      "Какая ложь или страх мешали им?",
      "Какая библейская истина помогла?",
      "Как мы можем применить это на этой неделе?"
    ],
    "prayer": "Господь Иисус, помоги мне помнить Твою истину и выбирать правильный путь. Аминь.",
    "replay": "Играть снова",
    "back": "Все квесты",
    "correct": "Огонь истины собран!",
    "almost": "Пока не тот путь.",
    "verses": "Иоанна 8:32",
    "mission": "Иди за светом истины. Проверяй каждый шёпот. Собери четыре огня истины.",
    "scene": "Сцена",
    "of": "из",
    "path": "Путь квеста",
    "finalVerse": "Божья истина помогает мне распознавать ложь.",
    "finish": "Завершить квест"
  }
} satisfies Record<'en' | 'ru', QuestUi>

const questImages: Record<string, string> & { cover: string; badge: string } = {
  "cover": "/images/jr/quests/forest-of-lies/00-cover-forest-of-lies.png",
  "badge": "/images/jr/quests/forest-of-lies/05-badge-quest-complete.png",
  "forked-path": "/images/jr/quests/forest-of-lies/01-scene-forked-path.png",
  "mirror-lake": "/images/jr/quests/forest-of-lies/02-scene-mirror-lake.png",
  "vine-maze": "/images/jr/quests/forest-of-lies/03-scene-vine-maze.png",
  "truth-tree": "/images/jr/quests/forest-of-lies/04-scene-truth-tree.png"
}

export default function ForestOfLiesPage() {
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} nextQuest={{ href: '/quests/storm-rescue', label: { en: 'Play Next Quest: The Storm Rescue', ru: 'Следующий квест: Спасение в буре' } }} />
}
