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
    "place": "The Forked Path",
    "title": "Two signs in the forest",
    "body": "Мишутка, Рози, and Йосик enter a toy-brick forest where glowing leaves float like little lanterns. Two wooden signs point opposite directions, but one sign is crooked and covered with shadowy vines.",
    "caption": "Two paths appear, but only one lines up with the truth light.",
    "danger": "A whisper says: “Any path is fine if it feels easy.”",
    "echo": "Easy path...",
    "thought": "Test it.",
    "prompt": "How should Йосик choose the path?",
    "choices": [
      {
        "label": "Compare the signs with the truth light from God’s Word",
        "good": true,
        "response": "Good. God’s Word helps Йосик test what he sees and hears."
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
    "alt": "Йосик holding a small open Bible lantern at a forked forest path with Мишутка and Рози studying two wooden signs"
  },
  {
    "id": "mirror-lake",
    "place": "Mirror Lake",
    "title": "The mirror tells a lie",
    "body": "At Mirror Lake, the water shows Йосик looking small and useless. The reflection is not telling the truth; it is twisting what God made.",
    "caption": "The reflection looks real, but God’s truth is stronger than a lying mirror.",
    "danger": "The lake whispers: “You are not important.”",
    "echo": "Not important...",
    "thought": "Made by God.",
    "prompt": "What truth should Йосик answer with?",
    "choices": [
      {
        "label": "God made me on purpose, and I belong to Him",
        "good": true,
        "response": "Yes. God’s truth names Йосик better than the lying reflection does."
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
    "alt": "Йосик standing before a glowing mirror lake while the false reflection fades under golden Bible light"
  },
  {
    "id": "vine-maze",
    "place": "The Vine Maze",
    "title": "Twisted words",
    "body": "The path squeezes into a maze of soft green vines. Some vines twist true words into almost-truths. Рози sees a vine shaped like a question mark.",
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
    "alt": "Рози using warm truth light to part twisting green vines while Мишутка and Йосик follow through the maze"
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
    "alt": "Мишутка Рози and Йосик gathered under a giant glowing truth tree as the dark forest opens into warm light"
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
    "quest": "The Forest of Lies",
    "title": "The Forest of Lies",
    "subtitle": "Follow truth lights through the trees and learn how God’s Word helps us reject lies.",
    "start": "Начать приключение",
    "chooseStep": "Выбрать следующий шаг",
    "continue": "Продолжить",
    "tryAgain": "Попробовать другой ответ",
    "truthLight": "Огни истины",
    "completed": "Квест завершён",
    "badge": "The Forest of Lies Badge",
    "badgeLine": "God’s truth helps me recognize and reject lies.",
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
    "verses": "John 8:32",
    "mission": "Follow truth lights. Test every whisper. Collect four truth lights.",
    "scene": "Сцена",
    "of": "из",
    "path": "Путь квеста",
    "finalVerse": "God’s truth helps me recognize and reject lies.",
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
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} />
}
