import { SepoliaConfig, createInstance, initSDK, type PublicDecryptResults } from "@zama-fhe/relayer-sdk/web";
import { bytesToHex, type PublicClient } from "viem";
import { addresses } from "../config/addresses";

let fheInstancePromise: ReturnType<typeof createInstance> | null = null;
let sdkReadyPromise: Promise<boolean> | null = null;

function getCustomConfig(publicClient: PublicClient) {
  const missing = [
    ["NEXT_PUBLIC_FHEVM_ACL_ADDRESS", addresses.fhevmAclAddress],
    ["NEXT_PUBLIC_FHEVM_KMS_ADDRESS", addresses.fhevmKmsAddress],
    ["NEXT_PUBLIC_FHEVM_INPUT_VERIFIER_ADDRESS", addresses.fhevmInputVerifierAddress],
    ["NEXT_PUBLIC_FHEVM_DECRYPTION_ADDRESS", addresses.fhevmDecryptionAddress],
    ["NEXT_PUBLIC_FHEVM_INPUT_VERIFICATION_ADDRESS", addresses.fhevmInputVerificationAddress],
  ].filter(([, value]) => !value);

  if (missing.length > 0 || !addresses.fhevmGatewayChainId) {
    throw new Error("Missing local FHEVM config env vars for relayer SDK initialization.");
  }

  return {
    aclContractAddress: addresses.fhevmAclAddress!,
    kmsContractAddress: addresses.fhevmKmsAddress!,
    inputVerifierContractAddress: addresses.fhevmInputVerifierAddress!,
    verifyingContractAddressDecryption: addresses.fhevmDecryptionAddress!,
    verifyingContractAddressInputVerification: addresses.fhevmInputVerificationAddress!,
    gatewayChainId: addresses.fhevmGatewayChainId,
    relayerUrl: addresses.relayerUrl!,
    chainId: addresses.chainId,
    network: publicClient.transport.url ?? "http://127.0.0.1:8545",
  };
}

export async function initFhevm(publicClient: PublicClient) {
  if (!addresses.relayerUrl) {
    throw new Error("NEXT_PUBLIC_RELAYER_URL is required for encrypted bid submission.");
  }

  if (!sdkReadyPromise) {
    sdkReadyPromise = initSDK();
  }
  await sdkReadyPromise;

  if (!fheInstancePromise) {
    fheInstancePromise = createInstance(
      addresses.chainId === 11155111
        ? { ...SepoliaConfig, relayerUrl: addresses.relayerUrl, network: publicClient.transport.url ?? "https://ethereum-sepolia-rpc.publicnode.com" }
        : getCustomConfig(publicClient),
    );
  }

  return fheInstancePromise;
}

export async function encryptBid(
  publicClient: PublicClient,
  contractAddress: `0x${string}`,
  userAddress: `0x${string}`,
  bidAmount: bigint,
) {
  const fhevm = await initFhevm(publicClient);
  const input = fhevm.createEncryptedInput(contractAddress, userAddress);
  input.add64(Number(bidAmount));
  const encrypted = await input.encrypt();

  return {
    handle: bytesToHex(encrypted.handles[0]) as `0x${string}`,
    inputProof: bytesToHex(encrypted.inputProof) as `0x${string}`,
  };
}

export async function publicDecryptTenderResult(
  publicClient: PublicClient,
  handles: [`0x${string}`, `0x${string}`],
): Promise<PublicDecryptResults> {
  const fhevm = await initFhevm(publicClient);
  return fhevm.publicDecrypt(handles);
}
