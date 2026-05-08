import { Lock } from "lucide-react";
import { shortAddress } from "../lib/format";

export function EncryptedBidCard({ bidder, index }: { bidder: string; index: number }) {
  return (
    <div className="neo-surface-soft rounded-[1.75rem] p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Bid #{index + 1}</div>
          <div className="mt-1 font-medium text-[color:var(--copy)]">{shortAddress(bidder)}</div>
        </div>
        <div className="neo-pill flex h-10 w-10 items-center justify-center rounded-[1rem] text-[color:var(--accent)]">
          <Lock className="h-4 w-4" />
        </div>
      </div>
      <div className="text-sm text-[color:var(--muted)]">Encrypted quote locked.</div>
    </div>
  );
}
