import { Lock } from "lucide-react";
import { shortAddress } from "../lib/format";

export function EncryptedBidCard({ bidder, index }: { bidder: string; index: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Bid #{index + 1}</div>
          <div className="mt-1 font-medium text-slate-100">{shortAddress(bidder)}</div>
        </div>
        <Lock className="h-5 w-5 text-sky-300" />
      </div>
      <div className="text-sm text-slate-300">Bid amount hidden by FHE. The contract can compare this bid without decrypting it.</div>
    </div>
  );
}
