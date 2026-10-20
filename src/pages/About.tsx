import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { EDUCATION, EXPERIENCE, HIGHLIGHTS, PROFILE, PROJECTS, RECOGNITION, SKILLS } from "../content/resume";

const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "recognition", label: "Recognition" },
];

/* ---------- motion helpers ---------- */

function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return { ref, seen };
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}

function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.5);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200);
      setN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{n.toFixed(decimals)}{suffix}</span>;
}

function Rotator({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className="relative inline-block min-w-[11ch] text-left align-bottom">
      <span key={i} className="animate-word-in inline-block bg-gradient-to-r from-brand to-[#ff8a3d] bg-clip-text text-transparent">{words[i]}</span>
    </span>
  );
}

function SectionTitle({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <Reveal>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink">{kicker}</p>
      <h2 id={`${id}-title`} className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2>
    </Reveal>
  );
}

/* ---------- sections ---------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="animate-blob pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/40 blur-3xl" />
      <div aria-hidden className="animate-blob pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-[#7c3aed]/40 blur-3xl [animation-delay:-6s]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" /></span>
            Research · product · engineering
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] sm:text-7xl">{PROFILE.name}</h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-5 max-w-2xl text-xl leading-snug text-white/80 sm:text-2xl">
            I take products from <Rotator words={PROFILE.rotating} />
            <br className="hidden sm:block" /> to something real people use.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${PROFILE.email}`} className="group inline-flex items-center gap-2 rounded-full bg-brand-strong px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-brand-ink">
              <MailIcon /> {PROFILE.email}
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white/10">
              <LinkedInIcon /> LinkedIn
            </a>
            <a href={`tel:+91${PROFILE.phone}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white/10">
              <PhoneIcon /> {PROFILE.phone}
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.label} delay={400 + i * 90}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-brand/60 hover:bg-white/10">
                <p className="font-display text-4xl font-extrabold text-white"><CountUp to={h.value} decimals={h.decimals} suffix={h.suffix} /></p>
                <p className="mt-1 text-sm leading-snug text-white/70">{h.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav aria-label="Resume sections" className="sticky top-[57px] z-20 border-b border-line bg-white/90 backdrop-blur">
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 [scrollbar-width:none]">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`block whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${active === s.id ? "bg-ink text-white" : "text-ink-2 hover:bg-panel"}`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Profile() {
  return (
    <section id="profile" aria-labelledby="profile-title" className="scroll-mt-32">
      <SectionTitle id="profile" kicker="01 · Profile" title="Builder with a product brain" />
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Reveal delay={100}>
          <p className="text-lg leading-relaxed text-ink-2">{PROFILE.summary}</p>
        </Reveal>
        <Reveal delay={200}>
          <div className="grid gap-3">
            {[
              ["Discover", "Interview users, find the real friction"],
              ["Define", "Turn it into a sharp problem and requirements"],
              ["Build", "Ship the MVP myself — React, Node, Supabase"],
              ["Iterate", "Pilot with real users, learn, repeat"],
            ].map(([k, v], i) => (
              <div key={k} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft font-display font-extrabold text-brand-ink transition group-hover:bg-brand group-hover:text-white">{i + 1}</span>
                <div>
                  <p className="font-display font-bold">{k}</p>
                  <p className="text-sm text-muted">{v}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Experience() {
  const [sel, setSel] = useState(EXPERIENCE[0].id);
  const role = EXPERIENCE.find((r) => r.id === sel)!;
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-32">
      <SectionTitle id="experience" kicker="02 · Experience" title="Where I've built and grown things" />
      <Reveal delay={100} className="mt-8">
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <div role="tablist" aria-label="Roles" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 [scrollbar-width:none]">
            {EXPERIENCE.map((r) => {
              const on = r.id === sel;
              return (
                <button
                  key={r.id}
                  role="tab"
                  aria-selected={on}
                  aria-controls="role-panel"
                  onClick={() => setSel(r.id)}
                  className={`relative min-w-[230px] shrink-0 rounded-2xl border p-4 text-left transition lg:min-w-0 ${on ? "border-ink bg-ink text-white shadow-xl" : "border-line bg-white hover:border-brand/40 hover:bg-brand-soft/40"}`}
                >
                  <span className={`text-xs font-semibold ${on ? "text-brand" : "text-brand-ink"}`}>{r.dates}</span>
                  <span className="mt-1 block font-display font-bold leading-tight">{r.company}</span>
                  <span className={`mt-0.5 block text-sm ${on ? "text-white/70" : "text-muted"}`}>{r.title}</span>
                  {r.current && <span className="absolute right-3 top-3 rounded-full bg-[#22c55e]/15 px-2 py-0.5 text-[11px] font-semibold text-[#22c55e]">Now</span>}
                </button>
              );
            })}
          </div>

          <article id="role-panel" role="tabpanel" key={role.id} className="animate-panel-in rounded-3xl border border-line bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-extrabold">{role.title}</h3>
                <p className="mt-1 font-semibold text-brand-ink">{role.company} <span className="font-normal text-muted">· {role.location}</span></p>
              </div>
              <span className="rounded-full bg-panel px-3 py-1 text-sm font-semibold text-ink-2">{role.dates}</span>
            </div>
            <p className="mt-4 text-lg text-ink-2">{role.gist}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {role.metrics.map((m) => <span key={m} className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-ink">{m}</span>)}
            </div>
            <ol className="mt-6 space-y-4">
              {role.points.map((p, i) => (
                <li key={p.lead} style={{ animationDelay: `${i * 80}ms` } as CSSProperties} className="animate-panel-in flex gap-4">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>
                  <p className="leading-relaxed text-ink-2"><span className="font-semibold text-ink">{p.lead}</span> {p.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5">
              {role.tags.map((t) => <span key={t} className="rounded-md border border-line px-2 py-0.5 text-xs font-medium text-muted">{t}</span>)}
            </div>
          </article>
        </div>
      </Reveal>
    </section>
  );
}

function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className="group relative h-full overflow-hidden rounded-3xl border border-line bg-white p-6 transition-transform duration-200 ease-out hover:shadow-2xl hover:shadow-brand/10 sm:p-7"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 [background:radial-gradient(400px_circle_at_var(--mx)_var(--my),rgba(255,41,125,0.10),transparent_60%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-32">
      <SectionTitle id="projects" kicker="03 · Projects" title="Things I built on my own" />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 120}>
            <TiltCard>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-extrabold leading-tight">{p.name}</h3>
                <div className="shrink-0 rounded-2xl bg-ink px-3 py-2 text-center text-white">
                  <p className="font-display text-lg font-extrabold leading-none">{p.stat.value}</p>
                  <p className="mt-0.5 text-[11px] text-white/70">{p.stat.label}</p>
                </div>
              </div>
              <p className="mt-3 text-sm italic text-muted">{p.problem}</p>
              <ul className="mt-4 space-y-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-ink-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{pt}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => <span key={s} className="rounded-full bg-panel px-2.5 py-1 text-xs font-semibold text-ink-2 transition group-hover:bg-brand-soft group-hover:text-brand-ink">{s}</span>)}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  const groups = Object.keys(SKILLS) as (keyof typeof SKILLS)[];
  const [filter, setFilter] = useState<"All" | keyof typeof SKILLS>("All");
  const shown = groups.flatMap((g) => SKILLS[g].map((s) => ({ s, g }))).filter((x) => filter === "All" || x.g === filter);
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-32">
      <SectionTitle id="skills" kicker="04 · Skills" title="Product sense, with the hands to build" />
      <Reveal delay={100} className="mt-6">
        <div role="group" aria-label="Filter skills" className="inline-flex rounded-full border border-line bg-panel p-1">
          {(["All", ...groups] as const).map((g) => (
            <button
              key={g}
              aria-pressed={filter === g}
              onClick={() => setFilter(g)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${filter === g ? "bg-white text-ink shadow" : "text-muted hover:text-ink"}`}
            >
              {g}
            </button>
          ))}
        </div>
        <ul key={filter} className="mt-6 flex flex-wrap gap-2.5">
          {shown.map(({ s, g }, i) => (
            <li
              key={s}
              style={{ animationDelay: `${i * 35}ms` }}
              className={`animate-pop-in cursor-default rounded-2xl border px-4 py-2.5 text-[15px] font-semibold transition hover:-translate-y-1 hover:shadow-lg ${g === "Product & Business" ? "border-brand/25 bg-brand-soft text-brand-ink hover:shadow-brand/10" : "border-[#7c3aed]/20 bg-recovery-soft text-recovery hover:shadow-[#7c3aed]/10"}`}
            >
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-brand" /> Product & Business</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-recovery" /> Technology & AI</span>
        </div>
      </Reveal>
    </section>
  );
}

function CgpaRing({ value }: { value: number }) {
  const { ref, seen } = useInView<SVGSVGElement>(0.5);
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg ref={ref} viewBox="0 0 80 80" className="h-24 w-24 -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-line)" strokeWidth="7" />
        <circle
          cx="40" cy="40" r={r} fill="none" stroke="var(--color-brand)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={seen ? c * (1 - value / 10) : c}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-xl font-extrabold leading-none">{value}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">CGPA</p>
        </div>
      </div>
    </div>
  );
}

function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="scroll-mt-32">
      <SectionTitle id="education" kicker="05 · Education" title="Computer Science, twice over" />
      <div className="relative mt-8 grid gap-5 md:grid-cols-2">
        {EDUCATION.map((e, i) => (
          <Reveal key={e.school} delay={i * 120}>
            <div className="flex h-full items-center gap-5 rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <CgpaRing value={e.cgpa} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-brand-ink">{e.dates}</p>
                <h3 className="mt-1 text-lg font-extrabold leading-tight">{e.school}</h3>
                <p className="mt-1 text-sm text-ink-2">{e.degree}</p>
                <p className="mt-1 text-xs text-muted">{e.location}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Recognition() {
  return (
    <section id="recognition" aria-labelledby="recognition-title" className="scroll-mt-32">
      <SectionTitle id="recognition" kicker="06 · Leadership & recognition" title="Beyond the work" />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {RECOGNITION.map((r, i) => (
          <Reveal key={r.title} delay={i * 120}>
            <div className="group flex h-full gap-4 rounded-3xl border border-line bg-gradient-to-br from-white to-brand-soft/60 p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink text-xl text-white transition group-hover:rotate-6 group-hover:bg-brand" aria-hidden>★</span>
              <div>
                <p className="text-xs font-semibold text-brand-ink">{r.year}</p>
                <h3 className="mt-1 font-display text-lg font-extrabold leading-tight">{r.title}</h3>
                <p className="mt-2 text-sm text-ink-2">{r.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- page ---------- */

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = `${PROFILE.name} · About me`;
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/evidence" className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-2 transition hover:bg-panel">← Back to the case study</Link>
          <p className="truncate font-display text-[15px] font-bold">{PROFILE.name}</p>
        </div>
      </header>

      <Hero />
      <SectionNav />

      <main className="mx-auto max-w-6xl space-y-24 px-4 py-16 sm:px-6 sm:py-20">
        <Profile />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Recognition />

        <Reveal>
          <section className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-12">
            <div aria-hidden className="animate-blob pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Let's talk</p>
              <p className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">If you're working on problems that need research, clear decisions and thoughtful execution, I'd love to connect.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={`mailto:${PROFILE.email}`} className="inline-flex items-center gap-2 rounded-full bg-brand-strong px-6 py-3.5 text-[15px] font-semibold transition hover:-translate-y-0.5 hover:bg-brand-ink"><MailIcon /> Email me</a>
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-[15px] font-semibold transition hover:-translate-y-0.5 hover:bg-white/10"><LinkedInIcon /> {PROFILE.linkedinLabel}</a>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}

/* ---------- icons ---------- */

function MailIcon() {
  return <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
}
function PhoneIcon() {
  return <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" /></svg>;
}
function LinkedInIcon() {
  return <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" /></svg>;
}
