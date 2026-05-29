import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Space_Grotesk } from "next/font/google";
import { ConnectWalletButton } from "../components/ConnectWalletButton";
import { Providers } from "./providers";
import "./globals.css";

const bodyFont = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const displayFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Cipher - Private Encryption Platform",
  description: "Sealed-bid encryption with privacy-preserving FHE. Powered by Zama.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-white text-slate-900`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <Link href="/" className="group">
                  <div>
                    <div className="font-bold text-lg text-[color:var(--accent-ink)]">Cipher</div>
                    <div className="text-xs text-slate-600">Encrypted Platform</div>
                  </div>
                </Link>
                <nav className="hidden gap-8 text-sm text-slate-600 md:flex">
                  <Link href="/create" className="hover:text-[color:var(--accent-ink)] transition font-medium">Create</Link>
                  <Link href="/demo" className="hover:text-[color:var(--accent-ink)] transition font-medium">Demo</Link>
                  <a href="https://docs.zama.ai" className="hover:text-[color:var(--accent-ink)] transition font-medium">Docs</a>
                </nav>
                <ConnectWalletButton />
              </div>
            </header>

            <main className="flex-1 pt-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {children}
              </div>
            </main>

            <footer className="border-t border-slate-200 bg-slate-50 mt-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Cipher — Encrypted Procurement Platform</p>
                    <p className="text-xs text-slate-500 mt-1">Powered by <span className="font-semibold text-[color:var(--accent-ink)]">Zama FHEVM</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Privacy by Design</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
