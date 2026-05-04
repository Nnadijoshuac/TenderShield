import { Trophy } from "lucide-react";
import { shortAddress } from "../lib/format";

export function ResultCard({ winner, winningBid }: { winner?: string; winningBid?: bigint }) {
  return (
    <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/8 p-6">
      <div className="flex items-center gap-3 text-emerald-300">
        <Trophy className="h-5 w-5" />
        <span className="text-xs uppercase tracking-[0.2em]">Final Result</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-sm text-slate-400">Winner</div>
          <div className="text-lg font-semibold">{winner ? shortAddress(winner) : "Pending"}</div>
        </div>
        <div>
          <div className="text-sm text-slate-400">Winning bid</div>
          <div className="text-lg font-semibold">{winningBid !== undefined ? `${winningBid.toString()} tUSD` : "Pending"}</div>
        </div>
      </div>
    </div>
  );
}
