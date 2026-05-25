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
    id: "rebus-believe-ru",
    title: "Религиозный ребус #1",
    emoji: "✝️",
    clues: [
      { type: "emoji", value: "💫" },
      { type: "text", value: "РА" },
      { type: "minus", value: "" },
      { type: "emoji", value: "🦁" },
      { type: "plus", value: "" },
      { type: "emoji", value: "⚡" },
    ],
    answer: "ВЕРА",
    hint: "Это то, что нам нужно, чтобы доверять Богу и преодолевать препятствия.",
  },
  {
    id: "rebus-pray-ru",
    title: "Религиозный ребус #2",
    emoji: "🙏",
    clues: [
      { type: "emoji", value: "👨" },
      { type: "text", value: "МО" },
      { type: "emoji", value: "📖" },
      { type: "text", value: "ВА" },
    ],
    answer: "МОЛИТВА",
    hint: "То, что мы делаем, когда разговариваем с Богом, выражая наши желания и благодарность.",
  },
  {
    id: "rebus-grace-ru",
    title: "Религиозный ребус #3",
    emoji: "🌟",
    clues: [
      { type: "emoji", value: "🎁" },
      { type: "text", value: "РА" },
      { type: "emoji", value: "🕊️" },
      { type: "text", value: "ЕТ" },
    ],
    answer: "БЛАГОДАТЬ",
    hint: "Божественный дар, который мы не можем заработать, но можем получить через веру в Иисуса.",
  },
  {
    id: "rebus-hope-ru",
    title: "Религиозный ребус #4",
    emoji: "✨",
    clues: [
      { type: "emoji", value: "👁️" },
      { type: "text", value: "БО" },
      { type: "emoji", value: "⭐" },
      { type: "text", value: "ВА" },
    ],
    answer: "НАДЕЖДА",
    hint: "Уверенность в хороших вещах, которые придут в будущем благодаря Богу.",
  },
  {
    id: "rebus-love-ru",
    title: "Религиозный ребус #5",
    emoji: "❤️",
    clues: [
      { type: "emoji", value: "❤️" },
      { type: "text", value: "ЛЮ" },
      { type: "emoji", value: "👨" },
      { type: "minus", value: "" },
      { type: "emoji", value: "😈" },
    ],
    answer: "ЛЮБОВЬ",
    hint: "Самая сильная эмоция, которая проявляет заботу и принятие. Бог покрыл нас этим.",
  },
  {
    id: "rebus-salvation-ru",
    title: "Религиозный ребус #6",
    emoji: "🛟",
    clues: [
      { type: "emoji", value: "💔" },
      { type: "minus", value: "" },
      { type: "emoji", value: "😈" },
      { type: "plus", value: "" },
      { type: "emoji", value: "✝️" },
    ],
    answer: "СПАСЕНИЕ",
    hint: "То, что Иисус дал нам, спасая нас от наших грехов через крест.",
  },
  {
    id: "rebus-truth-ru",
    title: "Религиозный ребус #7",
    emoji: "🔍",
    clues: [
      { type: "emoji", value: "📖" },
      { type: "text", value: "ИС" },
      { type: "emoji", value: "🗣️" },
      { type: "text", value: "НА" },
    ],
    answer: "ИСТИНА",
    hint: "То, что говорит нам Слово Бога и Иисус. Бог — источник этого.",
  },
];
