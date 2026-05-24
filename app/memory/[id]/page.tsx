import { memoryVerses } from "@/data/memory-verses";
import MemoryChallenge from "@/components/MemoryChallenge";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return memoryVerses.map((v) => ({ id: v.id }));
}

export default async function MemoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verse = memoryVerses.find((v) => v.id === id);
  if (!verse) notFound();

  return (
    <>
      <div className="sec-banner sb-4">💡 Verse Memory</div>
      <section className="alt-bg4">
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "44px 18px 52px" }}>
          <Link href="/memory" style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, color: "#2a6a10", textDecoration: "none", fontSize: "0.88rem" }}>
            ← All Verses
          </Link>

          <div style={{ margin: "20px 0 28px" }}>
            <div style={{ fontSize: "3rem", marginBottom: 8 }}>{verse.emoji}</div>
            <p className="eyebrow">{verse.theme}</p>
            <h1 className="sec-title">{verse.reference}</h1>
          </div>

          <MemoryChallenge verse={verse} />

          <div className="kid-note" style={{ marginTop: 24 }}>
            💬 Ask a grown-up: How does this verse apply to your life this week?
          </div>
        </div>
      </section>
    </>
  );
}
