const steps = [
  "Connect issuer wallet and create the laptop procurement tender.",
  "Switch between three vendor wallets and submit encrypted bids: 500, 350, and 420.",
  "Show the bid board: every quote is marked encrypted and no plaintext amount appears.",
  "After the deadline, close the tender, request public decrypt for the aggregate result, and finalize.",
  "Reveal only the winner and winning price. Losing bids remain private.",
];

export default function DemoPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <section className="neo-surface rounded-[2.5rem] p-8">
        <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--success)]">Demo</div>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-[color:var(--copy)]">Judge flow</h1>
        <div className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <div key={step} className="neo-surface-soft rounded-[1.75rem] p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Step {index + 1}</div>
              <div className="mt-2 text-[color:var(--copy)]">{step}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="neo-surface rounded-[2.5rem] p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[color:var(--copy)]">Expected reveal</h2>
        <div className="mt-6 space-y-4 text-sm text-[color:var(--muted)]">
          <p>Before: all bids locked.</p>
          <p>After: Vendor B wins at 350.</p>
          <p>Losing quotes stay hidden.</p>
        </div>
      </section>
    </div>
  );
}
