"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { config } from "../lib/wagmi";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
} 