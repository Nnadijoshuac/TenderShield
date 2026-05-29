export function TransactionToast({ message }: { message?: string }) {
  if (!message) return null;

  return <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-[color:var(--success)]">{message}</div>;
}
