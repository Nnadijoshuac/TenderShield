export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-20">
      <div className="px-4 py-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600">
        <p className="font-medium">Cipher — Encrypted Procurement Platform</p>
        <p>Powered by <span className="font-semibold text-[color:var(--accent-ink)]">Zama FHEVM</span></p>
      </div>
    </footer>
  );
}
