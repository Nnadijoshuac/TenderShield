import { expect } from "chai";
import { ethers } from "hardhat";

describe("TenderToken", function () {
  it("mints demo supply to deployer and transfers balances", async function () {
    const [deployer, recipient] = await ethers.getSigners();
    const token = await (await ethers.getContractFactory("TenderToken")).deploy(
      deployer.address,
      ethers.parseUnits("1000", 18),
    );
    await token.waitForDeployment();

    expect(await token.balanceOf(deployer.address)).to.eq(ethers.parseUnits("1000", 18));

    await token.transfer(recipient.address, ethers.parseUnits("250", 18));
    expect(await token.balanceOf(recipient.address)).to.eq(ethers.parseUnits("250", 18));
  });
});
