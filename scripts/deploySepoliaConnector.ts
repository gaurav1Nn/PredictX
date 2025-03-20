import { ethers } from "hardhat";

async function main() {
  const predictionMarketAddress = "0x44DD2c3f6099a302fe1B78517331a3A34e5EF660"; // Updated PredictionMarket address
  const SepoliaConnector = await ethers.getContractFactory("SepoliaConnector");
  const sepoliaConnector = await SepoliaConnector.deploy(predictionMarketAddress);
  await sepoliaConnector.waitForDeployment();
  console.log("SepoliaConnector deployed to:", await sepoliaConnector.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});