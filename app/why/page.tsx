import type { Metadata } from "next";
import { getWhyLessons } from "@/data/why";
import WhyHub from "@/components/why/WhyHub";
export const metadata: Metadata = { title: "WHY?! · Junior Disciples", description: "Big questions. Real discoveries. Explore what Christians believe and why, in a bilingual Bible adventure." };
export default function WhyPage() {
  const lessons = getWhyLessons().map(({ id, chapter, kind, title, subtitle }) => ({ id, chapter, kind, title, subtitle }));
  return <WhyHub lessons={lessons} />;
}
