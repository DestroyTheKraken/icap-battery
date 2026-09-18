import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Brain, Compass, HeartPulse, TimerReset } from "lucide-react";
import { AppShell } from "@/components/cap/shell";
import { Button } from "@/components/ui/button";
import { ARM_COPY, BATTERY_DURATION, INSTRUMENT_META } from "@/lib/cap/instruments";
import { useCapStore } from "@/lib/cap/store";
import type { InstrumentId } from "@/lib/cap/types";

export const Route = createFileRoute("/")({ component: Home });

const ARMS = [
  {
    id: "Affect" as const,
    icon: HeartPulse,
    ids: ["hexaco"] as InstrumentId[],
  },
  {
    id: "Cognition" as const,
    icon: Brain,
    ids: ["icar"] as InstrumentId[],
  },
  {
    id: "Process" as const,
    icon: TimerReset,
    ids: ["aospan", "flanker", "dccs"] as InstrumentId[],
  },
  {
    id: "Interest" as const,
    icon: Compass,
    ids: ["interest"] as InstrumentId[],
  },
];

function Home() {
  const nav = useNavigate();
  const startBattery = useCapStore((s) => s.startBattery);
  const session = useCapStore((s) => s.session);
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);

  const goBattery = () => {
    startBattery();
    nav({ to: "/take" });
  };

  return (
    <AppShell>
      <section className="grid gap-10 pb-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            Cognitive · Affect · Process · Interest
          </p>
          <h1 className="font-display text-5xl leading-[1.05] md:text-6xl">
            iCAP is a free, open-source career discovery tool.
          </h1>
          <div className="max-w-prose space-y-4 text-muted">
            <p>
              You leave with one profile — not a pile of quiz names. That profile is the thing you
              take into a school search, a trade, or a second career.
            </p>
            <p>
              Whether you are a student or a career-changer, this is the sitting that has been
              missing while universities and businesses compete for your interest and trust.
              Knowing this picture at least gives you the confidence to pursue what is in front of
              you — and to walk away from what is not.
            </p>
            <p>
              Other online assessments measure one slice, or they are so subjective they never say
              the useful thing:{" "}
              <em className="text-fg">
                No. You are a poor fit for this. Steer clear of jobs like this.
              </em>
            </p>
            <p>
              When you finish, export the profile and take it to a free chat — Claude, Grok, or
              Gemini — with the prompt we give you. Use the job links too. The research names live
              on Sources if you want them. You do not need them to use the profile.
            </p>
          </div>
        </div>
        <div className="panel rounded-[var(--radius-xl)] border border-border p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-subtle">Session</p>
          <p className="mt-3 text-sm text-muted">{BATTERY_DURATION}</p>
          <p className="mt-2 text-xs text-subtle">
            One sitting. Six parts. Begin when you can give it the time.
          </p>
          <Button className="mt-5 w-full" onClick={goBattery}>
            Find my CAP
            <ArrowRight className="size-4" />
          </Button>
          {live && session?.status === "in_progress" && (
            <Button variant="outline" className="mt-2 w-full" onClick={() => nav({ to: "/take" })}>
              Resume
            </Button>
          )}
          {live && session?.status === "complete" && (
            <Button variant="outline" className="mt-2 w-full" onClick={() => nav({ to: "/results" })}>
              Open my profile
            </Button>
          )}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {ARMS.map((arm) => (
          <article
            key={arm.id}
            className="panel rounded-[var(--radius-xl)] border border-border p-5"
          >
            <arm.icon className="size-4 text-accent" />
            <h2 className="mt-4 font-display text-2xl">{arm.id}</h2>
            <p className="mt-2 text-sm text-muted">{ARM_COPY[arm.id].lead}</p>
            <ul className="mt-5 space-y-5">
              {arm.ids.map((id) => {
                const m = INSTRUMENT_META[id];
                return (
                  <li key={id}>
                    <p className="text-sm text-fg">{m.plainTitle}</p>
                    <p className="mt-1 text-xs leading-relaxed text-subtle">{m.why}</p>
                    <p className="mt-2 text-xs text-subtle">
                      {m.duration} · {m.items}
                    </p>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
