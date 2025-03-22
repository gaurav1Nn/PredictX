"use client";

import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { predictionMarketAddress, predictionMarketABI } from "./contracts";

interface Market {
  id: number;
  question: string;
  resolutionTime: bigint;
  resolved: boolean;
  winningOutcome: bigint;
  bettingAsset: string;
  outcomes: string[];
  category: string;
  description: string;
  source: string;
  volume: string;
  odds: {
    yes: number;
    no: number;
  };
}

interface Bet {
  user: string;
  amount: bigint;
  outcomeIndex: bigint;
  token: string;
  marketId: number;
}

export function usePredictionMarket() {
  const { address } = useAccount();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bets, setBets] = useState<Bet[]>([]);

  const { data: marketCount } = useReadContract({
    address: predictionMarketAddress,
    abi: predictionMarketABI,
    functionName: "marketCount",
    query: { enabled: false }
  });

  const { writeContractAsync: createMarket } = useWriteContract();
  const { writeContractAsync: placeBet } = useWriteContract();

  // Simplified fetch markets function
  const fetchMarkets = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const dummyMarkets: Market[] = [
        // AI Safety Markets
        {
          id: 1,
          question: "Will AGI be achieved by 2030?",
          resolutionTime: BigInt(1893456000), // Dec 31, 2030
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "ETH",
          outcomes: ["Yes", "No"],
          category: "ai",
          description: "Will Artificial General Intelligence (AGI) with capabilities matching or exceeding human performance across most economically valuable tasks be achieved by December 31, 2030?",
          source: "Based on publications from leading AI research institutions",
          volume: "1500000",
          odds: { yes: 65, no: 35 }
        },
        {
          id: 2,
          question: "Will GPT-5 pass the Turing test with 80%+ experts?",
          resolutionTime: BigInt(1767225600), // Dec 31, 2025
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "USDC",
          outcomes: ["Yes", "No"],
          category: "ai",
          description: "Will GPT-5 or equivalent LLM convince at least 80% of AI experts it is human in a formal Turing test by December 31, 2025?",
          source: "Based on published academic research and formal testing",
          volume: "2200000",
          odds: { yes: 70, no: 30 }
        },
        {
          id: 3,
          question: "AI regulation bill passes in US Congress by 2025?",
          resolutionTime: BigInt(1767225600), // Dec 31, 2025
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "ZETA",
          outcomes: ["Yes", "No"],
          category: "ai",
          description: "Will the US Congress pass comprehensive AI regulation legislation by December 31, 2025?",
          source: "Based on official Congressional records and voting",
          volume: "1400000",
          odds: { yes: 45, no: 55 }
        },
        
        // Pandemic Risk Markets
        {
          id: 4,
          question: "New pandemic variant in 2024?",
          resolutionTime: BigInt(1735689600), // Dec 31, 2024
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "ETH",
          outcomes: ["Yes", "No"],
          category: "pandemic",
          description: "Will a new viral variant cause >100,000 excess deaths globally before December 31, 2024?",
          source: "Based on WHO official declarations and public health monitoring",
          volume: "2100000",
          odds: { yes: 25, no: 75 }
        },
        {
          id: 5,
          question: "Hospital wastewater shows new pathogen emergence?",
          resolutionTime: BigInt(1730035200), // Oct 31, 2024
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "USDC",
          outcomes: ["Yes", "No"],
          category: "pandemic",
          description: "Will wastewater surveillance from major hospitals detect a novel pathogen of concern before October 31, 2024?",
          source: "Verified by CDC and global public health authorities",
          volume: "1300000",
          odds: { yes: 30, no: 70 }
        },
        {
          id: 6,
          question: "Antimicrobial resistance causes 1M+ deaths in 2025?",
          resolutionTime: BigInt(1767225600), // Dec 31, 2025
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "ZETA",
          outcomes: ["Yes", "No"],
          category: "pandemic",
          description: "Will antimicrobial resistance (AMR) cause more than 1 million directly attributable deaths globally in 2025?",
          source: "Based on WHO and CDC official reports",
          volume: "1600000",
          odds: { yes: 40, no: 60 }
        },
        
        // Cyber Threats Markets
        {
          id: 7,
          question: "Major cloud provider outage in 2024?",
          resolutionTime: BigInt(1735689600), // Dec 31, 2024
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "ETH",
          outcomes: ["Yes", "No"],
          category: "cyber",
          description: "Will any of the top 3 cloud providers (AWS, Azure, GCP) experience a global outage lasting >4 hours before Dec 31, 2024?",
          source: "Verified by independent monitoring services",
          volume: "800000",
          odds: { yes: 45, no: 55 }
        },
        {
          id: 8,
          question: "Nation-state cyberattack on critical infrastructure?",
          resolutionTime: BigInt(1751328000), // Jun 30, 2025
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "USDC",
          outcomes: ["Yes", "No"],
          category: "cyber",
          description: "Will a confirmed nation-state cyberattack cause disruption to critical infrastructure (power grid, water, etc.) for >24 hours in a G20 country before June 30, 2025?",
          source: "Based on official government attributions and security firm analysis",
          volume: "1800000",
          odds: { yes: 55, no: 45 }
        },
        {
          id: 9,
          question: "Quantum computing breaks current encryption?",
          resolutionTime: BigInt(1798761600), // Dec 31, 2026
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "ZETA",
          outcomes: ["Yes", "No"],
          category: "cyber",
          description: "Will a quantum computer successfully break RSA-2048 or equivalent encryption before December 31, 2026?",
          source: "Based on academic publications and government announcements",
          volume: "1700000",
          odds: { yes: 15, no: 85 }
        },
        
        // Misinformation Markets
        {
          id: 10,
          question: "Deepfake video causes major market disruption?",
          resolutionTime: BigInt(1735689600), // Dec 31, 2024
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "ETH",
          outcomes: ["Yes", "No"],
          category: "misinfo",
          description: "Will a synthetic/AI-generated media cause a >3% single-day drop in a major stock index before Dec 31, 2024?",
          source: "Verified by market data and media analysis reports",
          volume: "1200000",
          odds: { yes: 40, no: 60 }
        },
        {
          id: 11,
          question: "Political leader toppled by deepfake scandal?",
          resolutionTime: BigInt(1743465600), // Mar 31, 2025
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "USDC",
          outcomes: ["Yes", "No"],
          category: "misinfo",
          description: "Will a head of state or government resign or be removed from office due to a deepfake-related scandal before March 31, 2025?",
          source: "Verified by multiple international news sources",
          volume: "950000",
          odds: { yes: 35, no: 65 }
        }
      ];
      
      setMarkets(dummyMarkets);
      
      // Add dummy bets data
      const dummyBets: Bet[] = [
        // AI category bets
        {
          user: address || "0x0",
          amount: BigInt(1000000000000000000), // 1 ETH
          outcomeIndex: BigInt(0),
          token: "0x0000000000000000000000000000000000000000",
          marketId: 1
        },
        {
          user: address || "0x0",
          amount: BigInt(750000000000000000), // 0.75 ETH
          outcomeIndex: BigInt(1),
          token: "0x0000000000000000000000000000000000000000",
          marketId: 2
        },
        
        // Pandemic category bets
        {
          user: address || "0x0",
          amount: BigInt(500000000000000000), // 0.5 ETH
          outcomeIndex: BigInt(0),
          token: "0x0000000000000000000000000000000000000000",
          marketId: 4
        },
        {
          user: address || "0x0",
          amount: BigInt(250000000000000000), // 0.25 ETH
          outcomeIndex: BigInt(1),
          token: "0x0000000000000000000000000000000000000000",
          marketId: 5
        },
        
        // Cyber category bets
        {
          user: address || "0x0",
          amount: BigInt(1500000000000000000), // 1.5 ETH
          outcomeIndex: BigInt(0),
          token: "0x0000000000000000000000000000000000000000",
          marketId: 7
        },
        {
          user: address || "0x0",
          amount: BigInt(2000000000000000000), // 2 ETH
          outcomeIndex: BigInt(1),
          token: "0x0000000000000000000000000000000000000000",
          marketId: 9
        }
      ];
      setBets(dummyBets);
    } catch (error) {
      console.error("Error fetching markets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch markets on mount
  useEffect(() => {
    fetchMarkets();
  }, []);

  const handleCreateMarket = async (
    question: string,
    resolutionTime: bigint,
    bettingAsset: string
  ) => {
    try {
      await createMarket({
        address: predictionMarketAddress,
        abi: predictionMarketABI,
        functionName: "createMarket",
        args: [question, ["Yes", "No"], resolutionTime, bettingAsset]
      });
      await fetchMarkets();
    } catch (error) {
      console.error("Error creating market:", error);
      throw error;
    }
  };

  const handlePlaceBet = async (
    marketId: number,
    outcomeIndex: number,
    amount: string,
    token: string
  ) => {
    try {
      await placeBet({
        address: predictionMarketAddress,
        abi: predictionMarketABI,
        functionName: "placeBet",
        args: [BigInt(marketId), BigInt(outcomeIndex), BigInt(amount), token],
        value: token === "0x0000000000000000000000000000000000000000" ? BigInt(amount) : undefined
      });
      await fetchMarkets();
    } catch (error) {
      console.error("Error placing bet:", error);
      throw error;
    }
  };

  return {
    address,
    markets,
    isLoading,
    bets,
    createMarket: handleCreateMarket,
    placeBet: handlePlaceBet
  };
}
