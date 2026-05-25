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
  {
    id: "fruits-of-the-spirit",
    title: "Fruits of the Spirit",
    emoji: "🍇",
    theme: "Galatians 5:22-23",
    words: ["LOVE", "JOY", "PEACE", "PATIENCE", "KINDNESS", "GOODNESS", "MEEKNESS", "GENTLE"],
    description: "When the Holy Spirit lives in us, He grows beautiful fruit in our hearts. Hunt them down in every direction!",
  },
  {
    id: "lords-prayer",
    title: "The Lord's Prayer",
    emoji: "🙏",
    theme: "Matthew 6:9-13",
    words: ["FATHER", "HEAVEN", "KINGDOM", "BREAD", "FORGIVE", "TRESPASS", "GLORY", "POWER"],
    description: "Jesus taught His disciples how to pray. Find these key words from the Lord's Prayer — all 8 directions!",
  },
  {
    id: "bible-heroes",
    title: "Bible Heroes",
    emoji: "⚔️",
    theme: "Heroes of Faith",
    words: ["MOSES", "DAVID", "NOAH", "ELIJAH", "DANIEL", "PETER", "PAUL", "ESTHER"],
    description: "These brave men and women trusted God with their whole lives. Can you find all 8 Bible heroes?",
  },
  {
    id: "creation-week",
    title: "Creation Week",
    emoji: "🌍",
    theme: "Genesis 1",
    words: ["LIGHT", "WATER", "EARTH", "PLANTS", "FISH", "BIRDS", "ANIMALS", "STARS"],
    description: "In 6 days God made everything! Find all 8 things God created — words hide in every direction!",
  },
  {
    id: "christmas-story",
    title: "The Christmas Story",
    emoji: "⭐",
    theme: "Luke 2",
    words: ["ANGEL", "STABLE", "JOSEPH", "MANGER", "STAR", "GIFTS", "BETHLEHEM", "MARY"],
    description: "The most amazing night in history! Find all 8 words from the Christmas story — words go every direction!",
  },
  {
    id: "easter",
    title: "Easter",
    emoji: "✝️",
    theme: "The Resurrection",
    words: ["CROSS", "TOMB", "RISEN", "GLORY", "ALIVE", "ASCEND", "THORNS", "STONE"],
    description: "Jesus died and rose again! Find all 8 words from the Easter story — they run in every direction!",
  },
  {
    id: "miracles-of-jesus",
    title: "Miracles of Jesus",
    emoji: "✨",
    theme: "Signs and Wonders",
    words: ["HEALED", "WALKED", "LOAVES", "LAZARUS", "CALMED", "SIGHT", "WATER", "FAITH"],
    description: "Jesus did incredible miracles to show His power and love! Find all 8 miracle words hiding in the grid!",
  },
  {
    id: "parables",
    title: "Parables of Jesus",
    emoji: "🌱",
    theme: "Stories Jesus Told",
    words: ["SOWER", "SEEDS", "PRODIGAL", "TALENT", "PEARL", "MUSTARD", "LAMP", "SHEEP"],
    description: "Jesus used everyday stories to teach big truths. Find these 8 words from His famous parables!",
  },
  {
    id: "the-disciples",
    title: "The Disciples",
    emoji: "👥",
    theme: "Jesus's Twelve Followers",
    words: ["PETER", "JAMES", "JOHN", "ANDREW", "PHILIP", "MATTHEW", "THOMAS", "SIMON"],
    description: "Jesus chose 12 special followers. Find these 8 disciples hiding in the grid — every direction counts!",
  },
];
