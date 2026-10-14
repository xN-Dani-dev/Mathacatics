import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadProfile, type Profile } from "@/lib/profile";
import { Flame, Gem, Heart, Home, Trophy, User, BookOpen, Star, Lock, Check } from "lucide-react";
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

const units = [
  { title: "Unit 1 · Algebra Basics", color: "bg-accent border-accent-shadow", lessons: ["done", "done", "current", "locked", "locked"] },
  { title: "Unit 2 · Cell Biology", color: "bg-sky border-sky", lessons: ["locked", "locked", "locked", "locked"] },
];
const offsets = [0, 60, 90, 60, 0, -60, -90, -60];

function Index() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => { const p = loadProfile(); if (!p) nav({ to: "/onboarding" }); else setProfile(p); }, [nav]);
  if (!profile) return null;
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
          {units.map((u, ui) => (
            <section key={u.title} className="mb-12">
              <div className={`btn-3d mb-10 rounded-2xl p-4 text-accent-foreground ${u.color}`}>
                <p className="text-xs font-bold uppercase opacity-80">Section {ui + 1}</p>
                <h2 className="text-xl font-extrabold">{u.title}</h2>
              </div>
              <div className="relative flex flex-col items-center gap-6">
                {u.lessons.map((s, i) => (
                  <div key={i} style={{ transform: `translateX(${offsets[i % 8]}px)` }} className="relative">
                    {s === "current" && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce rounded-xl border-2 bg-card px-3 py-1 text-sm font-extrabold text-primary">START</div>
                    )}
                    <button className={`btn-3d flex h-[70px] w-[70px] items-center justify-center rounded-full ${s === "locked" ? "border-border bg-muted text-muted-foreground" : "border-primary-shadow bg-primary text-primary-foreground"}`}>
                      {s === "done" ? <Check className="h-8 w-8" strokeWidth={4} /> : s === "locked" ? <Lock className="h-7 w-7" /> : <Star className="h-8 w-8 fill-current" />}
                    </button>
                    {s === "current" && ui === 0 && <img src={cat} alt="Whiskers the cat" className="absolute left-28 top-0 h-32 w-32 max-w-none" />}
                  </div>
                ))}
              </div>
            </section>
          ))}
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
            <p className="text-sm font-bold text-muted-foreground">Meow, {profile.name} {profile.avatar}! Your path: {profile.system === "EB" ? "European Baccalaureate" : "International Baccalaureate"} · {profile.mathLevel} maths.</p>
          </div>
        </aside>
      </main>

      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t-2 bg-background py-3 md:hidden">
        <Home className="text-sky" /><BookOpen className="text-muted-foreground" /><Trophy className="text-muted-foreground" /><User className="text-muted-foreground" />
      </nav>
    </div>
  );
}

function Stats() {
  return (
    <div className="flex items-center gap-5 font-extrabold">
      <span className="flex items-center gap-1 text-primary"><Flame className="fill-current" />3</span>
      <span className="flex items-center gap-1 text-sky"><Gem className="fill-current" />500</span>
      <span className="flex items-center gap-1 text-destructive"><Heart className="fill-current" />5</span>
    </div>
  );
}
