import { fallback, http } from "viem";

const publicSepoliaRpcUrls = [
  "https://sepolia.drpc.org",
  "https://ethereum-sepolia-rpc.publicnode.com",
] as const;

export function getSepoliaRpcUrls() {
  const configuredUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL?.trim();
  return configuredUrl
    ? [configuredUrl, ...publicSepoliaRpcUrls.filter((url) => url !== configuredUrl)]
    : [...publicSepoliaRpcUrls];
}

export function getSepoliaRpcUrl() {
  return getSepoliaRpcUrls()[0];
}

export function createSepoliaTransport() {
  return fallback(
    getSepoliaRpcUrls().map((url) =>
      http(url, {
        retryCount: 1,
        retryDelay: 500,
        timeout: 20_000,
      }),
    ),
    {
      rank: true,
      retryCount: 1,
    },
  );
}
