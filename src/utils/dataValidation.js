export const validateInvestment = (investment) => {
  const errors = {};

  // Name validation
  if (!investment.name || investment.name.trim().length < 2) {
    errors.name = "Investment name must be at least 2 characters long";
  }

  // Type validation
  const validTypes = [
    "Sacco",
    "Money Market Fund",
    "ETF",
    "Stocks",
    "Bonds",
    "Real Estate",
    "Cryptocurrency",
    "Cash",
  ];
  if (!investment.type || !validTypes.includes(investment.type)) {
    errors.type = "Invalid investment type";
  }

  // Balance validation
  if (
    typeof investment.initialBalance !== "number" ||
    investment.initialBalance < 0
  ) {
    errors.initialBalance = "Initial balance must be a non-negative number";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
