import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN = [
  {
    "id": "road-question",
    "place": "The Road Question",
    "title": "Who is my neighbor?",
    "body": "The friends walk a dusty road and find two arrows: “People like me” and “People God puts near me.” Rosie remembers Jesus’ story about mercy.",
    "caption": "Neighbor-love is bigger than our favorite group.",
    "danger": "A narrow sign says: “Only help your own kind.”",
    "echo": "Only mine...",
    "thought": "Love your neighbor.",
    "prompt": "Which road follows Jesus’ teaching?",
    "choices": [
      {
        "label": "Love the person God puts in front of you",
        "good": true,
        "response": "Yes. Jesus stretches neighbor-love wider than comfort."
      },
      {
        "label": "Only help people who already help you",
        "good": false,
        "response": "That is trade, not mercy."
      },
      {
        "label": "Avoid people who are different",
        "good": false,
        "response": "Jesus calls us toward mercy, not pride."
      }
    ],
    "truth": "My neighbor is the person God calls me to love.",
    "verse": "Luke 10:25–37 — Jesus answers the neighbor question with mercy.",
    "alt": "Children choosing the mercy road"
  },
  {
    "id": "hurting-traveler",
    "place": "The Ditch",
    "title": "Someone needs help",
    "body": "A traveler sits hurt beside the road. The group hears busy footsteps passing by on the other side. Gracie stops and points to the first-aid pack.",
    "caption": "Mercy sees the person, not the inconvenience.",
    "danger": "The road says: “You are too busy to care.”",
    "echo": "Too busy...",
    "thought": "Stop with mercy.",
    "prompt": "What should the friends do?",
    "choices": [
      {
        "label": "Stop, make the road safe, and help the traveler",
        "good": true,
        "response": "Right. Mercy slows down to love wisely."
      },
      {
        "label": "Pretend they did not see anything",
        "good": false,
        "response": "Looking away does not make love grow."
      },
      {
        "label": "Tell someone else to care and keep walking",
        "good": false,
        "response": "Walking away with no care is not mercy."
      }
    ],
    "truth": "Mercy notices and helps.",
    "verse": "Luke 10:33 — the Samaritan saw the man and had compassion.",
    "alt": "Children helping a traveler beside a road"
  },
  {
    "id": "oil-bandage",
    "place": "The Mercy Kit",
    "title": "Costly kindness",
    "body": "Michael opens the mercy kit. Bandages, oil, water, and time will cost the group part of their journey, but the traveler needs care.",
    "caption": "Love becomes practical help.",
    "danger": "A coin pouch says: “Keep everything for yourself.”",
    "echo": "Keep it all...",
    "thought": "Give help.",
    "prompt": "How should they use what they have?",
    "choices": [
      {
        "label": "Share supplies and care for the hurting traveler",
        "good": true,
        "response": "Yes. Mercy is love with hands and feet."
      },
      {
        "label": "Save every supply in case they want it later",
        "good": false,
        "response": "Wisdom plans, but selfishness refuses love."
      },
      {
        "label": "Take a picture and leave",
        "good": false,
        "response": "Attention is not the same as compassion."
      }
    ],
    "truth": "Love gives practical mercy.",
    "verse": "Luke 10:34 — the Samaritan cared for the man’s wounds.",
    "alt": "Children sharing supplies from a mercy kit"
  },
  {
    "id": "inn-care",
    "place": "The Safe Inn",
    "title": "Finish the mercy path",
    "body": "The friends help the traveler reach a warm inn. The easy thing would be to leave quickly, but mercy follows through.",
    "caption": "Faithful love does not quit halfway.",
    "danger": "The door whispers: “You did enough. Forget him now.”",
    "echo": "Forget him...",
    "thought": "Follow through.",
    "prompt": "What is the faithful finish?",
    "choices": [
      {
        "label": "Make sure the traveler is cared for and safe",
        "good": true,
        "response": "Good. Neighbor-love follows through."
      },
      {
        "label": "Leave before anyone asks for more help",
        "good": false,
        "response": "Mercy does not run from follow-through."
      },
      {
        "label": "Brag loudly about being helpful",
        "good": false,
        "response": "Mercy serves humbly."
      }
    ],
    "truth": "Jesus calls me to go and do mercy.",
    "verse": "Luke 10:37 — Jesus says to go and do likewise.",
    "alt": "Children at a warm safe inn"
  }
] satisfies QuestScene[]

