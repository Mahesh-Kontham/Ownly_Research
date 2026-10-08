import type { ReactNode } from "react";
import stats from "../data/stats.json";
import { Eyebrow, Quote } from "../components/ui";
import { NextBar } from "../components/Layout";

function Chapter({ n, kicker, title, children }: { n: number; kicker: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-10 md:grid-cols-[220px_1fr] md:gap-10 md:py-14">
      <div>
        <p className="font-display text-5xl font-extrabold text-brand">0{n}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{kicker}</p>
      </div>
      <div className="min-w-0">
        <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">{title}</h2>
        <div className="mt-5 space-y-5 text-[17px] leading-relaxed text-ink-2">{children}</div>
      </div>
    </section>
  );
}

function StageBars() {
  return (
    <div className="rounded-2xl border border-line p-5">
      <p className="text-sm font-semibold text-ink">Where negative reviews say the journey breaks</p>
      <p className="text-xs text-muted">% of {stats.customer.neg} 1–2★ reviews touching each stage (a review can touch several)</p>
      <ul className="mt-4 space-y-2.5">
        {stats.customer.stages.map((s) => (
          <li key={s.stage} className="grid grid-cols-[120px_1fr_44px] items-center gap-3 text-sm sm:grid-cols-[150px_1fr_52px]">
            <span className={s.afterPayment ? "font-medium text-ink" : "text-muted"}>{s.stage}</span>
            <span className="h-3 rounded-full bg-panel">
              <span className={`block h-3 rounded-full ${s.afterPayment ? "bg-brand" : "bg-neutral-300"}`} style={{ width: `${s.pct}%` }} />
            </span>
            <span className="text-right tabular-nums text-ink">{Math.round(s.pct)}%</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">Pink = after the customer has paid. That is where almost all of the damage is.</p>
    </div>
  );
}

export default function Story() {
  const c = stats.customer;
  const failures = [
    { t: "Cancelled after payment", n: "61 reviews · avg 1.00★", q: "deducted the amount. After 1hour… they are asking me to cancel" },
    { t: "No captain came", n: "‘rider’ theme in 23% of negatives", q: "no rider was assigned even after waiting" },
    { t: "Marked ‘Delivered’, no food", n: "104 reviews · avg 1.07★", q: "I didn't get my order. but it is showing delivered" },
  ];
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <Eyebrow>Step 2 · The story in four parts</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.1] sm:text-5xl">Customers love the price. They leave when they pay and get nothing.</h1>

        <Chapter n={1} kicker="The problem" title="1 in 3 unhappy customers paid and got nothing">
          <p>
            Of {c.neg} negative reviews of the customer app (27 Sep–4 Oct 2026), <strong className="text-ink">{c.severe.neg}</strong> describe one of
            three failures. When they do, the rating averages <strong className="text-ink">{c.severe.avg}★</strong>, the lowest of any complaint.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {failures.map((f) => (
              <div key={f.t} className="rounded-2xl bg-brand-soft p-4">
                <p className="font-display text-lg font-bold text-ink">{f.t}</p>
                <p className="mt-1 text-sm font-semibold text-brand-ink">{f.n}</p>
                <p className="mt-2 text-sm italic text-ink-2">“{f.q}”</p>
              </div>
            ))}
          </div>
          <StageBars />
        </Chapter>

        <Chapter n={2} kicker="Why it matters" title="Price is winning. One failed order undoes it">
          <p>
            Of the happy reviews that give a reason, <strong className="text-ink">{Math.round(c.pricePraise.pct)}%</strong> praise the price, no
            platform fee or no hidden charges. Even {c.pricePraise.negStillPraise} angry reviewers still praise it. Demand isn't the problem.
          </p>
          <p>
            But Ownly is reported to charge restaurants no commission, so there is little margin to absorb a failed order: the refund, support time
            and a wasted captain trip. And since Rapido's app started sending new users to Ownly (reported, July 2026), every failed first order also
            wastes that distribution. {c.fraudStrictNeg} negative reviews call the app a fraud or scam.
          </p>
        </Chapter>

        <Chapter n={3} kicker="What the other apps add" title="Three apps, one story: the handoffs break">
          <p>The restaurant and captain apps describe the same failures from the other side.</p>
          <div className="grid gap-3 md:grid-cols-3">
            <Quote text="they accepted order first and deducted the amount… asking me to cancel the order" meta={`Customer app · ${c.n.toLocaleString("en-IN")} reviews`} />
            <Quote text="notification of order is not working… order getting cancelled without our knowledge" meta={`Restaurant partner app · ${stats.restaurant.n} reviews`} />
            <Quote text="not getting order 12 hrs" meta={`Captain app · ${stats.captain.n} reviews · while customers wait for a captain`} />
          </div>
          <div className="rounded-2xl bg-ink p-5 text-white sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Root-cause hypothesis</p>
            <p className="mt-2 font-display text-xl font-bold leading-snug sm:text-2xl">
              Nothing in the order flow has to prove a handoff happened, and nothing refunds the customer automatically when one fails.
            </p>
          </div>
        </Chapter>

        <Chapter n={4} kicker="What I'd do" title="Measure first, then build the Ownly Promise">
          <ol className="grid gap-3 md:grid-cols-3">
            {[
              ["Measure", "2 weeks", "How many orders really fail, and do those customers come back? If it's small, stop and pick a different problem."],
              ["Build", "Ownly Promise v1", "A 4-digit delivery code at handover, plus automatic refunds when an order is cancelled after payment, no captain comes in 20 minutes, or it isn't received."],
              ["Prove", "4-week zone pilot", "Scale only if “I never got my order” claims fall by at least 40% and captains keep accepting food orders."],
            ].map(([h, s, b], i) => (
              <li key={h} className="rounded-2xl border border-line p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-display font-bold text-white">{i + 1}</span>
                  <span className="font-display text-xl font-bold text-ink">{h}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-brand-ink">{s}</p>
                <p className="mt-1 text-[15px] leading-relaxed">{b}</p>
              </li>
            ))}
          </ol>
          <div className="rounded-2xl border border-dashed border-warn/40 bg-warn-soft p-5 text-[15px]">
            <p className="font-semibold text-ink">What I can't see from outside</p>
            <p className="mt-1">
              I don't know Ownly's real failure rate, refund times or repeat rates. That is exactly why step 1 is measurement, not building.
            </p>
          </div>
        </Chapter>
      </div>
      <NextBar back="/" next="/prototype" nextLabel="Try the idea" />
    </div>
  );
}
