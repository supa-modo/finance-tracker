// src/pages/Reports.jsx
import React, { useState, useMemo } from "react";
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
  ComposedChart,
} from "recharts";

 const Reports = () => {
  const { investments, transactions } = useInvestments();
  const [reportType, setReportType] = useState("overall");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    end: new Date().toISOString(),
  });

  // Advanced Performance Calculation
  const performanceData = useMemo(() => {
    // Filter transactions within date range
    const filteredTransactions = transactions.filter(
      (t) =>
        new Date(t.timestamp) >= new Date(dateRange.start) &&
        new Date(t.timestamp) <= new Date(dateRange.end)
    );

    // Aggregate data by investment type
    const typePerformance = investments.map((inv) => {
      const invTransactions = filteredTransactions.filter(
        (t) => t.investmentId === inv.id
      );

      const totalDeposits = invTransactions
        .filter((t) => t.type === "deposit")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdrawals = invTransactions
        .filter((t) => t.type === "withdrawal")
        .reduce((sum, t) => sum + t.amount, 0);

      const netGrowth = inv.currentBalance - inv.initialBalance;
      const growthPercentage = (netGrowth / inv.initialBalance) * 100;

      return {
        name: inv.name,
        type: inv.type,
        initialBalance: inv.initialBalance,
        currentBalance: inv.currentBalance,
        totalDeposits,
        totalWithdrawals,
        netGrowth,
        growthPercentage,
      };
    });

    // Monthly performance trend
    const monthlyPerformance = (() => {
      const monthMap = {};
      filteredTransactions.forEach((t) => {
        const month = new Date(t.timestamp).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });

        if (!monthMap[month]) {
          monthMap[month] = {
            month,
            deposits: 0,
            withdrawals: 0,
            netFlow: 0,
          };
        }

        if (t.type === "deposit") {
          monthMap[month].deposits += t.amount;
        } else {
          monthMap[month].withdrawals += t.amount;
        }

        monthMap[month].netFlow =
          monthMap[month].deposits - monthMap[month].withdrawals;
      });

      return Object.values(monthMap).sort(
        (a, b) => new Date(a.month) - new Date(b.month)
      );
    })();

    return {
      typePerformance,
      monthlyPerformance,
    };
  }, [investments, transactions, dateRange]);

  const renderReportContent = () => {
    switch (reportType) {
      case "investment-breakdown":
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Investment Performance Breakdown */}
            <div className="bg-white rounded-xl shadow-custom p-6">
              <h3 className="text-xl font-semibold mb-4">
                Investment Performance
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData.typePerformance}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="growthPercentage"
                    fill="#8884d8"
                    name="Growth (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Investment Table */}
            <div className="bg-white rounded-xl shadow-custom p-6">
              <h3 className="text-xl font-semibold mb-4">Investment Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-right">Initial Balance</th>
                      <th className="p-2 text-right">Current Balance</th>
                      <th className="p-2 text-right">Growth %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.typePerformance.map((inv) => (
                      <tr key={inv.name} className="border-b">
                        <td className="p-2">{inv.name}</td>
                        <td className="p-2 text-right">
                          ${inv.initialBalance.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          ${inv.currentBalance.toLocaleString()}
                        </td>
                        <td
                          className={`p-2 text-right ${
                            inv.growthPercentage >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {inv.growthPercentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "monthly-trends":
        return (
          <div className="bg-white rounded-xl shadow-custom p-6">
            <h3 className="text-xl font-semibold mb-4">
              Monthly Financial Trends
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={performanceData.monthlyPerformance}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="deposits"
                  barSize={20}
                  fill="#8884d8"
                  name="Deposits"
                />
                <Line
                  type="monotone"
                  dataKey="netFlow"
                  stroke="#ff7300"
                  name="Net Flow"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );

      default: // overall
        return (
          <div className="grid md:grid-cols-3 gap-6">
            {performanceData.typePerformance.map((inv) => (
              <div
                key={inv.name}
                className="bg-white rounded-xl shadow-custom p-6 text-center"
              >
                <h3 className="text-lg font-semibold mb-2">{inv.name}</h3>
                <p className="text-2xl font-bold">
                  ${inv.currentBalance.toLocaleString()}
                </p>
                <p
                  className={`text-sm ${
                    inv.growthPercentage >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {inv.growthPercentage >= 0 ? "▲" : "▼"}
                  {Math.abs(inv.growthPercentage).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-800">
          Performance Reports
        </h1>
        <div className="flex space-x-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="overall">Overall Summary</option>
            <option value="investment-breakdown">Investment Breakdown</option>
            <option value="monthly-trends">Monthly Trends</option>
          </select>
          <input
            type="date"
            value={dateRange.start.split("T")[0]}
            onChange={(e) =>
              setDateRange((prev) => ({
                ...prev,
                start: new Date(e.target.value).toISOString(),
              }))
            }
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="date"
            value={dateRange.end.split("T")[0]}
            onChange={(e) =>
              setDateRange((prev) => ({
                ...prev,
                end: new Date(e.target.value).toISOString(),
              }))
            }
            className="px-4 py-2 border rounded-md"
          />
        </div>
      </div>

      {renderReportContent()}
    </div>
  );
};


export default Reports