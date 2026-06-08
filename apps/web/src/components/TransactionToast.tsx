export function TransactionToast({ message }: { message?: string }) {
  if (!message) return null;

  return <div role="status" className="mt-4 rounded-xl border border-yellow-300 bg-[color:var(--panel)] px-4 py-3 text-sm font-medium text-slate-700">{message}</div>;
}
