import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN = [
  {
    "id": "truth-belt",
    "place": "The Canyon Gate",
    "title": "The belt of truth",
    "body": "The friends enter a canyon where painted signs point in different directions. Rosie opens the Bible, and the true path glows.",
    "caption": "Truth holds everything together.",
    "danger": "A crooked sign says: “Truth changes when you want it to.”",
    "echo": "Any way works...",
    "thought": "God tells truth.",
    "prompt": "What should they fasten first?",
    "choices": [
      {
        "label": "Fasten truth by listening to God’s Word",
        "good": true,
        "response": "Yes. Truth steadies the whole armor."
      },
      {
        "label": "Follow the loudest sign",
        "good": false,
        "response": "Loud does not mean true."
      },
      {
        "label": "Make up a truth that feels easy",
        "good": false,
        "response": "Made-up truth cannot hold us steady."
      }
    ],
    "truth": "God’s truth holds me steady.",
    "verse": "Ephesians 6:14 — the belt of truth helps God’s people stand.",
    "alt": "Children at a canyon gate with a glowing Bible path"
  },
  {
    "id": "faith-shield",
    "place": "The Spark Bridge",
    "title": "The shield of faith",
    "body": "Sparks of fear pop across a narrow bridge. Michael wants to run back, but a bright shield reflects the sparks away.",
    "caption": "Faith trusts God when fear fires at the heart.",
    "danger": "The sparks hiss: “God will not help you.”",
    "echo": "Run back...",
    "thought": "Trust God.",
    "prompt": "How should Michael cross?",
    "choices": [
      {
        "label": "Lift the shield of faith and take the next step",
        "good": true,
        "response": "Good. Faith trusts God through fear."
      },
      {
        "label": "Drop the shield and panic",
        "good": false,
        "response": "Panic pulls the heart off the right line."
      },
      {
        "label": "Pretend he is never afraid",
        "good": false,
        "response": "Courage is not pretending. It is trusting God."
      }
    ],
    "truth": "Faith answers fear with trust.",
    "verse": "Ephesians 6:16 — faith is like a shield.",
    "alt": "Children crossing a bridge with a bright shield of faith"
  },
  {
    "id": "salvation-helmet",
    "place": "The Whispering Pass",
    "title": "The helmet of salvation",
    "body": "Whispers say the children do not belong to God. Gracie remembers that Jesus saves His people, and a bright helmet guards her thoughts.",
    "caption": "Salvation guards our minds from shame and lies.",
    "danger": "The whisper says: “God could not love you.”",
    "echo": "Not loved...",
    "thought": "Jesus saves.",
    "prompt": "What should Gracie remember?",
    "choices": [
      {
        "label": "Jesus saves and keeps those who trust Him",
        "good": true,
        "response": "Yes. Salvation is God’s gift, not our bragging trophy."
      },
      {
        "label": "Try to earn God’s love by being perfect today",
        "good": false,
        "response": "We obey because Jesus loves us, not to buy His love."
      },
      {
        "label": "Listen to shame and hide",
        "good": false,
        "response": "Bring lies into the light of God’s truth."
      }
    ],
    "truth": "Jesus guards my mind with salvation.",
    "verse": "Ephesians 6:17 — the helmet of salvation guards God’s people.",
    "alt": "Children in a pass with a glowing helmet symbol"
  },
  {
    "id": "word-sword",
    "place": "The Final Stand",
    "title": "The sword of the Spirit",
    "body": "At the canyon end, one last lie blocks the path. Joseph opens the Bible, and Scripture light cuts through the dark fog.",
    "caption": "God’s Word helps us answer lies with truth.",
    "danger": "The fog says: “You are alone.”",
    "echo": "Alone...",
    "thought": "Use the Word.",
    "prompt": "What is the right final move?",
    "choices": [
      {
        "label": "Answer the lie with God’s Word and pray",
        "good": true,
        "response": "Right. The sword of the Spirit is God’s Word, and prayer keeps us close to Him."
      },
      {
        "label": "Argue with the fog in your own strength",
        "good": false,
        "response": "God calls us to His strength, not just louder words."
      },
      {
        "label": "Drop the Bible and guess",
        "good": false,
        "response": "Guessing is a weak line when God has spoken."
      }
    ],
    "truth": "God’s Word helps me stand firm.",
    "verse": "Ephesians 6:17–18 — God’s Word and prayer help believers stand.",
    "alt": "Children opening a glowing Bible as fog clears"
  }
] satisfies QuestScene[]

