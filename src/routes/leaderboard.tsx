import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { curriculum, loadDone } from "@/lib/curriculum";
import { loadProfile, type Profile } from "@/lib/profile";
import { ArrowLeft, Trophy } from "lucide-react";
import cat from "@/assets/cat.png";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Whiskers" },
      { name: "description", content: "See how your XP stacks up against the Whiskers study crew." },
      { property: "og:title", content: "Leaderboard — Whiskers" },
      { property: "og:description", content: "See how your XP stacks up against the Whiskers study crew." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Leaderboard,
});

const rivals = [
  { name: "Mochi", avatar: "🐼", xp: 420 },
  { name: "Ziggy", avatar: "🦊", xp: 350 },
  { name: "Pip", avatar: "🐸", xp: 260 },
  { name: "Luna", avatar: "🦉", xp: 180 },
  { name: "Beans", avatar: "🐯", xp: 90 },
];

function Leaderboard() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [xp, setXp] = useState(0);
  useEffect(() => {
    const p = loadProfile();
    if (!p || !p.year) return nav({ to: "/onboarding" });
    setProfile(p);
    const done = loadDone();
    const total = (curriculum[p.year] ?? []).flatMap((u) => u.lessons).length;
    setXp(Math.min(done.length, total) * 20);
  }, [nav]);
  if (!profile) return null;

  const board = [...rivals, { name: profile.name, avatar: profile.avatar, xp, you: true }]
    .sort((a, b) => b.xp - a.xp);
  const rank = board.findIndex((r) => "you" in r && r.you) + 1;

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-6 font-sans">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/" className="text-muted-foreground" aria-label="Back home"><ArrowLeft /></Link>
        <h1 className="text-2xl font-black">Leaderboard</h1>
      </div>

      <div className="btn-3d mb-6 flex items-center gap-4 rounded-2xl border-gold bg-gold p-5 text-primary-foreground">
        <Trophy className="h-10 w-10" />
        <div>
          <p className="text-lg font-extrabold">You're #{rank} this week!</p>
          <p className="text-sm font-bold opacity-90">Finish lessons to earn 20 XP each and climb the board.</p>
        </div>
        <img src={cat} alt="" className="ml-auto h-16 w-16" />
      </div>

      <div className="space-y-2">
        {board.map((r, i) => (
          <div key={r.name} className={`flex items-center gap-4 rounded-2xl border-2 p-4 font-extrabold ${"you" in r && r.you ? "border-sky bg-sky/10" : ""}`}>
            <span className={`w-8 text-center text-lg ${i < 3 ? "text-gold" : "text-muted-foreground"}`}>{i + 1}</span>
            <span className="text-3xl">{r.avatar}</span>
            <span className="flex-1">{r.name}{"you" in r && r.you ? " (you)" : ""}</span>
            <span className="text-primary">{r.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
