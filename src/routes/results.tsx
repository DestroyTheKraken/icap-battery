import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { CareerFit } from "@/components/cap/career-fit";
import { AppShell } from "@/components/cap/shell";
import { WhatsNext } from "@/components/cap/whats-next";
import { Button } from "@/components/ui/button";
import { interpretProfile, type ScoreBundle } from "@/lib/cap/career-analyze";
import { rankOccupations } from "@/lib/cap/careers";
import { HEXACO_FACTORS } from "@/lib/cap/hexaco-items";
import { ARM_LETTER } from "@/lib/cap/instruments";
import { RIASEC_LABEL, RIASEC_ORDER } from "@/lib/cap/interest-items";
import { useCapStore } from "@/lib/cap/store";
import type { CapSession } from "@/lib/cap/types";

export const Route = createFileRoute("/results")({ component: Results });

function scoreBundle(session: CapSession): ScoreBundle {
  const hex = session.results.hexaco?.hexaco;
  const icar = session.results.icar?.icar;
  const span = session.results.aospan?.aospan;
  const flank = session.results.flanker?.flanker;
  const dccs = session.results.dccs?.dccs;
  const interest = session.results.interest?.interest;
  return {
    holland: interest?.holland,
    interest: interest?.means,
    hexaco: hex ? { ...hex.factors } : undefined,
    icar: icar ? { total: icar.total, max: icar.max, subtests: icar.subtests } : undefined,
    aospan: span ? { absolute: span.absolute, mathAccuracy: span.mathAccuracy } : undefined,
    flanker: flank
      ? {
          costMs: flank.costMs,
          congruentAcc: flank.congruent.acc,
          incongruentAcc: flank.incongruent.acc,
        }
      : undefined,
    dccs: dccs
      ? { switchPass: dccs.switchPass, preAcc: dccs.pre.acc, postAcc: dccs.post.acc }
      : undefined,
    ranked: rankOccupations(session).map((o) => `${o.title} (${o.holland}, zone ${o.zone})`),
  };
}

