import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Space_Grotesk } from "next/font/google";
import { ConnectWalletButton } from "../components/ConnectWalletButton";
import "./globals.css";
import { Providers } from "./providers";



const bodyFont = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const displayFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "TenderShield - Private Procurement",
  description: "Sealed-bid encryption with privacy-preserving FHE. Powered by Zama.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-white text-slate-900`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="group">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent)] font-bold text-[color:var(--accent-ink)] shadow-sm">
                      TS
                    </div>
                    <div>
                      <div className="font-bold text-lg leading-none text-slate-950">TenderShield</div>
                      <div className="mt-1 text-xs text-slate-500">Private procurement</div>
                    </div>
                  </div>
                </Link>
                <nav className="order-3 flex w-full items-center justify-center gap-6 border-t border-slate-100 pt-3 text-sm font-medium text-slate-600 md:order-2 md:w-auto md:border-0 md:pt-0">
                  <Link href="/dashboard" className="transition hover:text-slate-950">Dashboard</Link>
                  <Link href="/create" className="transition hover:text-slate-950">Create</Link>
                  <Link href="/demo" className="transition hover:text-slate-950">Demo</Link>
                </nav>
                <div className="order-2 md:order-3">
                  <ConnectWalletButton />
                </div>
              </div>
            </header>

            <main className="flex-1 pt-32 md:pt-20">
              <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                {children}
              </div>
            </main>

            <footer className="mt-20 border-t border-slate-200 bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">TenderShield</p>
                    <p className="text-xs text-slate-500 mt-1">Powered by <span className="font-semibold text-[color:var(--accent-ink)]">Zama FHEVM</span></p>
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
