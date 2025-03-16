"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Trophy, Calculator } from "lucide-react";
import { usePredictionMarket } from "@/lib/usePredictionMarket";
import { ethers } from "ethers";

const MOCK_PROFIT_DATA = [
  { month: "Jan", profit: 120 },
  { month: "Feb", profit: -50 },
  { month: "Mar", profit: 200 },
  { month: "Apr", profit: -80 },
  { month: "May", profit: 300 },
];

const MOCK_WIN_LOSS = [
  { name: "Wins", value: 60 },
  { name: "Losses", value: 40 },
];

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

export function Dashboard() {
  console.log("Rendering Dashboard");
  const { bets } = usePredictionMarket();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total ROI"
          value="+24.5%"
          description="Based on all bets"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="positive"
        />
        <StatCard
          title="Biggest Win"
          value={bets.length > 0 ? `${ethers.formatEther(Math.max(...bets.map((b) => Number(b.amount))))} ZETA` : "0 ZETA"}
          description="Single bet win"
          icon={<Trophy className="h-5 w-5" />}
          trend="positive"
        />
        <StatCard
          title="Average Bet"
          value={bets.length > 0 ? `${ethers.formatEther(bets.reduce((sum, b) => sum + Number(b.amount), 0) / bets.length)} ZETA` : "0 ZETA"}
          description="Per transaction"
          icon={<Calculator className="h-5 w-5" />}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profit/Loss Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_PROFIT_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Win/Loss Ratio</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_WIN_LOSS}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_WIN_LOSS.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="wins">Wins</TabsTrigger>
            <TabsTrigger value="losses">Losses</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="py-4">
            <ActivityList bets={bets} />
          </TabsContent>
          <TabsContent value="wins" className="py-4">
            <ActivityList bets={bets} filtered="win" />
          </TabsContent>
          <TabsContent value="losses" className="py-4">
            <ActivityList bets={bets} filtered="loss" />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "positive" | "negative" | "neutral";
}) {
  const getBgColor = () => {
    switch (trend) {
      case "positive":
        return "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50";
      case "negative":
        return "bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/50 dark:to-red-950/50";
      default:
        return "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50";
    }
  };

  const getIconColor = () => {
    switch (trend) {
      case "positive":
        return "text-emerald-600 dark:text-emerald-400";
      case "negative":
        return "text-rose-600 dark:text-rose-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  const getValueColor = () => {
    switch (trend) {
      case "positive":
        return "text-emerald-700 dark:text-emerald-300";
      case "negative":
        return "text-rose-700 dark:text-rose-300";
      default:
        return "text-blue-700 dark:text-blue-300";
    }
  };

  return (
    <Card className={`p-6 border-2 ${getBgColor()} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center gap-3">
        <div className={`${getIconColor()} bg-white dark:bg-gray-900 p-2 rounded-lg`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <p className={`text-2xl font-bold mt-2 ${getValueColor()}`}>{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </Card>
  );
}

function ActivityList({ bets, filtered }: { bets: any[]; filtered?: "win" | "loss" }) {
  const activities = bets.map((bet, index) => ({
    id: index + 1,
    market: `Market ${bet.marketId || bet.id}`, // Adjusted to handle both cases
    outcome: bet.outcomeIndex === 0 ? "Yes" : "No",
    amount: `${ethers.formatEther(bet.amount)} ZETA`,
    result: "pending",
    date: new Date().toISOString().split("T")[0],
  })).filter((activity) =>
    !filtered || (filtered === "win" && activity.result === "win") || (filtered === "loss" && activity.result === "loss")
  );

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-muted-foreground">No activity to display.</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div>
              <p className="font-medium">{activity.market}</p>
              <p className="text-sm text-muted-foreground">Bet on: {activity.outcome}</p>
            </div>
            <div className="text-right">
              <p
                className={
                  activity.result === "win"
                    ? "text-green-600 dark:text-green-400"
                    : activity.result === "loss"
                    ? "text-red-600 dark:text-red-400"
                    : "text-yellow-600 dark:text-yellow-400"
                }
              >
                {activity.amount}
              </p>
              <p className="text-sm text-muted-foreground">{activity.date}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}