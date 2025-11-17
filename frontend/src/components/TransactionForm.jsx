

import { useEffect, useState } from "react";
import api from "../services/api";

function TransactionForm({ onSuccess, editing, setEditing }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emptyForm = {
    amount: "",
    date: "",
    category_id: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  // Load categories
  useEffect(() => {
    api.getCategories().then((res) => {
      setCategories(res.data?.results?.data || []);
    });
  }, []);

  // 🔥 If editing mode → prefill form
  useEffect(() => {
    if (editing) {
      setForm({
        amount: editing.amount,
        date: editing.date,
        category_id: editing.category?.id,
        description: editing.description,
      });
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      category_id: Number(form.category_id),
      amount: Number(form.amount),
      date: form.date,
      description: form.description,
    };

    try {
      if (editing) {
        // 🔥 Update existing
        await api.updateTransaction(editing.id, payload);
        setSuccess("Transaction updated successfully!");
        setEditing(null);
      } else {
        // 🔥 Create new
        await api.createTransaction(payload);
        setSuccess("Transaction added successfully!");
      }

      setTimeout(() => setSuccess(""), 1500);

      setForm(emptyForm);
      onSuccess();
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.amount?.[0] ||
        err.response?.data?.date?.[0] ||
        err.response?.data?.detail ||
        "Something went wrong";

      setError(msg);
    }
  };

  return (
    <div className="flex justify-center mt-2">
      <div className="w-short md:w-4/12">

        <form className="bg-white p-6 rounded shadow" onSubmit={handleSubmit}>

          {error && (
            <div className="p-3 mb-3 rounded bg-red-200 border border-red-500 text-red-700 font-bold">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 mb-3 rounded bg-green-200 border border-green-500 text-green-700 font-bold">
              {success}
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4 text-center">
            {editing ? "Update Transaction" : "Add Transaction"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              className="input"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />

            <input
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />

            <select
              className="input"
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>

            <input
              type="text"
              className="input md:col-span-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full">
            {editing ? "Update" : "Save"}
          </button>

          {/* show cancel button in edit mode */}
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}
              className="mt-2 bg-gray-400 text-white px-4 py-2 rounded w-full"
            >
              Cancel Edit
            </button>
          )}
        </form>

      </div>
    </div>
  );
}

export default TransactionForm;

