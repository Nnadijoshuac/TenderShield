export function ExplainerPanel() {
  return (
    <div className="rounded-[2rem] border border-sky-400/20 bg-sky-400/8 p-6">
      <div className="text-xs uppercase tracking-[0.22em] text-sky-300">Why Zama</div>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">Encrypted comparison, not just hidden storage</h3>
      <div className="mt-4 space-y-3 text-sm text-slate-300">
        <p>Vendors encrypt bids before sending them onchain.</p>
        <p>The contract computes the minimum with `FHE.lt` and `FHE.select`, so no plaintext quotes are exposed.</p>
        <p>Only the winner and winning price are revealed after close. Losing bids remain encrypted.</p>
      </div>
    </div>
  );
}
