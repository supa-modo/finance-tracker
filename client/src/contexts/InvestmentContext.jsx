import React, { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const InvestmentContext = createContext(null);

export const InvestmentProvider = ({ children }) => {
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const storedInvestments = JSON.parse(localStorage.getItem("investments") || "[]");
    const storedTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    setInvestments(storedInvestments);
    setTransactions(storedTransactions);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("investments", JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addInvestment = (investment) => {
    const newInvestment = {
      ...investment,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      currentBalance: investment.initialBalance || 0
    };
    setInvestments(prev => [...prev, newInvestment]);
    return newInvestment;
  };

  const recordTransaction = (investmentId, amount, type, description = "") => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment) return;

    const newBalance = type === "deposit" 
      ? investment.currentBalance + amount 
      : investment.currentBalance - amount;

    const transaction = {
      id: uuidv4(),
      investmentId,
      amount,
      type,
      description,
      timestamp: new Date().toISOString(),
      newBalance
    };

    setTransactions(prev => [...prev, transaction]);
    setInvestments(prev => 
      prev.map(inv => 
        inv.id === investmentId 
          ? { ...inv, currentBalance: newBalance } 
          : inv
      )
    );

    return transaction;
  };

  return (
    <InvestmentContext.Provider
      value={{
        investments,
        transactions,
        addInvestment,
        recordTransaction
      }}
    >
      {children}
    </InvestmentContext.Provider>
  );
};

export const useInvestments = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error("useInvestments must be used within an InvestmentProvider");
  }
  return context;
};
