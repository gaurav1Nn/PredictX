// scripts/deployAll.ts
import { ethers } from "hardhat";

async function main() {
  const Token = await ethers.getContractFactory("ERC20Mock");

  // Deploy Mock Tokens
  const mockETH = await Token.deploy("Mock ETH", "METH", ethers.parseEther("1000000"));
  await mockETH.waitForDeployment();
  console.log("Mock ETH deployed to:", await mockETH.getAddress());

  const mockUSDC = await Token.deploy("Mock USDC", "MUSDC", ethers.parseEther("1000000"));
  await mockUSDC.waitForDeployment();
  console.log("Mock USDC deployed to:", await mockUSDC.getAddress());

  const mockZETA = await Token.deploy("Mock ZETA", "MZETA", ethers.parseEther("1000000"));
  await mockZETA.waitForDeployment();
  console.log("Mock ZETA deployed to:", await mockZETA.getAddress());

  // Deploy PredictionMarket
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(await mockZETA.getAddress());
  await predictionMarket.waitForDeployment();
  console.log("PredictionMarket deployed to:", await predictionMarket.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});