import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Brain, Compass, HeartPulse, TimerReset } from "lucide-react";
import { ConsentModal } from "@/components/cap/consent-modal";
import { AppShell } from "@/components/cap/shell";
import { Button } from "@/components/ui/button";
import { ARM_COPY, INSTRUMENT_META } from "@/lib/cap/instruments";
import { PILOT_CONSENT_VERSION } from "@/lib/cap/pilot";
import { useCapStore } from "@/lib/cap/store";
import type { InstrumentId } from "@/lib/cap/types";

export const Route = createFileRoute("/")({ component: Home });

/** Top row follows site-wide I → C → A; Process stays full-width underneath. */
const TOP_ARMS = [
  {
    id: "Interest" as const,
    icon: Compass,
    ids: ["interest"] as InstrumentId[],
  },
  {
    id: "Cognition" as const,
    icon: Brain,
    ids: ["icar"] as InstrumentId[],
  },
  {
    id: "Affect" as const,
    icon: HeartPulse,
    ids: ["hexaco"] as InstrumentId[],
  },
];

const PROCESS_ARM = {
  id: "Process" as const,
  icon: TimerReset,
  ids: ["aospan", "flanker", "dccs"] as InstrumentId[],
};

function Home() {
  const nav = useNavigate();
  const startBattery = useCapStore((s) => s.startBattery);
  const acceptConsent = useCapStore((s) => s.acceptConsent);
  const consent = useCapStore((s) => s.consent);
  const session = useCapStore((s) => s.session);
  const [live, setLive] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  useEffect(() => setLive(true), []);

  const beginAfterConsent = () => {
    startBattery();
    setConsentOpen(false);
    nav({ to: "/take" });
  };

  const goBattery = () => {
    const consentOk = consent?.version === PILOT_CONSENT_VERSION;
    if (!consentOk) {
      setConsentOpen(true);
      return;
    }
    beginAfterConsent();
  };

  const renderArm = (arm: (typeof TOP_ARMS)[number] | typeof PROCESS_ARM) => (
    <article
      key={arm.id}
      className="panel flex h-full min-w-0 flex-col rounded-[var(--radius-xl)] border border-border p-5"
    >
      <arm.icon className="size-4 text-accent" />
      <h2 className="mt-4 font-display text-2xl">{arm.id}</h2>
      <p className="mt-2 text-sm text-muted">{ARM_COPY[arm.id].lead}</p>
      <ul className={arm.ids.length > 1 ? "mt-5 space-y-5" : "mt-4 space-y-3"}>
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
  );

  return (
    <AppShell wide>
      <section className="grid gap-10 pb-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            Interest · Cognition · Affect · Process
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
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
            <p>
              When you have a quiet stretch of time, you are welcome to begin. The full iCAP sitting
              usually takes about <strong className="font-medium text-fg">90 to 180 minutes</strong>{" "}
              across six parts in one go.
            </p>
            <p>
              A few assessments are timed (working memory and focus-in-noise); the rest are untimed,
              so you can think carefully without a clock. Start when you can give the sitting your
              attention — your profile will be waiting when you finish.
            </p>
          </div>
          <Button className="mt-5 w-full" onClick={goBattery}>
            Take the iCAP
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

      <div className="grid gap-4">
        <div className="grid items-stretch gap-4 lg:grid-cols-3">{TOP_ARMS.map(renderArm)}</div>
        {renderArm(PROCESS_ARM)}
      </div>

      <ConsentModal
        open={consentOpen}
        onCancel={() => setConsentOpen(false)}
        onAccept={(record) => {
          acceptConsent(record);
          beginAfterConsent();
        }}
      />
    </AppShell>
  );
}
