"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, Microscope, AlertTriangle, Zap, Info, Users, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePredictionMarket } from "@/lib/usePredictionMarket";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", name: "All Markets", icon: null, color: "from-gray-500 to-gray-600" },
  { id: "pandemic", name: "Pandemic Risks", icon: Microscope, color: "from-emerald-500 to-teal-500", 
    description: "Markets forecasting pandemic risks based on wastewater monitoring and air quality sensors" },
  { id: "ai", name: "AI Safety", icon: Brain, color: "from-blue-500 to-indigo-500",
    description: "Evaluating scenarios like time to AGI and likelihood of AI disempowerment" },
  { id: "cyber", name: "Cyber Threats", icon: Shield, color: "from-purple-500 to-pink-500",
    description: "Assessing probability of significant outages or large-scale hacks" },
  { id: "misinfo", name: "Misinformation", icon: AlertTriangle, color: "from-orange-500 to-red-500",
    description: "Analyzing claims by public figures to gauge information integrity" },
];

// Sample markets to display when no real markets are available
const SAMPLE_MARKETS = [
  {
    id: 1,
    question: "Will AGI be achieved by 2030?",
    outcomes: ["Yes", "No"],
    category: "ai",
    odds: { yes: 65, no: 35 },
    volume: "1500000",
    resolutionTime: (new Date('2030-01-01').getTime() / 1000).toString(),
    resolved: false,
    bettingAsset: "ETH",
    description: "Will Artificial General Intelligence (AGI) with capabilities matching or exceeding human performance across most economically valuable tasks be achieved by December 31, 2030?",
    source: "Based on publications from leading AI research institutions"
  },
  {
    id: 2,
    question: "Major cloud provider outage in 2024?",
    outcomes: ["Yes", "No"],
    category: "cyber",
    odds: { yes: 45, no: 55 },
    volume: "800000",
    resolutionTime: (new Date('2024-12-31').getTime() / 1000).toString(),
    resolved: false,
    bettingAsset: "USDC",
    description: "Will any of the top 3 cloud providers (AWS, Azure, GCP) experience a global outage lasting >4 hours before Dec 31, 2024?",
    source: "Verified by independent monitoring services"
  },
  {
    id: 3,
    question: "New pandemic variant in 2024?",
    outcomes: ["Yes", "No"],
    category: "pandemic",
    odds: { yes: 25, no: 75 },
    volume: "2100000",
    resolutionTime: (new Date('2024-12-31').getTime() / 1000).toString(),
    resolved: false,
    bettingAsset: "ZETA",
    description: "Will a new viral variant cause >100,000 excess deaths globally before December 31, 2024?",
    source: "Based on WHO official declarations and public health monitoring"
  },
  {
    id: 4,
    question: "Deepfake video causes major market disruption?",
    outcomes: ["Yes", "No"],
    category: "misinfo",
    odds: { yes: 40, no: 60 },
    volume: "1200000",
    resolutionTime: (new Date('2024-12-31').getTime() / 1000).toString(),
    resolved: false,
    bettingAsset: "ETH",
    description: "Will a synthetic/AI-generated media cause a >3% single-day drop in a major stock index before Dec 31, 2024?",
    source: "Verified by market data and media analysis reports"
  },
  {
    id: 5,
    question: "Nation-state cyberattack on critical infrastructure?",
    outcomes: ["Yes", "No"],
    category: "cyber",
    odds: { yes: 55, no: 45 },
    volume: "1800000",
    resolutionTime: (new Date('2025-06-30').getTime() / 1000).toString(),
    resolved: false,
    bettingAsset: "USDC",
    description: "Will a confirmed nation-state cyberattack cause disruption to critical infrastructure (power grid, water, etc.) for >24 hours in a G20 country before June 30, 2025?",
    source: "Based on official government attributions and security firm analysis"
  },
  // Adding more markets for each category
  {
    id: 6,
    question: "Hospital wastewater shows new pathogen emergence?",
    outcomes: ["Yes", "No"],
    category: "pandemic",
    odds: { yes: 30, no: 70 },
    volume: "1300000",
    resolutionTime: (new Date('2024-10-31').getTime() / 1000).toString(),
    resolved: false,
    bettingAsset: "ETH",
    description: "Will wastewater surveillance from major hospitals detect a novel pathogen of concern before October 31, 2024?",
    source: "Verified by CDC and global public health authorities"
  },
  {
    id: 7,
    question: "Will GPT-5 pass the Turing test with 80%+ experts?",
    outcomes: ["Yes", "No"],
    category: "ai",
    odds: { yes: 70, no: 30 },
    volume: "2200000",
    resolutionTime: (new Date('2025-12-31').getTime() / 1000).toString(),
    resolved: false,
    bettingAsset: "USDC",
    description: "Will GPT-5 or equivalent LLM convince at least 80% of AI experts it is human in a formal Turing test by December 31, 2025?",
    source: "Based on published academic research and formal testing"
  },
  {
    id: 8,
    question: "Quantum computing breaks current encryption?",
    outcomes: ["Yes", "No"],
    category: "cyber",
    odds: { yes: 15, no: 85 },
    volume: "1700000",
    resolutionTime: (new Date('2026-12-31').getTime() / 1000).toString(),
    resolved: false,
    bettingAsset: "ZETA",
    description: "Will a quantum computer successfully break RSA-2048 or equivalent encryption before December 31, 2026?",
    source: "Based on academic publications and government announcements"
  },
  {
    id: 9,
    question: "Political leader toppled by deepfake scandal?",
    outcomes: ["Yes", "No"],
    category: "misinfo",
    odds: { yes: 35, no: 65 },
    volume: "950000",
    resolutionTime: (new Date('2025-03-31').getTime() / 1000).toString(),
    resolved: false,
    bettingAsset: "ETH",
    description: "Will a head of state or government resign or be removed from office due to a deepfake-related scandal before March 31, 2025?",
    source: "Verified by multiple international news sources"
  },
  {
    id: 10,
    question: "Antimicrobial resistance causes 1M+ deaths in 2025?",
    outcomes: ["Yes", "No"],
    category: "pandemic",
    odds: { yes: 40, no: 60 },
    volume: "1600000",
    resolutionTime: (new Date('2025-12-31').getTime() / 1000).toString(),
    resolved: false,
    bettingAsset: "USDC",
    description: "Will antimicrobial resistance (AMR) cause more than 1 million directly attributable deaths globally in 2025?",
    source: "Based on WHO and CDC official reports"
  }
];

