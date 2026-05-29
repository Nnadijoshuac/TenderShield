import Link from "next/link";
import { ArrowRight, Lock, CheckCircle2, Code2 } from "lucide-react";
import { DecorativeBoxes } from "../components/DecorativeBoxes";

export default function HomePage() {
  return (
    <div className="relative space-y-16">
      <DecorativeBoxes pattern="outsideTop" className="opacity-75" />
      <DecorativeBoxes pattern="outsideSide" className="opacity-60" />
      <section className="relative border border-slate-200 bg-white px-8 py-20">
        <DecorativeBoxes pattern="corner" />
        <div className="max-w-3xl">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)] text-sm font-semibold">
              Built on Zama FHEVM
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight text-slate-900">
            Private Encryption
            <br />
            On The Blockchain
          </h1>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
            Cipher uses Zama's fully homomorphic encryption to enable truly private encrypted procurement. Supplier bids stay encrypted. Winner selection happens on encrypted data. Only the winner is revealed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/create" className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[color:var(--accent)] text-[color:var(--accent-ink)] font-semibold transition hover:opacity-90">
              Create Encryption <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link href="/demo" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[color:var(--accent)] text-[color:var(--accent-ink)] font-semibold hover:bg-[color:var(--accent-soft)] transition">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
        {[
          {
            icon: Lock,
            title: "Bid Privacy",
            desc: "All supplier bids encrypted end-to-end. Only winners reveal their amounts."
          },
          {
            icon: CheckCircle2,
            title: "Verifiable Results",
            desc: "Smart contracts prove correct winner was selected using FHE operations."
          },
          {
            icon: Code2,
            title: "FHE Computation",
            desc: "Winner found on encrypted data. Zama FHEVM enables privacy without intermediaries."
          }
        ].map((feature, i) => (
          <div key={i} className="relative border border-slate-200 bg-slate-50 p-6 hover:bg-slate-100 transition">
            <DecorativeBoxes pattern={i % 2 === 0 ? "edge" : "scatter"} className="opacity-45" />
            <feature.icon className="w-8 h-8 text-[color:var(--accent-ink)] mb-4" />
            <h3 className="text-lg font-bold mb-2 text-slate-900">{feature.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      <section className="relative border border-slate-200 bg-slate-50 p-8 sm:p-12">
        <DecorativeBoxes pattern="corner" className="opacity-70" />
        <h2 className="text-3xl font-bold mb-8 text-slate-900">How Cipher Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Create", desc: "Issuer creates encryption round" },
            { step: "2", title: "Encrypt", desc: "Suppliers submit encrypted bids" },
            { step: "3", title: "Compare", desc: "Contract finds min on encrypted data" },
            { step: "4", title: "Reveal", desc: "Winner announced, others stay secret" }
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-ink)] font-bold text-sm">
                  {item.step}
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.desc}</p>
              {i < 3 && <div className="hidden md:block absolute top-5 -right-3 text-slate-300">→</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="relative border border-slate-200 bg-white p-8 sm:p-12">
        <DecorativeBoxes pattern="scatter" className="opacity-65" />
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Why Cipher Matters</h2>
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed">
            Traditional blockchains leak every bid. Competitors see quotes. Prices are driven down. Privacy is impossible.
          </p>
          <p className="text-slate-600 leading-relaxed">
            <strong>Cipher changes this.</strong> Using Zama's fully homomorphic encryption (FHE), we find the lowest bid without ever decrypting it. Losing bids stay encrypted forever. True sealed-bid privacy on-chain.
          </p>
        </div>
      </section>
    </div>
  );
}
