import { teaching, questionsFor, type Visual } from "./lesson-content";

export type Step =
  | { type: "learn"; title: string; body: string[]; visual?: Visual }
  | { type: "mcq"; q: string; options: string[]; answer: number; explain: string };
export type Lesson = { id: string; title: string; steps: Step[] };
export type Unit = { title: string; topic: string; lessons: Lesson[] };

// Every lesson = visual teaching cards + 10 questions from the bank.
const build = (id: string, title: string): Lesson => ({
  id,
  title,
  steps: [
    ...(teaching[title] ?? []).map((t): Step => ({ type: "learn", title: t.title, body: t.body, visual: t.visual })),
    ...questionsFor(title),
  ],
});

const unit = (prefix: string, title: string, lessons: string[]): Unit => ({
  title,
  topic: title,
  lessons: lessons.map((t, i) => build(`${prefix}-${i + 1}`, t)),
});

const S1: Unit[] = [
  unit("s1", "Numbers", ["Natural & integer numbers", "Primes, factors & divisibility", "Operations & order of operations", "Fractions & decimals"]),
  unit("s1", "Sets", ["Sets & Venn diagrams"]),
  unit("s1", "Algebra", ["Patterns & sequences", "Expressions & linear equations"]),
  unit("s1", "Geometry", ["Plotting points", "2D shapes", "Lines, angles & triangles", "3D shapes & nets", "Perimeter, area & units"]),
];
// Fix ids to match the original s1-1 … s1-12 sequence so saved progress still works.
S1.flatMap((u) => u.lessons).forEach((l, i) => (l.id = `s1-${i + 1}`));

const S2: Unit[] = [
  unit("s2", "Numbers", ["Rounding & significant figures", "Adding & subtracting fractions", "Multiplying & dividing fractions", "Powers & power rules", "Percentages", "Ratios & scale drawings"]),
  unit("s2", "Algebra", ["Reading graphs", "Linear & quadratic situations", "Expanding brackets", "Linear equations"]),
  unit("s2", "Geometry", ["Classifying quadrilaterals & triangles", "Ruler & compass constructions", "Symmetry", "Areas of quadrilaterals & triangles", "Circles & π", "Area & volume units"]),
  unit("s2", "Statistics", ["Collecting data", "Statistical diagrams", "Mean, median & mode"]),
];
const S3: Unit[] = [
  unit("s3", "Numbers", ["Square roots", "Negative powers & bases", "Scientific notation", "Inverses", "Percentage increase & decrease"]),
  unit("s3", "Algebra", ["Linear functions y = ax + b", "Gradients & intercepts", "Direct & inverse proportion", "Rearranging formulas", "Expanding & factorising", "Harder linear equations"]),
  unit("s3", "Geometry", ["Angles & parallel lines", "Transformations"]),
  unit("s3", "Statistics", ["Statistics & probability"]),
];
// Sequential ids across units so every lesson id is unique.
S2.flatMap((u) => u.lessons).forEach((l, i) => (l.id = `s2-${i + 1}`));
S3.flatMap((u) => u.lessons).forEach((l, i) => (l.id = `s3-${i + 1}`));

export const curriculum: Record<string, Unit[]> = { S1, S2, S3 };
export const findLesson = (id: string) =>
  Object.values(curriculum).flat().flatMap((u) => u.lessons).find((l) => l.id === id);

const DONE = "whiskers-done";
export const loadDone = (): string[] => { try { return JSON.parse(localStorage.getItem(DONE) || "[]"); } catch { return []; } };
export const markDone = (id: string) => localStorage.setItem(DONE, JSON.stringify([...new Set([...loadDone(), id])]));
