import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MAILTO, SOURCES } from "../site";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink">{children}</p>;
}

export function PrimaryLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-ink-2">
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

export function TalkButton({ compact = false, label }: { compact?: boolean; label?: string }) {
  return (
    <a
      href={MAILTO}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand-strong font-semibold text-white transition hover:bg-brand-ink ${compact ? "px-4 py-2 text-sm" : "px-6 py-3.5 text-[15px]"}`}
    >
      {label ?? (compact ? "Talk about an APM role" : "Let's talk about an APM role at Ownly")}
    </a>
  );
}

export function Stat({ value, label, tone = "ink", note }: { value: string; label: string; tone?: "ink" | "brand" | "good"; note?: string }) {
  const color = tone === "brand" ? "text-brand" : tone === "good" ? "text-good" : "text-ink";
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className={`font-display text-4xl font-extrabold sm:text-5xl ${color}`}>{value}</p>
      <p className="mt-2 text-sm leading-snug text-ink-2">{label}</p>
      {note && <p className="mt-2 text-xs text-muted">{note}</p>}
    </div>
  );
}

export function SourcesPanel({ compact = false }: { compact?: boolean }) {
  return (
    <section aria-labelledby="sources" className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="sources" className="text-lg font-bold">Where the data comes from</h2>
        <span className="rounded-full bg-good-soft px-2.5 py-1 text-xs font-semibold text-good">Real, public data</span>
      </div>
      <p className="mt-2 text-sm text-ink-2">
        I scraped every review myself from the Google Play Store and pulled search data from Semrush. Every number here is
        counted from those files. Where I had to assume something, it is labelled as an assumption.
      </p>
      {!compact && (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {SOURCES.map((s) => (
            <li key={s.name} className="rounded-xl bg-white px-4 py-3 text-sm">
              <p className="font-semibold text-ink">{s.name}</p>
              <p className="text-muted">{s.detail}</p>
            </li>
          ))}
        </ul>
      )}
      {compact && (
        <p className="mt-3 text-sm text-muted">
          1,481 Play Store reviews across Ownly's customer, captain and restaurant apps · Semrush (5 Oct 2026) · press.{" "}
          <Link to="/evidence" className="font-semibold text-brand-ink underline underline-offset-2">See sources and download the data</Link>
        </p>
      )}
    </section>
  );
}

export function Quote({ text, meta }: { text: string; meta: string }) {
  return (
    <figure className="rounded-2xl bg-brand-soft p-5">
      <blockquote className="font-display text-lg font-semibold leading-snug text-ink">“{text}”</blockquote>
      <figcaption className="mt-2 text-xs text-muted">{meta}</figcaption>
    </figure>
  );
}
