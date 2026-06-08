import { fallback, http } from "viem";

const publicSepoliaRpcUrls = [
  "https://rpc.sepolia.org",
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://1rpc.io/sepolia",
  "https://sepolia-rpc.lighthouse.io",
  "https://sepolia.drpc.org",
  "https://eth-sepolia.g.alchemy.com/v2/demo",
  "https://eth-sepolia.public.blastapi.io",
  "https://endpoints.omnirpc.io/v1/sepolia",
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
        retryCount: 5,
        retryDelay: 500,
        timeout: 45_000,
      }),
    ),
    {
      rank: true,
      retryCount: 3,
    },
  );
}
