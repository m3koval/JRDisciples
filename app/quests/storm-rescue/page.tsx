import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN = [
  {
    "id": "dark-clouds",
    "place": "The Little Harbor",
    "title": "Clouds over the harbor",
    "body": "Michael, Rosie, and Joseph are loading a small toy-brick boat when dark blue clouds roll over the water. A younger friend, Nia, is stranded on a tiny dock across the cove.",
    "caption": "The harbor grows windy, and Nia needs help across the water.",
    "danger": "The wind whispers: “Panic first. Pray later.”",
    "echo": "Panic first...",
    "thought": "Pray now.",
    "prompt": "What should Michael do first?",
    "choices": [
      {
        "label": "Pray, listen, and prepare the boat carefully",
        "good": true,
        "response": "Good. Trusting Jesus helps Michael act wisely instead of panicking."
      },
      {
        "label": "Scream at everyone until they hurry",
        "good": false,
        "response": "Fear spreads fast when we shout. Jesus gives peace and wisdom."
      },
      {
        "label": "Ignore Nia because storms are inconvenient",
        "good": false,
        "response": "Love does not walk away from a friend in need."
      }
    ],
    "truth": "I can pray before I panic.",
    "verse": "Philippians 4:6 — “Do not be anxious about anything...”",
    "alt": "Michael Rosie and Joseph at a small harbor preparing a toy-brick boat under gentle storm clouds while Nia waits across the cove"
  },
  {
    "id": "rough-water",
    "place": "The Rough Water",
    "title": "Waves against the boat",
    "body": "The boat rocks as waves slap the sides. Rosie grips the rope while Joseph watches the lantern. The storm is loud, but the golden light still points toward Nia.",
    "caption": "The waves are loud, but the rescue light still points the way.",
    "danger": "The storm whispers: “You are alone out here.”",
    "echo": "Alone out here...",
    "thought": "Jesus is near.",
    "prompt": "Which truth steadies the boat?",
    "choices": [
      {
        "label": "Jesus is with us, even when the storm is loud",
        "good": true,
        "response": "Yes. The boat still rocks, but their hearts remember who is with them."
      },
      {
        "label": "If Jesus loves us, waves can never be big",
        "good": false,
        "response": "Jesus’ friends still faced waves. His presence is stronger than the storm."
      },
      {
        "label": "We are safe only if we are never afraid",
        "good": false,
        "response": "Being afraid does not mean Jesus left. We can trust Him while afraid."
      }
    ],
    "truth": "Jesus is near in the storm.",
    "verse": "Mark 4:39 — “Peace! Be still!”",
    "alt": "The children riding a small glowing boat over friendly stylized waves with golden light guiding them through rain"
  },
  {
    "id": "broken-oar",
    "place": "The Broken Oar",
    "title": "A tool breaks",
    "body": "Halfway across, an oar cracks. Joseph wants to quit, but Rosie notices a spare paddle tucked under the seat. The rescue is harder now, not impossible.",
    "caption": "The broken oar feels like a setback, but God provides another way to keep serving.",
    "danger": "The wind whispers: “If it is hard, stop helping.”",
    "echo": "Stop helping...",
    "thought": "Keep serving.",
    "prompt": "What is the faithful next step?",
    "choices": [
      {
        "label": "Use the spare paddle and keep helping together",
        "good": true,
        "response": "Right. Love keeps serving with wisdom, even when the first plan breaks."
      },
      {
        "label": "Throw the broken oar at the waves",
        "good": false,
        "response": "That wastes energy and does not help Nia. Anger is not a rescue plan."
      },
      {
        "label": "Turn around without telling Nia",
        "good": false,
        "response": "That leaves a friend alone. Wisdom adjusts the plan instead of quitting."
      }
    ],
    "truth": "God helps me keep serving when it gets hard.",
    "verse": "Galatians 6:9 — “Let us not grow weary of doing good...”",
    "alt": "Joseph discovering a spare paddle in a small boat while Rosie holds a cracked oar and Michael points toward Nia"
  },
  {
    "id": "safe-harbor",
    "place": "Safe Harbor",
    "title": "Peace after the storm",
    "body": "The children reach Nia and help her into the boat. As they turn back, the clouds open and warm light shines on the harbor. The storm did not win.",
    "caption": "Nia is safe, and the harbor glows with peace after the rescue.",
    "danger": "One last rumble says: “Remember the fear more than the rescue.”",
    "echo": "Remember fear...",
    "thought": "Remember Jesus.",
    "prompt": "What should the friends remember?",
    "choices": [
      {
        "label": "Jesus was faithful through the whole storm",
        "good": true,
        "response": "Yes. The best memory is not how scary the storm was, but how faithful Jesus is."
      },
      {
        "label": "They survived because they never needed help",
        "good": false,
        "response": "They needed help the whole way. God gave courage, wisdom, and friends."
      },
      {
        "label": "Never help anyone near water again",
        "good": false,
        "response": "Wisdom learns, but fear should not become the boss."
      }
    ],
    "truth": "Jesus is faithful from fear to peace.",
    "verse": "Psalm 46:1 — “God is our refuge and strength...”",
    "alt": "Michael Rosie Joseph and Nia arriving safely at a glowing harbor as clouds part and golden Scripture light shines"
  }
] satisfies QuestScene[]

