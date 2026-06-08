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
    return <button className="min-h-10 min-w-24 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900">Connect</button>;
  }

  if (isConnected && address) {
    return (
      <button className="min-h-10 min-w-24 rounded-xl border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-2 text-center text-sm font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)]" onClick={() => disconnect()}>
        {shortAddress(address)}
      </button>
    );
  }

  return (
    <button className="min-h-10 min-w-24 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] disabled:opacity-50" onClick={() => connect({ connector: connectors[0] })} disabled={isPending}>
      {isPending ? "Connecting..." : "Connect"}
    </button>
  );
}
