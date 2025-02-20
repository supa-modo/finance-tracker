import { useState } from "react";
import { useInvestments } from "../../contexts/InvestmentContext";

const InvestmentForm = ({ onSuccess }) => {
  const { addInvestment } = useInvestments();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    initialBalance: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.initialBalance || isNaN(formData.initialBalance)) 
      newErrors.initialBalance = "Valid initial balance is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    addInvestment({
      ...formData,
      initialBalance: parseFloat(formData.initialBalance)
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields with error handling */}
    </form>
  );
};

export default InvestmentForm; 