import HomePage from "./HomePage";
import { metadataForPath } from "@/lib/seo-pages";
export const metadata = metadataForPath("/");
export default function Page() { return <HomePage />; }
