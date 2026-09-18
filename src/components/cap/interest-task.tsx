import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { InstrumentIntro, PracticeBanner } from "@/components/cap/intro";
import { INTEREST_LIKERT, IP_ITEMS, RIASEC_BLURB, RIASEC_LABEL } from "@/lib/cap/interest-items";
import { scoreInterest } from "@/lib/cap/interest";
import type { InstrumentResult } from "@/lib/cap/types";
import { cn } from "@/lib/utils";

const PRACTICE = ["Eat lunch outdoors", "Watch a weather report"];

export function InterestTask({ onDone }: { onDone: (r: InstrumentResult) => void }) {
  const items = IP_ITEMS;
  const [startedAt] = useState(() => new Date().toISOString());
  const [phase, setPhase] = useState<"intro" | "practice" | "ready" | "run">("intro");
  const [pi, setPi] = useState(0);
  const [i, setI] = useState(0);
  const [responses, setResponses] = useState<number[]>(() => Array(items.length).fill(0));

  const likert = (onPick: (v: number) => void) => (
    <div className="likert-track">
      {INTEREST_LIKERT.map((opt) => (
        <button
          key={opt.v}
          onClick={() => onPick(opt.v)}
          className={cn(
            "flex min-h-20 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface px-2 py-3 text-center text-xs text-muted hover:border-accent hover:text-fg",
          )}
        >
          <span className="font-display text-lg text-fg">{opt.v}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );

  if (phase === "intro") {
    return (
      <InstrumentIntro
        kicker="Interest · 6 of 6"
        title="Work you want"
        action="Start practice"
        onAction={() => setPhase("practice")}
      >
        <p>
          You will see ordinary work activities. Rate how much you would like doing each one, from
          1 (strongly dislike) to 5 (strongly like). There is no right answer. Do not rate skill —
          only interest.
        </p>
        <p>
          Six kinds of work show up in the results: hands-on, investigate, create, help, lead, and
          organize. That pattern is what builds your job search list.
        </p>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {Object.entries(RIASEC_BLURB).map(([k, blurb]) => (
            <li key={k} className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2">
              <span className="text-fg">{RIASEC_LABEL[k as keyof typeof RIASEC_LABEL]}</span>
              <span className="mt-1 block text-xs text-subtle">{blurb}</span>
            </li>
          ))}
        </ul>
        <p>
          Two practice items first (not scored). Then the published 60-item Short Form. Nothing
          starts until you press the button.
        </p>
        <p className="text-sm">
          <Link to="/citations" className="underline decoration-border-strong underline-offset-4">
            Research names and sources
          </Link>
        </p>
      </InstrumentIntro>
    );
  }

  if (phase === "practice") {
    return (
      <section className="mx-auto max-w-2xl space-y-6">
        <PracticeBanner>
          Practice {pi + 1} / {PRACTICE.length} · not scored
        </PracticeBanner>
        <p className="font-display text-2xl leading-snug md:text-3xl">{PRACTICE[pi]}</p>
        {likert((v) => {
          void v;
          if (pi + 1 >= PRACTICE.length) {
            setPhase("ready");
            return;
          }
          setPi(pi + 1);
        })}
      </section>
    );
  }

  if (phase === "ready") {
    return (
      <InstrumentIntro
        kicker="Scored block"
        title="Practice complete"
        action="Begin scored items"
        onAction={() => setPhase("run")}
      >
        <p>
          {items.length} work activities. Rate interest, not ability. First impression is usually
          best.
        </p>
      </InstrumentIntro>
    );
  }

  const item = items[i];
  const pick = (v: number) => {
    const next = [...responses];
    next[item.n - 1] = v;
    setResponses(next);
    if (i + 1 >= items.length) {
      onDone({
        instrument: "interest",
        startedAt,
        finishedAt: new Date().toISOString(),
        interest: scoreInterest(next, items),
      });
      return;
    }
    setI(i + 1);
  };

  return (
    <section className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>Work you want · scored</span>
        <span className="tabular-nums">
          {i + 1} / {items.length}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full bg-accent transition-[width] duration-200"
          style={{ width: `${((i + 1) / items.length) * 100}%` }}
        />
      </div>
      <p className="font-display text-2xl leading-snug text-fg md:text-3xl">{item.text}</p>
      {likert(pick)}
    </section>
  );
}
