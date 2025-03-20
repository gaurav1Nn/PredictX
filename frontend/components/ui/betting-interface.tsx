"use client";

import { useState, useEffect } from "react";
import { usePredictionMarket } from "../../lib/usePredictionMarket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ethers } from "ethers";

export function BettingInterface() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [outcomeIndex, setOutcomeIndex] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { fetchMarkets, placeBet } = usePredictionMarket();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMarket || !outcomeIndex || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const market = markets.find((m) => m.id === parseInt(selectedMarket));
      if (!market) {
        alert("Selected market not found.");
        return;
      }

      const amountInWei = ethers.parseEther(amount);
      await placeBet(
        parseInt(selectedMarket),
        parseInt(outcomeIndex),
        amountInWei.toString(),
        market.bettingAsset
      );
      alert("Bet placed successfully!");
    } catch (error) {
      console.error("Failed to place bet:", error);
      alert("Failed to place bet. See console for details.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place a Bet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="market" className="block text-sm font-medium">
              Select Market
            </label>
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger>
                <SelectValue placeholder="Select a market" />
              </SelectTrigger>
              <SelectContent>
                {markets.map((market) => (
                  <SelectItem key={market.id} value={market.id.toString()}>
                    {market.question}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMarket && (
            <div>
              <label htmlFor="outcome" className="block text-sm font-medium">
                Select Outcome
              </label>
              <Select value={outcomeIndex} onValueChange={setOutcomeIndex}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an outcome" />
                </SelectTrigger>
                <SelectContent>
                  {markets
                    .find((m) => m.id === parseInt(selectedMarket))
                    ?.outcomes?.map((outcome: string, index: number) => (
                      <SelectItem key={index} value={index.toString()}>
                        {outcome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount (in tokens)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <Button type="submit">Place Bet</Button>
        </form>
      </CardContent>
    </Card>
  );
}