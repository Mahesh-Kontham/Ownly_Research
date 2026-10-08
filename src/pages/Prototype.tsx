import { useState, type ReactNode } from "react";
import { Eyebrow } from "../components/ui";
import { NextBar } from "../components/Layout";

const CODE = "4827";
const AMOUNT = "₹349";

type Screen =
  | "tracking" | "door" | "verified"
  | "waiting" | "noCaptain" | "refundNoCaptain"
  | "cancelled" | "refundCancelled"
  | "delivered" | "report" | "refundReport";

type Scenario = { id: string; label: string; start: Screen; rule: string; why: string };

const SCENARIOS: Scenario[] = [
  { id: "happy", label: "Order arrives", start: "tracking", rule: "Delivery code",
    why: "The captain can only mark the order delivered with the customer's 4-digit code, so a false “Delivered” becomes impossible to hide. 104 reviews describe exactly that failure." },
  { id: "nocaptain", label: "No captain in 20 min", start: "waiting", rule: "Rule R2",
    why: "Instead of waiting blind for an hour, the customer gets a choice at 20 minutes: cancel with a full refund, or keep waiting with an honest new ETA." },
  { id: "cancel", label: "Cancelled after payment", start: "cancelled", rule: "Rule R1",
    why: "If the order is cancelled for any reason that isn't the customer's, the refund happens automatically. No ticket, no bot, no email." },
  { id: "report", label: "“I didn't get it”", start: "delivered", rule: "Rule R3",
    why: "If a delivery closed without a code match, the customer is refunded instantly. A cap of 2 per 30 days, then manual review, guards against abuse." },
];

function Phone({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="mx-auto w-full max-w-[330px]">
      <div className="relative rounded-[42px] border-[10px] border-ink bg-white shadow-xl" role="region" aria-label={label} aria-live="polite">
        <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-ink" aria-hidden />
        <div className="flex min-h-[560px] flex-col px-5 pb-6 pt-4">{children}</div>
      </div>
    </div>
  );
}

function Btn({ children, onClick, tone = "dark" }: { children: ReactNode; onClick: () => void; tone?: "dark" | "light" | "brand" }) {
  const cls = tone === "dark" ? "bg-ink text-white hover:bg-ink-2" : tone === "brand" ? "bg-brand-strong text-white hover:bg-brand-ink" : "border border-line bg-white text-ink hover:bg-panel";
  return <button type="button" onClick={onClick} className={`w-full rounded-xl px-4 py-3.5 text-[15px] font-semibold transition ${cls}`}>{children}</button>;
}

function Header({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <p className="text-xs text-muted">Order #4182 · Biryani House</p>
      <p className="mt-1 font-display text-xl font-bold">{title}</p>
      {sub && <p className="text-sm text-muted">{sub}</p>}
    </div>
  );
}

function Refund({ reason, onAgain }: { reason: string; onAgain: () => void }) {
  return (
    <>
      <div className="mt-10 grid place-items-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-good-soft text-4xl text-good" aria-hidden>✓</div>
        <p className="mt-5 font-display text-3xl font-extrabold">{AMOUNT} refunded</p>
        <p className="mt-1 text-sm text-muted">to Ownly wallet · just now · Ref OWN-RF-20931</p>
      </div>
      <div className="mt-6 rounded-xl bg-panel p-4 text-sm"><span className="font-semibold">Reason:</span> {reason}</div>
      <p className="mt-3 text-center text-xs text-muted">Prefer your bank? Usually 3–5 working days.</p>
      <div className="mt-auto pt-6"><Btn onClick={onAgain}>Order again</Btn></div>
    </>
  );
}

