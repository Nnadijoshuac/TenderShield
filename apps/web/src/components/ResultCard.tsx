import { Trophy } from "lucide-react";
import { shortAddress } from "../lib/format";

export function ResultCard({ winner, winningBid }: { winner?: string; winningBid?: bigint }) {
  return (
    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-yellow-600" />
        <span className="text-sm font-semibold uppercase tracking-wide text-yellow-700">Final Result</span>
      </div>
      <div className="space-y-3">
        <div>
          <div className="text-xs text-yellow-700 font-semibold uppercase tracking-wide mb-1">Winner</div>
          <div className="text-lg font-semibold text-slate-900">{winner ? shortAddress(winner) : "Pending"}</div>
        </div>
        <div>
          <div className="text-xs text-yellow-700 font-semibold uppercase tracking-wide mb-1">Winning bid</div>
          <div className="text-lg font-semibold text-slate-900">{winningBid !== undefined ? `${winningBid.toString()} tUSD` : "Pending"}</div>
        </div>
      </div>
    </div>
  );
}
