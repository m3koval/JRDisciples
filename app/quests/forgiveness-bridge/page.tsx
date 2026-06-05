import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN = [
  {
    "id": "broken-bridge",
    "place": "The Broken Bridge",
    "title": "The bridge is broken",
    "body": "Michael and Rosie reach a bright river. The kindness bridge is cracked because Joseph accidentally knocked loose the final golden plank while hurrying ahead. Rosie feels angry and hurt.",
    "caption": "The river sparkles, but the broken plank blocks the way.",
    "danger": "Anger whispers: “Make him feel bad first.”",
    "echo": "Stay angry...",
    "thought": "Mercy first?",
    "prompt": "What should Rosie do first?",
    "choices": [
      {
        "label": "Tell the truth kindly and ask God for help",
        "good": true,
        "response": "Wise choice. Forgiveness starts by bringing hurt into the light without being cruel."
      },
      {
        "label": "Shout until Joseph feels small",
        "good": false,
        "response": "That makes the break bigger. God calls His children to speak truth with love."
      },
      {
        "label": "Pretend nothing happened while staying bitter",
        "good": false,
        "response": "Hidden bitterness still hurts the heart. Forgiveness is honest and merciful."
      }
    ],
    "truth": "God helps me speak truth with love.",
    "verse": "Ephesians 4:15 — “Speaking the truth in love, we are to grow up in every way into him who is the head, into Christ,”",
    "alt": "Rosie and Michael standing by a glowing broken bridge while Joseph looks sorry beside the missing golden plank"
  },
  {
    "id": "angry-stones",
    "place": "The Angry Stones",
    "title": "Heavy stones of anger",
    "body": "To repair the bridge, each child must move a heavy stone from the path. The stones are named blame, payback, and pride. The more Rosie thinks about getting even, the heavier her stone feels.",
    "caption": "The anger stones grow heavier when payback feels tempting.",
    "danger": "Anger whispers: “Hold on to it. He owes you.”",
    "echo": "He owes you...",
    "thought": "Let it go?",
    "prompt": "Which stone should Rosie put down?",
    "choices": [
      {
        "label": "Payback — because vengeance belongs to God, not me",
        "good": true,
        "response": "Yes. Rosie lets go of payback, and the stone becomes light enough to move."
      },
      {
        "label": "Mercy — because mercy makes people weak",
        "good": false,
        "response": "No. Mercy is not weakness. Jesus showed mercy with strength."
      },
      {
        "label": "Prayer — because angry people should not pray",
        "good": false,
        "response": "Not true. Prayer is exactly where Rosie should bring her anger."
      }
    ],
    "truth": "I do not need payback to be safe with God.",
    "verse": "Romans 12:19 — “Vengeance is mine, I will repay, says the Lord.”",
    "alt": "Rosie kneeling beside glowing stones marked by simple symbols of blame and pride while Michael points toward warm bridge light"
  },
  {
    "id": "mercy-plank",
    "place": "The Mercy Plank",
    "title": "The missing plank",
    "body": "Joseph finds the missing golden plank in the reeds. He says he is sorry. Rosie can see he really wants to make it right, but her heart still feels tight.",
    "caption": "The plank is found. Now Rosie must choose what kind of heart to carry.",
    "danger": "Anger whispers: “Do not forgive until he earns it.”",
    "echo": "Make him earn it...",
    "thought": "Remember Jesus.",
    "prompt": "What truth should Rosie remember?",
    "choices": [
      {
        "label": "Jesus forgave me first, so I can forgive others",
        "good": true,
        "response": "That is the truth light. Forgiveness flows from the mercy Jesus gives us."
      },
      {
        "label": "I only forgive when people never make mistakes again",
        "good": false,
        "response": "That is not how Jesus forgives us. Forgiveness can be real while wisdom still grows."
      },
      {
        "label": "Forgiving means the broken plank did not matter",
        "good": false,
        "response": "No. Forgiveness does not pretend hurt is fake. It gives the hurt to God."
      }
    ],
    "truth": "Jesus forgave me first.",
    "verse": "Ephesians 4:32 — “Forgiving one another, as God in Christ forgave you.”",
    "alt": "Joseph holding a golden bridge plank with a sorry face while Rosie watches with soft golden light around her hands"
  },
  {
    "id": "bridge-restored",
    "place": "The Restored Bridge",
    "title": "Crossing together",
    "body": "Rosie forgives Joseph. Joseph helps repair the bridge, and Michael tightens the final glowing rope. The bridge shines across the river, strong enough for everyone to cross together.",
    "caption": "The bridge glows again because mercy rebuilt what anger tried to break.",
    "danger": "The last whisper says: “Keep a little bitterness for later.”",
    "echo": "Keep bitterness...",
    "thought": "Walk in love.",
    "prompt": "What should the friends do now?",
    "choices": [
      {
        "label": "Cross together and keep walking in love",
        "good": true,
        "response": "Yes. Forgiveness does not end the friendship; it opens the way forward."
      },
      {
        "label": "Cross, but remind Joseph every few steps",
        "good": false,
        "response": "That keeps the old hurt in charge. Love does not keep a bitter score."
      },
      {
        "label": "Refuse to cross unless everyone praises Rosie",
        "good": false,
        "response": "That turns mercy into pride. God helps us forgive humbly."
      }
    ],
    "truth": "Forgiveness opens the way forward.",
    "verse": "Colossians 3:13 — “As the Lord has forgiven you, so you also must forgive.”",
    "alt": "Michael Rosie and Joseph crossing a restored glowing bridge over a sparkling river with warm Scripture light"
  }
] satisfies QuestScene[]

