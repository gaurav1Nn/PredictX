"use client";

import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

// Create wagmi config
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    metaMask(),
    injected({
      target: 'metaMask'
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});