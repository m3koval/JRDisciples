import { rebusPuzzles } from "@/data/rebus";
import RebusClient from "./RebusClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return rebusPuzzles.map((item) => ({ id: item.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RebusClient id={id} />;
}
