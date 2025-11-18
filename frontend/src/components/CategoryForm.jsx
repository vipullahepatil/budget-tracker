
import { useEffect, useState } from "react";
import api from "../services/api";

function CategoryForm({ category, onSaved }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
    } else {
      setName("");
      setType("");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAlert("");

    const payload = { name, type };

    try {
      if (category) {
        await api.updateCategory(category.id, payload);
        setAlert("Category updated successfully!");
      } else {
        await api.createCategory(payload);
        setAlert("Category created successfully!");
      }

      setName("");
      setType("");
      onSaved();

      setTimeout(() => setAlert(""), 2000);

    } catch (err) {
      console.log("POST/PUT ERROR:", err.response?.data);

      const errorMsg =
        err.response?.data?.data?.name?.[0] ||
        err.response?.data?.data?.type?.[0] ||
        err.response?.data?.message ||
        "Something went wrong";

      setError(errorMsg);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      {alert && (
        <div className="bg-green-200 text-green-800 px-4 py-2 mb-4 rounded">
          {alert}
        </div>
      )}

      {error && (
        <div className="bg-red-200 text-red-800 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">
        {category ? "Edit Category" : "Add Category"}
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4">

        <input
          type="text"
          className="input border p-2 rounded"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          className="input border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Select type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {category ? "Update" : "Save"}
        </button>

      </form>
    </div>
  );
}

export default CategoryForm;