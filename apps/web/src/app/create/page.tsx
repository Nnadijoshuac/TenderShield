import { CreateTenderForm } from "../../components/CreateTenderForm";

export default function CreateTenderPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent)]">Issuer</div>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-[color:var(--copy)]">Create tender</h1>
        <p className="mt-3 text-[color:var(--muted)]">Title. deadline. bond. budget.</p>
      </div>
      <CreateTenderForm />
    </div>
  );
}
