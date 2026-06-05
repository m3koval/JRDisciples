import { QuestAdventure, type QuestScene, type QuestUi } from '../components/QuestAdventure'

const EN = [
  {
    "id": "counting-sheep",
    "place": "The Sheepfold",
    "title": "One is missing",
    "body": "The friends help count sheep near a warm sheepfold. Ninety-nine are safe, but one little lamb is missing beyond the hills.",
    "caption": "Love notices the one who is missing.",
    "danger": "A sleepy gate says: “Ninety-nine is enough.”",
    "echo": "Enough...",
    "thought": "Search with love.",
    "prompt": "What should the shepherd do?",
    "choices": [
      {
        "label": "Go search for the one lost sheep",
        "good": true,
        "response": "Yes. The shepherd cares for the missing one."
      },
      {
        "label": "Forget the lost sheep because there are many others",
        "good": false,
        "response": "Jesus shows a shepherd who seeks the lost."
      },
      {
        "label": "Blame the sheep and do nothing",
        "good": false,
        "response": "Sin is serious, but the shepherd’s heart moves toward rescue."
      }
    ],
    "truth": "Jesus cares about the lost.",
    "verse": "Luke 15:4 — “go after the one that is lost, until he finds it”",
    "alt": "Children counting sheep near a warm sheepfold"
  },
  {
    "id": "hill-trail",
    "place": "The Hill Trail",
    "title": "Follow the shepherd’s light",
    "body": "The trail climbs past rocks and thorns. Joseph hears the lamb faintly, but the shortcut path looks easier and leads away from the sound.",
    "caption": "Rescue love keeps going on the right path.",
    "danger": "The shortcut says: “Easy is always best.”",
    "echo": "Easy way...",
    "thought": "Keep searching.",
    "prompt": "Which path should the friends take?",
    "choices": [
      {
        "label": "Follow the shepherd’s light toward the lost lamb",
        "good": true,
        "response": "Good. Faithful love does not quit when the path is hard."
      },
      {
        "label": "Take the easy path away from the lamb",
        "good": false,
        "response": "Easy is not always faithful."
      },
      {
        "label": "Wait for the lamb to rescue itself",
        "good": false,
        "response": "The lost need rescue, not neglect."
      }
    ],
    "truth": "The shepherd keeps seeking.",
    "verse": "Ezekiel 34:16 — “I will seek the lost, and I will bring back the strayed”",
    "alt": "Children following shepherd light over hills"
  },
  {
    "id": "lamb-found",
    "place": "The Thorn Bush",
    "title": "Found and carried",
    "body": "Gracie spots the lamb caught near thorny branches. The lamb is tired and scared. The shepherd gently lifts it onto his shoulders.",
    "caption": "The shepherd rescues with strength and tenderness.",
    "danger": "The thorn bush whispers: “Hide in shame.”",
    "echo": "Hide...",
    "thought": "Come home.",
    "prompt": "What is the rescue response?",
    "choices": [
      {
        "label": "Let the shepherd lift the lamb and carry it home",
        "good": true,
        "response": "Yes. Jesus is strong and gentle with repentant sinners."
      },
      {
        "label": "Tell the lamb to earn its way back alone",
        "good": false,
        "response": "The story shows rescue, not self-saving."
      },
      {
        "label": "Leave the lamb in the thorns to learn a lesson",
        "good": false,
        "response": "Jesus seeks and saves; He does not delight in lostness."
      }
    ],
    "truth": "Jesus carries the rescued home.",
    "verse": "Luke 15:5 — “he lays it on his shoulders, rejoicing.”",
    "alt": "A lamb rescued from thorny branches"
  },
  {
    "id": "joy-home",
    "place": "The Joyful Home",
    "title": "Rejoice over rescue",
    "body": "Back at the sheepfold, the shepherd calls everyone to rejoice. The friends can join the celebration or grumble that the lost sheep got attention.",
    "caption": "Grace celebrates rescue instead of acting proud.",
    "danger": "A grumble cloud says: “Why celebrate that sheep?”",
    "echo": "Grumble...",
    "thought": "Rejoice.",
    "prompt": "How should the friends finish?",
    "choices": [
      {
        "label": "Rejoice because the lost sheep is home",
        "good": true,
        "response": "Right. Heaven rejoices when sinners repent."
      },
      {
        "label": "Complain that the lamb got carried",
        "good": false,
        "response": "Grace teaches us to rejoice over rescue."
      },
      {
        "label": "Act better than the sheep",
        "good": false,
        "response": "Pride misses the joy of mercy."
      }
    ],
    "truth": "Jesus rejoices to save the lost.",
    "verse": "Luke 15:7 — “there will be more joy in heaven over one sinner who repents”",
    "alt": "Children rejoicing as a lamb comes home"
  }
] satisfies QuestScene[]

