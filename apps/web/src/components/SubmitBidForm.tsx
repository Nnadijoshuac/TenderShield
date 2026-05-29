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
    <div className="border border-slate-200 bg-white p-6">
      <div className="mb-4 text-sm text-[color:var(--muted)]">Encrypt quote. submit.</div>
      <div className="flex gap-3">
        <input value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="flex-1 border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none" />
        <button disabled={!isOpen || !address} onClick={onSubmit} className="border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-3 font-medium text-black disabled:opacity-50">
          Submit
        </button>
      </div>
      <div className="mt-3 text-sm text-[color:var(--muted)]">{!address ? "Connect vendor wallet." : "Bid stays hidden."}</div>
      <TransactionToast message={receipt.isSuccess ? "Encrypted bid submitted." : message} />
    </div>
  );
}
