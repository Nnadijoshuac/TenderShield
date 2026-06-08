"use client";

import { ArrowRight, FilePlus2, LoaderCircle, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { TenderStatusBadge } from "../../components/TenderStatusBadge";
import { addresses } from "../../config/addresses";
import { reverseTenderAbi, tenderFactoryAbi } from "../../lib/contracts";
import { formatDateTime, shortAddress } from "../../lib/format";

interface TenderInfo {
  address: `0x${string}`;
  title: string;
  deadline: bigint;
  closed: boolean;
  revealRequested: boolean;
  finalized: boolean;
  bidCount: bigint;
}

export default function DashboardPage() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [tenders, setTenders] = useState<TenderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function loadTenders() {
      if (!address || !publicClient || !addresses.tenderFactory) {
        setLoading(false);
        return;
      }

      try {
        const tenderAddresses = (await publicClient.readContract({
          address: addresses.tenderFactory,
          abi: tenderFactoryAbi,
          functionName: "getTendersByIssuer",
          args: [address],
        })) as `0x${string}`[];

        const tenderDetails = await Promise.all(
          tenderAddresses.map(async (tenderAddress) => {
            const [title, deadline, closed, revealRequested, finalized, bidCount] = await Promise.all([
              publicClient.readContract({ address: tenderAddress, abi: reverseTenderAbi, functionName: "title" }),
              publicClient.readContract({ address: tenderAddress, abi: reverseTenderAbi, functionName: "deadline" }),
              publicClient.readContract({ address: tenderAddress, abi: reverseTenderAbi, functionName: "closed" }),
              publicClient.readContract({ address: tenderAddress, abi: reverseTenderAbi, functionName: "revealRequested" }),
              publicClient.readContract({ address: tenderAddress, abi: reverseTenderAbi, functionName: "finalized" }),
              publicClient.readContract({ address: tenderAddress, abi: reverseTenderAbi, functionName: "getBidCount" }),
            ]);

            return {
              address: tenderAddress,
              title: title as string,
              deadline: deadline as bigint,
              closed: closed as boolean,
              revealRequested: revealRequested as boolean,
              finalized: finalized as boolean,
              bidCount: bidCount as bigint,
            };
          }),
        );

        setTenders(tenderDetails.reverse());
      } catch (error) {
        console.error("Unable to load tenders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTenders();
  }, [address, publicClient]);

  if (!mounted) return <div className="py-20" />;

  if (!address) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)]">
          <Wallet className="h-6 w-6 text-[color:var(--accent-ink)]" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Connect your wallet</h1>
        <p className="text-slate-600">Connect a wallet to view and manage your tenders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">My tenders</h1>
          <p className="mt-1 text-slate-600">Manage and track your private procurement rounds.</p>
        </div>
        <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--accent)] px-6 py-3 font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)]">
          <FilePlus2 className="h-4 w-4" />
          Create tender
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white py-16">
          <LoaderCircle className="h-5 w-5 animate-spin text-[color:var(--accent-ink)]" />
          <p className="text-slate-600">Loading your tenders...</p>
        </div>
      ) : tenders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-yellow-400 bg-[color:var(--panel)] p-12 text-center">
          <FilePlus2 className="mx-auto mb-4 h-8 w-8 text-[color:var(--accent-ink)]" />
          <h2 className="mb-2 text-xl font-bold text-slate-900">No tenders yet</h2>
          <p className="mb-5 text-slate-600">Create your first private procurement round.</p>
          <Link href="/create" className="inline-flex rounded-xl bg-[color:var(--accent)] px-5 py-3 font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)]">
            Create your first tender
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tenders.map((tender) => (
            <Link key={tender.address} href={`/tender/${tender.address}`}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-yellow-300 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-2 truncate text-lg font-bold text-slate-900">{tender.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                      <span>{shortAddress(tender.address)}</span>
                      <span aria-hidden="true">/</span>
                      <span>{Number(tender.bidCount)} bids</span>
                      <span aria-hidden="true">/</span>
                      <span>{formatDateTime(tender.deadline)}</span>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <TenderStatusBadge closed={tender.closed} revealRequested={tender.revealRequested} finalized={tender.finalized} />
                    <ArrowRight className="hidden h-4 w-4 text-slate-400 sm:block" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
