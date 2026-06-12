"use client";

import { useState } from "react";
import { sepolia } from "viem/chains";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { addresses } from "../config/addresses";
import { reverseTenderAbi } from "../lib/contracts";
import { publicDecryptTenderResult } from "../lib/fhe";
import { TransactionToast } from "./TransactionToast";

export function IssuerActions({
  tenderAddress,
  canClose,
  canReveal,
  canFinalize,
}: {
  tenderAddress: `0x${string}`;
  canClose: boolean;
  canReveal: boolean;
  canFinalize: boolean;
}) {
  const publicClient = usePublicClient({ chainId: addresses.chainId });
  const { writeContractAsync, data: hash } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });
  const [message, setMessage] = useState<string>();

  async function closeTender() {
    setMessage("Closing tender and computing encrypted minimum...");
    await writeContractAsync({ chain: sepolia, chainId: addresses.chainId, address: tenderAddress, abi: reverseTenderAbi, functionName: "closeTender" });
  }

  async function requestReveal() {
    setMessage("Marking result handles as publicly decryptable...");
    await writeContractAsync({ chain: sepolia, chainId: addresses.chainId, address: tenderAddress, abi: reverseTenderAbi, functionName: "requestReveal" });
  }

  async function finalizeTender() {
    if (!publicClient) return;
    setMessage("Fetching public decryption proof from relayer...");

    const [lowestHandle, winnerIndexHandle] = await publicClient.readContract({
      address: tenderAddress,
      abi: reverseTenderAbi,
      functionName: "getEncryptedResultHandles",
    });

    const result = await publicDecryptTenderResult(publicClient, [lowestHandle, winnerIndexHandle]);
    setMessage("Finalizing winner selection onchain...");

    await writeContractAsync({
      chain: sepolia,
      chainId: addresses.chainId,
      address: tenderAddress,
      abi: reverseTenderAbi,
      functionName: "finalizeTender",
      args: [BigInt(result.clearValues[lowestHandle].toString()), BigInt(result.clearValues[winnerIndexHandle].toString()), result.decryptionProof],
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 p-5">
      <h2 className="font-bold text-slate-900 mb-1">Issuer actions</h2>
      <p className="text-sm text-slate-600 mb-4">Progress through closing, reveal, and finalization.</p>
      <div className="grid gap-2 sm:grid-cols-3 mb-3">
        <button disabled={!canClose} onClick={closeTender} className="rounded-lg border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40">
          Close
        </button>
        <button disabled={!canReveal} onClick={requestReveal} className="rounded-lg border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40">
          Reveal
        </button>
        <button disabled={!canFinalize} onClick={finalizeTender} className="rounded-lg border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40">
          Finalize
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => writeContractAsync({ chain: sepolia, chainId: addresses.chainId, address: tenderAddress, abi: reverseTenderAbi, functionName: "claimRefund" })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
          Claim refund
        </button>
        <button onClick={() => writeContractAsync({ chain: sepolia, chainId: addresses.chainId, address: tenderAddress, abi: reverseTenderAbi, functionName: "claimAward" })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
          Claim award
        </button>
      </div>
      <TransactionToast message={receipt.isSuccess ? "Transaction confirmed." : message} />
    </div>
  );
}
