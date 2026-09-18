import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  dense,
}: {
  children: React.ReactNode;
  dense?: boolean;
}) {
  return (
    <div className="app-root relative min-h-dvh text-fg">
      <div className="lab-grid relative min-h-dvh">
        <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/70 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link to="/" className="flex items-baseline gap-2">
              <span className="font-display text-lg tracking-tight">iCAP</span>
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Battery</span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link to="/" className="rounded-[var(--radius-sm)] px-3 py-2 text-muted hover:text-fg">
                Hub
              </Link>
              <Link to="/results" className="rounded-[var(--radius-sm)] px-3 py-2 text-muted hover:text-fg">
                Profile
              </Link>
              <Link to="/citations" className="rounded-[var(--radius-sm)] px-3 py-2 text-muted hover:text-fg">
                Sources
              </Link>
            </nav>
          </div>
        </header>
        <main className={cn("mx-auto w-full max-w-5xl px-4 py-8", dense && "max-w-3xl py-6")}>
          {children}
        </main>
        <footer className="border-t border-border/80">
          <div className="mx-auto max-w-5xl px-4 py-6">
            <p className="text-xs leading-relaxed text-subtle">
              AI makes mistakes, so always double check anything AI gives you.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-subtle">
              O*NET® is a trademark of the U.S. Department of Labor, Employment and Training
              Administration. Interest Profiler Short Form (60 items) is public domain. This app is
              not affiliated with DOL/ETA.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
