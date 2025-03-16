"use client";

import { useEffect, useState } from "react";
import { usePredictionMarket } from "../../lib/usePredictionMarket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MarketsList() {
  const [markets, setMarkets] = useState<any[]>([]);
  const { fetchMarkets } = usePredictionMarket();

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const marketsData = await fetchMarkets();
        setMarkets(marketsData);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
      }
    };
    loadMarkets();
  }, [fetchMarkets]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Active Markets</h2>
      {markets.length === 0 ? (
        <p>No markets available.</p>
      ) : (
        markets.map((market) => (
          <Card key={market.id}>
            <CardHeader>
              <CardTitle>Market {market.id}: {market.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Outcomes: {market.outcomes?.join(", ") || "Loading..."}</p>
              <p>Resolution Time: {new Date(Number(market.resolutionTime) * 1000).toLocaleString()}</p>
              <p>Betting Asset: {market.bettingAsset}</p>
              <p>Resolved: {market.resolved ? "Yes" : "No"}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}