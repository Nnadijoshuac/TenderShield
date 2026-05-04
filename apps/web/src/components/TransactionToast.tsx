export function TransactionToast({ message }: { message?: string }) {
  if (!message) return null;

  return <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{message}</div>;
}
