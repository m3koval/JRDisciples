'use client'

import { useSyncExternalStore } from 'react'
import { lessonTopics } from '@/data/lessons'
import { getLessonStars } from '@/lib/lesson-mastery'
import { lessonMasteryId } from '@/lib/lesson-mastery-registry'

const LAST_LESSON_KEY = 'jr-app:last-lesson'
const APP_PROGRESS_EVENT = 'jr-app-progress-change'

function safeLastLesson(): string {
  if (typeof window === 'undefined') return lessonTopics[0].href
  try {
    const stored = localStorage.getItem(LAST_LESSON_KEY)
    return lessonTopics.some((topic) => topic.href === stored) ? stored! : lessonTopics[0].href
  } catch {
    return lessonTopics[0].href
  }
}

export function rememberLesson(pathname: string) {
  if (!lessonTopics.some((topic) => topic.href === pathname)) return
  try { localStorage.setItem(LAST_LESSON_KEY, pathname) } catch { /* keep the app usable without storage */ }
  window.dispatchEvent(new Event(APP_PROGRESS_EVENT))
}

export type AppLessonProgress = {
  lastLesson: string
  completedLessons: number
  totalStars: number
  starsByHref: Record<string, number>
}

function progressSnapshot(): string {
  const stars = lessonTopics.map((topic) => getLessonStars(lessonMasteryId(topic.href)))
  return JSON.stringify({
    lastLesson: safeLastLesson(),
    stars,
  })
}

function serverSnapshot(): string {
  return JSON.stringify({ lastLesson: lessonTopics[0].href, stars: lessonTopics.map(() => 0) })
}

function subscribe(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === LAST_LESSON_KEY || event.key?.startsWith('jr-mastery:')) onStoreChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener('jr-mastery-change', onStoreChange)
  window.addEventListener(APP_PROGRESS_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('jr-mastery-change', onStoreChange)
    window.removeEventListener(APP_PROGRESS_EVENT, onStoreChange)
  }
}

export function useAppLessonProgress(): AppLessonProgress {
  const serialized = useSyncExternalStore(subscribe, progressSnapshot, serverSnapshot)
  const parsed = JSON.parse(serialized) as { lastLesson: string; stars: number[] }
  const starsByHref = Object.fromEntries(lessonTopics.map((topic, index) => [topic.href, parsed.stars[index] ?? 0]))
  return {
    lastLesson: parsed.lastLesson,
    completedLessons: parsed.stars.filter((stars) => stars > 0).length,
    totalStars: parsed.stars.reduce((sum, stars) => sum + stars, 0),
    starsByHref,
  }
}
