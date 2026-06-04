import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN = [
  {
    "id": "love-gate",
    "place": "The Garden Gate",
    "title": "The branch that stays close",
    "body": "Michael, Joseph, Rosie, and Gracie find a bright garden gate beside a glowing Bible vine. A branch is full of fruit because it stays connected to the vine.",
    "caption": "The fruit grows from life in the vine, not from showing off.",
    "danger": "A dry branch whispers: “Be nice only when people are nice to you.”",
    "echo": "Only if they’re nice...",
    "thought": "Stay close to Jesus.",
    "prompt": "What should the friends do first?",
    "choices": [
      {
        "label": "Ask Jesus to help them stay close and love others",
        "good": true,
        "response": "Yes. Jesus changes hearts from the inside out."
      },
      {
        "label": "Try to look spiritual so everyone claps",
        "good": false,
        "response": "That grows pride, not Spirit fruit."
      },
      {
        "label": "Walk away from the vine and grow fruit alone",
        "good": false,
        "response": "A branch cannot grow fruit by itself."
      }
    ],
    "truth": "Spirit fruit starts with life from Jesus.",
    "verse": "John 15:5 — Jesus teaches that fruit comes from abiding in Him.",
    "alt": "Children beside a glowing Bible vine at a garden gate"
  },
  {
    "id": "peace-path",
    "place": "The Peace Path",
    "title": "A calm choice when feelings are loud",
    "body": "A muddy path splits around a pond. Joseph feels frustrated after slipping, but Rosie points to a peaceful stepping stone lit by Scripture light.",
    "caption": "Peace does not mean nothing is hard; it means trusting God in the middle of it.",
    "danger": "The mud splashes: “Get angry and blame someone.”",
    "echo": "Blame them...",
    "thought": "Choose peace.",
    "prompt": "What is the Spirit-grown choice?",
    "choices": [
      {
        "label": "Pause, pray, and speak with peace",
        "good": true,
        "response": "Good line. Peace chooses trust instead of exploding."
      },
      {
        "label": "Yell because the path is muddy",
        "good": false,
        "response": "Anger may feel powerful, but it does not grow peace."
      },
      {
        "label": "Quit the quest because one step was hard",
        "good": false,
        "response": "Hard steps are chances to trust God."
      }
    ],
    "truth": "The Spirit helps me choose peace.",
    "verse": "Galatians 5:22 — peace is fruit of the Spirit.",
    "alt": "Children choosing a peaceful stepping stone on a muddy garden path"
  },
  {
    "id": "kindness-orchard",
    "place": "The Kindness Orchard",
    "title": "Fruit to share",
    "body": "Gracie sees a younger child drop a basket of fruit. The group can rush past, or stop and help gather the scattered fruit with gentle hands.",
    "caption": "Kindness notices people who need help.",
    "danger": "A shiny shortcut says: “Your mission matters more than people.”",
    "echo": "Keep moving...",
    "thought": "Show kindness.",
    "prompt": "What should the friends do?",
    "choices": [
      {
        "label": "Stop and help with kindness before moving on",
        "good": true,
        "response": "Yes. God’s fruit makes us servants, not selfish winners."
      },
      {
        "label": "Step over the fruit and hurry ahead",
        "good": false,
        "response": "Finishing fast is not faithful if we ignore someone in need."
      },
      {
        "label": "Laugh so the child learns a lesson",
        "good": false,
        "response": "Gentleness helps; mockery hurts."
      }
    ],
    "truth": "Kindness is love in action.",
    "verse": "Ephesians 4:32 — God calls His people to be kind and tenderhearted.",
    "alt": "Children helping gather fruit in a warm orchard"
  },
  {
    "id": "self-control-hill",
    "place": "Self-Control Hill",
    "title": "The last bright fruit",
    "body": "At the top of the hill, golden fruit glows near the finish. The friends are excited, but the path is narrow. Running wildly could knock everyone down.",
    "caption": "Self-control helps strong feelings follow wisdom.",
    "danger": "The hill shouts: “Grab first! Think later!”",
    "echo": "Grab it now...",
    "thought": "Slow and steady.",
    "prompt": "How should the children finish?",
    "choices": [
      {
        "label": "Move carefully, thank God, and share the fruit together",
        "good": true,
        "response": "Right. Self-control keeps joy from becoming selfishness."
      },
      {
        "label": "Push ahead so you get the first fruit",
        "good": false,
        "response": "That is too much throttle too early. The Spirit grows self-control."
      },
      {
        "label": "Hide the fruit and keep it all",
        "good": false,
        "response": "Spirit fruit is meant to bless others."
      }
    ],
    "truth": "The Spirit grows self-control and joy.",
    "verse": "Galatians 5:22–23 — joy and self-control are fruit of the Spirit.",
    "alt": "Children sharing golden fruit at the top of a hill"
  }
] satisfies QuestScene[]

