import api from "../services/api";
import { useState } from "react";
import BudgetChart from "./BudgetChart";

function BudgetSection({ budget, refresh }) {
  const [amount, setAmount] = useState("");

  const save = async () => {
    await api.saveBudget({ amount });
    setAmount("");
    refresh();
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Monthly Budget</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          className="input"
          placeholder="Budget amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>

      {budget && (
        <>
          <p className="mb-3">
            Current Budget: <strong>₹{budget.amount}</strong>
          </p>

          <BudgetChart budget={budget} />
        </>
      )}
    </div>
  );
}

export default BudgetSection;
