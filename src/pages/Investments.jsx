import React, { useState } from "react";
import { useInvestments } from "../contexts/InvestmentContext";

// Investment Types Dropdown
const INVESTMENT_TYPES = [
  "Sacco",
  "Money Market Fund",
  "ETF",
  "Stocks",
  "Bonds",
  "Real Estate",
  "Cryptocurrency",
];

const Investments = () => {
  const [activeView, setActiveView] = useState("list");
  const { investments } = useInvestments();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-800">Investments</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView("list")}
            className={`px-4 py-2 rounded-md transition ${
              activeView === "list"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            View Investments
          </button>
          <button
            onClick={() => setActiveView("add")}
            className={`px-4 py-2 rounded-md transition ${
              activeView === "add"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Add Investment
          </button>
        </div>
      </div>

      {activeView === "list" ? <InvestmentList /> : <InvestmentForm />}
    </div>
  );
};

const InvestmentList = () => {
  const { investments } = useInvestments();
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {investments.map((investment) => (
        <div
          key={investment.id}
          className="bg-white rounded-xl shadow-custom p-6 hover:shadow-lg transition-all group cursor-pointer"
          onClick={() => setSelectedInvestment(investment)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-primary-800">
              {investment.name}
            </h3>
            <span className="text-sm text-gray-500">{investment.type}</span>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-primary-600">
              ${investment.currentBalance?.toLocaleString() || "0"}
            </p>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Initial Investment:</span>
              <span>${investment.initialBalance?.toLocaleString() || "0"}</span>
            </div>
          </div>
        </div>
      ))}

      {selectedInvestment && (
        <InvestmentDetailsModal
          investment={selectedInvestment}
          onClose={() => setSelectedInvestment(null)}
        />
      )}
    </div>
  );
};

const InvestmentForm = () => {
  const { addInvestment } = useInvestments();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    initialBalance: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvestment = {
      ...formData,
      initialBalance: parseFloat(formData.initialBalance),
      currentBalance: parseFloat(formData.initialBalance),
    };
    addInvestment(newInvestment);
    // Reset form
    setFormData({
      name: "",
      type: "",
      initialBalance: "",
      description: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-custom p-8 max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Investment Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g. Retirement Fund"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Investment Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Select Investment Type</option>
            {INVESTMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Initial Balance
          </label>
          <input
            type="number"
            value={formData.initialBalance}
            onChange={(e) =>
              setFormData({ ...formData, initialBalance: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Initial Investment Amount"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Additional details about the investment"
            rows="4"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
        >
          Add Investment
        </button>
      </div>
    </form>
  );
};

const InvestmentDetailsModal = ({ investment, onClose }) => {
  const { recordTransaction, getInvestmentTransactions } = useInvestments();
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  const [description, setDescription] = useState("");

  const transactions = getInvestmentTransactions(investment.id);

  const handleTransaction = (e) => {
    e.preventDefault();
    recordTransaction(
      investment.id,
      parseFloat(transactionAmount),
      transactionType,
      description
    );
    // Reset form
    setTransactionAmount("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary-800">
            {investment.name} Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Investment Summary */}
          <div className="space-y-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Investment Summary</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Current Balance:</span>
                  <span className="font-bold text-primary-600">
                    ${investment.currentBalance?.toLocaleString() || "0"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Initial Investment:</span>
                  <span>
                    ${investment.initialBalance?.toLocaleString() || "0"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Investment Type:</span>
                  <span>{investment.type}</span>
                </p>
              </div>
            </div>

            {/* Transaction Form */}
            <form onSubmit={handleTransaction} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Transaction Amount
                </label>
                <input
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Transaction Type
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Additional transaction details"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition"
              >
                Record Transaction
              </button>
            </form>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            {transactions.length === 0 ? (
              <p className="text-gray-500">No transactions yet</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`
                      p-4 rounded-lg shadow-sm
                      ${
                        transaction.type === "deposit"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      } border`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">
                        {transaction.type === "deposit" ? "+" : "-"}$
                        {transaction.amount.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {transaction.description || "No description"}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Balance: ${transaction.newBalance.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Investments