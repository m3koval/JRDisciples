import { pageMetadata } from "@/lib/seo";
import type {Metadata} from 'next';
export const metadata: Metadata = pageMetadata("/lessons/words-and-deeds", "More than words · Не только говорить — делать", "Discover Matthew 23:1–12 through a bilingual story, counting, Bible discovery, hidden objects, and loving action. Includes the approved printable booklet.");

export default function Layout({children}:{children:React.ReactNode}){return children;}
