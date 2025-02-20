import React, { useMemo } from "react";
import { useInvestments } from "../contexts/InvestmentContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const { investments, transactions } = useInvestments();

  // Total investment calculation
  const totalInvestments = useMemo(() => {
    return investments.reduce((sum, inv) => sum + (inv.currentBalance || 0), 0);
  }, [investments]);

  // Investment distribution by type
  const investmentTypeDistribution = useMemo(() => {
    const typeGroups = investments.reduce((acc, inv) => {
      acc[inv.type] = (acc[inv.type] || 0) + (inv.currentBalance || 0);
      return acc;
    }, {});

    return Object.entries(typeGroups).map(([name, value]) => ({ name, value }));
  }, [investments]);

  // Monthly transaction history
  const monthlyTransactions = useMemo(() => {
    const monthlyData = {};
    transactions.forEach((transaction) => {
      const month = new Date(transaction.timestamp).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyData[month] = monthlyData[month] || {
        month,
        deposits: 0,
        withdrawals: 0,
      };

      if (transaction.type === "deposit") {
        monthlyData[month].deposits += transaction.amount;
      } else {
        monthlyData[month].withdrawals += transaction.amount;
      }
    });

    return Object.values(monthlyData).sort(
      (a, b) => new Date(a.month) - new Date(b.month)
    );
  }, [transactions]);

  // Performance metrics
  const performanceMetrics = useMemo(() => {
    const totalDeposits = transactions
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter((t) => t.type === "withdrawal")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalInvestments,
      totalDeposits,
      totalWithdrawals,
      netGrowth: totalInvestments - totalDeposits + totalWithdrawals,
    };
  }, [investments, transactions]);

  // COLORS for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  const totalBalance = investments.reduce((sum, inv) => sum + inv.currentBalance, 0);
  const investmentDistribution = investments.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.currentBalance;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Balance</h3>
          <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
        </div>
        {/* Other summary cards */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Investment Distribution</h3>
          <PieChart data={Object.entries(investmentDistribution)} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
          <BarChart data={transactions.slice(-10)} />
        </div>
      </div>
    </div>
  );
};


export default Dashboard