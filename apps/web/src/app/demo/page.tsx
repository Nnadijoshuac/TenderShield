import { Play, Lock, Check } from "lucide-react";
import { DecorativeBoxes } from "../../components/DecorativeBoxes";

const steps = [
  "Connect issuer wallet and create a new encryption round.",
  "Switch between supplier wallets and submit encrypted bids.",
  "View the bid board — all bids encrypted, no amounts visible.",
  "After deadline, issuer triggers encrypted bid comparison.",
  "System selects minimum using FHE — losing quotes never revealed.",
  "Issuer finalizes — winner announced, other bids stay sealed forever.",
];

export default function DemoPage() {
  return (
    <div className="relative grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <DecorativeBoxes pattern="outsideTop" className="opacity-70" />
      <DecorativeBoxes pattern="outsideSide" className="opacity-55" />
      <section className="relative border border-slate-200 bg-slate-50 p-8">
        <DecorativeBoxes pattern="corner" className="opacity-70" />
        <div className="flex items-center gap-2 mb-4">
          <Play className="w-5 h-5 text-[color:var(--accent-ink)]" />
          <span className="text-xs font-semibold text-[color:var(--accent-ink)] uppercase tracking-widest">Walkthrough</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-8">How Cipher Works</h1>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step} className="relative border border-slate-200 bg-white p-5 hover:bg-slate-100 transition">
              {index % 2 === 0 && <DecorativeBoxes pattern="edge" className="opacity-40" />}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-[color:var(--accent-ink)] font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-slate-700 pt-1">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="relative border border-slate-200 bg-slate-50 p-8">
          <DecorativeBoxes pattern="scatter" className="opacity-60" />
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Example Scenario</h2>
          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-lg bg-white border border-slate-200">
              <div className="text-slate-600 text-xs uppercase font-semibold mb-2">Procurement</div>
              <p className="text-slate-900 font-semibold">50 Laptops</p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-slate-200">
              <div className="text-slate-600 text-xs uppercase font-semibold mb-2">Supplier Bids (Encrypted)</div>
              <div className="text-slate-700">
                <p>• Supplier A: 🔒 encrypted</p>
                <p>• Supplier B: 🔒 encrypted</p>
                <p>• Supplier C: 🔒 encrypted</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-green-900 text-xs uppercase font-semibold mb-2">Result</div>
              <p className="text-green-900 font-semibold">Winner: Supplier B</p>
              <p className="text-slate-600 text-xs mt-2">Losing bids: 🔒 remain encrypted forever</p>
            </div>
          </div>
        </div>

        <div className="relative border border-slate-200 bg-slate-50 p-8">
          <DecorativeBoxes pattern="edge" className="opacity-60" />
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[color:var(--accent-ink)]" />
            Privacy Guarantee
          </h3>
          <ul className="space-y-3 text-sm text-slate-700">
            {[
              "Bids encrypted end-to-end",
              "Comparisons on encrypted data",
              "Only winner revealed",
              "Losing bids stay private forever"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