export const MarketsList = React.memo(function MarketsList() {
  console.log("Rendering MarketsList");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedMarket, setExpandedMarket] = useState<number | null>(null);
  const { markets: fetchedMarkets, isLoading } = usePredictionMarket();

  // Always use the fetched markets from the usePredictionMarket hook
  // as it now returns dummy data when no real markets are available
  const allMarkets = fetchedMarkets;

  // Process markets to ensure they have all required properties
  const markets = allMarkets.map((market) => {
    // Convert bigint values to strings for display
    const resolutionTime = typeof market.resolutionTime === 'bigint' 
      ? market.resolutionTime.toString() 
      : market.resolutionTime;
    
    // Set default odds if not provided
    const odds = market.odds || { 
      yes: Math.floor(Math.random() * 70) + 30, 
      no: 0 
    };
    
    // Ensure odds always add up to 100%
    if (!odds.no) {
      odds.no = 100 - odds.yes;
    }
    
    // Set default volume if not provided
    const volume = market.volume || Math.floor(Math.random() * 2000000 + 500000).toString();
    
    // Format descriptions for display
    const description = market.description || `Prediction market for ${market.question}`;
    
    // Format sources if not available
    const source = market.source || "Based on reliable market data and expert analysis";
    
    return { 
      ...market, 
      resolutionTime,
      odds,
      volume,
      description,
      source
    };
  });

  const filteredMarkets = markets
    .filter((market) => selectedCategory === "all" || market.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category?.icon || null;
  };

  const formatVolume = (volume: string) => {
    const num = parseInt(volume);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num}`;
  };

  const handleMarketClick = (marketId: number) => {
    setExpandedMarket(expandedMarket === marketId ? null : marketId);
  };

  if (isLoading) {
    return (
      <motion.div 
        className="flex justify-center items-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Loading markets...</p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Active Markets</h2>
          <p className="text-muted-foreground">Predict global risks and earn rewards</p>
        </div>
        <Badge variant="secondary" className="text-base px-4 py-1 self-start md:self-auto">
          {filteredMarkets.length} Markets
        </Badge>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              selectedCategory === category.id
                ? "bg-gradient-to-r text-white shadow-md " + category.color
                : "bg-muted hover:bg-muted/80"
            )}
            title={category.description}
          >
            {category.icon && <category.icon className="h-4 w-4" />}
            <span className="whitespace-nowrap">{category.name}</span>
          </motion.button>
        ))}
      </div>

      {selectedCategory !== "all" && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-lg bg-muted/30 border border-muted"
        >
          <div className="flex items-start gap-2">
            {getCategoryIcon(selectedCategory) && React.createElement(getCategoryIcon(selectedCategory)!, { className: "h-5 w-5 mt-0.5" })}
            <div>
              <h3 className="font-medium">{CATEGORIES.find(c => c.id === selectedCategory)?.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {CATEGORIES.find(c => c.id === selectedCategory)?.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <div className="grid gap-4">
          {filteredMarkets.map((market) => (
            <motion.div
              key={market.id}
              variants={itemVariants}
              className="overflow-hidden"
              layout
            >
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  expandedMarket === market.id ? "border-primary/50" : ""
                )}
                onClick={() => handleMarketClick(market.id)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg">{market.question}</h3>
                        {market.bettingAsset && (
                          <Badge variant="outline" className="text-xs">
                            {market.bettingAsset}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "bg-gradient-to-r bg-clip-text text-transparent",
                            CATEGORIES.find((c) => c.id === market.category)?.color
                          )}
                        >
                          {CATEGORIES.find((c) => c.id === market.category)?.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Resolution: {new Date(Number(market.resolutionTime) * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <Badge
                      variant="outline"
                      className="capitalize bg-green-500/10 text-green-500 border-green-500/20"
                    >
                      {market.resolved ? "Resolved" : "Active"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-primary transition-all"
                        style={{ width: "0%" }}
                        animate={{ width: `${market.odds.yes}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Yes {market.odds.yes}%</span>
                      <span>No {market.odds.no}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Volume: {formatVolume(market.volume)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{Math.floor(parseInt(market.volume) / 10000)} participants</span>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedMarket === market.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t"
                      >
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1">
                              <Info className="h-4 w-4" /> Description
                            </h4>
                            <p className="text-sm mt-1">{market.description || market.question}</p>
                          </div>
                          
                          {market.source && (
                            <div>
                              <h4 className="text-sm font-medium">Source</h4>
                              <p className="text-sm text-muted-foreground">{market.source}</p>
                            </div>
                          )}
                          
                          <div className="flex gap-2 justify-end">
                            <Link href={`/predict?tab=bet&marketId=${market.id}`}>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                Place Bet
                              </motion.button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
});