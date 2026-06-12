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
import { createSepoliaTransport } from "../../../lib/rpc";

async function getTenderState(address: `0x${string}`) {
  const chain = addresses.chainId === 11155111 ? sepolia : hardhat;
  const transport = addresses.chainId === 11155111 ? createSepoliaTransport() : http("http://127.0.0.1:8545");
  const publicClient = createPublicClient({ chain, transport });

  const summary = await publicClient.multicall({
    contracts: [
      { address, abi: reverseTenderAbi, functionName: "issuer" },
      { address, abi: reverseTenderAbi, functionName: "title" },
      { address, abi: reverseTenderAbi, functionName: "descriptionURI" },
      { address, abi: reverseTenderAbi, functionName: "deadline" },
      { address, abi: reverseTenderAbi, functionName: "bidBond" },
      { address, abi: reverseTenderAbi, functionName: "maxBudget" },
      { address, abi: reverseTenderAbi, functionName: "closed" },
      { address, abi: reverseTenderAbi, functionName: "revealRequested" },
      { address, abi: reverseTenderAbi, functionName: "finalized" },
      { address, abi: reverseTenderAbi, functionName: "getBidCount" },
      { address, abi: reverseTenderAbi, functionName: "winner" },
      { address, abi: reverseTenderAbi, functionName: "winningBid" },
    ],
    allowFailure: false,
  });

  const [issuer, title, descriptionURI, deadline, bidBond, maxBudget, closed, revealRequested, finalized, bidCount, winner, winningBid] = summary;

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

  return { issuer, title, descriptionURI, deadline, bidBond, maxBudget, closed, revealRequested, finalized, bidCount, winner, winningBid, bids };
}

export default async function EncryptionDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  const encryptionAddress = address as `0x${string}`;
  const encryption = await getTenderState(encryptionAddress);
  const isOpen = !encryption.closed;

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[1.1fr,0.9fr]">
      <section>
        <div className="flex items-start justify-between gap-6 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full border border-yellow-300 bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--accent-ink)]">Private tender</span>
              <TenderStatusBadge closed={encryption.closed} revealRequested={encryption.revealRequested} finalized={encryption.finalized} />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">{encryption.title}</h1>
            <p className="text-lg text-slate-600 leading-relaxed">{encryption.descriptionURI}</p>
          </div>
        </div>

        <div className="grid gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Issuer", value: shortAddress(encryption.issuer) },
            { label: "Deadline", value: formatDateTime(encryption.deadline) },
            { label: "Bid Bond Required", value: encryption.bidBond.toString() },
            { label: "Budget Ceiling", value: encryption.maxBudget.toString() },
            { label: "Bids Received", value: encryption.bidCount.toString() },
            { label: "Status", value: encryption.finalized ? "Revealed" : "Encrypted" }
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{item.label}</div>
              <div className="text-lg font-semibold text-slate-900">{item.value}</div>
            </div>
          ))}
        </div>

        {encryption.bids.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Encrypted Bids</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {encryption.bids.map((bidder, index) => (
                <EncryptedBidCard key={`${bidder}-${index}`} bidder={bidder} index={index} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-6 lg:sticky lg:top-28">
        <SubmitBidForm tenderAddress={encryptionAddress} isOpen={isOpen} />
        <IssuerActions tenderAddress={encryptionAddress} canClose={!encryption.closed} canReveal={encryption.closed && !encryption.revealRequested} canFinalize={encryption.revealRequested && !encryption.finalized} />
        {encryption.finalized && <ResultCard winner={encryption.winner} winningBid={encryption.winningBid} />}
      </section>
    </div>
  );
}
