import { Plus } from "lucide-react";
import { CreateTenderForm } from "../../components/CreateTenderForm";
import { DecorativeBoxes } from "../../components/DecorativeBoxes";

export default function CreateEncryptionPage() {
  return (
    <div className="relative mx-auto max-w-3xl space-y-8">
      <DecorativeBoxes pattern="outsideTop" className="opacity-70" />
      <DecorativeBoxes pattern="outsideSide" className="opacity-55" />
      <div className="relative border border-slate-200 bg-white p-8">
        <DecorativeBoxes pattern="corner" className="opacity-70" />
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-[color:var(--accent-ink)]" />
          <span className="text-xs font-semibold text-[color:var(--accent-ink)] uppercase tracking-widest">New Encryption</span>
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-3">Create Encrypted Auction</h1>
        <p className="text-slate-600">Start a sealed-bid encryption round. Supplier bids stay encrypted throughout. Only the winner is revealed.</p>
      </div>
      <CreateTenderForm />
    </div>
  );
}
