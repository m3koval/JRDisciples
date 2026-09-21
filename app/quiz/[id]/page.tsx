import { quizzes } from "@/data/quizzes";
import QuizClient from "./QuizClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return quizzes.map((item) => ({ id: item.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuizClient id={id} />;
}
