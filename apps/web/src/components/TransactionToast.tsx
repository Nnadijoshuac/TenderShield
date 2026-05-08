export function TransactionToast({ message }: { message?: string }) {
  if (!message) return null;

  return <div className="neo-surface-soft rounded-[1.5rem] px-4 py-3 text-sm text-[color:var(--success)]">{message}</div>;
}
