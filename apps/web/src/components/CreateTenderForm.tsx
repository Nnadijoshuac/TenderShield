"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { addresses } from "../config/addresses";
import { tenderFactoryAbi } from "../lib/contracts";
import { TransactionToast } from "./TransactionToast";

export function CreateTenderForm() {
  const router = useRouter();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [bidBond, setBidBond] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [createdTenderAddress, setCreatedTenderAddress] = useState<`0x${string}`>();
  const [showSuccess, setShowSuccess] = useState(false);
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const isReady = useMemo(() => !!addresses.tenderFactory && !!address, [address]);
  const formValid = title && description && deadline && bidBond && maxBudget;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!addresses.tenderFactory || !formValid) return;

    writeContract({
      address: addresses.tenderFactory,
      abi: tenderFactoryAbi,
      functionName: "createTender",
      args: [
        title,
        description,
        BigInt(Math.floor(new Date(deadline).getTime() / 1000)),
        BigInt(Number(bidBond)),
        BigInt(Number(maxBudget)),
        (addresses.tenderToken ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
      ],
    });
  }

  useEffect(() => {
    if (receipt.isSuccess) {
      setShowSuccess(true);
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }
  }, [receipt.isSuccess, router]);

  if (!isReady) {
    return (
      <div className="rounded-lg border border-slate-300 bg-slate-50 p-8 text-center">
        <p className="text-slate-600">Connect your wallet to create a tender</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-8">
        {/* Title */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Procurement Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Procurement for 50 laptops"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD208] focus:border-transparent"
          />
          <p className="text-xs text-slate-500 mt-1">A clear title for your procurement round</p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you're procuring, specifications, and requirements..."
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD208] focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-500 mt-1">Details suppliers need to understand your needs</p>
        </div>

        {/* Deadline */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Bid Deadline *
          </label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFD208] focus:border-transparent"
          />
          <p className="text-xs text-slate-500 mt-1">When bidding closes and evaluation starts</p>
        </div>

        {/* Bond & Budget */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Bid Bond (USD) *
            </label>
            <input
              type="number"
              value={bidBond}
              onChange={(e) => setBidBond(e.target.value)}
              placeholder="e.g., 25"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD208] focus:border-transparent"
            />
            <p className="text-xs text-slate-500 mt-1">Deposit required from bidders</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Budget Ceiling (USD) *
            </label>
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="e.g., 600"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFD208] focus:border-transparent"
            />
            <p className="text-xs text-slate-500 mt-1">Maximum you're willing to pay</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!formValid || isPending}
        className="w-full px-6 py-4 bg-[#FFD208] text-white font-semibold rounded-lg hover:bg-[#E6BB00] disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isPending ? "Creating Tender..." : "Create Tender"}
      </button>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error.message}</p>
        </div>
      )}

      {/* Success Display */}
      {showSuccess && (
        <div className="mt-12 rounded-2xl border-4 border-[#FFD208] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-12 shadow-xl text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-4xl font-bold text-amber-900 mb-2">Tender Created!</h2>
          <p className="text-lg text-amber-800 mb-8">Redirecting to your dashboard...</p>
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-[#FFD208] text-white rounded-lg font-bold hover:bg-[#E6BB00]">
            Go to Dashboard
          </Link>
        </div>
      )}

      <TransactionToast message={receipt.isSuccess ? "Tender created! ✓" : error?.message} />
    </form>
  );
}