const RU = [
  {
    "id": "dark-clouds",
    "place": "The Little Harbor",
    "title": "Clouds over the harbor",
    "body": "Michael, Rosie, and Joseph are loading a small toy-brick boat when dark blue clouds roll over the water. A younger friend, Nia, is stranded on a tiny dock across the cove.",
    "caption": "The harbor grows windy, and Nia needs help across the water.",
    "danger": "The wind whispers: “Panic first. Pray later.”",
    "echo": "Panic first...",
    "thought": "Pray now.",
    "prompt": "What should Michael do first?",
    "choices": [
      {
        "label": "Pray, listen, and prepare the boat carefully",
        "good": true,
        "response": "Good. Trusting Jesus helps Michael act wisely instead of panicking."
      },
      {
        "label": "Scream at everyone until they hurry",
        "good": false,
        "response": "Fear spreads fast when we shout. Jesus gives peace and wisdom."
      },
      {
        "label": "Ignore Nia because storms are inconvenient",
        "good": false,
        "response": "Love does not walk away from a friend in need."
      }
    ],
    "truth": "I can pray before I panic.",
    "verse": "Philippians 4:6 — “Do not be anxious about anything...”",
    "alt": "Michael Rosie and Joseph at a small harbor preparing a toy-brick boat under gentle storm clouds while Nia waits across the cove"
  },
  {
    "id": "rough-water",
    "place": "The Rough Water",
    "title": "Waves against the boat",
    "body": "The boat rocks as waves slap the sides. Rosie grips the rope while Joseph watches the lantern. The storm is loud, but the golden light still points toward Nia.",
    "caption": "The waves are loud, but the rescue light still points the way.",
    "danger": "The storm whispers: “You are alone out here.”",
    "echo": "Alone out here...",
    "thought": "Jesus is near.",
    "prompt": "Which truth steadies the boat?",
    "choices": [
      {
        "label": "Jesus is with us, even when the storm is loud",
        "good": true,
        "response": "Yes. The boat still rocks, but their hearts remember who is with them."
      },
      {
        "label": "If Jesus loves us, waves can never be big",
        "good": false,
        "response": "Jesus’ friends still faced waves. His presence is stronger than the storm."
      },
      {
        "label": "We are safe only if we are never afraid",
        "good": false,
        "response": "Being afraid does not mean Jesus left. We can trust Him while afraid."
      }
    ],
    "truth": "Jesus is near in the storm.",
    "verse": "Mark 4:39 — “Peace! Be still!”",
    "alt": "The children riding a small glowing boat over friendly stylized waves with golden light guiding them through rain"
  },
  {
    "id": "broken-oar",
    "place": "The Broken Oar",
    "title": "A tool breaks",
    "body": "Halfway across, an oar cracks. Joseph wants to quit, but Rosie notices a spare paddle tucked under the seat. The rescue is harder now, not impossible.",
    "caption": "The broken oar feels like a setback, but God provides another way to keep serving.",
    "danger": "The wind whispers: “If it is hard, stop helping.”",
    "echo": "Stop helping...",
    "thought": "Keep serving.",
    "prompt": "What is the faithful next step?",
    "choices": [
      {
        "label": "Use the spare paddle and keep helping together",
        "good": true,
        "response": "Right. Love keeps serving with wisdom, even when the first plan breaks."
      },
      {
        "label": "Throw the broken oar at the waves",
        "good": false,
        "response": "That wastes energy and does not help Nia. Anger is not a rescue plan."
      },
      {
        "label": "Turn around without telling Nia",
        "good": false,
        "response": "That leaves a friend alone. Wisdom adjusts the plan instead of quitting."
      }
    ],
    "truth": "God helps me keep serving when it gets hard.",
    "verse": "Galatians 6:9 — “Let us not grow weary of doing good...”",
    "alt": "Joseph discovering a spare paddle in a small boat while Rosie holds a cracked oar and Michael points toward Nia"
  },
  {
    "id": "safe-harbor",
    "place": "Safe Harbor",
    "title": "Peace after the storm",
    "body": "The children reach Nia and help her into the boat. As they turn back, the clouds open and warm light shines on the harbor. The storm did not win.",
    "caption": "Nia is safe, and the harbor glows with peace after the rescue.",
    "danger": "One last rumble says: “Remember the fear more than the rescue.”",
    "echo": "Remember fear...",
    "thought": "Remember Jesus.",
    "prompt": "What should the friends remember?",
    "choices": [
      {
        "label": "Jesus was faithful through the whole storm",
        "good": true,
        "response": "Yes. The best memory is not how scary the storm was, but how faithful Jesus is."
      },
      {
        "label": "They survived because they never needed help",
        "good": false,
        "response": "They needed help the whole way. God gave courage, wisdom, and friends."
      },
      {
        "label": "Never help anyone near water again",
        "good": false,
        "response": "Wisdom learns, but fear should not become the boss."
      }
    ],
    "truth": "Jesus is faithful from fear to peace.",
    "verse": "Psalm 46:1 — “God is our refuge and strength...”",
    "alt": "Michael Rosie Joseph and Nia arriving safely at a glowing harbor as clouds part and golden Scripture light shines"
  }
] satisfies QuestScene[]

