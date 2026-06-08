"use client";

import { CheckCircle2, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { sepolia } from "viem/chains";
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { addresses } from "../config/addresses";
import { tenderFactoryAbi } from "../lib/contracts";
import { TransactionToast } from "./TransactionToast";

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100";

export function CreateTenderForm() {
  const router = useRouter();
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: addresses.chainId });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [bidBond, setBidBond] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  const [prepareError, setPrepareError] = useState<string>();
  const [isPreparing, setIsPreparing] = useState(false);
  const receipt = useWaitForTransactionReceipt({ hash });

  const isReady = useMemo(() => !!addresses.tenderFactory && !!address, [address]);
  const formValid = title && description && deadline && bidBond && maxBudget;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!addresses.tenderFactory || !address || !publicClient || !formValid) return;

    setPrepareError(undefined);
    setIsPreparing(true);
    const args = [
      title,
      description,
      BigInt(Math.floor(new Date(deadline).getTime() / 1000)),
      BigInt(Number(bidBond)),
      BigInt(Number(maxBudget)),
      (addresses.tenderToken ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
    ] as const;

    try {
      let gasLimit: bigint | undefined;
      
      if (publicClient) {
        try {
          const estimatedGas = await publicClient.estimateContractGas({
            account: address,
            address: addresses.tenderFactory,
            abi: tenderFactoryAbi,
            functionName: "createTender",
            args,
          });
          gasLimit = (estimatedGas * 120n) / 100n;
        } catch (gasError) {
          console.warn("Gas estimation failed, proceeding without pre-estimated gas:", gasError);
          // Continue without gas estimation - Wagmi will estimate it
        }
      }

      await writeContractAsync({
        chain: sepolia,
        chainId: addresses.chainId,
        address: addresses.tenderFactory,
        abi: tenderFactoryAbi,
        functionName: "createTender",
        args,
        ...(gasLimit && { gas: gasLimit }),
      });
    } catch (submissionError) {
      setPrepareError(formatSubmissionError(submissionError));
    } finally {
      setIsPreparing(false);
    }
  }

  useEffect(() => {
    if (!receipt.isSuccess) return;

    setShowSuccess(true);
    const timeout = window.setTimeout(() => router.push("/dashboard"), 3000);
    return () => window.clearTimeout(timeout);
  }, [receipt.isSuccess, router]);

  if (!isReady) {
    return (
      <div className="rounded-3xl border border-dashed border-yellow-400 bg-[color:var(--panel)] p-10 text-center">
        <Wallet className="mx-auto mb-4 h-8 w-8 text-[color:var(--accent-ink)]" />
        <p className="font-semibold text-slate-900">Connect your wallet to create a tender</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-900">Procurement title *</label>
          <input id="title" type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Procurement for 50 laptops" className={inputClassName} required />
          <p className="mt-2 text-xs text-slate-500">A clear title for your procurement round.</p>
        </div>

        <div className="mb-8">
          <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-900">Description *</label>
          <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the specifications and requirements..." rows={4} className={`${inputClassName} resize-none`} required />
          <p className="mt-2 text-xs text-slate-500">Include the details suppliers need to prepare a bid.</p>
        </div>

        <div className="mb-8">
          <label htmlFor="deadline" className="mb-2 block text-sm font-semibold text-slate-900">Bid deadline *</label>
          <input id="deadline" type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} className={inputClassName} required />
          <p className="mt-2 text-xs text-slate-500">Bidding closes at this date and time.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="bidBond" className="mb-2 block text-sm font-semibold text-slate-900">Bid bond (USD) *</label>
            <input id="bidBond" type="number" min="0" value={bidBond} onChange={(event) => setBidBond(event.target.value)} placeholder="e.g. 25" className={inputClassName} required />
            <p className="mt-2 text-xs text-slate-500">Deposit required from bidders.</p>
          </div>
          <div>
            <label htmlFor="maxBudget" className="mb-2 block text-sm font-semibold text-slate-900">Budget ceiling (USD) *</label>
            <input id="maxBudget" type="number" min="0" value={maxBudget} onChange={(event) => setMaxBudget(event.target.value)} placeholder="e.g. 600" className={inputClassName} required />
            <p className="mt-2 text-xs text-slate-500">Maximum amount you are willing to pay.</p>
          </div>
        </div>
      </div>

      <button type="submit" disabled={!formValid || isPreparing || isPending} className="w-full rounded-xl bg-[color:var(--accent)] px-6 py-4 font-semibold text-[color:var(--accent-ink)] shadow-sm transition hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50">
        {isPreparing ? "Preparing transaction..." : isPending ? "Confirm in wallet..." : "Create tender"}
      </button>

      {(prepareError || error) && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4">
          <p className="text-sm text-red-800">{prepareError ?? error?.message}</p>
        </div>
      )}

      {showSuccess && (
        <div className="rounded-3xl border border-yellow-300 bg-[color:var(--panel)] p-8 text-center shadow-lg sm:p-12">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-[color:var(--accent-ink)]" />
          <h2 className="mb-2 text-3xl font-bold text-slate-900">Tender created</h2>
          <p className="mb-8 text-slate-600">Redirecting to your dashboard...</p>
          <Link href="/dashboard" className="inline-block rounded-xl bg-[color:var(--accent)] px-6 py-3 font-bold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)]">
            Go to dashboard
          </Link>
        </div>
      )}

      <TransactionToast message={receipt.isSuccess ? "Tender created successfully." : undefined} />
    </form>
  );
}

function formatSubmissionError(error: unknown) {
  if (!(error instanceof Error)) return "The transaction could not be prepared. Please try again.";

  const message = error.message.toLowerCase();
  if (message.includes("user rejected") || message.includes("user denied")) {
    return "The transaction was cancelled in your wallet.";
  }
  if (message.includes("insufficient funds")) {
    return "Your wallet needs Sepolia ETH to pay the transaction gas fee.";
  }
  if (message.includes("too many errors") || message.includes("requested resource not available")) {
    return "The Sepolia RPC is temporarily unavailable. Please retry in a moment.";
  }

  return (error as Error & { shortMessage?: string }).shortMessage ?? error.message;
}
