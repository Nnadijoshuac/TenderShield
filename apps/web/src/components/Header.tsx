import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between py-4 px-4">
        <Link href="/" className="group">
          <span className="text-lg font-bold text-[color:var(--accent-ink)] transition group-hover:opacity-80">Cipher</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-slate-600 hover:text-[color:var(--accent-ink)] transition text-sm font-medium">Home</Link>
          <Link href="/create" className="text-slate-600 hover:text-[color:var(--accent-ink)] transition text-sm font-medium">Create</Link>
          <Link href="/demo" className="text-slate-600 hover:text-[color:var(--accent-ink)] transition text-sm font-medium">Demo</Link>
        </nav>
      </div>
    </header>
  );
}
