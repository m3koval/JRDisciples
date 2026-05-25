export interface LessonTopic {
  href: string;
  image: string;
  title: string;
  desc: string;
  color: string;
  sections: number;
  emoji: string;
}

export const lessonTopics: LessonTopic[] = [
  {
    href: "/lessons/holy-spirit",
    image: "/images/jr/topic-holy-spirit.png",
    title: "The Holy Spirit",
    desc: "Who is He? His symbols, roles, fruit, gifts, and how to live with Him — 7 sections with interactive challenges!",
    color: "#0d3a6a",
    sections: 7,
    emoji: "🕊️",
  },
];
