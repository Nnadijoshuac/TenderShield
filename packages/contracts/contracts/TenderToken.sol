// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Stretch goal placeholder. Confidential settlement is documented in the README,
/// but the MVP keeps encrypted bidding independent from token integration.
contract TenderToken {
    string public constant name = "Tender USD";
    string public constant symbol = "tUSD";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(address initialHolder, uint256 initialSupply) {
        totalSupply = initialSupply;
        balanceOf[initialHolder] = initialSupply;
        emit Transfer(address(0), initialHolder, initialSupply);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(balanceOf[msg.sender] >= value, "balance");
        unchecked {
            balanceOf[msg.sender] -= value;
            balanceOf[to] += value;
        }
        emit Transfer(msg.sender, to, value);
        return true;
    }
}
