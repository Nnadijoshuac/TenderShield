"use client";

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

        if (tenderAddresses.length === 0) {
          setTenders([]);
          setLoading(false);
          return;
        }

        const tenderDetails = await Promise.all(
          tenderAddresses.map(async (tenderAddr) => {
            const [title, deadline, closed, revealRequested, finalized, bidCount] =
              await Promise.all([
                publicClient.readContract({
                  address: tenderAddr,
                  abi: reverseTenderAbi,
                  functionName: "title",
                }),
                publicClient.readContract({
                  address: tenderAddr,
                  abi: reverseTenderAbi,
                  functionName: "deadline",
                }),
                publicClient.readContract({
                  address: tenderAddr,
                  abi: reverseTenderAbi,
                  functionName: "closed",
                }),
                publicClient.readContract({
                  address: tenderAddr,
                  abi: reverseTenderAbi,
                  functionName: "revealRequested",
                }),
                publicClient.readContract({
                  address: tenderAddr,
                  abi: reverseTenderAbi,
                  functionName: "finalized",
                }),
                publicClient.readContract({
                  address: tenderAddr,
                  abi: reverseTenderAbi,
                  functionName: "getBidCount",
                }),
              ]);

            return {
              address: tenderAddr,
              title: title as string,
              deadline: deadline as bigint,
              closed: closed as boolean,
              revealRequested: revealRequested as boolean,
              finalized: finalized as boolean,
              bidCount: bidCount as bigint,
            };
          })
        );

        setTenders(tenderDetails.reverse());
      } catch (error) {
        console.error("Error loading tenders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTenders();
  }, [address, publicClient]);

  if (!address) {
    return (
      <div className="space-y-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Connect Wallet</h1>
          <p className="text-slate-600">Connect your wallet to view and manage your tenders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">My Tenders</h1>
          <p className="text-slate-600 mt-1">Manage and track all your procurement tenders</p>
        </div>
        <Link
          href="/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          + Create Tender
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading your tenders...</p>
        </div>
      ) : tenders.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded-lg p-12 text-center">
          <p className="text-slate-600 mb-4">No tenders yet</p>
          <Link
            href="/create"
            className="inline-flex px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
          >
            Create Your First Tender
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tenders.map((tender) => (
            <Link key={tender.address} href={`/tender/${tender.address}`}>
              <div className="border border-slate-200 bg-white rounded-lg p-6 hover:shadow-md transition cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{tender.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{shortAddress(tender.address)}</span>
                      <span>•</span>
                      <span>{Number(tender.bidCount)} bids</span>
                      <span>•</span>
                      <span>{formatDateTime(tender.deadline)}</span>
                    </div>
                  </div>
                  <TenderStatusBadge
                    closed={tender.closed}
                    revealRequested={tender.revealRequested}
                    finalized={tender.finalized}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
