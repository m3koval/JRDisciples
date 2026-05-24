import { rebusPuzzles } from "@/data/rebus";
import RebusCard from "@/components/RebusCard";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return rebusPuzzles.map((p) => ({ id: p.id }));
}

const BANNERS = ["sb-5","sb-2","sb-4","sb-3","sb-1","sb-6"];
const BGS     = ["alt-bg5","alt-bg2","alt-bg4","alt-bg6","alt-bg","alt-bg3"];

export default async function RebusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = rebusPuzzles.findIndex((p) => p.id === id);
  if (idx === -1) notFound();
  const puzzle = rebusPuzzles[idx];

  return (
    <>
      <div className={`sec-banner ${BANNERS[idx % BANNERS.length]}`}>🧩 {puzzle.title}</div>
      <section className={BGS[idx % BGS.length]}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "44px 18px 52px" }}>
          <Link href="/rebus" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#c05010", textDecoration: "none", fontSize: "0.88rem" }}>
            ← All Rebus Puzzles
          </Link>

          <div style={{ margin: "20px 0 28px" }}>
            <p className="eyebrow">Picture Clues</p>
            <h1 className="sec-title">{puzzle.title}</h1>
            <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.95rem", color: "#555", lineHeight: 1.6 }}>
              Add the picture clues together to find the hidden Bible word!
            </p>
          </div>

          <RebusCard puzzle={puzzle} />

          <div className="kid-note" style={{ marginTop: 24 }}>
            💬 After you solve it, ask a grown-up: What does this word mean in the Bible?
          </div>
        </div>
      </section>
    </>
  );
}
