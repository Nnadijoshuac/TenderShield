import { NextResponse } from "next/server";
import { createPublicClient, isAddress } from "viem";
import { sepolia } from "viem/chains";
import { addresses } from "../../../../config/addresses";
import { tenderFactoryAbi } from "../../../../lib/contracts";
import { createSepoliaTransport } from "../../../../lib/rpc";

type EstimateRequest = {
  account?: string;
  title?: string;
  description?: string;
  deadline?: string;
  bidBond?: string;
  maxBudget?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EstimateRequest;
    if (!body.account || !isAddress(body.account)) {
      return NextResponse.json({ error: "A valid connected wallet is required." }, { status: 400 });
    }
    if (!body.title || !body.description || !body.deadline || !body.bidBond || !body.maxBudget) {
      return NextResponse.json({ error: "Complete every tender field before submitting." }, { status: 400 });
    }
    if (!addresses.tenderFactory || !addresses.tenderToken) {
      return NextResponse.json({ error: "Tender contracts are not configured." }, { status: 500 });
    }

    const deadline = BigInt(body.deadline);
    const bidBond = BigInt(body.bidBond);
    const maxBudget = BigInt(body.maxBudget);
    if (deadline <= BigInt(Math.floor(Date.now() / 1000))) {
      return NextResponse.json({ error: "The bid deadline must be in the future." }, { status: 400 });
    }
    if (bidBond < 0n || maxBudget < 0n) {
      return NextResponse.json({ error: "Bond and budget values cannot be negative." }, { status: 400 });
    }

    const client = createPublicClient({
      chain: sepolia,
      transport: createSepoliaTransport(),
    });
    const estimatedGas = await client.estimateContractGas({
      account: body.account,
      address: addresses.tenderFactory,
      abi: tenderFactoryAbi,
      functionName: "createTender",
      args: [
        body.title,
        body.description,
        deadline,
        bidBond,
        maxBudget,
        addresses.tenderToken,
      ],
    });

    return NextResponse.json({ gas: ((estimatedGas * 105n) / 100n).toString() });
  } catch (error) {
    console.error("Tender gas estimation failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Unable to estimate gas. The Sepolia RPC is temporarily unavailable. Please retry in a moment." },
      { status: 503 },
    );
  }
}
