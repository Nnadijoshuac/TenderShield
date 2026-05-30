"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { addresses } from "../config/addresses";
import { tenderFactoryAbi } from "../lib/contracts";
import { TransactionToast } from "./TransactionToast";

export function CreateTenderForm() {
  const router = useRouter();
  const { address } = useAccount();
  const [title, setTitle] = useState("Procurement for 50 laptops");
  const [description, setDescription] = useState("NGO procurement request for laptops for students. Vendors submit sealed quotes.");
  const [deadline, setDeadline] = useState(() => new Date(Date.now() + 3600_000).toISOString().slice(0, 16));
  const [bidBond, setBidBond] = useState("25");
  const [maxBudget, setMaxBudget] = useState("600");
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const isReady = useMemo(() => !!addresses.tenderFactory && !!address, [address]);

  function onSubmit(formData: FormData) {
    if (!addresses.tenderFactory) return;

    writeContract({
      address: addresses.tenderFactory,
      abi: tenderFactoryAbi,
      functionName: "createTender",
      args: [
        String(formData.get("title")),
        String(formData.get("description")),
        BigInt(Math.floor(new Date(String(formData.get("deadline"))).getTime() / 1000)),
        BigInt(Number(formData.get("bidBond"))),
        BigInt(Number(formData.get("maxBudget"))),
        (addresses.tenderToken ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
      ],
    });
  }

  useEffect(() => {
    if (receipt.isSuccess) {
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  }, [receipt.isSuccess, router]);

  return (
    <div className="border border-slate-200 bg-white p-6">
      <form action={onSubmit} className="grid gap-4">
        <input name="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none" />
        <textarea name="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-32 border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none" />
        <input name="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="bidBond" placeholder="Bond" value={bidBond} onChange={(e) => setBidBond(e.target.value)} className="border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none" />
          <input name="maxBudget" placeholder="Budget" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none" />
        </div>
        <button disabled={!isReady || isPending} className="border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-3 font-medium text-black disabled:opacity-50">
          {isPending ? "Creating..." : "Create Tender"}
        </button>
      </form>
      <div className="mt-4 text-sm text-[color:var(--muted)]">{isReady ? "Issuer connected." : "Connect wallet and set factory address."}</div>
      <TransactionToast message={receipt.isSuccess ? "Tender created! Redirecting..." : error?.message} />
    </div>
  );
}
