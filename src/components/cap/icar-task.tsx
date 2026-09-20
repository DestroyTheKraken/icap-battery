import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CitationBlock } from "@/components/cap/citation-block";
import { GlyphLegend, MatrixFigure, RotationFigure } from "@/components/cap/figurals";
import { InstrumentIntro, PracticeBanner } from "@/components/cap/intro";
import { allIcarItems, type IcarItem } from "@/lib/cap/icar-items";
import type { IcarScores, InstrumentResult } from "@/lib/cap/types";
import { cn } from "@/lib/utils";

function scoreIcar(items: IcarItem[], choices: Array<number | null>): IcarScores {
  const responses = items.map((it, idx) => {
    const choice = choices[idx];
    return {
      id: it.id,
      choice,
      correct: choice != null && choice === it.answer,
    };
  });
  const by = (kind: IcarItem["kind"]) => {
    const subset = items
      .map((it, idx) => ({ it, ok: responses[idx].correct }))
      .filter((x) => x.it.kind === kind);
    return { correct: subset.filter((x) => x.ok).length, max: subset.length };
  };
  const series = by("series");
  const verbal = by("verbal");
  const matrix = by("matrix");
  const rotation = by("rotation");
  return {
    total: responses.filter((r) => r.correct).length,
    max: items.length,
    subtests: { series, verbal, matrix, rotation },
    responses,
  };
}

/** Practice uses dedicated seeds so figures never leak into the scored bank. */
const PRACTICE_ITEMS: IcarItem[] = [
  {
    id: "PR.series",
    kind: "series",
    prompt: "Practice. In the following number series, what number comes next?\n2, 4, 6, 8, …",
    options: ["9", "10", "12", "14", "16", "18", "None of these", "I don't know"],
    answer: 2,
    seed: 1,
  },
  {
    id: "PR.verbal",
    kind: "verbal",
    prompt: 'Practice. The opposite of "hot" is:',
    options: ["Warm", "Cold", "Spicy", "Bright", "Heavy", "Fast", "None of these", "I don't know"],
    answer: 2,
    seed: 2,
  },
  {
    id: "PR.matrix",
    kind: "matrix",
    prompt: "Practice. Which option completes the matrix?",
    options: ["A", "B", "C", "D", "E", "F", "None of these", "I don't know"],
    answer: 3,
    figural: "matrix",
    seed: 9001,
  },
  {
    id: "PR.rot",
    kind: "rotation",
    prompt: "Practice. Which option is a rotation of the target cube (not a mirror)?",
    options: ["A", "B", "C", "D", "E", "F", "G", "H"],
    answer: 4,
    figural: "rotation",
    seed: 9002,
  },
];

