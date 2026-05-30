export const addresses = {
  // Sepolia testnet deployment addresses
  tenderFactory: (process.env.NEXT_PUBLIC_TENDER_FACTORY_ADDRESS || "0x50CDc43A04B7D75b09fC105E058D36175Ec76565") as `0x${string}`,
  tenderToken: (process.env.NEXT_PUBLIC_TENDER_TOKEN_ADDRESS || "0x57F8851F29231Fe4309bFcB58d3FEfA5874aD943") as `0x${string}`,
  relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL || "https://testnet.zama.ai",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111),
  fhevmAclAddress: process.env.NEXT_PUBLIC_FHEVM_ACL_ADDRESS,
  fhevmKmsAddress: process.env.NEXT_PUBLIC_FHEVM_KMS_ADDRESS,
  fhevmInputVerifierAddress: process.env.NEXT_PUBLIC_FHEVM_INPUT_VERIFIER_ADDRESS,
  fhevmDecryptionAddress: process.env.NEXT_PUBLIC_FHEVM_DECRYPTION_ADDRESS,
  fhevmInputVerificationAddress: process.env.NEXT_PUBLIC_FHEVM_INPUT_VERIFICATION_ADDRESS,
  fhevmGatewayChainId: Number(process.env.NEXT_PUBLIC_FHEVM_GATEWAY_CHAIN_ID ?? 0),
};
