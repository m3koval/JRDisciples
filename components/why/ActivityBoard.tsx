"use client";
import { useState } from "react";
import type { Activity, Language } from "./types";
import type { Answers } from "./progress";
import { isCorrect, moveItem } from "./progress";
import { ui } from "./copy";
export default function ActivityBoard({ activity, language, answers, passed, onChange, onPass }: {
  activity: Activity; language: Language; answers: Answers; passed: boolean; onChange: (answers: Answers) => void; onPass: () => void;
}) {
  const t = ui[language];
  const [feedback, setFeedback] = useState(false);
  const change = (next: Answers) => { setFeedback(false); onChange(next); };
  const ready = activity.type === "choose" ? !!answers.choice : activity.type === "sort" ? activity.items.every(i => !!answers.groups[i.id]) : true;
  return <div className="why-activity" data-activity={activity.type}>
    <p>{activity.intro[language]}</p>
    {activity.question && <p className="why-question">{activity.question[language]}</p>}
    <p className="why-instruction">{t[activity.type]}</p>
    {activity.type === "sequence" && <ol className="why-sequence">{answers.order.map((id, index) => {
      const item = activity.items.find(i => i.id === id)!;
      return <li key={id} data-item={id}><span className="why-position">{index + 1}</span><span>{item.text[language]}</span><div className="why-movers">
        <button aria-label={`${t.up}: ${item.text[language]}`} disabled={passed || index === 0} onClick={() => change({ ...answers, order: moveItem(answers.order, index, -1) })}>↑</button>
        <button aria-label={`${t.down}: ${item.text[language]}`} disabled={passed || index === answers.order.length - 1} onClick={() => change({ ...answers, order: moveItem(answers.order, index, 1) })}>↓</button>
      </div></li>;
    })}</ol>}
    {activity.type === "choose" && <div className="why-choices" role="group" aria-label={activity.title[language]}>{activity.items.map((item, i) => <button key={item.id} data-item={item.id} className="why-choice" aria-pressed={answers.choice === item.id} disabled={passed} onClick={() => change({ ...answers, choice: item.id })}><span className="why-position">{String.fromCharCode(65 + i)}</span><span>{item.text[language]}</span></button>)}</div>}
    {activity.type === "sort" && <div className="why-sort">{activity.items.map(item => <fieldset key={item.id} data-item={item.id}><legend>{item.text[language]}</legend><div>{activity.groups?.map(group => <button key={group.id} data-group={group.id} aria-pressed={answers.groups[item.id] === group.id} disabled={passed} onClick={() => change({ ...answers, groups: { ...answers.groups, [item.id]: group.id } })}>{group.label[language]}</button>)}</div></fieldset>)}</div>}
    <div aria-live="polite" role="status">{passed ? <div className="why-feedback why-correct"><strong>{t.success}</strong><p>{activity.success[language]}</p></div> : feedback ? <div className="why-feedback"><strong>{t.retry}</strong><p>{activity.hint[language]}</p></div> : null}</div>
    {!passed && <><button className="why-button why-primary" disabled={!ready} onClick={() => { if (isCorrect(activity, answers)) onPass(); else setFeedback(true); }}>{t.check} <span aria-hidden="true">↗</span></button><details className="why-hint"><summary>{t.hint}</summary><p>{activity.hint[language]}</p></details></>}
  </div>;
}
