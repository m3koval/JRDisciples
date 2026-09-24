'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './page.module.css'

const copy = {
  en: {
    eyebrow: 'Optional library', title: 'Explore everything', intro: 'Browse freely without changing your guided Journey progress.',
    items: [
      ['/stories', 'Stories', 'Read Bible stories'], ['/lessons', 'Lessons', 'Explore every lesson'], ['/quests', 'Quests', 'Choose an adventure'],
      ['/games', 'Games', 'Play Bible games'], ['/quiz', 'Quizzes', 'Check what you know'], ['/memory', 'Scripture', 'Practice memory verses'],
      ['/puzzles', 'Word Searches', 'Find Bible words'], ['/rebus', 'Rebus Puzzles', 'Solve picture clues'],
    ],
  },
  ru: {
    eyebrow: 'Дополнительная библиотека', title: 'Исследуй всё', intro: 'Выбирай свободно, не изменяя прогресс основного Пути.',
    items: [
      ['/stories', 'Истории', 'Читай библейские истории'], ['/lessons', 'Уроки', 'Открой все уроки'], ['/quests', 'Квесты', 'Выбери приключение'],
      ['/games', 'Игры', 'Играй в библейские игры'], ['/quiz', 'Викторины', 'Проверь знания'], ['/memory', 'Писание', 'Учи стихи на память'],
      ['/puzzles', 'Поиск слов', 'Найди библейские слова'], ['/rebus', 'Ребусы', 'Разгадай картинки'],
    ],
  },
} as const

export default function ExplorePage() {
  const { language } = useLanguage()
  const text = copy[language]
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>{text.eyebrow}</p>
      <h1>{text.title}</h1>
      <p className={styles.intro}>{text.intro}</p>
      <section className={styles.grid}>
        {text.items.map(([href, title, desc], index) => (
          <Link key={href} href={href} className={styles.card}>
            <span aria-hidden="true">{['◇','▤','✦','▶','✓','⌁','⌕','◈'][index]}</span>
            <span><strong>{title}</strong><small>{desc}</small></span>
            <em aria-hidden="true">›</em>
          </Link>
        ))}
      </section>
    </main>
  )
}
