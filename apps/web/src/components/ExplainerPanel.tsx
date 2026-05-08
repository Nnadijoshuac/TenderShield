export function ExplainerPanel() {
  return (
    <div className="neo-surface rounded-[2.5rem] p-8">
      <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent)]">Why it matters</div>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-[color:var(--copy)]">
        Compare bids
        <br />
        without exposing them.
      </h3>
      <div className="mt-6 space-y-4 text-sm text-[color:var(--muted)]">
        <p>Encrypted in. encrypted compare. selective reveal.</p>
        <p>Losing quotes stay private.</p>
      </div>
    </div>
  );
}
