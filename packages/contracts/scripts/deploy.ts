import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const tokenFactory = await ethers.getContractFactory("TenderToken");
  const token = await tokenFactory.deploy(deployer.address, ethers.parseUnits("1000000", 18));
  await token.waitForDeployment();

  const factoryFactory = await ethers.getContractFactory("TenderFactory");
  const factory = await factoryFactory.deploy();
  await factory.waitForDeployment();

  const deployment = {
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    network: network.name,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      TenderToken: await token.getAddress(),
      TenderFactory: await factory.getAddress(),
    },
  };

  const outputDir = path.resolve("deployments");
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, `${network.name}.json`), JSON.stringify(deployment, null, 2));

  console.log(JSON.stringify(deployment, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
