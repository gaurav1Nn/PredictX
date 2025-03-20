import { defineChain } from "viem";
import { http } from "viem";
import { createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

// 1. Define your Hardhat local chain
export const hardhatLocal = defineChain({
  id: 31337,
  name: "Hardhat",
  network: "hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545"],
    },
  },
});

// 2. Configure chains and transports
const chains = [hardhatLocal] as const;

export const config = createConfig({
  chains,
  connectors: [injected()],
  transports: {
    [hardhatLocal.id]: http(),
  },
});

export { chains };