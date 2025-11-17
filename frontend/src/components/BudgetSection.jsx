import api from "../services/api";
import { useState } from "react";
import BudgetChart from "./BudgetChart";

function BudgetSection({ budget, refresh }) {
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  const saveBudget = async () => {
    try {
      await api.saveBudget({ amount });
      setAmount("");
      setMsg("Budget updated!");
      setTimeout(() => setMsg(""), 2000);
      refresh();
    } catch (err) {
      setMsg("Error saving budget");
    }
  };

  const monthName = new Date().toLocaleString("en-US", { month: "long" });
  const year = new Date().getFullYear();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

      {msg && (
        <div className="mb-4 p-3 bg-green-200 text-green-700 font-semibold rounded">
          {msg}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">
        {monthName} {year} Budget
      </h2>

      {/* Input Section */}
      <div className="flex gap-3 mb-4">
        <input
          type="number"
          className="input w-full"
          placeholder="Enter monthly budget"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={saveBudget}
        >
          {budget ? "Update" : "Save"}
        </button>
      </div>

      {/* Show summary if budget exists */}
      {budget && (
        <>
          <div className="mb-3">
            <p className="text-lg">
              <strong>Budget:</strong> ₹{budget.amount}
            </p>

            <p className="text-lg">
              <strong>Total Expenses:</strong> ₹{budget.total_expenses}
            </p>

            <p className="text-lg">
              <strong>Remaining:</strong> ₹{budget.amount - budget.total_expenses}
            </p>
          </div>

          <BudgetChart budget={budget} />
        </>
      )}
    </div>
  );
}

export default BudgetSection;