const ui = {
  "en": {
    "quest": "The Storm Rescue",
    "title": "The Storm Rescue",
    "subtitle": "Trust Jesus in the wind and waves while helping a friend reach safe harbor.",
    "start": "Begin Adventure",
    "chooseStep": "Choose the Next Step",
    "continue": "Continue",
    "tryAgain": "Try another answer",
    "truthLight": "Truth Lights",
    "completed": "Quest Complete",
    "badge": "The Storm Rescue Badge",
    "badgeLine": "Jesus is with me in the storm.",
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
    "verses": "Mark 4:39",
    "mission": "Steady the boat. Help a friend. Collect four truth lights.",
    "scene": "Scene",
    "of": "of",
    "path": "Quest Path",
    "finalVerse": "Jesus is with me in the storm.",
    "finish": "Finish Quest"
  },
  "ru": {
    "quest": "The Storm Rescue",
    "title": "The Storm Rescue",
    "subtitle": "Trust Jesus in the wind and waves while helping a friend reach safe harbor.",
    "start": "Начать приключение",
    "chooseStep": "Выбрать следующий шаг",
    "continue": "Продолжить",
    "tryAgain": "Попробовать другой ответ",
    "truthLight": "Огни истины",
    "completed": "Квест завершён",
    "badge": "The Storm Rescue Badge",
    "badgeLine": "Jesus is with me in the storm.",
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
    "verses": "Mark 4:39",
    "mission": "Steady the boat. Help a friend. Collect four truth lights.",
    "scene": "Сцена",
    "of": "из",
    "path": "Путь квеста",
    "finalVerse": "Jesus is with me in the storm.",
    "finish": "Завершить квест"
  }
} satisfies Record<'en' | 'ru', QuestUi>

const questImages: Record<string, string> & { cover: string; badge: string } = {
  "cover": "/images/jr/quests/storm-rescue/00-cover-storm-rescue.png",
  "badge": "/images/jr/quests/storm-rescue/05-badge-quest-complete.png",
  "dark-clouds": "/images/jr/quests/storm-rescue/01-scene-dark-clouds.png",
  "rough-water": "/images/jr/quests/storm-rescue/02-scene-rough-water.png",
  "broken-oar": "/images/jr/quests/storm-rescue/03-scene-broken-oar.png",
  "safe-harbor": "/images/jr/quests/storm-rescue/04-scene-safe-harbor.png"
}

export default function StormRescuePage() {
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} />
}
