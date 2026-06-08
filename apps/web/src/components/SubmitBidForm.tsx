"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { reverseTenderAbi } from "../lib/contracts";
import { encryptBid } from "../lib/fhe";
import { TransactionToast } from "./TransactionToast";

export function SubmitBidForm({ tenderAddress, isOpen }: { tenderAddress: `0x${string}`; isOpen: boolean }) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [bidAmount, setBidAmount] = useState("350");
  const [message, setMessage] = useState<string>();
  const { writeContractAsync, data: hash } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  async function onSubmit() {
    if (!publicClient || !address) return;

    setMessage("Encrypting bid with the relayer SDK...");
    const encrypted = await encryptBid(publicClient, tenderAddress, address, BigInt(bidAmount));
    setMessage("Submitting encrypted bid onchain...");

    await writeContractAsync({
      address: tenderAddress,
      abi: reverseTenderAbi,
      functionName: "submitBid",
      args: [encrypted.handle, encrypted.inputProof],
    });
  }

  return (
    <div className="rounded-3xl border border-yellow-300 bg-[color:var(--panel)] p-6">
      <h2 className="mb-1 text-lg font-bold text-slate-900">Submit an encrypted bid</h2>
      <p className="mb-5 text-sm text-[color:var(--muted)]">Your quote is encrypted before it leaves the browser.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="bidAmount" className="sr-only">Bid amount</label>
        <input id="bidAmount" type="number" min="0" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100" />
        <button disabled={!isOpen || !address} onClick={onSubmit} className="rounded-xl border border-[color:var(--accent)] bg-[color:var(--accent)] px-5 py-3 font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50">
          Encrypt and submit
        </button>
      </div>
      <div className="mt-3 text-sm text-[color:var(--muted)]">{!address ? "Connect a supplier wallet to bid." : isOpen ? "Your bid stays hidden." : "Bidding is closed."}</div>
      <TransactionToast message={receipt.isSuccess ? "Encrypted bid submitted." : message} />
    </div>
  );
}
