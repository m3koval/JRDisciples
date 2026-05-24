export interface MemoryVerse {
  id: string;
  reference: string;
  text: string;
  theme: string;
  emoji: string;
  hint: string;
}

export const memoryVerses: MemoryVerse[] = [
  {
    id: "john-3-16",
    reference: "John 3:16",
    text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    theme: "God's Love",
    emoji: "❤️",
    hint: "For"
  },
  {
    id: "psalm-23-1",
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd; I shall not want.",
    theme: "Trust",
    emoji: "🐑",
    hint: "The"
  },
  {
    id: "proverbs-3-5-6",
    reference: "Proverbs 3:5-6",
    text: "Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    theme: "Wisdom",
    emoji: "🧭",
    hint: "Trust"
  },
  {
    id: "romans-3-23",
    reference: "Romans 3:23",
    text: "For all have sinned and fall short of the glory of God.",
    theme: "Sin",
    emoji: "⚠️",
    hint: "For"
  },
  {
    id: "romans-6-23",
    reference: "Romans 6:23",
    text: "For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.",
    theme: "Salvation",
    emoji: "🎁",
    hint: "For"
  },
  {
    id: "ephesians-2-8-9",
    reference: "Ephesians 2:8-9",
    text: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.",
    theme: "Grace",
    emoji: "✨",
    hint: "For"
  },
  {
    id: "james-1-22",
    reference: "James 1:22",
    text: "But be doers of the word, and not hearers only, deceiving yourselves.",
    theme: "Obedience",
    emoji: "🙌",
    hint: "But"
  },
  {
    id: "philippians-4-13",
    reference: "Philippians 4:13",
    text: "I can do all things through him who strengthens me.",
    theme: "Strength",
    emoji: "💪",
    hint: "I"
  }
];
