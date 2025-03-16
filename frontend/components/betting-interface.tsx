"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePredictionMarket } from "@/lib/usePredictionMarket";
import { parseEther } from "viem";

export const BettingInterface = React.memo(function BettingInterface() {
  console.log("Rendering BettingInterface");
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [outcomeIndex, setOutcomeIndex] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { markets, fetchMarkets, placeBet } = usePredictionMarket();

  useEffect(() => {
    if (markets.length === 0) {
      fetchMarkets();
    }
  }, [fetchMarkets, markets.length]);

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

      const amountInWei = parseEther(amount).toString();
      await placeBet(
        parseInt(selectedMarket),
        parseInt(outcomeIndex),
        amountInWei,
        market.bettingAsset
      );
      alert("Bet placed successfully!");
      setSelectedMarket("");
      setOutcomeIndex("");
      setAmount("");
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
              Amount (in ETH)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              step="0.01"
            />
          </div>

          <Button type="submit" disabled={!selectedMarket || !outcomeIndex || !amount}>
            Place Bet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
});