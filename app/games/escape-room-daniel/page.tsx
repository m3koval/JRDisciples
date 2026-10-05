'use client'

import { useEffect, useReducer, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { initialState, reducer, words, questions, scripture, windowGuidance } from './game'
import styles from './room.module.css'

const rooms = [
  { en: 'The King’s Decree', ru: 'Указ царя', icon: '📜', art: 'decree', keyEn: 'Courage', keyRu: 'Смелость' },
  { en: 'Daniel’s Window', ru: 'Окно Даниила', icon: '🪟', art: 'window', keyEn: 'Prayer', keyRu: 'Молитва' },
  { en: 'The Den Seal', ru: 'Печать рва', icon: '🦁', art: 'den', keyEn: 'Trust', keyRu: 'Доверие' },
  { en: 'The Verse Key', ru: 'Ключ из стиха', icon: '🗝️', art: 'victory', keyEn: 'Rescue', keyRu: 'Спасение' },
]
const clues = {
  en: [
    'The officials persuaded Darius to ban requests to any god or person except the king for 30 days. Daniel still prayed to God. (Daniel 6:7–10)',
    'Daniel’s upstairs windows faced Jerusalem. He knelt to pray and give thanks to God three times a day, just as before. (Daniel 6:10)',
    '',
    'Daniel did not overpower the lions. God sent his angel and protected Daniel. Read Daniel’s words on the scroll, then restore the missing words.',
  ],
  ru: [
    'Придворные уговорили Дария на 30 дней запретить просьбы к любому богу или человеку, кроме царя. Даниил продолжил молиться Богу. (Даниила 6:7–10)',
    'Окна Даниила были открыты в сторону Иерусалима. Он три раза в день вставал на колени, молился и благодарил Бога, как и раньше. (Даниила 6:10)',
    '',
    'Даниил не победил львов своей силой. Бог послал ангела и защитил его. Прочитай слова Даниила на свитке и восстанови пропуски.',
  ],
}
const hints = {
  en: ['Start with “pray”, then who Daniel prayed to, then how long the ban lasted. Tap a placed word to take it back.', 'Set the city to Jerusalem and the daily prayer count to three. Then test both parts of the lock.', 'Use the witness note above. A wrong answer never removes a seal you have already earned.', 'The helper is an angel, not a soldier. God shut the lions’ mouths.'],
  ru: ['Начни со слова «молиться», затем укажи кому и как долго действовал запрет. Нажми на слово в ответе, чтобы убрать его.', 'Выбери Иерусалим и три молитвы в день. Затем проверь обе части замка.', 'Прочитай свидетельство выше. Ошибка не отнимает уже открытые печати.', 'Помощник — ангел, не воин. Бог закрыл пасть львам.'],
}

export default function EscapeRoomDanielPage() {
  const { language, setLanguage } = useLanguage()
  const lang = language === 'ru' ? 'ru' : 'en'
  const isRu = lang === 'ru'
  const [state, dispatch] = useReducer(reducer, lang, initialState)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { dispatch({ type: 'language', language: lang }) }, [lang])
  useEffect(() => {
    const pause = () => { if (document.hidden) dispatch({ type: 'pause', value: true }) }
    document.addEventListener('visibilitychange', pause)
    return () => document.removeEventListener('visibilitychange', pause)
  }, [])
  useEffect(() => { heading.current?.focus() }, [state.phase, state.room, state.question, state.verseStep, state.paused])

  const room = rooms[state.room]
  const text = (en: string, ru: string) => isRu ? ru : en
  const active = state.phase === 'play'
  const right = state.feedback === 'right'
  const q = questions[state.question]
  const clue = state.room === 2 ? text(q.clueEn, q.clueRu) : clues[lang][state.room]
  const poolOrder = lang === 'ru' ? [2, 0, 3, 1] : [4, 2, 0, 5, 3, 1]
  const verseOptions = state.verseStep === 0
    ? text('soldier|angel|king', 'воина|Ангела|царя').split('|')
    : text('door|window|lions’ mouths', 'дверь|окно|пасть львам').split('|')
  const quote = <blockquote className={styles.verse}>“{scripture[lang]}…”<cite>{text('Daniel 6:22 · ESV excerpt', 'Даниила 6:22 · Синодальный, отрывок')}</cite></blockquote>

  return <main className={`${styles.game} ${state.phase !== 'intro' ? styles.active : ''}`} lang={lang}>
    <div className={styles.shell}>
      <header className={styles.toolbar}>
        <Link href="/games">← {text('Games', 'Игры')}</Link>
        <button aria-label={text('Switch to Russian', 'Переключить на английский')} onClick={() => setLanguage(isRu ? 'en' : 'ru')}>{isRu ? 'EN' : 'РУ'}</button>
        {active && <button onClick={() => dispatch({ type: 'pause', value: !state.paused })}>{state.paused ? text('Resume', 'Продолжить') : text('Pause', 'Пауза')}</button>}
      </header>
      <div className={styles.stage}>
        <div className={styles.scene} style={{ backgroundImage: `url(/images/jr/games/escape-room/escape-room-daniel-${state.phase === 'intro' ? 'decree' : state.phase === 'victory' ? 'victory' : room.art}.png)` }}>
          <div className={styles.sceneCaption}>
            <p>{text('DANIEL 6 · ESCAPE ROOM', 'ДАНИИЛА 6 · КОМНАТА-ЗАГАДКА')}</p>
            <h1>{text('The Lion’s Den', 'Ров со львами')}</h1>
            <p>{text('Discover the clues. Unlock four keys.', 'Найди подсказки. Собери четыре ключа.')}</p>
          </div>
        </div>
        <section className={styles.panel} aria-label={text('Puzzle controls', 'Управление загадкой')}>
          {state.phase === 'intro' && <>
            <h2 ref={heading} tabIndex={-1}>{text('A mystery of courage', 'Тайна смелости')}</h2>
            <p>{text('A new law said people could ask only King Darius for help for 30 days. Daniel kept praying to God. Explore four rooms to discover what happened next.', 'Новый закон на 30 дней разрешал обращаться с просьбами только к царю Дарию. Даниил продолжил молиться Богу. Исследуй четыре комнаты и узнай, что было дальше.')}</p>
            <p>{text('Inspect objects, arrange words, set a two-part lock, and open the witness seals. No timer. You can always try again.', 'Осматривай предметы, расставляй слова, настрой замок и открой печати. Время не ограничено. Всегда можно попробовать снова.')}</p>
            {quote}
            <p className={styles.small}>{text('The rooms and locks are our story game. God rescued Daniel—not a puzzle score.', 'Комнаты и замки придуманы для игры. Даниила спас Бог, а не баллы за загадки.')}</p>
            <button className={styles.primary} onClick={() => dispatch({ type: 'start' })}>{text('Enter the first room →', 'Войти в первую комнату →')}</button>
          </>}

          {active && state.paused && <div className={styles.pause}>
            <h2 ref={heading} tabIndex={-1}>{text('Adventure paused', 'Приключение на паузе')}</h2>
            <p>{text('Your keys are safe. Take your time.', 'Твои ключи на месте. Можно отдохнуть.')}</p>
            <button className={styles.primary} onClick={() => dispatch({ type: 'pause', value: false })}>{text('Resume adventure', 'Продолжить приключение')}</button>
            <button onClick={() => dispatch({ type: 'reset' })}>{text('Start over', 'Начать заново')}</button>
          </div>}

          {active && !state.paused && <>
            <p className={styles.eyebrow}>{text(`Room ${state.room + 1} of 4 · ${state.cleared.length}/4 keys`, `Комната ${state.room + 1} из 4 · Ключи: ${state.cleared.length}/4`)}</p>
            <h2 ref={heading} tabIndex={-1}>{room.icon} {room[lang]}</h2>
            <div className={styles.inventory} aria-label={text('Key inventory', 'Собранные ключи')}>
              {rooms.map((r, i) => <span key={r.en} className={state.cleared.includes(i) ? styles.earned : ''}>{state.cleared.includes(i) ? '🗝️' : '🔒'} {isRu ? r.keyRu : r.keyEn}</span>)}
            </div>
            <button className={styles.clueButton} aria-expanded={state.inspected} aria-controls="daniel-clue" onClick={() => dispatch({ type: 'inspect' })}>
              {state.inspected ? text('Hide clue ↑', 'Скрыть подсказку ↑') : <>{text('🔎 Inspect ', '🔎 Осмотреть ')}{[text('the royal scroll', 'царский свиток'), text('the window notebook', 'запись у окна'), text('the witness note', 'свидетельство'), text('Daniel’s scroll', 'свиток Даниила')][state.room]}</>}
            </button>
            <aside id="daniel-clue" hidden={!state.inspected} className={styles.clue}>{clue}{state.room === 3 && quote}</aside>

            {state.room === 0 && <>
              <p>{text('What did the law forbid? Arrange the words. Tap any placed word to undo it, then check the lock.', 'Что запрещал закон? Расставь слова. Нажми на слово в ответе, чтобы убрать его. Затем проверь замок.')}</p>
              <div className={styles.slots} aria-label={text('Your word order', 'Твой порядок слов')}>
                {state.tiles.length === 0 && <span>{text('Tap words below…', 'Нажимай на слова ниже…')}</span>}
                {state.tiles.map((index, i) => <button key={index} disabled={right} onClick={() => dispatch({ type: 'undo', index: i })} aria-label={text('Remove ', 'Убрать ') + words[lang][index]}>{words[lang][index]}</button>)}
              </div>
              <div className={styles.tiles}>{poolOrder.map(index => <button key={index} disabled={right || state.tiles.includes(index)} onClick={() => dispatch({ type: 'tile', index })}>{words[lang][index]}</button>)}</div>
              {!right && <button className={styles.primary} disabled={state.tiles.length !== words[lang].length} onClick={() => dispatch({ type: 'check' })}>{text('Test the word lock', 'Проверить замок слов')}</button>}
            </>}
            {state.room === 1 && <>
              <p>{text('Set both parts of Daniel’s prayer lock: where did his windows face, and how many times did he pray each day?', 'Настрой обе части замка: куда выходили окна Даниила и сколько раз в день он молился?')}</p>
              <fieldset disabled={right}><legend>{text('Window facing', 'Куда выходили окна')}</legend><div className={`${styles.choices} ${styles.windowCities}`}>
                {[text('Egypt', 'Египет'), text('Jerusalem', 'Иерусалим'), text('The palace', 'Дворец')].map((city, i) => <button key={city} aria-pressed={state.city === i} onClick={() => dispatch({ type: 'city', value: i })}>{state.city === i && <span aria-hidden="true">✓ </span>}{city}</button>)}
              </div></fieldset>
              <fieldset disabled={right}><legend>{text('Prayers each day', 'Молитв в день')}</legend><div className={styles.choices}>
                {[1, 2, 3].map(n => <button key={n} aria-pressed={state.prayers === n} onClick={() => dispatch({ type: 'prayers', value: n })}>{state.prayers === n && <span aria-hidden="true">✓ </span>}{n}</button>)}
              </div></fieldset>
              {!right && <>
                <p id="daniel-window-guidance" role="status" aria-live="polite">{windowGuidance(state, lang)}</p>
                <button className={styles.primary} aria-describedby="daniel-window-guidance" disabled={state.city < 0 || !state.prayers} onClick={() => dispatch({ type: 'check' })}>{text('Try the window lock', 'Проверить замок окна')}</button>
              </>}
            </>}
            {state.room === 2 && <>
              <p className={styles.eyebrow}>{text(`Witness seal ${state.question + 1} of ${questions.length}`, `Печать ${state.question + 1} из ${questions.length}`)}</p>
              <p>{text('Read the witness note, then decide: is this statement true?', 'Прочитай свидетельство и реши: верно ли это утверждение?')}</p>
              <p className={styles.statement}>{q[lang]}</p>
              <div className={styles.choices}>
                <button disabled={right} onClick={() => dispatch({ type: 'answer', value: true })}>{text('True', 'Верно')}</button>
                <button disabled={right} onClick={() => dispatch({ type: 'answer', value: false })}>{text('False', 'Неверно')}</button>
              </div>
            </>}
            {state.room === 3 && <>
              <p>{text(`Verse lock ${state.verseStep + 1} of 2. Inspect the scroll and restore its missing words.`, `Замок стиха ${state.verseStep + 1} из 2. Осмотри свиток и восстанови пропуски.`)}</p>
              <p className={styles.statement}>{state.verseStep === 0 ? text('My God sent his ___', 'Бог мой послал ___ Своего') : text('and shut the ___', 'и заградил ___')}</p>
              <div className={styles.choices}>{verseOptions.map((option, i) => <button key={option} disabled={right} onClick={() => dispatch({ type: 'verse', value: i })}>{option}</button>)}</div>
            </>}
            <div role="status" aria-live="polite" className={styles.feedback}>
              {state.feedback === 'wrong' && <p>{text('Not yet. Your progress is safe! Read the clue and change your answer.', 'Пока не получилось. Прогресс сохранён! Прочитай подсказку и измени ответ.')}</p>}
              {right && <p className={styles.success}>{state.cleared.includes(state.room) ? text(`Key earned: ${room.keyEn}!`, `Ключ получен: ${room.keyRu}!`) : text('That seal opens! Keep going.', 'Печать открыта! Продолжай.')} {state.room === 2 && text(q.clueEn, q.clueRu)}</p>}
            </div>
            {right ? <button className={styles.primary} onClick={() => dispatch({ type: 'next' })}>{state.room === 3 && state.verseStep === 1 ? text('Open the final door →', 'Открыть последнюю дверь →') : text('Continue →', 'Продолжить →')}</button> : <button className={styles.hint} onClick={() => dispatch({ type: 'hint' })}>{text('Need a hint?', 'Нужна подсказка?')}</button>}
            {state.hint && <p className={styles.clue}>{hints[lang][state.room]}</p>}
          </>}

          {state.phase === 'victory' && <>
            <p className={styles.eyebrow}>{text('4 keys found · Adventure complete', 'Собраны 4 ключа · Приключение завершено')}</p>
            <h2 ref={heading} tabIndex={-1}>{text('The doors are open!', 'Двери открыты!')}</h2>
            {quote}
            <p>{text('Daniel kept praying. God rescued him. You discovered courage, prayer, trust, and rescue in his story.', 'Даниил продолжал молиться. Бог спас его. В этой истории ты узнал о смелости, молитве, доверии и спасении.')}</p>
            <p>{text('When doing right feels hard, what could you ask God for in prayer?', 'Когда трудно поступить правильно, о чём ты можешь попросить Бога в молитве?')}</p>
            <button className={styles.primary} onClick={() => dispatch({ type: 'reset' })}>{text('Play again', 'Играть снова')}</button>
            <Link className={styles.nextGame} href="/games">{text('Choose another adventure →', 'Выбрать новое приключение →')}</Link>
          </>}
        </section>
      </div>
    </div>
  </main>
}
