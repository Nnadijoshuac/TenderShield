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
    return <button className="neo-pill rounded-full px-4 py-2 text-sm font-medium text-[color:var(--copy)]">Connect</button>;
  }

  if (isConnected && address) {
    return (
      <button className="neo-inset rounded-full px-4 py-2 text-sm text-[color:var(--accent)]" onClick={() => disconnect()}>
        {shortAddress(address)}
      </button>
    );
  }

  return (
    <button className="neo-pill rounded-full px-4 py-2 text-sm font-medium text-[color:var(--copy)]" onClick={() => connect({ connector: connectors[0] })} disabled={isPending}>
      {isPending ? "Connecting..." : "Connect"}
    </button>
  );
}
