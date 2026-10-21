"use client";
import { useSyncExternalStore } from "react";
const memory = new Map<string, string | null>();
const listeners = new Set<() => void>();
let unavailable = false;
let revision = 0;
function emit() { revision++; listeners.forEach(listener => listener()); }
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key.startsWith("jd-why-v1-")) {
      if (event.key) memory.delete(event.key); else memory.clear();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
export function getSaved(key: string): string | null {
  if (typeof window === "undefined") return null;
  if (memory.has(key)) return memory.get(key) ?? null;
  let raw: string | null = null;
  try { raw = localStorage.getItem(key); } catch { unavailable = true; }
  memory.set(key, raw); return raw;
}
export function save(key: string, value: unknown) {
  const raw = JSON.stringify(value); memory.set(key, raw);
  try { localStorage.setItem(key, raw); } catch { unavailable = true; }
  emit();
}
export function useSaved(key: string) {
  const raw = useSyncExternalStore(subscribe, () => getSaved(key), () => null);
  useSyncExternalStore(subscribe, () => revision, () => 0);
  return { raw, temporary: unavailable, write: (value: unknown) => save(key, value) };
}
export function useNotebook() {
  useSyncExternalStore(subscribe, () => revision, () => 0);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  return { hydrated, get: getSaved, get temporary() { return unavailable; } };
}
