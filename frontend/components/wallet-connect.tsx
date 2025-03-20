"use client";

import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      await connect({
        connector: metaMask()
      });
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  if (isConnected && address) {
    return (
      <Button
        variant="outline"
        onClick={() => disconnect()}
      >
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}