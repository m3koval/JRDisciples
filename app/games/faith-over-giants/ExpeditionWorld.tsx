import styles from './ExpeditionWorld.module.css'

/** Original illustrative expedition, not a depiction of Joshua or Caleb. */
export default function ExpeditionWorld({ progress, helpers, isRu }: { progress: number; helpers: number; isRu: boolean }) {
  return (
    <div className={styles.world} aria-hidden="true">
      <div className={styles.landscape} />
      <svg className={styles.trail} viewBox="0 0 1000 600" preserveAspectRatio="none">
        <path d="M-40 610 Q30 470 120 470 H820 Q875 470 875 385" fill="none" stroke="#698449" strokeWidth="94" />
        <path d="M-40 610 Q30 470 120 470 H820 Q875 470 875 385" fill="none" stroke="#e3bc7c" strokeWidth="70" />
        <path d="M-40 610 Q30 470 120 470 H820 Q875 470 875 385" fill="none" stroke="#f4d79d" strokeWidth="48" />
        <path d="M120 470 H760" pathLength="100" fill="none" stroke="#7b973e" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${progress} 100`} />
        <path d="M180 453l12 0m95 36h12m110-36h12m100 36h12m110-36h12" stroke="#bd925b" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <div className={styles.camp}>
        <span>{isRu ? 'Лагерь' : 'Camp'}</span>
      </div>
      <div className={styles.michael} style={{ left: `calc(12% + ${progress * .64}%)` }}>
        <div className={styles.shadow} />
        <div className={styles.sprite} />
        <span className={styles.name}>{isRu ? 'Майкл' : 'Michael'}</span>
      </div>
      <div className={styles.teamCount}>{isRu ? 'Команда' : 'Team'} <strong>+{helpers}</strong></div>
    </div>
  )
}
