export type Profile = { name: string; avatar: string; system: "EB" | "IB"; year: string; mathLevel: "Higher" | "Average" | "Middle" };
const KEY = "whiskers-profile";
export const loadProfile = (): Profile | null => {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
};
export const saveProfile = (p: Profile) => localStorage.setItem(KEY, JSON.stringify(p));