export default function Prototype() {
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0]);
  const [screen, setScreen] = useState<Screen>(SCENARIOS[0].start);
  const [entry, setEntry] = useState("");
  const [error, setError] = useState("");

  const pick = (s: Scenario) => { setScenario(s); setScreen(s.start); setEntry(""); setError(""); };
  const restart = () => pick(scenario);

  let body: ReactNode = null;
  let caption = "";
  switch (screen) {
    case "tracking":
      caption = "Customer view · the code appears once the food is picked up";
      body = (
        <>
          <Header title="Captain is 6 min away" />
          <div className="mt-4 grid h-28 place-items-center rounded-xl bg-panel text-sm text-muted">map</div>
          <div className="mt-4 rounded-xl border-2 border-brand bg-brand-soft p-4 text-center">
            <p className="text-sm font-medium">Your delivery code</p>
            <p className="mt-1 font-display text-4xl font-extrabold tracking-[0.3em] text-brand-ink">{CODE}</p>
            <p className="mt-1 text-xs text-ink-2">Share it only when the food is in your hands</p>
          </div>
          <div className="mt-3 rounded-xl bg-good-soft p-3 text-center text-sm font-semibold text-good">Ownly Promise: food or your money back</div>
          <div className="mt-auto pt-6"><Btn onClick={() => setScreen("door")}>Captain arrives at the door →</Btn></div>
        </>
      );
      break;
    case "door":
      caption = "Captain view · type the code the customer reads out (try 4827)";
      body = (
        <>
          <p className="text-xs text-muted">Captain app · Drop at Flat 302, Block C</p>
          <p className="mt-6 text-center font-display text-xl font-bold">Ask the customer for their 4-digit code</p>
          <label htmlFor="code" className="sr-only">Delivery code</label>
          <input
            id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={4} value={entry}
            onChange={(e) => { setEntry(e.target.value.replace(/\D/g, "")); setError(""); }}
            className="mx-auto mt-6 w-44 rounded-xl border-2 border-line px-4 py-3 text-center font-display text-3xl font-bold tracking-[0.4em] focus:border-brand"
            placeholder="····"
          />
          {error && <p role="alert" className="mt-3 text-center text-sm font-medium text-bad">{error}</p>}
          <div className="mt-6"><Btn onClick={() => (entry === CODE ? setScreen("verified") : setError(entry.length < 4 ? "Enter all 4 digits" : "Code doesn't match. 2 tries left"))}>Complete delivery</Btn></div>
          <p className="mt-auto pt-6 text-center text-xs text-muted">Customer not answering? After 2 calls and 3 minutes: photo + location fallback.</p>
        </>
      );
      break;
    case "verified":
      caption = "Customer view · delivered, and provably so";
      body = (
        <>
          <div className="mt-12 grid place-items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-good-soft text-4xl text-good" aria-hidden>✓</div>
            <p className="mt-5 font-display text-2xl font-extrabold">Delivered · verified</p>
            <p className="mt-1 text-sm text-muted">Code matched at your door · 8:41 PM</p>
          </div>
          <div className="mt-auto pt-6"><Btn tone="light" onClick={restart}>Replay</Btn></div>
        </>
      );
      break;
    case "waiting":
      caption = "Customer view · restaurant accepted, captain still searching";
      body = (
        <>
          <Header title="Finding a captain…" sub="Restaurant accepted 19 min ago" />
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-panel"><div className="h-2 w-[95%] rounded-full bg-brand" /></div>
          <div className="mt-auto pt-6"><Btn onClick={() => setScreen("noCaptain")}>Skip to 20 minutes →</Btn></div>
        </>
      );
      break;
    case "noCaptain":
      caption = "Customer view · the choice appears before they have to ask for help";
      body = (
        <>
          <div className="mt-2 rounded-xl border-2 border-brand bg-brand-soft p-4">
            <p className="font-display text-lg font-bold">We haven't found a captain in 20 min</p>
            <p className="mt-1 text-sm text-ink-2">Sorry. You can cancel now and get {AMOUNT} back instantly.</p>
          </div>
          <div className="mt-6 space-y-3">
            <Btn onClick={() => setScreen("refundNoCaptain")}>Cancel · refund {AMOUNT}</Btn>
            <Btn tone="light" onClick={restart}>Keep waiting (new ETA 18 min)</Btn>
          </div>
        </>
      );
      break;
    case "refundNoCaptain":
      caption = "Customer view · refund shown as a fact, not “initiated”";
      body = <Refund reason="no captain found within 20 minutes" onAgain={restart} />;
      break;
    case "cancelled":
      caption = "System event · the restaurant cancels after payment";
      body = (
        <>
          <Header title="Order cancelled" sub="The restaurant couldn't prepare your order" />
          <div className="mt-6 rounded-xl bg-panel p-4 text-sm text-ink-2">Today, this is where customers start chasing a refund through a bot and email.</div>
          <div className="mt-auto pt-6"><Btn tone="brand" onClick={() => setScreen("refundCancelled")}>See what happens with the Promise →</Btn></div>
        </>
      );
      break;
    case "refundCancelled":
      caption = "Customer view · refunded automatically within a minute";
      body = <Refund reason="order cancelled by the restaurant after payment" onAgain={restart} />;
      break;
    case "delivered":
      caption = "Customer view · marked delivered, but the code was never entered";
      body = (
        <>
          <Header title="Delivered · not verified" sub="Closed by the captain with photo fallback" />
          <div className="mt-6 grid h-32 place-items-center rounded-xl bg-panel text-sm text-muted">doorstep photo</div>
          <div className="mt-auto pt-6"><Btn tone="light" onClick={() => setScreen("report")}>Something's wrong?</Btn></div>
        </>
      );
      break;
    case "report":
      caption = "Customer view · one tap, no ticket";
      body = (
        <>
          <p className="mt-2 font-display text-xl font-bold">What happened?</p>
          <div className="mt-5 space-y-3">
            <Btn onClick={() => setScreen("refundReport")}>I didn't receive my order</Btn>
            <Btn tone="light" onClick={restart}>Items missing or wrong</Btn>
            <Btn tone="light" onClick={restart}>Something else</Btn>
          </div>
          <p className="mt-auto pt-6 text-center text-xs text-muted">This delivery wasn't verified with your code, so you qualify for an instant refund.</p>
        </>
      );
      break;
    case "refundReport":
      caption = "Customer view · instant refund because the handover was never verified";
      body = <Refund reason="delivery not verified with your code" onAgain={restart} />;
      break;
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <Eyebrow>Step 3 · Try the idea</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.1] sm:text-5xl">Food, or your money back in minutes</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">
          A clickable sketch of <strong className="text-ink">Ownly Promise v1</strong>. Pick a situation and tap through it. It's a prototype to
          discuss, not a finished design, and nothing here has been built or tested.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Scenarios">
          {SCENARIOS.map((s) => (
            <button
              key={s.id} type="button" role="tab" aria-selected={s.id === scenario.id} onClick={() => pick(s)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${s.id === scenario.id ? "bg-ink text-white" : "border border-line bg-white text-ink hover:bg-panel"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Phone label={caption}>{body}</Phone>
            <p className="mt-4 text-center text-sm text-muted">{caption}</p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-line p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink">{scenario.rule}</p>
              <p className="mt-2 text-[17px] leading-relaxed text-ink-2">{scenario.why}</p>
            </div>
            <div className="rounded-2xl bg-panel p-6">
              <p className="font-display text-lg font-bold">How we'd know it works</p>
              <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
                <li><strong className="text-ink">Primary:</strong> “not received” claims per 1,000 orders fall by ≥ 40% in pilot zones</li>
                <li><strong className="text-ink">North Star:</strong> weekly orders where the promise was kept</li>
                <li><strong className="text-ink">Guardrails:</strong> captains keep accepting food orders; refund abuse stays under 2%</li>
              </ul>
              <p className="mt-3 text-xs text-muted">Targets, not results. Amounts and order numbers on the phone are placeholders.</p>
            </div>
          </div>
        </div>
      </div>
      <NextBar back="/story" next="/case-study" nextLabel="Read the full case study" />
    </div>
  );
}
