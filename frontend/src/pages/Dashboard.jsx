// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardChart from "../components/DashboardChart"; // ✅ import chart component
import Navbar from "../components/Navbar";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(`${API_BASE_URL}/api/dashboard/summary/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setSummary(res.data);
      } catch (err) {
        setError("Unable to fetch dashboard data");
      }
    };

    fetchSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard Summary</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!summary ? (
        <p className="text-gray-600">Loading summary...</p>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h2 className="text-lg font-semibold text-gray-600">Total Income</h2>
              <p className="text-2xl font-bold text-green-600">
                ₹{summary.total_income}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h2 className="text-lg font-semibold text-gray-600">Total Expenses</h2>
              <p className="text-2xl font-bold text-red-600">
                ₹{summary.total_expenses}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h2 className="text-lg font-semibold text-gray-600">Balance</h2>
              <p className="text-2xl font-bold text-blue-600">
                ₹{summary.balance}
              </p>
            </div>
          </div>

          {/* ✅ Add Chart */}
          <DashboardChart summary={summary} />
        </>
      )}

      <button
        onClick={handleLogout}
        className="mt-10 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>
    </div>
    </>
  );
}

export default Dashboard;
