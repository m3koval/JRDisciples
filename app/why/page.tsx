import { metadataForPath } from "@/lib/seo-pages";
import { getWhyLessons } from "@/data/why";
import WhyHub from "@/components/why/WhyHub";
export const metadata = metadataForPath("/why");
export default function WhyPage() {
  const lessons = getWhyLessons().map(({ id, chapter, kind, title, subtitle }) => ({ id, chapter, kind, title, subtitle }));
  return <WhyHub lessons={lessons} />;
}
