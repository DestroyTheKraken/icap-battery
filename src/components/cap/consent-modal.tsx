import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PILOT_CONSENT_VERSION, type PilotConsentRecord } from "@/lib/cap/pilot";

export function ConsentModal({
  open,
  onAccept,
  onCancel,
}: {
  open: boolean;
  onAccept: (record: PilotConsentRecord) => void;
  onCancel: () => void;
}) {
  const [checked, setChecked] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      <div className="panel max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-xl)] border border-border p-5 shadow-[0_0_0_1px_rgba(224,64,10,0.2),0_0_24px_rgba(224,64,10,0.12)] md:p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Before you begin</p>
        <h2 id="consent-title" className="mt-2 font-display text-2xl">
          Pilot participation acknowledgment
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
          <p>
            iCAP is a <strong className="text-fg">career-discovery aid</strong> for this private
            pilot. It is <strong className="text-fg">not</strong> a clinical assessment, medical
            diagnosis, hiring screen, or guarantee of school or job outcomes.
          </p>
          <p>
            Your answers stay in <strong className="text-fg">this browser</strong> unless{" "}
            <em>you</em> export a profile file and choose to share it (for example by uploading it
            to a chat tool or emailing it). Clearing site data can erase your local session.
          </p>
          <p>
            Participation is voluntary. You may stop at any time. Process tasks (memory, focus,
            switching) need an honest attempt for the Validity section to be useful; a rushed
            click-through should be labeled as practice when you use the coach prompt.
          </p>
          <p>
            By continuing you confirm you are at least 18 years old (or have a parent/guardian
            present for this pilot), you understand the limits above, and you agree to take part
            for feedback purposes only.
          </p>
          <p className="text-xs text-subtle">
            This acknowledgment is for pilot testing. It is not a substitute for formal legal
            counsel. The operator may update this text; version {PILOT_CONSENT_VERSION}.
          </p>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-elevated/50 px-3 py-3 text-sm">
          <input
            type="checkbox"
            className="mt-1 size-4 accent-[var(--color-accent)]"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span className="text-fg">
            I have read this acknowledgment and I agree to continue with the iCAP pilot sitting.
          </span>
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            variant="accent"
            disabled={!checked}
            onClick={() =>
              onAccept({
                version: PILOT_CONSENT_VERSION,
                acceptedAt: new Date().toISOString(),
                method: "checkbox",
              })
            }
          >
            I agree — continue
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
