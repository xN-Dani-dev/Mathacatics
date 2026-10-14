import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import cat from "@/assets/cat.png";
import { saveProfile, type Profile } from "@/lib/profile";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Create your profile — Whiskers" },
      { name: "description", content: "Set up your Whiskers profile: pick your school system and maths level." },
      { property: "og:title", content: "Create your profile — Whiskers" },
      { property: "og:description", content: "Set up your Whiskers profile: pick your school system and maths level." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});

const avatars = ["🐱", "🦊", "🐼", "🐸", "🦉", "🐯"];
const systems = [
  { id: "EB", label: "European Baccalaureate", emoji: "🇪🇺" },
  { id: "IB", label: "International Baccalaureate", emoji: "🌍" },
] as const;
const levels = [
  { id: "Higher", desc: "Advanced, most challenging maths", emoji: "🚀" },
  { id: "Average", desc: "Standard level maths", emoji: "📘" },
  { id: "Middle", desc: "Foundational maths", emoji: "🌱" },
] as const;

function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [system, setSystem] = useState<Profile["system"] | null>(null);
  const [level, setLevel] = useState<Profile["mathLevel"] | null>(null);

  const bubbles = ["Meow! I'm Whiskers. What should I call you?", "Which school system are you in?", "What level of maths do you take?"];
  const valid = [name.trim().length > 0 && name.trim().length <= 30, !!system, !!level][step];

  const next = () => {
    if (step < 2) return setStep(step + 1);
    saveProfile({ name: name.trim(), avatar, system: system!, mathLevel: level! });
    nav({ to: "/" });
  };

  const option = (active: boolean) =>
    `btn-3d flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left font-extrabold ${active ? "border-sky bg-sky/10 text-sky" : "hover:bg-muted"}`;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-6 font-sans">
      <div className="flex items-center gap-4">
        <button onClick={() => (step ? setStep(step - 1) : null)} className="text-muted-foreground" aria-label="Back"><X /></button>
        <div className="h-4 flex-1 rounded-full bg-muted">
          <div className="h-4 rounded-full bg-accent transition-all" style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <img src={cat} alt="Whiskers" className="h-28 w-28" />
        <div className="rounded-2xl border-2 p-4 text-lg font-bold">{bubbles[step]}</div>
      </div>

      <div className="mt-8 flex-1 space-y-3">
        {step === 0 && (
          <>
            <input
              autoFocus value={name} maxLength={30} onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border-2 bg-muted p-4 text-lg font-bold outline-none focus:border-sky"
            />
            <p className="pt-4 text-sm font-extrabold uppercase text-muted-foreground">Pick an avatar</p>
            <div className="grid grid-cols-6 gap-2">
              {avatars.map((a) => (
                <button key={a} onClick={() => setAvatar(a)} className={`btn-3d rounded-2xl border-2 p-3 text-3xl ${avatar === a ? "border-sky bg-sky/10" : ""}`}>{a}</button>
              ))}
            </div>
          </>
        )}
        {step === 1 && systems.map((s) => (
          <button key={s.id} onClick={() => setSystem(s.id)} className={option(system === s.id)}>
            <span className="text-3xl">{s.emoji}</span>{s.label}
          </button>
        ))}
        {step === 2 && levels.map((l) => (
          <button key={l.id} onClick={() => setLevel(l.id)} className={option(level === l.id)}>
            <span className="text-3xl">{l.emoji}</span>
            <span>{l.id}<span className="block text-sm font-bold text-muted-foreground">{l.desc}</span></span>
          </button>
        ))}
      </div>

      <button
        disabled={!valid} onClick={next}
        className="btn-3d mt-6 w-full rounded-2xl border-accent-shadow bg-accent p-4 text-lg font-extrabold uppercase text-accent-foreground disabled:border-border disabled:bg-muted disabled:text-muted-foreground"
      >
        {step < 2 ? "Continue" : "Start learning"}
      </button>
    </div>
  );
}
