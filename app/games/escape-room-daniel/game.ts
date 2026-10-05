export type Language = 'en' | 'ru'
export const words = {
  en: ['pray', 'to', 'God', 'for', '30', 'days'],
  ru: ['молиться', 'Богу', '30', 'дней'],
}
// Exact excerpts, verified against Bible.com ESV and Synodal (400), Daniel 6:22.
export const scripture = {
  en: 'My God sent his angel and shut the lions’ mouths, and they have not harmed me',
  ru: 'Бог мой послал Ангела Своего и заградил пасть львам, и они не повредили мне',
}
export const questions = [
  { en: 'King Darius wanted Daniel to be thrown to the lions.', ru: 'Царь Дарий хотел бросить Даниила львам.', answer: false, clueEn: 'Darius tried to rescue Daniel until sunset, but the law could not be changed. (Daniel 6:14–16)', clueRu: 'Дарий до заката пытался спасти Даниила, но закон нельзя было изменить. (Даниила 6:14–16)' },
  { en: 'God sent an angel to shut the lions’ mouths.', ru: 'Бог послал ангела и закрыл пасть львам.', answer: true, clueEn: 'Daniel told the king that God had sent his angel. God rescued him! (Daniel 6:22)', clueRu: 'Даниил рассказал царю, что Бог послал Своего ангела. Бог спас его! (Даниила 6:22)' },
  { en: 'Daniel was hurt by the lions.', ru: 'Львы ранили Даниила.', answer: false, clueEn: 'When Daniel came out, no injury was found on him. He had trusted God. (Daniel 6:23)', clueRu: 'Когда Даниила подняли, на нём не нашли повреждения. Он верил Богу. (Даниила 6:23)' },
  { en: 'The king could not sleep that night.', ru: 'В ту ночь царь не мог уснуть.', answer: true, clueEn: 'The king spent the night without food or sleep. At dawn he hurried to the den. (Daniel 6:18–19)', clueRu: 'Царь провёл ночь без еды и сна. На рассвете он поспешил ко рву. (Даниила 6:18–19)' },
  { en: 'After the rescue, Darius told people to fear Daniel’s God.', ru: 'После спасения Дарий повелел людям бояться Бога Даниила.', answer: true, clueEn: 'Darius told his kingdom to honor the living God, who rescues and delivers. (Daniel 6:25–27)', clueRu: 'Дарий велел людям почитать живого Бога, Который спасает и избавляет. (Даниила 6:25–27)' },
]
export type State = {
  phase: 'intro' | 'play' | 'victory'; room: number; language: Language;
  cleared: number[]; tiles: number[]; city: number; prayers: number;
  question: number; verseStep: number; feedback: 'wrong' | 'right' | null;
  inspected: boolean; hint: boolean; paused: boolean;
}
export type Action =
  | { type: 'start' } | { type: 'reset' } | { type: 'language'; language: Language }
  | { type: 'tile'; index: number } | { type: 'undo'; index: number }
  | { type: 'check' } | { type: 'city'; value: number } | { type: 'prayers'; value: number }
  | { type: 'answer'; value: boolean } | { type: 'verse'; value: number }
  | { type: 'next' } | { type: 'inspect' } | { type: 'hint' } | { type: 'pause'; value: boolean }
  | { type: 'room'; value: number }
export function initialState(language: Language = 'en'): State {
  return { phase: 'intro', room: 0, language, cleared: [], tiles: [], city: -1, prayers: 0, question: 0, verseStep: 0, feedback: null, inspected: false, hint: false, paused: false }
}
function enterRoom(state: State, room: number): State {
  return { ...initialState(state.language), phase: 'play', cleared: state.cleared, room }
}
function mark(state: State, correct: boolean, complete: boolean): State {
  return { ...state, feedback: correct ? 'right' : 'wrong', cleared: correct && complete && !state.cleared.includes(state.room) ? [...state.cleared, state.room] : state.cleared }
}
export function reducer(state: State, action: Action): State {
  if (action.type === 'reset') return initialState(state.language)
  if (action.type === 'language') {
    if (action.language === state.language) return state
    // Word positions differ between EN/RU. Restart just the active puzzle, retain earned keys.
    return { ...enterRoom({ ...state, language: action.language }, state.room), phase: state.phase, paused: state.paused }
  }
  if (action.type === 'pause') return { ...state, paused: action.value }
  if (state.paused) return state
  if (action.type === 'start' && state.phase === 'intro') return enterRoom(state, 0)
  if (state.phase !== 'play') return state
  if (action.type === 'room') {
    if (!Number.isInteger(action.value) || action.value < 0 || action.value > 3 || (action.value > 0 && !state.cleared.includes(action.value - 1))) return state
    return enterRoom(state, action.value)
  }
  if (action.type === 'inspect') return { ...state, inspected: true }
  if (action.type === 'hint') return { ...state, hint: true, inspected: true }
  if (action.type === 'next') {
    if (state.feedback !== 'right') return state
    if (state.room === 2 && state.question < questions.length - 1) return { ...state, question: state.question + 1, feedback: null, hint: false, inspected: false }
    if (state.room === 3 && state.verseStep === 0) return { ...state, verseStep: 1, feedback: null, hint: false }
    if (!state.cleared.includes(state.room)) return state
    if (state.room === 3) return state.cleared.length === 4 ? { ...state, phase: 'victory' } : state
    return enterRoom(state, state.room + 1)
  }
  if (state.feedback === 'right') return state
  if (state.room === 0) {
    if (action.type === 'tile' && Number.isInteger(action.index) && action.index >= 0 && action.index < words[state.language].length && !state.tiles.includes(action.index)) return { ...state, tiles: [...state.tiles, action.index], feedback: null }
    if (action.type === 'undo') return { ...state, tiles: state.tiles.filter((_, i) => i !== action.index), feedback: null }
    if (action.type === 'check') return mark(state, state.tiles.length === words[state.language].length && state.tiles.every((value, i) => value === i), true)
  }
  if (state.room === 1) {
    if (action.type === 'city') return { ...state, city: action.value, feedback: null }
    if (action.type === 'prayers') return { ...state, prayers: action.value, feedback: null }
    if (action.type === 'check') return mark(state, state.city === 1 && state.prayers === 3, true)
  }
  if (state.room === 2 && action.type === 'answer') return mark(state, action.value === questions[state.question].answer, state.question === questions.length - 1)
  if (state.room === 3 && action.type === 'verse') return mark(state, action.value === (state.verseStep === 0 ? 1 : 2), state.verseStep === 1)
  return state
}
