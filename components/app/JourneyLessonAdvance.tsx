'use client'

import { allJourneySteps } from '@/data/journey'
import { useJourneyProgress } from '@/lib/journey-progress'
import { JourneyNextAction } from './JourneyNextAction'
import styles from './JourneyLessonAdvance.module.css'

export function JourneyLessonAdvance({ pathname }: { pathname: string }) {
  const progress = useJourneyProgress()
  const step = allJourneySteps.find((candidate) => candidate.href === pathname)
  if (!step || step.kind !== 'lesson' || !progress.completedIds.has(step.id)) return null
  return <div className={styles.advance}><JourneyNextAction currentHref={pathname} /></div>
}
