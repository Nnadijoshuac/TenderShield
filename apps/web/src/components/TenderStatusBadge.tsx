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
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        finalized && "bg-emerald-400/15 text-emerald-300",
        !finalized && revealRequested && "bg-amber-400/15 text-amber-200",
        !finalized && !revealRequested && closed && "bg-slate-200/10 text-slate-200",
        !closed && "bg-sky-400/15 text-sky-300",
      )}
    >
      {label}
    </span>
  );
}
