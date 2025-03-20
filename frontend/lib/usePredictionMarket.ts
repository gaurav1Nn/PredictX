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
  outcomes?: string[];
  category: string;
  description?: string;
  source?: string;
  volume?: string;
  odds?: {
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
          category: "ai"
        },
        {
          id: 2,
          question: "Will GPT-5 pass the Turing test with 80%+ experts?",
          resolutionTime: BigInt(1767225600), // Dec 31, 2025
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "USDC",
          outcomes: ["Yes", "No"],
          category: "ai"
        },
        {
          id: 3,
          question: "AI regulation bill passes in US Congress by 2025?",
          resolutionTime: BigInt(1767225600), // Dec 31, 2025
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "ZETA",
          outcomes: ["Yes", "No"],
          category: "ai"
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
          category: "pandemic"
        },
        {
          id: 5,
          question: "Hospital wastewater shows new pathogen emergence?",
          resolutionTime: BigInt(1730035200), // Oct 31, 2024
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "USDC",
          outcomes: ["Yes", "No"],
          category: "pandemic"
        },
        {
          id: 6,
          question: "Antimicrobial resistance causes 1M+ deaths in 2025?",
          resolutionTime: BigInt(1767225600), // Dec 31, 2025
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "ZETA",
          outcomes: ["Yes", "No"],
          category: "pandemic"
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
          category: "cyber"
        },
        {
          id: 8,
          question: "Nation-state cyberattack on critical infrastructure?",
          resolutionTime: BigInt(1751328000), // Jun 30, 2025
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "USDC",
          outcomes: ["Yes", "No"],
          category: "cyber"
        },
        {
          id: 9,
          question: "Quantum computing breaks current encryption?",
          resolutionTime: BigInt(1798761600), // Dec 31, 2026
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "ZETA",
          outcomes: ["Yes", "No"],
          category: "cyber"
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
          category: "misinfo"
        },
        {
          id: 11,
          question: "Political leader toppled by deepfake scandal?",
          resolutionTime: BigInt(1743465600), // Mar 31, 2025
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "USDC",
          outcomes: ["Yes", "No"],
          category: "misinfo"
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
//sas/ /   T e s t   c h a n g e  
 