const RU = [
  {
    "id": "road-question",
    "place": "Вопрос на дороге",
    "title": "Кто мой ближний?",
    "body": "Друзья идут по пыльной дороге и видят две стрелки: «люди как я» и «люди, которых Бог поставил рядом». Рози вспоминает историю Иисуса о милости.",
    "caption": "Любовь к ближнему шире любимой группы.",
    "danger": "Узкая табличка говорит: «Помогай только своим».",
    "echo": "Только своим...",
    "thought": "Люби ближнего.",
    "prompt": "Какая дорога следует учению Иисуса?",
    "choices": [
      {
        "label": "Любить человека, которого Бог поставил рядом",
        "good": true,
        "response": "Да. Иисус расширяет любовь к ближнему за пределы удобства."
      },
      {
        "label": "Помогать только тем, кто уже помог тебе",
        "good": false,
        "response": "Это обмен, а не милость."
      },
      {
        "label": "Избегать людей, которые отличаются",
        "good": false,
        "response": "Иисус зовёт нас к милости, а не к гордости."
      }
    ],
    "truth": "Мой ближний — тот, кого Бог зовёт меня любить.",
    "verse": "Луки 10:25–37 — Иисус отвечает на вопрос о ближнем историей милости.",
    "alt": "Дети выбирают дорогу милости"
  },
  {
    "id": "hurting-traveler",
    "place": "Ров у дороги",
    "title": "Кому-то нужна помощь",
    "body": "Путник сидит у дороги и нуждается в помощи. Друзья слышат, как занятые шаги проходят по другой стороне. Грейси останавливается и показывает на сумку помощи.",
    "caption": "Милость видит человека, а не неудобство.",
    "danger": "Дорога говорит: «Ты слишком занят, чтобы заботиться».",
    "echo": "Слишком занят...",
    "thought": "Остановись с милостью.",
    "prompt": "Что друзьям сделать?",
    "choices": [
      {
        "label": "Остановиться, сделать место безопасным и помочь путнику",
        "good": true,
        "response": "Верно. Милость замедляется, чтобы любить мудро."
      },
      {
        "label": "Сделать вид, что ничего не видели",
        "good": false,
        "response": "Отвести взгляд — не значит расти в любви."
      },
      {
        "label": "Сказать, что пусть поможет кто-то другой, и уйти",
        "good": false,
        "response": "Уйти без заботы — не милость."
      }
    ],
    "truth": "Милость замечает и помогает.",
    "verse": "Луки 10:33 — самарянин увидел человека и сжалился.",
    "alt": "Дети помогают путнику у дороги"
  },
  {
    "id": "oil-bandage",
    "place": "Сумка милости",
    "title": "Доброта, которая стоит времени",
    "body": "Мишутка открывает сумку милости. Бинты, масло, вода и время будут стоить друзьям части пути, но путнику нужна забота.",
    "caption": "Любовь становится практической помощью.",
    "danger": "Кошелёк говорит: «Оставь всё себе».",
    "echo": "Оставь себе...",
    "thought": "Помоги.",
    "prompt": "Как использовать то, что есть?",
    "choices": [
      {
        "label": "Поделиться припасами и позаботиться о путнике",
        "good": true,
        "response": "Да. Милость — это любовь с руками и ногами."
      },
      {
        "label": "Сохранить все припасы для себя",
        "good": false,
        "response": "Мудрость планирует, но эгоизм отказывается любить."
      },
      {
        "label": "Сделать фото и уйти",
        "good": false,
        "response": "Внимание к себе — не то же самое, что сострадание."
      }
    ],
    "truth": "Любовь даёт практическую милость.",
    "verse": "Луки 10:34 — самарянин позаботился о ранах человека.",
    "alt": "Дети делятся припасами из сумки милости"
  },
  {
    "id": "inn-care",
    "place": "Безопасный дом",
    "title": "Дойти до конца милости",
    "body": "Друзья помогают путнику добраться до тёплого дома. Легко было бы быстро уйти, но милость доводит заботу до конца.",
    "caption": "Верная любовь не бросает на полпути.",
    "danger": "Дверь шепчет: «Ты сделал достаточно. Забудь о нём».",
    "echo": "Забудь...",
    "thought": "Доведи до конца.",
    "prompt": "Как верно завершить?",
    "choices": [
      {
        "label": "Убедиться, что путник в безопасности и о нём заботятся",
        "good": true,
        "response": "Хорошо. Любовь к ближнему доводит помощь до конца."
      },
      {
        "label": "Уйти, пока никто не попросил большего",
        "good": false,
        "response": "Милость не убегает от продолжения заботы."
      },
      {
        "label": "Громко хвастаться своей помощью",
        "good": false,
        "response": "Милость служит смиренно."
      }
    ],
    "truth": "Иисус зовёт меня идти и поступать с милостью.",
    "verse": "Луки 10:37 — Иисус говорит идти и поступать так же.",
    "alt": "Дети у тёплого безопасного дома"
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
    "quest": "Good Samaritan Quest",
    "title": "Mercy Road",
    "subtitle": "An interactive Bible adventure about loving your neighbor with costly kindness.",
    "start": "Begin Mercy Quest",
    "badge": "Mercy Neighbor Badge",
    "badgeLine": "Jesus teaches me to love my neighbor with mercy.",
    "questions": [
      "Who was a neighbor in Jesus’ story?",
      "What excuses do people make when mercy costs time?",
      "How did the Samaritan show love with action?",
      "Who can you show mercy to this week?"
    ],
    "prayer": "Lord Jesus, give me eyes to see people who need mercy. Help me love my neighbor with action, kindness, and courage. Amen.",
    "verses": "Luke 10:25–37 · Micah 6:8 · Ephesians 4:32",
    "mission": "Walk Mercy Road and choose compassion instead of excuses.",
    "finalVerse": "Luke 10:25–37 — Jesus teaches what neighbor-love looks like."
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
    "quest": "Квест доброго самарянина",
    "title": "Дорога милости",
    "subtitle": "Интерактивное библейское приключение о любви к ближнему через добрые поступки.",
    "start": "Начать квест милости",
    "badge": "Значок милосердного ближнего",
    "badgeLine": "Иисус учит меня любить ближнего с милостью.",
    "questions": [
      "Кто был ближним в истории Иисуса?",
      "Какие оправдания люди придумывают, когда милость требует времени?",
      "Как самарянин показал любовь делом?",
      "Кому ты можешь проявить милость на этой неделе?"
    ],
    "prayer": "Господь Иисус, дай мне видеть людей, которым нужна милость. Помоги мне любить ближнего делом, добротой и смелостью. Аминь.",
    "verses": "Луки 10:25–37 · Михей 6:8 · Ефесянам 4:32",
    "mission": "Иди по Дороге милости и выбирай сострадание вместо оправданий.",
    "finalVerse": "Луки 10:25–37 — Иисус учит, как выглядит любовь к ближнему."
  }
}

const questImages: Record<string, string> & { cover: string; badge: string } = {
  "cover": "/images/jr/quests/good-samaritan/00-cover-good-samaritan.svg",
  "road-question": "/images/jr/quests/good-samaritan/01-scene-road-question.svg",
  "hurting-traveler": "/images/jr/quests/good-samaritan/02-scene-hurting-traveler.svg",
  "oil-bandage": "/images/jr/quests/good-samaritan/03-scene-oil-bandage.svg",
  "inn-care": "/images/jr/quests/good-samaritan/04-scene-inn-care.svg",
  "badge": "/images/jr/quests/good-samaritan/05-badge-good-samaritan.svg"
}

export default function GoodSamaritanPage() {
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} nextQuest={{ href: '/quests/lost-sheep', label: { en: 'Play Next Quest: Lost Sheep', ru: 'Следующий квест: Потерянная овечка' } }} />
}
