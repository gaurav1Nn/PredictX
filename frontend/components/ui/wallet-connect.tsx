"use client";

import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Button } from "./button";

export function WalletConnect() {
  const { connect, connectors, error } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <p>Connected as {address}</p>
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <Button key={connector.id} onClick={() => connect({ connector })}>
          Connect with {connector.name}
        </Button>
      ))}
      {error && <p>{error.message}</p>}
    </div>
  );
}