import { rebusPuzzles } from "@/data/rebus";
import { rebusRu } from "@/data/rebus-ru";
import RebusClient from "./RebusClient";

export async function generateStaticParams() {
  const ids = new Set([...rebusPuzzles, ...rebusRu].map((p) => p.id));
  return [...ids].map((id) => ({ id }));
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RebusClient id={id} />;
}
