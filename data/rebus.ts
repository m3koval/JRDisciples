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
// emoji = picture clue (its word/sound)
// text  = literal letters or word
// plus  = add together
// minus = remove those letters
// equals = the answer follows
//
// Example: 🐝 + LIEVE = BELIEVE  (BEE sounds like "BE", + LIEVE = BELIEVE)

export const rebusPuzzles: RebusPuzzle[] = [
  {
    id: "rebus-believe",
    title: "Puzzle 1: What we do with Jesus",
    emoji: "✝️",
    clues: [
      { type: "emoji", value: "🐝" },
      { type: "text", value: "(BE)" },
      { type: "plus", value: "+" },
      { type: "text", value: "LIEVE" },
    ],
    answer: "BELIEVE",
    hint: "What we do with our hearts when we trust Jesus — John 3:16"
  },
  {
    id: "rebus-pray",
    title: "Puzzle 2: Talking to God",
    emoji: "🙏",
    clues: [
      { type: "text", value: "PR" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🅰️" },
      { type: "plus", value: "+" },
      { type: "text", value: "Y" },
    ],
    answer: "PRAY",
    hint: "How we talk to God — 1 Thessalonians 5:17"
  },
  {
    id: "rebus-grace",
    title: "Puzzle 3: God's free gift",
    emoji: "🎁",
    clues: [
      { type: "emoji", value: "🍇" },
      { type: "text", value: "(GRAPE)" },
      { type: "minus", value: "−" },
      { type: "text", value: "PE" },
      { type: "plus", value: "+" },
      { type: "text", value: "CE" },
    ],
    answer: "GRACE",
    hint: "God's gift you did not earn — Ephesians 2:8"
  },
  {
    id: "rebus-disciple",
    title: "Puzzle 4: A follower of Jesus",
    emoji: "🙎",
    clues: [
      { type: "emoji", value: "💿" },
      { type: "text", value: "(DISC)" },
      { type: "plus", value: "+" },
      { type: "text", value: "I" },
      { type: "plus", value: "+" },
      { type: "text", value: "PLE" },
    ],
    answer: "DISCIPLE",
    hint: "A learner and follower of Jesus"
  },
  {
    id: "rebus-forgive",
    title: "Puzzle 5: Letting go of anger",
    emoji: "💚",
    clues: [
      { type: "text", value: "4" },
      { type: "text", value: "(FOR)" },
      { type: "plus", value: "+" },
      { type: "emoji", value: "🎁" },
      { type: "text", value: "(GIVE)" },
    ],
    answer: "FORGIVE",
    hint: "Letting go of being angry at someone — Colossians 3:13"
  },
  {
    id: "rebus-savior",
    title: "Puzzle 6: The one who rescues us",
    emoji: "💪",
    clues: [
      { type: "emoji", value: "🛟" },
      { type: "text", value: "(SAVE)" },
      { type: "minus", value: "−" },
      { type: "text", value: "VE" },
      { type: "plus", value: "+" },
      { type: "text", value: "VIOR" },
    ],
    answer: "SAVIOR",
    hint: "The one who rescues us — that's Jesus! Luke 2:11"
  }
];
