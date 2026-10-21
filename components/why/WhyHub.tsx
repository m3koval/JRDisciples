"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { chapterImage, lessonHref, type LessonSummary } from "./types";
import { storageKey } from "./progress";
import { useNotebook } from "./store";
import { ui } from "./copy";
import { chapterTitles } from "./chapters";
export default function WhyHub({ lessons }: { lessons: LessonSummary[] }) {
  const { language } = useLanguage(); const t = ui[language]; const notebook = useNotebook();
  const state = (id: number) => { try { const p = JSON.parse(notebook.hydrated ? notebook.get(storageKey(id)) || "{}" : "{}"); return { completed: p.version === 1 && p.completed === true && p.passed === true && p.reflected === true, started: p.version === 1 && Number.isInteger(p.step) && p.step > 0 }; } catch { return { completed: false, started: false }; } };
  const completed = lessons.filter(l => state(l.id).completed).length;
  const next = lessons.find(l => state(l.id).started && !state(l.id).completed) ?? lessons.find(l => !state(l.id).completed) ?? lessons[0];
  const chapters = Array.from(new Set(lessons.map(l => l.chapter)));
  return <div className="why-shell why-hub" lang={language}>
    <section className="why-hero">
      <Image className="why-hero-image" src={chapterImage(1)} alt="" fill priority sizes="100vw" />
      <div className="why-hero-gradient" />
      <div className="why-hero-content"><p className="why-kicker">{t.welcome}</p><h1 className="why-wordmark">{language === "ru" ? "ПОЧЕМУ?!" : "WHY?!"}</h1><h2>{t.headline}</h2><p className="why-hero-intro">{t.intro}</p>{next && <Link className="why-button why-primary" href={lessonHref(next.id)}>{completed || state(next.id).started ? t.resume : t.start}<span aria-hidden="true">↗</span></Link>}<a className="why-hero-map-link" href="#expedition">{t.map} ↓</a></div>
      <div className="why-hero-stamp" aria-hidden="true"><span>✦</span><span>{language === "ru" ? "ПОЧЕМУ?!" : "WHY?!"}</span></div>
      <div className="why-hero-caption">{t.illustration}</div>
    </section>
    <section className="why-notebook-strip" aria-label={t.notebook}><span className="why-notebook-icon" aria-hidden="true">✦</span><div><p className="why-kicker">{t.notebook}</p><p><strong>{completed} / {lessons.length}</strong> {t.count}</p></div><div className="why-progress-track" role="progressbar" aria-label={t.count} aria-valuenow={completed} aria-valuemin={0} aria-valuemax={lessons.length || 1}><span style={{ width: `${lessons.length ? completed / lessons.length * 100 : 0}%` }} /></div><p className="why-local-note" style={notebook.temporary ? { display: "block" } : undefined} role={notebook.temporary ? "status" : undefined}>{notebook.temporary ? t.temporary : t.saved}</p></section>
    <section id="expedition" className="why-expedition"><header className="why-expedition-heading"><p className="why-kicker">{t.map}</p><h2>{t.journey}</h2><p>{t.journeyIntro}</p></header>
      {chapters.length > 0 && <nav className="why-chapter-jumps" aria-label={t.chapters}>{chapters.map(chapter => <a href={`#chapter-${chapter}`} key={chapter} aria-label={`${t.chapter} ${chapter}`}>{String(chapter).padStart(2, "0")}</a>)}</nav>}
      {!lessons.length && <p>{t.empty}</p>}
      <div className="why-trail">{chapters.map(chapter => {
        const entries = lessons.filter(l => l.chapter === chapter);
        return <section className="why-chapter" id={`chapter-${chapter}`} key={chapter}><div className="why-chapter-art"><Image src={chapterImage(chapter)} alt="" fill sizes="(min-width: 900px) 42vw, 100vw" /><div className="why-chapter-shade"/><div><p className="why-kicker">{t.chapter} {String(chapter).padStart(2, "0")}</p><h3>{chapterTitles[chapter][language]}</h3><span className="why-chapter-number" aria-hidden="true">{String(chapter).padStart(2, "0")}</span></div></div><ol className="why-trail-lessons">{entries.map(lesson => {
          const status = state(lesson.id); return <li key={lesson.id}><Link href={lessonHref(lesson.id)} className={lesson.id === next?.id ? "why-recommended" : ""}><span className={`why-trail-marker ${status.completed ? "is-complete" : ""}`}>{status.completed ? "✓" : String(lesson.id).padStart(2, "0")}</span><span className="why-trail-copy"><small>{status.completed ? t.completed : lesson.kind === "lab" ? t.lab : t.lesson}{lesson.id === next?.id && !status.completed ? ` · ${t.path}` : ""}</small><strong>{lesson.title[language]}</strong><span>{lesson.subtitle[language]}</span></span><span aria-hidden="true" className="why-trail-arrow">↗</span></Link></li>;
        })}</ol></section>;
      })}</div>
    </section>
  </div>;
}
