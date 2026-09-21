import { useState } from "react";
import { CitationBlock } from "@/components/cap/citation-block";
import { InstrumentIntro, PracticeBanner } from "@/components/cap/intro";
import { HEXACO_ITEMS, LIKERT, scoreHexaco } from "@/lib/cap/hexaco";
import type { InstrumentResult } from "@/lib/cap/types";
import { cn } from "@/lib/utils";

const PRACTICE = [
  "I enjoy drinking coffee in the morning.",
  "I prefer the windows closed at night.",
];

export function HexacoTask({ onDone }: { onDone: (r: InstrumentResult) => void }) {
  const items = HEXACO_ITEMS;
  const [startedAt] = useState(() => new Date().toISOString());
  const [phase, setPhase] = useState<"intro" | "practice" | "ready" | "run">("intro");
  const [pi, setPi] = useState(0);
  const [i, setI] = useState(0);
  const [responses, setResponses] = useState<number[]>(() => Array(HEXACO_ITEMS.length).fill(0));

  const likert = (onPick: (v: number) => void) => (
    <div className="likert-track">
      {LIKERT.map((opt) => (
        <button
          key={opt.v}
          onClick={() => onPick(opt.v)}
          className={cn(
            "choice-tile flex min-h-20 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface px-2 py-3 text-center text-xs text-muted hover:text-fg",
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
        kicker="Affect · 1 of 6"
        title="Personality"
        action="Start practice"
        onAction={() => setPhase("practice")}
      >
        <p>
          <strong className="text-fg">How to read each item:</strong> every line is a statement
          about <em>you</em> (written as “I …”). Decide how true it is for you, then rate your
          agreement from 1 (strongly disagree) to 5 (strongly agree). You are not answering about
          someone else, and you are not being told what to do — you are describing yourself.
        </p>
        <p>
          There are no right answers. First impression is usually best. Sixty statements take most
          people about 10–15 minutes. Two unscored practice items come first so you can feel the
          scale. Nothing is recorded until you finish practice and start the scored block.
        </p>
        <CitationBlock id="hexaco" />
      </InstrumentIntro>
    );
  }

  if (phase === "practice") {
    return (
      <section className="mx-auto max-w-2xl space-y-6">
        <PracticeBanner>
          Practice {pi + 1} / {PRACTICE.length} · not scored
        </PracticeBanner>
        <p className="text-sm text-muted">About you — how much do you agree with this statement?</p>
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
          {items.length} statements. First impression is usually best. You can still use the full
          1–5 scale.
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
        instrument: "hexaco",
        startedAt,
        finishedAt: new Date().toISOString(),
        hexaco: scoreHexaco(next),
      });
      return;
    }
    setI(i + 1);
  };

  return (
    <section className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>Personality · scored</span>
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
      <p className="text-sm text-muted">About you — how much do you agree with this statement?</p>
      <p className="font-display text-2xl leading-snug text-fg md:text-3xl">{item.text}</p>
      {likert(pick)}
    </section>
  );
}
