import { ethers, network } from "hardhat";

// MockERC20 ABI (unchanged)
const mockTokenABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "uint256", "name": "initialSupply", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "allowance", "type": "uint256" },
      { "internalType": "uint256", "name": "needed", "type": "uint256" }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "sender", "type": "address" },
      { "internalType": "uint256", "name": "balance", "type": "uint256" },
      { "internalType": "uint256", "name": "needed", "type": "uint256" }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "approver", "type": "address" }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "receiver", "type": "address" }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "sender", "type": "address" }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      { "internalType": "uint8", "name": "", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Updated PredictionMarket ABI to handle bettingToken correctly
const predictionMarketABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_bettingToken", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "outcomeIndex", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "token", "type": "address" }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "question", "type": "string" },
      { "indexed": false, "internalType": "string[]", "name": "outcomes", "type": "string[]" },
      { "indexed": false, "internalType": "uint256", "name": "resolutionTime", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "bettingAsset", "type": "address" }
    ],
    "name": "MarketCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "winningOutcome", "type": "uint256" }
    ],
    "name": "MarketResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "BET_FEE",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "bettingToken",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" } // Updated to return address
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_question", "type": "string" },
      { "internalType": "string[]", "name": "_outcomes", "type": "string[]" },
      { "internalType": "uint256", "name": "_resolutionTime", "type": "uint256" },
      { "internalType": "address", "name": "_bettingAsset", "type": "address" }
    ],
    "name": "createMarket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_marketId", "type": "uint256" }
    ],
    "name": "getOutcomesLength",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
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
  },
  {
    "inputs": [],
    "name": "marketCount",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "marketOutcomes",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
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
    "inputs": [],
    "name": "owner",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_marketId", "type": "uint256" },
      { "internalType": "uint256", "name": "_outcomeIndex", "type": "uint256" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "address", "name": "_tokenAddress", "type": "address" }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "address", "name": "tokenAddress", "type": "address" }
    ],
    "name": "stakeTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_marketId", "type": "uint256" },
      { "internalType": "uint256", "name": "winningOutcome", "type": "uint256" }
    ],
    "name": "resolveMarket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "outcomeIndex", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "address", "name": "tokenAddress", "type": "address" }
    ],
    "name": "simulateCrossChainCall",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Utility function to add a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  // Get multiple signers (deployer, user1, user2, sepoliaSigner)
  const signers = await ethers.getSigners();
  if (signers.length < 4) {
    throw new Error(`Expected at least 4 signers, but got ${signers.length}. Please configure Hardhat with more accounts.`);
  }
  const [deployer, user1, user2, sepoliaSigner] = signers;
  console.log("Deployer account:", deployer.address);
  console.log("User1 account:", user1.address);
  console.log("User2 account:", user2.address);
  console.log("Sepolia account:", sepoliaSigner.address);

  // Check gas balances (local Hardhat uses ETH-like gas)
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  const user1Balance = await ethers.provider.getBalance(user1.address);
  const user2Balance = await ethers.provider.getBalance(user2.address);
  const sepoliaBalance = await ethers.provider.getBalance(sepoliaSigner.address);
  console.log("Deployer balance:", ethers.formatEther(deployerBalance), "ETH");
  console.log("User1 balance:", ethers.formatEther(user1Balance), "ETH");
  console.log("User2 balance:", ethers.formatEther(user2Balance), "ETH");
  console.log("Sepolia balance:", ethers.formatEther(sepoliaBalance), "ETH");

  // Mock token addresses from your deployment
  const mockZETAAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  // Connect to Mock ZETA (only token used by PredictionMarket)
  const MockToken = await ethers.getContractFactory("ERC20Mock");
  const mockZETA = MockToken.attach(mockZETAAddress);

  // Connect to PredictionMarket
  const predictionMarketAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Updated address
  const predictionMarket = new ethers.Contract(predictionMarketAddress, predictionMarketABI, deployer);

  // Verify contract exists
  const code = await ethers.provider.getCode(predictionMarketAddress);
  console.log("Bytecode at PredictionMarket address:", code);
  if (code === "0x") {
    throw new Error("No contract found at PredictionMarket address!");
  }

  // Verify bettingToken address
  let bettingTokenAddress;
  try {
    bettingTokenAddress = await predictionMarket.bettingToken();
    console.log("PredictionMarket bettingToken address:", bettingTokenAddress);
    if (bettingTokenAddress.toLowerCase() !== mockZETAAddress.toLowerCase()) {
      throw new Error(`Betting token mismatch! Expected ${mockZETAAddress}, but got ${bettingTokenAddress}`);
    }
  } catch (error) {
    console.warn("Failed to decode bettingToken directly. Attempting to handle as address:", error);
    // Fallback: Try calling bettingToken and manually extract the address
    const rawResult = await predictionMarket.provider.call({
      to: predictionMarketAddress,
      data: predictionMarket.interface.encodeFunctionData("bettingToken")
    });
    bettingTokenAddress = ethers.getAddress("0x" + rawResult.slice(26)); // Extract address from the raw result
    console.log("Extracted bettingToken address:", bettingTokenAddress);
    if (bettingTokenAddress.toLowerCase() !== mockZETAAddress.toLowerCase()) {
      throw new Error(`Betting token mismatch! Expected ${mockZETAAddress}, but got ${bettingTokenAddress}`);
    }
  }

  // Check initial Mock ZETA balances
  console.log("Deployer Mock ZETA balance:", ethers.formatEther(await mockZETA.balanceOf(deployer.address)));
  console.log("User1 Mock ZETA balance:", ethers.formatEther(await mockZETA.balanceOf(user1.address)));
  console.log("User2 Mock ZETA balance:", ethers.formatEther(await mockZETA.balanceOf(user2.address)));
  console.log("Sepolia Mock ZETA balance:", ethers.formatEther(await mockZETA.balanceOf(sepoliaSigner.address)));

  // Transfer Mock ZETA to users if needed
  const requiredAmount = ethers.parseEther("20000"); // Increased to cover all bets
  for (const user of [user1, user2, sepoliaSigner]) {
    const balance = await mockZETA.balanceOf(user.address);
    if (balance < requiredAmount) {
      await mockZETA.connect(deployer).transfer(user.address, requiredAmount);
      console.log(`Transferred ${ethers.formatEther(requiredAmount)} Mock ZETA to ${user.address}`);
    }
  }

  // Approve Mock ZETA for betting
  const betAllowance = ethers.parseEther("100");
  for (const user of [deployer, user1, user2, sepoliaSigner]) {
    const allowance = await mockZETA.allowance(user.address, predictionMarketAddress);
    if (allowance < betAllowance) {
      await mockZETA.connect(user).approve(predictionMarketAddress, betAllowance);
      console.log(`Approved ${user.address} to spend ${ethers.formatEther(betAllowance)} Mock ZETA`);
    }
  }

  // Create multiple markets with d/acc topics
  const markets = [
    { question: "Will AGI be achieved by 2030?", outcomes: ["Yes", "No"], resolutionTimeOffset: 300, bettingAsset: mockZETAAddress },
    { question: "Will a major cloud outage occur in 2025?", outcomes: ["Yes", "No"], resolutionTimeOffset: 600, bettingAsset: mockZETAAddress },
  ];

  let marketIds: string[] = [];
  for (const market of markets) {
    const latestBlock = await ethers.provider.getBlock("latest");
    const currentTimestamp = latestBlock.timestamp;
    const resolutionTime = currentTimestamp + market.resolutionTimeOffset;

    console.log(`Creating market with:`);
    console.log("Question:", market.question);
    console.log("Outcomes:", market.outcomes);
    console.log("Current Block Timestamp:", currentTimestamp);
    console.log("Resolution Time:", resolutionTime);
    console.log("Betting Asset:", market.bettingAsset);

    const createMarketTx = await predictionMarket.createMarket(market.question, market.outcomes, resolutionTime, market.bettingAsset);
    const createMarketReceipt = await createMarketTx.wait();
    console.log("Market creation transaction hash:", createMarketTx.hash);
    console.log("Market creation status:", createMarketReceipt.status === 1 ? "Success" : "Failed");

    const marketCreatedEvent = predictionMarket.interface.parseLog(createMarketReceipt.logs[0]);
    if (marketCreatedEvent && marketCreatedEvent.name === "MarketCreated") {
      marketIds.push(marketCreatedEvent.args.marketId.toString());
      console.log("MarketCreated event emitted:", {
        marketId: marketCreatedEvent.args.marketId.toString(),
        question: marketCreatedEvent.args.question,
        outcomes: marketCreatedEvent.args.outcomes,
        resolutionTime: marketCreatedEvent.args.resolutionTime.toString(),
        bettingAsset: marketCreatedEvent.args.bettingAsset,
      });
    } else {
      marketIds.push((await predictionMarket.marketCount()).toString());
    }
  }

  console.log("Market IDs:", marketIds);

  // Place bets on the markets using Mock ZETA
  const users = [
    { signer: deployer, amount: ethers.parseEther("5"), outcomeIndex: 0, marketId: parseInt(marketIds[0]), token: mockZETAAddress },
    { signer: user1, amount: ethers.parseEther("5"), outcomeIndex: 0, marketId: parseInt(marketIds[0]), token: mockZETAAddress },
    { signer: user2, amount: ethers.parseEther("5"), outcomeIndex: 1, marketId: parseInt(marketIds[1]), token: mockZETAAddress },
  ];

  const betFee = await predictionMarket.BET_FEE();
  console.log("Bet fee:", ethers.formatEther(betFee), "Mock ZETA");
  for (const user of users) {
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentBlockTimestamp = currentBlock.timestamp;
    const marketDetails = await predictionMarket.markets(user.marketId);
    const resolutionTime = marketDetails.resolutionTime;

    console.log(`Current Block Timestamp before betting for ${user.signer.address}: ${currentBlockTimestamp}`);
    if (currentBlockTimestamp >= resolutionTime) {
      console.warn(`Betting period has ended for market ${user.marketId}. Skipping bet for ${user.signer.address}.`);
      continue;
    }

    const userPredictionMarket = predictionMarket.connect(user.signer);
    const totalAmount = user.amount + BigInt(betFee);
    const allowance = await mockZETA.allowance(user.signer.address, predictionMarketAddress);
    if (allowance < totalAmount) {
      const approveTx = await mockZETA.connect(user.signer).approve(predictionMarketAddress, totalAmount);
      await approveTx.wait();
      console.log(`Approved ${ethers.formatEther(totalAmount)} Mock ZETA for ${user.signer.address}`);
    }

    try {
      const placeBetTx = await userPredictionMarket.placeBet(user.marketId, user.outcomeIndex, user.amount, user.token);
      await placeBetTx.wait();
      console.log(`Bet placed by ${user.signer.address}: ${ethers.formatEther(user.amount)} Mock ZETA on outcome ${user.outcomeIndex} for market ${user.marketId}`);
    } catch (error) {
      console.error(`Failed to place bet for ${user.signer.address}:`, error);
      continue;
    }

    await delay(2000); // 2-second delay between bets
  }

  // Simulate cross-chain bet from Sepolia account
  const crossChainBetAmount = ethers.parseEther("5");
  const crossChainTotalAmount = crossChainBetAmount + BigInt(betFee);
  const crossChainAllowance = await mockZETA.allowance(sepoliaSigner.address, predictionMarketAddress);
  if (crossChainAllowance < crossChainTotalAmount) {
    const approveTx = await mockZETA.connect(sepoliaSigner).approve(predictionMarketAddress, crossChainTotalAmount);
    await approveTx.wait();
    console.log(`Approved ${ethers.formatEther(crossChainTotalAmount)} Mock ZETA for Sepolia account`);
  }

  const sepoliaPredictionMarket = predictionMarket.connect(sepoliaSigner);
  const sepoliaBetTx = await sepoliaPredictionMarket.simulateCrossChainCall(parseInt(marketIds[1]), crossChainBetAmount, 0, sepoliaSigner.address, mockZETAAddress);
  await sepoliaBetTx.wait();
  console.log(`Simulated cross-chain bet by ${sepoliaSigner.address}: ${ethers.formatEther(crossChainBetAmount)} Mock ZETA on outcome 0 for market ${marketIds[1]}`);

  // Fast-forward time and resolve markets
  for (let i = 0; i < markets.length; i++) {
    await ethers.provider.send("evm_increaseTime", [markets[i].resolutionTimeOffset]);
    await ethers.provider.send("evm_mine");
    const resolveMarketTx = await predictionMarket.resolveMarket(parseInt(marketIds[i]), 0); // Resolve with "Yes"
    await resolveMarketTx.wait();
    console.log(`Market ${marketIds[i]} resolved with winning outcome: Yes`);
  }

  // Check final balances
  for (const user of users) {
    const finalBalance = await mockZETA.balanceOf(user.signer.address);
    console.log(`Final Mock ZETA balance for ${user.signer.address}: ${ethers.formatEther(finalBalance)}`);
  }
  const finalSepoliaBalance = await mockZETA.balanceOf(sepoliaSigner.address);
  console.log(`Final Mock ZETA balance for Sepolia account ${sepoliaSigner.address}: ${ethers.formatEther(finalSepoliaBalance)}`);
}

main().catch((error) => {
  console.error("Interaction failed:", error);
  process.exitCode = 1;
});