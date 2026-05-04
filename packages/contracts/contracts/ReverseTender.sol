// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, ebool, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract ReverseTender is ZamaEthereumConfig {
    error NotIssuer();
    error TenderClosedAlready();
    error TenderStillOpen();
    error DeadlinePassed();
    error DeadlineNotPassed();
    error AlreadyBid();
    error NoBids();
    error InvalidDeadline();
    error NotFinalized();
    error AlreadyClaimed();
    error NotWinner();
    error WinnerCannotRefund();
    error RevealNotRequested();
    error InvalidWinnerIndex();
    error EmptyTitle();
    error BidNotFound();
    error AlreadyFinalized();

    struct Bid {
        address bidder;
        euint64 amount;
        bool exists;
    }

    address public immutable issuer;
    string public title;
    string public descriptionURI;
    uint256 public deadline;
    uint64 public bidBond;
    uint64 public maxBudget;
    address public token;
    bool public closed;
    bool public revealRequested;
    bool public finalized;
    uint256 public bidCount;
    mapping(address => uint256) public bidderIndexPlusOne;
    Bid[] private bids;
    euint64 private encryptedLowestBid;
    euint64 private encryptedWinnerIndex;
    address public winner;
    uint64 public winningBid;
    mapping(address => bool) public hasClaimedRefund;
    mapping(address => bool) public hasClaimedAward;

    event BidSubmitted(address indexed bidder, uint256 indexed bidIndex);
    event TenderClosed(uint256 bidCount);
    event RevealRequested(bytes32 lowestBidHandle, bytes32 winnerIndexHandle);
    event TenderFinalized(address indexed winner, uint64 winningBid, uint256 winnerIndex);
    event RefundClaimed(address indexed bidder);
    event AwardClaimed(address indexed winner);

    modifier onlyIssuer() {
        if (msg.sender != issuer) revert NotIssuer();
        _;
    }

    modifier beforeDeadline() {
        if (block.timestamp >= deadline) revert DeadlinePassed();
        _;
    }

    modifier afterDeadline() {
        if (block.timestamp < deadline) revert DeadlineNotPassed();
        _;
    }

    modifier notClosed() {
        if (closed) revert TenderClosedAlready();
        _;
    }

    modifier isClosed() {
        if (!closed) revert TenderStillOpen();
        _;
    }

    modifier notFinalized() {
        if (finalized) revert AlreadyFinalized();
        _;
    }

    constructor(
        address issuer_,
        string memory title_,
        string memory descriptionURI_,
        uint256 deadline_,
        uint64 bidBond_,
        uint64 maxBudget_,
        address token_
    ) {
        if (issuer_ == address(0)) revert NotIssuer();
        if (bytes(title_).length == 0) revert EmptyTitle();
        if (deadline_ <= block.timestamp) revert InvalidDeadline();

        issuer = issuer_;
        title = title_;
        descriptionURI = descriptionURI_;
        deadline = deadline_;
        bidBond = bidBond_;
        maxBudget = maxBudget_;
        token = token_;
    }

    function submitBid(externalEuint64 encryptedBid, bytes calldata inputProof) external beforeDeadline notClosed {
        if (bidderIndexPlusOne[msg.sender] != 0) revert AlreadyBid();

        // Convert the relayer-produced encrypted input into a contract-owned euint64 handle.
        euint64 bidAmount = FHE.fromExternal(encryptedBid, inputProof);

        bids.push(Bid({bidder: msg.sender, amount: bidAmount, exists: true}));
        bidderIndexPlusOne[msg.sender] = bids.length;
        bidCount = bids.length;

        // The contract must retain ACL permissions so it can compare this bid later on close.
        FHE.allowThis(bids[bids.length - 1].amount);
        // The bidder may later request a user decrypt flow for their own bid handle if the UI supports it.
        FHE.allow(bids[bids.length - 1].amount, msg.sender);

        emit BidSubmitted(msg.sender, bids.length - 1);
    }

    function closeTender() external onlyIssuer afterDeadline notClosed {
        uint256 length = bids.length;
        if (length == 0) revert NoBids();

        encryptedLowestBid = bids[0].amount;
        encryptedWinnerIndex = FHE.asEuint64(0);

        for (uint256 i = 1; i < length; ++i) {
            // FHE booleans cannot drive Solidity branches; select() keeps the comparison encrypted.
            ebool isLower = FHE.lt(bids[i].amount, encryptedLowestBid);
            encryptedLowestBid = FHE.select(isLower, bids[i].amount, encryptedLowestBid);
            encryptedWinnerIndex = FHE.select(isLower, FHE.asEuint64(uint64(i)), encryptedWinnerIndex);
        }

        FHE.allowThis(encryptedLowestBid);
        FHE.allowThis(encryptedWinnerIndex);
        FHE.allow(encryptedLowestBid, issuer);
        FHE.allow(encryptedWinnerIndex, issuer);

        closed = true;
        emit TenderClosed(length);
    }

    function requestReveal() external onlyIssuer isClosed {
        if (revealRequested) revert TenderClosedAlready();

        // Only the aggregate result becomes publicly decryptable; losing bids remain encrypted.
        FHE.makePubliclyDecryptable(encryptedLowestBid);
        FHE.makePubliclyDecryptable(encryptedWinnerIndex);
        revealRequested = true;

        emit RevealRequested(euint64.unwrap(encryptedLowestBid), euint64.unwrap(encryptedWinnerIndex));
    }

    function finalizeTender(
        uint64 clearLowestBid,
        uint64 clearWinnerIndex,
        bytes calldata decryptionProof
    ) external onlyIssuer isClosed notFinalized {
        if (!revealRequested) revert RevealNotRequested();
        if (clearWinnerIndex >= bids.length) revert InvalidWinnerIndex();

        bytes32[] memory handles = new bytes32[](2);
        handles[0] = euint64.unwrap(encryptedLowestBid);
        handles[1] = euint64.unwrap(encryptedWinnerIndex);

        // The decryption proof ties the cleartexts to the publicly decryptable result handles.
        FHE.checkSignatures(handles, abi.encode(uint256(clearLowestBid), uint256(clearWinnerIndex)), decryptionProof);

        winner = bids[clearWinnerIndex].bidder;
        winningBid = clearLowestBid;
        finalized = true;

        emit TenderFinalized(winner, clearLowestBid, clearWinnerIndex);
    }

    function getBidCount() external view returns (uint256) {
        return bids.length;
    }

    function getBidderAt(uint256 index) external view returns (address) {
        return bids[index].bidder;
    }

    function getEncryptedResultHandles() external view isClosed returns (euint64 lowestBidHandle, euint64 winnerIndexHandle) {
        return (encryptedLowestBid, encryptedWinnerIndex);
    }

    function getMyBidHandle() external view returns (euint64) {
        uint256 indexPlusOne = bidderIndexPlusOne[msg.sender];
        if (indexPlusOne == 0) revert BidNotFound();
        return bids[indexPlusOne - 1].amount;
    }

    function claimRefund() external {
        if (!finalized) revert NotFinalized();
        if (msg.sender == winner) revert WinnerCannotRefund();
        if (bidderIndexPlusOne[msg.sender] == 0) revert BidNotFound();
        if (hasClaimedRefund[msg.sender]) revert AlreadyClaimed();

        hasClaimedRefund[msg.sender] = true;
        emit RefundClaimed(msg.sender);
    }

    function claimAward() external {
        if (!finalized) revert NotFinalized();
        if (msg.sender != winner) revert NotWinner();
        if (hasClaimedAward[msg.sender]) revert AlreadyClaimed();

        hasClaimedAward[msg.sender] = true;
        emit AwardClaimed(msg.sender);
    }
}
