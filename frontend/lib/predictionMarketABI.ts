"use client"; // Remove if not needed

export const predictionMarketABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "question", "type": "string" },
      { "internalType": "string[]", "name": "outcomes", "type": "string[]" },
      { "internalType": "uint256", "name": "resolutionTime", "type": "uint256" },
      { "internalType": "address", "name": "bettingAsset", "type": "address" }
    ],
    "name": "createMarket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "internalType": "uint256", "name": "outcomeIndex", "type": "uint256" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "address", "name": "token", "type": "address" }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "marketCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "markets",
    "outputs": [
      { "internalType": "string", "name": "question", "type": "string" },
      { "internalType": "uint256", "name": "resolutionTime", "type": "uint256" },
      { "internalType": "bool", "name": "resolved", "type": "bool" },
      { "internalType": "uint256", "name": "winningOutcome", "type": "uint256" },
      { "internalType": "address", "name": "bettingAsset", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "marketBets",
    "outputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "outcomeIndex", "type": "uint256" },
      { "internalType": "address", "name": "token", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
