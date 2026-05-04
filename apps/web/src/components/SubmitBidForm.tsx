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
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-sm text-slate-300">Only encrypted inputs leave the browser. The UI never sends a plaintext bid amount to the contract.</div>
      <div className="flex gap-3">
        <input value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3" />
        <button disabled={!isOpen || !address} onClick={onSubmit} className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950 disabled:opacity-50">
          Encrypt & Submit Bid
        </button>
      </div>
      <div className="mt-3 text-sm text-slate-400">{!address ? "Connect a vendor wallet to submit a bid." : "Contract can compare this bid without decrypting it."}</div>
      <TransactionToast message={receipt.isSuccess ? "Encrypted bid submitted." : message} />
    </div>
  );
}
