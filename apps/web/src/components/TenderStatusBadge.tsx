import { cn } from "../lib/utils";

export function TenderStatusBadge({
  closed,
  revealRequested,
  finalized,
}: {
  closed?: boolean;
  revealRequested?: boolean;
  finalized?: boolean;
}) {
  const label = finalized ? "Finalized" : revealRequested ? "Reveal requested" : closed ? "Closed" : "Open";

  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
        finalized && "text-[color:var(--success)]",
        !finalized && revealRequested && "border-yellow-300 bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]",
        !finalized && !revealRequested && closed && "text-slate-600",
        !closed && "border-yellow-300 bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]",
      )}
    >
      {label}
    </span>
  );
}
