import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import BudgetForm from "../components/BudgetForm";
import BudgetList from "../components/BudgetList";

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [filters, setFilters] = useState({
    month: "",
    year: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const loadBudgets = async () => {
    try {
      const res = await api.getBudget({
        page,
        month: filters.month,
        year: filters.year,
      });

      const items = res.data.results || [];
      setBudgets(items);
      setTotalPages(Math.ceil(res.data.count / 5)); // assuming limit=5
    } catch (err) {
      console.log("Error loading budgets:", err);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [page]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">

        {/* FORM */}
        <BudgetForm
          budget={selectedBudget}
          onSaved={() => {
            setSelectedBudget(null);
            loadBudgets();
          }}
        />

        {/* LIST */}
        <BudgetList
          budgets={budgets}
          filters={filters}
          setFilters={setFilters}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          onEdit={(b) => setSelectedBudget(b)}
          onRefresh={loadBudgets}
        />
      </div>
    </div>
  );
}

export default Budget;
