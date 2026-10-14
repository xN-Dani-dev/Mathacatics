import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { X, Heart } from "lucide-react";
import cat from "@/assets/cat.png";
import { findLesson, markDone } from "@/lib/curriculum";

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

function LessonPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const lesson = findLesson(id);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!lesson || !lesson.steps.length)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center font-sans">
        <img src={cat} alt="" className="h-32 w-32" />
        <p className="text-xl font-extrabold">This lesson is coming soon!</p>
        <Link to="/" className="btn-3d rounded-2xl border-primary-shadow bg-primary px-6 py-3 font-extrabold uppercase text-primary-foreground">Back</Link>
      </div>
    );

  const step = lesson.steps[i];
  const total = lesson.steps.filter((s) => s.type === "mcq").length;

  if (finished || hearts === 0) {
    const won = hearts > 0;
    if (won) markDone(lesson.id);
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 p-6 text-center font-sans">
        <img src={cat} alt="Whiskers" className="h-44 w-44" />
        <h1 className="text-3xl font-black text-primary">{won ? "Lesson complete!" : "Out of hearts!"}</h1>
        <div className="flex gap-4">
          <div className="rounded-2xl border-2 border-gold p-4 font-extrabold"><p className="text-xs uppercase text-gold">XP</p>{won ? correct * 5 + 10 : 0}</div>
          <div className="rounded-2xl border-2 border-accent p-4 font-extrabold"><p className="text-xs uppercase text-accent">Score</p>{correct}/{total}</div>
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
    if (isRight) setCorrect(correct + 1); else setHearts(hearts - 1);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-6 font-sans">
      <div className="flex items-center gap-4">
        <Link to="/" aria-label="Quit" className="text-muted-foreground"><X /></Link>
        <div className="h-4 flex-1 rounded-full bg-muted">
          <div className="h-4 rounded-full bg-accent transition-all" style={{ width: `${(i / lesson.steps.length) * 100}%` }} />
        </div>
        <span className="flex items-center gap-1 font-extrabold text-destructive"><Heart className="fill-current" />{hearts}</span>
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
            <p className={`text-xl font-black ${isRight ? "text-accent" : "text-destructive"}`}>{isRight ? "Purr-fect! 🎉" : "Not quite…"}</p>
            <p className="font-semibold">{step.explain}</p>
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
