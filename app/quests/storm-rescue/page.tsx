import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN = [
  {
    "id": "dark-clouds",
    "place": "The Little Harbor",
    "title": "Clouds over the harbor",
    "body": "Michael, Rosie, and Joseph are loading a small toy-brick boat when dark blue clouds roll over the water. A younger friend, Gracie, is stranded on a tiny dock across the cove.",
    "caption": "The harbor grows windy, and Gracie needs help across the water.",
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
        "label": "Ignore Gracie because storms are inconvenient",
        "good": false,
        "response": "Love does not walk away from a friend in need."
      }
    ],
    "truth": "I can pray before I panic.",
    "verse": "Philippians 4:6 — “Do not be anxious about anything...”",
    "alt": "Michael Rosie and Joseph at a small harbor preparing a toy-brick boat under gentle storm clouds while Gracie waits across the cove"
  },
  {
    "id": "rough-water",
    "place": "The Rough Water",
    "title": "Waves against the boat",
    "body": "The boat rocks as waves slap the sides. Rosie grips the rope while Joseph watches the lantern. The storm is loud, but the golden light still points toward Gracie.",
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
        "response": "That wastes energy and does not help Gracie. Anger is not a rescue plan."
      },
      {
        "label": "Turn around without telling Gracie",
        "good": false,
        "response": "That leaves a friend alone. Wisdom adjusts the plan instead of quitting."
      }
    ],
    "truth": "God helps me keep serving when it gets hard.",
    "verse": "Galatians 6:9 — “Let us not grow weary of doing good...”",
    "alt": "Joseph discovering a spare paddle in a small boat while Rosie holds a cracked oar and Michael points toward Gracie"
  },
  {
    "id": "safe-harbor",
    "place": "Safe Harbor",
    "title": "Peace after the storm",
    "body": "The children reach Gracie and help her into the boat. As they turn back, the clouds open and warm light shines on the harbor. The storm did not win.",
    "caption": "Gracie is safe, and the harbor glows with peace after the rescue.",
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
    "alt": "Michael Rosie Joseph and Gracie arriving safely at a glowing harbor as clouds part and golden Scripture light shines"
  }
] satisfies QuestScene[]

