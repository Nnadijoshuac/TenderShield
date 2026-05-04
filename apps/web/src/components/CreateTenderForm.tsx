"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { addresses } from "../config/addresses";
import { tenderFactoryAbi } from "../lib/contracts";
import { TransactionToast } from "./TransactionToast";

export function CreateTenderForm() {
  const { address } = useAccount();
  const [title, setTitle] = useState("Procurement for 50 laptops");
  const [description, setDescription] = useState("NGO procurement request for laptops for students. Vendors submit sealed quotes.");
  const [deadline, setDeadline] = useState(() => new Date(Date.now() + 3600_000).toISOString().slice(0, 16));
  const [bidBond, setBidBond] = useState("25");
  const [maxBudget, setMaxBudget] = useState("600");
  const [createdTender, setCreatedTender] = useState<string>();
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

  if (receipt.isSuccess && receipt.data.logs[0]) {
    const tenderAddress = receipt.data.logs[0].address;
    if (createdTender !== tenderAddress) {
      setCreatedTender(tenderAddress);
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <form action={onSubmit} className="grid gap-4">
        <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3" />
        <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-32 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3" />
        <input name="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="bidBond" value={bidBond} onChange={(e) => setBidBond(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3" />
          <input name="maxBudget" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3" />
        </div>
        <button disabled={!isReady || isPending} className="rounded-2xl bg-sky-400 px-4 py-3 font-medium text-slate-950 disabled:opacity-50">
          {isPending ? "Creating..." : "Create Tender"}
        </button>
      </form>
      <div className="mt-4 text-sm text-slate-400">{isReady ? "Issuer wallet connected." : "Connect a wallet and set NEXT_PUBLIC_TENDER_FACTORY_ADDRESS."}</div>
      <TransactionToast message={receipt.isSuccess ? "Tender transaction confirmed." : error?.message} />
      {createdTender ? (
        <div className="mt-4 text-sm text-slate-200">
          Tender created at{" "}
          <Link href={`/tender/${createdTender}`} className="text-sky-300 underline">
            {createdTender}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
