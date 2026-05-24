export interface WordPuzzle {
  id: string;
  title: string;
  emoji: string;
  theme: string;
  words: string[];
  grid: string[][];
  description: string;
}

// All grids are pre-computed with words verified to appear in the grid.
// Words can run horizontally (left→right) or vertically (top→bottom).

export const wordPuzzles: WordPuzzle[] = [
  {
    id: "books-of-the-bible",
    title: "Books of the Bible",
    emoji: "📖",
    theme: "Books of the Bible",
    words: ["GENESIS", "PSALMS", "JOHN", "RUTH", "ACTS", "JOB", "MARK", "LUKE"],
    // GENESIS  → row 0, cols 0-6, horizontal
    // PSALMS   → row 1, cols 1-6, horizontal
    // ACTS     → row 2, cols 1-4, horizontal
    // JOHN     → row 4, cols 3-6, horizontal
    // LUKE     → row 6, cols 2-5, horizontal
    // RUTH     → row 8, cols 2-5, horizontal
    // MARK     → col 7, rows 0-3, vertical
    // JOB      → col 9, rows 0-2, vertical
    grid: [
      ["G","E","N","E","S","I","S","M","Z","J"],
      ["W","P","S","A","L","M","S","A","H","O"],
      ["F","A","C","T","S","Q","F","R","D","B"],
      ["L","X","N","T","Y","Z","U","K","Q","X"],
      ["V","X","B","J","O","H","N","R","V","B"],
      ["C","X","P","W","D","F","G","K","M","W"],
      ["R","X","L","U","K","E","Z","Y","P","Q"],
      ["Z","X","S","V","X","T","B","N","G","R"],
      ["H","W","R","U","T","H","H","J","C","U"],
      ["Q","T","R","X","F","P","X","M","L","P"]
    ],
    description: "Find these 8 books hidden in the grid — they go across or up-down!"
  },
  {
    id: "jesus-is",
    title: "Jesus Is...",
    emoji: "✝️",
    theme: "Names and Titles of Jesus",
    words: ["SAVIOR", "LORD", "KING", "SHEPHERD", "LIGHT", "TRUTH", "WORD", "WAY"],
    // SAVIOR   → row 0, cols 0-5, horizontal
    // WORD     → col 6, rows 0-3, vertical
    // SHEPHERD → col 9, rows 0-7, vertical
    // LORD     → row 2, cols 0-3, horizontal
    // KING     → row 5, cols 0-3, horizontal
    // WAY      → row 9, cols 0-2, horizontal
    // LIGHT    → row 7, cols 2-6, horizontal
    // TRUTH    → row 4, cols 5-9, horizontal
    grid: [
      ["S","A","V","I","O","R","W","C","F","S"],
      ["R","U","X","A","D","G","O","M","P","H"],
      ["L","O","R","D","N","Q","R","W","Z","E"],
      ["L","O","R","U","X","A","D","G","J","P"],
      ["V","Y","B","E","H","T","R","U","T","H"],
      ["K","I","N","G","R","U","X","A","D","E"],
      ["P","S","V","Y","B","E","H","K","N","R"],
      ["Z","C","L","I","G","H","T","U","X","D"],
      ["J","M","P","S","V","Y","B","E","H","K"],
      ["W","A","Y","C","F","I","L","O","R","U"]
    ],
    description: "The Bible uses many amazing words to describe Jesus. Find them all!"
  },
  {
    id: "gods-armor",
    title: "God's Armor",
    emoji: "🛡️",
    theme: "Armor of God (Ephesians 6)",
    words: ["TRUTH", "PEACE", "FAITH", "SALVATION", "GOSPEL", "PRAYER", "SHIELD", "SWORD"],
    // SALVATION → row 0, cols 0-8, horizontal
    // SHIELD    → row 1, cols 0-5, horizontal
    // SWORD     → row 2, cols 0-4, horizontal
    // TRUTH     → row 3, cols 0-4, horizontal
    // PEACE     → row 4, cols 0-4, horizontal
    // FAITH     → row 5, cols 0-4, horizontal
    // GOSPEL    → row 6, cols 0-5, horizontal
    // PRAYER    → row 7, cols 0-5, horizontal
    grid: [
      ["S","A","L","V","A","T","I","O","N","X"],
      ["S","H","I","E","L","D","J","Q","Z","G"],
      ["S","W","O","R","D","L","W","C","J","Q"],
      ["T","R","U","T","H","Y","F","L","W","C"],
      ["P","E","A","C","E","H","N","Y","F","L"],
      ["F","A","I","T","H","V","B","H","N","Y"],
      ["G","O","S","P","E","L","K","V","B","H"],
      ["P","R","A","Y","E","R","X","D","K","V"],
      ["L","W","C","J","Q","Z","G","M","X","D"],
      ["Y","F","L","W","C","J","Q","Z","G","M"]
    ],
    description: "Ephesians 6 tells us to put on God's armor every day. Find all the pieces!"
  }
];
