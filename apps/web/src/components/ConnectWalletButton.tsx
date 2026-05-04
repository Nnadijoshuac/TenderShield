"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortAddress } from "../lib/format";

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100" onClick={() => disconnect()}>
        {shortAddress(address)}
      </button>
    );
  }

  return (
    <button className="rounded-full bg-sky-400 px-4 py-2 text-sm font-medium text-slate-950" onClick={() => connect({ connector: connectors[0] })} disabled={isPending}>
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
