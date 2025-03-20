// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7; // Changed from ^0.8.19 to match hardhat.config.ts

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
}