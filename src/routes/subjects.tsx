import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { curriculum, loadDone } from "@/lib/curriculum";
import { loadProfile, type Profile } from "@/lib/profile";
import { ArrowLeft, Check, Star, Lock } from "lucide-react";
import cat from "@/assets/cat.png";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Subjects — Whiskers" },
      { name: "description", content: "Browse every unit and lesson in your Whiskers maths course." },
      { property: "og:title", content: "Subjects — Whiskers" },
      { property: "og:description", content: "Browse every unit and lesson in your Whiskers maths course." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Subjects,
});

const colors = ["bg-primary border-primary-shadow", "bg-sky border-sky", "bg-orange border-orange", "bg-primary border-primary-shadow"];

function Subjects() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => { const p = loadProfile(); if (!p || !p.year) nav({ to: "/onboarding" }); else { setProfile(p); setDone(loadDone()); } }, [nav]);
  if (!profile) return null;
  const units = curriculum[profile.year] ?? [];

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-6 font-sans">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/" className="text-muted-foreground" aria-label="Back home"><ArrowLeft /></Link>
        <h1 className="text-2xl font-black">Subjects</h1>
      </div>

      {!units.length && (
        <div className="rounded-2xl border-2 p-6 text-center font-bold text-muted-foreground">
          <img src={cat} alt="" className="mx-auto h-24 w-24" />
          Lessons for {profile.year} are coming soon. Meow!
        </div>
      )}

      {units.map((u, ui) => {
        const finished = u.lessons.filter((l) => done.includes(l.id)).length;
        return (
          <section key={u.title} className="mb-8">
            <div className={`btn-3d mb-4 flex items-center justify-between rounded-2xl p-4 text-primary-foreground ${colors[ui % colors.length]}`}>
              <div>
                <p className="text-xs font-bold uppercase opacity-80">{profile.year} · Unit {ui + 1}</p>
                <h2 className="text-xl font-extrabold">{u.title}</h2>
              </div>
              <span className="rounded-xl bg-white/20 px-3 py-1 text-sm font-extrabold">{finished}/{u.lessons.length}</span>
            </div>
            <div className="space-y-2">
              {u.lessons.map((l) => {
                const isDone = done.includes(l.id);
                const locked = !l.steps.length;
                return (
                  <Link key={l.id} to="/lesson/$id" params={{ id: l.id }} className={`btn-3d flex items-center gap-4 rounded-2xl border-2 p-4 font-extrabold ${locked ? "pointer-events-none text-muted-foreground" : "hover:bg-muted"}`}>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${isDone ? "border-gold bg-gold text-primary-foreground" : locked ? "border-border bg-muted" : "border-primary-shadow bg-primary text-primary-foreground"}`}>
                      {isDone ? <Check className="h-5 w-5" strokeWidth={4} /> : locked ? <Lock className="h-5 w-5" /> : <Star className="h-5 w-5 fill-current" />}
                    </span>
                    <span className="flex-1">{l.title}</span>
                    <span className="text-xs font-bold uppercase text-muted-foreground">{isDone ? "Done" : locked ? "Soon" : "Open"}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
