// src/pages/DataManagement.jsx
import React, { useState } from "react";
import { useInvestments } from "../contexts/InvestmentContext";
import { exportData, importData } from "../utils/dataExport";
import { validateInvestment } from "../utils/dataValidation";

const DataManagement = () => {
  const { investments, transactions, setInvestments, setTransactions } =
    useInvestments();
  const [importError, setImportError] = useState(null);

  const handleExport = () => {
    exportData(investments, transactions);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setImportError(null);
      const {
        investments: importedInvestments,
        transactions: importedTransactions,
      } = await importData(file);

      // Validate investments before importing
      const validationResults = importedInvestments.map(validateInvestment);
      const allValid = validationResults.every((result) => result.isValid);

      if (allValid) {
        setInvestments(importedInvestments);
        setTransactions(importedTransactions);
      } else {
        const invalidInvestments = validationResults
          .filter((result) => !result.isValid)
          .map((result, index) => ({
            investment: importedInvestments[index],
            errors: result.errors,
          }));

        setImportError({
          message: "Some investments are invalid",
          details: invalidInvestments,
        });
      }
    } catch (error) {
      setImportError({
        message: error.message,
        details: null,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-custom p-8">
        <h1 className="text-2xl font-bold mb-6 text-primary-800">
          Data Management
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Export Section */}
          <div className="bg-primary-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Export Data</h2>
            <p className="text-gray-600 mb-4">
              Export your investments and transaction history to a JSON file.
            </p>
            <button
              onClick={handleExport}
              className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition"
            >
              Export Data
            </button>
          </div>

          {/* Import Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Import Data</h2>
            <p className="text-gray-600 mb-4">
              Import previously exported investment data.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="w-full mb-4 p-2 border rounded-md"
            />
            {importError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                <p className="text-red-700 font-semibold mb-2">
                  {importError.message}
                </p>
                {importError.details && (
                  <div className="text-sm">
                    <h3 className="font-semibold mt-2">Invalid Investments:</h3>
                    {importError.details.map((item, index) => (
                      <div key={index} className="mt-2 p-2 bg-red-100 rounded">
                        <p>Investment: {item.investment.name}</p>
                        <ul className="list-disc list-inside">
                          {Object.entries(item.errors).map(([key, value]) => (
                            <li key={key} className="text-red-700">
                              {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default DataManagement