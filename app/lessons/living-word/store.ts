export const STORAGE_KEY = 'living-word-progress-v1'
const EVENT = 'living-word-progress-change'
// Read once: quota failures must never let an older saved snapshot overwrite live play.
export function createProgressStore(empty: string) {
  let memory = empty
  let initialized = false
  let persistent = true
  function snapshot() {
    if (!initialized) {
      try { memory = localStorage.getItem(STORAGE_KEY) ?? empty } catch { persistent = false }
      initialized = true
    }
    return memory
  }
  function save(raw: string) {
    initialized = true
    memory = raw
    try { localStorage.setItem(STORAGE_KEY, raw); persistent = true } catch { persistent = false }
    window.dispatchEvent(new Event(EVENT))
  }
  function subscribe(callback: () => void) {
    const storage = (e: StorageEvent) => {
      if (persistent && (e.key === STORAGE_KEY || e.key === null)) { memory = e.newValue ?? empty; initialized = true; callback() }
    }
    window.addEventListener(EVENT, callback)
    window.addEventListener('storage', storage)
    return () => {window.removeEventListener(EVENT,callback); window.removeEventListener('storage',storage)}
  }
  return {snapshot, save, subscribe, canPersist: () => persistent}
}
