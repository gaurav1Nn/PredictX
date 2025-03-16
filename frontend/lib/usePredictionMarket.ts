"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
}

interface Bet {
  user: string;
  amount: bigint;
  outcomeIndex: bigint;
  token: string;
}

export function usePredictionMarket() {
  console.log("Creating usePredictionMarket instance");
  const { address } = useAccount();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isFetchingMarkets, setIsFetchingMarkets] = useState(false);
  const [isFetchingBets, setIsFetchingBets] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const fetchCountRef = useRef(0);
  const hasFetchedRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  const { data: marketCount, isLoading: marketCountLoading, error: marketCountError } = useReadContract({
    address: predictionMarketAddress,
    abi: predictionMarketABI,
    functionName: "marketCount",
    query: { enabled: !!address && !!predictionMarketAddress },
  });

  const { data: marketsData, isLoading: marketsLoading } = useReadContract({
    address: predictionMarketAddress,
    abi: predictionMarketABI,
    functionName: "markets",
    args: [BigInt(1)], // Start with first market
    query: { enabled: !!marketCount && Number(marketCount) > 0 },
  });

  useEffect(() => {
    if (marketCountError) {
      console.error("Error fetching marketCount:", marketCountError);
    }
  }, [marketCountError]);

  const fetchMarkets = useCallback(async () => {
    if (!marketCount || marketCountLoading || isFetchingMarkets || fetchCountRef.current > 5) {
      console.log("Skipping fetchMarkets due to conditions:", { marketCount, marketCountLoading, isFetchingMarkets, fetchCount: fetchCountRef.current });
      return markets;
    }
    fetchCountRef.current += 1;
    console.log("Fetching markets with count:", marketCount, "Fetch count:", fetchCountRef.current);
    setIsFetchingMarkets(true);
    try {
      const count = Math.min(Number(marketCount) || 0, 5); // Limit to 5 markets to prevent excessive loops
      const marketsData: Market[] = [];

      for (let i = 1; i <= count; i++) {
        try {
          const result = await fetch(`/api/markets/${i}`); // Replace with your actual API endpoint
          const data = await result.json();

          if (data) {
            marketsData.push({
              id: i,
              question: data.question,
              resolutionTime: BigInt(data.resolutionTime),
              resolved: data.resolved,
              winningOutcome: BigInt(data.winningOutcome),
              bettingAsset: data.bettingAsset,
              outcomes: ["Yes", "No"],
            });
          }
        } catch (error) {
          console.error(`Error fetching market ${i}:`, error);
        }
      }
      setMarkets(marketsData);
      console.log("Fetched markets:", marketsData);
      return marketsData;
    } catch (error) {
      console.error("Error in fetchMarkets:", error);
      return markets;
    } finally {
      setIsFetchingMarkets(false);
      fetchCountRef.current -= 1;
    }
  }, [marketCount, marketCountLoading, isFetchingMarkets, markets]);

  const fetchUserBetsData = useCallback(async () => {
    console.log("fetchUserBetsData disabled for debugging");
    return; // Temporarily disable to isolate the issue
  }, []);

  useEffect(() => {
    const now = Date.now();
    const DEBOUNCE_MS = 1000;

    if (now - lastFetchTimeRef.current < DEBOUNCE_MS) {
      console.log("Debouncing fetch, too soon since last fetch");
      return;
    }

    if (
      address &&
      !isFetchingMarkets &&
      !isFetchingBets &&
      !marketCountLoading &&
      fetchCountRef.current === 0 &&
      !hasFetchedRef.current
    ) {
      console.log("Triggering initial fetch for address:", address);
      fetchMarkets().catch((error) => console.error("Initial fetchMarkets failed:", error));
      // fetchUserBetsData().catch((error) => console.error("Initial fetchUserBetsData failed:", error));
      hasFetchedRef.current = true;
      lastFetchTimeRef.current = now;
    } else if (fetchTrigger > 0 && !isFetchingMarkets && !isFetchingBets && fetchCountRef.current === 0) {
      console.log("Triggering refresh fetch due to fetchTrigger:", fetchTrigger);
      fetchMarkets().catch((error) => console.error("Refresh fetchMarkets failed:", error));
      // fetchUserBetsData().catch((error) => console.error("Refresh fetchUserBetsData failed:", error));
      lastFetchTimeRef.current = now;
    }
  }, [address, fetchTrigger, isFetchingMarkets, isFetchingBets, marketCountLoading]);

  const { writeContractAsync: createMarket } = useWriteContract();

  const handleCreateMarket = async (question: string, resolutionTime: bigint, bettingAsset: string) => {
    try {
      console.log("Creating market:", { question, resolutionTime, bettingAsset });
      await createMarket({
        address: predictionMarketAddress,
        abi: predictionMarketABI,
        functionName: "createMarket",
        args: [question, ["Yes", "No"], resolutionTime, bettingAsset],
      });
      setFetchTrigger((prev) => {
        console.log("Incrementing fetchTrigger to:", prev + 1);
        return prev + 1;
      });
    } catch (error: unknown) {
      console.error("Error creating market:", error);
      throw error;
    }
  };

  const { writeContractAsync: placeBet } = useWriteContract();

  const handlePlaceBet = async (
    marketId: number,
    outcomeIndex: number,
    amount: string,
    token: string
  ) => {
    try {
      console.log("Placing bet:", { marketId, outcomeIndex, amount, token });
      await placeBet({
        address: predictionMarketAddress,
        abi: predictionMarketABI,
        functionName: "placeBet",
        args: [BigInt(marketId), BigInt(outcomeIndex), BigInt(amount), token],
        value: token === "0x0000000000000000000000000000000000000000" ? BigInt(amount) : undefined,
      });
      setFetchTrigger((prev) => {
        console.log("Incrementing fetchTrigger to:", prev + 1);
        return prev + 1;
      });
    } catch (error: unknown) {
      console.error("Error placing bet:", error);
      throw error;
    }
  };

  return {
    address,
    markets,
    bets,
    marketCount,
    fetchMarkets,
    createMarket: handleCreateMarket,
    placeBet: handlePlaceBet,
  };
}