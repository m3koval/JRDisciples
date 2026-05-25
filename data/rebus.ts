export interface RebusPuzzle {
  id: string;
  title: string;
  emoji: string;
  clues: Array<{
    type: "emoji" | "text" | "plus" | "minus" | "equals";
    value: string;
  }>;
  answer: string;
  hint: string;
}

export const rebusPuzzles: RebusPuzzle[] = [
  {
    id: "rebus-believe",
    title: "Puzzle 1: What we do with Jesus",
    emoji: "✝️",
    clues: [
      { type: "emoji", value: "🐝" },
      { type: "plus", value: "+" },
      { type: "text", value: "LIEVE" },
    ],
    answer: "BELIEVE",
    hint: "What we do with our hearts when we trust Jesus — John 3:16"
  },
  {
    id: "rebus-worship",
    title: "Puzzle 2: Praising God",
    emoji: "🙌",
    clues: [
      { type: "emoji", value: "🪱" },
      { type: "minus", value: "−" },
      { type: "text", value: "M" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🚢" },
    ],
    answer: "WORSHIP",
    hint: "Praising and honoring God with your whole heart — Psalm 95:6"
  },
  {
    id: "rebus-servant",
    title: "Puzzle 3: How Jesus calls us to live",
    emoji: "🤲",
    clues: [
      { type: "text", value: "SERVE" },
      { type: "minus", value: "−" },
      { type: "text", value: "E" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🐜" },
    ],
    answer: "SERVANT",
    hint: "Jesus came not to be served, but to serve — Mark 10:45"
  },
  {
    id: "rebus-offering",
    title: "Puzzle 4: Giving to God",
    emoji: "🎁",
    clues: [
      { type: "text", value: "OFF" },
      { type: "plus", value: "+" },
      { type: "text", value: "ER" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🔔" },
    ],
    answer: "OFFERING",
    hint: "Giving back to God from what He gave us — 2 Corinthians 9:7"
  },
  {
    id: "rebus-covenant",
    title: "Puzzle 5: God's solemn promise",
    emoji: "🌈",
    clues: [
      { type: "emoji", value: "🐄" },
      { type: "minus", value: "−" },
      { type: "text", value: "W" },
      { type: "plus", value: "+" },
      { type: "text", value: "VE" },
      { type: "plus", value: "+" },
      { type: "text", value: "NANT" },
    ],
    answer: "COVENANT",
    hint: "God's binding promise to His people — the rainbow is the sign! Genesis 9:13"
  },
  {
    id: "rebus-kingdom",
    title: "Puzzle 6: Where God rules forever",
    emoji: "👑",
    clues: [
      { type: "emoji", value: "👑" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🏛️" },
      { type: "minus", value: "−" },
      { type: "text", value: "E" },
    ],
    answer: "KINGDOM",
    hint: "God's Kingdom will last forever — Daniel 7:27"
  }
];