function Results() {
  const session = useCapStore((s) => s.session);
  const reset = useCapStore((s) => s.reset);
  const saveCareerAnalysis = useCapStore((s) => s.saveCareerAnalysis);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const hex = session?.results.hexaco?.hexaco;
  const icar = session?.results.icar?.icar;
  const span = session?.results.aospan?.aospan;
  const flank = session?.results.flanker?.flanker;
  const dccs = session?.results.dccs?.dccs;
  const interest = session?.results.interest?.interest;
  const hasAnalysis = Boolean(session?.careerAnalysis?.text);

  const radar = HEXACO_FACTORS.map((f) => ({
    factor: f.replace(" to Experience", "").replace("Honesty-Humility", "H").slice(0, 12),
    session: hex?.factors[f] ?? 0,
  }));

  const riasec = RIASEC_ORDER.map((k) => ({
    factor: RIASEC_LABEL[k],
    session: interest?.means[k] ?? 0,
  }));

  const runAi = async () => {
    if (!session) return;
    setAiBusy(true);
    setAiError(null);
    try {
      const r = await interpretProfile({ data: { scores: scoreBundle(session) } });
      if (!r.ok) {
        setAiError(r.error);
        return;
      }
      saveCareerAnalysis({ generatedAt: new Date().toISOString(), text: r.text });
    } catch {
      setAiError("Could not reach the analyzer.");
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <AppShell wide>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Your iCAP</p>
          <h1 className="font-display text-4xl">The Profile</h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            This page gathers everything from your session into one clear career profile you can
            actually use. Export it as a single file, then bring that file into a free chat with
            Claude, Grok, or Gemini and ask sharper questions about school, trades, or a next role.
            The job links below are starting points for real search — not a verdict about who you
            are. If you want the research names and methods behind each score, they live on Sources;
            you do not need them to move forward with the profile itself.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="accent" disabled={aiBusy || !session} onClick={runAi}>
            {aiBusy ? "Reading scores…" : hasAnalysis ? "Re-run AI interpretation" : "AI interpretation"}
          </Button>
          <Button variant="ghost" onClick={reset}>
            Clear session
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(18rem,24rem)_minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
        {/* Left: Interest, Where to look */}
        <aside className="order-2 flex flex-col gap-4 lg:order-1 lg:sticky lg:top-20">
          <article className="panel rounded-[var(--radius-xl)] border border-border p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-accent">
              {ARM_LETTER.Interest} · Interest
            </p>
            <h2 className="mt-2 font-display text-2xl">Interest</h2>
            <p className="mt-1 text-sm text-muted">What you would like doing.</p>
            {interest ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-muted">
                  You lean{" "}
                  <span className="font-display text-xl text-fg">
                    {interest.holland
                      .split("")
                      .map((k) => RIASEC_LABEL[k as keyof typeof RIASEC_LABEL])
                      .join(" · ")}
                  </span>
                </p>
                <ul className="space-y-1 text-sm">
                  {RIASEC_ORDER.map((k) => (
                    <li key={k} className="flex justify-between gap-3">
                      <span className="text-muted">{RIASEC_LABEL[k]}</span>
                      <span className="tabular-nums">{interest.means[k].toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riasec}>
                      <PolarGrid stroke="var(--color-border)" />
                      <PolarAngleAxis
                        dataKey="factor"
                        tick={{ fill: "var(--color-muted)", fontSize: 9 }}
                      />
                      <PolarRadiusAxis domain={[1, 5]} tick={false} axisLine={false} />
                      <Radar
                        dataKey="session"
                        stroke="var(--color-accent)"
                        fill="var(--color-accent)"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <Empty />
            )}
          </article>

          <CareerFit session={session} aiError={aiError} />
        </aside>

        {/* Center: instructions */}
        <div className="order-1 mx-auto flex w-full max-w-3xl flex-col gap-6 lg:order-2">
          <WhatsNext session={session} />
        </div>

        {/* Right: Cognition, Process, Affect */}
        <aside className="order-3 flex flex-col gap-4 lg:order-3 lg:sticky lg:top-20">
          <article className="panel rounded-[var(--radius-xl)] border border-border p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-accent">
              {ARM_LETTER.Cognition} · Cognition
            </p>
            <h2 className="mt-2 font-display text-2xl">Cognition</h2>
            <p className="mt-1 text-sm text-muted">How you solve new problems.</p>
            {icar ? (
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted">Total</span>
                  <span className="tabular-nums">
                    {icar.total} / {icar.max}
                  </span>
                </li>
                {Object.entries(icar.subtests).map(([k, v]) => (
                  <li key={k} className="flex justify-between">
                    <span className="capitalize text-muted">{k}</span>
                    <span className="tabular-nums">
                      {v.correct} / {v.max}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty />
            )}
          </article>

          <article className="panel rounded-[var(--radius-xl)] border border-border p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-accent">
              {ARM_LETTER.Process} · Process
            </p>
            <h2 className="mt-2 font-display text-2xl">Process</h2>
            <p className="mt-1 text-sm text-muted">The all-day load.</p>
            <div className="mt-4 space-y-5">
              <Stat
                label="Working memory"
                value={span ? String(span.absolute) : "—"}
                hint={
                  span ? `Math accuracy ${(span.mathAccuracy * 100).toFixed(0)}%` : "Not completed"
                }
              />
              <Stat
                label="Focus in noise"
                value={flank ? `${Math.round(flank.costMs)} ms extra` : "—"}
                hint={
                  flank
                    ? `Clear ${Math.round(flank.congruent.rt)} ms · Crowded ${Math.round(flank.incongruent.rt)} ms`
                    : "Not completed"
                }
              />
              <Stat
                label="Switching gears"
                value={dccs ? (dccs.switchPass ? "Held" : "Slipped") : "—"}
                hint={
                  dccs
                    ? `Before ${(dccs.pre.acc * 100).toFixed(0)}% · After ${(dccs.post.acc * 100).toFixed(0)}%`
                    : "Not completed"
                }
              />
            </div>
          </article>

          <article className="panel rounded-[var(--radius-xl)] border border-border p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-accent">
              {ARM_LETTER.Affect} · Affect
            </p>
            <h2 className="mt-2 font-display text-2xl">Affect</h2>
            <p className="mt-1 text-sm text-muted">How you typically operate.</p>
            {hex ? (
              <ul className="mt-4 space-y-2 text-sm">
                {HEXACO_FACTORS.map((f) => (
                  <li key={f} className="flex justify-between gap-3">
                    <span className="text-muted">{f}</span>
                    <span className="tabular-nums">{hex.factors[f].toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty />
            )}
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis
                    dataKey="factor"
                    tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                  />
                  <PolarRadiusAxis domain={[1, 5]} tick={false} axisLine={false} />
                  <Radar
                    dataKey="session"
                    stroke="var(--color-accent)"
                    fill="var(--color-accent)"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </aside>
      </div>

      <p className="mt-8 text-sm text-subtle">
        <Link
          to="/"
          className="interactive rounded-[var(--radius-sm)] underline decoration-border-strong underline-offset-4 hover:text-fg"
        >
          Return to hub
        </Link>
        {" · "}
        <Link
          to="/citations"
          className="interactive rounded-[var(--radius-sm)] underline decoration-border-strong underline-offset-4 hover:text-fg"
        >
          Sources
        </Link>
      </p>
    </AppShell>
  );
}

function Empty() {
  return <p className="mt-4 text-sm text-subtle">Not in this session.</p>;
}

function Stat({ label, value, hint }: { label: string; hint: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-subtle">{label}</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
