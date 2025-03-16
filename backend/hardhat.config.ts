import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {
        count: 10,
      },
    },
    zetaTestnet: {
      url: process.env.ZETA_TESTNET_URL || "https://zeta-chain-testnet.drpc.org",
      chainId: 7001,
      accounts: [
        process.env.PRIVATE_KEY || "",
        process.env.PRIVATE_KEY_2 || "",
        process.env.PRIVATE_KEY_3 || "",
        process.env.PRIVATE_KEY_4 || "",
      ].filter((key) => key !== ""),
      gas: 6000000,
      gasPrice: 15000000000,
      timeout: 180000,
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "https://sepolia.infura.io/v3/e9f7b7f9e01145a19745498ad06da8ee",
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY_4 || ""].filter((key) => key !== ""),
      gas: 7000000,
      gasPrice: 50000000000,
      timeout: 300000,
    },
  },
};

export default config;