import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN = [
  {
    "id": "broken-bridge",
    "place": "The Broken Bridge",
    "title": "The bridge is broken",
    "body": "Mica and Liora reach a bright river. The kindness bridge is cracked because Ezra accidentally knocked loose the final golden plank while hurrying ahead. Liora feels angry and hurt.",
    "caption": "The river sparkles, but the broken plank blocks the way.",
    "danger": "Anger whispers: “Make him feel bad first.”",
    "echo": "Stay angry...",
    "thought": "Mercy first?",
    "prompt": "What should Liora do first?",
    "choices": [
      {
        "label": "Tell the truth kindly and ask God for help",
        "good": true,
        "response": "Wise choice. Forgiveness starts by bringing hurt into the light without being cruel."
      },
      {
        "label": "Shout until Ezra feels small",
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
    "verse": "Ephesians 4:15 — “Speaking the truth in love...”",
    "alt": "Liora and Mica standing by a glowing broken bridge while Ezra looks sorry beside the missing golden plank"
  },
  {
    "id": "angry-stones",
    "place": "The Angry Stones",
    "title": "Heavy stones of anger",
    "body": "To repair the bridge, each child must move a heavy stone from the path. The stones are named blame, payback, and pride. The more Liora thinks about getting even, the heavier her stone feels.",
    "caption": "The anger stones grow heavier when payback feels tempting.",
    "danger": "Anger whispers: “Hold on to it. He owes you.”",
    "echo": "He owes you...",
    "thought": "Let it go?",
    "prompt": "Which stone should Liora put down?",
    "choices": [
      {
        "label": "Payback — because vengeance belongs to God, not me",
        "good": true,
        "response": "Yes. Liora lets go of payback, and the stone becomes light enough to move."
      },
      {
        "label": "Mercy — because mercy makes people weak",
        "good": false,
        "response": "No. Mercy is not weakness. Jesus showed mercy with strength."
      },
      {
        "label": "Prayer — because angry people should not pray",
        "good": false,
        "response": "Not true. Prayer is exactly where Liora should bring her anger."
      }
    ],
    "truth": "I do not need payback to be safe with God.",
    "verse": "Romans 12:19 — “Vengeance is mine, I will repay, says the Lord.”",
    "alt": "Liora kneeling beside glowing stones marked by simple symbols of blame and pride while Mica points toward warm bridge light"
  },
  {
    "id": "mercy-plank",
    "place": "The Mercy Plank",
    "title": "The missing plank",
    "body": "Ezra finds the missing golden plank in the reeds. He says he is sorry. Liora can see he really wants to make it right, but her heart still feels tight.",
    "caption": "The plank is found. Now Liora must choose what kind of heart to carry.",
    "danger": "Anger whispers: “Do not forgive until he earns it.”",
    "echo": "Make him earn it...",
    "thought": "Remember Jesus.",
    "prompt": "What truth should Liora remember?",
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
    "alt": "Ezra holding a golden bridge plank with a sorry face while Liora watches with soft golden light around her hands"
  },
  {
    "id": "bridge-restored",
    "place": "The Restored Bridge",
    "title": "Crossing together",
    "body": "Liora forgives Ezra. Ezra helps repair the bridge, and Mica tightens the final glowing rope. The bridge shines across the river, strong enough for everyone to cross together.",
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
        "label": "Cross, but remind Ezra every few steps",
        "good": false,
        "response": "That keeps the old hurt in charge. Love does not keep a bitter score."
      },
      {
        "label": "Refuse to cross unless everyone praises Liora",
        "good": false,
        "response": "That turns mercy into pride. God helps us forgive humbly."
      }
    ],
    "truth": "Forgiveness opens the way forward.",
    "verse": "Colossians 3:13 — “Forgive each other; as the Lord has forgiven you...”",
    "alt": "Mica Liora and Ezra crossing a restored glowing bridge over a sparkling river with warm Scripture light"
  }
] satisfies QuestScene[]

