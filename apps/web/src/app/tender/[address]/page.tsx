import { createPublicClient, http } from "viem";
import { hardhat, sepolia } from "viem/chains";
import { EncryptedBidCard } from "../../../components/EncryptedBidCard";
import { IssuerActions } from "../../../components/IssuerActions";
import { ResultCard } from "../../../components/ResultCard";
import { SubmitBidForm } from "../../../components/SubmitBidForm";
import { TenderStatusBadge } from "../../../components/TenderStatusBadge";
import { addresses } from "../../../config/addresses";
import { reverseTenderAbi } from "../../../lib/contracts";
import { formatDateTime, shortAddress } from "../../../lib/format";

async function getTenderState(address: `0x${string}`) {
  const chain = addresses.chainId === 11155111 ? sepolia : hardhat;
  const transport = addresses.chainId === 11155111 ? http("https://ethereum-sepolia-rpc.publicnode.com") : http("http://127.0.0.1:8545");
  const publicClient = createPublicClient({ chain, transport });

  const [issuer, title, descriptionURI, deadline, closed, revealRequested, finalized, bidCount, winner, winningBid] =
    await Promise.all([
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "issuer" }),
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "title" }),
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "descriptionURI" }),
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "deadline" }),
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "closed" }),
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "revealRequested" }),
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "finalized" }),
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "getBidCount" }),
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "winner" }),
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "winningBid" }),
    ]);

  const bids = await Promise.all(
    Array.from({ length: Number(bidCount) }, (_, index) =>
      publicClient.readContract({ address, abi: reverseTenderAbi, functionName: "getBidderAt", args: [BigInt(index)] }),
    ),
  );

  return { issuer, title, descriptionURI, deadline, closed, revealRequested, finalized, bidCount, winner, winningBid, bids };
}

export default async function TenderDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  const tenderAddress = address as `0x${string}`;
  const tender = await getTenderState(tenderAddress);
  const isOpen = !tender.closed;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-sky-300">Tender details</div>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold">{tender.title}</h1>
              <p className="mt-4 max-w-2xl text-slate-300">{tender.descriptionURI}</p>
            </div>
            <TenderStatusBadge closed={tender.closed} revealRequested={tender.revealRequested} finalized={tender.finalized} />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
              <div className="text-sm text-slate-400">Issuer</div>
              <div className="mt-2 font-medium">{shortAddress(tender.issuer)}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
              <div className="text-sm text-slate-400">Deadline</div>
              <div className="mt-2 font-medium">{formatDateTime(tender.deadline)}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
              <div className="text-sm text-slate-400">Bid count</div>
              <div className="mt-2 font-medium">{tender.bidCount.toString()}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
              <div className="text-sm text-slate-400">Winning reveal</div>
              <div className="mt-2 font-medium">{tender.finalized ? "Ready" : "Pending"}</div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {tender.bids.map((bidder, index) => (
            <EncryptedBidCard key={`${bidder}-${index}`} bidder={bidder} index={index} />
          ))}
        </div>
      </section>
      <section className="space-y-6">
        <SubmitBidForm tenderAddress={tenderAddress} isOpen={isOpen} />
        <IssuerActions tenderAddress={tenderAddress} canClose={!tender.closed} canReveal={tender.closed && !tender.revealRequested} canFinalize={tender.revealRequested && !tender.finalized} />
        {tender.finalized ? <ResultCard winner={tender.winner} winningBid={tender.winningBid} /> : null}
      </section>
    </div>
  );
}
