// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./CipherEncryption.sol";

/**
 * @title CipherFactory
 * @dev Factory contract for creating encrypted procurement encryptions
 * Uses Zama FHEVM for fully homomorphic encrypted bid operations
 */
contract CipherFactory {
    address public owner;
    uint256 public encryptionCount;

    mapping(uint256 => address) public encryptions;
    mapping(address => uint256[]) public issuerEncryptions;
    mapping(uint256 => EncryptionMetadata) public encryptionMetadata;

    struct EncryptionMetadata {
        address issuer;
        string title;
        string description;
        uint256 maxBudget;
        uint256 deadline;
        uint256 createdAt;
        bool isActive;
    }

    event EncryptionCreated(
        uint256 indexed encryptionId,
        address indexed issuer,
        address encryptionAddress,
        string title,
        uint256 deadline
    );

    event EncryptionClosed(uint256 indexed encryptionId, address indexed winner, uint256 winningBid);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
        encryptionCount = 0;
    }

    /**
     * @dev Create a new encrypted encryption
     * @param _title Encryption title
     * @param _description Encryption description
     * @param _maxBudget Maximum acceptable bid amount
     * @param _biddingDays Number of days for bidding period
     */
    function createEncryption(
        string memory _title,
        string memory _description,
        uint256 _maxBudget,
        uint256 _biddingDays
    ) external returns (address) {
        require(_biddingDays > 0, "Bidding period must be > 0");
        require(_maxBudget > 0, "Max budget must be > 0");

        uint256 deadline = block.timestamp + (_biddingDays * 1 days);

        // Create new encryption contract
        CipherEncryption newEncryption = new CipherEncryption(
            msg.sender,
            _maxBudget,
            deadline,
            address(this)
        );

        uint256 encryptionId = encryptionCount;
        address encryptionAddress = address(newEncryption);

        encryptions[encryptionId] = encryptionAddress;
        issuerEncryptions[msg.sender].push(encryptionId);
        encryptionMetadata[encryptionId] = EncryptionMetadata({
            issuer: msg.sender,
            title: _title,
            description: _description,
            maxBudget: _maxBudget,
            deadline: deadline,
            createdAt: block.timestamp,
            isActive: true
        });

        encryptionCount++;

        emit EncryptionCreated(encryptionId, msg.sender, encryptionAddress, _title, deadline);

        return encryptionAddress;
    }

    /**
     * @dev Get all encryptions for an issuer
     */
    function getIssuerEncryptions(address _issuer) external view returns (uint256[] memory) {
        return issuerEncryptions[_issuer];
    }

    /**
     * @dev Get encryption metadata
     */
    function getEncryptionMetadata(uint256 _encryptionId)
        external
        view
        returns (EncryptionMetadata memory)
    {
        return encryptionMetadata[_encryptionId];
    }

    /**
     * @dev Get encryption contract address
     */
    function getEncryptionAddress(uint256 _encryptionId) external view returns (address) {
        return encryptions[_encryptionId];
    }

    /**
     * @dev Update encryption status
     */
    function closeEncryption(uint256 _encryptionId) external {
        require(msg.sender == encryptionMetadata[_encryptionId].issuer, "Only issuer can close");
        encryptionMetadata[_encryptionId].isActive = false;
    }
}
