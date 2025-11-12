import { useState } from "react";
import axios from "axios";

function TransactionForm({ onSuccess, editTransaction }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState(
    editTransaction || {
      title: "",
      amount: "",
      category: "",
      date: "",
      type: "expense", // or income
    }
  );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      if (editTransaction) {
        await axios.put(
          `${API_BASE_URL}/api/transactions/${editTransaction.id}/`,
          formData,
          { headers: { Authorization: `Token ${token}` } }
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/transactions/`, formData, {
          headers: { Authorization: `Token ${token}` },
        });
      }
      onSuccess();
      setFormData({ title: "", amount: "", category: "", date: "", type: "expense" });
    } catch (err) {
      alert("Error saving transaction");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 mb-8 w-full max-w-md"
    >
      <h2 className="text-xl font-semibold mb-4">
        {editTransaction ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        required
      />
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        required
      />
      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}

export default TransactionForm;
