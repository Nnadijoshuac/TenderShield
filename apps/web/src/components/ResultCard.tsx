import { Trophy } from "lucide-react";
import { shortAddress } from "../lib/format";

export function ResultCard({ winner, winningBid }: { winner?: string; winningBid?: bigint }) {
  return (
    <div className="border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3 text-[color:var(--success)]">
        <div className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-slate-50">
          <Trophy className="h-4 w-4" />
        </div>
        <span className="text-xs uppercase tracking-[0.2em]">Final Result</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-sm text-[color:var(--muted)]">Winner</div>
          <div className="text-lg font-semibold text-[color:var(--copy)]">{winner ? shortAddress(winner) : "Pending"}</div>
        </div>
        <div>
          <div className="text-sm text-[color:var(--muted)]">Winning bid</div>
          <div className="text-lg font-semibold text-[color:var(--copy)]">{winningBid !== undefined ? `${winningBid.toString()} tUSD` : "Pending"}</div>
        </div>
      </div>
    </div>
  );
}
