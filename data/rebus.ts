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

// How to read these puzzles:
// emoji = picture clue (its English word/sound)
// text  = literal letters shown in a box
// plus  = combine what's before and after
// minus = remove those letters from the previous picture's word
//
// Example: 🐝(BEE) + LIEVE = BELIEVE

export const rebusPuzzles: RebusPuzzle[] = [
  {
    id: "rebus-believe",
    title: "Puzzle 1: What we do with Jesus",
    emoji: "✝️",
    clues: [
      { type: "emoji", value: "🐝" },
      { type: "text", value: "BEE" },
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
      { type: "text", value: "WORM" },
      { type: "minus", value: "−" },
      { type: "text", value: "M" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🚢" },
      { type: "text", value: "SHIP" },
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
      { type: "text", value: "ANT" },
    ],
    answer: "SERVANT",
    hint: "Jesus came not to be served, but to serve — Mark 10:45"
  },
  {
    id: "rebus-creation",
    title: "Puzzle 4: What God made in 6 days",
    emoji: "🌍",
    clues: [
      { type: "text", value: "CRE" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🍎" },
      { type: "text", value: "ATE" },
      { type: "plus", value: "+" },
      { type: "text", value: "ION" },
    ],
    answer: "CREATION",
    hint: "In the beginning God made everything — Genesis 1:1 (🍎 = ATE, past tense of eat)"
  },
  {
    id: "rebus-covenant",
    title: "Puzzle 5: God's solemn promise",
    emoji: "🌈",
    clues: [
      { type: "emoji", value: "🐄" },
      { type: "text", value: "COW" },
      { type: "minus", value: "−" },
      { type: "text", value: "W" },
      { type: "plus", value: "+" },
      { type: "text", value: "VE" },
      { type: "plus", value: "+" },
      { type: "text", value: "NANT" },
    ],
    answer: "COVENANT",
    hint: "God's binding promise to His people — the rainbow is a sign of it! Genesis 9:13"
  },
  {
    id: "rebus-kingdom",
    title: "Puzzle 6: Where God rules forever",
    emoji: "👑",
    clues: [
      { type: "emoji", value: "👑" },
      { type: "text", value: "KING" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🏛️" },
      { type: "text", value: "DOME" },
      { type: "minus", value: "−" },
      { type: "text", value: "E" },
    ],
    answer: "KINGDOM",
    hint: "God's Kingdom will last forever — Daniel 7:27"
  }
];
