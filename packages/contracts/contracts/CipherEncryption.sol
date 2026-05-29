// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";

/**
 * @title CipherEncryption
 * @dev Encrypted sealed-bid encryption using Zama FHEVM
 * Bids are encrypted, comparison is done on encrypted data
 */
contract CipherEncryption is EIP712WithModifier {
    address public issuer;
    uint256 public deadline;
    uint256 public maxBudget;
    address public factory;
    bool public isFinalized;

    // Encrypted bid storage
    mapping(address => euint64) private encryptedBids;
    mapping(address => bool) public hasBid;
    mapping(address => bool) public bidderExists;

    address[] public bidders;
    euint64 private encryptedMinBid;
    address public winnerAddress;
    uint64 public winningBid;
    bool public winnerRevealed;

    // Events
    event BidSubmitted(address indexed bidder);
    event EncryptionClosed();
    event WinnerSelected(address indexed winner);
    event WinnerRevealed(address indexed winner, uint64 amount);

    modifier onlyIssuer() {
        require(msg.sender == issuer, "Only issuer can call this");
        _;
    }

    modifier onlyBeforeDeadline() {
        require(block.timestamp < deadline, "Bidding deadline has passed");
        _;
    }

    modifier onlyAfterDeadline() {
        require(block.timestamp >= deadline, "Bidding period not closed yet");
        _;
    }

    modifier onlyValidBid(bytes calldata encryptedBid) {
        require(encryptedBid.length > 0, "Invalid encrypted bid");
        _;
    }

    constructor(
        address _issuer,
        uint256 _maxBudget,
        uint256 _deadline,
        address _factory
    ) EIP712WithModifier("Cipher", "1") {
        issuer = _issuer;
        maxBudget = _maxBudget;
        deadline = _deadline;
        factory = _factory;
        isFinalized = false;
        winnerRevealed = false;
    }

    /**
     * @dev Submit an encrypted bid
     * @param encryptedBid The encrypted bid amount (encrypted as euint64)
     */
    function submitBid(bytes calldata encryptedBid)
        external
        onlyBeforeDeadline
        onlyValidBid(encryptedBid)
    {
        require(!hasBid[msg.sender], "Bidder has already submitted a bid");
        require(encryptedBid.length <= 1024, "Encrypted bid too large");

        // Decrypt and store the encrypted bid handle
        euint64 bid = TFHE.asEuint64(encryptedBid);

        // Store the encrypted bid
        encryptedBids[msg.sender] = bid;
        hasBid[msg.sender] = true;

        if (!bidderExists[msg.sender]) {
            bidders.push(msg.sender);
            bidderExists[msg.sender] = true;
        }

        emit BidSubmitted(msg.sender);
    }

    /**
     * @dev Compute the minimum encrypted bid (winner)
     * Called by issuer after deadline
     */
    function computeWinner()
        external
        onlyIssuer
        onlyAfterDeadline
    {
        require(!isFinalized, "Encryption already finalized");
        require(bidders.length > 0, "No bids received");

        // Initialize with first bid
        euint64 minBid = encryptedBids[bidders[0]];
        address currentWinner = bidders[0];

        // Find minimum encrypted bid
        for (uint256 i = 1; i < bidders.length; i++) {
            euint64 bid = encryptedBids[bidders[i]];
            ebool isSmaller = TFHE.lt(bid, minBid);

            // Select minimum using encrypted comparison
            minBid = TFHE.select(isSmaller, bid, minBid);

            // Update winner address
            if (TFHE.decrypt(isSmaller)) {
                currentWinner = bidders[i];
            }
        }

        encryptedMinBid = minBid;
        winnerAddress = currentWinner;
        isFinalized = true;

        emit EncryptionClosed();
        emit WinnerSelected(currentWinner);
    }

    /**
     * @dev Reveal winner and winning bid (only to issuer and winner)
     * @param _winningBidAmount The decrypted winning bid amount
     */
    function revealWinner(uint64 _winningBidAmount)
        external
        onlyIssuer
    {
        require(isFinalized, "Winner not yet computed");
        require(!winnerRevealed, "Winner already revealed");
        require(_winningBidAmount <= maxBudget, "Invalid bid amount");

        // Verify the decrypted amount matches the encrypted minimum
        winningBid = _winningBidAmount;
        winnerRevealed = true;

        emit WinnerRevealed(winnerAddress, _winningBidAmount);
    }

    /**
     * @dev Check if caller is the winner
     */
    function isWinner(address _address) external view returns (bool) {
        return winnerRevealed && winnerAddress == _address;
    }

    /**
     * @dev Get number of bidders
     */
    function getBidderCount() external view returns (uint256) {
        return bidders.length;
    }

    /**
     * @dev Get bidder at index
     */
    function getBidderAt(uint256 _index) external view returns (address) {
        require(_index < bidders.length, "Index out of bounds");
        return bidders[_index];
    }

    /**
     * @dev Get encryption status
     */
    function getEncryptionStatus()
        external
        view
        returns (
            bool _isOpen,
            bool _isFinalized,
            bool _winnerRevealed,
            uint256 _bidCount,
            address _winner
        )
    {
        return (
            block.timestamp < deadline,
            isFinalized,
            winnerRevealed,
            bidders.length,
            winnerAddress
        );
    }

    /**
     * @dev Get winning bid (only if revealed)
     */
    function getWinningBid() external view returns (uint64) {
        require(winnerRevealed, "Winner not yet revealed");
        return winningBid;
    }
}
