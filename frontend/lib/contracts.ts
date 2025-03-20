"use client";

// Import the ABI from a separate file (predictionMarketABI.ts)
import { predictionMarketABI } from "./predictionMarketABI";

// Deployed contract addresses
export const predictionMarketAddress = process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS as `0x${string}`;
export const mockEthAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const mockUsdcAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const mockZetaAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// Export the ABI directly (so you can import from this file)
export { predictionMarketABI };
