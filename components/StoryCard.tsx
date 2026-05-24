import Link from "next/link";
import { Story } from "@/data/stories";

interface StoryCardProps {
  story: Story;
}

const cardColors = [
  "from-yellow-100 to-orange-100 border-orange-300",
  "from-blue-100 to-cyan-100 border-blue-300",
  "from-purple-100 to-pink-100 border-purple-300",
  "from-green-100 to-emerald-100 border-green-300",
  "from-indigo-100 to-violet-100 border-indigo-300",
  "from-rose-100 to-red-100 border-rose-300",
];

const buttonColors = [
  "bg-orange-500 hover:bg-orange-600",
  "bg-blue-500 hover:bg-blue-600",
  "bg-purple-500 hover:bg-purple-600",
  "bg-green-500 hover:bg-green-600",
  "bg-indigo-500 hover:bg-indigo-600",
  "bg-rose-500 hover:bg-rose-600",
];

const storyIds = [
  "creation",
  "noah",
  "joseph",
  "david-goliath",
  "jonah",
  "birth-of-jesus",
];

export default function StoryCard({ story }: StoryCardProps) {
  const colorIndex = storyIds.indexOf(story.id) % cardColors.length;
  const cardColor = cardColors[Math.max(colorIndex, 0)];
  const btnColor = buttonColors[Math.max(colorIndex, 0)];

  return (
    <div
      className={`rounded-3xl border-2 bg-gradient-to-br ${cardColor} p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4`}
    >
      {/* Emoji + Title */}
      <div className="flex items-center gap-3">
        <span className="text-5xl leading-none" role="img" aria-label={story.title}>
          {story.emoji}
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-gray-800 leading-tight">
            {story.title}
          </h2>
          <p className="text-sm font-semibold text-gray-500">{story.reference}</p>
        </div>
      </div>

      {/* Age Note */}
      <span className="inline-block self-start rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-gray-600 border border-white">
        {story.ageNote}
      </span>

      {/* Big Truth */}
      <div className="rounded-2xl bg-white/60 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
          Big Truth
        </p>
        <p className="text-sm font-semibold text-gray-700 leading-snug">
          {story.bigTruth}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={`/stories/${story.id}`}
        className={`mt-auto inline-block rounded-2xl ${btnColor} px-6 py-3 text-center text-base font-extrabold text-white shadow transition-colors duration-200`}
      >
        Read Story 📖
      </Link>
    </div>
  );
}
