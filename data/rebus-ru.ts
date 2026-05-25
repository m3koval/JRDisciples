export interface RebusPuzzle {
  id: string;
  title: string;
  emoji: string;
  clues: Array<{ type: "emoji" | "plus" | "minus" | "equals" | "text"; value: string }>;
  answer: string;
  hint: string;
}

export const rebusRu: RebusPuzzle[] = [
  {
    id: "rebus-vera-ru",
    title: "Ребус 1: Доверие Богу",
    emoji: "✝️",
    clues: [
      { type: "emoji", value: "🐪" },
      { type: "minus", value: "−" },
      { type: "text", value: "БЛЮД" },
      { type: "plus", value: "+" },
      { type: "text", value: "А" },
    ],
    answer: "ВЕРА",
    hint: "Доверие Богу и Его слову — Евреям 11:1 (🐪 = ВЕРБЛЮД)"
  },
  {
    id: "rebus-mir-ru",
    title: "Ребус 2: Дар Бога нашему сердцу",
    emoji: "🕊️",
    clues: [
      { type: "emoji", value: "🌍" },
    ],
    answer: "МИР",
    hint: "Мир Бога превышает всякое понимание — Филиппийцам 4:7"
  },
  {
    id: "rebus-krest-ru",
    title: "Ребус 3: Символ спасения",
    emoji: "✝️",
    clues: [
      { type: "emoji", value: "🛋️" },
      { type: "minus", value: "−" },
      { type: "text", value: "ЛО" },
      { type: "plus", value: "+" },
      { type: "text", value: "Т" },
    ],
    answer: "КРЕСТ",
    hint: "Иисус умер на кресте ради нас — Иоанна 3:16 (🛋️ = КРЕСЛО)"
  },
  {
    id: "rebus-nadezhda-ru",
    title: "Ребус 4: Уверенность в Боге",
    emoji: "✨",
    clues: [
      { type: "text", value: "НАД" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🦔" },
      { type: "plus", value: "+" },
      { type: "text", value: "ДА" },
    ],
    answer: "НАДЕЖДА",
    hint: "Надежда на Бога никогда не подведёт — Римлянам 5:5 (🦔 = ЕЖ)"
  },
  {
    id: "rebus-molitva-ru",
    title: "Ребус 5: Разговор с Богом",
    emoji: "🙏",
    clues: [
      { type: "emoji", value: "⚡" },
      { type: "minus", value: "−" },
      { type: "text", value: "НИЯ" },
      { type: "plus", value: "+" },
      { type: "text", value: "ИТВА" },
    ],
    answer: "МОЛИТВА",
    hint: "Молитесь непрестанно — 1 Фессалоникийцам 5:17 (⚡ = МОЛНИЯ)"
  },
  {
    id: "rebus-slovo-ru",
    title: "Ребус 6: Библия — Слово Бога",
    emoji: "📖",
    clues: [
      { type: "emoji", value: "🐘" },
      { type: "minus", value: "−" },
      { type: "text", value: "Н" },
      { type: "plus", value: "+" },
      { type: "text", value: "ВО" },
    ],
    answer: "СЛОВО",
    hint: "Слово Бога — светильник ноге моей — Псалом 118:105 (🐘 = СЛОН)"
  },
  {
    id: "rebus-radost-ru",
    title: "Ребус 7: Радость в Господе",
    emoji: "😊",
    clues: [
      { type: "emoji", value: "📻" },
      { type: "minus", value: "−" },
      { type: "text", value: "ИО" },
      { type: "plus", value: "+" },
      { type: "text", value: "ОСТЬ" },
    ],
    answer: "РАДОСТЬ",
    hint: "Радуйтесь всегда в Господе — Филиппийцам 4:4 (📻 = РАДИО)"
  },
  {
    id: "rebus-terpenie-ru",
    title: "Ребус 8: Терпение и стойкость",
    emoji: "⏳",
    clues: [
      { type: "text", value: "ТЕР" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🎵" },
    ],
    answer: "ТЕРПЕНИЕ",
    hint: "В терпении вашем спасайте души ваши — Лука 21:19 (🎵 = ПЕНИЕ)"
  },
  {
    id: "rebus-svyatoy-ru",
    title: "Ребус 9: Чистота перед Богом",
    emoji: "✨",
    clues: [
      { type: "emoji", value: "💡" },
      { type: "minus", value: "−" },
      { type: "text", value: "ЕТ" },
      { type: "plus", value: "+" },
      { type: "text", value: "ЯТОЙ" },
    ],
    answer: "СВЯТОЙ",
    hint: "Будьте святы, ибо Я свят — 1 Петра 1:16 (💡 = СВЕТ)"
  },
  {
    id: "rebus-pokayanie-ru",
    title: "Ребус 10: Возвращение к Богу",
    emoji: "↩️",
    clues: [
      { type: "emoji", value: "🌾" },
      { type: "minus", value: "−" },
      { type: "text", value: "ЛЕ" },
      { type: "plus", value: "+" },
      { type: "text", value: "КАЯНИЕ" },
    ],
    answer: "ПОКАЯНИЕ",
    hint: "Покайтесь и обратитесь к Богу — Деяния 3:19 (🌾 = ПОЛЕ)"
  },
  {
    id: "rebus-pastyr-ru",
    title: "Ребус 11: Иисус — Добрый...",
    emoji: "🐑",
    clues: [
      { type: "emoji", value: "🍝" },
      { type: "minus", value: "−" },
      { type: "text", value: "А" },
      { type: "plus", value: "+" },
      { type: "text", value: "ЫРЬ" },
    ],
    answer: "ПАСТЫРЬ",
    hint: "Я есмь пастырь добрый — Иоанна 10:11 (🍝 = ПАСТА)"
  },
  {
    id: "rebus-mudrost-ru",
    title: "Ребус 12: Дар от Бога",
    emoji: "🦉",
    clues: [
      { type: "emoji", value: "🗑️" },
      { type: "minus", value: "−" },
      { type: "text", value: "СОР" },
      { type: "plus", value: "+" },
      { type: "text", value: "ДРОСТЬ" },
    ],
    answer: "МУДРОСТЬ",
    hint: "Начало мудрости — страх Господень — Притчи 9:10 (🗑️ = МУСОР)"
  },
];
