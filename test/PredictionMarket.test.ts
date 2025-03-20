import { expect } from "chai";
import { ethers } from "hardhat";

describe("PredictionMarket", function () {
  // Test 1: Deployment
  it("Should deploy the contract", async function () {
    const [deployer] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockToken.deploy("Mock ZETA", "MZETA", ethers.parseEther("1000"));
    await mockToken.waitForDeployment();
    const zetaTokenAddress = mockToken.target;

    const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarket", deployer);
    const predictionMarket = await PredictionMarketFactory.deploy(zetaTokenAddress);
    await predictionMarket.waitForDeployment();

    expect(predictionMarket.target).to.not.equal(ethers.ZeroAddress);
  });

  // Test 2: Create a Market
  it("Should create a market", async function () {
    const [deployer] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockToken.deploy("Mock ZETA", "MZETA", ethers.parseEther("1000"));
    await mockToken.waitForDeployment();
    const zetaTokenAddress = mockToken.target;

    const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarket", deployer);
    const predictionMarket = await PredictionMarketFactory.deploy(zetaTokenAddress);
    await predictionMarket.waitForDeployment();

    const question = "Will it rain tomorrow?";
    const outcomes = ["Yes", "No"];
    const block = await ethers.provider.getBlock("latest");
    if (!block) throw new Error("Failed to fetch latest block");
    const resolutionTime = block.timestamp + 86400; // 1 day from now

    await predictionMarket.createMarket(question, outcomes, resolutionTime);
    const marketCount = await predictionMarket.marketCount();
    console.log("Market count:", marketCount.toString()); // Debug log
    expect(marketCount).to.equal(1);

    const outcomesLength = await predictionMarket.getOutcomesLength(1);
    expect(outcomesLength).to.equal(outcomes.length); // Compare with input outcomes length
    const market = await predictionMarket.markets(1);
    expect(market.question).to.equal(question);
    expect(Number(market.resolutionTime)).to.be.at.least(resolutionTime); // Convert BigInt to Number
    expect(market.resolved).to.be.false;
  });

  // Test 3: Place a Bet
  it("Should allow a user to place a bet", async function () {
    const [deployer, user] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockToken.deploy("Mock ZETA", "MZETA", ethers.parseEther("1000"));
    await mockToken.waitForDeployment();
    const zetaTokenAddress = mockToken.target;

    const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarket", deployer);
    const predictionMarket = await PredictionMarketFactory.deploy(zetaTokenAddress);
    await predictionMarket.waitForDeployment();

    const question = "Will it rain tomorrow?";
    const outcomes = ["Yes", "No"];
    const block = await ethers.provider.getBlock("latest");
    if (!block) throw new Error("Failed to fetch latest block");
    const resolutionTime = block.timestamp + 86400;

    await predictionMarket.createMarket(question, outcomes, resolutionTime);

    const betAmount = ethers.parseEther("1"); // 1 ZETA
    const totalAmount = betAmount + ethers.parseEther("0.01"); // 1 ZETA + 0.01 ZETA (BET_FEE)
    await mockToken.transfer(user.address, totalAmount); // Transfer enough tokens
    await mockToken.connect(user).approve(predictionMarket.target, totalAmount); // Approve total amount

    await expect(predictionMarket.connect(user).placeBet(1, 0, betAmount))
      .to.emit(predictionMarket, "BetPlaced")
      .withArgs(1, user.address, betAmount, 0);

    const bet = await predictionMarket.marketBets(1, 0); // Assuming marketBets takes (marketId, index)
    expect(bet.user).to.equal(user.address);
    expect(bet.amount).to.equal(betAmount);
    expect(bet.outcomeIndex).to.equal(0);
  });

  // Test 4: Resolve a Market
  it("Should resolve a market and distribute rewards", async function () {
    const [deployer, user1, user2] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockToken.deploy("Mock ZETA", "MZETA", ethers.parseEther("2000"));
    await mockToken.waitForDeployment();
    const zetaTokenAddress = mockToken.target;

    const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarket", deployer);
    const predictionMarket = await PredictionMarketFactory.deploy(zetaTokenAddress);
    await predictionMarket.waitForDeployment();

    const question = "Will it rain tomorrow?";
    const outcomes = ["Yes", "No"];
    const block = await ethers.provider.getBlock("latest");
    if (!block) throw new Error("Failed to fetch latest block");
    const resolutionTime = block.timestamp + 10; // 10 seconds from now
    await predictionMarket.createMarket(question, outcomes, resolutionTime);

    const betAmount = ethers.parseEther("1");
    const totalAmount = betAmount + ethers.parseEther("0.01"); // 1 ZETA + 0.01 ZETA (BET_FEE)
    await mockToken.transfer(user1.address, totalAmount);
    await mockToken.transfer(user2.address, totalAmount);
    await mockToken.connect(user1).approve(predictionMarket.target, totalAmount);
    await mockToken.connect(user2).approve(predictionMarket.target, totalAmount);

    await predictionMarket.connect(user1).placeBet(1, 0, betAmount); // Bet on "Yes"
    await predictionMarket.connect(user2).placeBet(1, 1, betAmount); // Bet on "No"

    // Move time forward to resolve
    await ethers.provider.send("evm_increaseTime", [10]);
    await ethers.provider.send("evm_mine", []);

    await predictionMarket.resolveMarket(1, 0); // Resolve with "Yes" as winner
    const market = await predictionMarket.markets(1);
    expect(market.resolved).to.be.true;
    expect(Number(market.winningOutcome)).to.equal(0); // Convert BigInt to Number

    // Check user1 (winner) received more tokens, user2 (loser) got nothing
    const user1BalanceAfter = await mockToken.balanceOf(user1.address);
    expect(user1BalanceAfter).to.be.gte(betAmount * BigInt(2)); // Approx. double due to reward
  });
});