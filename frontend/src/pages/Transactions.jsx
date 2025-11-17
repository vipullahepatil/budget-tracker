import { useEffect, useState } from "react";
import axios from "../utils/axios";
import Navbar from "../components/Navbar";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    category: "",
    type: "",
    min_amount: "",
    max_amount: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editing, setEditing] = useState(null); // 🔥 stores editing record

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`/transactions/`, {
        params: {
          page,
          start_date: filters.date,
          end_date: filters.date,
          category_name: filters.category,
          category_type: filters.type,
          min_amount: filters.min_amount,
          max_amount: filters.max_amount,
        },
      });

      const items = res.data.results?.data || [];
      setTransactions(items);
      setTotalPages(Math.ceil(res.data.count / 5));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">Transactions</h1>

        {/* 🔥 Pass editing object + setter */}
        <TransactionForm
          onSuccess={fetchTransactions}
          editing={editing}
          setEditing={setEditing}
        />

        <TransactionList
          transactions={transactions}
          filters={filters}
          setFilters={setFilters}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          onRefresh={fetchTransactions}
          onEdit={setEditing} // 🔥 when click edit, fill form
        />
      </div>
    </div>
  );
}

export default Transactions;

