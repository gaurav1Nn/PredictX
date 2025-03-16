"use client";

import { useState } from "react";
import { usePredictionMarket } from "@/lib/usePredictionMarket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CreateMarket() {
  const [question, setQuestion] = useState("");
  const [resolutionTime, setResolutionTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { createMarket, marketCount } = usePredictionMarket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !resolutionTime) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const timeInSeconds = Math.floor(Date.now() / 1000) + parseInt(resolutionTime) * 60; // Convert minutes to seconds
      await createMarket(question, BigInt(timeInSeconds), "0x0000000000000000000000000000000000000000"); // Use ETH as default betting asset
      alert("Market created successfully!");
      setQuestion("");
      setResolutionTime("");
    } catch (error) {
      console.error("Failed to create market:", error);
      alert("Failed to create market. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Market</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the prediction question"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resolutionTime">Resolution Time (minutes from now)</Label>
            <Input
              id="resolutionTime"
              type="number"
              value={resolutionTime}
              onChange={(e) => setResolutionTime(e.target.value)}
              placeholder="Enter resolution time in minutes"
              min="1"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Market"}
          </Button>
        </form>
        {marketCount !== undefined && (
          <p className="mt-4">Total Markets: {marketCount.toString()}</p>
        )}
      </CardContent>
    </Card>
  );
}