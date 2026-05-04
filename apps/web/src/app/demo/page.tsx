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
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <div className="text-xs uppercase tracking-[0.22em] text-emerald-300">Judge-friendly walkthrough</div>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold">TenderShield demo script</h1>
        <div className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <div key={step} className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</div>
              <div className="mt-2 text-slate-200">{step}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Expected reveal</h2>
        <div className="mt-6 space-y-4 text-sm text-slate-300">
          <p>Before reveal: Vendor A encrypted, Vendor B encrypted, Vendor C encrypted.</p>
          <p>After reveal: Winner Vendor B, winning bid 350, losing bids still encrypted.</p>
          <p>This is the key demo point: a normal smart contract cannot compare private numbers without seeing them.</p>
        </div>
      </section>
    </div>
  );
}
