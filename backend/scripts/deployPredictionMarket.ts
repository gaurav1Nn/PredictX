import { ethers } from "hardhat";

async function main() {
  const mockTokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Mock ZETA
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(mockTokenAddress);
  await predictionMarket.waitForDeployment();
  console.log("PredictionMarket deployed to:", await predictionMarket.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});