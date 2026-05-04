"use client";

import { createConfig, http, injected } from "wagmi";
import { supportedChains } from "../config/chains";

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [injected()],
  transports: {
    31337: http("http://127.0.0.1:8545"),
    11155111: http("https://ethereum-sepolia-rpc.publicnode.com"),
  },
});
