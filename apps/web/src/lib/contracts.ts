import { parseAbi } from "viem";

export const tenderFactoryAbi = parseAbi([
  "function createTender(string title, string descriptionURI, uint256 deadline, uint64 bidBond, uint64 maxBudget, address token) returns (address tender)",
  "function getTenders() view returns (address[] memory)",
  "function getTendersByIssuer(address issuer) view returns (address[] memory)",
]);

export const reverseTenderAbi = parseAbi([
  "function issuer() view returns (address)",
  "function title() view returns (string)",
  "function descriptionURI() view returns (string)",
  "function deadline() view returns (uint256)",
  "function bidBond() view returns (uint64)",
  "function maxBudget() view returns (uint64)",
  "function token() view returns (address)",
  "function closed() view returns (bool)",
  "function revealRequested() view returns (bool)",
  "function finalized() view returns (bool)",
  "function bidCount() view returns (uint256)",
  "function winner() view returns (address)",
  "function winningBid() view returns (uint64)",
  "function getBidCount() view returns (uint256)",
  "function getBidderAt(uint256 index) view returns (address)",
  "function getEncryptedResultHandles() view returns (bytes32 lowestBidHandle, bytes32 winnerIndexHandle)",
  "function getMyBidHandle() view returns (bytes32)",
  "function submitBid(uint256 encryptedBid, bytes inputProof)",
  "function closeTender()",
  "function requestReveal()",
  "function finalizeTender(uint64 clearLowestBid, uint64 clearWinnerIndex, bytes decryptionProof)",
  "function claimRefund()",
  "function claimAward()",
  "event BidSubmitted(address indexed bidder, uint256 indexed bidIndex)"
]);
