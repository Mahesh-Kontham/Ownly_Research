import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import caseData from "../content/case.json";
import { Rich } from "../components/Rich";
import { Eyebrow } from "../components/ui";
import { NextBar } from "../components/Layout";
import { DOWNLOADS } from "../site";

type Block =
  | { t: "p" | "h2" | "h3" | "caption"; text: string }
  | { t: "img"; src: string }
  | { t: "list"; ordered: boolean; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "stats"; items: string[] }
  | { t: "callout"; kind: string; title: string; lines: string[] };
type Section = { num: number; title: string; blocks: Block[] };
const SECTIONS = caseData as Section[];

export const CHAPTERS = [
  { id: "summary", title: "The short version", blurb: "Executive summary and the business context", nums: [2, 3] },
  { id: "discovery", title: "How I found it", blurb: "Method, evidence and the review analysis", nums: [4, 5, 6] },
  { id: "diagnosis", title: "What it means", blurb: "Patterns, competing explanations, root cause, journey, problem statement", nums: [7, 8, 9, 10, 11] },
  { id: "sizing", title: "How big it is", blurb: "Opportunity sizing, outcome tree, competition", nums: [12, 13, 14] },
  { id: "solution", title: "What to build", blurb: "Options, prioritisation, MVP, screens and PRD", nums: [15, 16, 17, 18, 19] },
  { id: "proof", title: "How to prove it", blurb: "Experiment, metrics, risks, rollout, decision rules", nums: [20, 21, 22, 23, 24] },
  { id: "next", title: "What's next", blurb: "Roadmap, learnings and appendix", nums: [25, 26, 27] },
];

