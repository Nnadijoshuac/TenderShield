"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { sepolia } from "viem/chains";
import { addresses } from "../config/addresses";
import { reverseTenderAbi } from "../lib/contracts";
import { encryptBid } from "../lib/fhe";
import { TransactionToast } from "./TransactionToast";

export function SubmitBidForm({ tenderAddress, isOpen }: { tenderAddress: `0x${string}`; isOpen: boolean }) {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: addresses.chainId });
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
      chain: sepolia,
      chainId: addresses.chainId,
      address: tenderAddress,
      abi: reverseTenderAbi,
      functionName: "submitBid",
      args: [encrypted.handle, encrypted.inputProof],
    });
  }

  return (
    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-5">
      <h2 className="mb-1 font-bold text-slate-900">Submit encrypted bid</h2>
      <p className="mb-4 text-sm text-slate-600">Your quote is encrypted before leaving your browser.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="bidAmount" className="sr-only">Bid amount</label>
        <input id="bidAmount" type="number" min="0" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="Bid amount" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200" />
        <button disabled={!isOpen || !address} onClick={onSubmit} className="rounded-lg border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-2 font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap">
          Encrypt & submit
        </button>
      </div>
      <div className="mt-3 text-xs text-slate-600">{!address ? "Connect a wallet to bid." : isOpen ? "Bid stays hidden." : "Bidding closed."}</div>
      <TransactionToast message={receipt.isSuccess ? "Encrypted bid submitted." : message} />
    </div>
  );
}
