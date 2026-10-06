import { courseTurn, type CourseState, nextObstacle } from './course'

/** Preview the same rules that commit a turn: no parallel gameplay authority. */
export default function TurnChoices({ state, level, helpers, isRu, onAdvance, onRally }: { state: CourseState; level: number; helpers: number; isRu: boolean; onAdvance: () => void; onRally: () => void }) {
  const choices = [
    { id: 'advance', icon: '➜', title: isRu ? 'Проложить путь' : 'Open the path', after: courseTurn(state, { type: 'advance', index: nextObstacle(state.obstacles) }, level, helpers), act: onAdvance },
    { id: 'rally', icon: '⚑', title: isRu ? 'Собрать команду' : 'Gather the team', after: courseTurn(state, { type: 'rally' }, level, helpers), act: onRally },
  ]
  return <div className="turn-choices" aria-label={isRu ? 'Выбери следующий ход' : 'Choose your next move'}>
    {choices.map(({ id, icon, title, after, act }) => <button key={id} data-choice={id} disabled={after === state} onClick={act}>
      <span aria-hidden="true" className="choice-icon">{icon}</span><strong>{title}</strong>
      <small>{isRu ? 'Решимость' : 'Resolve'} {state.resolve} → {after.resolve} · {isRu ? 'Страх' : 'Fear'} {Math.round(state.fear)} → {Math.round(after.fear)}%</small>
      <small>{after.health < state.health ? (isRu ? '−1 сердце: лучше сначала сплотиться' : '−1 heart: consider rallying first') : id === 'advance' ? (isRu ? 'Открывает путь к лагерю' : 'Clears the route to camp') : (isRu ? 'Восстановись без спешки' : 'Recover without time pressure')}</small>
    </button>)}
    <style>{`.turn-choices{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0}.turn-choices button{display:flex;flex-direction:column;align-items:flex-start;gap:7px;text-align:left;min-height:112px;border:1px solid #c3d9bf;border-radius:16px;background:linear-gradient(145deg,#36594c,#1a3533);color:#fff6dd;padding:12px;box-shadow:inset 0 1px #ffffff30,0 4px 0 #101f24;cursor:pointer}.turn-choices button:first-child{background:linear-gradient(145deg,#edcf8a,#b9934e);color:#292b1b}.turn-choices button:disabled{opacity:.5;cursor:default}.turn-choices button:focus-visible{outline:3px solid white;outline-offset:3px}.turn-choices small{font-size:12px;line-height:1.4}.choice-icon{font-size:24px}.turn-choices button:active:not(:disabled){transform:translateY(2px)}@media(max-width:360px){.turn-choices{grid-template-columns:1fr}}`}</style>
  </div>
}
