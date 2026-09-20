import { ExternalLink } from "lucide-react";
import type { InstrumentId } from "@/lib/cap/types";
import { COPYRIGHT_NOTES, INSTRUMENT_CITATIONS } from "@/lib/cap/citations";

export function CitationBlock({ id }: { id: InstrumentId }) {
  return (
    <aside className="space-y-3 border-t border-border pt-4">
      <p className="text-xs uppercase tracking-[0.16em] text-subtle">Citation</p>
      <ul className="space-y-3">
        {INSTRUMENT_CITATIONS[id].map((c) => (
          <li key={c.id} className="text-pretty text-sm leading-relaxed text-muted">
            <span>{c.text}</span>
            {c.url ? (
              <>
                {" "}
                <a
                  href={c.url}
                  className="interactive inline-flex size-7 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-elevated hover:text-accent"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open source in a new tab"
                  title="Open source"
                >
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="text-xs leading-relaxed text-subtle">{COPYRIGHT_NOTES[id]}</p>
    </aside>
  );
}
