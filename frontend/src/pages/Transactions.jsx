import { useEffect, useState } from "react";
import axios from "axios";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Navbar from "../components/Navbar";

function Transactions() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [transactions, setTransactions] = useState([]);
  const [editTx, setEditTx] = useState(null);
  const [filters, setFilters] = useState({ category: "", start: "", end: "" });

  const fetchTransactions = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/transactions/`, {
        headers: { Authorization: `Token ${token}` },
        params: {
          category: filters.category,
          start_date: filters.start,
          end_date: filters.end,
        },
      });
      setTransactions(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access_token");
    await axios.delete(`${API_BASE_URL}/api/transactions/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      <TransactionForm onSuccess={fetchTransactions} editTransaction={editTx} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={filters.start}
          onChange={(e) => setFilters({ ...filters, start: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={filters.end}
          onChange={(e) => setFilters({ ...filters, end: e.target.value })}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchTransactions}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
        onEdit={setEditTx}
      />
    </div>
    </>
  );
}

export default Transactions;
