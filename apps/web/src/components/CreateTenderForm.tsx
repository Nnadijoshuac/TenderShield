"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { addresses } from "../config/addresses";
import { tenderFactoryAbi } from "../lib/contracts";
import { TransactionToast } from "./TransactionToast";

export function CreateTenderForm() {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [title, setTitle] = useState("Procurement for 50 laptops");
  const [description, setDescription] = useState("NGO procurement request for laptops for students. Vendors submit sealed quotes.");
  const [deadline, setDeadline] = useState(() => new Date(Date.now() + 3600_000).toISOString().slice(0, 16));
  const [bidBond, setBidBond] = useState("25");
  const [maxBudget, setMaxBudget] = useState("600");
  const [createdTenderAddress, setCreatedTenderAddress] = useState<`0x${string}`>();
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
    async function getTenderAddress() {
      if (!receipt.isSuccess || !publicClient || !address || !addresses.tenderFactory) return;

      const tenders = await publicClient.readContract({
        address: addresses.tenderFactory,
        abi: tenderFactoryAbi,
        functionName: "getTendersByIssuer",
        args: [address],
      }) as `0x${string}`[];

      if (tenders.length > 0) {
        setCreatedTenderAddress(tenders[tenders.length - 1]);
      }
    }

    getTenderAddress();
  }, [receipt.isSuccess, publicClient, address]);

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
      <TransactionToast message={receipt.isSuccess ? "Tender created! ✓" : error?.message} />
      {createdTenderAddress && (
        <TenderLinkDisplay address={createdTenderAddress} />
      )}
    </div>
  );
}

function TenderLinkDisplay({ address }: { address: `0x${string}` }) {
  const [copied, setCopied] = useState(false);
  const tenderUrl = typeof window !== "undefined" ? `${window.location.origin}/tender/${address}` : `/tender/${address}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(tenderUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-8 p-6 border-2 border-emerald-500 bg-emerald-50 rounded-lg">
      <h3 className="text-lg font-bold text-emerald-900 mb-3">✓ Tender Created!</h3>
      <p className="text-sm text-emerald-800 mb-4">Share this link with vendors to collect bids:</p>

      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          value={tenderUrl}
          readOnly
          className="flex-1 px-3 py-2 bg-white border border-emerald-300 rounded font-mono text-sm text-slate-900"
        />
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 transition"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/tender/${address}`}
          className="flex-1 text-center px-4 py-2 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 transition"
        >
          Open Tender
        </Link>
      </div>
    </div>
  );
}
