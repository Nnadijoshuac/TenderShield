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

  const summary = await publicClient.multicall({
    contracts: [
      { address, abi: reverseTenderAbi, functionName: "issuer" },
      { address, abi: reverseTenderAbi, functionName: "title" },
      { address, abi: reverseTenderAbi, functionName: "descriptionURI" },
      { address, abi: reverseTenderAbi, functionName: "deadline" },
      { address, abi: reverseTenderAbi, functionName: "closed" },
      { address, abi: reverseTenderAbi, functionName: "revealRequested" },
      { address, abi: reverseTenderAbi, functionName: "finalized" },
      { address, abi: reverseTenderAbi, functionName: "getBidCount" },
      { address, abi: reverseTenderAbi, functionName: "winner" },
      { address, abi: reverseTenderAbi, functionName: "winningBid" },
    ],
    allowFailure: false,
  });

  const [issuer, title, descriptionURI, deadline, closed, revealRequested, finalized, bidCount, winner, winningBid] = summary;

  const bids =
    Number(bidCount) === 0
      ? []
      : await publicClient.multicall({
          contracts: Array.from({ length: Number(bidCount) }, (_, index) => ({
            address,
            abi: reverseTenderAbi,
            functionName: "getBidderAt" as const,
            args: [BigInt(index)],
          })),
          allowFailure: false,
        });

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
        <div className="neo-surface rounded-[2.5rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent)]">Tender</div>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-[color:var(--copy)]">{tender.title}</h1>
              <p className="mt-4 max-w-2xl text-[color:var(--muted)]">{tender.descriptionURI}</p>
            </div>
            <TenderStatusBadge closed={tender.closed} revealRequested={tender.revealRequested} finalized={tender.finalized} />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="neo-surface-soft rounded-[1.75rem] p-4">
              <div className="text-sm text-[color:var(--muted)]">Issuer</div>
              <div className="mt-2 font-medium text-[color:var(--copy)]">{shortAddress(tender.issuer)}</div>
            </div>
            <div className="neo-surface-soft rounded-[1.75rem] p-4">
              <div className="text-sm text-[color:var(--muted)]">Deadline</div>
              <div className="mt-2 font-medium text-[color:var(--copy)]">{formatDateTime(tender.deadline)}</div>
            </div>
            <div className="neo-surface-soft rounded-[1.75rem] p-4">
              <div className="text-sm text-[color:var(--muted)]">Bids</div>
              <div className="mt-2 font-medium text-[color:var(--copy)]">{tender.bidCount.toString()}</div>
            </div>
            <div className="neo-surface-soft rounded-[1.75rem] p-4">
              <div className="text-sm text-[color:var(--muted)]">Result</div>
              <div className="mt-2 font-medium text-[color:var(--copy)]">{tender.finalized ? "Revealed" : "Hidden"}</div>
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
