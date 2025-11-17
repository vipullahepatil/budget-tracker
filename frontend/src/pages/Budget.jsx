import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import BudgetSection from "../components/BudgetSection";

function Budget() {
  const [budget, setBudget] = useState(null);

  const loadBudget = async () => {
    const res = await api.getBudget();
    setBudget(res.data);
  };

  useEffect(() => {
    loadBudget();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <BudgetSection budget={budget} refresh={loadBudget} />
      </div>
    </div>
  );
}

export default Budget;
