import "server-only";
import { lessonTopics } from "@/data/lessons";
import { stories } from "@/data/stories";
import { memoryVerses } from "@/data/memory-verses";
import { wordPuzzles } from "@/data/word-puzzles";
import { quizzes } from "@/data/quizzes";
import { rebusPuzzles } from "@/data/rebus";
import { getWhyLessons } from "@/data/why";
import { pageMetadata } from "@/lib/seo";

// Reviewed public pages only. /quest redirects; /progress and /practice are personal state.
// Language is a client preference on these same URLs, not separate /en or /ru routes.
export const staticPublicPaths = [
  "/",
  "/explore",
  "/games",
  "/games/david-sling-challenge",
  "/games/escape-room-daniel",
  "/games/faith-over-giants",
  "/games/faithful-archer",
  "/games/manna-trail",
  "/games/shepherd-light-adventure",
  "/games/shield-of-faith",
  "/games/spot-the-difference",
  "/games/trail-of-truth",
  "/games/truth-runner",
  "/journey",
  "/lessons",
  "/lessons/alone-with-god",
  "/lessons/baptism-prep",
  "/lessons/case-for-christ-bible",
  "/lessons/case-for-christ-cross",
  "/lessons/case-for-christ-gods-son",
  "/lessons/case-for-christ-resurrection",
  "/lessons/coin-in-the-fish",
  "/lessons/davids-lord",
  "/lessons/every-one-matters",
  "/lessons/gods-cutting",
  "/lessons/grace-in-the-kingdom",
  "/lessons/holy-spirit",
  "/lessons/how-to-pray",
  "/lessons/jesus-builds-his-church",
  "/lessons/jonah-big-fish",
  "/lessons/living-word",
  "/lessons/mustard-seed-faith",
  "/lessons/one-thing-you-lack",
  "/lessons/open-heart",
  "/lessons/paid-in-full",
  "/lessons/remember-the-giver",
  "/lessons/second-mile",
  "/lessons/transfiguration",
  "/lessons/who-am-i",
  "/lessons/who-is-jesus",
  "/lessons/whose-mark",
  "/lessons/why-did-jesus-come",
  "/lessons/words-and-deeds",
  "/memory",
  "/puzzles",
  "/quests",
  "/quests/armor-of-god",
  "/quests/courage-quest",
  "/quests/forest-of-lies",
  "/quests/forgiveness-bridge",
  "/quests/fruit-of-spirit",
  "/quests/good-samaritan",
  "/quests/lost-sheep",
  "/quests/storm-rescue",
  "/quests/wise-builder",
  "/quiz",
  "/rebus",
  "/stories",
  "/why"
] as const;

const hubs: Record<string, [string, string]> = {
  "/": [
    "Bible Learning for Kids",
    "Explore Bible stories, interactive lessons, games, quests, and Scripture memory in English and Russian with Junior Disciples."
  ],
  "/lessons": [
    "Bible Lessons for Kids",
    "Discover Jesus through interactive Bible lessons, Scripture activities, and printable booklets in English and Russian."
  ],
  "/stories": [
    "Bible Stories for Kids",
    "Read Bible stories with Scripture references, big truths, and questions to explore together in English and Russian."
  ],
  "/games": [
    "Bible Games for Kids",
    "Play Bible-inspired adventures and skill games with Scripture learning, touch controls, and keyboard play."
  ],
  "/quests": [
    "Interactive Bible Quests",
    "Step into Bible adventures, make choices, and discover Scripture truths about following Jesus."
  ],
  "/why": [
    "WHY?! — Explore Christian Faith",
    "Explore questions about God, Jesus, the Bible, and Christian faith through bilingual stories and hands-on discovery."
  ],
  "/quiz": [
    "Bible Quizzes for Kids",
    "Explore Bible story quizzes, check your understanding, and learn from helpful answer explanations."
  ],
  "/memory": [
    "Bible Verse Memory for Kids",
    "Practice remembering Bible verses with interactive Scripture activities in English and Russian."
  ],
  "/puzzles": [
    "Bible Word Search Puzzles",
    "Find Bible words in interactive word searches about Scripture, Bible people, and following Jesus."
  ],
  "/rebus": [
    "Bible Picture Puzzles",
    "Solve Bible-themed rebus puzzles using pictures, letters, and clues."
  ],
  "/explore": [
    "Explore Bible Activities",
    "Browse the Junior Disciples library of Bible stories, lessons, quests, games, quizzes, and puzzles."
  ],
  "/journey": [
    "The Disciple Journey",
    "Follow a guided path through Bible stories, Scripture, lessons, practice, and missions, one faithful step at a time."
  ]
};

export function publicPages(): { path: string; title: string; description: string; image?: string }[] {
  return [
    ...staticPublicPaths.map(path => {
      const lesson = lessonTopics.find(item => item.href === path);
      const label = path.split("/").pop()!.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
      const category = path.startsWith("/quests/") ? "Bible quest" : "Bible game";
      return { path, title: lesson?.title ?? hubs[path]?.[0] ?? label,
        description: lesson?.desc ?? hubs[path]?.[1] ?? `Explore ${label}, an interactive ${category} for kids on Junior Disciples.`, image: lesson?.image };
    }),
    ...stories.map(s => ({ path: `/stories/${s.id}`, title: s.title, description: `${s.reference} — ${s.bigTruth}`, image: s.image })),
    ...memoryVerses.map(v => ({ path: `/memory/${v.id}`, title: `${v.reference} — Verse Memory`, description: `Practice ${v.reference} with an interactive Bible memory activity about ${v.theme.toLowerCase()}.` })),
    ...wordPuzzles.map(v => ({ path: `/puzzles/${v.id}`, title: `${v.title} — Word Search`, description: v.description })),
    ...quizzes.map(v => ({ path: `/quiz/${v.id}`, title: v.title, description: `Try ${v.title} and explore the Bible story with questions and helpful answer explanations.` })),
    ...rebusPuzzles.map(v => ({ path: `/rebus/${v.id}`, title: v.title, description: `Solve ${v.title} with Bible-themed picture and letter clues on Junior Disciples.` })),
    ...getWhyLessons().map(v => ({ path: `/why/${String(v.id).padStart(2, "0")}`, title: `${v.title.en} — WHY?!`, description: `${v.subtitle.en}. Explore this question through an interactive bilingual Christian faith lesson.` })),
  ];
}

export function metadataForPath(path: string) {
  const page = publicPages().find(page => page.path === path);
  if (!page) return { robots: { index: false, follow: false } };
  return pageMetadata(path, page.title, page.description, page.image);
}
