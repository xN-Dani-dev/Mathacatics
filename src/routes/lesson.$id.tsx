import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import cat from "@/assets/cat.png";
import { findLesson, markDone } from "@/lib/curriculum";
import { useDailyFish } from "@/lib/fish";
import { VisualDiagram } from "@/components/VisualDiagram";

export const Route = createFileRoute("/lesson/$id")({
  head: () => ({
    meta: [
      { title: "Lesson — Whiskers" },
      { name: "description", content: "A bite-sized maths lesson with Whiskers the cat." },
      { property: "og:title", content: "Lesson — Whiskers" },
      { property: "og:description", content: "A bite-sized maths lesson with Whiskers the cat." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonPage,
});

function FishCounter({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-1 font-extrabold text-sky" aria-label={`${count} fish left today`}>
      <span className="text-xl">🐟</span>{count}
    </span>
  );
}

function LessonPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const lesson = findLesson(id);
  const { fish, ready, eat } = useDailyFish();
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [snack, setSnack] = useState(0); // increments each time the cat eats a fish

  if (!lesson || !lesson.steps.length)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center font-sans">
        <img src={cat} alt="" className="h-32 w-32" />
        <p className="text-xl font-extrabold">This lesson is coming soon!</p>
        <Link to="/" className="btn-3d rounded-2xl border-primary-shadow bg-primary px-6 py-3 font-extrabold uppercase text-primary-foreground">Back</Link>
      </div>
    );

  const step = lesson.steps[Math.min(i, lesson.steps.length - 1)]!;
  const total = lesson.steps.filter((s) => s.type === "mcq").length;

  if (ready && fish === 0 && !finished) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 p-6 text-center font-sans">
        <img src={cat} alt="Whiskers" className="h-44 w-44" />
        <h1 className="text-3xl font-black text-primary">Whiskers ate all your fish!</h1>
        <p className="text-lg font-bold text-muted-foreground">You get 10 fresh fish every day. Come back tomorrow for more, or review your acquired knowledge on the home page.</p>
        <button onClick={() => nav({ to: "/" })} className="btn-3d w-full rounded-2xl border-primary-shadow bg-primary p-4 text-lg font-extrabold uppercase text-primary-foreground">Back home</button>
      </div>
    );
  }

  if (finished) {
    markDone(lesson.id);
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 p-6 text-center font-sans">
        <img src={cat} alt="Whiskers" className="h-44 w-44" />
        <h1 className="text-3xl font-black text-primary">Lesson complete!</h1>
        <div className="flex gap-4">
          <div className="rounded-2xl border-2 border-gold p-4 font-extrabold"><p className="text-xs uppercase text-gold">XP</p>{correct * 5 + 10}</div>
          <div className="rounded-2xl border-2 border-accent p-4 font-extrabold"><p className="text-xs uppercase text-accent">Score</p>{correct}/{total}</div>
          <div className="rounded-2xl border-2 border-sky p-4 font-extrabold"><p className="text-xs uppercase text-sky">Fish left</p>🐟 {fish}</div>
        </div>
        <button onClick={() => nav({ to: "/" })} className="btn-3d w-full rounded-2xl border-accent-shadow bg-accent p-4 text-lg font-extrabold uppercase text-accent-foreground">Continue</button>
      </div>
    );
  }

  const isRight = step.type === "mcq" && pick === step.answer;
  const advance = () => {
    setPick(null); setChecked(false);
    if (i + 1 >= lesson.steps.length) setFinished(true); else setI(i + 1);
  };
  const onMain = () => {
    if (step.type === "learn" || checked) return advance();
    setChecked(true);
    if (isRight) setCorrect(correct + 1);
    else { eat(); setSnack(snack + 1); }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-6 font-sans">
      <div className="flex items-center gap-4">
        <Link to="/" aria-label="Quit" className="text-muted-foreground"><X /></Link>
        <div className="h-4 flex-1 rounded-full bg-muted">
          <div className="h-4 rounded-full bg-accent transition-all" style={{ width: `${(i / lesson.steps.length) * 100}%` }} />
        </div>
        <FishCounter count={fish} />
      </div>

      <div className="mt-8 flex-1">
        {step.type === "learn" ? (
          <>
            <div className="flex items-end gap-3">
              <img src={cat} alt="" className="h-24 w-24" />
              <h2 className="pb-2 text-2xl font-black">{step.title}</h2>
            </div>
            <div className="mt-4 space-y-3 rounded-2xl border-2 p-5">
              {step.body.map((b) => <p key={b} className="text-lg font-semibold">{b}</p>)}
            </div>
            {step.visual && <div className="mt-4"><VisualDiagram visual={step.visual} /></div>}
          </>
        ) : (
          <>
            <p className="text-sm font-extrabold uppercase text-sky">Question</p>
            <h2 className="mt-1 text-2xl font-black">{step.q}</h2>
            <div className="mt-6 space-y-3">
              {step.options.map((o, k) => {
                const state = checked ? (k === step.answer ? "border-accent bg-accent/10 text-accent" : k === pick ? "border-destructive bg-destructive/10 text-destructive" : "") : pick === k ? "border-sky bg-sky/10 text-sky" : "hover:bg-muted";
                return (
                  <button key={o} disabled={checked} onClick={() => setPick(k)} className={`btn-3d w-full rounded-2xl border-2 p-4 text-left text-lg font-bold ${state}`}>{o}</button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className={`-mx-5 mt-6 rounded-t-2xl p-5 ${checked ? (isRight ? "bg-accent/15" : "bg-destructive/15") : ""}`}>
        {checked && step.type === "mcq" && (
          <div className="mb-4">
            {isRight ? (
              <p className="text-xl font-black text-accent">Purr-fect! 🎉</p>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0">
                  <img src={cat} alt="" className="h-14 w-14" />
                  <span key={snack} className="fish-snack absolute -right-3 top-0 text-2xl">🐟</span>
                </div>
                <p className="text-xl font-black text-destructive">Whiskers ate a fish!</p>
              </div>
            )}
            <p className="mt-1 font-semibold">{step.explain}</p>
          </div>
        )}
        <button
          disabled={step.type === "mcq" && pick === null}
          onClick={onMain}
          className={`btn-3d w-full rounded-2xl p-4 text-lg font-extrabold uppercase disabled:border-border disabled:bg-muted disabled:text-muted-foreground ${checked && !isRight ? "border-destructive bg-destructive text-destructive-foreground" : "border-accent-shadow bg-accent text-accent-foreground"}`}
        >
          {step.type === "learn" ? "Got it" : checked ? "Continue" : "Check"}
        </button>
      </div>
    </div>
  );
}
