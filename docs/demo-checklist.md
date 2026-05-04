# Demo Checklist

1. Start the local chain and deploy contracts.
2. Export `NEXT_PUBLIC_TENDER_FACTORY_ADDRESS`, `NEXT_PUBLIC_TENDER_TOKEN_ADDRESS`, and `NEXT_PUBLIC_RELAYER_URL`.
3. Open the web app and connect the issuer wallet.
4. Create the tender titled `Procurement for 50 laptops`.
5. Switch between three vendor wallets and submit encrypted bids:
   - Vendor A: `500`
   - Vendor B: `350`
   - Vendor C: `420`
6. Show that the UI lists bidders but never shows plaintext bid values.
7. Advance past the deadline or wait for it to pass.
8. As issuer, click `Close Tender`.
9. Click `Request Reveal`.
10. Click `Finalize Tender`.
11. Show the final result card:
   - Winner: Vendor B
   - Winning bid: 350
12. Show that losing vendors can claim refund and the winner can claim award.
