import type { Activity, Lesson } from "./types";
export type Answers = { order: string[]; groups: Record<string, string>; choice: string };
export type Progress = { version: 1; step: number; answers: Answers; passed: boolean; reflected: boolean; completed: boolean };
export const storageKey = (id: number) => `jd-why-v1-${id}`;
export function initialAnswers(activity: Activity): Answers { return { order: activity.items.map(i => i.id), groups: {}, choice: "" }; }
export function isCorrect(activity: Activity, answers: Answers): boolean {
  if (activity.type === "choose") return !!activity.correctId && answers.choice === activity.correctId;
  if (activity.type === "sequence") return !!activity.correctOrder && answers.order.length === activity.correctOrder.length && answers.order.every((id, i) => id === activity.correctOrder![i]);
  return activity.items.length > 0 && activity.items.every(item => !!item.group && answers.groups[item.id] === item.group);
}
export function readProgress(raw: string | null, lesson: Lesson): Progress {
  const initial: Progress = { version: 1, step: 0, answers: initialAnswers(lesson.activity), passed: false, reflected: false, completed: false };
  if (!raw) return initial;
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1) return initial;
    const ids = lesson.activity.items.map(i => i.id);
    const order = value.answers?.order;
    if (Array.isArray(order) && order.length === ids.length && new Set(order).size === ids.length && order.every(id => ids.includes(id))) initial.answers.order = order;
    if (ids.includes(value.answers?.choice)) initial.answers.choice = value.answers.choice;
    const allowedGroups = lesson.activity.groups?.map(g => g.id) ?? [];
    for (const id of ids) { const group = value.answers?.groups?.[id]; if (allowedGroups.includes(group)) initial.answers.groups[id] = group; }
    initial.passed = value.passed === true && isCorrect(lesson.activity, initial.answers);
    initial.reflected = initial.passed && value.reflected === true;
    initial.completed = initial.reflected && value.completed === true;
    const maxStep = initial.completed ? 7 : initial.passed ? 6 : 5;
    initial.step = Number.isInteger(value.step) ? Math.max(0, Math.min(maxStep, value.step)) : 0;
    return initial;
  } catch { return initial; }
}
export function moveItem(order: string[], index: number, direction: number): string[] {
  const target = index + direction;
  if (target < 0 || target >= order.length) return order;
  const next = [...order]; [next[index], next[target]] = [next[target], next[index]]; return next;
}
