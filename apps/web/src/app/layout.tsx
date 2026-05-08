import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Space_Grotesk } from "next/font/google";
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
            <header className="neo-surface mb-8 flex items-center justify-between rounded-[2rem] px-5 py-4">
              <Link href="/" className="flex items-center gap-3">
                <span className="neo-pill flex h-12 w-12 items-center justify-center rounded-[1.25rem]">
                  <Image src="/TenderShield.png" alt="TenderShield" width={28} height={28} className="h-7 w-7 object-contain" priority />
                </span>
                <div>
                  <div className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--copy)]">TenderShield</div>
                  <div className="text-xs text-[color:var(--muted)]">Confidential procurement</div>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <nav className="hidden gap-2 text-sm text-[color:var(--muted)] md:flex">
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
