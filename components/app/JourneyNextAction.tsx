'use client'

import Link from 'next/link'
import { useEffect, useSyncExternalStore } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { allJourneySteps } from '@/data/journey'
import { completeJourneyRoute } from '@/lib/journey-progress'

export function JourneyNextAction({ currentHref, autoComplete = false }: { currentHref: string; autoComplete?: boolean }) {
  const { language } = useLanguage()
  const isGuidedJourney = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get('journey') === '1',
    () => false,
  )
  const currentIndex = allJourneySteps.findIndex((step) => step.href === currentHref)
  const current = allJourneySteps[currentIndex]
  const next = allJourneySteps.slice(currentIndex + 1).find((step) => step.required !== false)


  useEffect(() => {
    if (autoComplete && current && isGuidedJourney) completeJourneyRoute(currentHref)
  }, [autoComplete, current, currentHref, isGuidedJourney])

  if (process.env.NEXT_PUBLIC_APP_SHELL !== '1' || !current || !isGuidedJourney) return null

  return (
    <Link
      href={next ? `${next.href}?journey=1` : '/progress'}
      onClick={() => completeJourneyRoute(currentHref)}
      style={{
        minHeight: 54, padding: '0 24px', borderRadius: 16,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: '#0b5f75', color: '#fff', textDecoration: 'none',
        fontFamily: 'var(--font-nunito)', fontWeight: 1000,
        boxShadow: '0 12px 26px rgba(11,95,117,.24)',
      }}
    >
      {next
        ? (language === 'ru' ? `Следующий шаг: ${next.title.ru} →` : `Next step: ${next.title.en} →`)
        : (language === 'ru' ? 'Посмотреть весь прогресс →' : 'See your full progress →')}
    </Link>
  )
}
