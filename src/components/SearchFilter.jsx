// src/components/SearchFilter.jsx
import React, { useState, useMemo } from "react";
import { useInvestments } from "../context/InvestmentContext";

export const SearchFilter = ({ onFilteredResults, initialFilter = {} }) => {
  const { investments, transactions } = useInvestments();
  const [filters, setFilters] = useState({
    searchTerm: "",
    minBalance: "",
    maxBalance: "",
    investmentType: "",
    dateFrom: "",
    dateTo: "",
    ...initialFilter,
  });

  // Advanced filtering logic
  const filteredResults = useMemo(() => {
    let result = investments;

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.name.toLowerCase().includes(searchLower) ||
          inv.type.toLowerCase().includes(searchLower)
      );
    }

    // Balance range filter
    if (filters.minBalance) {
      result = result.filter(
        (inv) => inv.currentBalance >= parseFloat(filters.minBalance)
      );
    }

    if (filters.maxBalance) {
      result = result.filter(
        (inv) => inv.currentBalance <= parseFloat(filters.maxBalance)
      );
    }

    // Investment type filter
    if (filters.investmentType) {
      result = result.filter((inv) => inv.type === filters.investmentType);
    }

    // Date range filter (using transactions)
    if (filters.dateFrom || filters.dateTo) {
      result = result.filter((inv) => {
        const invTransactions = transactions.filter(
          (t) =>
            t.investmentId === inv.id &&
            (!filters.dateFrom ||
              new Date(t.timestamp) >= new Date(filters.dateFrom)) &&
            (!filters.dateTo ||
              new Date(t.timestamp) <= new Date(filters.dateTo))
        );
        return invTransactions.length > 0;
      });
    }

    // Trigger parent component callback
    onFilteredResults?.(result);

    return result;
  }, [investments, transactions, filters]);

  const INVESTMENT_TYPES = [
    "Sacco",
    "Money Market Fund",
    "ETF",
    "Stocks",
    "Bonds",
    "Real Estate",
    "Cryptocurrency",
  ];

  return (
    <div className="bg-white rounded-xl shadow-custom p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Search Investments
          </label>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                searchTerm: e.target.value,
              }))
            }
            placeholder="Search by name or type"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Investment Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Investment Type
          </label>
          <select
            value={filters.investmentType}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                investmentType: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All Types</option>
            {INVESTMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Balance Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Balance Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={filters.minBalance}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minBalance: e.target.value,
                }))
              }
              placeholder="Min Balance"
              className="w-1/2 px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              value={filters.maxBalance}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxBalance: e.target.value,
                }))
              }
              placeholder="Max Balance"
              className="w-1/2 px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date From
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                dateFrom: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date To
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                dateTo: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Reset Filters */}
        <div className="flex items-end">
          <button
            onClick={() =>
              setFilters({
                searchTerm: "",
                minBalance: "",
                maxBalance: "",
                investmentType: "",
                dateFrom: "",
                dateTo: "",
              })
            }
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