const RU = [
  {
    "id": "counting-sheep",
    "place": "Овечий двор",
    "title": "Одна пропала",
    "body": "Друзья помогают считать овец возле тёплого двора. Девяносто девять в безопасности, но один маленький ягнёнок потерялся за холмами.",
    "caption": "Любовь замечает того, кто пропал.",
    "danger": "Сонные ворота говорят: «Девяносто девять достаточно».",
    "echo": "Достаточно...",
    "thought": "Ищи с любовью.",
    "prompt": "Что пастырю сделать?",
    "choices": [
      {
        "label": "Пойти искать одну потерянную овцу",
        "good": true,
        "response": "Да. Пастырь заботится о той, которая пропала."
      },
      {
        "label": "Забыть потерянную овцу, потому что других много",
        "good": false,
        "response": "Иисус показывает пастыря, который ищет потерянное."
      },
      {
        "label": "Обвинить овцу и ничего не делать",
        "good": false,
        "response": "Грех серьёзен, но сердце пастыря идёт к спасению."
      }
    ],
    "truth": "Иисус заботится о потерянных.",
    "verse": "Луки 15:4 — «не оставит девяноста девяти в пустыне и не пойдет за пропавшею, пока не найдет ее?»",
    "alt": "Дети считают овец возле тёплого двора"
  },
  {
    "id": "hill-trail",
    "place": "Холмистая тропа",
    "title": "Следуй за светом пастыря",
    "body": "Тропа поднимается мимо камней и колючек. Йосик слышит слабый голос ягнёнка, но лёгкая короткая дорожка ведёт в другую сторону.",
    "caption": "Спасающая любовь продолжает идти правильным путём.",
    "danger": "Короткая дорожка говорит: «Лёгкое всегда лучше».",
    "echo": "Лёгкий путь...",
    "thought": "Продолжай искать.",
    "prompt": "Куда идти друзьям?",
    "choices": [
      {
        "label": "Следовать свету пастыря к потерянному ягнёнку",
        "good": true,
        "response": "Хорошо. Верная любовь не сдаётся, когда путь трудный."
      },
      {
        "label": "Выбрать лёгкий путь прочь от ягнёнка",
        "good": false,
        "response": "Легко не всегда верно."
      },
      {
        "label": "Ждать, что ягнёнок сам себя спасёт",
        "good": false,
        "response": "Потерянным нужно спасение, а не равнодушие."
      }
    ],
    "truth": "Пастырь продолжает искать.",
    "verse": "Иезекииль 34:16 — «Потерявшуюся отыщу и угнанную возвращу»",
    "alt": "Дети идут за светом пастыря по холмам"
  },
  {
    "id": "lamb-found",
    "place": "Колючий куст",
    "title": "Найден и несом",
    "body": "Грейси замечает ягнёнка рядом с колючими ветками. Ягнёнок устал и боится. Пастырь мягко поднимает его на плечи.",
    "caption": "Пастырь спасает сильно и нежно.",
    "danger": "Куст шепчет: «Прячься от стыда».",
    "echo": "Прячься...",
    "thought": "Иди домой.",
    "prompt": "Как принять спасение?",
    "choices": [
      {
        "label": "Позволить пастырю поднять ягнёнка и нести домой",
        "good": true,
        "response": "Да. Иисус силён и нежен с кающимися грешниками."
      },
      {
        "label": "Сказать ягнёнку самому заработать путь домой",
        "good": false,
        "response": "История показывает спасение, а не самоспасение."
      },
      {
        "label": "Оставить ягнёнка в колючках для урока",
        "good": false,
        "response": "Иисус ищет и спасает; Он не радуется потерянности."
      }
    ],
    "truth": "Иисус несёт спасённого домой.",
    "verse": "Луки 15:5 — «а найдя, возьмет ее на плечи свои с радостью»",
    "alt": "Ягнёнок спасён из колючих веток"
  },
  {
    "id": "joy-home",
    "place": "Радость дома",
    "title": "Радуйтесь спасению",
    "body": "Вернувшись во двор, пастырь зовёт всех радоваться. Друзья могут праздновать или ворчать, что потерянной овце уделили внимание.",
    "caption": "Благодать радуется спасению вместо гордости.",
    "danger": "Тучка ворчания говорит: «Зачем праздновать из-за этой овцы?»",
    "echo": "Ворчи...",
    "thought": "Радуйся.",
    "prompt": "Как друзьям закончить?",
    "choices": [
      {
        "label": "Радоваться, что потерянная овца дома",
        "good": true,
        "response": "Верно. Небо радуется, когда грешники каются."
      },
      {
        "label": "Жаловаться, что ягнёнка несли",
        "good": false,
        "response": "Благодать учит радоваться спасению."
      },
      {
        "label": "Считать себя лучше овцы",
        "good": false,
        "response": "Гордость пропускает радость милости."
      }
    ],
    "truth": "Иисус радуется, спасая потерянных.",
    "verse": "Луки 15:7 — «на небесах более радости будет об одном грешнике кающемся»",
    "alt": "Дети радуются возвращению ягнёнка домой"
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
    "quest": "Lost Sheep Quest",
    "title": "The Shepherd’s Search",
    "subtitle": "An interactive Bible adventure about Jesus seeking and saving the lost.",
    "start": "Begin Search Quest",
    "badge": "Found by the Shepherd Badge",
    "badgeLine": "Jesus seeks the lost and rejoices to bring them home.",
    "questions": [
      "Why did the shepherd search for one lost sheep?",
      "How does Jesus treat sinners who repent?",
      "What is the difference between wandering and coming home?",
      "How can we welcome someone with joy instead of pride?"
    ],
    "prayer": "Lord Jesus, thank You for seeking and saving the lost. Help me repent, trust You, and rejoice when others come home to You. Amen.",
    "verses": "Luke 15:3–7 · Ezekiel 34:16 · John 10:11",
    "mission": "Follow the shepherd’s light, find the lamb, and rejoice over rescue.",
    "finalVerse": "Rejoice with me, for I have found my sheep that was lost.",
    "finalVerseRef": "Luke 15:6"
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
    "quest": "Квест потерянной овечки",
    "title": "Поиск пастыря",
    "subtitle": "Интерактивное библейское приключение о том, что Иисус ищет и спасает погибшее.",
    "start": "Начать поиск",
    "badge": "Значок найденного пастырем",
    "badgeLine": "Иисус ищет погибших и радуется, возвращая их домой.",
    "questions": [
      "Почему пастырь искал одну потерянную овцу?",
      "Как Иисус относится к грешникам, которые каются?",
      "Чем отличается блуждание от возвращения домой?",
      "Как радоваться возвращению другого человека без гордости?"
    ],
    "prayer": "Господь Иисус, спасибо, что Ты ищешь и спасаешь погибших. Помоги мне каяться, доверять Тебе и радоваться, когда другие возвращаются к Тебе. Аминь.",
    "verses": "Луки 15:3–7 · Иезекииль 34:16 · Иоанна 10:11",
    "mission": "Иди за светом пастыря, найди ягнёнка и радуйся спасению.",
    "finalVerse": "Порадуйтесь со мною: я нашел мою пропавшую овцу.",
    "finalVerseRef": "Луки 15:6"
  }
}

const questImages: Record<string, string> & { cover: string; badge: string } = {
  "cover": "/images/jr/quests/lost-sheep/00-cover-lost-sheep.png",
  "counting-sheep": "/images/jr/quests/lost-sheep/01-scene-counting-sheep.png",
  "hill-trail": "/images/jr/quests/lost-sheep/02-scene-hill-trail.png",
  "lamb-found": "/images/jr/quests/lost-sheep/03-scene-lamb-found.png",
  "joy-home": "/images/jr/quests/lost-sheep/04-scene-joy-home.png",
  "badge": "/images/jr/quests/lost-sheep/05-badge-lost-sheep.png"
}

export default function LostSheepPage() {
  return <QuestAdventure scenesByLanguage={{ en: EN, ru: RU }} uiByLanguage={ui} images={questImages} nextQuest={{ href: '/quests/courage-quest', label: { en: 'Play Next Quest: Courage Quest', ru: 'Следующий квест: Квест мужества' } }} />
}
