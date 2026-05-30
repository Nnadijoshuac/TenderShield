import Link from "next/link";
import { createPublicClient, http } from "viem";
import { hardhat, sepolia } from "viem/chains";
import { TenderStatusBadge } from "../../components/TenderStatusBadge";
import { addresses } from "../../config/addresses";
import { tenderFactoryAbi } from "../../lib/contracts";
import { formatDateTime, shortAddress } from "../../lib/format";

async function getUserTenders(userAddress: `0x${string}`) {
  const chain = addresses.chainId === 11155111 ? sepolia : hardhat;
  const transport = addresses.chainId === 11155111 ? http("https://ethereum-sepolia-rpc.publicnode.com") : http("http://127.0.0.1:8545");
  const publicClient = createPublicClient({ chain, transport });

  if (!addresses.tenderFactory) return [];

  const tenderAddresses = await publicClient.readContract({
    address: addresses.tenderFactory,
    abi: tenderFactoryAbi,
    functionName: "getTendersByIssuer",
    args: [userAddress],
  });

  if (!tenderAddresses.length) return [];

  return tenderAddresses as `0x${string}`[];
}

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-2 text-slate-900">My Dashboard</h1>
        <p className="text-slate-600">View and manage your tenders</p>
      </section>

      <div className="border border-slate-200 bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">My Created Tenders</h2>
        <div className="text-slate-600 mb-4">
          <p>Connect your wallet to see tenders you've created as an issuer.</p>
        </div>
        <Link href="/create" className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          Create New Tender
        </Link>
      </div>

      <div className="border border-slate-200 bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Tenders I've Bid On</h2>
        <div className="text-slate-600">
          <p>Visit tender pages directly to see your bids and participate in procurement rounds.</p>
        </div>
      </div>
    </div>
  );
}
