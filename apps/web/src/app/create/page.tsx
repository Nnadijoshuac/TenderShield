import { Plus, Lock, Users, CheckCircle } from "lucide-react";
import { CreateTenderForm } from "../../components/CreateTenderForm";

export default function CreateEncryptionPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Start Procurement</span>
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4">Create a Tender</h1>
        <p className="text-xl text-slate-600 mb-8">Collect sealed bids from suppliers. Bids stay encrypted. Only winners are revealed.</p>

        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="flex gap-3">
            <Lock className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Private Bids</p>
              <p className="text-sm text-slate-600">Suppliers submit encrypted amounts</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Users className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Fair Selection</p>
              <p className="text-sm text-slate-600">Smart contract finds winner safely</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
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
