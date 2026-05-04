import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck, Trophy } from "lucide-react";
import { ExplainerPanel } from "../components/ExplainerPanel";

const features = [
  { icon: LockKeyhole, title: "Encrypted supplier bids", body: "Bid amounts are encrypted before they hit the chain." },
  { icon: ShieldCheck, title: "Verifiable winner selection", body: "The contract computes the minimum with FHE comparison and selection." },
  { icon: Trophy, title: "Selective final reveal", body: "Only the winning vendor and winning price are revealed after close." },
];

export default function HomePage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-sky-300">
            Privacy-first procurement
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold leading-tight">TenderShield</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Vendors submit encrypted bids. The contract computes the lowest valid bid. Only the winning result is revealed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 font-medium text-slate-950">
              Create Tender <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/demo" className="rounded-full border border-white/10 px-5 py-3 text-slate-200">
              View Demo Tender
            </Link>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
              <feature.icon className="h-5 w-5 text-sky-300" />
              <div className="mt-3 font-medium">{feature.title}</div>
              <div className="mt-2 text-sm text-slate-400">{feature.body}</div>
            </div>
          ))}
        </div>
      </section>
      <ExplainerPanel />
    </div>
  );
}
