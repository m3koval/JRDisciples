import { notFound } from "next/navigation";
import { getWhyLessons } from "@/data/why";
import LessonPlayer from "@/components/why/LessonPlayer";
export const dynamicParams = false;
export function generateStaticParams() { return getWhyLessons().map(l => ({ slug: String(l.id).padStart(2, "0") })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getWhyLessons().find(l => String(l.id).padStart(2, "0") === slug);
  return { title: lesson ? `${lesson.title.en} · WHY?!` : "WHY?!" };
}
export default async function WhyLesson({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lessons = getWhyLessons();
  const index = lessons.findIndex(l => String(l.id).padStart(2, "0") === slug);
  if (index < 0) notFound();
  const next = lessons[index + 1];
  return <LessonPlayer key={lessons[index].id} lesson={lessons[index]} next={next ? { id: next.id, title: next.title } : undefined} />;
}
