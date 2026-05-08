"use client";

import { useState } from "react";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
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
  const publicClient = usePublicClient();
  const { writeContractAsync, data: hash } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });
  const [message, setMessage] = useState<string>();

  async function closeTender() {
    setMessage("Closing tender and computing encrypted minimum...");
    await writeContractAsync({ address: tenderAddress, abi: reverseTenderAbi, functionName: "closeTender" });
  }

  async function requestReveal() {
    setMessage("Marking result handles as publicly decryptable...");
    await writeContractAsync({ address: tenderAddress, abi: reverseTenderAbi, functionName: "requestReveal" });
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
      address: tenderAddress,
      abi: reverseTenderAbi,
      functionName: "finalizeTender",
      args: [BigInt(result.clearValues[lowestHandle].toString()), BigInt(result.clearValues[winnerIndexHandle].toString()), result.decryptionProof],
    });
  }

  return (
    <div className="neo-surface rounded-[2.25rem] p-6">
      <div className="mb-4 text-sm text-[color:var(--muted)]">Close. reveal. finalize.</div>
      <div className="flex flex-wrap gap-3">
        <button disabled={!canClose} onClick={closeTender} className="neo-pill rounded-[1.5rem] px-4 py-3 text-sm font-medium text-[color:var(--copy)] disabled:opacity-50">
          Close Tender
        </button>
        <button disabled={!canReveal} onClick={requestReveal} className="neo-pill rounded-[1.5rem] px-4 py-3 text-sm font-medium text-[color:var(--copy)] disabled:opacity-50">
          Reveal
        </button>
        <button disabled={!canFinalize} onClick={finalizeTender} className="neo-pill rounded-[1.5rem] px-4 py-3 text-sm font-medium text-[color:var(--copy)] disabled:opacity-50">
          Finalize
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={() => writeContractAsync({ address: tenderAddress, abi: reverseTenderAbi, functionName: "claimRefund" })} className="neo-inset rounded-[1.5rem] px-4 py-3 text-sm text-[color:var(--muted)]">
          Refund
        </button>
        <button onClick={() => writeContractAsync({ address: tenderAddress, abi: reverseTenderAbi, functionName: "claimAward" })} className="neo-inset rounded-[1.5rem] px-4 py-3 text-sm text-[color:var(--muted)]">
          Award
        </button>
      </div>
      <TransactionToast message={receipt.isSuccess ? "Transaction confirmed." : message} />
    </div>
  );
}
