import { useState } from "react";
import { Button } from "@/components/ui/button";
import { interpretProfile, type ScoreBundle } from "@/lib/cap/career-analyze";
import { cautionNotes, onetUrl, rankOccupations, zoneLabel } from "@/lib/cap/careers";
import { RIASEC_BLURB, RIASEC_LABEL, RIASEC_ORDER } from "@/lib/cap/interest-items";
import { useCapStore } from "@/lib/cap/store";
import type { CapSession } from "@/lib/cap/types";

function bundle(session: CapSession): ScoreBundle {
  const hex = session.results.hexaco?.hexaco;
  const icar = session.results.icar?.icar;
  const span = session.results.aospan?.aospan;
  const flank = session.results.flanker?.flanker;
  const dccs = session.results.dccs?.dccs;
  const interest = session.results.interest?.interest;
  return {
    holland: interest?.holland,
    interest: interest?.means,
    hexaco: hex ? { ...hex.factors, Altruism: hex.altruism } : undefined,
    icar: icar
      ? { total: icar.total, max: icar.max, subtests: icar.subtests }
      : undefined,
    aospan: span
      ? { absolute: span.absolute, mathAccuracy: span.mathAccuracy }
      : undefined,
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

export function CareerFit({ session }: { session: CapSession | null }) {
  const save = useCapStore((s) => s.saveCareerAnalysis);
  const interest = session?.results.interest?.interest;
  const ranked = rankOccupations(session);
  const caution = cautionNotes(session);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analysis = session?.careerAnalysis?.text;

  const runAi = async () => {
    if (!session) return;
    setBusy(true);
    setError(null);
    try {
      const r = await interpretProfile({ data: { scores: bundle(session) } });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      save({ generatedAt: new Date().toISOString(), text: r.text });
    } catch {
      setError("Could not reach the analyzer.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="panel rounded-[var(--radius-xl)] border border-border p-5 md:col-span-2">
      <p className="text-xs uppercase tracking-[0.16em] text-accent">Where to look</p>
      <h2 className="mt-2 font-display text-2xl">Starting jobs</h2>
      {interest ? (
        <>
          <p className="mt-3 text-sm text-muted">
            You lean{" "}
            <span className="font-display text-lg text-fg">
              {interest.holland
                .split("")
                .map((k) => RIASEC_LABEL[k as keyof typeof RIASEC_LABEL])
                .join(" · ")}
            </span>
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {RIASEC_ORDER.map((k) => (
              <li key={k} className="rounded-[var(--radius-sm)] border border-border px-3 py-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{RIASEC_LABEL[k]}</span>
                  <span className="tabular-nums">{interest.means[k].toFixed(2)}</span>
                </div>
                <p className="mt-1 text-xs text-subtle">{RIASEC_BLURB[k]}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-display text-xl">Start searching here</h3>
          <p className="mt-1 text-sm text-muted">
            Ranked from your profile. Starting points, not a verdict. Open a listing, then talk to
            someone who actually does the work.
          </p>
          <ol className="mt-4 space-y-2 text-sm">
            {ranked.map((occ, i) => (
              <li key={occ.onet} className="flex flex-wrap items-baseline justify-between gap-2">
                <span>
                  <span className="mr-2 tabular-nums text-subtle">{i + 1}.</span>
                  {occ.title}
                  <span className="ml-2 text-xs text-subtle">
                    {occ.cluster} · {zoneLabel(occ.zone)}
                  </span>
                </span>
                <a
                  href={onetUrl(occ.onet)}
                  className="text-xs underline decoration-border-strong underline-offset-4 hover:text-fg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open listing
                </a>
              </li>
            ))}
          </ol>
          {caution.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-display text-xl">Steer clear — unless you have a reason</h3>
              {caution.map((n) => (
                <p key={n} className="text-sm text-muted">
                  {n}
                </p>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="mt-4 text-sm text-subtle">
          Complete the “work you want” questions to build a search list.
        </p>
      )}

      <div className="mt-8 border-t border-border pt-5">
        <h3 className="font-display text-xl">AI interpretation</h3>
        <p className="mt-2 text-sm text-muted">
          Optional in-app reading. Or skip this and take the exported file to Claude, Grok, or
          Gemini — that is the better default. AI makes mistakes, so always double check anything
          AI gives you.
        </p>
        <Button className="mt-4" variant="outline" disabled={busy || !session} onClick={runAi}>
          {busy ? "Reading scores…" : analysis ? "Re-run interpretation" : "Interpret my profile"}
        </Button>
        {error && <p className="mt-3 text-sm text-accent">{error}</p>}
        {analysis && (
          <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-[var(--radius-md)] border border-border bg-bg p-4 font-sans text-sm leading-relaxed text-muted">
            {analysis}
          </pre>
        )}
      </div>
    </article>
  );
}