function ItemView({
  item,
  selected,
  setSelected,
  banner,
  indexLabel,
}: {
  item: IcarItem;
  selected: number | null;
  setSelected: (n: number) => void;
  banner?: string;
  indexLabel: string;
}) {
  const figuralGrid = item.figural === "rotation";
  return (
    <section className="mx-auto max-w-2xl space-y-6">
      {banner && <PracticeBanner>{banner}</PracticeBanner>}
      <div className="flex items-center justify-between text-sm text-muted">
        <span className="uppercase tracking-[0.14em]">{item.kind}</span>
        <span className="tabular-nums">{indexLabel}</span>
      </div>
      <p className="whitespace-pre-line font-display text-2xl leading-snug">{item.prompt}</p>
      {item.figural === "matrix" && (
        <div className="flex justify-center">
          <MatrixFigure item={item} />
        </div>
      )}
      {item.figural === "rotation" && (
        <div className="flex flex-col items-center gap-3">
          <RotationFigure item={item} />
          <p className="text-xs text-subtle">Target cube — each face has a different mark</p>
        </div>
      )}
      <div
        className={cn(
          "grid gap-2",
          figuralGrid ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2",
        )}
      >
        {item.options.map((opt, idx) => {
          const n = idx + 1;
          const matrixFigure = item.figural === "matrix" && n <= 6;
          const matrixText = item.figural === "matrix" && n > 6;
          const rotationFigure = item.figural === "rotation";
          return (
            <button
              key={opt + n}
              onClick={() => setSelected(n)}
              className={cn(
                "choice-tile flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-left text-sm",
                rotationFigure && "min-h-28 flex-col py-3",
                matrixText && "min-h-12",
                selected === n
                  ? "is-selected border-accent bg-elevated text-fg"
                  : "border-border bg-surface text-muted hover:text-fg",
              )}
            >
              {matrixFigure && <MatrixFigure item={item} choice={n} compact />}
              {rotationFigure && <RotationFigure item={item} choice={n} />}
              <span className="inline-flex items-center gap-2">
                <span className="font-mono text-xs text-subtle">
                  {String.fromCharCode(64 + n)}
                </span>
                {/* Matrix A–F figures only; G/H text like series. Rotation is figures only. */}
                {!item.figural || matrixText ? <span>{` ${opt}`}</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function IcarTask({ onDone }: { onDone: (r: InstrumentResult) => void }) {
  const items = useMemo(() => allIcarItems(), []);
  const [startedAt] = useState(() => new Date().toISOString());
  const [phase, setPhase] = useState<"intro" | "practice" | "ready" | "run">("intro");
  const [pi, setPi] = useState(0);
  const [i, setI] = useState(0);
  const [choices, setChoices] = useState<Array<number | null>>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [pFeedback, setPFeedback] = useState<string | null>(null);

  if (phase === "intro") {
    return (
      <InstrumentIntro
        kicker="Cognition · 2 of 6"
        title="Problem solving"
        action="Start practice"
        onAction={() => setPhase("practice")}
      >
        <p>
          Four item types: letter/number series, verbal reasoning, matrix completion, and cube
          rotation. Untimed — 60 puzzles. Most people need 45–60 minutes; spatial items take
          longer. Prefer “I don’t know” over a wild guess.
        </p>
        <p>
          Rotation items use cubes with{" "}
          <strong className="text-fg">a different mark on each side</strong> (Greek letters Α–Ζ
          here). Choose the option that could be a{" "}
          <strong className="text-fg">rotation</strong> of the target cube — not a mirror.
        </p>
        <GlyphLegend />
        <p className="text-sm">
          One practice item of each type comes first (not scored). Series, verbal, and figural
          items are original to iCAP.
        </p>
        <CitationBlock id="icar" />
      </InstrumentIntro>
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
          Same four item types. No feedback. {items.length} items. Take your time; “I don’t know” is
          always allowed.
        </p>
      </InstrumentIntro>
    );
  }

  if (phase === "practice") {
    const item = PRACTICE_ITEMS[pi];
    return (
      <div className="space-y-4">
        <ItemView
          item={item}
          selected={selected}
          setSelected={setSelected}
          banner={`Practice ${pi + 1} / ${PRACTICE_ITEMS.length} · not scored`}
          indexLabel={`${pi + 1} / ${PRACTICE_ITEMS.length}`}
        />
        {pFeedback && <p className="text-center text-sm text-fg">{pFeedback}</p>}
        <div className="flex justify-center">
          <Button
            disabled={selected == null}
            onClick={() => {
              if (selected == null) return;
              const ok = selected === item.answer;
              if (!pFeedback) {
                setPFeedback(
                  ok ? "Correct." : `The keyed answer was ${String.fromCharCode(64 + item.answer)}.`,
                );
                return;
              }
              setPFeedback(null);
              setSelected(null);
              if (pi + 1 >= PRACTICE_ITEMS.length) {
                setPhase("ready");
                return;
              }
              setPi(pi + 1);
            }}
          >
            {pFeedback ? "Next" : "Check"}
          </Button>
        </div>
      </div>
    );
  }

  const item = items[i];
  const commit = (choice: number) => {
    const next = [...choices, choice];
    setChoices(next);
    setSelected(null);
    if (i + 1 >= items.length) {
      onDone({
        instrument: "icar",
        startedAt,
        finishedAt: new Date().toISOString(),
        icar: scoreIcar(items, next),
      });
      return;
    }
    setI(i + 1);
  };

  return (
    <div className="space-y-4">
      <div className="h-1 overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full bg-accent transition-[width] duration-200"
          style={{ width: `${((i + 1) / items.length) * 100}%` }}
        />
      </div>
      <ItemView
        item={item}
        selected={selected}
        setSelected={setSelected}
        indexLabel={`${i + 1} / ${items.length}`}
      />
      <div className="flex justify-center">
        <Button disabled={selected == null} onClick={() => selected != null && commit(selected)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
