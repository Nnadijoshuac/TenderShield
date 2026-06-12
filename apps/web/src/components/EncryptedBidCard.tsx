import { Lock } from "lucide-react";
import { shortAddress } from "../lib/format";

export function EncryptedBidCard({ bidder, index }: { bidder: string; index: number }) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-slate-200 p-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Bid #{index + 1}</div>
        <div className="font-semibold text-slate-900">{shortAddress(bidder)}</div>
        <div className="text-sm text-slate-600 mt-2">Encrypted</div>
      </div>
      <Lock className="h-5 w-5 text-[color:var(--accent-ink)] flex-shrink-0 mt-1" />
    </div>
  );
}
