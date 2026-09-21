'use client'

import { useSyncExternalStore } from 'react'
import { allJourneySteps, journeyUnits, type JourneyStep } from '@/data/journey'
import { getLessonStars } from '@/lib/lesson-mastery'
import { lessonMasteryId } from '@/lib/lesson-mastery-registry'

const STORAGE_KEY = 'jr-journey:completed-v1'
const EVENT_NAME = 'jr-journey-change'
let volatileCompleted = new Set<string>()

function readCompleted(): Set<string> {
  if (typeof window === 'undefined') return volatileCompleted
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) volatileCompleted = new Set(JSON.parse(raw) as string[])
  } catch { /* preserve in-memory progress */ }
  return volatileCompleted
}

function lessonCompleted(step: JourneyStep): boolean {
  return step.kind === 'lesson' && getLessonStars(lessonMasteryId(step.href)) > 0
}

export function isJourneyStepComplete(step: JourneyStep): boolean {
  return lessonCompleted(step) || readCompleted().has(step.id)
}

export function completeJourneyStep(stepId: string) {
  if (typeof window === 'undefined') return
  volatileCompleted = new Set(readCompleted()).add(stepId)
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...volatileCompleted])) } catch { /* session progress remains usable */ }
  window.dispatchEvent(new Event(EVENT_NAME))
}

export function completeJourneyRoute(href: string) {
  const step = allJourneySteps.find((candidate) => candidate.href === href)
  if (step) completeJourneyStep(step.id)
}

function snapshot(): string {
  const explicit = readCompleted()
  const completedIds = allJourneySteps.filter((step) => explicit.has(step.id) || lessonCompleted(step)).map((step) => step.id)
  return JSON.stringify(completedIds)
}

function serverSnapshot(): string { return '[]' }

function subscribe(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key?.startsWith('jr-mastery:')) onStoreChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(EVENT_NAME, onStoreChange)
  window.addEventListener('jr-mastery-change', onStoreChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(EVENT_NAME, onStoreChange)
    window.removeEventListener('jr-mastery-change', onStoreChange)
  }
}

export type JourneyProgress = {
  completedIds: Set<string>
  completedRequired: number
  totalRequired: number
  currentUnitIndex: number
  nextStep: (typeof allJourneySteps)[number] | null
  unitProgress: Array<{ completed: number; total: number; unlocked: boolean; complete: boolean }>
}

export function useJourneyProgress(): JourneyProgress {
  const serialized = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const completedIds = new Set(JSON.parse(serialized) as string[])
  const complete = (step: JourneyStep) => completedIds.has(step.id)
  const required = allJourneySteps.filter((step) => step.required !== false)
  const unitProgress = journeyUnits.map((unit, unitIndex) => {
    const requiredSteps = unit.steps.filter((step) => step.required !== false)
    const completed = requiredSteps.filter(complete).length
    const priorComplete = journeyUnits.slice(0, unitIndex).every((prior) => prior.steps.filter((step) => step.required !== false).every(complete))
    return { completed, total: requiredSteps.length, unlocked: unitIndex === 0 || priorComplete, complete: completed === requiredSteps.length }
  })
  const activeUnitIndex = unitProgress.findIndex((unit) => unit.unlocked && !unit.complete)
  const currentUnitIndex = activeUnitIndex >= 0 ? activeUnitIndex : journeyUnits.length - 1
  const nextStep = allJourneySteps.find((step) => step.required !== false && unitProgress[step.unitIndex].unlocked && !complete(step)) ?? null
  return {
    completedIds,
    completedRequired: required.filter(complete).length,
    totalRequired: required.length,
    currentUnitIndex,
    nextStep,
    unitProgress,
  }
}
