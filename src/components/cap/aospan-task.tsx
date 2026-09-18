import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CitationBlock } from "@/components/cap/citation-block";
import { InstrumentIntro, PracticeBanner } from "@/components/cap/intro";
import {
  AOSPAN_DUAL_PRAC,
  AOSPAN_LETTER_MS,
  AOSPAN_LETTER_PRAC,
  AOSPAN_MATH_PRAC_N,
  aospanMathCap,
  aospanScoredSizes,
} from "@/lib/cap/aospan";
import type { AospanScores, InstrumentResult } from "@/lib/cap/types";

const LETTERS = ["F", "H", "J", "K", "L", "N", "P", "Q", "R", "S", "T", "Y"] as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeMath() {
  let answer = 0;
  let d1 = 2,
    d2 = 1,
    d3 = 1,
    op1 = 1,
    op2 = 1;
  while (answer < 1 || answer > 9) {
    op1 = Math.random() < 0.5 ? 1 : 2;
    op2 = Math.random() < 0.5 ? 1 : 2;
    d1 = [2, 4, 6, 8, 10][Math.floor(Math.random() * 5)];
    d2 = Math.random() < 0.5 ? 1 : 2;
    d3 = 1 + Math.floor(Math.random() * 5);
    if (op1 === 1 && op2 === 1) answer = d1 * d2 + d3;
    if (op1 === 1 && op2 === 2) answer = d1 * d2 - d3;
    if (op1 === 2 && op2 === 1) answer = d1 / d2 + d3;
    if (op1 === 2 && op2 === 2) answer = d1 / d2 - d3;
  }
  const shownCorrect = Math.random() < 0.5;
  let shown = answer;
  if (!shownCorrect) {
    shown = 1 + Math.floor(Math.random() * 9);
    if (shown === answer) shown = answer === 9 ? 8 : answer + 1;
  }
  const text = `( ${d1} ${op1 === 1 ? "×" : "÷"} ${d2} ) ${op2 === 1 ? "+" : "−"} ${d3} = ?`;
  return { text, shown, truth: shownCorrect };
}

type Mode = "L" | "M" | "B";
type Block = "pracL" | "pracM" | "pracB" | "main";
type Phase = "intro" | "intro_math" | "intro_dual" | "intro_scored" | "run" | "recall" | "feedback";

