// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReverseTender} from "./ReverseTender.sol";

contract TenderFactory {
    error InvalidDeadline();
    error EmptyTitle();

    address[] public tenders;
    mapping(address => address[]) public tendersByIssuer;

    event TenderCreated(address indexed tender, address indexed issuer, string title, uint256 deadline);

    function createTender(
        string calldata title,
        string calldata descriptionURI,
        uint256 deadline,
        uint64 bidBond,
        uint64 maxBudget,
        address token
    ) external returns (address tender) {
        if (deadline <= block.timestamp) revert InvalidDeadline();
        if (bytes(title).length == 0) revert EmptyTitle();

        ReverseTender created = new ReverseTender(msg.sender, title, descriptionURI, deadline, bidBond, maxBudget, token);
        tender = address(created);

        tenders.push(tender);
        tendersByIssuer[msg.sender].push(tender);

        emit TenderCreated(tender, msg.sender, title, deadline);
    }

    function getTenders() external view returns (address[] memory) {
        return tenders;
    }

    function getTendersByIssuer(address issuer) external view returns (address[] memory) {
        return tendersByIssuer[issuer];
    }
}
