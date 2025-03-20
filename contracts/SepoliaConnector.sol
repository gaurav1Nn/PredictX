// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@zetachain/protocol-contracts/contracts/zevm/interfaces/zContract.sol";

contract SepoliaConnector {
    address public predictionMarket;
    uint256 public zetaChainId = 7001; // ZetaChain Testnet Chain ID

    constructor(address _predictionMarket) {
        predictionMarket = _predictionMarket;
    }

    function placeCrossChainBet(uint256 marketId, uint256 outcomeIndex, uint256 amount) external payable {
        // For testing purposes, directly call the PredictionMarket contract
        // In a real cross-chain scenario, this would involve ZetaChain's messaging protocol
        bytes memory message = abi.encode(marketId, outcomeIndex, msg.sender);
        zContract(predictionMarket).onCrossChainCall(
            address(0), // zrc20 (not used in this test)
            amount,
            message
        );
    }
}