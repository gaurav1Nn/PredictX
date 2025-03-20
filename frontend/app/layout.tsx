import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "./client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZetaBet - Decentralized Betting Platform",
  description: "Place bets on various markets using ZetaChain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}