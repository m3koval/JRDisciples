'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export type QuestChoice = { label: string; good: boolean; response: string }

export type QuestScene = {
  id: string
  place: string
  title: string
  body: string
  caption: string
  danger: string
  echo: string
  thought: string
  echoSlot?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  thoughtSlot?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  prompt: string
  choices: QuestChoice[]
  truth: string
  verse: string
  alt: string
}

export type QuestUi = {
  quest: string
  title: string
  subtitle: string
  start: string
  chooseStep: string
  continue: string
  tryAgain: string
  truthLight: string
  completed: string
  badge: string
  badgeLine: string
  bigTruth: string
  parent: string
  questions: string[]
  prayer: string
  replay: string
  back: string
  correct: string
  almost: string
  verses: string
  mission: string
  scene: string
  of: string
  path: string
  finalVerse: string
  finish: string
}

type QuestAdventureProps = {
  scenesByLanguage: Record<'en' | 'ru', QuestScene[]>
  uiByLanguage: Record<'en' | 'ru', QuestUi>
  images: Record<string, string> & { cover: string; badge: string }
}

export function QuestAdventure({ scenesByLanguage, uiByLanguage, images }: QuestAdventureProps) {
  const { language } = useLanguage()
  const lang = language === 'ru' ? 'ru' : 'en'
  const scenes = scenesByLanguage[lang]
  const t = uiByLanguage[lang]
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [solved, setSolved] = useState<boolean[]>(() => scenes.map(() => false))
  const [finished, setFinished] = useState(false)
  const [phase, setPhase] = useState<'story' | 'choice' | 'result'>('story')
  const feedbackRef = useRef<HTMLDivElement | null>(null)

  const scene = scenes[index]
  const lights = solved.filter(Boolean).length
  const progress = useMemo(() => Math.round((lights / scenes.length) * 100), [lights, scenes.length])
  const choiceOrder = useMemo(() => {
    const ordered = scene.choices.map((choice, originalIndex) => ({ choice, originalIndex }))
    let seed = `${lang}-${scene.id}`.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
    for (let i = ordered.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280
      const j = seed % (i + 1)
      ;[ordered[i], ordered[j]] = [ordered[j], ordered[i]]
    }
    if (ordered[0]?.choice.good && ordered.length > 1) {
      ordered.push(ordered.shift()!)
    }
    return ordered
  }, [lang, scene.id, scene.choices])
  const chosen = selected !== null ? scene.choices[selected] : null
  const isGameplay = started && !finished

  useEffect(() => {
    if (!isGameplay) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isGameplay])

  useEffect(() => {
    if (selected !== null) {
      window.requestAnimationFrame(() => {
        feedbackRef.current?.focus({ preventScroll: true })
      })
    }
  }, [selected])

  function choose(choiceIndex: number) {
    setSelected(choiceIndex)
    setPhase('result')
    if (scene.choices[choiceIndex].good) {
      setSolved(prev => prev.map((v, i) => i === index ? true : v))
    }
  }

  function next() {
    setSelected(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (index === scenes.length - 1) {
      setFinished(true)
      return
    }
    setIndex(i => Math.min(i + 1, scenes.length - 1))
    setPhase('story')
  }

  function replay() {
    setStarted(false)
    setFinished(false)
    setIndex(0)
    setSelected(null)
    setPhase('story')
    setSolved(scenes.map(() => false))
  }

  return (
    <main className={`courage-page ${isGameplay ? 'playing' : ''}`}>
      <style>{`
        .courage-page { min-height: 100vh; background: radial-gradient(circle at top,#152a5c,#081428 56%,#050914); color: #fff; overflow: hidden; }
        .courage-page.playing { position: fixed; inset: 0; z-index: 1000; width: 100vw; height: 100dvh; min-height: 0; overflow: hidden; }
        .courage-shell { max-width: 1160px; margin: 0 auto; padding: 24px 18px 60px; }
        .playing .courage-shell { max-width: none; height: 100%; padding: 10px; display: flex; flex-direction: column; }
        .quest-back { display: inline-flex; align-items: center; color: #ffd866; font-family: var(--font-nunito); font-weight: 1000; text-decoration: none; margin-bottom: 18px; }
        .playing .quest-back { position: absolute; left: 18px; top: 14px; z-index: 5; min-height: 36px; margin: 0; padding: 0 12px; border-radius: 999px; background: rgba(5,9,20,.7); border: 1px solid rgba(255,216,102,.45); backdrop-filter: blur(8px); }
        .adventure-frame { position: relative; border-radius: 36px; overflow: hidden; min-height: 680px; box-shadow: 0 32px 100px rgba(0,0,0,.42); border: 4px solid rgba(255,216,102,.72); isolation: isolate; background: #0d1f3c; }
        .playing .adventure-frame { flex: 1; min-height: 0; height: 100%; border-radius: 28px; }
        .adventure-frame::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(180deg,rgba(8,20,40,.24),rgba(8,20,40,.88)), var(--frame-image); background-size: cover; background-position: center; transform: scale(1.03); animation: cinematicDrift 16s ease-in-out infinite alternate; z-index: -3; }
        .adventure-frame::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 48% 42%,rgba(255,216,102,.24),transparent 28%), linear-gradient(90deg,rgba(8,20,40,.84),rgba(8,20,40,.16) 50%,rgba(8,20,40,.78)); z-index: -2; }
        .truth-particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: -1; }
        .truth-particles span { position: absolute; width: 10px; height: 10px; border-radius: 999px; background: radial-gradient(circle,#fff8bd 0 22%,#fbbf24 46%,transparent 74%); box-shadow: 0 0 22px rgba(251,191,36,.9),0 0 46px rgba(251,191,36,.35); animation: particleRise var(--speed,8s) ease-in-out infinite; animation-delay: var(--delay,0s); opacity: .8; }
        .truth-particles span:nth-child(1) { left: 9%; top: 74%; --speed: 8s; --delay: -1s; }
        .truth-particles span:nth-child(2) { left: 26%; top: 28%; --speed: 7s; --delay: -3s; width: 7px; height: 7px; }
        .truth-particles span:nth-child(3) { left: 48%; top: 80%; --speed: 9s; --delay: -2s; }
        .truth-particles span:nth-child(4) { left: 73%; top: 28%; --speed: 7.5s; --delay: -4s; width: 8px; height: 8px; }
        .truth-particles span:nth-child(5) { left: 88%; top: 68%; --speed: 8.5s; --delay: -5s; }
        .hero-content { width: min(650px,100%); padding: clamp(18px,4vw,40px); padding-top: 18px; min-height: 520px; display: flex; align-items: flex-start; }
        .story-card { position: relative; background: rgba(255,255,255,.94); color: var(--text); border-radius: 32px; padding: clamp(18px,3vw,30px); border: 3px solid rgba(255,216,102,.86); box-shadow: 0 22px 70px rgba(0,0,0,.28); backdrop-filter: blur(12px); }
        .quest-kicker { font-family: var(--font-nunito); color: #4f46e5; font-size: .72rem; letter-spacing: 3px; text-transform: uppercase; font-weight: 1000; margin-bottom: 6px; }
        .quest-title { font-family: var(--font-cinzel); color: var(--deep); font-size: clamp(2rem,6vw,3.7rem); line-height: .98; margin: 0 0 10px; }
        .quest-subtitle { font-family: var(--font-lora); color: #374151; font-weight: 700; line-height: 1.55; font-size: 1rem; margin-bottom: 12px; }
        .verse-strip { border-radius: 18px; background: #fff7ed; border: 2px solid #fed7aa; padding: 11px 13px; color: #7c2d12; font-family: var(--font-nunito); font-weight: 900; margin: 12px 0; }
        .quest-button { display: inline-flex; width: fit-content; min-height: 54px; align-items: center; justify-content: center; border: none; border-radius: 999px; padding: 0 26px; background: linear-gradient(180deg,#6366f1,#4338ca); color: #fff; font-family: var(--font-nunito); font-weight: 1000; cursor: pointer; box-shadow: 0 14px 28px rgba(79,70,229,.28); transition: transform .18s, filter .18s; }
        .quest-button:hover { transform: translateY(-1px); filter: brightness(1.08); }
        .quest-button.green { background: linear-gradient(180deg,#22c55e,#15803d); }
        .quest-stage { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(360px,.95fr); gap: 24px; align-items: stretch; padding: clamp(16px,3vw,28px); }
        .playing .quest-stage { height: 100%; min-height: 0; padding: 46px 16px 16px; gap: 16px; grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
        .quest-visual { min-height: 0; display: flex; flex-direction: column; }
        .scene-media { position: relative; border-radius: 30px; overflow: hidden; min-height: 610px; border: 3px solid rgba(255,255,255,.22); background: #0d1f3c; box-shadow: 0 24px 70px rgba(0,0,0,.32); }
        .playing .scene-media { flex: 1; min-height: 0; height: auto; }
        .scene-media img { position: relative; z-index: 0; width: 100%; height: 100%; object-fit: cover; display: block; animation: imageBreathe 10s ease-in-out infinite alternate; }
        .scene-media::after { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg,rgba(8,20,40,.08),rgba(8,20,40,.18)); pointer-events: none; }
        .comic-bubbles { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .comic-bubble { position: absolute; max-width: min(250px,34%); padding: 10px 12px; color: var(--deep); font-family: var(--font-nunito); font-weight: 1000; line-height: 1.22; text-wrap: balance; filter: drop-shadow(0 10px 18px rgba(0,0,0,.26)); }
        .comic-bubble span { display: block; font-size: .66rem; letter-spacing: 1.4px; text-transform: uppercase; margin-bottom: 4px; opacity: .8; }
        .comic-bubble.speech { background: #fff; border: 3px solid #111827; border-radius: 22px 24px 24px 18px; }
        .comic-bubble.speech::after { content: ''; position: absolute; left: 28px; bottom: -18px; width: 28px; height: 22px; background: #fff; border-right: 3px solid #111827; border-bottom: 3px solid #111827; transform: skew(-24deg) rotate(8deg); border-bottom-right-radius: 18px; }
        .comic-bubble.thought { background: #fffaf0; border: 3px solid #f59e0b; border-radius: 999px; padding: 16px 20px; }
        .comic-bubble.thought::before,.comic-bubble.thought::after { content: ''; position: absolute; border-radius: 999px; background: #fffaf0; border: 3px solid #f59e0b; }
        .comic-bubble.thought::before { width: 18px; height: 18px; right: 28px; bottom: -19px; }
        .comic-bubble.thought::after { width: 10px; height: 10px; right: 12px; bottom: -34px; }
        .comic-bubble.whisper { background: rgba(17,24,39,.9); color: #fff7d6; border: 3px dashed #fbbf24; border-radius: 24px; font-style: italic; }
        .comic-bubble.truth { background: linear-gradient(180deg,#fff7ad,#fbbf24); border: 3px solid #92400e; border-radius: 24px; color: #3b2307; }
        .comic-bubble.top-left { left: 18px; top: 18px; }
        .comic-bubble.top-right { right: 18px; top: 24px; }
        .comic-bubble.bottom-left { left: 18px; bottom: 24px; }
        .comic-bubble.bottom-right { right: 18px; bottom: 24px; }
        .comic-bubble.mid-left { left: 22px; top: 38%; }
        .game-caption { position: absolute; left: 18px; right: 18px; bottom: 18px; z-index: 3; border-radius: 20px; padding: 14px 16px; background: linear-gradient(180deg,rgba(5,9,20,.88),rgba(8,20,40,.96)); border: 2px solid rgba(255,216,102,.9); color: #fff7d6; font-family: var(--font-lora); font-weight: 800; line-height: 1.5; box-shadow: 0 16px 42px rgba(0,0,0,.38); }
        .game-caption strong { display: block; color: #ffd866; font-family: var(--font-nunito); font-size: .72rem; letter-spacing: 1.6px; text-transform: uppercase; margin-bottom: 4px; }
        .scene-card { background: rgba(255,255,255,.96); color: var(--text); border-radius: 30px; padding: clamp(20px,3vw,32px); border: 3px solid rgba(255,216,102,.82); box-shadow: 0 24px 70px rgba(0,0,0,.28); align-self: start; }
        .playing .scene-card { align-self: stretch; min-height: 0; height: 100%; display: flex; flex-direction: column; overflow: hidden; padding: clamp(14px,2vw,22px); }
        .game-caption-card { border-radius: 22px; padding: 14px 16px; margin-bottom: 14px; background: linear-gradient(180deg,#111827,#0d1f3c); border: 3px solid #ffd866; color: #fff7d6; font-family: var(--font-lora); font-weight: 800; line-height: 1.5; box-shadow: inset 0 0 0 2px rgba(255,255,255,.08),0 12px 26px rgba(13,31,60,.16); }
        .playing .game-caption-card { padding: 10px 12px; margin-bottom: 10px; border-width: 2px; line-height: 1.35; font-size: .9rem; }
        .game-caption-card strong { display: block; color: #ffd866; font-family: var(--font-nunito); font-size: .72rem; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px; }
        .game-caption-card p { margin: 0; }
        .choice-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 10px; }
        .choice-letter { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; margin-right: 10px; border-radius: 999px; background: #4338ca; color: #fff; font-size: .85rem; box-shadow: inset 0 -2px 0 rgba(0,0,0,.18); }
        .progress-label { display: flex; justify-content: space-between; gap: 16px; color: #fff7d6; font-family: var(--font-nunito); font-weight: 1000; text-transform: uppercase; letter-spacing: 1.4px; font-size: .78rem; margin-bottom: 10px; }
        .playing .progress-label { margin: 0 0 6px; padding-left: 108px; font-size: .72rem; }
        .progress-track { height: 14px; border-radius: 999px; background: rgba(255,255,255,.2); overflow: hidden; margin-bottom: 12px; }
        .playing .progress-track { height: 10px; margin-bottom: 8px; }
        .progress-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#fbbf24,#fef08a); transition: width .35s ease; }
        .truth-map { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin-bottom: 18px; }
        .playing .truth-map { gap: 6px; margin-bottom: 8px; }
        .truth-node { min-height: 34px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; background: rgba(255,255,255,.15); color: rgba(255,247,214,.72); border: 2px solid rgba(255,255,255,.18); font-family: var(--font-nunito); font-weight: 1000; font-size: .78rem; box-shadow: inset 0 0 18px rgba(255,255,255,.05); }
        .truth-node.current { background: rgba(126,200,227,.22); color: #fff; border-color: rgba(126,200,227,.78); }
        .truth-node.lit { background: linear-gradient(180deg,#fff7ad,#fbbf24); color: #3b2307; border-color: #f59e0b; box-shadow: 0 0 22px rgba(251,191,36,.5); }
        .truth-node span { font-size: 1rem; line-height: 1; }
        .scene-title { font-family: var(--font-cinzel); color: var(--deep); font-size: clamp(1.75rem,5vw,3rem); line-height: 1.05; margin: 0 0 12px; }
        .playing .scene-title { font-size: clamp(1.45rem,3.6vw,2.45rem); margin-bottom: 8px; }
        .scene-body { font-family: var(--font-lora); color: #374151; font-weight: 700; font-size: 1.03rem; line-height: 1.75; }
        .playing .scene-body { font-size: clamp(.86rem,1.25vw,.98rem); line-height: 1.48; margin: 0 0 10px; }
        .echo-box { margin: 18px 0; border-radius: 18px; padding: 15px 16px; color: #fff7d6; background: linear-gradient(135deg,#111827,#1f2937); border-left: 6px solid #fbbf24; font-family: var(--font-nunito); font-weight: 1000; line-height: 1.55; }
        .playing .echo-box { margin: 8px 0 10px; padding: 10px 12px; font-size: .9rem; line-height: 1.35; }
        .prompt { font-family: var(--font-nunito); color: var(--deep); font-size: 1.12rem; font-weight: 1000; margin: 16px 0 10px; }
        .playing .prompt { margin: 8px 0; font-size: 1rem; }
        .choice { width: 100%; min-height: 56px; text-align: left; border: 2px solid #e5e7eb; background: #fff; color: var(--text); border-radius: 18px; padding: 15px 16px; margin: 0; font-family: var(--font-nunito); font-weight: 1000; cursor: pointer; line-height: 1.35; transition: transform .15s, border-color .15s, background .15s, box-shadow .15s; display: flex; align-items: center; }
        .playing .choice { min-height: 46px; padding: 10px 12px; font-size: .9rem; line-height: 1.24; border-radius: 15px; }
        .choice:hover { transform: translateY(-1px); border-color: #7ec8e3; background: #f0f9ff; box-shadow: 0 10px 22px rgba(13,31,60,.08); }
        .choice.good { border-color: #16a34a; background: #ecfdf5; }
        .choice.bad { border-color: #dc2626; background: #fff1f2; }
        .truth-panel { border-radius: 22px; padding: 16px; margin-top: 16px; background: linear-gradient(135deg,#fff7ed,#fffbeb); border: 2px solid #fed7aa; color: #7c2d12; font-family: var(--font-nunito); font-weight: 900; line-height: 1.55; }
        .playing .truth-panel { margin-top: 10px; padding: 12px; font-size: .88rem; line-height: 1.35; outline: none; }
        .playing .truth-panel p { margin-bottom: 0; }
        .playing .truth-panel .quest-button { min-height: 44px; margin-top: 8px; }
        .badge-card { max-width: 860px; margin: clamp(18px,4vw,44px) auto; background: rgba(255,255,255,.96); color: var(--text); border-radius: 34px; padding: clamp(22px,5vw,44px); text-align: center; border: 4px solid #f0c040; box-shadow: 0 30px 90px rgba(0,0,0,.36); }
        .badge-image { width: min(430px,100%); border-radius: 30px; border: 4px solid #f0c040; box-shadow: 0 22px 54px rgba(79,70,229,.22); margin: 0 auto 22px; display: block; }
        .parent-box { text-align: left; max-width: 720px; margin: 22px auto; background: #fff; border-radius: 24px; padding: 22px; border: 2px solid #e5e7eb; }
        .parent-box h2 { font-family: var(--font-nunito); font-weight: 1000; color: var(--deep); margin-bottom: 8px; }
        .parent-box ol { font-family: var(--font-lora); color: #374151; line-height: 1.8; padding-left: 22px; font-weight: 700; }
        .prayer-box { margin-top: 16px; border-radius: 18px; background: #fff7ed; border: 2px solid #fed7aa; padding: 14px 16px; color: #7c2d12; font-family: var(--font-nunito); font-weight: 900; line-height: 1.6; }
        @keyframes cinematicDrift { from { transform: scale(1.03) translate3d(-8px,-4px,0); } to { transform: scale(1.1) translate3d(12px,8px,0); } }
        @keyframes particleRise { 0%,100% { transform: translate3d(0,0,0) scale(.8); opacity: .32; } 50% { transform: translate3d(20px,-48px,0) scale(1.2); opacity: 1; } }
        @keyframes imageBreathe { from { transform: scale(1); } to { transform: scale(1.045); } }
        @media (min-width: 1100px) { .choice-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) {
          .courage-shell { padding: 18px 12px 48px; }
          .quest-back { min-height: 44px; align-items: center; margin-bottom: 10px; }
          .adventure-frame { min-height: auto; border-radius: 28px; }
          .adventure-frame::after { background: linear-gradient(180deg,rgba(8,20,40,.28),rgba(8,20,40,.88)); }
          .hero-content { min-height: auto; width: 100%; padding: 18px; align-items: center; }
          .story-card { width: min(100%,560px); }
          .quest-stage { grid-template-columns: 1fr; gap: 14px; padding: 14px; }
          .playing .quest-stage { grid-template-columns: 1fr; grid-template-rows: minmax(0,1fr) minmax(0,1fr); height: 100%; gap: 10px; padding: 46px 10px 10px; }
          .scene-media { min-height: 240px; max-height: 38vh; aspect-ratio: 16 / 10; }
          .playing .scene-media { min-height: 0; max-height: none; aspect-ratio: auto; }
          .scene-card { padding: 22px; }
          .playing .scene-card { padding: 14px; border-radius: 22px; }
          .playing .quest-kicker { font-size: .62rem; letter-spacing: 1.5px; margin-bottom: 4px; }
          .playing .scene-title { font-size: clamp(1.35rem,5vw,1.9rem); margin-bottom: 6px; }
          .playing .game-caption-card { margin-bottom: 7px; padding: 8px 10px; font-size: .82rem; }
          .playing .scene-body { font-size: .82rem; line-height: 1.34; margin-bottom: 7px; }
          .playing .echo-box { margin: 6px 0 7px; padding: 8px 10px; font-size: .8rem; }
          .playing .quest-button { min-height: 44px; }
          .playing .choice-grid { gap: 6px; margin-top: 6px; }
          .playing .choice { min-height: 42px; padding: 8px 10px; font-size: .8rem; }
          .playing .truth-panel { margin-top: 7px; padding: 9px 10px; font-size: .78rem; }
          .progress-label { margin-top: 2px; }
        }
        @media (max-width: 560px) {
          .courage-shell { padding: 12px 8px 36px; }
          .playing .courage-shell { padding: 6px; }
          .playing .quest-back { left: 10px; top: 8px; min-height: 30px; padding: 0 9px; font-size: .78rem; }
          .adventure-frame { border-radius: 22px; border-width: 3px; }
          .playing .adventure-frame { border-radius: 18px; border-width: 2px; }
          .hero-content { padding: 12px; }
          .story-card,.scene-card,.badge-card { border-radius: 22px; padding: 18px; }
          .playing .scene-card { padding: 9px; border-width: 2px; }
          .quest-title { font-size: clamp(1.95rem,12vw,3rem); }
          .quest-subtitle { font-size: .96rem; line-height: 1.48; }
          .verse-strip { font-size: .9rem; padding: 10px 12px; }
          .quest-button { width: 100%; min-height: 56px; padding: 0 18px; }
          .quest-stage { padding: 10px; gap: 12px; }
          .playing .quest-stage { grid-template-rows: minmax(0,1fr) minmax(0,1fr); padding: 38px 6px 6px; gap: 6px; }
          .progress-label { font-size: .72rem; gap: 8px; letter-spacing: .8px; }
          .playing .progress-label { padding-left: 76px; font-size: .58rem; margin-bottom: 4px; }
          .progress-track { height: 12px; margin-bottom: 8px; }
          .playing .progress-track { height: 7px; margin-bottom: 4px; }
          .truth-map { gap: 5px; margin-bottom: 10px; }
          .playing .truth-map { gap: 4px; margin-bottom: 5px; }
          .truth-node { min-height: 28px; font-size: .68rem; border-width: 1px; }
          .playing .truth-node { min-height: 21px; font-size: .58rem; }
          .truth-node span { font-size: .86rem; }
          .playing .truth-node span { font-size: .7rem; }
          .scene-media { min-height: 190px; max-height: 30vh; border-radius: 22px; }
          .playing .scene-media { min-height: 0; max-height: none; border-radius: 16px; }
          .comic-bubble { max-width: 47%; padding: 9px 10px; font-size: .78rem; border-width: 2px !important; }
          .comic-bubble span { font-size: .56rem; letter-spacing: .8px; margin-bottom: 2px; }
          .comic-bubble.top-left,.comic-bubble.bottom-left { left: 9px; }
          .comic-bubble.top-left,.comic-bubble.top-right { top: 9px; }
          .comic-bubble.top-right,.comic-bubble.bottom-right { right: 9px; }
          .comic-bubble.bottom-left,.comic-bubble.bottom-right { bottom: 9px; }
          .comic-bubble.speech::after { left: 20px; bottom: -12px; width: 18px; height: 15px; border-width: 2px; }
          .comic-bubble.thought { padding: 10px 13px; }
          .comic-bubble.thought::before { width: 12px; height: 12px; right: 22px; bottom: -14px; border-width: 2px; }
          .comic-bubble.thought::after { width: 7px; height: 7px; right: 10px; bottom: -24px; border-width: 2px; }
          .game-caption { left: 10px; right: 10px; bottom: 10px; border-radius: 16px; padding: 10px 12px; font-size: .84rem; line-height: 1.4; }
          .game-caption strong { font-size: .6rem; letter-spacing: 1px; }
          .playing .game-caption-card { padding: 6px 8px; margin-bottom: 5px; font-size: .7rem; line-height: 1.22; border-width: 2px; border-radius: 14px; }
          .playing .game-caption-card strong { font-size: .52rem; margin-bottom: 2px; }
          .scene-title { font-size: clamp(1.65rem,9vw,2.35rem); }
          .playing .scene-title { font-size: clamp(1.15rem,6vw,1.55rem); margin-bottom: 4px; }
          .scene-body { font-size: .98rem; line-height: 1.62; }
          .playing .scene-body { font-size: .72rem; line-height: 1.25; margin-bottom: 5px; }
          .echo-box { margin: 14px 0; padding: 13px 14px; }
          .playing .echo-box { margin: 4px 0 5px; padding: 6px 8px; font-size: .7rem; line-height: 1.22; border-left-width: 4px; }
          .prompt { font-size: 1.05rem; margin-top: 14px; }
          .playing .prompt { font-size: .82rem; margin: 5px 0; }
          .choice { min-height: 58px; padding: 14px; margin: 0; border-radius: 16px; }
          .playing .choice { min-height: 34px; padding: 6px 8px; font-size: .68rem; border-radius: 11px; }
          .choice-letter { width: 28px; height: 28px; margin-right: 8px; }
          .playing .choice-letter { width: 22px; height: 22px; margin-right: 6px; font-size: .7rem; }
          .truth-panel { border-radius: 18px; padding: 14px; }
          .playing .truth-panel { padding: 7px 8px; font-size: .68rem; line-height: 1.2; }
          .playing .truth-panel hr { margin: 6px 0 !important; }
          .playing .truth-panel .quest-button { min-height: 34px; margin-top: 5px; }
          .badge-image { width: min(320px,100%); border-radius: 22px; }
          .parent-box { padding: 16px; }
        }
        @media (prefers-reduced-motion: reduce) { .adventure-frame::before,.truth-particles span,.scene-media img { animation: none !important; } .quest-button:hover,.choice:hover { transform: none; } }
      `}</style>

      <div className="courage-shell">
        <Link href="/quests" className="quest-back">{t.back}</Link>

        {!started ? (
          <section className="adventure-frame" style={{ ['--frame-image' as string]: `url(${images.cover})` }}>
            <div className="truth-particles" aria-hidden="true"><span /><span /><span /><span /><span /></div>
            <div className="hero-content">
              <div className="story-card">
                <p className="quest-kicker">{t.quest}</p>
                <h1 className="quest-title">{t.title}</h1>
                <p className="quest-subtitle">{t.subtitle}</p>
                <div className="verse-strip">{t.verses}</div>
                <p className="quest-subtitle">{t.mission}</p>
                <button type="button" className="quest-button" onClick={() => setStarted(true)}>{t.start}</button>
              </div>
            </div>
          </section>
        ) : finished ? (
          <section className="badge-card">
            <img className="badge-image" src={images.badge} alt="Michael and Rosie celebrating with the Courage Quest badge" />
            <p className="quest-kicker">{t.completed}</p>
            <h1 className="quest-title">{t.badge}</h1>
            <p className="quest-subtitle" style={{ color: '#4f46e5', fontFamily: 'var(--font-nunito)', fontWeight: 1000 }}>{t.badgeLine}</p>
            <div className="pull-quote" style={{ maxWidth: 720, margin: '20px auto' }}>
              <p className="pq-text">{t.finalVerse}</p>
              <span className="pq-ref">Psalm 56:3</span>
            </div>
            <div className="parent-box">
              <h2>{t.parent}</h2>
              <ol>{t.questions.map(q => <li key={q}>{q}</li>)}</ol>
              <div className="prayer-box">{t.prayer}</div>
            </div>
            <button className="quest-button" onClick={replay}>{t.replay}</button>
          </section>
        ) : (
          <section className="adventure-frame" style={{ ['--frame-image' as string]: `url(${images[scene.id]})` }}>
            <div className="truth-particles" aria-hidden="true"><span /><span /><span /><span /><span /></div>
            <div className="quest-stage">
              <div className="quest-visual">
                <div className="progress-label">
                  <span>{t.path}</span>
                  <span>{t.truthLight}: {lights}/{scenes.length}</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                <div className="truth-map" aria-hidden="true">
                  {scenes.map((s, i) => (
                    <span key={s.id} className={`truth-node ${solved[i] ? 'lit' : i === index ? 'current' : ''}`}>
                      <span>{solved[i] ? '✦' : i + 1}</span>
                    </span>
                  ))}
                </div>
                <div className="scene-media">
                  <img src={images[scene.id]} alt={scene.alt} />
                  <div className="comic-bubbles" aria-hidden="true">
                    <div className={`comic-bubble whisper ${scene.echoSlot ?? 'top-left'}`}>
                      <span>Echo</span>
                      {scene.echo}
                    </div>
                    {chosen?.good ? (
                      <div className={`comic-bubble truth ${scene.thoughtSlot ?? 'top-right'}`}>
                        <span>Truth Light</span>
                        {scene.truth}
                      </div>
                    ) : chosen ? (
                      <div className={`comic-bubble speech ${scene.thoughtSlot ?? 'top-right'}`}>
                        <span>Guide</span>
                        {t.tryAgain}
                      </div>
                    ) : (
                      <div className={`comic-bubble thought ${scene.thoughtSlot ?? 'top-right'}`}>
                        <span>Think</span>
                        {scene.thought}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`scene-card phase-${phase}`}>
                {phase === 'story' && (
                  <>
                    <p className="quest-kicker">{t.scene} {index + 1} {t.of} {scenes.length} · {scene.place}</p>
                    <h1 className="scene-title">{scene.title}</h1>
                    <div className="game-caption-card">
                      <strong>{scene.place}</strong>
                      <p>{scene.caption}</p>
                    </div>
                    <p className="scene-body">{scene.body}</p>
                    <div className="echo-box">{scene.danger}</div>
                    <button type="button" className="quest-button" onClick={() => setPhase('choice')}>{t.chooseStep}</button>
                  </>
                )}

                {phase === 'choice' && (
                  <>
                    <p className="quest-kicker">{t.chooseStep}</p>
                    <h1 className="scene-title">{scene.prompt}</h1>
                    <div className="game-caption-card">
                      <strong>{scene.place}</strong>
                      <p>{scene.caption}</p>
                    </div>
                    <div className="choice-grid">
                      {choiceOrder.map(({ choice, originalIndex }, i) => {
                        const letter = String.fromCharCode(65 + i)
                        return (
                          <button key={choice.label} onClick={() => choose(originalIndex)} className="choice">
                            <span className="choice-letter" aria-hidden="true">{letter}</span>
                            <span>{choice.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}

                {phase === 'result' && chosen && (
                  <div className="truth-panel result-screen" ref={feedbackRef} tabIndex={-1} aria-live="polite">
                    <p className="quest-kicker">{chosen.good ? t.correct : t.almost}</p>
                    <h1 className="scene-title">{chosen.good ? t.truthLight : t.tryAgain}</h1>
                    <p style={{ marginTop: 6 }}>{chosen.response}</p>
                    {chosen.good ? (
                      <>
                        <hr style={{ border: 0, borderTop: '1px solid rgba(124,45,18,.2)', margin: '12px 0' }} />
                        <p>{t.bigTruth}: {scene.truth}</p>
                        <p style={{ fontStyle: 'italic', marginTop: 4 }}>{scene.verse}</p>
                        <button className="quest-button green" onClick={next}>{index === scenes.length - 1 ? t.finish : t.continue}</button>
                      </>
                    ) : (
                      <button className="quest-button" onClick={() => { setSelected(null); setPhase('choice') }}>{t.tryAgain}</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

