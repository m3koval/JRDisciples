'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Shared "how well did they do it" tracker for lessons.
//
// Stars reward KNOWING, not clicking through. A kid who answers every quiz
// question correctly on the first try earns 3 stars. A kid who mashes buttons
// until something turns green earns 1. Pure exploration activities (flip
// cards, a prayer builder, the living-stones wall) have no right answer, so
// they never count against a kid — only activities with a real correct/
// incorrect signal (True/False, multiple choice, sorting into columns,
// matching) feed the score.
//
// Usage inside a lesson page:
//   import { recordGradedAnswer, markLessonComplete, useLessonStars } from '@/lib/lesson-mastery'
//   const LESSON_ID = 'coin-fish'           // match the lesson's own storage prefix
//
//   // Call once per graded question/item, the FIRST time it is answered:
//   recordGradedAnswer(LESSON_ID, wasCorrectOnFirstTry)
//
//   // Call once when the win screen appears:
//   markLessonComplete(LESSON_ID)
//
//   // On the /lessons index page:
//   const stars = useLessonStars(LESSON_ID)   // 0 | 1 | 2 | 3, reactive
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useSyncExternalStore } from 'react'

export type MasteryRecord = {
  firstTryCorrect: number
  totalGraded: number
  completed: boolean
  updatedAt: number
}

const KEY_PREFIX = 'jr-mastery:'
const EVENT_NAME = 'jr-mastery-change'
const volatileRecords = new Map<string, MasteryRecord>()

function keyFor(lessonId: string) {
  return `${KEY_PREFIX}${lessonId}`
}

function readRaw(lessonId: string): MasteryRecord | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(keyFor(lessonId))
    if (!raw) return volatileRecords.get(lessonId) ?? null
    const parsed = JSON.parse(raw)
    if (
      typeof parsed?.firstTryCorrect === 'number' &&
      typeof parsed?.totalGraded === 'number' &&
      typeof parsed?.completed === 'boolean'
    ) {
      const record = parsed as MasteryRecord
      volatileRecords.set(lessonId, record)
      return record
    }
  } catch {
    /* storage unavailable or corrupt — use the in-memory session record */
  }
  return volatileRecords.get(lessonId) ?? null
}

function writeRaw(lessonId: string, record: MasteryRecord) {
  if (typeof window === 'undefined') return
  volatileRecords.set(lessonId, record)
  try {
    localStorage.setItem(keyFor(lessonId), JSON.stringify(record))
  } catch {
    /* storage unavailable (private browsing, quota) — degrade silently */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { lessonId } }))
}

/**
 * Call once per graded question/item, the first time it is answered in a
 * session (do NOT call again if the kid retries the same question — only
 * the first attempt reflects whether they knew it or were guessing).
 */
export function recordGradedAnswer(lessonId: string, correctOnFirstTry: boolean) {
  const prev = readRaw(lessonId) ?? { firstTryCorrect: 0, totalGraded: 0, completed: false, updatedAt: 0 }
  writeRaw(lessonId, {
    firstTryCorrect: prev.firstTryCorrect + (correctOnFirstTry ? 1 : 0),
    totalGraded: prev.totalGraded + 1,
    completed: prev.completed,
    updatedAt: Date.now(),
  })
}

/** Call once when the lesson's win screen appears. */
export function markLessonComplete(lessonId: string) {
  const prev = readRaw(lessonId) ?? { firstTryCorrect: 0, totalGraded: 0, completed: false, updatedAt: 0 }
  if (prev.completed) return // idempotent — don't double count re-visits
  writeRaw(lessonId, { ...prev, completed: true, updatedAt: Date.now() })
}

/** Clears a lesson's mastery record — call alongside a lesson's own progress reset. */
export function resetLessonMastery(lessonId: string) {
  if (typeof window === 'undefined') return
  volatileRecords.delete(lessonId)
  try { localStorage.removeItem(keyFor(lessonId)) } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { lessonId } }))
}

/** Pure function: turn a mastery record into a 0–3 star rating. */
export function starsFromRecord(record: MasteryRecord | null): 0 | 1 | 2 | 3 {
  if (!record || !record.completed) return 0
  if (record.totalGraded === 0) return 3 // pure exploration lesson — completion is full marks
  const pct = record.firstTryCorrect / record.totalGraded
  if (pct >= 0.9) return 3
  if (pct >= 0.6) return 2
  return 1
}

export function getLessonStars(lessonId: string): 0 | 1 | 2 | 3 {
  return starsFromRecord(readRaw(lessonId))
}

/** Reactive hook for displaying stars — updates live if the record changes (e.g. another tab). */
export function useLessonStars(lessonId: string): 0 | 1 | 2 | 3 {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { lessonId?: string } | undefined
      if (!detail || detail.lessonId === lessonId) onStoreChange()
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === keyFor(lessonId)) {
        if (e.newValue === null) volatileRecords.delete(lessonId)
        onStoreChange()
      }
    }
    window.addEventListener(EVENT_NAME, onChange)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(EVENT_NAME, onChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [lessonId])

  const getSnapshot = useCallback(() => getLessonStars(lessonId), [lessonId])
  const getServerSnapshot = useCallback((): 0 => 0, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
