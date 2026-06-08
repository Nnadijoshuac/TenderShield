"use client";

import { useState } from "react";
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
    await writeContractAsync({ chainId: addresses.chainId, address: tenderAddress, abi: reverseTenderAbi, functionName: "closeTender" });
  }

  async function requestReveal() {
    setMessage("Marking result handles as publicly decryptable...");
    await writeContractAsync({ chainId: addresses.chainId, address: tenderAddress, abi: reverseTenderAbi, functionName: "requestReveal" });
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
      chainId: addresses.chainId,
      address: tenderAddress,
      abi: reverseTenderAbi,
      functionName: "finalizeTender",
      args: [BigInt(result.clearValues[lowestHandle].toString()), BigInt(result.clearValues[winnerIndexHandle].toString()), result.decryptionProof],
    });
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-lg font-bold text-slate-900">Issuer actions</h2>
      <p className="mb-5 text-sm text-[color:var(--muted)]">Progress the tender through closing, reveal, and finalization.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <button disabled={!canClose} onClick={closeTender} className="rounded-xl border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-3 text-sm font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40">
          Close Tender
        </button>
        <button disabled={!canReveal} onClick={requestReveal} className="rounded-xl border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-3 text-sm font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40">
          Reveal
        </button>
        <button disabled={!canFinalize} onClick={finalizeTender} className="rounded-xl border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-3 text-sm font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40">
          Finalize
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={() => writeContractAsync({ chainId: addresses.chainId, address: tenderAddress, abi: reverseTenderAbi, functionName: "claimRefund" })} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-yellow-300 hover:bg-[color:var(--panel)]">
          Claim refund
        </button>
        <button onClick={() => writeContractAsync({ chainId: addresses.chainId, address: tenderAddress, abi: reverseTenderAbi, functionName: "claimAward" })} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-yellow-300 hover:bg-[color:var(--panel)]">
          Claim award
        </button>
      </div>
      <TransactionToast message={receipt.isSuccess ? "Transaction confirmed." : message} />
    </div>
  );
}
