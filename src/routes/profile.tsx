import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { curriculum, loadDone } from "@/lib/curriculum";
import { loadProfile, type Profile } from "@/lib/profile";
import { useDailyFish } from "@/lib/fish";
import { ArrowLeft, Flame, Gem, Pencil } from "lucide-react";
import cat from "@/assets/cat.png";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Whiskers" },
      { name: "description", content: "See your Whiskers profile, progress and daily fish." },
      { property: "og:title", content: "Your profile — Whiskers" },
      { property: "og:description", content: "See your Whiskers profile, progress and daily fish." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const nav = useNavigate();
  const { fish } = useDailyFish();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => { const p = loadProfile(); if (!p || !p.year) nav({ to: "/onboarding" }); else { setProfile(p); setDone(loadDone()); } }, [nav]);
  if (!profile) return null;

  const units = curriculum[profile.year] ?? [];
  const total = units.flatMap((u) => u.lessons).length;
  const finished = Math.min(done.length, total);
  const pct = total ? Math.round((finished / total) * 100) : 0;

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-6 font-sans">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/" className="text-muted-foreground" aria-label="Back home"><ArrowLeft /></Link>
        <h1 className="text-2xl font-black">Profile</h1>
      </div>

      <div className="mb-6 flex items-center gap-5 rounded-2xl border-2 p-6">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-sky bg-sky/10 text-5xl">{profile.avatar}</span>
        <div className="flex-1">
          <p className="text-2xl font-black">{profile.name}</p>
          <p className="text-sm font-bold text-muted-foreground">
            {profile.system === "EB" ? "European Baccalaureate" : "International Baccalaureate"} · {profile.year} · {profile.mathLevel} maths
          </p>
        </div>
        <Link to="/onboarding" className="btn-3d flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-extrabold hover:bg-muted">
          <Pencil className="h-4 w-4" /> Edit
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 p-4 text-center">
          <Flame className="mx-auto h-7 w-7 fill-current text-primary" />
          <p className="mt-1 text-2xl font-black">3</p>
          <p className="text-xs font-extrabold uppercase text-muted-foreground">Day streak</p>
        </div>
        <div className="rounded-2xl border-2 p-4 text-center">
          <Gem className="mx-auto h-7 w-7 fill-current text-sky" />
          <p className="mt-1 text-2xl font-black">500</p>
          <p className="text-xs font-extrabold uppercase text-muted-foreground">Gems</p>
        </div>
        <div className="rounded-2xl border-2 p-4 text-center">
          <span className="text-3xl">🐟</span>
          <p className="mt-1 text-2xl font-black">{fish}/10</p>
          <p className="text-xs font-extrabold uppercase text-muted-foreground">Fish left today</p>
        </div>
        <div className="rounded-2xl border-2 p-4 text-center">
          <span className="text-3xl">⭐</span>
          <p className="mt-1 text-2xl font-black">{finished * 20}</p>
          <p className="text-xs font-extrabold uppercase text-muted-foreground">Total XP</p>
        </div>
      </div>

      <div className="rounded-2xl border-2 p-5">
        <div className="mb-2 flex items-center justify-between font-extrabold">
          <span>{profile.year} course progress</span>
          <span className="text-primary">{pct}%</span>
        </div>
        <div className="h-4 rounded-full bg-muted">
          <div className="h-4 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm font-bold text-muted-foreground">{finished} of {total} lessons finished.</p>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 p-5">
        <img src={cat} alt="Whiskers" className="h-16 w-16" />
        <p className="text-sm font-bold text-muted-foreground">Keep going, {profile.name}! Every lesson earns 20 XP and keeps your fish safe. Meow!</p>
      </div>
    </div>
  );
}
