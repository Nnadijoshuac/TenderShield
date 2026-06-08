import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, Lock } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Bid Privacy",
    desc: "Supplier bids stay encrypted end-to-end. Only the winning result is revealed.",
  },
  {
    icon: CheckCircle2,
    title: "Verifiable Results",
    desc: "Smart contracts verify that the correct winner was selected with FHE operations.",
  },
  {
    icon: Code2,
    title: "FHE Computation",
    desc: "TenderShield compares encrypted data without exposing confidential quotes.",
  },
];

const steps = [
  { step: "1", title: "Create", desc: "The issuer creates a tender round." },
  { step: "2", title: "Encrypt", desc: "Suppliers submit encrypted bids." },
  { step: "3", title: "Compare", desc: "The contract finds the minimum privately." },
  { step: "4", title: "Reveal", desc: "The winner is announced securely." },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-3xl border border-yellow-200 bg-white px-6 py-16 shadow-[var(--shadow)] sm:px-12 sm:py-20">
        <div className="max-w-4xl">
          <span className="mb-6 inline-flex rounded-full bg-[color:var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-ink)]">
            Built on Zama FHEVM
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-[1.05] text-slate-950 sm:text-6xl lg:text-7xl">
            Private procurement
            <br />
            on the blockchain.
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            TenderShield keeps supplier bids private while smart contracts select a transparent, verifiable winner.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/create" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--accent)] px-6 py-3.5 font-semibold text-[color:var(--accent-ink)] shadow-sm transition hover:bg-[color:var(--accent-hover)]">
              Create a tender
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/demo" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-800 transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--accent-soft)]">
              <feature.icon className="h-6 w-6 text-[color:var(--accent-ink)]" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h2>
            <p className="text-sm leading-relaxed text-slate-600">{feature.desc}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-[color:var(--panel)] p-8 sm:p-12">
        <h2 className="mb-8 text-3xl font-bold text-slate-900">How TenderShield works</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent)] text-sm font-bold text-[color:var(--accent-ink)]">
                {item.step}
              </div>
              <h3 className="mb-1 font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
              {index < steps.length - 1 && <ArrowRight className="absolute -right-3 top-3 hidden h-5 w-5 text-yellow-500 md:block" />}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Why TenderShield matters</h2>
        <div className="max-w-3xl space-y-4 text-slate-600">
          <p className="leading-relaxed">
            Traditional blockchains expose every bid, making confidential procurement difficult.
          </p>
          <p className="leading-relaxed">
            <strong className="text-slate-900">TenderShield changes this.</strong> Zama FHE lets the contract find the lowest bid without decrypting losing quotes. Private bids stay private.
          </p>
        </div>
      </section>
    </div>
  );
}
