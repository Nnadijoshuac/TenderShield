import { readFile } from "node:fs/promises";
import path from "node:path";
import { ethers, network } from "hardhat";

async function main() {
  const deploymentPath = path.resolve("deployments", `${network.name}.json`);
  const deployment = JSON.parse(await readFile(deploymentPath, "utf8")) as {
    contracts: { TenderFactory: string; TenderToken: string };
  };

  const factory = await ethers.getContractAt("TenderFactory", deployment.contracts.TenderFactory);
  const deadline = Math.floor(Date.now() / 1000) + 3600;

  const tx = await factory.createTender(
    "Procurement for 50 laptops",
    "NGO procurement request for laptops for students. Vendors submit sealed quotes.",
    deadline,
    25,
    600,
    deployment.contracts.TenderToken,
  );

  const receipt = await tx.wait();
  console.log("Demo tender created", receipt?.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