const CALLOUT: Record<string, string> = {
  "KEY INSIGHT": "border-blue-600 bg-blue-50", EVIDENCE: "border-good bg-good-soft", "IMPORTANT ASSUMPTION": "border-warn bg-warn-soft",
  RISK: "border-bad bg-bad-soft", DECISION: "border-ink bg-panel", UNKNOWN: "border-recovery bg-recovery-soft", CORRECTION: "border-brand bg-brand-soft",
};

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "h2": return <h3 className="mt-10 text-xl font-bold">{b.text}</h3>;
    case "h3": return <h4 className="mt-6 font-display text-base font-bold text-brand-ink">{b.text}</h4>;
    case "p": return <p className="mt-4 text-[16.5px] leading-[1.75] text-ink-2"><Rich text={b.text} /></p>;
    case "caption": return <p className="mt-2 text-sm italic text-muted">{b.text}</p>;
    case "img": return (
      <a href={`/case/${b.src}`} target="_blank" rel="noreferrer" className="mt-6 block overflow-hidden rounded-xl border border-line bg-white p-2" title="Open full size">
        <img src={`/case/${b.src}`} alt="" loading="lazy" className="mx-auto h-auto w-full" />
      </a>
    );
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag className={`mt-4 space-y-2 pl-6 text-[16px] leading-relaxed text-ink-2 ${b.ordered ? "list-decimal" : "list-disc marker:text-brand"}`}>
          {b.items.map((it, i) => <li key={i} className="pl-1"><Rich text={it} /></li>)}
        </Tag>
      );
    }
    case "table": return (
      <div className="table-scroll mt-6 rounded-xl border border-line">
        <table className="text-left text-[13.5px]">
          <thead className="bg-ink text-white">
            <tr>{b.head.map((h, i) => <th key={i} className="px-3 py-2.5 font-semibold">{h.replace(/\*\*/g, "")}</th>)}</tr>
          </thead>
          <tbody>
            {b.rows.map((r, ri) => (
              <tr key={ri} className="border-t border-line align-top even:bg-panel">
                {r.map((c, ci) => <td key={ci} className="px-3 py-2.5 leading-relaxed text-ink-2"><Rich text={c} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    case "stats": return (
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {b.items.map((s, i) => {
          const [big, ...rest] = s.split("\n");
          return (
            <div key={i} className="rounded-xl bg-panel p-4">
              <p className="font-display text-2xl font-extrabold text-ink">{big.replace(/\*\*/g, "")}</p>
              <p className="mt-1 text-sm text-ink-2"><Rich text={rest.join("\n")} /></p>
            </div>
          );
        })}
      </div>
    );
    case "callout": return (
      <aside className={`mt-6 rounded-xl border-l-4 p-5 ${CALLOUT[b.kind] ?? "border-line bg-panel"}`}>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{b.kind}{b.title ? <span className="normal-case tracking-normal text-ink"> · {b.title}</span> : null}</p>
        <div className="mt-2 space-y-2 text-[15.5px] leading-relaxed text-ink-2">
          {b.lines.map((l, i) => <p key={i}><Rich text={l.replace(/^•\s*/, "• ")} /></p>)}
        </div>
      </aside>
    );
  }
}

function Progress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div className="fixed left-0 top-0 z-40 h-1 bg-brand" style={{ width: `${p}%` }} aria-hidden />;
}

export function CaseIndex() {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <Eyebrow>Step 4 · The full case study</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.1] sm:text-5xl">Read it in chapters, or download it</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">
          Every claim is labelled by how much it can be trusted: <span className="whitespace-nowrap"><Rich text="{{ACTUAL}} {{INFERENCE}} {{ASSUMPTION}} {{UNKNOWN}}" /></span>.
          Start anywhere. Most people read chapters 1 and 5.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={DOWNLOADS.casePdf} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink-2">Download PDF (43 pages)</a>
          <a href={DOWNLOADS.caseDocx} className="rounded-full border border-line px-5 py-3 text-sm font-semibold hover:bg-panel">Word version</a>
          <a href={DOWNLOADS.onePager} className="rounded-full border border-line px-5 py-3 text-sm font-semibold hover:bg-panel">One-page summary</a>
        </div>
        <ol className="mt-10 grid gap-3 md:grid-cols-2">
          {CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <Link to={`/case-study/${c.id}`} className="group flex h-full gap-4 rounded-2xl border border-line p-5 transition hover:border-brand hover:bg-brand-soft">
                <span className="font-display text-3xl font-extrabold text-brand">{i + 1}</span>
                <span>
                  <span className="block font-display text-lg font-bold text-ink">{c.title}</span>
                  <span className="mt-1 block text-sm text-muted">{c.blurb}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <NextBar back="/prototype" next="/case-study/summary" nextLabel="Start with chapter 1" />
    </div>
  );
}

export default function CaseStudy() {
  const { chapter } = useParams();
  const ci = CHAPTERS.findIndex((c) => c.id === chapter);
  if (ci < 0) return <Navigate to="/case-study" replace />;
  const ch = CHAPTERS[ci];
  const secs = SECTIONS.filter((s) => ch.nums.includes(s.num));
  const prev = ci > 0 ? `/case-study/${CHAPTERS[ci - 1].id}` : "/case-study";
  const next = ci < CHAPTERS.length - 1 ? `/case-study/${CHAPTERS[ci + 1].id}` : "/evidence";

  return (
    <div>
      <Progress />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-8 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <details className="rounded-xl border border-line p-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold">Chapter {ci + 1} of {CHAPTERS.length} · {ch.title}</summary>
            <ChapterNav current={ci} secs={secs} />
          </details>
          <div className="hidden lg:block"><ChapterNav current={ci} secs={secs} /></div>
        </aside>
        <article className="prose-case min-w-0 max-w-3xl">
          <Eyebrow>Chapter {ci + 1} of {CHAPTERS.length}</Eyebrow>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{ch.title}</h1>
          {secs.map((s) => (
            <section key={s.num} id={`s${s.num}`} className="scroll-mt-40 pt-10">
              <h2 className="text-2xl font-extrabold"><span className="mr-2 text-brand">{String(s.num).padStart(2, "0")}</span>{s.title}</h2>
              {s.blocks.map((b, i) => <BlockView key={i} b={b} />)}
            </section>
          ))}
        </article>
      </div>
      <NextBar back={prev} next={next} nextLabel={ci < CHAPTERS.length - 1 ? `Chapter ${ci + 2}: ${CHAPTERS[ci + 1].title}` : "See the evidence & data"} />
    </div>
  );
}

function ChapterNav({ current, secs }: { current: number; secs: Section[] }) {
  return (
    <nav aria-label="Chapters" className="mt-3 text-sm lg:mt-0">
      <Link to="/case-study" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted hover:text-ink">All chapters</Link>
      <ol className="mt-3 space-y-1">
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <Link to={`/case-study/${c.id}`} className={`block rounded-lg px-2.5 py-1.5 ${i === current ? "bg-brand-soft font-semibold text-brand-ink" : "text-ink-2 hover:bg-panel"}`}>
              {i + 1}. {c.title}
            </Link>
            {i === current && (
              <ul className="mb-2 ml-3 mt-1 space-y-0.5 border-l border-line pl-3">
                {secs.map((s) => <li key={s.num}><a href={`#s${s.num}`} className="block py-0.5 text-xs text-muted hover:text-ink">{s.title}</a></li>)}
              </ul>
            )}
          </li>
        ))}
      </ol>
      <a href={DOWNLOADS.casePdf} className="mt-4 inline-block text-xs font-semibold text-brand-ink underline underline-offset-2">Download PDF</a>
    </nav>
  );
}
