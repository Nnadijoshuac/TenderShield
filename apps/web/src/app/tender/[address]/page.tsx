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

export default async function EncryptionDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  const encryptionAddress = address as `0x${string}`;
  const encryption = await getTenderState(encryptionAddress);
  const isOpen = !encryption.closed;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <section className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-900 uppercase tracking-wider">Active Encryption</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">{encryption.title}</h1>
              <p className="text-slate-600 leading-relaxed">{encryption.descriptionURI}</p>
            </div>
            <TenderStatusBadge closed={encryption.closed} revealRequested={encryption.revealRequested} finalized={encryption.finalized} />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Issuer", value: shortAddress(encryption.issuer) },
              { label: "Deadline", value: formatDateTime(encryption.deadline) },
              { label: "Bids Received", value: encryption.bidCount.toString() },
              { label: "Status", value: encryption.finalized ? "Revealed" : "Encrypted" }
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-slate-100 p-4">
                <div className="text-xs text-slate-600 font-semibold">{item.label}</div>
                <div className="mt-2 font-semibold text-slate-900">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {encryption.bids.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Encrypted Bids</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {encryption.bids.map((bidder, index) => (
                <EncryptedBidCard key={`${bidder}-${index}`} bidder={bidder} index={index} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-6">
        <SubmitBidForm tenderAddress={encryptionAddress} isOpen={isOpen} />
        <IssuerActions tenderAddress={encryptionAddress} canClose={!encryption.closed} canReveal={encryption.closed && !encryption.revealRequested} canFinalize={encryption.revealRequested && !encryption.finalized} />
        {encryption.finalized && <ResultCard winner={encryption.winner} winningBid={encryption.winningBid} />}
      </section>
    </div>
  );
}