const RU = [
  {
    "id": "love-gate",
    "place": "Ворота сада",
    "title": "Ветвь, которая остаётся близко",
    "body": "Мишутка, Йосик, Рози и Грейси находят светлые ворота сада рядом со светящейся библейской лозой. На ветви растёт плод, потому что она соединена с лозой.",
    "caption": "Плод растёт от жизни в лозе, а не от желания показаться хорошим.",
    "danger": "Сухая ветка шепчет: «Будь добрым только к тем, кто добр к тебе».",
    "echo": "Только если добры...",
    "thought": "Оставайся рядом с Иисусом.",
    "prompt": "Что друзьям сделать сначала?",
    "choices": [
      {
        "label": "Попросить Иисуса помочь им быть рядом с Ним и любить других",
        "good": true,
        "response": "Да. Иисус меняет сердце изнутри."
      },
      {
        "label": "Стараться выглядеть духовными, чтобы все похвалили",
        "good": false,
        "response": "Так растёт гордость, а не плод Духа."
      },
      {
        "label": "Отойти от лозы и вырастить плод самим",
        "good": false,
        "response": "Ветвь не может приносить плод сама по себе."
      }
    ],
    "truth": "Плод Духа начинается с жизни от Иисуса.",
    "verse": "Иоанна 15:5 — Иисус учит, что плод приходит, когда мы пребываем в Нём.",
    "alt": "Дети возле светящейся библейской лозы у ворот сада"
  },
  {
    "id": "peace-path",
    "place": "Тропа мира",
    "title": "Спокойный выбор, когда чувства громкие",
    "body": "Грязная тропа расходится вокруг пруда. Йосик расстроился, потому что поскользнулся, но Рози показывает на мирную ступеньку, освещённую светом Писания.",
    "caption": "Мир не значит, что всё легко; мир значит доверять Богу посреди трудности.",
    "danger": "Грязь брызгает: «Разозлись и обвини кого-нибудь».",
    "echo": "Обвини их...",
    "thought": "Выбери мир.",
    "prompt": "Какой выбор растит Дух?",
    "choices": [
      {
        "label": "Остановиться, помолиться и говорить с миром",
        "good": true,
        "response": "Хороший путь. Мир выбирает доверие вместо взрыва."
      },
      {
        "label": "Кричать, потому что тропа грязная",
        "good": false,
        "response": "Гнев может казаться сильным, но он не растит мир."
      },
      {
        "label": "Бросить квест из-за одного трудного шага",
        "good": false,
        "response": "Трудные шаги помогают учиться доверять Богу."
      }
    ],
    "truth": "Дух помогает мне выбирать мир.",
    "verse": "Галатам 5:22 — мир является плодом Духа.",
    "alt": "Дети выбирают мирную ступеньку на грязной садовой тропе"
  },
  {
    "id": "kindness-orchard",
    "place": "Сад доброты",
    "title": "Плод, которым делятся",
    "body": "Грейси видит, как младший ребёнок уронил корзину с плодами. Друзья могут пробежать мимо или остановиться и помочь собрать рассыпавшиеся плоды.",
    "caption": "Доброта замечает людей, которым нужна помощь.",
    "danger": "Блестящий короткий путь говорит: «Твоя миссия важнее людей».",
    "echo": "Иди дальше...",
    "thought": "Прояви доброту.",
    "prompt": "Что друзьям сделать?",
    "choices": [
      {
        "label": "Остановиться и с добротой помочь, а потом идти дальше",
        "good": true,
        "response": "Да. Божий плод делает нас служителями, а не эгоистичными победителями."
      },
      {
        "label": "Перешагнуть через плоды и поспешить вперёд",
        "good": false,
        "response": "Быстро закончить — не значит быть верным, если мы игнорируем нуждающегося."
      },
      {
        "label": "Посмеяться, чтобы ребёнок получил урок",
        "good": false,
        "response": "Кротость помогает; насмешка ранит."
      }
    ],
    "truth": "Доброта — это любовь в действии.",
    "verse": "Ефесянам 4:32 — Бог призывает Свой народ быть добрым и сострадательным.",
    "alt": "Дети помогают собрать плоды в тёплом саду"
  },
  {
    "id": "self-control-hill",
    "place": "Холм воздержания",
    "title": "Последний яркий плод",
    "body": "На вершине холма у финиша светится золотой плод. Друзья рады, но тропа узкая. Если бежать бездумно, можно всех сбить.",
    "caption": "Воздержание помогает сильным чувствам слушаться мудрости.",
    "danger": "Холм кричит: «Хватай первым! Думай потом!»",
    "echo": "Хватай сейчас...",
    "thought": "Спокойно и верно.",
    "prompt": "Как детям завершить путь?",
    "choices": [
      {
        "label": "Идти осторожно, благодарить Бога и разделить плод вместе",
        "good": true,
        "response": "Верно. Воздержание не даёт радости стать эгоизмом."
      },
      {
        "label": "Толкаться вперёд, чтобы первым получить плод",
        "good": false,
        "response": "Слишком много скорости слишком рано. Дух растит воздержание."
      },
      {
        "label": "Спрятать плод и оставить всё себе",
        "good": false,
        "response": "Плод Духа должен благословлять других."
      }
    ],
    "truth": "Дух растит воздержание и радость.",
    "verse": "Галатам 5:22–23 — радость и воздержание являются плодом Духа.",
    "alt": "Дети делятся золотым плодом на вершине холма"
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
    "quest": "Fruit of the Spirit Quest",
    "title": "The Garden of Spirit Fruit",
    "subtitle": "An interactive Bible adventure about walking by the Spirit instead of following selfish choices.",
    "start": "Begin Garden Quest",
    "badge": "Spirit Fruit Badge",
    "badgeLine": "The Holy Spirit grows Jesus-like character in me.",
    "questions": [
      "Which fruit of the Spirit did you practice in the garden?",
      "Why can we not grow godly character by showing off?",
      "What is one Spirit-grown choice you can make this week?",
      "How does Jesus help us change from the inside out?"
    ],
    "prayer": "Holy Spirit, grow Your fruit in me. Help me love like Jesus, choose peace, show kindness, and use self-control today. Amen.",
    "verses": "Galatians 5:22–23 · John 15:5 · Ephesians 4:32",
    "mission": "Choose Spirit-grown responses in the garden and collect four truth lights.",
    "finalVerse": "Galatians 5:22–23 — the Spirit grows His fruit in God’s people."
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
    "quest": "Квест плода Духа",
    "title": "Сад плода Духа",
    "subtitle": "Интерактивное библейское приключение о том, как ходить по Духу, а не следовать эгоистичным желаниям.",
    "start": "Начать садовый квест",
    "badge": "Значок плода Духа",
    "badgeLine": "Святой Дух растит во мне характер, похожий на Иисуса.",
    "questions": [
      "Какой плод Духа ты применил в саду?",
      "Почему мы не можем вырастить Божий характер хвастовством?",
      "Какой выбор по Духу ты можешь сделать на этой неделе?",
      "Как Иисус помогает нам меняться изнутри?"
    ],
    "prayer": "Святой Дух, расти Твой плод во мне. Помоги мне любить как Иисус, выбирать мир, проявлять доброту и иметь воздержание сегодня. Аминь.",
    "verses": "Галатам 5:22–23 · Иоанна 15:5 · Ефесянам 4:32",
    "mission": "Выбирай поступки по Духу в саду и собери четыре огня истины.",
    "finalVerse": "Галатам 5:22–23 — Дух растит Свой плод в Божьем народе."
  }
}

const questImages: Record<string, string> & { cover: string; badge: string } = {
  "cover": "/images/jr/quests/fruit-of-spirit/00-cover-fruit-of-spirit.png",
  "love-gate": "/images/jr/quests/fruit-of-spirit/01-scene-love-gate.png",
  "peace-path": "/images/jr/quests/fruit-of-spirit/02-scene-peace-path.png",
  "kindness-orchard": "/images/jr/quests/fruit-of-spirit/03-scene-kindness-orchard.png",
  "self-control-hill": "/images/jr/quests/fruit-of-spirit/04-scene-self-control-hill.png",
  "badge": "/images/jr/quests/fruit-of-spirit/05-badge-fruit-of-spirit.png"
}

export default function FruitOfSpiritPage() {
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} nextQuest={{ href: '/quests/armor-of-god', label: { en: 'Play Next Quest: Armor of God', ru: 'Следующий квест: Всеоружие Божье' } }} />
}
