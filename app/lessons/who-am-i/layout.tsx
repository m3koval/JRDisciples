import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Who am I? | Junior Disciples',
  description: 'An interactive English and Russian Bible lesson about belonging to Jesus, with 1 Peter 2:9–10 and a printable activity booklet.',
  alternates: { canonical: 'https://www.juniordisciples.com/lessons/who-am-i' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
