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
                  className="whitespace-nowrap underline decoration-border-strong underline-offset-4 hover:text-fg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open source
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