const RU = [
  { "id": "dark-clouds", "place": "Маленькая гавань", "title": "Тучи над гаванью", "body": "Мишутка, Рози и Йосик грузят маленькую лодку из игрушечных кирпичиков, когда над водой собираются тёмно-синие тучи. Их младшая подруга Грейси оказалась на маленьком причале по другую сторону бухты.", "caption": "В гавани поднимается ветер, и Грейси нужна помощь через воду.", "danger": "Ветер шепчет: «Сначала паникуй. Потом молись.»", "echo": "Сначала паника...", "thought": "Молись сейчас.", "prompt": "Что Мишутка должен сделать сначала?", "choices": [{ "label": "Помолиться, послушать и осторожно подготовить лодку", "good": true, "response": "Хорошо. Доверие Иисусу помогает Мишутке действовать мудро, а не паниковать." }, { "label": "Кричать на всех, чтобы они поторопились", "good": false, "response": "Страх быстро распространяется, когда мы кричим. Иисус даёт мир и мудрость." }, { "label": "Не обращать внимания на Грейси, потому что буря неудобна", "good": false, "response": "Любовь не уходит от друга, которому нужна помощь." }], "truth": "Я могу молиться до того, как начну паниковать.", "verse": "К Филиппийцам 4:6 — «Не заботьтесь ни о чём...»", "alt": "Мишутка, Рози и Йосик готовят маленькую лодку в гавани под мягкими грозовыми тучами, а Грейси ждёт через бухту" },
  { "id": "rough-water", "place": "Бурная вода", "title": "Волны бьют о лодку", "body": "Лодку качает, и волны хлопают по бортам. Рози держит верёвку, а Йосик следит за фонарём. Буря громкая, но золотой свет всё ещё указывает к Грейси.", "caption": "Волны шумят, но свет спасения всё ещё показывает путь.", "danger": "Буря шепчет: «Вы здесь одни.»", "echo": "Одни здесь...", "thought": "Иисус рядом.", "prompt": "Какая истина укрепит лодку?", "choices": [{ "label": "Иисус с нами, даже когда буря громкая", "good": true, "response": "Да. Лодка всё ещё качается, но сердца друзей помнят, Кто с ними." }, { "label": "Если Иисус любит нас, волны никогда не будут большими", "good": false, "response": "Друзья Иисуса тоже встречали волны. Его присутствие сильнее бури." }, { "label": "Мы в безопасности только если никогда не боимся", "good": false, "response": "Страх не значит, что Иисус ушёл. Мы можем доверять Ему, даже когда боимся." }], "truth": "Иисус рядом в буре.", "verse": "От Марка 4:39 — «Умолкни, перестань.»", "alt": "Дети плывут в маленькой светящейся лодке по добрым стилизованным волнам, а золотой свет ведёт их через дождь" },
  { "id": "broken-oar", "place": "Сломанное весло", "title": "Инструмент ломается", "body": "На середине пути весло трескается. Йосик хочет остановиться, но Рози замечает запасное весло под сиденьем. Спасение стало труднее, но не невозможно.", "caption": "Сломанное весло кажется препятствием, но Бог даёт другой способ продолжать служить.", "danger": "Ветер шепчет: «Если трудно, перестань помогать.»", "echo": "Перестань помогать...", "thought": "Продолжай служить.", "prompt": "Какой следующий шаг будет верным?", "choices": [{ "label": "Взять запасное весло и продолжать помогать вместе", "good": true, "response": "Верно. Любовь продолжает служить с мудростью, даже когда первый план ломается." }, { "label": "Бросить сломанное весло в волны", "good": false, "response": "Это тратит силы и не помогает Грейси. Гнев — не план спасения." }, { "label": "Повернуть назад и ничего не сказать Грейси", "good": false, "response": "Так друг останется один. Мудрость меняет план, а не сдаётся." }], "truth": "Бог помогает мне продолжать служить, когда трудно.", "verse": "К Галатам 6:9 — «Делая добро, да не унываем...»", "alt": "Йосик находит запасное весло в лодке, Рози держит треснувшее весло, а Мишутка указывает к Грейси" },
  { "id": "safe-harbor", "place": "Безопасная гавань", "title": "Мир после бури", "body": "Дети добираются до Грейси и помогают ей сесть в лодку. Когда они поворачивают обратно, тучи расходятся, и тёплый свет сияет над гаванью. Буря не победила.", "caption": "Грейси в безопасности, и гавань светится миром после спасения.", "danger": "Последний гром говорит: «Помни страх больше, чем спасение.»", "echo": "Помни страх...", "thought": "Помни Иисуса.", "prompt": "Что друзьям нужно помнить?", "choices": [{ "label": "Иисус был верен во время всей бури", "good": true, "response": "Да. Лучшее воспоминание — не то, какой страшной была буря, а то, как верен Иисус." }, { "label": "Они выжили, потому что им никогда не нужна была помощь", "good": false, "response": "Им нужна была помощь всю дорогу. Бог дал смелость, мудрость и друзей." }, { "label": "Больше никогда не помогать никому рядом с водой", "good": false, "response": "Мудрость учится, но страх не должен становиться главным." }], "truth": "Иисус верен от страха до мира.", "verse": "Псалом 45:2 — «Бог нам прибежище и сила...»", "alt": "Мишутка, Рози, Йосик и Грейси безопасно возвращаются в светящуюся гавань, когда тучи расходятся и сияет золотой свет Писания" }
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
    "quest": "Спасение в буре",
    "title": "Спасение в буре",
    "subtitle": "Доверься Иисусу среди ветра и волн и помоги другу добраться до безопасной гавани.",
    "start": "Начать приключение",
    "chooseStep": "Выбрать следующий шаг",
    "continue": "Продолжить",
    "tryAgain": "Попробовать другой ответ",
    "truthLight": "Огни истины",
    "completed": "Квест завершён",
    "badge": "Значок: Спасение в буре",
    "badgeLine": "Иисус со мной даже в буре.",
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
    "verses": "Марка 4:39",
    "mission": "Укрепи лодку. Помоги другу. Собери четыре огня истины.",
    "scene": "Сцена",
    "of": "из",
    "path": "Путь квеста",
    "finalVerse": "Иисус со мной даже в буре.",
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
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} nextQuest={{ href: '/quests/wise-builder', label: { en: 'Play Next Quest: Wise Builder Quest', ru: 'Следующий квест: Квест мудрого строителя' } }} />
}
