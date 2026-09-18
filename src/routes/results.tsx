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
import { HEXACO_NORMS_15 } from "@/lib/cap/archive";
import { HEXACO_FACTORS } from "@/lib/cap/hexaco-items";
import { RIASEC_LABEL, RIASEC_ORDER } from "@/lib/cap/interest-items";
import { useCapStore } from "@/lib/cap/store";

export const Route = createFileRoute("/results")({ component: Results });

function Results() {
  const session = useCapStore((s) => s.session);
  const reset = useCapStore((s) => s.reset);
  const hex = session?.results.hexaco?.hexaco;
  const icar = session?.results.icar?.icar;
  const span = session?.results.aospan?.aospan;
  const flank = session?.results.flanker?.flanker;
  const dccs = session?.results.dccs?.dccs;
  const interest = session?.results.interest?.interest;

  const radar = HEXACO_FACTORS.map((f) => ({
    factor: f.replace(" to Experience", "").replace("Honesty-Humility", "H").slice(0, 12),
    session: hex?.factors[f] ?? 0,
    norm: HEXACO_NORMS_15[f]?.m ?? 3,
  }));

  const riasec = RIASEC_ORDER.map((k) => ({
    factor: RIASEC_LABEL[k],
    session: interest?.means[k] ?? 0,
  }));

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Your iCAP</p>
          <h1 className="font-display text-4xl">The profile</h1>
          <p className="mt-2 max-w-prose text-sm text-muted">
            One file. Take it to a chat. Use the job links. The research names are on Sources if
            you want them.
          </p>
        </div>
        <Button variant="ghost" onClick={reset}>
          Clear session
        </Button>
      </div>

      <div className="mt-8">
        <WhatsNext session={session} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="panel rounded-[var(--radius-xl)] border border-border p-5">
          <h2 className="font-display text-2xl">Affect</h2>
          <p className="mt-1 text-sm text-muted">How you typically operate.</p>
          {hex ? (
            <ul className="mt-4 space-y-2 text-sm">
              {HEXACO_FACTORS.map((f) => (
                <li key={f} className="flex justify-between">
                  <span className="text-muted">{f}</span>
                  <span className="tabular-nums">{hex.factors[f].toFixed(2)}</span>
                </li>
              ))}
              <li className="flex justify-between border-t border-border pt-2">
                <span className="text-muted">Altruism</span>
                <span className="tabular-nums">{hex.altruism.toFixed(2)}</span>
              </li>
            </ul>
          ) : (
            <Empty />
          )}
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
                <PolarRadiusAxis domain={[1, 5]} tick={false} axisLine={false} />
                <Radar dataKey="norm" stroke="var(--color-border-strong)" fill="none" />
                <Radar dataKey="session" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel rounded-[var(--radius-xl)] border border-border p-5">
          <h2 className="font-display text-2xl">Cognition</h2>
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

        <article className="panel rounded-[var(--radius-xl)] border border-border p-5 md:col-span-2">
          <h2 className="font-display text-2xl">Interest</h2>
          <p className="mt-1 text-sm text-muted">What you would like doing.</p>
          {interest ? (
            <div className="mt-2 grid gap-4 md:grid-cols-[1fr_18rem] md:items-center">
              <div>
                <p className="text-sm text-muted">
                  You lean{" "}
                  <span className="font-display text-2xl text-fg">
                    {interest.holland
                      .split("")
                      .map((k) => RIASEC_LABEL[k as keyof typeof RIASEC_LABEL])
                      .join(" · ")}
                  </span>
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {RIASEC_ORDER.map((k) => (
                    <li key={k} className="flex justify-between gap-3">
                      <span className="text-muted">{RIASEC_LABEL[k]}</span>
                      <span className="tabular-nums">{interest.means[k].toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={riasec}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="factor" tick={{ fill: "var(--color-muted)", fontSize: 10 }} />
                    <PolarRadiusAxis domain={[1, 5]} tick={false} axisLine={false} />
                    <Radar dataKey="session" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <Empty />
          )}
        </article>

        <article className="panel rounded-[var(--radius-xl)] border border-border p-5 md:col-span-2">
          <h2 className="font-display text-2xl">Process</h2>
          <p className="mt-1 text-sm text-muted">The all-day load.</p>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <Stat
              label="Working memory"
              value={span ? String(span.absolute) : "—"}
              hint={span ? `Math accuracy ${(span.mathAccuracy * 100).toFixed(0)}%` : "Not completed"}
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

        <CareerFit session={session} />
      </div>

      <p className="mt-8 text-sm text-subtle">
        <Link to="/" className="underline decoration-border-strong underline-offset-4">
          Return to hub
        </Link>
        {" · "}
        <Link to="/citations" className="underline decoration-border-strong underline-offset-4">
          Ingredients (Sources)
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
      <p className="mt-1 font-display text-3xl tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
