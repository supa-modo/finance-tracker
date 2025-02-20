import { validateInvestment } from "./dataValidation";

export const exportData = (investments, transactions) => {
  const exportData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    investments,
    transactions,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
    dataStr
  )}`;

  const exportFileDefaultName = `finance-tracker-export-${
    new Date().toISOString().split("T")[0]
  }.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);

        // Basic validation
        if (!importedData.investments || !importedData.transactions) {
          throw new Error("Invalid import file format");
        }

        // Optional: Additional validation for imported data
        const validInvestments = importedData.investments.filter(
          (inv) => validateInvestment(inv).isValid
        );

        resolve({
          investments: validInvestments,
          transactions: importedData.transactions,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};
