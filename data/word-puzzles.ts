export interface WordPuzzle {
  id: string;
  title: string;
  emoji: string;
  theme: string;
  words: string[];
  description: string;
}

export const wordPuzzles: WordPuzzle[] = [
  {
    id: "books-of-the-bible",
    title: "Books of the Bible",
    emoji: "📖",
    theme: "Books of the Bible",
    words: ["GENESIS", "PSALMS", "JOHN", "RUTH", "ACTS", "JOB", "MARK", "LUKE"],
    description: "Find these 8 books hidden in the grid — words go in any direction, even diagonally and backwards!",
  },
  {
    id: "jesus-is",
    title: "Jesus Is...",
    emoji: "✝️",
    theme: "Names and Titles of Jesus",
    words: ["SAVIOR", "LORD", "KING", "SHEPHERD", "LIGHT", "TRUTH", "WORD", "WAY"],
    description: "The Bible uses many amazing words to describe Jesus. Find them all — they hide in every direction!",
  },
  {
    id: "gods-armor",
    title: "God's Armor",
    emoji: "🛡️",
    theme: "Armor of God (Ephesians 6)",
    words: ["TRUTH", "PEACE", "FAITH", "SALVATION", "GOSPEL", "PRAYER", "SHIELD", "SWORD"],
    description: "Ephesians 6 tells us to put on God's armor every day. Find all the pieces — words run in any direction!",
  },
];
