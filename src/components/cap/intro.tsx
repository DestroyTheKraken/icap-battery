import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function InstrumentIntro({
  kicker,
  title,
  children,
  action,
  onAction,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
  action: string;
  onAction: () => void;
}) {
  return (
    <section className="space-y-6">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">{kicker}</p>
      <h1 className="font-display text-4xl">{title}</h1>
      <div className="space-y-4 text-muted">{children}</div>
      <Button onClick={onAction}>{action}</Button>
    </section>
  );
}

export function PracticeBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-[var(--radius-sm)] border border-accent/40 bg-accent/10 px-3 py-2 text-center text-xs uppercase tracking-[0.16em] text-accent">
      {children}
    </p>
  );
}

export function Countdown({
  hint,
  onDone,
}: {
  hint: string;
  onDone: () => void;
}) {
  const [n, setN] = useState(3);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (n <= 1) doneRef.current();
      else setN((x) => x - 1);
    }, 800);
    return () => window.clearTimeout(id);
  }, [n]);
  return (
    <section className="grid min-h-[50vh] place-items-center gap-4">
      <p className="text-sm text-muted">{hint}</p>
      <p className="font-display text-7xl tabular-nums">{n}</p>
    </section>
  );
}
