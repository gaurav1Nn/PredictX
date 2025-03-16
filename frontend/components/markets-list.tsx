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
import { Brain, Shield, Microscope, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePredictionMarket } from "@/lib/usePredictionMarket";

const CATEGORIES = [
  { id: "all", name: "All Markets", icon: null, color: "from-gray-500 to-gray-600" },
  { id: "pandemic", name: "Pandemic Risks", icon: Microscope, color: "from-emerald-500 to-teal-500" },
  { id: "ai", name: "AI Safety", icon: Brain, color: "from-blue-500 to-indigo-500" },
  { id: "cyber", name: "Cyber Threats", icon: Shield, color: "from-purple-500 to-pink-500" },
  { id: "misinfo", name: "Misinformation", icon: AlertTriangle, color: "from-orange-500 to-red-500" },
];

export const MarketsList = React.memo(function MarketsList() {
  console.log("Rendering MarketsList");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { markets } = usePredictionMarket();

  const filteredMarkets = markets
    .map((market) => {
      let category = "all";
      if (market.question.toLowerCase().includes("pandemic")) category = "pandemic";
      else if (market.question.toLowerCase().includes("ai") || market.question.toLowerCase().includes("agi"))
        category = "ai";
      else if (market.question.toLowerCase().includes("cyber")) category = "cyber";
      else if (market.question.toLowerCase().includes("misinfo") || market.question.toLowerCase().includes("deepfake"))
        category = "misinfo";
      return { ...market, category, odds: { yes: 50, no: 50 } };
    })
    .filter((market) => selectedCategory === "all" || market.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Active Markets</h2>
          <p className="text-muted-foreground">Predict global risks and earn rewards</p>
        </div>
        <Badge variant="secondary" className="text-base px-4 py-1">
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
          >
            {category.icon && <category.icon className="h-4 w-4" />}
            <span className="whitespace-nowrap">{category.name}</span>
          </motion.button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40%]">Prediction Market</TableHead>
              <TableHead>Current Odds</TableHead>
              <TableHead>Resolution Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMarkets.map((market) => (
              <motion.tr
                key={market.id}
                variants={itemVariants}
                className="group hover:bg-muted/50 cursor-pointer"
              >
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{market.question}</div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "bg-gradient-to-r bg-clip-text text-transparent",
                        CATEGORIES.find((c) => c.id === market.category)?.color
                      )}
                    >
                      {CATEGORIES.find((c) => c.id === market.category)?.name}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${market.odds.yes}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Yes {market.odds.yes}%</span>
                      <span>No {market.odds.no}%</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(Number(market.resolutionTime) * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="capitalize bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    {market.resolved ? "Resolved" : "Active"}
                  </Badge>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
});