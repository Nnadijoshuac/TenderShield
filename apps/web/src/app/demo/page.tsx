import { Check, Lock, Play } from "lucide-react";

const steps = [
  "Connect an issuer wallet and create a new tender.",
  "Switch between supplier wallets and submit encrypted bids.",
  "View the bid board - all bids are encrypted and no amounts are visible.",
  "After the deadline, the issuer triggers encrypted bid comparison.",
  "The system selects the minimum using FHE without revealing losing quotes.",
  "The issuer finalizes the result and only the winner is announced.",
];

export default function DemoPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <Play className="h-5 w-5 text-[color:var(--accent-ink)]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--accent-ink)]">Walkthrough</span>
        </div>
        <h1 className="mb-8 text-4xl font-bold text-slate-900">How TenderShield works</h1>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-yellow-300 hover:bg-[color:var(--panel)]">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] text-sm font-bold text-[color:var(--accent-ink)]">
                  {index + 1}
                </div>
                <p className="pt-1 leading-relaxed text-slate-700">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-[color:var(--panel)] p-6 sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Example scenario</h2>
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 text-xs font-semibold uppercase text-slate-500">Procurement</div>
              <p className="font-semibold text-slate-900">50 laptops</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 text-xs font-semibold uppercase text-slate-500">Supplier bids</div>
              <div className="text-slate-700">
                {["Supplier A", "Supplier B", "Supplier C"].map((supplier) => (
                  <p key={supplier} className="flex items-center gap-2 py-1">
                    <Lock className="h-3.5 w-3.5 text-[color:var(--accent-ink)]" />
                    {supplier}: encrypted
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-yellow-300 bg-white p-4">
              <div className="mb-2 text-xs font-semibold uppercase text-[color:var(--accent-ink)]">Result</div>
              <p className="font-semibold text-slate-900">Winner: Supplier B</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                <Lock className="h-3.5 w-3.5" />
                Losing bids remain encrypted forever
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <Lock className="h-4 w-4 text-[color:var(--accent-ink)]" />
            Privacy guarantee
          </h2>
          <ul className="space-y-3 text-sm text-slate-700">
            {["Bids encrypted end-to-end", "Comparisons on encrypted data", "Only the winner revealed", "Losing bids stay private forever"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 flex-shrink-0 text-[color:var(--accent-ink)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
