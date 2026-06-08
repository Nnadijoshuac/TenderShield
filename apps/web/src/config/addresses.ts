const configuredChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111");
const defaultChainId = configuredChainId === 31337 || configuredChainId === 11155111 ? configuredChainId : 11155111;

export const addresses = {
  tenderFactory: process.env.NEXT_PUBLIC_TENDER_FACTORY_ADDRESS as `0x${string}`,
  tenderToken: process.env.NEXT_PUBLIC_TENDER_TOKEN_ADDRESS as `0x${string}`,
  relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL,
  chainId: defaultChainId as 31337 | 11155111,
  fhevmAclAddress: process.env.NEXT_PUBLIC_FHEVM_ACL_ADDRESS,
  fhevmKmsAddress: process.env.NEXT_PUBLIC_FHEVM_KMS_ADDRESS,
  fhevmInputVerifierAddress: process.env.NEXT_PUBLIC_FHEVM_INPUT_VERIFIER_ADDRESS,
  fhevmDecryptionAddress: process.env.NEXT_PUBLIC_FHEVM_DECRYPTION_ADDRESS,
  fhevmInputVerificationAddress: process.env.NEXT_PUBLIC_FHEVM_INPUT_VERIFICATION_ADDRESS,
  fhevmGatewayChainId: Number(process.env.NEXT_PUBLIC_FHEVM_GATEWAY_CHAIN_ID ?? 0),
};
