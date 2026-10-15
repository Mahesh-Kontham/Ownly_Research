import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import stats from "../data/stats.json";
import { Link } from "react-router-dom";
import { Eyebrow, SourcesPanel } from "../components/ui";
import { NextBar } from "../components/Layout";
import { DOWNLOADS } from "../site";

const INK = "#171717", MUTED = "#5c5c5c", GRID = "#ececec";
const SEVERE = "#ff297d", RECOVERY = "#7c3aed", OTHER = "#a3a3a3";
const axis = { fontSize: 12, fill: MUTED };

function Card({ title, sub, children, note }: { title: string; sub?: string; children: ReactNode; note?: string }) {
  return (
    <figure className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <figcaption>
        <p className="font-display text-lg font-bold">{title}</p>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </figcaption>
      <div className="mt-4">{children}</div>
      {note && <p className="mt-3 text-xs text-muted">{note}</p>}
    </figure>
  );
}

function Tip({ active, payload, render }: { active?: boolean; payload?: { payload: Record<string, unknown> }[]; render: (d: any) => ReactNode }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs text-ink shadow-lg">{render(payload[0].payload)}</div>;
}

function Ratings() {
  const apps = [
    { name: "Customer app", d: stats.customer },
    { name: "Captain app", d: stats.captain },
    { name: "Restaurant partner app", d: stats.restaurant },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {apps.map(({ name, d }) => {
        const total = Object.values(d.ratings as Record<string, number>).reduce((a, b) => a + b, 0);
        const rows = ["1", "2", "3", "4", "5"].map((k) => ({ star: `${k}★`, pct: Math.round((((d.ratings as Record<string, number>)[k] ?? 0) / total) * 100), n: (d.ratings as Record<string, number>)[k] ?? 0 }));
        return (
          <div key={name}>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted">n = {d.n.toLocaleString("en-IN")} · avg {d.avg}★</p>
            <div className="mt-2 h-44">
              <ResponsiveContainer>
                <BarChart data={rows} margin={{ top: 18, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="star" tick={axis} axisLine={{ stroke: GRID }} tickLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip cursor={{ fill: "#f5f5f5" }} content={<Tip render={(r) => <>{r.star}: {r.n} reviews ({r.pct}%)</>} />} />
                  <Bar dataKey="pct" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                    {rows.map((r) => <Cell key={r.star} fill={r.star.startsWith("1") || r.star.startsWith("2") ? SEVERE : r.star.startsWith("3") ? "#d4d4d4" : INK} />)}
                    <LabelList dataKey="pct" position="top" formatter={(v: number) => (v >= 3 ? `${v}%` : "")} style={{ fontSize: 11, fill: INK }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Themes() {
  const rows = [...stats.customer.themes].sort((a, b) => b.pct - a.pct);
  const color = (g: string) => (g === "severe" ? SEVERE : g === "recovery" ? RECOVERY : OTHER);
  return (
    <>
      <div className="h-[520px]">
        <ResponsiveContainer>
          <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke={GRID} />
            <XAxis type="number" tick={axis} unit="%" axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="theme" width={190} tick={{ ...axis, fill: INK }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "#f5f5f5" }} content={<Tip render={(r) => <><b>{r.theme}</b><br />{r.neg} of {stats.customer.neg} negative reviews ({r.pct}%)<br />avg rating when mentioned: {r.avg}★</>} />} />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={18} isAnimationActive={false}>
              {rows.map((r) => <Cell key={r.theme} fill={color(r.group)} />)}
              <LabelList dataKey="pct" position="right" formatter={(v: number) => `${Math.round(v)}%`} style={{ fontSize: 11, fill: INK }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 flex flex-wrap gap-4 text-xs text-ink-2">
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ background: SEVERE }} />Paid, no food</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ background: RECOVERY }} />Refund & support</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ background: OTHER }} />Other</li>
      </ul>
    </>
  );
}

function Recovery() {
  return (
    <div className="h-72">
      <ResponsiveContainer>
        <BarChart data={stats.customer.recovery} margin={{ top: 22, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="failure" tick={axis} axisLine={{ stroke: GRID }} tickLine={false} />
          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={axis} axisLine={false} tickLine={false} unit="★" width={36} />
          <Tooltip cursor={{ fill: "#f5f5f5" }} content={<Tip render={(r) => <><b>{r.failure}</b><br />Also complains about support: {r.withSupport}★ (n={r.withSupportN})<br />No support complaint: {r.without}★ (n={r.withoutN})</>} />} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="square" />
          <Bar name="Also complains about support/refund" dataKey="withSupport" fill={RECOVERY} radius={[4, 4, 0, 0]} isAnimationActive={false}>
            <LabelList dataKey="withSupport" position="top" style={{ fontSize: 11, fill: INK }} formatter={(v: number) => v.toFixed(2)} />
          </Bar>
          <Bar name="No support/refund complaint" dataKey="without" fill={OTHER} radius={[4, 4, 0, 0]} isAnimationActive={false}>
            <LabelList dataKey="without" position="top" style={{ fontSize: 11, fill: INK }} formatter={(v: number) => v.toFixed(2)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DataTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="table-scroll rounded-xl border border-line">
      <table className="text-left text-sm" style={{ minWidth: 0 }}>
        <thead className="bg-panel"><tr>{head.map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-line">{r.map((c, j) => <td key={j} className={`px-3 py-2 ${j > 0 ? "tabular-nums" : ""}`}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

const DL = ({ href, title, meta }: { href: string; title: string; meta: string }) => (
  <a href={href} download className="flex items-start justify-between gap-3 rounded-xl border border-line p-4 transition hover:border-brand hover:bg-brand-soft">
    <span>
      <span className="block font-semibold text-ink">{title}</span>
      <span className="block text-sm text-muted">{meta}</span>
    </span>
    <span aria-hidden className="text-brand-ink">↓</span>
  </a>
);

export default function Evidence() {
  const c = stats.customer, cap = stats.captain, r = stats.restaurant;
  const shortCap = cap.themes.map((t) => ({ ...t, short: t.theme.replace("Onboarding / Verification Delay", "Onboarding delay").replace("Brand Trust / 'Don't Download'", "“Don't download”").replace("Support Unresponsive", "Support").replace("App Stability / Login Bugs", "App bugs").replace("Incentive & Payout Trust", "Incentives").replace("Order Flow / Dispatch", "Dispatch").replace("City Not Live", "City not live") }));
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <Eyebrow>Step 5 · Evidence & data</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.1] sm:text-5xl">Real data, not assumptions</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">
          The charts below are computed directly from the reviews I scraped. Hover any bar for the exact counts, and download the anonymised
          data to check my numbers yourself.
        </p>

        <div className="mt-8"><SourcesPanel /></div>

        <h2 className="mt-14 text-2xl font-extrabold">Play Store reviews</h2>
        <div className="mt-5 grid gap-5">
          <Card title="All three apps are polarised: mostly 1★ or 5★" sub="Share of reviews by star rating" note="Ratings reflect who chooses to write a review, so both ends are over-represented.">
            <Ratings />
          </Card>
          <Card title="What negative customer reviews talk about" sub={`% of ${c.neg} customer reviews rated 1–2★ that mention each theme (a review can mention several)`} note="Themes are keyword-coded. Some are broad (e.g. the delay theme also matches “on time”), which the case study corrects for.">
            <Themes />
          </Card>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card title="Severe failures score ~1★ with or without support complaints" sub="Average rating by failure type" note="This is why the plan prevents the failure first, rather than only improving support.">
              <Recovery />
            </Card>
            <Card title="The failure cascade inside negative reviews" sub="Each step is a subset of the one above">
              <ul className="space-y-3">
                {c.cascade.map((s, i) => (
                  <li key={s.step}>
                    <div className="flex justify-between text-sm"><span className="text-ink-2">{s.step}</span><span className="tabular-nums font-semibold">{s.n}</span></div>
                    <div className="mt-1 h-3 rounded-full bg-panel"><div className="h-3 rounded-full" style={{ width: `${(s.n / c.cascade[0].n) * 100}%`, background: [INK, INK, RECOVERY, SEVERE][i] }} /></div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink-2">Price still matters: {c.pricePraise.price} of {c.pricePraise.reasoned} happy reviews that give a reason ({c.pricePraise.pct}%) praise it.</p>
            </Card>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card title="Captain app: what negative reviews are about" sub={`% of ${cap.neg} captain-app reviews rated 1–2★`} note={`Most are from applicants waiting to be activated. Median stated wait: ${cap.wait.median} days (n=${cap.wait.n}), longest ${cap.wait.max}.`}>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={shortCap} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                    <CartesianGrid horizontal={false} stroke={GRID} />
                    <XAxis type="number" tick={axis} unit="%" axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="short" width={120} tick={{ ...axis, fill: INK }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "#f5f5f5" }} content={<Tip render={(d) => <><b>{d.theme}</b><br />{d.neg} reviews · avg {d.avg}★</>} />} />
                    <Bar dataKey="pct" fill={INK} radius={[0, 4, 4, 0]} barSize={18} isAnimationActive={false}>
                      <LabelList dataKey="pct" position="right" formatter={(v: number) => `${Math.round(v)}%`} style={{ fontSize: 11, fill: INK }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card title="Restaurant partner app: problem reviews by theme" sub={`${r.issues} of ${r.n} reviews describe a problem · organic rating ${r.organicAvg}★`} note="Small sample, so treat as directional.">
              <DataTable head={["Theme", "Reviews"]} rows={r.themes.filter((t) => !t.theme.startsWith("Praise")).map((t) => [t.theme, t.n])} />
            </Card>
          </div>
        </div>

        <h2 className="mt-14 text-2xl font-extrabold">Search data (Semrush, 5 Oct 2026)</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[[stats.seo.visits, "est. monthly organic visits to ownly.food (India, desktop)"], [String(stats.seo.keywords), "keywords ranking"], [`${stats.seo.topPagePct}%`, "of that traffic lands on one restaurant page"], [`${stats.seo.zomato} / ${stats.seo.swiggy}`, "Zomato / Swiggy organic traffic for comparison"]].map(([v, l]) => (
            <div key={l} className="rounded-2xl border border-line p-4"><p className="font-display text-2xl font-extrabold">{v}</p><p className="mt-1 text-sm text-ink-2">{l}</p></div>
          ))}
        </div>
        <p className="mt-3 max-w-3xl text-sm text-ink-2">
          People search for “rapido food delivery”, not “Ownly”. Discovery runs through Rapido, which is why the plan doesn't start with SEO. The
          Semrush “Top Opportunities” panel uses the US database, so I left it out of the analysis.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {[["semrush_compare_domains.png", "Compare Domains: ownly.food vs zomato.com vs swiggy.com"], ["semrush_organic_overview.png", "Organic Rankings overview for ownly.food"]].map(([f, t]) => (
            <a key={f} href={`/evidence/${f}`} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-line">
              <img src={`/evidence/${f}`} alt={`Semrush screenshot: ${t}`} loading="lazy" className="h-72 w-full object-cover object-top" />
              <p className="border-t border-line px-4 py-3 text-sm font-medium">{t} <span className="text-muted">· open full size</span></p>
            </a>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-extrabold">Downloads</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <DL href={DOWNLOADS.casePdf} title="Full case study (PDF)" meta="43 pages · evidence, root cause, MVP, PRD, experiment" />
          <DL href={DOWNLOADS.onePager} title="One-page summary (PDF)" meta="The whole argument on one page" />
          <DL href={DOWNLOADS.deck} title="Pitch deck (PowerPoint)" meta="7 slides" />
          <DL href={DOWNLOADS.caseDocx} title="Full case study (Word)" meta="Editable version" />
          <DL href="/data/ownly_customer_reviews_anonymised.csv" title="Customer app reviews (CSV)" meta={`${c.n.toLocaleString("en-IN")} reviews with theme tags · anonymised`} />
          <DL href="/data/ownly_captain_reviews_anonymised.csv" title="Captain app reviews (CSV)" meta={`${cap.n} reviews with theme tags · anonymised`} />
          <DL href="/data/ownly_restaurant_partner_reviews_anonymised.csv" title="Restaurant partner app reviews (CSV)" meta={`${r.n} reviews with coded themes · anonymised`} />
          <DL href="/evidence/semrush_overview_5oct2026.pdf" title="Semrush exports (PDF)" meta="Organic overview · positions report in the next file" />
          <DL href="/evidence/semrush_positions_5oct2026.pdf" title="Semrush positions report (PDF)" meta="155 ranking keywords" />
        </div>

        <h2 className="mt-14 text-2xl font-extrabold">Method and limits</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-line p-6 text-[15px] leading-relaxed text-ink-2">
            <p className="font-semibold text-ink">How the numbers were made</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-brand">
              <li>Reviews were scraped from the Google Play Store for all three Ownly apps.</li>
              <li>Each review was coded into themes with a keyword dictionary (customer and captain apps) or by hand (restaurant app), then mapped to journey stages.</li>
              <li>Strong claims were re-checked; four earlier claims of my own were corrected or dropped (case study, Appendix C).</li>
              <li>Anonymised: reviewer names, profile photos, review IDs and developer replies are removed; emails, phone numbers, long IDs and staff names in review text are redacted.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-line p-6 text-[15px] leading-relaxed text-ink-2">
            <p className="font-semibold text-ink">What this data can't tell us</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-brand">
              <li>How often orders fail. Reviews show what goes wrong and how badly, not the rate per order.</li>
              <li>Customer reviews cover 8 days on Android only, and angry customers write more.</li>
              <li>Semrush figures are modelled estimates, desktop only.</li>
              <li>Press facts (zero commission, Rapido-app integration, order volumes) are reported, not verified.</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 rounded-3xl bg-ink p-8 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Thanks for reading this far</p>
          <p className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">I'd like to work on problems like this as an Associate Product Manager.</p>
          <p className="mt-3 max-w-2xl text-white/75">The first thing I'd do is measure what I couldn't see from outside. Can we talk for 15 minutes?</p>
          <div className="mt-6">
            <Link to="/about-me" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-strong px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-brand-ink">
              Want to know more about me? <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
      <NextBar back="/case-study" />
    </div>
  );
}
