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
        "neo-pill inline-flex rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]",
        finalized && "text-[color:var(--success)]",
        !finalized && revealRequested && "text-[color:var(--accent)]",
        !finalized && !revealRequested && closed && "text-slate-600",
        !closed && "text-[color:var(--accent)]",
      )}
    >
      {label}
    </span>
  );
}