const RU = [
  {
    "id": "truth-belt",
    "place": "Ворота ущелья",
    "title": "Пояс истины",
    "body": "Друзья входят в ущелье, где разные таблички показывают разные дороги. Рози открывает Библию, и настоящий путь начинает светиться.",
    "caption": "Истина держит всё вместе.",
    "danger": "Кривая табличка говорит: «Истина меняется, когда тебе хочется».",
    "echo": "Любой путь...",
    "thought": "Бог говорит истину.",
    "prompt": "Что нужно взять сначала?",
    "choices": [
      {
        "label": "Препоясаться истиной, слушая Божье Слово",
        "good": true,
        "response": "Да. Истина укрепляет всё всеоружие."
      },
      {
        "label": "Следовать самой громкой табличке",
        "good": false,
        "response": "Громко не значит истинно."
      },
      {
        "label": "Придумать удобную истину",
        "good": false,
        "response": "Придуманная истина не удержит нас."
      }
    ],
    "truth": "Божья истина держит меня крепко.",
    "verse": "Ефесянам 6:14 — пояс истины помогает Божьему народу стоять.",
    "alt": "Дети у ворот ущелья со светящейся библейской тропой"
  },
  {
    "id": "faith-shield",
    "place": "Мост искр",
    "title": "Щит веры",
    "body": "Искры страха летят над узким мостом. Мишутка хочет вернуться, но яркий щит отражает искры.",
    "caption": "Вера доверяет Богу, когда страх летит в сердце.",
    "danger": "Искры шипят: «Бог тебе не поможет».",
    "echo": "Беги назад...",
    "thought": "Доверься Богу.",
    "prompt": "Как Мишутке перейти мост?",
    "choices": [
      {
        "label": "Поднять щит веры и сделать следующий шаг",
        "good": true,
        "response": "Хорошо. Вера доверяет Богу через страх."
      },
      {
        "label": "Опустить щит и паниковать",
        "good": false,
        "response": "Паника сбивает сердце с правильного пути."
      },
      {
        "label": "Делать вид, что он никогда не боится",
        "good": false,
        "response": "Мужество — не притворство. Это доверие Богу."
      }
    ],
    "truth": "Вера отвечает страху доверием.",
    "verse": "Ефесянам 6:16 — вера похожа на щит.",
    "alt": "Дети переходят мост с ярким щитом веры"
  },
  {
    "id": "salvation-helmet",
    "place": "Шепчущий проход",
    "title": "Шлем спасения",
    "body": "Шёпот говорит детям, что они не принадлежат Богу. Грейси вспоминает, что Иисус спасает Свой народ, и яркий шлем хранит её мысли.",
    "caption": "Спасение хранит наш разум от стыда и лжи.",
    "danger": "Шёпот говорит: «Бог не может любить тебя».",
    "echo": "Не любит...",
    "thought": "Иисус спасает.",
    "prompt": "Что Грейси помнить?",
    "choices": [
      {
        "label": "Иисус спасает и хранит тех, кто доверяет Ему",
        "good": true,
        "response": "Да. Спасение — Божий дар, а не наш трофей для хвастовства."
      },
      {
        "label": "Заработать Божью любовь идеальным поведением",
        "good": false,
        "response": "Мы повинуемся, потому что Иисус любит нас, а не чтобы купить Его любовь."
      },
      {
        "label": "Слушать стыд и прятаться",
        "good": false,
        "response": "Приноси ложь к свету Божьей истины."
      }
    ],
    "truth": "Иисус хранит мой разум спасением.",
    "verse": "Ефесянам 6:17 — шлем спасения хранит Божий народ.",
    "alt": "Дети в проходе с символом светящегося шлема"
  },
  {
    "id": "word-sword",
    "place": "Последняя стойкость",
    "title": "Меч Духа",
    "body": "В конце ущелья последняя ложь закрывает дорогу. Йосик открывает Библию, и свет Писания прорезает тёмный туман.",
    "caption": "Божье Слово помогает отвечать лжи истиной.",
    "danger": "Туман говорит: «Ты один».",
    "echo": "Один...",
    "thought": "Используй Слово.",
    "prompt": "Какой верный последний шаг?",
    "choices": [
      {
        "label": "Ответить лжи Божьим Словом и молиться",
        "good": true,
        "response": "Верно. Меч Духа — Божье Слово, а молитва держит нас рядом с Богом."
      },
      {
        "label": "Спорить с туманом своей силой",
        "good": false,
        "response": "Бог зовёт нас к Его силе, а не просто к громким словам."
      },
      {
        "label": "Опустить Библию и угадывать",
        "good": false,
        "response": "Угадывать — слабый путь, когда Бог уже сказал."
      }
    ],
    "truth": "Божье Слово помогает мне стоять крепко.",
    "verse": "Ефесянам 6:17–18 — Божье Слово и молитва помогают верующим стоять.",
    "alt": "Дети открывают светящуюся Библию, и туман рассеивается"
  }
] satisfies QuestScene[]

