// src/pages/Budget.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import BudgetChart from "../components/BudgetChart";
import Navbar from "../components/Navbar";

function Budget() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [budget, setBudget] = useState(null);
  const [actual, setActual] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // Fetch both budget and actual expense data
  const fetchBudgetData = async () => {
    const token = localStorage.getItem("access_token");
    try {
      // 1️⃣ Get all budgets (list)
      const budgetRes = await axios.get(`${API_BASE_URL}/api/budgets/`, {
        headers: { Authorization: `Token ${token}` },
      });

      // safely get first budget entry
      const latestBudget = budgetRes.data.results?.[0];
      if (latestBudget) {
        setBudget(parseFloat(latestBudget.amount));
      }

      // 2️⃣ Get actual expenses from dashboard summary
      const summaryRes = await axios.get(`${API_BASE_URL}/api/dashboard/summary/`, {
        headers: { Authorization: `Token ${token}` },
      });

      setActual(summaryRes.data.total_expenses);
    } catch (err) {
      console.error(err);
      setMessage("Unable to fetch budget data");
    }
  };

  // Handle new budget form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      await axios.post(
        `${API_BASE_URL}/api/budgets/`,
        { amount },
        { headers: { Authorization: `Token ${token}` } }
      );
      setMessage("Budget saved successfully");
      fetchBudgetData();
    } catch (err) {
      console.error(err);
      setMessage("Error updating budget");
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Budget Management</h1>

        {/* Set Budget Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow p-6 rounded-lg w-full max-w-md mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Set Monthly Budget</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter budget amount"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Save Budget
          </button>
        </form>

        {message && <p className="text-blue-600 mb-4">{message}</p>}

        {/* Budget Summary + Chart */}
        {budget !== null && actual !== null ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow w-full max-w-md text-center">
              <p className="text-gray-700">
                <strong>Budget:</strong> ₹{budget}
              </p>
              <p className="text-gray-700">
                <strong>Actual Expenses:</strong> ₹{actual}
              </p>
              <p
                className={`font-semibold mt-2 ${
                  actual > budget ? "text-red-600" : "text-green-600"
                }`}
              >
                {actual > budget
                  ? "You’ve exceeded your budget!"
                  : "You’re within your budget ✅"}
              </p>
            </div>

            <BudgetChart budget={budget} actual={actual} />
          </>
        ) : (
          <p className="text-gray-500 mt-6">Loading budget data...</p>
        )}
      </div>
    </>
  );
}

export default Budget;
