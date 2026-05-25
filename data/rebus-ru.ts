export interface RebusPuzzle {
  id: string;
  title: string;
  emoji: string;
  clues: Array<{ type: "emoji" | "plus" | "minus" | "equals" | "text"; value: string }>;
  answer: string;
  hint: string;
}

// Как читать эти ребусы:
// emoji = картинка (используется русское название картинки или его часть)
// text  = буквы или слог
// minus = убрать эти буквы из предыдущего слова
// plus  = добавить следующий элемент
//
// Примеры:
// 🐪(ВЕРБЛЮД) − БЛЮД + А = ВЕРА
// 🐘(СЛОН) − Н + ВО = СЛОВО

export const rebusRu: RebusPuzzle[] = [
  {
    id: "rebus-vera-ru",
    title: "Ребус 1: Доверие Богу",
    emoji: "✝️",
    clues: [
      { type: "emoji", value: "🐪" },
      { type: "text", value: "ВЕРБЛЮД" },
      { type: "minus", value: "−" },
      { type: "text", value: "БЛЮД" },
      { type: "plus", value: "+" },
      { type: "text", value: "А" },
    ],
    answer: "ВЕРА",
    hint: "Доверие Богу и Его слову — Евреям 11:1"
  },
  {
    id: "rebus-mir-ru",
    title: "Ребус 2: Дар Бога нашему сердцу",
    emoji: "🕊️",
    clues: [
      { type: "emoji", value: "🎵" },
      { type: "text", value: "МИ (нота)" },
      { type: "plus", value: "+" },
      { type: "text", value: "Р" },
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
      { type: "text", value: "КРЕСЛО" },
      { type: "minus", value: "−" },
      { type: "text", value: "ЛО" },
      { type: "plus", value: "+" },
      { type: "text", value: "Т" },
    ],
    answer: "КРЕСТ",
    hint: "Иисус умер на кресте ради нас — Иоанна 3:16"
  },
  {
    id: "rebus-nadezhda-ru",
    title: "Ребус 4: Уверенность в Боге",
    emoji: "✨",
    clues: [
      { type: "text", value: "НАД" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🦔" },
      { type: "text", value: "ЕЖ" },
      { type: "plus", value: "+" },
      { type: "text", value: "ДА" },
    ],
    answer: "НАДЕЖДА",
    hint: "Надежда на Бога никогда не подведёт — Римлянам 5:5"
  },
  {
    id: "rebus-molitva-ru",
    title: "Ребус 5: Разговор с Богом",
    emoji: "🙏",
    clues: [
      { type: "emoji", value: "⚡" },
      { type: "text", value: "МОЛНИЯ" },
      { type: "minus", value: "−" },
      { type: "text", value: "НИЯ" },
      { type: "plus", value: "+" },
      { type: "text", value: "ИТВА" },
    ],
    answer: "МОЛИТВА",
    hint: "Молитесь непрестанно — 1 Фессалоникийцам 5:17"
  },
  {
    id: "rebus-slovo-ru",
    title: "Ребус 6: Библия — Слово Бога",
    emoji: "📖",
    clues: [
      { type: "emoji", value: "🐘" },
      { type: "text", value: "СЛОН" },
      { type: "minus", value: "−" },
      { type: "text", value: "Н" },
      { type: "plus", value: "+" },
      { type: "text", value: "ВО" },
    ],
    answer: "СЛОВО",
    hint: "Слово Бога — светильник ноге моей — Псалом 118:105"
  },
];
