import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AUTHOR, EMAIL, STEPS } from "../site";

function stepIndex(path: string) {
  if (path.startsWith("/case-study")) return 3;
  const i = STEPS.findIndex((s) => s.path === path);
  return i < 0 ? 0 : i;
}

export function Layout() {
  const { pathname } = useLocation();
  const idx = stepIndex(pathname);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="min-w-0">
            <p className="truncate font-display text-[15px] font-bold leading-tight">{AUTHOR}</p>
            <p className="truncate text-xs text-muted">APM candidate · independent Ownly case study</p>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-ink md:inline">Open to APM roles at Ownly</span>
            <span className="truncate text-sm font-semibold text-ink">{EMAIL}</span>
          </div>
        </div>
        <nav aria-label="Progress" className="mx-auto max-w-6xl px-4 pb-3 sm:px-6">
          <ol className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <li key={s.path} className="min-w-0 flex-1">
                <NavLink to={s.path} className="group block" aria-current={i === idx ? "step" : undefined}>
                  <span className={`block h-1.5 rounded-full transition ${i <= idx ? "bg-brand" : "bg-line group-hover:bg-brand-tint"}`} />
                  <span className={`mt-1.5 hidden truncate text-xs sm:block ${i === idx ? "font-semibold text-ink" : "text-muted"}`}>
                    {s.short}. {s.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ol>
          <p className="mt-1.5 text-xs text-muted sm:hidden">Step {idx + 1} of 5 · {STEPS[idx].label}</p>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-line bg-panel">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Independent case study by <span className="font-semibold text-ink">{AUTHOR}</span>. Built from public data. Not affiliated with
            Ownly or Rapido.
          </p>
          <a href={`mailto:${EMAIL}`} className="font-semibold text-brand-ink underline underline-offset-2">{EMAIL}</a>
        </div>
      </footer>
    </div>
  );
}

export function NextBar({ back, next, nextLabel }: { back?: string; next?: string; nextLabel?: string }) {
  return (
    <div className="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-line px-4 pt-6 sm:px-6">
      {back ? <Link to={back} className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink-2 hover:bg-panel">← Back</Link> : <span />}
      {next && (
        <Link to={next} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-ink-2">
          {nextLabel ?? "Next"} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
