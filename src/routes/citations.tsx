import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/cap/shell";
import { CitationBlock } from "@/components/cap/citation-block";
import { BATTERY_ORDER, INSTRUMENT_META } from "@/lib/cap/instruments";

export const Route = createFileRoute("/citations")({ component: Citations });

function Citations() {
  return (
    <AppShell dense>
      <p className="text-xs uppercase tracking-[0.18em] text-accent">Behind the profile</p>
      <h1 className="mt-2 font-display text-4xl">Sources</h1>
      <p className="mt-3 max-w-prose text-muted">
        This page is the paper trail: who made each tool, the studies behind it, and the legal
        names. You can skip it and still use your profile. It is here if you want to look under
        the hood.
      </p>
      <div className="mt-10 space-y-10">
        {BATTERY_ORDER.map((id) => (
          <section key={id} className="panel rounded-[var(--radius-lg)] border border-border p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-accent">
              {INSTRUMENT_META[id].arm} · {INSTRUMENT_META[id].plainTitle}
            </p>
            <h2 className="mt-2 font-display text-2xl">{INSTRUMENT_META[id].title}</h2>
            <p className="mt-1 text-xs text-subtle">
              {INSTRUMENT_META[id].duration} · {INSTRUMENT_META[id].items}
            </p>
            <p className="mt-2 text-sm text-muted">{INSTRUMENT_META[id].why}</p>
            <div className="mt-4">
              <CitationBlock id={id} />
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
