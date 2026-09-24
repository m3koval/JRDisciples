import { quizzes } from "@/data/quizzes";
import { quizzesRu } from "@/data/quizzes-ru";
import QuizClient from "./QuizClient";

export async function generateStaticParams() {
  const ids = new Set([...quizzes, ...quizzesRu].map((q) => q.id));
  return [...ids].map((id) => ({ id }));
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuizClient id={id} />;
}