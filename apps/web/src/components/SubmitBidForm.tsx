"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

export function SubmitBidForm({ tenderAddress, isOpen }: { tenderAddress: `0x${string}`; isOpen: boolean }) {
  const { address } = useAccount();
  const [bidAmount, setBidAmount] = useState("350");

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-sm text-slate-300">The bid board is live. Encrypted submission is wired in the next milestone.</div>
      <div className="flex gap-3">
        <input value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3" />
        <button disabled className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950 disabled:opacity-50">
          Encrypt & Submit Bid
        </button>
      </div>
      <div className="mt-3 text-sm text-slate-400">
        {!address ? "Connect a vendor wallet to prepare a bid." : isOpen ? "Encrypted submission will be enabled next." : "Tender is closed."}
      </div>
    </div>
  );
}
