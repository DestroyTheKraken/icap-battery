import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CitationBlock } from "@/components/cap/citation-block";
import { InstrumentIntro, PracticeBanner } from "@/components/cap/intro";
import type { DccsScores, InstrumentResult } from "@/lib/cap/types";
import { cn } from "@/lib/utils";

type Shape = "rabbit" | "boat";
type Color = "red" | "blue";
type Card = { shape: Shape; color: Color };
type Phase =
  | "intro"
  | "practice_shape"
  | "shape_ready"
  | "shape"
  | "switch"
  | "practice_color"
  | "color_ready"
  | "color";

const LEFT: Card = { shape: "rabbit", color: "red" };
const RIGHT: Card = { shape: "boat", color: "blue" };

function stim(n: number): Card[] {
  const base: Card[] = [
    { shape: "rabbit", color: "blue" },
    { shape: "boat", color: "red" },
  ];
  const out: Card[] = [];
  for (let i = 0; i < n; i++) out.push(base[i % 2]);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function match(rule: "shape" | "color", target: Card): "L" | "R" {
  if (rule === "shape") return target.shape === LEFT.shape ? "L" : "R";
  return target.color === LEFT.color ? "L" : "R";
}

function Face({ card, label }: { card: Card; label?: string }) {
  const red = card.color === "red";
  return (
    <div
      className={cn(
        "flex h-36 w-28 flex-col items-center justify-center rounded-[var(--radius-lg)] border-2",
        red ? "border-stim-red bg-surface text-stim-red" : "border-stim-blue bg-surface text-stim-blue",
      )}
    >
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
        {card.shape === "rabbit" ? (
          <g fill="currentColor">
            <ellipse cx="24" cy="18" rx="6" ry="14" />
            <ellipse cx="40" cy="18" rx="6" ry="14" />
            <circle cx="32" cy="40" r="14" />
          </g>
        ) : (
          <g fill="currentColor">
            <polygon points="8,36 56,36 48,48 16,48" />
            <polygon points="32,16 44,36 20,36" />
          </g>
        )}
      </svg>
      {label && (
        <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">{label}</span>
      )}
    </div>
  );
}

const SCORED_N = 12;

export function DccsTask({ onDone }: { onDone: (r: InstrumentResult) => void }) {
  const n = SCORED_N;
  const shapeTrials = useMemo(() => stim(n), [n]);
  const colorTrials = useMemo(() => stim(n), [n]);
  const pracShape = useMemo(() => stim(4), []);
  const pracColor = useMemo(() => stim(4), []);
  const [startedAt] = useState(() => new Date().toISOString());
  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [fb, setFb] = useState<string | null>(null);
  const t0 = useRef(0);
  const [log, setLog] = useState<DccsScores["trials"]>([]);
  const locked = useRef(true);

  const rule: "shape" | "color" =
    phase === "color" || phase === "practice_color" ? "color" : "shape";
  const practiced = phase === "practice_shape" || phase === "practice_color";
  const list =
    phase === "color"
      ? colorTrials
      : phase === "practice_color"
        ? pracColor
        : phase === "practice_shape"
          ? pracShape
          : shapeTrials;
  const target = list[i];

  const pack = (rows: DccsScores["trials"]) => {
    const rts = rows.filter((r) => r.rt != null).map((r) => r.rt as number);
    return {
      n: rows.length,
      correct: rows.filter((r) => r.correct).length,
      acc: rows.length ? rows.filter((r) => r.correct).length / rows.length : 0,
      rt: rts.length ? rts.reduce((a, b) => a + b, 0) / rts.length : 0,
    };
  };

  const respond = (side: "L" | "R") => {
    if (
      phase !== "shape" &&
      phase !== "color" &&
      phase !== "practice_shape" &&
      phase !== "practice_color"
    )
      return;
    if (locked.current) return;
    if (!target) return;
    const ok = side === match(rule, target);
    if (practiced) {
      locked.current = true;
      setFb(ok ? "Correct" : "Wrong — match the current rule");
      return;
    }
    const row = { block: rule, correct: ok, rt: performance.now() - t0.current };
    const next = [...log, row];
    setLog(next);
    if (i + 1 < list.length) {
      setI(i + 1);
      t0.current = performance.now();
      return;
    }
    if (phase === "shape") {
      setPhase("switch");
      return;
    }
    const pre = next.filter((t) => t.block === "shape");
    const post = next.filter((t) => t.block === "color");
    const postS = pack(post);
    onDone({
      instrument: "dccs",
      startedAt,
      finishedAt: new Date().toISOString(),
      dccs: {
        pre: pack(pre),
        post: postS,
        switchPass: postS.acc >= 0.75,
        trials: next,
      },
    });
  };

  useEffect(() => {
    if (
      phase !== "shape" &&
      phase !== "color" &&
      phase !== "practice_shape" &&
      phase !== "practice_color"
    )
      return;
    t0.current = performance.now();
    locked.current = true;
    const unlock = window.setTimeout(() => {
      locked.current = false;
    }, 280);
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "a" || k === "arrowleft") respond("L");
      if (k === "l" || k === "arrowright") respond("R");
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(unlock);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, i]);

  if (phase === "intro") {
    return (
      <InstrumentIntro
        kicker="Process · 5 of 6"
        title="Switching gears"
        action="Start shape practice"
        onAction={() => {
          setI(0);
          setFb(null);
          setPhase("practice_shape");
        }}
      >
        <p>
          Match the top card to one of the two bottom cards. First you sort by{" "}
          <strong className="text-fg">shape</strong> (rabbit with rabbit, boat with boat). After a
          rule change, you sort by <strong className="text-fg">color</strong>.
        </p>
        <p>
          A or left = left card. L or right = right card. Practice comes first for each rule; it is
          not scored. Then 12 scored shape trials and 12 scored color trials.
        </p>
        <CitationBlock id="dccs" />
      </InstrumentIntro>
    );
  }

  if (phase === "switch") {
    return (
      <InstrumentIntro
        kicker="Rule change"
        title="Now sort by color"
        action="Start color practice"
        onAction={() => {
          setI(0);
          setFb(null);
          setPhase("practice_color");
        }}
      >
        <p>Ignore shape. Red goes with red. Blue goes with blue. Four practice trials first.</p>
      </InstrumentIntro>
    );
  }

  if (phase === "shape_ready") {
    return (
      <InstrumentIntro
        kicker="Scored block"
        title="Practice complete"
        action="Begin scored shape trials"
        onAction={() => {
          setI(0);
          setFb(null);
          setPhase("shape");
        }}
      >
        <p>Sort by shape. {n} trials. No feedback.</p>
      </InstrumentIntro>
    );
  }

  if (phase === "color_ready") {
    return (
      <InstrumentIntro
        kicker="Scored block"
        title="Color practice complete"
        action="Begin scored color trials"
        onAction={() => {
          setI(0);
          setFb(null);
          setPhase("color");
        }}
      >
        <p>Sort by color. {n} trials. No feedback.</p>
      </InstrumentIntro>
    );
  }

  const advancePractice = () => {
    setFb(null);
    if (i + 1 < list.length) {
      setI(i + 1);
      return;
    }
    setI(0);
    setPhase(phase === "practice_shape" ? "shape_ready" : "color_ready");
  };

  return (
    <section className="grid min-h-[60vh] place-items-center gap-8">
      {practiced && (
        <PracticeBanner>
          Practice · sort by {rule} · {i + 1} / {list.length}
        </PracticeBanner>
      )}
      {!practiced && (
        <p className="text-sm uppercase tracking-[0.16em] text-accent">
          Scored · sort by {rule} · {i + 1} / {list.length}
        </p>
      )}
      {target && <Face card={target} />}
      <div className="flex gap-8">
        <button onClick={() => respond("L")} className="flex flex-col items-center gap-2">
          <Face card={LEFT} label="A" />
        </button>
        <button onClick={() => respond("R")} className="flex flex-col items-center gap-2">
          <Face card={RIGHT} label="L" />
        </button>
      </div>
      {fb && (
        <div className="space-y-3 text-center">
          <p className="font-display text-2xl">{fb}</p>
          <Button onClick={advancePractice}>
            {i + 1 < list.length ? "Next" : "Begin scored block"}
          </Button>
        </div>
      )}
    </section>
  );
}