const RU = [
  { "id": "broken-bridge", "place": "Сломанный мост", "title": "Мост сломан", "body": "Мишутка и Рози подходят к яркой реке. Мост доброты треснул, потому что Йосик случайно выбил последнюю золотую доску, когда торопился вперёд. Рози обидно и больно.", "caption": "Река сверкает, но сломанная доска закрывает путь.", "danger": "Гнев шепчет: «Сначала заставь его почувствовать себя плохо.»", "echo": "Останься злой...", "thought": "Сначала милость?", "prompt": "Что Рози должна сделать сначала?", "choices": [{ "label": "Сказать правду доброжелательно и попросить Бога о помощи", "good": true, "response": "Мудрый выбор. Прощение начинается, когда мы приносим боль на свет без жестокости." }, { "label": "Кричать, пока Йосику не станет стыдно", "good": false, "response": "Так трещина станет больше. Бог зовёт Своих детей говорить истину с любовью." }, { "label": "Сделать вид, что ничего не случилось, но держать обиду", "good": false, "response": "Спрятанная горечь всё равно ранит сердце. Прощение честно и милостиво." }], "truth": "Бог помогает мне говорить истину с любовью.", "verse": "К Ефесянам 4:15 — «истинною любовью все возрастали в Того, Который есть глава Христос»", "alt": "Рози и Мишутка стоят у светящегося сломанного моста, а Йосик сожалеет рядом с недостающей золотой доской" },
  { "id": "angry-stones", "place": "Камни гнева", "title": "Тяжёлые камни гнева", "body": "Чтобы починить мост, каждому ребёнку нужно убрать тяжёлый камень с тропы. Камни называются обвинение, месть и гордость. Чем больше Рози думает о мести, тем тяжелее становится её камень.", "caption": "Камни гнева тяжелеют, когда месть кажется заманчивой.", "danger": "Гнев шепчет: «Держись за это. Он тебе должен.»", "echo": "Он должен...", "thought": "Отпустить?", "prompt": "Какой камень Рози должна положить?", "choices": [{ "label": "Месть — потому что возмездие принадлежит Богу, а не мне", "good": true, "response": "Да. Рози отпускает месть, и камень становится достаточно лёгким, чтобы его убрать." }, { "label": "Милость — потому что милость делает людей слабыми", "good": false, "response": "Нет. Милость не слабость. Иисус явил милость с силой." }, { "label": "Молитву — потому что сердитым людям нельзя молиться", "good": false, "response": "Неверно. Молитва — именно туда Рози должна принести свой гнев." }], "truth": "Мне не нужна месть, чтобы быть в безопасности с Богом.", "verse": "К Римлянам 12:19 — «Мне отмщение, Я воздам, говорит Господь.»", "alt": "Рози стоит на коленях у светящихся камней с символами обвинения и гордости, а Мишутка указывает на тёплый свет моста" },
  { "id": "mercy-plank", "place": "Доска милости", "title": "Недостающая доска", "body": "Йосик находит недостающую золотую доску в камышах. Он просит прощения. Рози видит, что он правда хочет всё исправить, но её сердцу всё ещё тесно.", "caption": "Доска найдена. Теперь Рози должна выбрать, какое сердце понесёт дальше.", "danger": "Гнев шепчет: «Не прощай, пока он не заслужит.»", "echo": "Пусть заслужит...", "thought": "Вспомни Иисуса.", "prompt": "Какую истину Рози должна вспомнить?", "choices": [{ "label": "Иисус первым простил меня, поэтому я могу прощать других", "good": true, "response": "Это свет истины. Прощение течёт из милости, которую Иисус даёт нам." }, { "label": "Я прощаю только тогда, когда люди больше никогда не ошибаются", "good": false, "response": "Иисус прощает нас не так. Прощение может быть настоящим, пока мудрость ещё растёт." }, { "label": "Простить значит, что сломанная доска не имела значения", "good": false, "response": "Нет. Прощение не притворяется, что боли не было. Оно отдаёт боль Богу." }], "truth": "Иисус первым простил меня.", "verse": "К Ефесянам 4:32 — «прощая друг друга, как и Бог во Христе простил вас.»", "alt": "Йосик держит золотую доску моста и сожалеет, а Рози смотрит на него в мягком золотом свете" },
  { "id": "bridge-restored", "place": "Восстановленный мост", "title": "Переход вместе", "body": "Рози прощает Йосика. Йосик помогает починить мост, а Мишутка крепит последнюю светящуюся верёвку. Мост сияет над рекой и теперь достаточно крепок, чтобы все перешли вместе.", "caption": "Мост снова светится, потому что милость восстановила то, что гнев хотел сломать.", "danger": "Последний шёпот говорит: «Оставь немного горечи на потом.»", "echo": "Оставь горечь...", "thought": "Ходи в любви.", "prompt": "Что друзьям делать теперь?", "choices": [{ "label": "Перейти вместе и продолжать идти в любви", "good": true, "response": "Да. Прощение не заканчивает дружбу; оно открывает путь вперёд." }, { "label": "Перейти, но напоминать Йосику каждые несколько шагов", "good": false, "response": "Так старая боль остаётся главной. Любовь не ведёт горький счёт." }, { "label": "Отказаться переходить, пока все не похвалят Рози", "good": false, "response": "Так милость превращается в гордость. Бог помогает нам прощать смиренно." }], "truth": "Прощение открывает путь вперёд.", "verse": "К Колоссянам 3:13 — «как Христос простил вас, так и вы.»", "alt": "Мишутка, Рози и Йосик переходят восстановленный светящийся мост над сверкающей рекой в тёплом свете Писания" }
] satisfies QuestScene[]