const RU = [
  {
    "id": "broken-bridge",
    "place": "The Broken Bridge",
    "title": "The bridge is broken",
    "body": "Mica and Liora reach a bright river. The kindness bridge is cracked because Ezra accidentally knocked loose the final golden plank while hurrying ahead. Liora feels angry and hurt.",
    "caption": "The river sparkles, but the broken plank blocks the way.",
    "danger": "Anger whispers: “Make him feel bad first.”",
    "echo": "Stay angry...",
    "thought": "Mercy first?",
    "prompt": "What should Liora do first?",
    "choices": [
      {
        "label": "Tell the truth kindly and ask God for help",
        "good": true,
        "response": "Wise choice. Forgiveness starts by bringing hurt into the light without being cruel."
      },
      {
        "label": "Shout until Ezra feels small",
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
    "verse": "Ephesians 4:15 — “Speaking the truth in love...”",
    "alt": "Liora and Mica standing by a glowing broken bridge while Ezra looks sorry beside the missing golden plank"
  },
  {
    "id": "angry-stones",
    "place": "The Angry Stones",
    "title": "Heavy stones of anger",
    "body": "To repair the bridge, each child must move a heavy stone from the path. The stones are named blame, payback, and pride. The more Liora thinks about getting even, the heavier her stone feels.",
    "caption": "The anger stones grow heavier when payback feels tempting.",
    "danger": "Anger whispers: “Hold on to it. He owes you.”",
    "echo": "He owes you...",
    "thought": "Let it go?",
    "prompt": "Which stone should Liora put down?",
    "choices": [
      {
        "label": "Payback — because vengeance belongs to God, not me",
        "good": true,
        "response": "Yes. Liora lets go of payback, and the stone becomes light enough to move."
      },
      {
        "label": "Mercy — because mercy makes people weak",
        "good": false,
        "response": "No. Mercy is not weakness. Jesus showed mercy with strength."
      },
      {
        "label": "Prayer — because angry people should not pray",
        "good": false,
        "response": "Not true. Prayer is exactly where Liora should bring her anger."
      }
    ],
    "truth": "I do not need payback to be safe with God.",
    "verse": "Romans 12:19 — “Vengeance is mine, I will repay, says the Lord.”",
    "alt": "Liora kneeling beside glowing stones marked by simple symbols of blame and pride while Mica points toward warm bridge light"
  },
  {
    "id": "mercy-plank",
    "place": "The Mercy Plank",
    "title": "The missing plank",
    "body": "Ezra finds the missing golden plank in the reeds. He says he is sorry. Liora can see he really wants to make it right, but her heart still feels tight.",
    "caption": "The plank is found. Now Liora must choose what kind of heart to carry.",
    "danger": "Anger whispers: “Do not forgive until he earns it.”",
    "echo": "Make him earn it...",
    "thought": "Remember Jesus.",
    "prompt": "What truth should Liora remember?",
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
    "alt": "Ezra holding a golden bridge plank with a sorry face while Liora watches with soft golden light around her hands"
  },
  {
    "id": "bridge-restored",
    "place": "The Restored Bridge",
    "title": "Crossing together",
    "body": "Liora forgives Ezra. Ezra helps repair the bridge, and Mica tightens the final glowing rope. The bridge shines across the river, strong enough for everyone to cross together.",
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
        "label": "Cross, but remind Ezra every few steps",
        "good": false,
        "response": "That keeps the old hurt in charge. Love does not keep a bitter score."
      },
      {
        "label": "Refuse to cross unless everyone praises Liora",
        "good": false,
        "response": "That turns mercy into pride. God helps us forgive humbly."
      }
    ],
    "truth": "Forgiveness opens the way forward.",
    "verse": "Colossians 3:13 — “Forgive each other; as the Lord has forgiven you...”",
    "alt": "Mica Liora and Ezra crossing a restored glowing bridge over a sparkling river with warm Scripture light"
  }
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
    "finalVerse": "Because Jesus forgives me, I can forgive others.",
    "finish": "Finish Quest"
  },
  "ru": {
    "quest": "Forgiveness Bridge",
    "title": "Forgiveness Bridge",
    "subtitle": "Choose mercy, cross the bridge, and learn how forgiveness heals what anger breaks.",
    "start": "Начать приключение",
    "chooseStep": "Выбрать следующий шаг",
    "continue": "Продолжить",
    "tryAgain": "Попробовать другой ответ",
    "truthLight": "Огни истины",
    "completed": "Квест завершён",
    "badge": "Forgiveness Bridge Badge",
    "badgeLine": "Because Jesus forgives me, I can forgive others.",
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
    "verses": "Ephesians 4:32",
    "mission": "Repair the bridge. Answer anger with mercy. Collect four truth lights.",
    "scene": "Сцена",
    "of": "из",
    "path": "Путь квеста",
    "finalVerse": "Because Jesus forgives me, I can forgive others.",
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
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} />
}
