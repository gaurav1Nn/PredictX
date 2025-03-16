// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// Removed ZetaChain imports since we're testing locally
// import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IZRC20.sol";
// import "@zetachain/protocol-contracts/contracts/zevm/interfaces/zContract.sol";

contract PredictionMarket is Ownable {
    IERC20 public bettingToken; // Token used for betting (e.g., Mock ETH, USDC, ZETA)

    struct Market {
        string question;         // e.g., "Will AI safety standards improve by 2030?"
        string[] outcomes;      // e.g., ["Yes", "No"]
        uint256 resolutionTime; // Timestamp when the market can be resolved
        bool resolved;          // Whether the market is resolved
        uint256 winningOutcome; // Index of the winning outcome
        address bettingAsset;   // Specific token for this market
    }

    struct Bet {
        address user;           // Bettor’s address
        uint256 amount;         // Amount bet (excluding fee)
        uint256 outcomeIndex;   // Chosen outcome
        address token;          // Token used for the bet
    }

    mapping(uint256 => Market) public markets;          // Market ID to Market details
    mapping(uint256 => string[]) public marketOutcomes; // Market ID to outcomes array
    mapping(uint256 => Bet[]) public marketBets;        // Market ID to array of Bets
    mapping(address => mapping(address => uint256)) public stakes; // user => token => staked amount
    uint256 public marketCount;                         // Total number of markets
    uint256 public constant BET_FEE = 1e16;             // 0.01 tokens (additional Sybil resistance fee)
    uint256 public constant MIN_STAKE = 1e18;           // 1 token minimum stake for Sybil resistance

    event MarketCreated(uint256 marketId, string question, string[] outcomes, uint256 resolutionTime, address bettingAsset);
    event BetPlaced(uint256 marketId, address user, uint256 amount, uint256 outcomeIndex, address token);
    event MarketResolved(uint256 marketId, uint256 winningOutcome);

    constructor(address _bettingToken) {
        bettingToken = IERC20(_bettingToken);
    }

    function createMarket(
        string memory _question,
        string[] memory _outcomes,
        uint256 _resolutionTime,
        address _bettingAsset
    ) external {
        require(_resolutionTime > block.timestamp, "Resolution time must be in the future");
        require(_outcomes.length >= 2, "At least two outcomes required");

        marketCount++;
        markets[marketCount] = Market({
            question: _question,
            outcomes: _outcomes,
            resolutionTime: _resolutionTime,
            resolved: false,
            winningOutcome: 0,
            bettingAsset: _bettingAsset
        });
        marketOutcomes[marketCount] = _outcomes;

        emit MarketCreated(marketCount, _question, _outcomes, _resolutionTime, _bettingAsset);
    }

    function getOutcomesLength(uint256 _marketId) external view returns (uint256) {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market ID");
        return marketOutcomes[_marketId].length;
    }

    function stakeTokens(uint256 amount, address tokenAddress) external {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender][tokenAddress] += amount;
    }

    function placeBet(uint256 _marketId, uint256 _outcomeIndex, uint256 _amount, address _tokenAddress) external {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market ID");
        require(_amount > 0, "Bet amount must be greater than zero");
        require(block.timestamp < markets[_marketId].resolutionTime, "Betting period has ended");
        require(!markets[_marketId].resolved, "Market already resolved");
        require(_outcomeIndex < marketOutcomes[_marketId].length, "Invalid outcome index");
        require(_tokenAddress == markets[_marketId].bettingAsset, "Invalid token for this market");
        require(stakes[msg.sender][_tokenAddress] >= MIN_STAKE, "Must stake at least 1 token for Sybil resistance");

        // Transfer the bet amount + fee in a single transaction
        uint256 totalAmount = _amount + BET_FEE;
        IERC20(_tokenAddress).transferFrom(msg.sender, address(this), totalAmount);

        marketBets[_marketId].push(Bet({
            user: msg.sender,
            amount: _amount,
            outcomeIndex: _outcomeIndex,
            token: _tokenAddress
        }));

        emit BetPlaced(_marketId, msg.sender, _amount, _outcomeIndex, _tokenAddress);
    }

    // Simulated cross-chain call for local testing
    function simulateCrossChainCall(
        uint256 marketId,
        uint256 amount,
        uint256 outcomeIndex,
        address user,
        address tokenAddress
    ) external {
        require(marketId > 0 && marketId <= marketCount, "Invalid market ID");
        require(amount > 0, "Bet amount must be greater than zero");
        require(block.timestamp < markets[marketId].resolutionTime, "Betting period has ended");
        require(!markets[marketId].resolved, "Market already resolved");
        require(outcomeIndex < marketOutcomes[marketId].length, "Invalid outcome index");
        require(tokenAddress == markets[marketId].bettingAsset, "Invalid token for this market");
        require(stakes[user][tokenAddress] >= MIN_STAKE, "Must stake at least 1 token for Sybil resistance");

        uint256 betAmount = amount - BET_FEE;

        marketBets[marketId].push(Bet({
            user: user,
            amount: betAmount,
            outcomeIndex: outcomeIndex,
            token: tokenAddress
        }));

        emit BetPlaced(marketId, user, betAmount, outcomeIndex, tokenAddress);
    }

    function resolveMarket(uint256 _marketId, uint256 _winningOutcome) external onlyOwner {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market ID");
        require(block.timestamp >= markets[_marketId].resolutionTime, "Too early to resolve");
        require(!markets[_marketId].resolved, "Market already resolved");
        require(_winningOutcome < marketOutcomes[_marketId].length, "Invalid winning outcome");

        markets[_marketId].resolved = true;
        markets[_marketId].winningOutcome = _winningOutcome;

        distributeRewards(_marketId, _winningOutcome);
        emit MarketResolved(_marketId, _winningOutcome);
    }

    function distributeRewards(uint256 _marketId, uint256 _winningOutcome) private {
        Bet[] storage bets = marketBets[_marketId];
        address bettingAsset = markets[_marketId].bettingAsset;
        uint256 totalPool = 0;    // Total tokens bet on the market (excluding fees)
        uint256 winningPool = 0;  // Total tokens bet on the winning outcome

        // Calculate pools
        for (uint256 i = 0; i < bets.length; i++) {
            totalPool += bets[i].amount;
            if (bets[i].outcomeIndex == _winningOutcome) {
                winningPool += bets[i].amount;
            }
        }

        // Distribute rewards
        if (winningPool > 0) {
            for (uint256 i = 0; i < bets.length; i++) {
                if (bets[i].outcomeIndex == _winningOutcome) {
                    uint256 reward = (bets[i].amount * totalPool) / winningPool;
                    IERC20(bettingAsset).transfer(bets[i].user, reward);
                }
            }
        }
    }
}