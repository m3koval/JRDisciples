export type JourneyStepKind = 'story' | 'lesson' | 'scripture' | 'practice' | 'check' | 'quest' | 'game'

export type JourneyStep = {
  id: string
  kind: JourneyStepKind
  href: string
  title: { en: string; ru: string }
  required?: boolean
}

export type JourneyUnit = {
  id: string
  image: string
  title: { en: string; ru: string }
  truth: { en: string; ru: string }
  badge: { en: string; ru: string }
  steps: JourneyStep[]
}

const step = (id: string, kind: JourneyStepKind, href: string, en: string, ru: string, required = true): JourneyStep => ({
  id, kind, href, title: { en, ru }, required,
})

export const journeyUnits: JourneyUnit[] = [
  {
    id: 'made-by-god', image: '/images/jr/story-creation.png',
    title: { en: 'God Made Me and His World', ru: 'Бог создал меня и Свой мир' },
    truth: { en: 'God made everything, and every person bears His image.', ru: 'Бог создал всё, и каждый человек носит Его образ.' },
    badge: { en: 'Image Bearer', ru: 'Носитель Божьего образа' },
    steps: [
      step('creation-story', 'story', '/stories/creation', 'God Makes Everything', 'Бог создаёт всё'),
      step('creation-check', 'check', '/quiz/quiz-creation', 'Creation Truth Check', 'Проверка истории сотворения'),
      step('creation-practice', 'practice', '/puzzles/creation-week', 'Creation Week Search', 'Поиск «Неделя сотворения»'),
      step('whose-mark', 'lesson', '/lessons/whose-mark', 'Whose Mark?', 'Чей образ?'),
    ],
  },
  {
    id: 'trust-and-obey', image: '/images/jr/story-noah.png',
    title: { en: 'Trust God and Obey', ru: 'Доверяй Богу и слушайся' },
    truth: { en: 'God keeps His promises, and wise disciples trust and obey Him.', ru: 'Бог хранит обещания, а мудрые ученики доверяют Ему и слушаются.' },
    badge: { en: 'Trust and Obey', ru: 'Доверие и послушание' },
    steps: [
      step('noah-story', 'story', '/stories/noah', 'Noah and the Great Flood', 'Ной и великий потоп'),
      step('noah-check', 'check', '/quiz/quiz-noah', 'Noah Truth Check', 'Проверка истории Ноя'),
      step('covenant-practice', 'practice', '/rebus/rebus-covenant', 'Covenant Rebus', 'Ребус «Завет»'),
      step('trust-scripture', 'scripture', '/memory/proverbs-3-5-6', 'Trust with All Your Heart', 'Надейся всем сердцем'),
      step('wise-builder', 'quest', '/quests/wise-builder', 'Wise Builder Quest', 'Квест мудрого строителя'),
    ],
  },
  {
    id: 'faithful-in-hard-things', image: '/images/jr/story-joseph.png',
    title: { en: 'God Is Faithful in Hard Things', ru: 'Бог верен в трудностях' },
    truth: { en: 'God remains present and can use repentance and forgiveness for good.', ru: 'Бог остаётся рядом и обращает покаяние и прощение во благо.' },
    badge: { en: 'Faithful Through Hard Things', ru: 'Верность в трудностях' },
    steps: [
      step('joseph-story', 'story', '/stories/joseph', 'Joseph and His Brothers', 'Иосиф и его братья'),
      step('shaped-by-god', 'lesson', '/lessons/gods-cutting', 'Shaped by God', 'Божья огранка'),
      step('joseph-check', 'check', '/quiz/quiz-joseph', 'Joseph Truth Check', 'Проверка истории Иосифа'),
      step('forgiveness-bridge', 'quest', '/quests/forgiveness-bridge', 'Forgiveness Bridge', 'Мост прощения'),
    ],
  },
  {
    id: 'courage-from-god', image: '/images/jr/story-david.png',
    title: { en: 'Courage Comes from God', ru: 'Мужество приходит от Бога' },
    truth: { en: 'Courage trusts God rather than our own size or strength.', ru: 'Мужество полагается на Бога, а не на наш рост или силу.' },
    badge: { en: 'Courageous Faith', ru: 'Мужественная вера' },
    steps: [
      step('david-story', 'story', '/stories/david-goliath', 'David and Goliath', 'Давид и Голиаф'),
      step('david-check', 'check', '/quiz/quiz-david-goliath', 'David Truth Check', 'Проверка истории Давида'),
      step('strength-scripture', 'scripture', '/memory/philippians-4-13', 'Strength through Christ', 'Сила через Христа'),
      step('heroes-practice', 'practice', '/puzzles/bible-heroes', 'Heroes of Faith Search', 'Поиск героев веры'),
      step('david-sling', 'game', '/games/david-sling-challenge', 'David Sling Challenge', 'Испытание пращи Давида', false),
      step('faith-over-giants', 'game', '/games/faith-over-giants', 'Faith Over Giants', 'Вера сильнее великанов', false),
    ],
  },
  {
    id: 'seeks-the-lost', image: '/images/jr/story-jonah.png',
    title: { en: 'God Seeks the Lost', ru: 'Бог ищет потерянных' },
    truth: { en: 'God shows mercy to sinners and teaches us to notice and love others.', ru: 'Бог милует грешников и учит нас замечать и любить других.' },
    badge: { en: 'Mercy for the One', ru: 'Милость к одному' },
    steps: [
      step('jonah-story', 'story', '/stories/jonah', 'Jonah and the Big Fish', 'Иона и большая рыба'),
      step('jonah-lesson', 'lesson', '/lessons/jonah-big-fish', 'Jonah: Mercy and Obedience', 'Иона: милость и послушание'),
      step('jonah-check', 'check', '/quiz/quiz-jonah', 'Jonah Truth Check', 'Проверка истории Ионы'),
      step('shepherd-scripture', 'scripture', '/memory/psalm-23-1', 'The LORD Is My Shepherd', 'Господь — Пастырь мой'),
      step('lost-sheep', 'quest', '/quests/lost-sheep', 'Lost Sheep Quest', 'Квест потерянной овечки'),
      step('good-samaritan', 'quest', '/quests/good-samaritan', 'Good Samaritan Mission', 'Миссия доброго самарянина'),
    ],
  },
  {
    id: 'meet-jesus', image: '/images/jr/story-birth-of-jesus.png',
    title: { en: 'Meet Jesus', ru: 'Познакомься с Иисусом' },
    truth: { en: 'Jesus is the promised Son of God and Savior.', ru: 'Иисус — обещанный Сын Божий и Спаситель.' },
    badge: { en: 'Meet Jesus', ru: 'Знакомство с Иисусом' },
    steps: [
      step('birth-story', 'story', '/stories/birth-of-jesus', 'The Birth of Jesus', 'Рождение Иисуса'),
      step('birth-check', 'check', '/quiz/quiz-birth-of-jesus', 'Birth of Jesus Truth Check', 'Проверка истории Рождества'),
      step('christmas-practice', 'practice', '/puzzles/christmas-story', 'Christmas Story Search', 'Поиск слов Рождества'),
      step('who-is-jesus', 'lesson', '/lessons/who-is-jesus', 'Who Is Jesus?', 'Кто такой Иисус?'),
      step('gods-son', 'lesson', '/lessons/case-for-christ-gods-son', 'Is Jesus Really God’s Son?', 'Иисус действительно Божий Сын?'),
      step('john-3-16', 'scripture', '/memory/john-3-16', 'God So Loved the World', 'Так возлюбил Бог мир'),
      step('jesus-is-practice', 'practice', '/puzzles/jesus-is', 'Names of Jesus Search', 'Поиск имён Иисуса'),
    ],
  },
  {
    id: 'the-gospel', image: '/images/jr/topic-case-for-christ-resurrection.png',
    title: { en: 'The Gospel', ru: 'Евангелие' },
    truth: { en: 'Jesus willingly died and rose; salvation is God’s gift received through faith.', ru: 'Иисус добровольно умер и воскрес; спасение — Божий дар, принимаемый верой.' },
    badge: { en: 'Gospel Truth', ru: 'Истина Евангелия' },
    steps: [
      step('sin-scripture', 'scripture', '/memory/romans-3-23', 'All Have Sinned', 'Все согрешили'),
      step('gift-scripture', 'scripture', '/memory/romans-6-23', 'God’s Free Gift', 'Божий дар'),
      step('cross-lesson', 'lesson', '/lessons/case-for-christ-cross', 'Why Did Jesus Have to Die?', 'Почему Иисусу нужно было умереть?'),
      step('resurrection-lesson', 'lesson', '/lessons/case-for-christ-resurrection', 'Did Jesus Really Rise?', 'Иисус действительно воскрес?'),
      step('grace-lesson', 'lesson', '/lessons/grace-in-the-kingdom', 'Grace in the Kingdom', 'Благодать в Царстве'),
      step('grace-scripture', 'scripture', '/memory/ephesians-2-8-9', 'Saved by Grace', 'Спасены благодатью'),
      step('grace-practice', 'practice', '/rebus/rebus-grace', 'Grace Rebus', 'Ребус «Благодать»'),
      step('easter-practice', 'practice', '/puzzles/easter', 'Resurrection Search', 'Поиск слов Воскресения'),
    ],
  },
  {
    id: 'follow-jesus', image: '/images/jr/stories/jesus-baptism/story-jesus-baptism.png',
    title: { en: 'Follow Jesus', ru: 'Следуй за Иисусом' },
    truth: { en: 'Disciples trust Jesus, obey Him, pray, serve, and live with open hands.', ru: 'Ученики доверяют Иисусу, слушаются, молятся, служат и живут с открытыми руками.' },
    badge: { en: 'Follow Jesus', ru: 'Следую за Иисусом' },
    steps: [
      step('baptism-story', 'story', '/stories/jesus-baptism', 'Jesus Is Baptized', 'Крещение Иисуса'),
      step('baptism-lesson', 'lesson', '/lessons/baptism-prep', 'Why Get Baptized?', 'Зачем креститься?'),
      step('prayer-lesson', 'lesson', '/lessons/how-to-pray', 'How to Talk to God', 'Как разговаривать с Богом'),
      step('prayer-practice', 'practice', '/puzzles/lords-prayer', 'The Lord’s Prayer Search', 'Поиск слов молитвы Господней'),
      step('church-lesson', 'lesson', '/lessons/jesus-builds-his-church', 'Jesus Builds His Church', 'Иисус строит Свою Церковь'),
      step('open-hands', 'lesson', '/lessons/one-thing-you-lack', 'One Thing You Lack', 'Одного тебе недостаёт'),
      step('every-one-matters', 'lesson', '/lessons/every-one-matters', 'Every One Matters', 'Важен каждый'),
      step('doers-scripture', 'scripture', '/memory/james-1-22', 'Be Doers of the Word', 'Будьте исполнителями слова'),
    ],
  },
  {
    id: 'walk-by-spirit', image: '/images/jr/topic-holy-spirit.png',
    title: { en: 'Walk by the Holy Spirit', ru: 'Живи по Святому Духу' },
    truth: { en: 'The Holy Spirit helps believers become like Jesus and stand firm.', ru: 'Святой Дух помогает верующим становиться похожими на Иисуса и стоять твёрдо.' },
    badge: { en: 'Walk by the Spirit', ru: 'Живу по Духу' },
    steps: [
      step('holy-spirit', 'lesson', '/lessons/holy-spirit', 'The Holy Spirit', 'Святой Дух'),
      step('fruit-practice', 'practice', '/puzzles/fruits-of-the-spirit', 'Fruit of the Spirit Search', 'Поиск плодов Духа'),
      step('fruit-quest', 'quest', '/quests/fruit-of-spirit', 'Fruit of the Spirit Quest', 'Квест плодов Духа'),
      step('armor-practice', 'practice', '/puzzles/gods-armor', 'Armor of God Search', 'Поиск всеоружия Божьего'),
      step('armor-quest', 'quest', '/quests/armor-of-god', 'Armor of God Quest', 'Квест всеоружия Божьего'),
      step('shield-game', 'game', '/games/shield-of-faith', 'Shield of Faith', 'Щит веры', false),
    ],
  },
]

export const allJourneySteps = journeyUnits.flatMap((unit, unitIndex) => unit.steps.map((journeyStep, stepIndex) => ({
  ...journeyStep, unitId: unit.id, unitIndex, stepIndex,
})))

// Legacy lessons without shared star-mastery completion. Guided mode places
// an explicit completion action after the full lesson body for these routes.
export const journeyManualLessonHrefs = new Set([
  '/lessons/baptism-prep',
  '/lessons/case-for-christ-bible',
  '/lessons/case-for-christ-cross',
  '/lessons/case-for-christ-gods-son',
  '/lessons/case-for-christ-resurrection',
  '/lessons/grace-in-the-kingdom',
])
