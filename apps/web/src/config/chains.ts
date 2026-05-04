import { defineChain } from "viem";
import { hardhat, sepolia } from "viem/chains";

export const localFhevm = defineChain({
  ...hardhat,
  id: 31337,
  name: "Local FHEVM",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
});

export const supportedChains = [localFhevm, sepolia] as const;
