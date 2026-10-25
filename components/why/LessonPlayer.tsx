"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { Lesson, Copy } from "./types";
import { lessonHref } from "./types";
import { sceneBeats, speakers } from "./beats";
import { initialAnswers, readProgress, storageKey, type Progress } from "./progress";
import { useSaved } from "./store";
import { ui } from "./copy";
import ActivityBoard from "./ActivityBoard";
import SourceNotebook from "./SourceNotebook";
import Observatory from "./Observatory";
import CopyLab from "./CopyLab";
export default function LessonPlayer({ lesson, next }: { lesson: Lesson; next?: { id: number; title: Copy } }) {
  const { language } = useLanguage(); const t = ui[language];
  const saved = useSaved(storageKey(lesson.id));
  const progress = readProgress(saved.raw, lesson);
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(progress.step);
  useEffect(() => {
    if (previous.current !== progress.step) {
      heading.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 999px)").matches) {
        const target = progress.step < 4 ? ".why-stage" : ".why-reading";
        heading.current?.closest(".why-player")?.querySelector(target)?.scrollIntoView({ block: "start", behavior: "instant" });
      }
      previous.current = progress.step;
    }
  }, [progress.step]);
  const update = (patch: Partial<Progress>) => saved.write({ ...progress, ...patch });
  const step = progress.step;
  const [explored, setExplored] = useState(false);
  const extraLab = step === 5 && [1,6].includes(lesson.id) && !explored;
  const scene = lesson.scenes[step];
  const section = step < 4 ? t.story : step === 4 ? t.bible : step === 5 ? t.activity : step === 6 ? t.mission : t.finish;
  const title = step < 4 ? scene.title[language] : step === 4 ? lesson.scripture.reference[language] : step === 5 ? (extraLab ? (lesson.id === 1 ? (language === "ru" ? "Посмотри в телескоп" : "Look through the telescope") : (language === "ru" ? "Восстанови записку" : "Recover the note")) : lesson.activity.title[language]) : step === 6 ? t.mission : t.finish;
  return <div className="why-shell why-player" lang={language}>
    <header className="why-toolbar"><Link href="/why" className="why-back">← {t.map}</Link><span className="why-kicker">{language === "ru" ? "ПОЧЕМУ?!" : "WHY?!"} <span className="why-toolbar-detail">/ {t.lesson} {String(lesson.id).padStart(2, "0")}</span></span><span className="why-step-count">{Math.min(step + 1, 7)} / 7</span></header>
    <div className="why-stage">
      <aside className={`why-scene-art why-art-step-${step}`}>
        <div className="why-image-window"><Image key={`${lesson.id}-${Math.min(step,3)}`} src={`/images/jr/why/lesson-${String(lesson.id).padStart(2,"0")}-scene-${Math.min(step,3)+1}.webp`} alt={lesson.scenes[Math.min(step,3)].title[language]} fill priority sizes="(min-width: 1000px) 48vw, 100vw" /></div>
        <div className="why-art-top"><span className="why-pill">{t.chapter} {String(lesson.chapter).padStart(2, "0")}</span><span className="why-pill">{lesson.kind === "lab" ? t.lab : t.lesson}</span></div>
        <div className="why-art-copy"><p className="why-kicker">{t.welcome}</p><h1>{lesson.title[language]}</h1><p>{lesson.subtitle[language]}</p><small>{t.illustration}</small></div>
      </aside>
      <section className="why-reading" aria-label={section}>
        <nav className="why-stage-nav" aria-label={t.story}>{[t.story, t.bible, t.activity, t.mission].map((label, i) => {
          const target = [0, 4, 5, 6][i];
          const disabled = (i === 2 && step < 4) || (i === 3 && !progress.passed);
          return <button key={i} aria-current={(step < 4 ? 0 : step - 3) === i ? "step" : undefined} disabled={disabled} onClick={() => update({ step: target })}><span aria-hidden="true">{i + 1}</span><span>{label}</span></button>;
        })}</nav>
        <div className="why-reading-body" key={step}>
          <p className="why-kicker">{step < 4 ? `${t.scene} ${step + 1} / 4` : section}</p>
          <h2 ref={heading} tabIndex={-1}>{title}</h2>
          {step < 4 && <div className="why-story-text">{sceneBeats(scene, language).map((beat, i) => beat.kind === "dialogue"
            ? <p key={i} className="why-line" style={{ ["--line-color" as string]: speakers[beat.speaker].color }}><span className="why-line-speaker">{speakers[beat.speaker].name[language]}</span>{beat.text[language]}</p>
            : <p key={i}>{beat.text[language]}</p>
          )}</div>}
          {step === 4 && <><div className="why-scripture"><span aria-hidden="true" className="why-quote-mark">“</span><blockquote>{lesson.scripture.text[language]}</blockquote><p>{lesson.scripture.reference[language]}</p></div><a className="why-text-button" href={lesson.scripture.url[language]} target="_blank" rel="noopener noreferrer">{t.read} ↗</a>
          {lesson.comeback && <div className="why-comeback"><p className="why-kicker">{t.comebackLabel}</p><p className="why-comeback-prompt">“{lesson.comeback.prompt[language]}”</p><p className="why-comeback-arrow" aria-hidden="true">{t.comebackArrow}</p><p className="why-comeback-response">{lesson.comeback.response[language]}</p></div>}</>}
          {extraLab && lesson.id === 6 && <CopyLab language={language} />}
          {extraLab && lesson.id === 1 && <Observatory language={language} />}
          {extraLab && <button className="why-button why-primary why-lab-next" onClick={() => setExplored(true)}>{language === "ru" ? "Перейти к заданию →" : "Continue to the activity →"}</button>}
          {step === 5 && !extraLab && <ActivityBoard activity={lesson.activity} language={language} answers={progress.answers} passed={progress.passed} onChange={answers => update({ answers, passed: false, reflected: false, completed: false })} onPass={() => update({ passed: true })} />}
          {step === 6 && <><div className="why-field-mission"><span aria-hidden="true">↗</span><p>{lesson.fieldMission[language]}</p></div><p className="why-note">{t.missionNote}</p><div className="why-prayer"><h3>{t.prayer}</h3><p>{lesson.prayer[language]}</p></div><label className="why-reflection"><input type="checkbox" checked={progress.reflected} onChange={event => update({ reflected: event.target.checked, completed: event.target.checked && progress.completed })} /><span>{t.acknowledge}</span></label></>}
          {step === 7 && <div className="why-completion"><div className="why-discovery-seal" aria-hidden="true">✦</div><p className="why-completion-line">{t.completeText}</p><blockquote>{lesson.scripture.text[language]}</blockquote><p className="why-kicker">{lesson.scripture.reference[language]}</p>{next && <div className="why-next-discovery"><p>{t.ready}</p><Link className="why-button why-primary" href={lessonHref(next.id)}>{next.title[language]} →</Link></div>}<Link className="why-text-button" href="/why">{t.all} →</Link></div>}
          <div className="why-player-actions">
            {step > 0 && step < 7 && <button className="why-button" onClick={() => update({ step: step - 1 })}>← {t.back}</button>}
            {step < 5 && <button className="why-button why-primary" onClick={() => update({ step: step + 1 })}>{step === 3 ? t.bible : step === 4 ? t.activity : t.continue} →</button>}
            {step === 5 && progress.passed && <button className="why-button why-primary" onClick={() => update({ step: 6 })}>{t.mission} →</button>}
            {step === 6 && <button className="why-button why-primary" disabled={!progress.reflected} onClick={() => update({ step: 7, completed: true })}>{t.collect} ✦</button>}
            {step === 7 && <button className="why-button" onClick={() => update({ step: 0 })}>{t.restart}</button>}
          </div>
          {step === 5 && <div className="why-secondary-actions"><button className="why-text-button" onClick={() => update({ step: 0 })}>{t.study}</button>{progress.passed && <button className="why-text-button" onClick={() => update({ answers: initialAnswers(lesson.activity), passed: false, reflected: false, completed: false })}>{t.reset}</button>}</div>}
        </div>
        <footer className="why-player-footer"><SourceNotebook lesson={lesson} language={language} /><p role="status">{saved.temporary ? t.temporary : t.saved}</p></footer>
      </section>
    </div>
  </div>;
}
