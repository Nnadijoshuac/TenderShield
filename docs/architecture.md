# TenderShield Architecture

- `apps/web` handles wallet connection, encrypted bid creation through the relayer SDK, and issuer actions.
- `packages/contracts/contracts/ReverseTender.sol` stores encrypted bid handles and computes the minimum with `FHE.lt` and `FHE.select`.
- `packages/contracts/contracts/TenderFactory.sol` creates and indexes tenders.
- `packages/contracts/contracts/TenderToken.sol` is a simple demo token placeholder; confidential ERC-7984 settlement is documented as stretch work.
- The public decryption flow uses `FHE.makePubliclyDecryptable` on the aggregate result handles and verifies KMS signatures onchain with `FHE.checkSignatures`.
