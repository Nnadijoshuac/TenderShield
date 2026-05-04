import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Space_Grotesk } from "next/font/google";
import { Shield } from "lucide-react";
import { ConnectWalletButton } from "../components/ConnectWalletButton";
import { Providers } from "./providers";
import "./globals.css";

const bodyFont = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const displayFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "TenderShield",
  description: "Privacy-first procurement powered by Zama FHEVM.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <Providers>
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
            <header className="mb-8 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
              <Link href="/" className="flex items-center gap-3">
                <span className="rounded-2xl bg-sky-400/10 p-2 text-sky-300">
                  <Shield className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-[family-name:var(--font-display)] text-lg font-semibold">TenderShield</div>
                  <div className="text-xs text-slate-400">Confidential procurement powered by Zama FHEVM</div>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <nav className="hidden gap-4 text-sm text-slate-300 md:flex">
                  <Link href="/create">Create Tender</Link>
                  <Link href="/demo">Demo</Link>
                </nav>
                <ConnectWalletButton />
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
