import { useEffect, useState } from "react";

export const DAILY_FISH = 10;
export const FISH_KEY = "whiskers-daily-fish";
export function dayKey(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function loadFish(now = new Date()): number {
  try {
    const saved = JSON.parse(localStorage.getItem(FISH_KEY) || "null");
    if (saved?.day === dayKey(now) && Number.isInteger(saved.remaining) && saved.remaining >= 0 && saved.remaining <= DAILY_FISH) return saved.remaining;
    localStorage.setItem(FISH_KEY, JSON.stringify({ day: dayKey(now), remaining: DAILY_FISH }));
  } catch { /* A browser with unavailable storage can still study. */ }
  return DAILY_FISH;
}
export function eatFish(now = new Date()) {
  const remaining = Math.max(0, loadFish(now) - 1);
  try { localStorage.setItem(FISH_KEY, JSON.stringify({ day: dayKey(now), remaining })); } catch { /* Storage may be blocked. */ }
  window.dispatchEvent(new Event("whiskers-fish"));
  return remaining;
}
export function useDailyFish() {
  const [fish, setFish] = useState(DAILY_FISH);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const refresh = () => { setFish(loadFish()); setReady(true); };
    refresh();
    const timer = window.setInterval(refresh, 1000);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("whiskers-fish", refresh);
    return () => { clearInterval(timer); window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); window.removeEventListener("whiskers-fish", refresh); };
  }, []);
  return { fish, ready, eat: () => setFish(eatFish()) };
}