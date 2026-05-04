import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("ReverseTender", function () {
  let issuer: HardhatEthersSigner;
  let vendorA: HardhatEthersSigner;
  let vendorB: HardhatEthersSigner;
  let vendorC: HardhatEthersSigner;

  before(async function () {
    [issuer, vendorA, vendorB, vendorC] = await ethers.getSigners();
  });

  async function deployTender() {
    const latest = await ethers.provider.getBlock("latest");
    const tender = await (
      await ethers.getContractFactory("ReverseTender")
    ).deploy(issuer.address, "Procurement for 50 laptops", "ipfs://demo", latest!.timestamp + 3600, 25, 600, ethers.ZeroAddress);
    await tender.waitForDeployment();
    return tender;
  }

  async function submitEncryptedBid(tender: any, bidder: HardhatEthersSigner, value: number) {
    const encrypted = await fhevm.createEncryptedInput(await tender.getAddress(), bidder.address).add64(value).encrypt();
    await expect(tender.connect(bidder).submitBid(encrypted.handles[0], encrypted.inputProof)).not.to.be.reverted;
  }

  beforeEach(function () {
    if (!fhevm.isMock) {
      this.skip();
    }
  });

  it("blocks duplicate and late bids, computes the encrypted minimum, and finalizes winner state", async function () {
    const tender = await deployTender();

    await submitEncryptedBid(tender, vendorA, 500);
    await submitEncryptedBid(tender, vendorB, 350);
    await submitEncryptedBid(tender, vendorC, 420);

    const duplicate = await fhevm.createEncryptedInput(await tender.getAddress(), vendorA.address).add64(490).encrypt();
    await expect(tender.connect(vendorA).submitBid(duplicate.handles[0], duplicate.inputProof)).to.be.reverted;

    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine", []);

    await expect(
      tender.connect(vendorA).submitBid(duplicate.handles[0], duplicate.inputProof),
    ).to.be.reverted;
    await expect(tender.connect(vendorA).closeTender()).to.be.reverted;

    await tender.connect(issuer).closeTender();

    const [lowestHandle, winnerIndexHandle] = await tender.getEncryptedResultHandles();
    const lowest = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      lowestHandle,
      await tender.getAddress(),
      issuer,
    );
    const winnerIndex = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      winnerIndexHandle,
      await tender.getAddress(),
      issuer,
    );

    expect(Number(lowest)).to.eq(350);
    expect(Number(winnerIndex)).to.eq(1);

    await tender.connect(issuer).requestReveal();
    const publicDecryptResult = await fhevm.publicDecrypt([lowestHandle, winnerIndexHandle]);
    await tender
      .connect(issuer)
      .finalizeTender(
        Number(publicDecryptResult.clearValues[lowestHandle]),
        Number(publicDecryptResult.clearValues[winnerIndexHandle]),
        publicDecryptResult.decryptionProof,
      );

    expect(await tender.winner()).to.eq(vendorB.address);
    expect(await tender.winningBid()).to.eq(350);
  });

  it("supports refund and award claims after finalization", async function () {
    const tender = await deployTender();

    await submitEncryptedBid(tender, vendorA, 500);
    await submitEncryptedBid(tender, vendorB, 350);

    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine", []);

    await tender.connect(issuer).closeTender();
    await tender.connect(issuer).requestReveal();
    const [lowestHandle, winnerIndexHandle] = await tender.getEncryptedResultHandles();
    const publicDecryptResult = await fhevm.publicDecrypt([lowestHandle, winnerIndexHandle]);
    await tender
      .connect(issuer)
      .finalizeTender(
        Number(publicDecryptResult.clearValues[lowestHandle]),
        Number(publicDecryptResult.clearValues[winnerIndexHandle]),
        publicDecryptResult.decryptionProof,
      );

    await tender.connect(vendorA).claimRefund();
    expect(await tender.hasClaimedRefund(vendorA.address)).to.eq(true);

    await expect(tender.connect(vendorB).claimRefund()).to.be.reverted;
    await tender.connect(vendorB).claimAward();
    expect(await tender.hasClaimedAward(vendorB.address)).to.eq(true);
  });

  it("prevents closing before the deadline and by non-issuer callers", async function () {
    const tender = await deployTender();

    await submitEncryptedBid(tender, vendorA, 500);
    await expect(tender.connect(issuer).closeTender()).to.be.reverted;

    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine", []);

    await expect(tender.connect(vendorA).closeTender()).to.be.reverted;
  });

  it("does not expose bid plaintext through public getters", async function () {
    const tender = await deployTender();

    await submitEncryptedBid(tender, vendorA, 500);

    expect(await tender.getBidCount()).to.eq(1);
    expect(await tender.getBidderAt(0)).to.eq(vendorA.address);

    const handle = await tender.connect(vendorA).getMyBidHandle();
    expect(handle).to.match(/^0x[0-9a-fA-F]{64}$/);
    expect(handle).to.not.eq("500");
  });
});
