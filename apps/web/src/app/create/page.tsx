import { Plus, Lock, Users, CheckCircle } from "lucide-react";
import { CreateTenderForm } from "../../components/CreateTenderForm";

export default function CreateEncryptionPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-5 h-5 text-[color:var(--accent-ink)]" />
          <span className="text-xs font-semibold text-[color:var(--accent-ink)] uppercase tracking-widest">Start procurement</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">Create a tender</h1>
        <p className="mb-8 text-lg leading-relaxed text-slate-600 sm:text-xl">Collect sealed bids from suppliers. Bids stay encrypted and only the winning result is revealed.</p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <Lock className="w-6 h-6 text-[color:var(--accent-ink)] flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Private Bids</p>
              <p className="text-sm text-slate-600">Suppliers submit encrypted amounts</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <Users className="w-6 h-6 text-[color:var(--accent-ink)] flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Fair Selection</p>
              <p className="text-sm text-slate-600">Smart contract finds winner safely</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <CheckCircle className="w-6 h-6 text-[color:var(--accent-ink)] flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Verifiable</p>
              <p className="text-sm text-slate-600">Cryptographic proof of winner</p>
            </div>
          </div>
        </div>
      </div>

      <CreateTenderForm />
    </div>
  );
}
