import { CreateTenderForm } from "../../components/CreateTenderForm";

export default function CreateTenderPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-sky-300">Issuer flow</div>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold">Create a confidential tender</h1>
        <p className="mt-3 text-slate-300">Set the procurement metadata, deadline, bond, and optional budget cap. Bid values remain hidden after submission.</p>
      </div>
      <CreateTenderForm />
    </div>
  );
}
