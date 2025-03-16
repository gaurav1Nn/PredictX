import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer ZETA balance:", ethers.formatEther(balance), "ZETA");

  // Deploy MockERC20
  console.log("Deploying MockERC20...");
  const MockToken = await ethers.getContractFactory("MockERC20");
  const mockTokenTx = await MockToken.deploy("Mock ZETA", "MZETA", ethers.parseEther("1000"));
  const mockTokenTxResponse = mockTokenTx.deploymentTransaction();
  if (!mockTokenTxResponse) throw new Error("MockERC20 deployment transaction not found");
  const mockTokenReceipt = await mockTokenTxResponse.wait();
  if (!mockTokenReceipt) throw new Error("MockERC20 deployment receipt not found");
  const mockToken = await mockTokenTx.waitForDeployment();
  const mockTokenAddress = await mockToken.getAddress();
  console.log("Mock Token deployed to:", mockTokenAddress);
  console.log("Mock Token deployment transaction hash:", mockTokenReceipt.hash);

  // Deploy PredictionMarket
  console.log("Deploying PredictionMarket...");
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarketTx = await PredictionMarket.deploy(mockTokenAddress);
  const predictionMarketTxResponse = predictionMarketTx.deploymentTransaction();
  if (!predictionMarketTxResponse) throw new Error("PredictionMarket deployment transaction not found");
  const predictionMarketReceipt = await predictionMarketTxResponse.wait();
  if (!predictionMarketReceipt) throw new Error("PredictionMarket deployment receipt not found");
  const predictionMarket = await predictionMarketTx.waitForDeployment();
  const predictionMarketAddress = await predictionMarket.getAddress();
  console.log("PredictionMarket deployed to:", predictionMarketAddress);
  console.log("PredictionMarket deployment transaction hash:", predictionMarketReceipt.hash);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});