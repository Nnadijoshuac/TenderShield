"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { supportedChains } from "../config/chains";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "walletconnect-project-id-required";

export const wagmiConfig = getDefaultConfig({
  appName: "TenderShield",
  projectId: walletConnectProjectId,
  ssr: true,
  chains: supportedChains,
  transports: {
    31337: http("http://127.0.0.1:8545"),
    11155111: http("https://ethereum-sepolia-rpc.publicnode.com"),
  },
});
