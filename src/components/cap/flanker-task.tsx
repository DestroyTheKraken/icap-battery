import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CitationBlock } from "@/components/cap/citation-block";
import { InstrumentIntro, PracticeBanner, Countdown } from "@/components/cap/intro";
import type { FlankerScores, InstrumentResult } from "@/lib/cap/types";

type Trial = { congruent: boolean; target: "L" | "R" };
type Phase =
  | "intro"
  | "practice_ready"
  | "practice_count"
  | "practice_fix"
  | "practice_stim"
  | "practice_fb"
  | "scored_ready"
  | "scored_count"
  | "fix"
  | "stim"
  | "iti";

function makeTrials(n: number): Trial[] {
  const half = Math.max(2, n / 2);
  const list: Trial[] = [];
  for (let i = 0; i < half; i++) {
    list.push({ congruent: true, target: i % 2 ? "L" : "R" });
    list.push({ congruent: false, target: i % 2 ? "L" : "R" });
  }
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function arrows(t: Trial) {
  const tgt = t.target === "L" ? "←" : "→";
  const flank = t.congruent ? tgt : t.target === "L" ? "→" : "←";
  return `${flank} ${flank} ${tgt} ${flank} ${flank}`;
}

function Example({ t, caption }: { t: Trial; caption: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4 text-center">
      <p className="font-display text-3xl tracking-[0.18em]">{arrows(t)}</p>
      <p className="mt-2 text-xs text-muted">{caption}</p>
    </div>
  );
}

const SCORED_N = 80;
const PRACTICE_N = 8;

export function FlankerTask({ onDone }: { onDone: (r: InstrumentResult) => void }) {
  const n = SCORED_N;
  const practiceN = PRACTICE_N;
  const trials = useMemo(() => makeTrials(n), [n]);
  const practice = useMemo(() => makeTrials(practiceN), [practiceN]);
  const [startedAt] = useState(() => new Date().toISOString());
  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [fb, setFb] = useState("");
  const logRef = useRef<FlankerScores["trials"]>([]);
  const t0Ref = useRef(0);
  const iRef = useRef(0);
  const doneRef = useRef(false);
  const lockedRef = useRef(true);
  const takenRef = useRef(false);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const isPractice = phase.startsWith("practice");
  const list = isPractice ? practice : trials;
  const stimPhase = phase === "stim" || phase === "practice_stim";
  const fixPhase = phase === "fix" || phase === "practice_fix";

  const finish = (rows: FlankerScores["trials"]) => {
    if (doneRef.current) return;
    doneRef.current = true;
    const mean = (xs: number[]) =>
      xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
    const group = (cong: boolean) => {
      const g = rows.filter((r) => r.congruent === cong);
      const ok = g.filter((r) => r.correct && r.rt != null);
      return {
        acc: g.length ? g.filter((r) => r.correct).length / g.length : 0,
        rt: mean(ok.map((r) => r.rt as number)),
      };
    };
    const congruent = group(true);
    const incongruent = group(false);
    onDone({
      instrument: "flanker",
      startedAt,
      finishedAt: new Date().toISOString(),
      flanker: {
        congruent,
        incongruent,
        costMs: incongruent.rt - congruent.rt,
        trials: rows,
      },
    });
  };

  const beginBlock = (which: "practice" | "scored") => {
    iRef.current = 0;
    setI(0);
    lockedRef.current = true;
    setPhase(which === "practice" ? "practice_count" : "scored_count");
  };

  const record = (entry: FlankerScores["trials"][number], practiced: boolean) => {
    if (takenRef.current) return;
    takenRef.current = true;
    if (practiced) {
      setFb(entry.timeout ? "Too slow" : entry.correct ? "Correct" : "Wrong — center arrow only");
      setPhase("practice_fb");
      return;
    }
    logRef.current = [...logRef.current, entry];
    const nextI = iRef.current + 1;
    if (nextI >= trials.length) {
      finish(logRef.current);
      return;
    }
    setPhase("iti");
    window.setTimeout(() => {
      iRef.current = nextI;
      setI(nextI);
      lockedRef.current = true;
      setPhase("fix");
    }, 400);
  };

  useEffect(() => {
    if (!fixPhase) return;
    const id = window.setTimeout(() => {
      t0Ref.current = performance.now();
      lockedRef.current = false;
      takenRef.current = false;
      setPhase(phase === "practice_fix" ? "practice_stim" : "stim");
    }, 500);
    return () => window.clearTimeout(id);
  }, [phase, fixPhase]);

  useEffect(() => {
    if (!stimPhase) return;
    const onKey = (e: KeyboardEvent) => {
      if (lockedRef.current) return;
      const k = e.key.toLowerCase();
      if (k !== "a" && k !== "l" && k !== "arrowleft" && k !== "arrowright") return;
      e.preventDefault();
      const resp: "L" | "R" = k === "a" || k === "arrowleft" ? "L" : "R";
      const t = list[iRef.current];
      record(
        {
          congruent: t.congruent,
          target: t.target,
          correct: resp === t.target,
          rt: performance.now() - t0Ref.current,
          timeout: false,
        },
        isPractice,
      );
    };
    window.addEventListener("keydown", onKey);
    const to = window.setTimeout(
      () => {
        const t = list[iRef.current];
        record(
          {
            congruent: t.congruent,
            target: t.target,
            correct: false,
            rt: null,
            timeout: true,
          },
          isPractice,
        );
      },
      isPractice ? 4000 : 1600,
    );
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(to);
    };
  }, [phase, stimPhase, isPractice, list]);

  if (phase === "intro") {
    return (
      <InstrumentIntro
        kicker="Process · 4 of 6"
        title="Focus in noise"
        action="I understand — continue"
        onAction={() => setPhase("practice_ready")}
      >
        <p>
          A row of five arrows will appear. Respond to the <strong className="text-fg">center</strong>{" "}
          arrow only. Ignore the four flankers.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Example
            t={{ congruent: true, target: "L" }}
            caption="Congruent — all point the same way. Answer: left (A)."
          />
          <Example
            t={{ congruent: false, target: "R" }}
            caption="Incongruent — flankers disagree. Answer: right (L)."
          />
        </div>
        <p>
          Keys: <strong className="text-fg">A</strong> or Left arrow = left.{" "}
          <strong className="text-fg">L</strong> or Right arrow = right. Be fast, but do not guess.
          Trials do not start until you press the button on the next screen, then a short countdown.
        </p>
        <p className="text-sm">Eight practice trials first. They are not scored. Then 80 scored trials.</p>
        <CitationBlock id="flanker" />
      </InstrumentIntro>
    );
  }

  if (phase === "practice_ready") {
    return (
      <InstrumentIntro
        kicker="Practice"
        title="Flanker practice"
        action="Start practice"
        onAction={() => beginBlock("practice")}
      >
        <p>
          {practiceN} trials. You will get immediate feedback. Nothing here counts toward your
          score. The block does not start until you press the button.
        </p>
      </InstrumentIntro>
    );
  }

  if (phase === "scored_ready") {
    return (
      <InstrumentIntro
        kicker="Scored block"
        title="Ready for the test"
        action="Begin scored trials"
        onAction={() => beginBlock("scored")}
      >
        <p>
          Same task. {n} trials. Feedback is off. A missed response (too slow) counts as an error.
        </p>
      </InstrumentIntro>
    );
  }

  if (phase === "practice_count") {
    return (
      <Countdown
        hint="Practice — fingers on A (left) and L (right)"
        onDone={() => {
          lockedRef.current = true;
          setPhase("practice_fix");
        }}
      />
    );
  }

  if (phase === "scored_count") {
    return (
      <Countdown
        hint="Scored block — fingers on A (left) and L (right)"
        onDone={() => {
          lockedRef.current = true;
          setPhase("fix");
        }}
      />
    );
  }

  if (phase === "practice_fb") {
    return (
      <section className="grid min-h-[50vh] place-items-center gap-6">
        <PracticeBanner>Practice</PracticeBanner>
        <p className="font-display text-3xl">{fb}</p>
        <Button
          onClick={() => {
            const next = iRef.current + 1;
            if (next >= practice.length) {
              setPhase("scored_ready");
              return;
            }
            iRef.current = next;
            setI(next);
            lockedRef.current = true;
            setPhase("practice_fix");
          }}
        >
          Next
        </Button>
      </section>
    );
  }

  const t = list[i] ?? list[0];
  const tap = (resp: "L" | "R") => {
    if (!stimPhase || lockedRef.current) return;
    record(
      {
        congruent: t.congruent,
        target: t.target,
        correct: resp === t.target,
        rt: performance.now() - t0Ref.current,
        timeout: false,
      },
      isPractice,
    );
  };

  return (
    <section className="grid min-h-[60vh] place-items-center gap-8">
      {isPractice && <PracticeBanner>Practice · not scored</PracticeBanner>}
      <p className="text-xs tabular-nums text-subtle">
        {i + 1} / {list.length}
      </p>
      <p className="font-display text-5xl tracking-[0.2em] md:text-7xl">
        {stimPhase ? arrows(t) : "+"}
      </p>
      <div className="flex gap-3">
        <Button variant="outline" className="min-w-28" onClick={() => tap("L")}>
          A · left
        </Button>
        <Button variant="outline" className="min-w-28" onClick={() => tap("R")}>
          L · right
        </Button>
      </div>
    </section>
  );
}
