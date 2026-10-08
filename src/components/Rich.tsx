import { Fragment } from "react";

// Evidence labels used throughout the case study.
const BADGES: Record<string, string> = {
  ACTUAL: "bg-good-soft text-good", FACT: "bg-good-soft text-good", VERIFIED: "bg-good-soft text-good", CONFIRMED: "bg-good-soft text-good",
  HIGH: "bg-good-soft text-good",
  OBSERVATION: "bg-panel text-muted", OBSERVED: "bg-panel text-muted", SECONDARY: "bg-panel text-muted",
  INFERENCE: "bg-recovery-soft text-recovery", INFERRED: "bg-recovery-soft text-recovery", HYPOTHESIS: "bg-recovery-soft text-recovery",
  ESTIMATE: "bg-blue-50 text-blue-700", EXPECTED: "bg-blue-50 text-blue-700", LIKELY: "bg-blue-50 text-blue-700", "MEDIUM-HIGH": "bg-blue-50 text-blue-700",
  ASSUMPTION: "bg-warn-soft text-warn", SUSPECTED: "bg-warn-soft text-warn", MEDIUM: "bg-warn-soft text-warn", "LOW-MEDIUM": "bg-warn-soft text-warn",
  UNKNOWN: "bg-bad-soft text-bad", "REQUIRES VALIDATION": "bg-bad-soft text-bad", "INSUFFICIENT EVIDENCE": "bg-bad-soft text-bad",
  REJECTED: "bg-bad-soft text-bad", LOW: "bg-bad-soft text-bad",
};

export function Badge({ label }: { label: string }) {
  const cls = BADGES[label] ?? "bg-panel text-muted";
  return (
    <span className={`mx-0.5 inline-block whitespace-nowrap rounded px-1.5 py-px align-[1px] text-[10.5px] font-semibold tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

// Renders **bold**, *italic* and {{LABEL}} markers; newlines become line breaks.
export function Rich({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/(\*\*[^*]+\*\*|\{\{[^}]+\}\}|\*[^*]+\*)/g).map((tok, i) => {
            if (!tok) return null;
            if (tok.startsWith("**")) return <strong key={i} className="font-semibold text-ink">{tok.slice(2, -2)}</strong>;
            if (tok.startsWith("{{")) return <Badge key={i} label={tok.slice(2, -2)} />;
            if (tok.startsWith("*") && tok.length > 2) return <em key={i}>{tok.slice(1, -1)}</em>;
            return <Fragment key={i}>{tok}</Fragment>;
          })}
        </Fragment>
      ))}
    </>
  );
}