const ui = {
  "en": {
    "quest": "Forgiveness Bridge",
    "title": "Forgiveness Bridge",
    "subtitle": "Choose mercy, cross the bridge, and learn how forgiveness heals what anger breaks.",
    "start": "Begin Adventure",
    "chooseStep": "Choose the Next Step",
    "continue": "Continue",
    "tryAgain": "Try another answer",
    "truthLight": "Truth Lights",
    "completed": "Quest Complete",
    "badge": "Forgiveness Bridge Badge",
    "badgeLine": "Because Jesus forgives me, I can forgive others.",
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
    "verses": "Ephesians 4:32",
    "mission": "Repair the bridge. Answer anger with mercy. Collect four truth lights.",
    "scene": "Scene",
    "of": "of",
    "path": "Quest Path",
    "finalVerse": "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.",
    "finalVerseRef": "Ephesians 4:32",
    "finish": "Finish Quest"
  },
  "ru": {
    "quest": "Мост прощения",
    "title": "Мост прощения",
    "subtitle": "Выбери милость, перейди мост и узнай, как прощение исцеляет то, что ломает гнев.",
    "start": "Начать приключение",
    "chooseStep": "Выбрать следующий шаг",
    "continue": "Продолжить",
    "tryAgain": "Попробовать другой ответ",
    "truthLight": "Огни истины",
    "completed": "Квест завершён",
    "badge": "Значок: Мост прощения",
    "badgeLine": "Иисус простил меня, поэтому я могу прощать других.",
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
    "verses": "Ефесянам 4:32",
    "mission": "Почини мост. Ответь на гнев милостью. Собери четыре огня истины.",
    "scene": "Сцена",
    "of": "из",
    "path": "Путь квеста",
    "finalVerse": "Но будьте друг ко другу добры, сострадательны, прощайте друг друга, как и Бог во Христе простил вас.",
    "finalVerseRef": "Ефесянам 4:32",
    "finish": "Завершить квест"
  }
} satisfies Record<'en' | 'ru', QuestUi>

const questImages: Record<string, string> & { cover: string; badge: string } = {
  "cover": "/images/jr/quests/forgiveness-bridge/00-cover-forgiveness-bridge.png",
  "badge": "/images/jr/quests/forgiveness-bridge/05-badge-quest-complete.png",
  "broken-bridge": "/images/jr/quests/forgiveness-bridge/01-scene-broken-bridge.png",
  "angry-stones": "/images/jr/quests/forgiveness-bridge/02-scene-angry-stones.png",
  "mercy-plank": "/images/jr/quests/forgiveness-bridge/03-scene-mercy-plank.png",
  "bridge-restored": "/images/jr/quests/forgiveness-bridge/04-scene-bridge-restored.png"
}

export default function ForgivenessBridgePage() {
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} nextQuest={{ href: '/quests/forest-of-lies', label: { en: 'Play Next Quest: The Forest of Lies', ru: 'Следующий квест: Лес лжи' } }} />
}
