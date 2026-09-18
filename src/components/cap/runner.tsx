import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AospanTask } from "@/components/cap/aospan-task";
import { DccsTask } from "@/components/cap/dccs-task";
import { FlankerTask } from "@/components/cap/flanker-task";
import { HexacoTask } from "@/components/cap/hexaco-task";
import { IcarTask } from "@/components/cap/icar-task";
import { InterestTask } from "@/components/cap/interest-task";
import { AppShell } from "@/components/cap/shell";
import { Button } from "@/components/ui/button";
import { BATTERY_ORDER, INSTRUMENT_META } from "@/lib/cap/instruments";
import { useCapStore } from "@/lib/cap/store";
import type { InstrumentResult } from "@/lib/cap/types";

export function Runner() {
  const nav = useNavigate();
  const session = useCapStore((s) => s.session);
  const saveResult = useCapStore((s) => s.saveResult);
  const advance = useCapStore((s) => s.advance);

  useEffect(() => {
    if (session?.status === "complete") nav({ to: "/results" });
  }, [session?.status, nav]);

  if (!session || session.status === "idle") {
    return (
      <AppShell>
        <p className="text-muted">No session in progress.</p>
        <Button className="mt-4" onClick={() => nav({ to: "/" })}>
          Back to hub
        </Button>
      </AppShell>
    );
  }

  if (session.status === "complete") {
    return (
      <AppShell>
        <p className="text-muted">Session complete. Opening profile…</p>
      </AppShell>
    );
  }

  const id = BATTERY_ORDER[Math.min(session.currentIndex, BATTERY_ORDER.length - 1)];
  const meta = INSTRUMENT_META[id];

  const done = (r: InstrumentResult) => {
    saveResult(id, r);
    advance();
  };

  const task = () => {
    switch (id) {
      case "hexaco":
        return <HexacoTask onDone={done} />;
      case "icar":
        return <IcarTask onDone={done} />;
      case "aospan":
        return <AospanTask onDone={done} />;
      case "flanker":
        return <FlankerTask onDone={done} />;
      case "dccs":
        return <DccsTask onDone={done} />;
      case "interest":
        return <InterestTask onDone={done} />;
    }
  };

  return (
    <AppShell dense>
      <p className="mb-6 text-xs text-subtle">
        {session.mode === "battery" ? (
          <>
            Instrument {session.currentIndex + 1} of {BATTERY_ORDER.length} · {meta.arm}
          </>
        ) : (
          <>Single instrument · {meta.arm}</>
        )}
      </p>
      {task()}
    </AppShell>
  );
}
