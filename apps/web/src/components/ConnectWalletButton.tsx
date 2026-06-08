"use client";

import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { addresses } from "../config/addresses";
import { shortAddress } from "../lib/format";

const targetChainName = addresses.chainId === 11155111 ? "Sepolia" : "Local FHEVM";

export function ConnectWalletButton() {
  const { address, connector: activeConnector, isConnected } = useAccount();
  const chainId = useChainId();
  const {
    connectAsync,
    connectors,
    error: connectError,
    isPending: isConnecting,
    reset: resetConnect,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    error: switchError,
    isPending: isSwitching,
    reset: resetSwitch,
    switchChainAsync,
  } = useSwitchChain();
  const [mounted, setMounted] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pendingConnectorUid, setPendingConnectorUid] = useState<string>();

  const walletOptions = useMemo(() => {
    const seen = new Set<string>();
    return connectors.filter((connector) => {
      const key = `${connector.id}:${connector.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [connectors]);

  const wrongNetwork = isConnected && chainId !== addresses.chainId;
  const explorerUrl =
    addresses.chainId === 11155111 && address
      ? `https://sepolia.etherscan.io/address/${address}`
      : undefined;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!connectOpen && !accountOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setConnectOpen(false);
      setAccountOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [accountOpen, connectOpen]);

  async function connectWallet(connector: (typeof connectors)[number]) {
    resetConnect();
    setPendingConnectorUid(connector.uid);
    try {
      await connectAsync({ connector, chainId: addresses.chainId });
      setConnectOpen(false);
    } catch {
      // Wagmi exposes the user-facing error in connectError.
    } finally {
      setPendingConnectorUid(undefined);
    }
  }

  async function switchNetwork() {
    resetSwitch();
    try {
      await switchChainAsync({ chainId: addresses.chainId });
    } catch {
      // Wagmi exposes the user-facing error in switchError.
    }
  }

  async function copyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function disconnectWallet() {
    disconnect();
    setAccountOpen(false);
  }

  if (!mounted) {
    return (
      <button className="min-h-10 min-w-28 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
        Connect wallet
      </button>
    );
  }

  return (
    <>
      {isConnected && address ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setAccountOpen((open) => !open)}
            aria-expanded={accountOpen}
            aria-haspopup="menu"
            className={`flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              wrongNetwork
                ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                : "border-yellow-300 bg-[color:var(--accent)] text-[color:var(--accent-ink)] hover:bg-[color:var(--accent-hover)]"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${wrongNetwork ? "bg-amber-500" : "bg-emerald-500"}`} />
            <span>{wrongNetwork ? "Wrong network" : shortAddress(address)}</span>
            <ChevronDown className={`h-4 w-4 transition ${accountOpen ? "rotate-180" : ""}`} />
          </button>

          {accountOpen && (
            <>
              <button
                type="button"
                aria-label="Close account menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setAccountOpen(false)}
              />
              <div role="menu" className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {activeConnector?.name ?? "Connected wallet"}
                      </p>
                      <p className="truncate text-xs text-slate-500">{address}</p>
                    </div>
                  </div>
                </div>

                {wrongNetwork && (
                  <div className="m-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm font-semibold text-amber-950">Switch to {targetChainName}</p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-800">
                      TenderShield transactions require the configured network.
                    </p>
                    <button
                      type="button"
                      onClick={switchNetwork}
                      disabled={isSwitching}
                      className="mt-3 w-full rounded-lg bg-[color:var(--accent)] px-3 py-2 text-sm font-semibold text-[color:var(--accent-ink)] transition hover:bg-[color:var(--accent-hover)] disabled:opacity-50"
                    >
                      {isSwitching ? "Switching..." : `Switch to ${targetChainName}`}
                    </button>
                    {switchError && <p className="mt-2 text-xs text-red-700">{friendlyWalletError(switchError)}</p>}
                  </div>
                )}

                <div className="mt-1 space-y-1">
                  <button type="button" role="menuitem" onClick={copyAddress} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Address copied" : "Copy address"}
                  </button>
                  {explorerUrl && (
                    <a href={explorerUrl} target="_blank" rel="noreferrer" role="menuitem" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <ExternalLink className="h-4 w-4" />
                      View on Etherscan
                    </a>
                  )}
                  <button type="button" role="menuitem" onClick={disconnectWallet} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-700 transition hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    Disconnect
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            resetConnect();
            setConnectOpen(true);
          }}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-yellow-300 hover:bg-[color:var(--accent-soft)]"
        >
          <Wallet className="h-4 w-4" />
          Connect wallet
        </button>
      )}

      {connectOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Close wallet dialog"
              className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
              onClick={() => setConnectOpen(false)}
            />
            <div role="dialog" aria-modal="true" aria-labelledby="wallet-dialog-title" className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="wallet-dialog-title" className="text-2xl font-bold text-slate-950">Connect a wallet</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Choose an installed browser wallet to use TenderShield on {targetChainName}.
                  </p>
                </div>
                <button type="button" onClick={() => setConnectOpen(false)} aria-label="Close" className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {walletOptions.map((connector) => {
                  const pending = isConnecting && pendingConnectorUid === connector.uid;
                  return (
                    <button
                      key={connector.uid}
                      type="button"
                      onClick={() => connectWallet(connector)}
                      disabled={isConnecting}
                      className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-yellow-300 hover:bg-[color:var(--panel)] disabled:cursor-wait disabled:opacity-60"
                    >
                      <WalletIcon name={connector.name} icon={connector.icon} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-slate-900">{connector.name}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {pending ? "Waiting for wallet confirmation..." : "Browser wallet"}
                        </span>
                      </span>
                      <span className="text-sm font-semibold text-[color:var(--accent-ink)]">
                        {pending ? "Connecting" : "Connect"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {walletOptions.length === 0 && (
                <div className="mt-6 rounded-2xl border border-dashed border-yellow-400 bg-[color:var(--panel)] p-5 text-center">
                  <Wallet className="mx-auto h-6 w-6 text-[color:var(--accent-ink)]" />
                  <p className="mt-3 font-semibold text-slate-900">No browser wallet detected</p>
                  <p className="mt-1 text-sm text-slate-600">Install a compatible Ethereum wallet, then refresh this page.</p>
                </div>
              )}

              {connectError && (
                <div role="alert" className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>{friendlyWalletError(connectError)}</p>
                </div>
              )}

              <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
                TenderShield never has access to your private keys.
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function WalletIcon({ name, icon }: { name: string; icon?: string }) {
  if (icon) {
    return <img src={icon} alt="" className="h-11 w-11 rounded-xl" />;
  }

  return (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] font-bold text-[color:var(--accent-ink)]">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

function friendlyWalletError(error: Error) {
  const message = error.message.toLowerCase();
  if (message.includes("user rejected") || message.includes("user denied")) {
    return "The request was cancelled in your wallet.";
  }
  if (message.includes("already pending") || message.includes("request already pending")) {
    return "A wallet request is already open. Check your wallet extension.";
  }
  if (message.includes("connector not connected") || message.includes("provider not found")) {
    return "The selected wallet is unavailable. Unlock it or refresh the page.";
  }
  return (error as Error & { shortMessage?: string }).shortMessage ?? "The wallet could not connect. Please try again.";
}
