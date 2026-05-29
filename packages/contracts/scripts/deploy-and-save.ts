import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying to network:", network.name);
  console.log("Deployer address:", deployer.address);

  const tokenFactory = await ethers.getContractFactory("TenderToken");
  const token = await tokenFactory.deploy(deployer.address, ethers.parseUnits("1000000", 18));
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TenderToken deployed at:", tokenAddress);

  const factoryFactory = await ethers.getContractFactory("TenderFactory");
  const factory = await factoryFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("TenderFactory deployed at:", factoryAddress);

  const deployment = {
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    network: network.name,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      TenderToken: tokenAddress,
      TenderFactory: factoryAddress,
    },
  };

  // Save to deployments folder
  const outputDir = path.resolve("deployments");
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, `${network.name}.json`), JSON.stringify(deployment, null, 2));

  // Save to web app .env.local
  const envContent = `NEXT_PUBLIC_TENDER_FACTORY_ADDRESS=${factoryAddress}
NEXT_PUBLIC_TENDER_TOKEN_ADDRESS=${tokenAddress}
NEXT_PUBLIC_CHAIN_ID=${deployment.chainId}
NEXT_PUBLIC_RELAYER_URL=http://localhost:3001
`;

  const webEnvPath = path.resolve("../../apps/web/.env.local");
  await writeFile(webEnvPath, envContent);
  console.log("Web app .env.local updated");

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deployment, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
