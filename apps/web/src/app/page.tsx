import Image from "next/image";
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
      <section className="neo-surface rounded-[2.5rem] p-8 sm:p-10">
        <div className="max-w-3xl">
          <div className="neo-pill mb-6 flex h-18 w-18 items-center justify-center rounded-[1.75rem] sm:h-20 sm:w-20">
            <Image src="/TenderShield.png" alt="TenderShield" width={48} height={48} className="h-11 w-11 object-contain sm:h-12 sm:w-12" priority />
          </div>
          <div className="neo-pill mb-4 inline-flex rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
            Privacy-first procurement
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold leading-[0.95] text-[color:var(--copy)] sm:text-6xl">
            Sealed supplier bids.
            <br />
            Clear winner.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)]">
            Encrypt quote amounts. Compute the lowest bid onchain. Reveal only the result.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/create" className="neo-pill inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium text-[color:var(--copy)]">
              Create Tender <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/demo" className="neo-inset rounded-full px-5 py-3 text-[color:var(--muted)]">
              Demo Flow
            </Link>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="neo-surface-soft rounded-[1.75rem] p-5">
              <div className="neo-pill flex h-11 w-11 items-center justify-center rounded-[1rem] text-[color:var(--accent)]">
                <feature.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-medium text-[color:var(--copy)]">{feature.title}</div>
              <div className="mt-2 text-sm text-[color:var(--muted)]">{feature.body}</div>
            </div>
          ))}
        </div>
      </section>
      <ExplainerPanel />
    </div>
  );
}
