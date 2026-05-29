"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortAddress } from "../lib/format";

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="min-h-11 min-w-24 border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-900">Connect</button>;
  }

  if (isConnected && address) {
    return (
      <button className="min-h-11 min-w-24 border border-[color:var(--accent)] bg-[color:var(--accent)] px-3 py-3 text-center text-sm font-medium text-black" onClick={() => disconnect()}>
        {shortAddress(address)}
      </button>
    );
  }

  return (
    <button className="min-h-11 min-w-24 border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-900 disabled:opacity-50" onClick={() => connect({ connector: connectors[0] })} disabled={isPending}>
      {isPending ? "Connecting..." : "Connect"}
    </button>
  );
}
