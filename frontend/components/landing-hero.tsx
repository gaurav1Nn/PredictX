"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Shield, Microscope } from "lucide-react";

interface LandingHeroProps {
  onConnect: () => void;
}

export function LandingHero({ onConnect }: LandingHeroProps) {
  const featuredMarkets = [
    {
      id: 1,
      question: "Will AGI be achieved by 2030?",
      odds: { yes: 65, no: 35 },
      volume: "$1.2M",
      timeLeft: "280 days",
      icon: Brain,
      category: "AI Safety",
    },
    {
      id: 2,
      question: "Major cloud provider outage in 2024?",
      odds: { yes: 45, no: 55 },
      volume: "$800K",
      timeLeft: "200 days",
      icon: Shield,
      category: "Cyber Threats",
    },
    {
      id: 3,
      question: "New pandemic variant in 2024?",
      odds: { yes: 25, no: 75 },
      volume: "$2.1M",
      timeLeft: "300 days",
      icon: Microscope,
      category: "Pandemic Risks",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-16 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent mb-6">
              Predict Global Risks. Earn Rewards. Shape the Future.
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              The first cross-chain prediction market focused on existential risks and global challenges.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={onConnect}>
                Start Predicting
              </Button>
              <Button size="lg" variant="outline">
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Markets */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Featured Markets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMarkets.map((market) => (
            <Card key={market.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <market.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {market.category}
                  </p>
                  <h3 className="font-semibold mb-4">{market.question}</h3>
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${market.odds.yes}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Yes {market.odds.yes}%</span>
                      <span>No {market.odds.no}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                    <span>Volume: {market.volume}</span>
                    <span>{market.timeLeft} left</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Value Props */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold mb-2">Multi-Asset Betting</h3>
            <p className="text-muted-foreground">
              Bet with ETH, USDC, or ZETA—no bridging needed!
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Sybil-Resistant</h3>
            <p className="text-muted-foreground">
              Stake tokens to prove you're real and earn rewards
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Focus on Real Risks</h3>
            <p className="text-muted-foreground">
              Predict and prepare for global challenges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}