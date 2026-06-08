"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectWalletButton() {
  return (
    <ConnectButton
      accountStatus={{ smallScreen: "avatar", largeScreen: "address" }}
      chainStatus={{ smallScreen: "icon", largeScreen: "icon" }}
      showBalance={false}
    />
  );
}
