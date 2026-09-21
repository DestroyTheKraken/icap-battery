import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  dense,
  wide,
}: {
  children: React.ReactNode;
  dense?: boolean;
  /** Wider content column for card grids (Sources). */
  wide?: boolean;
}) {
  const widthClass = dense ? "max-w-3xl" : wide ? "max-w-7xl 2xl:max-w-[90rem]" : "max-w-5xl";

  return (
    <>
      {/* Fixed viewport sky — CSS background on a fixed box (Konqueror-safe; no object-fit). */}
      <div className="sky-fixed" aria-hidden="true">
        <div className="sky-fixed__veil" />
      </div>
      <div className="app-root relative min-h-dvh text-fg">
        <div className="lab-grid relative min-h-dvh">
          <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/70 backdrop-blur-md">
            <div className={cn("mx-auto flex h-14 w-full items-center justify-between px-4", widthClass)}>
              <Link
                to="/"
                className="interactive flex items-center gap-2 rounded-[var(--radius-sm)] px-1 py-0.5"
                aria-label="iCAP Battery home"
              >
                <img
                  src="/brand/favicon-source.png"
                  alt=""
                  className="h-8 w-8 rounded-[6px] object-contain"
                  width={32}
                  height={32}
                />
                <span className="font-display text-lg tracking-tight text-accent">iCAP</span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted">Battery</span>
              </Link>
              <nav className="flex items-center gap-1 text-sm">
                <Link to="/" className="nav-link rounded-[var(--radius-sm)] px-3 py-2 text-muted">
                  Hub
                </Link>
                <Link to="/results" className="nav-link rounded-[var(--radius-sm)] px-3 py-2 text-muted">
                  Profile
                </Link>
                <Link
                  to="/citations"
                  className="nav-link rounded-[var(--radius-sm)] px-3 py-2 text-muted"
                >
                  Sources
                </Link>
              </nav>
            </div>
          </header>
          <main className={cn("mx-auto w-full px-4 py-8", widthClass, dense && "py-6")}>
            {children}
          </main>
          <footer className="border-t border-border/80">
            <div className={cn("mx-auto w-full px-4 py-6", widthClass)}>
              <p className="text-xs leading-relaxed text-subtle">
                AI makes mistakes, so always double check anything AI gives you.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-subtle">
                O*NET® is a trademark of the U.S. Department of Labor, Employment and Training
                Administration. Interest Profiler Short Form (60 items) is public domain. This app is
                not affiliated with DOL/ETA. Personality items from the International Personality Item
                Pool (public domain). Problem-solving figures are original to iCAP.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
