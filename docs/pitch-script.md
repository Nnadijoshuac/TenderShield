# TenderShield Pitch Script

## Opening

Public blockchains are great for transparency, but procurement needs confidentiality. If every supplier quote is public, vendors can copy, undercut, or collude.

## Demo

Here we create a tender. Three suppliers submit bids. Notice the app never shows the bid amounts. They are encrypted before going onchain. The smart contract still compares the encrypted bids using Zama FHEVM. After the deadline, we reveal only the winner and winning price. The losing quotes remain private.

## Why Zama

This is the key: a normal smart contract cannot compare private numbers without seeing them. Zama lets us compute over encrypted values, so the tender is verifiable without leaking sensitive supplier data.

## Closing

TenderShield can become confidential procurement infrastructure for DAOs, NGOs, grant teams, and companies.
