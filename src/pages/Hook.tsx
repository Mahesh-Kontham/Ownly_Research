import { Link } from "react-router-dom";
import stats from "../data/stats.json";
import { PrimaryLink, SourcesPanel, Stat, Eyebrow } from "../components/ui";
import { AUTHOR } from "../site";

export default function Hook() {
  const c = stats.customer;
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-16">
      <Eyebrow>An independent product case study · for the Ownly team</Eyebrow>

      <figure className="mt-6 max-w-4xl">
        <span aria-hidden className="block font-display text-7xl font-extrabold leading-none text-brand">“</span>
        <blockquote className="-mt-6 font-display text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
          …it showed that the order is delivered and gave me a random number.
        </blockquote>
        <figcaption className="mt-4 text-sm text-muted">Ownly customer · Google Play review · 1★</figcaption>
      </figure>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2">
        I'm {AUTHOR}. I read <strong className="text-ink">{stats.total.toLocaleString("en-IN")} public reviews</strong> across Ownly's
        customer, captain and restaurant apps to understand why moments like this happen, and what I would do about it as an
        Associate Product Manager at Ownly.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Stat value="1 in 3" tone="brand" label={`negative customer reviews describe paying and getting no food (${c.severe.neg} of ${c.neg})`} />
        <Stat value={`${c.severe.avg}★`} label="average rating when that happens" />
        <Stat value={`${Math.round(c.pricePraise.pct)}%`} tone="good" label="of happy reviews that give a reason praise the price" />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <PrimaryLink to="/story">See what I found</PrimaryLink>
        <Link to="/case-study" className="rounded-full px-5 py-3 text-sm font-semibold text-ink-2 hover:bg-panel">Skip to the full case study</Link>
      </div>
      <p className="mt-3 text-sm text-muted">About 3 minutes to the end of the story. The detail is there if you want it.</p>

      <div className="mt-14">
        <SourcesPanel compact />
      </div>
    </div>
  );
}
