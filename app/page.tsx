import Link from "next/link";

const activities = [
  {
    href: "/stories",
    emoji: "📖",
    title: "Bible Stories",
    description: "Read amazing stories from God's Word!",
    color: "bg-blue-100 border-blue-300 hover:bg-blue-200",
    badge: "6 Stories",
  },
  {
    href: "/quiz",
    emoji: "❓",
    title: "Bible Quizzes",
    description: "Test what you know about the Bible!",
    color: "bg-yellow-100 border-yellow-300 hover:bg-yellow-200",
    badge: "6 Quizzes",
  },
  {
    href: "/memory",
    emoji: "💡",
    title: "Verse Memory",
    description: "Hide God's Word in your heart!",
    color: "bg-green-100 border-green-300 hover:bg-green-200",
    badge: "8 Verses",
  },
  {
    href: "/puzzles",
    emoji: "🔤",
    title: "Word Puzzles",
    description: "Find hidden Bible words in the grid!",
    color: "bg-purple-100 border-purple-300 hover:bg-purple-200",
    badge: "3 Puzzles",
  },
  {
    href: "/rebus",
    emoji: "🧩",
    title: "Rebus Puzzles",
    description: "Solve picture clues to find Bible words!",
    color: "bg-pink-100 border-pink-300 hover:bg-pink-200",
    badge: "6 Puzzles",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="text-7xl mb-4">✝️</div>
        <h1 className="text-5xl font-extrabold text-blue-900 mb-3">
          JR Disciples
        </h1>
        <p className="text-xl text-blue-700 max-w-xl mx-auto">
          Learn about God, His Word, and His amazing plan — through stories, games, and challenges!
        </p>
        <div className="mt-6 bg-blue-900 text-white rounded-2xl px-6 py-4 inline-block">
          <p className="text-lg font-semibold italic">
            &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
          </p>
          <p className="text-sm mt-1 text-blue-300">— Psalm 119:105</p>
        </div>
      </div>

      {/* Activity Grid */}
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
        Pick an Activity!
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {activities.map((act) => (
          <Link
            key={act.href}
            href={act.href}
            className={`flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-md ${act.color}`}
          >
            <span className="text-6xl mb-3">{act.emoji}</span>
            <span className="inline-block bg-white text-xs font-bold px-2 py-0.5 rounded-full mb-2 text-gray-500 border">
              {act.badge}
            </span>
            <h3 className="text-xl font-extrabold text-gray-800 mb-1">{act.title}</h3>
            <p className="text-sm text-gray-600">{act.description}</p>
          </Link>
        ))}
      </div>

      {/* Encouragement */}
      <div className="mt-12 text-center bg-yellow-100 border-2 border-yellow-300 rounded-2xl p-6">
        <p className="text-2xl font-bold text-yellow-800 mb-1">Did you know? 🌟</p>
        <p className="text-gray-700">
          The Bible has <strong>66 books</strong>, written by over <strong>40 people</strong>, all telling one amazing story —
          how God rescues His people through Jesus!
        </p>
      </div>
    </div>
  );
}
