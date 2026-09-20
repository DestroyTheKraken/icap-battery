import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/cap/shell";
import { CitationBlock } from "@/components/cap/citation-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ARM_LETTER,
  DISPLAY_INSTRUMENT_ORDER,
  INSTRUMENT_META,
} from "@/lib/cap/instruments";

export const Route = createFileRoute("/citations")({ component: Citations });

function Citations() {
  const defaultId = DISPLAY_INSTRUMENT_ORDER[0];

  return (
    <AppShell wide>
      <p className="text-xs uppercase tracking-[0.18em] text-accent">Behind the profile</p>
      <h1 className="mt-2 font-display text-4xl">Sources</h1>
      <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-muted">
        <p>
          This page is the paper trail behind iCAP: who built each assessment, the studies that
          support it, and the legal names that keep credit where it belongs. You can skip it and
          still use your profile.
        </p>
        <p>
          We do not claim authorship of the public-domain IPIP items or the O*NET Interest Profiler
          Short Form. Process tasks reimplement published experimental methods in our own software
          and stimuli. We are grateful to the scientists and public projects who keep careful
          measurement available without locking career discovery behind a paywall.
        </p>
      </div>

      <Tabs defaultValue={defaultId} className="mt-8">
        <TabsList aria-label="Instrument sources">
          {DISPLAY_INSTRUMENT_ORDER.map((id) => {
            const arm = INSTRUMENT_META[id].arm;
            const letter = ARM_LETTER[arm];
            return (
              <TabsTrigger key={id} value={id} className="flex-col gap-1 py-2.5">
                <span>{INSTRUMENT_META[id].plainTitle}</span>
                <span
                  className="font-display text-base leading-none text-transparent group-data-[state=active]:text-accent"
                  aria-hidden={true}
                >
                  {letter}
                </span>
                <span className="sr-only">{arm} arm</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {DISPLAY_INSTRUMENT_ORDER.map((id) => {
          const m = INSTRUMENT_META[id];
          return (
            <TabsContent key={id} value={id}>
              <article className="panel rounded-[var(--radius-xl)] border border-border p-5 md:p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-accent">
                  {ARM_LETTER[m.arm]} · {m.arm} · {m.plainTitle}
                </p>
                <h2 className="mt-2 font-display text-3xl">{m.title}</h2>
                <p className="mt-1 text-xs text-subtle">
                  {m.duration} · {m.items}
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{m.why}</p>
                <div className="mt-5">
                  <CitationBlock id={id} />
                </div>
              </article>
            </TabsContent>
          );
        })}
      </Tabs>
    </AppShell>
  );
}
