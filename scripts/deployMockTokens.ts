import { ethers } from "hardhat";

async function main() {
  const Token = await ethers.getContractFactory("ERC20Mock");
  const mockETH = await Token.deploy("Mock ETH", "METH", ethers.parseEther("1000"));
  const mockUSDC = await Token.deploy("Mock USDC", "MUSDC", ethers.parseEther("1000"));
  const mockZETA = await Token.deploy("Mock ZETA", "MZETA", ethers.parseEther("1000"));
  console.log("Mock ETH deployed to:", await mockETH.getAddress());
  console.log("Mock USDC deployed to:", await mockUSDC.getAddress());
  console.log("Mock ZETA deployed to:", await mockZETA.getAddress());
}

main().catch(console.error);