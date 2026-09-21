'use client'

import { useLessonStars } from '@/lib/lesson-mastery'

/**
 * A row of 1–3 stars showing how well a kid did on a lesson, not just
 * whether they finished it. Renders nothing until the lesson has a
 * mastery record (i.e. not started yet) unless `showEmpty` is set.
 */
export function LessonStars({
  lessonId,
  showEmpty = false,
  size = '1.1rem',
}: {
  lessonId: string
  showEmpty?: boolean
  size?: string
}) {
  const stars = useLessonStars(lessonId)
  if (stars === 0 && !showEmpty) return null

  return (
    <div
      aria-label={`${stars} of 3 stars`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 2,
        padding: '4px 10px', borderRadius: 999,
        background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(2px)',
        border: '1.5px solid rgba(255,255,255,.25)',
      }}
    >
      {[1, 2, 3].map(i => (
        <span key={i} style={{ fontSize: size, lineHeight: 1, filter: i <= stars ? 'none' : 'grayscale(1) opacity(.35)' }}>
          ⭐
        </span>
      ))}
    </div>
  )
}
