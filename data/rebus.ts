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
  },
  {
    id: "rebus-grace",
    title: "Puzzle 7: God's free gift",
    emoji: "🎀",
    clues: [
      { type: "text", value: "G" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🏁" },
    ],
    answer: "GRACE",
    hint: "God's love and forgiveness we don't deserve but freely receive — Ephesians 2:8 (🏁 = RACE)"
  },
  {
    id: "rebus-holy",
    title: "Puzzle 8: Set apart for God",
    emoji: "✨",
    clues: [
      { type: "emoji", value: "🕳️" },
      { type: "minus", value: "−" },
      { type: "text", value: "E" },
      { type: "plus", value: "+" },
      { type: "text", value: "Y" },
    ],
    answer: "HOLY",
    hint: "Pure and set apart for God — Isaiah 6:3 (🕳️ = HOLE)"
  },
  {
    id: "rebus-repent",
    title: "Puzzle 9: Turning back to God",
    emoji: "↩️",
    clues: [
      { type: "text", value: "RE" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🖊️" },
      { type: "plus", value: "+" },
      { type: "text", value: "T" },
    ],
    answer: "REPENT",
    hint: "Turning away from sin and toward God — Acts 3:19 (🖊️ = PEN)"
  },
  {
    id: "rebus-promise",
    title: "Puzzle 10: God never breaks this",
    emoji: "🌈",
    clues: [
      { type: "text", value: "PRO" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🌫️" },
      { type: "minus", value: "−" },
      { type: "text", value: "T" },
      { type: "plus", value: "+" },
      { type: "text", value: "E" },
    ],
    answer: "PROMISE",
    hint: "God always keeps His word — Numbers 23:19 (🌫️ = MIST)"
  },
  {
    id: "rebus-eternal",
    title: "Puzzle 11: Living forever with God",
    emoji: "♾️",
    clues: [
      { type: "text", value: "E" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🔄" },
      { type: "plus", value: "+" },
      { type: "text", value: "NAL" },
    ],
    answer: "ETERNAL",
    hint: "God's love and life go on forever — John 3:16 (🔄 = TURN)"
  },
  {
    id: "rebus-forgive",
    title: "Puzzle 12: What God does with our sins",
    emoji: "💛",
    clues: [
      { type: "emoji", value: "🍴" },
      { type: "minus", value: "−" },
      { type: "text", value: "K" },
      { type: "plus", value: "+" },
      { type: "text", value: "GIVE" },
    ],
    answer: "FORGIVE",
    hint: "Just as God forgave us, we forgive others — Ephesians 4:32 (🍴 = FORK)"
  },
];
