# Cipher — User Guide

## Overview
Cipher is a confidential procurement dApp where suppliers submit encrypted bids and the contract selects the winner without revealing losing quotes.

---

## **Step 1: Issuer Creates a Tender**

1. Go to `/create`
2. Fill in:
   - **Title:** "Procurement for 50 laptops" (or any title)
   - **Description:** Details about what you're procuring
   - **Deadline:** When bidding closes (e.g., 1 hour from now)
   - **Bond:** Bid bond amount (optional, e.g., 25)
   - **Budget:** Max budget (e.g., 600)
3. Click **"Create Tender"**
4. **You will be automatically redirected** to the tender page

---

## **Step 2: Share Tender URL with Vendors**

The tender page URL is: `https://yourdomain.com/tender/0x[CONTRACT_ADDRESS]`

**Example:**
```
https://cipher-fhe.vercel.app/tender/0x50CDc43A04B7D75b09fC105E058D36175Ec76565
```

Share this link with vendors who want to bid.

---

## **Step 3: Vendors Submit Encrypted Bids**

**As a vendor:**

1. Open the tender URL
2. Click **"Connect vendor wallet"** (MetaMask on Sepolia)
3. Enter your bid amount (e.g., 350)
4. Click **"Submit"**
5. Your bid is encrypted and submitted onchain
6. **Your bid amount is now hidden from everyone**

**Repeat:** Multiple vendors submit bids this way.

---

## **Step 4: Issuer Closes Tender (After Deadline)**

**As the issuer:**

1. Go back to your tender page
2. After the deadline passes, the **"Close Tender"** button becomes active
3. Click **"Close Tender"**
   - The smart contract compares all encrypted bids using FHE
   - Finds the minimum encrypted bid (winner)
4. Button changes to **"Reveal"** → click it
   - Marks the winner result for decryption
5. Click **"Finalize"**
   - Decrypts the result
   - **Shows: Winner address + winning amount**
   - **Losing bids stay encrypted forever**

---

## **Step 5: View Results**

The tender page now shows:
- **Status:** "Revealed"
- **Winner:** Vendor address
- **Winning Bid:** The amount (e.g., 350)
- **Losing Bids:** Shown as addresses, but amounts remain encrypted

---

## **Testing Locally (Single Person)**

Since you're testing alone:

1. Create a tender (as Issuer)
2. Open **two browser windows/tabs**
3. In tab 2:
   - Use a different MetaMask account (import a test account)
   - Go to the tender URL
   - Submit a bid (e.g., 500)
4. In tab 1 (issuer):
   - Wait for deadline, close, reveal, finalize
5. See the winner

---

## **Key Things to Know**

- ✅ **Bids are encrypted** from submission until finalization
- ✅ **Only the winner amount is revealed**
- ✅ **Losing bids stay encrypted** (privacy preserved)
- ✅ **No intermediary needed** — all done on the smart contract
- ✅ **Sepolia testnet** — free test ETH required to submit transactions

---

## **Troubleshooting**

| Problem | Solution |
|---------|----------|
| "Connect wallet" button not working | Make sure MetaMask is on Sepolia testnet |
| Can't submit bid | Make sure you have Sepolia ETH (from faucet) |
| Tender page is blank | Wait 2-3 seconds for page to load; check browser console |
| Can't close tender | Deadline hasn't passed yet; try again later |

---

## **Demo Flow (3 minutes)**

See [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for a scripted walkthrough with timing.

