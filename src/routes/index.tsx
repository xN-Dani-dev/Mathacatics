import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { curriculum, loadDone } from "@/lib/curriculum";
import { useEffect, useState } from "react";
import { loadProfile, type Profile } from "@/lib/profile";
import { useDailyFish } from "@/lib/fish";
import { teaching } from "@/lib/lesson-content";
import { VisualDiagram } from "@/components/VisualDiagram";
import { Flame, Gem, Home, Trophy, User, BookOpen, Star, Lock, Check, Lightbulb } from "lucide-react";
import cat from "@/assets/cat.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Whiskers — Study Guide for Secondary Students" },
      { name: "description", content: "Bite-sized, game-like lessons for secondary students across every school system." },
      { property: "og:title", content: "Whiskers — Study Guide for Secondary Students" },
      { property: "og:description", content: "Bite-sized, game-like lessons for secondary students across every school system." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Unit banner colours: blue, sky, orange, blue (Geometry is blue, no gold).
const colors = ["bg-primary border-primary-shadow", "bg-sky border-sky", "bg-orange border-orange", "bg-primary border-primary-shadow"];
const offsets = [0, 60, 90, 60, 0, -60, -90, -60];

function Index() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => { const p = loadProfile(); if (!p || !p.year) nav({ to: "/onboarding" }); else { setProfile(p); setDone(loadDone()); } }, [nav]);
  if (!profile) return null;
  const units = curriculum[profile.year] ?? [];
  const currentId = units.flatMap((u) => u.lessons).find((l) => l.steps.length && !done.includes(l.id))?.id;
  return (
    <div className="flex min-h-screen font-sans">
      <aside className="hidden w-60 flex-col gap-2 border-r-2 p-4 md:flex">
        <h1 className="mb-6 px-3 text-3xl font-black text-primary">whiskers</h1>
        {[[Home, "Learn"], [BookOpen, "Subjects"], [Trophy, "Leaderboard"], [User, "Profile"]].map(([I, l], i) => {
          const Icon = I as typeof Home;
          return (
            <button key={l as string} className={`flex items-center gap-4 rounded-xl px-3 py-3 text-sm font-extrabold uppercase tracking-wide ${i === 0 ? "border-2 border-sky bg-sky/10 text-sky" : "text-muted-foreground hover:bg-muted"}`}>
              <Icon className="h-6 w-6" /> {l as string}
            </button>
          );
        })}
      </aside>

      <main className="flex flex-1 justify-center gap-10 px-4 py-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between md:hidden">
            <span className="text-2xl font-black text-primary">whiskers</span>
            <Stats />
          </div>
          {!units.length && (
            <div className="rounded-2xl border-2 p-6 text-center font-bold text-muted-foreground">
              <img src={cat} alt="" className="mx-auto h-24 w-24" />
              Lessons for {profile.year} are coming soon. Meow!
            </div>
          )}
          {units.map((u, ui) => (
            <section key={u.title} className="mb-12">
              <div className={`btn-3d mb-10 rounded-2xl p-4 text-primary-foreground ${colors[ui % colors.length]}`}>
                <p className="text-xs font-bold uppercase opacity-80">{profile.year} · Unit {ui + 1}</p>
                <h2 className="text-xl font-extrabold">{u.title}</h2>
              </div>
              <div className="relative flex flex-col items-center gap-8">
                {u.lessons.map((l, i) => {
                  const s = done.includes(l.id) ? "done" : !l.steps.length ? "locked" : l.id === currentId ? "current" : "open";
                  return (
                    <div key={l.id} style={{ transform: `translateX(${offsets[i % 8]}px)` }} className="relative flex flex-col items-center">
                      {s === "current" && (
                        <div className="absolute -top-10 animate-bounce whitespace-nowrap rounded-xl border-2 bg-card px-3 py-1 text-sm font-extrabold text-primary">START</div>
                      )}
                      <Link to="/lesson/$id" params={{ id: l.id }} className={`btn-3d flex h-[70px] w-[70px] items-center justify-center rounded-full ${s === "locked" ? "border-border bg-muted text-muted-foreground" : s === "done" ? "border-gold bg-gold text-primary-foreground" : "border-primary-shadow bg-primary text-primary-foreground"}`}>
                        {s === "done" ? <Check className="h-8 w-8" strokeWidth={4} /> : s === "locked" ? <Lock className="h-7 w-7" /> : <Star className="h-8 w-8 fill-current" />}
                      </Link>
                      <span className="mt-2 max-w-36 text-center text-xs font-extrabold text-muted-foreground">{l.title}</span>
                      {s === "current" && <img src={cat} alt="Whiskers the cat" className="absolute left-28 top-0 h-28 w-28 max-w-none" />}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <AcquiredKnowledge units={units} />
        </div>

        <aside className="hidden w-80 flex-col gap-6 lg:flex">
          <Stats />
          <div className="rounded-2xl border-2 p-5">
            <h3 className="font-extrabold">Daily Quests</h3>
            <p className="mt-3 text-sm font-bold">Earn 20 XP</p>
            <div className="mt-2 h-4 rounded-full bg-muted"><div className="h-4 w-2/3 rounded-full bg-gold" /></div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border-2 p-5">
            <img src={cat} alt="" className="h-16 w-16" />
            <p className="text-sm font-bold text-muted-foreground">Meow, {profile.name} {profile.avatar}! Your path: {profile.system === "EB" ? "European Baccalaureate" : "International Baccalaureate"} · {profile.year} · {profile.mathLevel} maths.</p>
          </div>
        </aside>
      </main>

      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t-2 bg-background py-3 md:hidden">
        <Home className="text-sky" /><BookOpen className="text-muted-foreground" /><Trophy className="text-muted-foreground" /><User className="text-muted-foreground" />
      </nav>
    </div>
  );
}

function AcquiredKnowledge({ units }: { units: { title: string; lessons: { id: string; title: string }[] }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!units.length) return null;
  return (
    <section className="mb-24">
      <div className="mb-6 flex items-center gap-3">
        <Lightbulb className="h-7 w-7 text-gold" />
        <h2 className="text-2xl font-black">Acquired knowledge</h2>
      </div>
      <p className="mb-6 text-sm font-bold text-muted-foreground">All the formulas and explanations from your lessons, with diagrams. Tap a lesson to review it.</p>
      {units.map((u) => (
        <div key={u.title} className="mb-6">
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-sky">{u.title}</h3>
          <div className="space-y-2">
            {u.lessons.map((l) => {
              const cards = teaching[l.title] ?? [];
              if (!cards.length) return null;
              const isOpen = open === l.id;
              return (
                <div key={l.id} className="rounded-2xl border-2">
                  <button onClick={() => setOpen(isOpen ? null : l.id)} className="flex w-full items-center justify-between p-4 text-left font-extrabold">
                    {l.title}
                    <span className="text-muted-foreground">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="space-y-4 border-t-2 p-4">
                      {cards.map((c, ci) => (
                        <div key={ci}>
                          <p className="mb-2 font-extrabold text-primary">{c.title}</p>
                          {c.body.map((b) => <p key={b} className="mb-1 text-sm font-semibold">{b}</p>)}
                          <div className="mt-2"><VisualDiagram visual={c.visual} /></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

function Stats() {
  const { fish } = useDailyFish();
  return (
    <div className="flex items-center gap-5 font-extrabold">
      <span className="flex items-center gap-1 text-primary"><Flame className="fill-current" />3</span>
      <span className="flex items-center gap-1 text-sky"><Gem className="fill-current" />500</span>
      <span className="flex items-center gap-1 text-sky" aria-label={`${fish} fish left today`}><span className="text-xl">🐟</span>{fish}</span>
    </div>
  );
}