const ui: Record<'en' | 'ru', QuestUi> = {
  "en": {
    "chooseStep": "Choose the Next Step",
    "continue": "Continue",
    "tryAgain": "Try another answer",
    "truthLight": "Truth Lights",
    "completed": "Quest Complete",
    "bigTruth": "Big Truth",
    "parent": "Parent / Teacher Talk",
    "replay": "Play Again",
    "back": "All Quests",
    "correct": "Truth light collected!",
    "almost": "Not the right line yet.",
    "scene": "Scene",
    "of": "of",
    "path": "Quest Path",
    "finish": "Finish Quest",
    "quest": "Armor of God Quest",
    "title": "Stand Firm Canyon",
    "subtitle": "An interactive Bible adventure about standing firm in God’s strength.",
    "start": "Begin Armor Quest",
    "badge": "Stand Firm Badge",
    "badgeLine": "God helps me stand firm in His strength.",
    "questions": [
      "What does it mean to stand firm in God’s strength?",
      "Why do we need truth when lies come?",
      "How does faith help when fear feels loud?",
      "Why is God’s Word like a sword?"
    ],
    "prayer": "Lord, help me stand firm in Your strength. Guard my heart with truth, faith, salvation, and Your Word. Amen.",
    "verses": "Ephesians 6:10–18 · Psalm 119:11 · Hebrews 4:12",
    "mission": "Choose God’s armor pieces and stand firm through the canyon.",
    "finalVerse": "Ephesians 6:10–18 — God tells His people to put on His armor."
  },
  "ru": {
    "chooseStep": "Выбрать следующий шаг",
    "continue": "Продолжить",
    "tryAgain": "Попробовать другой ответ",
    "truthLight": "Огни истины",
    "completed": "Квест завершён",
    "bigTruth": "Главная истина",
    "parent": "Вопросы для родителей / учителя",
    "replay": "Играть снова",
    "back": "Все квесты",
    "correct": "Огонь истины собран!",
    "almost": "Пока не тот путь.",
    "scene": "Сцена",
    "of": "из",
    "path": "Путь квеста",
    "finish": "Завершить квест",
    "quest": "Квест всеоружия Божьего",
    "title": "Ущелье стойкости",
    "subtitle": "Интерактивное библейское приключение о том, как стоять крепко Божьей силой.",
    "start": "Начать квест",
    "badge": "Значок стойкости",
    "badgeLine": "Бог помогает мне стоять крепко Его силой.",
    "questions": [
      "Что значит стоять крепко Божьей силой?",
      "Почему нам нужна истина, когда приходит ложь?",
      "Как вера помогает, когда страх звучит громко?",
      "Почему Божье Слово похоже на меч?"
    ],
    "prayer": "Господь, помоги мне стоять крепко Твоей силой. Храни моё сердце истиной, верой, спасением и Твоим Словом. Аминь.",
    "verses": "Ефесянам 6:10–18 · Псалом 118:11 · Евреям 4:12",
    "mission": "Выбирай Божье всеоружие и стой крепко в ущелье.",
    "finalVerse": "Ефесянам 6:10–18 — Бог велит Своему народу облечься во всеоружие Божье."
  }
}

const questImages: Record<string, string> & { cover: string; badge: string } = {
  "cover": "/images/jr/quests/armor-of-god/00-cover-armor-of-god.png",
  "truth-belt": "/images/jr/quests/armor-of-god/01-scene-truth-belt.png",
  "faith-shield": "/images/jr/quests/armor-of-god/02-scene-faith-shield.png",
  "salvation-helmet": "/images/jr/quests/armor-of-god/03-scene-salvation-helmet.png",
  "word-sword": "/images/jr/quests/armor-of-god/04-scene-word-sword.png",
  "badge": "/images/jr/quests/armor-of-god/05-badge-armor-of-god.png"
}

export default function ArmorOfGodPage() {
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} nextQuest={{ href: '/quests/good-samaritan', label: { en: 'Play Next Quest: Good Samaritan', ru: 'Следующий квест: Добрый самарянин' } }} />
}
