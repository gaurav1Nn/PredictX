"use client";

import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnect } from "@/components/wallet-connect";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PredictLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <motion.header
        className="border-b"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href={{
                  pathname: '/',
                  query: { showLanding: 'true' }
                }}
                className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                PredictX
              </Link>
            </motion.div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <WalletConnect />
          </div>
        </div>
      </motion.header>
      {children}
    </div>
  );
} 