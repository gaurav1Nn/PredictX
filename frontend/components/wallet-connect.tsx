"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { motion, AnimatePresence } from "framer-motion";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, isPending, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect({
        connector: metaMask()
      });
      // Do not navigate after connecting from the wallet connect button
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isConnected && address ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={handleDisconnect}
            className="border-gradient relative overflow-hidden"
          >
            <span className="relative z-10">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </span>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleConnect}
            disabled={isPending || isConnecting}
            className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white relative overflow-hidden"
          >
            {isPending || isConnecting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              <span className="relative z-10">Connect Wallet</span>
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}