export function AospanTask({ onDone }: { onDone: (r: InstrumentResult) => void }) {
  const sizes = useMemo(() => aospanScoredSizes(shuffle), []);
  const [startedAt] = useState(() => new Date().toISOString());
  const [phase, setPhase] = useState<Phase>("intro");
  const [mode, setMode] = useState<Mode>("L");
  const [block, setBlock] = useState<Block>("pracL");
  const [trial, setTrial] = useState(0);
  const [step, setStep] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [maths, setMaths] = useState<ReturnType<typeof makeMath>[]>([]);
  const [show, setShow] = useState<"math" | "prompt" | "letter">("letter");
  const [recalled, setRecalled] = useState<string[]>([]);
  const [mathOk, setMathOk] = useState<boolean[]>([]);
  const [log, setLog] = useState<AospanScores["trials"]>([]);
  const [mathT0, setMathT0] = useState(0);
  const [cap, setCap] = useState(8000);
  const [feedback, setFeedback] = useState("");
  const nextRef = useRef<() => void>(() => {});
  const timedOut = useRef(false);
  const solvedRef = useRef(false);
  const mathHitsRef = useRef(0);
  const mathOpsRef = useRef(0);
  const mathRTsRef = useRef<number[]>([]);

  const setSize = letters.length;

  const beginTrial = (nextMode: Mode, size: number, nextBlock: Block) => {
    timedOut.current = false;
    solvedRef.current = false;
    setLetters(shuffle([...LETTERS]).slice(0, size));
    setMaths(Array.from({ length: size }, () => makeMath()));
    setStep(0);
    setRecalled([]);
    setMathOk([]);
    setMode(nextMode);
    setBlock(nextBlock);
    setPhase("run");
    setShow(nextMode === "L" ? "letter" : "math");
    setMathT0(performance.now());
  };

  const startMathItem = (index: number) => {
    timedOut.current = false;
    solvedRef.current = false;
    setTrial(index);
    setMaths([makeMath()]);
    setStep(0);
    setMode("M");
    setBlock("pracM");
    setPhase("run");
    setShow("math");
    setMathT0(performance.now());
  };

  useEffect(() => {
    if (phase !== "run" || show !== "letter") return;
    const t = window.setTimeout(() => {
      if (step + 1 < setSize) {
        setStep((s) => s + 1);
        if (mode !== "L") {
          timedOut.current = false;
          solvedRef.current = false;
          setShow("math");
          setMathT0(performance.now());
        }
      } else {
        setPhase("recall");
      }
    }, AOSPAN_LETTER_MS);
    return () => window.clearTimeout(t);
  }, [phase, show, step, setSize, mode]);

  useEffect(() => {
    if (phase !== "run" || show !== "math" || block !== "main") return;
    const t = window.setTimeout(() => {
      if (timedOut.current) return;
      if (solvedRef.current) return;
      timedOut.current = true;
      setMathOk((prev) => [...prev, false]);
      mathOpsRef.current += 1;
      setShow("letter");
    }, cap);
    return () => window.clearTimeout(t);
  }, [phase, show, step, block, cap]);

  const completeTrial = (entry?: AospanScores["trials"][number]) => {
    const nextLog = entry ? [...log, entry] : log;
    if (entry) setLog(nextLog);

    const go = () => {
      if (block === "pracL") {
        const next = trial + 1;
        if (next < AOSPAN_LETTER_PRAC.length) {
          setTrial(next);
          beginTrial("L", AOSPAN_LETTER_PRAC[next], "pracL");
          return;
        }
        setTrial(0);
        setPhase("intro_math");
        return;
      }
      if (block === "pracM") {
        const next = trial + 1;
        if (next < AOSPAN_MATH_PRAC_N) {
          startMathItem(next);
          return;
        }
        setCap(aospanMathCap(mathRTsRef.current));
        setTrial(0);
        setPhase("intro_dual");
        return;
      }
      if (block === "pracB") {
        const next = trial + 1;
        if (next < AOSPAN_DUAL_PRAC.length) {
          setTrial(next);
          beginTrial("B", AOSPAN_DUAL_PRAC[next], "pracB");
          return;
        }
        setTrial(0);
        setPhase("intro_scored");
        return;
      }
      if (trial + 1 >= sizes.length) {
        const letterHits = nextLog.filter((t) => t.letterOk).length;
        onDone({
          instrument: "aospan",
          startedAt,
          finishedAt: new Date().toISOString(),
          aospan: {
            absolute: nextLog.filter((t) => t.letterOk).reduce((s, t) => s + t.setSize, 0),
            partialPct: nextLog.length ? letterHits / nextLog.length : 0,
            mathAccuracy: mathOpsRef.current
              ? mathHitsRef.current / mathOpsRef.current
              : 0,
            trials: nextLog,
          },
        });
        return;
      }
      const n = trial + 1;
      setTrial(n);
      beginTrial("B", sizes[n], "main");
    };

    nextRef.current = go;
    setPhase("feedback");
    if (block === "main") {
      window.setTimeout(() => nextRef.current(), 700);
    }
  };

  const clickReady = () => {
    if (timedOut.current || solvedRef.current) return;
    solvedRef.current = true;
    const rt = performance.now() - mathT0;
    if (block === "pracM") {
      mathRTsRef.current = [...mathRTsRef.current, rt];
    }
    setShow("prompt");
  };

  const answerMath = (saidTrue: boolean) => {
    if (timedOut.current) return;
    const m = maths[step];
    const ok = saidTrue === m.truth;
    if (block === "main") {
      mathOpsRef.current += 1;
      if (ok) mathHitsRef.current += 1;
    }
    const nextOk = [...mathOk, ok];
    setMathOk(nextOk);
    if (mode === "M") {
      setFeedback(ok ? "Correct" : "Wrong");
      completeTrial();
      return;
    }
    setShow("letter");
  };

  const finishRecall = () => {
    const letterOk =
      recalled.length === letters.length && recalled.every((ch, idx) => ch === letters[idx]);
    const mathAll = mode === "L" ? true : mathOk.length > 0 && mathOk.every(Boolean);
    if (block === "main") {
      completeTrial({
        setSize,
        letters,
        recalled,
        mathOk: mathAll,
        letterOk,
      });
    } else {
      setFeedback(letterOk ? "Letters correct" : "Letters missed");
      completeTrial();
    }
  };

  if (phase === "intro") {
    return (
      <InstrumentIntro
        kicker="Process · 3 of 6"
        title="Working memory"
        action="Begin letter practice"
        onAction={() => {
          setTrial(0);
          beginTrial("L", AOSPAN_LETTER_PRAC[0], "pracL");
        }}
      >
        <p>
          Dual-task working memory (Unsworth et al., 2005). You will (1) solve a simple math
          problem, (2) remember a letter shown on a cream card, (3) recall the letters in order
          after the set.
        </p>
        <p>
          Practice is required and not scored: 4 letter-only sets, then 15 math operations, then 3
          dual sets of size 2. The scored block is 15 sets (sizes 3–7, three of each). Math time cap
          is your practice speed (mean + 2.5 SD). About 20 minutes. Nothing starts until you press
          the button.
        </p>
        <CitationBlock id="aospan" />
      </InstrumentIntro>
    );
  }

  if (phase === "intro_math") {
    return (
      <InstrumentIntro
        kicker="Practice · math"
        title="Math practice"
        action="Start math practice"
        onAction={() => startMathItem(0)}
      >
        <p>
          {AOSPAN_MATH_PRAC_N} operations. Solve, press Ready, then say whether the shown answer is
          true or false. Not scored. This block sets your time cap for the real test.
        </p>
      </InstrumentIntro>
    );
  }

  if (phase === "intro_dual") {
    return (
      <InstrumentIntro
        kicker="Practice · dual"
        title="Letters and math together"
        action="Start dual practice"
        onAction={() => {
          setTrial(0);
          beginTrial("B", AOSPAN_DUAL_PRAC[0], "pracB");
        }}
      >
        <p>
          Math, then a letter, repeated. After the set, recall the letters in order. Three sets of
          size 2. Not scored.
        </p>
      </InstrumentIntro>
    );
  }

  if (phase === "intro_scored") {
    return (
      <InstrumentIntro
        kicker="Scored block"
        title="Practice complete"
        action="Begin scored items"
        onAction={() => {
          setTrial(0);
          beginTrial("B", sizes[0], "main");
        }}
      >
        <p>
          Same dual task. 15 sets, sizes 3–7. Math time cap is {Math.round(cap)} ms from your
          practice speed. Missed math still lets you continue; the absolute score is the sum of
          perfectly recalled set sizes. Keep math accuracy high (85% is the usual validity cut).
        </p>
      </InstrumentIntro>
    );
  }

  if (phase === "recall") {
    return (
      <section className="mx-auto max-w-md space-y-4 text-center">
        <p className="text-sm text-muted">
          {block === "main" ? `Scored recall · set ${trial + 1} / ${sizes.length}` : "Practice recall"}{" "}
          — select letters in order
        </p>
        <div className="min-h-12 rounded-[var(--radius-md)] border border-border bg-elevated px-3 py-2 font-mono text-xl tracking-[0.3em]">
          {recalled.join(" ") || "—"}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {LETTERS.map((L) => (
            <button
              key={L}
              onClick={() => recalled.length < 7 && setRecalled((r) => [...r, L])}
              className="h-12 rounded-[var(--radius-sm)] border border-border bg-surface font-mono text-lg hover:border-accent"
            >
              {L}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => setRecalled((r) => r.slice(0, -1))}>
            Delete
          </Button>
          <Button onClick={finishRecall}>Done</Button>
        </div>
      </section>
    );
  }

  if (phase === "feedback") {
    return (
      <section className="grid min-h-[40vh] place-items-center gap-6">
        {block !== "main" && <PracticeBanner>Practice · not scored</PracticeBanner>}
        <p className="font-display text-2xl">{feedback || "Next"}</p>
        {block !== "main" ? (
          <Button onClick={() => nextRef.current()}>Continue</Button>
        ) : (
          <p className="text-xs text-subtle">Continuing…</p>
        )}
      </section>
    );
  }

  if (show === "letter") {
    return (
      <section className="grid min-h-[50vh] place-items-center gap-4">
        {block !== "main" && <PracticeBanner>Practice · not scored</PracticeBanner>}
        <div className="grid size-36 place-items-center rounded-[var(--radius-md)] bg-letter font-display text-6xl text-bg">
          {letters[step]}
        </div>
      </section>
    );
  }

  const m = maths[step] ?? maths[0];
  if (show === "math") {
    return (
      <section className="grid min-h-[50vh] place-items-center gap-6">
        {block !== "main" && <PracticeBanner>Practice · not scored</PracticeBanner>}
        {block === "pracM" && (
          <p className="text-xs tabular-nums text-subtle">
            Math {trial + 1} / {AOSPAN_MATH_PRAC_N}
          </p>
        )}
        <p className="font-display text-3xl tabular-nums">{m?.text}</p>
        <Button onClick={clickReady}>Ready</Button>
        {block === "main" && <p className="text-xs text-subtle">Cap {Math.round(cap)} ms</p>}
      </section>
    );
  }

  return (
    <section className="grid min-h-[50vh] place-items-center gap-8">
      {block !== "main" && <PracticeBanner>Practice · not scored</PracticeBanner>}
      <p className="font-display text-6xl tabular-nums">{m?.shown}</p>
      <div className="flex gap-3">
        <Button variant="outline" className="min-w-28" onClick={() => answerMath(true)}>
          True
        </Button>
        <Button variant="outline" className="min-w-28" onClick={() => answerMath(false)}>
          False
        </Button>
      </div>
    </section>
  );
}
