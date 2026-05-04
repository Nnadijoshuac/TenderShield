import { expect } from "chai";
import { ethers } from "hardhat";

describe("TenderFactory", function () {
  it("deploys and creates a tender", async function () {
    const [issuer] = await ethers.getSigners();
    const factory = await (await ethers.getContractFactory("TenderFactory")).deploy();
    await factory.waitForDeployment();

    const deadline = (await ethers.provider.getBlock("latest"))!.timestamp + 3600;
    const tx = await factory
      .connect(issuer)
      .createTender("Procurement for 50 laptops", "ipfs://demo", deadline, 25, 600, ethers.ZeroAddress);
    await tx.wait();

    expect(await factory.getTenders()).to.have.length(1);
    expect(await factory.getTendersByIssuer(issuer.address)).to.have.length(1);
  });

  it("rejects invalid createTender parameters", async function () {
    const factory = await (await ethers.getContractFactory("TenderFactory")).deploy();
    await factory.waitForDeployment();

    const current = (await ethers.provider.getBlock("latest"))!.timestamp;
    await expect(factory.createTender("", "ipfs://demo", current + 3600, 25, 600, ethers.ZeroAddress)).to.be.reverted;
    await expect(
      factory.createTender("Procurement for 50 laptops", "ipfs://demo", current, 25, 600, ethers.ZeroAddress),
    ).to.be.reverted;
  });
});
