"use client";

import { useState } from "react";
import { usePredictionMarket } from "@/lib/usePredictionMarket";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Shield, Microscope, AlertTriangle } from "lucide-react";

export function CreateMarket() {
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [resolutionCriteria, setResolutionCriteria] = useState("");
  const [resolutionDate, setResolutionDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { createMarket, marketCount } = usePredictionMarket();

  const categories = [
    { id: "ai", name: "AI Safety", icon: Brain },
    { id: "cyber", name: "Cyber Threats", icon: Shield },
    { id: "pandemic", name: "Pandemic Risks", icon: Microscope },
    { id: "misinfo", name: "Misinformation", icon: AlertTriangle },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !category || !resolutionDate) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Convert resolution date to Unix timestamp (in seconds)
      const resolutionTime = Math.floor(new Date(resolutionDate).getTime() / 1000);
      // Use ETH as the default betting asset
      const bettingAsset = "0x0000000000000000000000000000000000000000";
      await createMarket(question, BigInt(resolutionTime), bettingAsset);
      alert("Market created successfully!");
      setQuestion("");
      setCategory("");
      setResolutionCriteria("");
      setResolutionDate("");
    } catch (error: unknown) {
      console.error("Failed to create market:", error);
      alert("Failed to create market. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create a New Market</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Question *</Label>
          <Input
            placeholder="Will [X event] happen by [date]?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <p className="text-sm text-muted-foreground">
            Make it specific and verifiable
          </p>
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <cat.icon className="h-4 w-4" />
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Resolution Criteria</Label>
          <Textarea
            placeholder="Describe how this market will be resolved (e.g., specific data source, threshold for YES/NO)"
            value={resolutionCriteria}
            onChange={(e) => setResolutionCriteria(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Resolution Date *</Label>
          <Input
            type="date"
            value={resolutionDate}
            onChange={(e) => setResolutionDate(e.target.value)}
            required
          />
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Market Creation Requirements</h3>
          <p className="text-sm text-muted-foreground">
            You need to stake 100 ZETA to create this market. This stake will be:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Returned if the market is approved</li>
            <li>• Slashed if the market is deemed invalid</li>
          </ul>
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Market (Stake 100 ZETA)"}
        </Button>
      </form>

      {/* Add marketCount display with fallback */}
      {marketCount !== undefined ? (
        <p className="mt-4 text-center">Total Markets: {marketCount.toString()}</p>
      ) : (
        <p className="mt-4 text-center text-muted-foreground">Loading market count...</p>
      )}
    </Card>
  );
}