import { fallback, http } from "viem";

const publicSepoliaRpcUrls = [
  "https://sepolia.drpc.org",
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://rpc.sepolia.org",
  "https://sepolia-rpc.lighthouse.io",
  "https://endpoints.omniatech.io/v1/eth/sepolia/public",
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
        retryCount: 3,
        retryDelay: 1000,
        timeout: 30_000,
      }),
    ),
    {
      rank: true,
      retryCount: 2,
    },
  );
}
