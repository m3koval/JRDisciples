import type {Metadata} from 'next';
export const metadata:Metadata={
 title:'More than words · Не только говорить — делать | Junior Disciples',
 description:'Discover Matthew 23:1–12 through a bilingual story, counting, Bible discovery, hidden objects, and loving action. Includes the approved printable booklet.',
 alternates:{canonical:'https://www.juniordisciples.com/lessons/words-and-deeds'},
};
export default function Layout({children}:{children:React.ReactNode}){return children;}
