"use client";

import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

export function WalletConnect() {
  const { connect, connectors, error } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
        <Button variant="destructive" onClick={() => disconnect()}>Disconnect</Button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <Button key={connector.id} onClick={() => connect({ connector })}>
          Connect Wallet
        </Button>
      ))}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}