import { useEffect, useState } from "react";
import axios from "axios";
import * as d3 from "d3";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    search: "",
    sort_by: "date",
    order: "desc",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`${API_BASE_URL}/api/dashboard/`, {
        headers: { Authorization: `Token ${token}` },
        params: filters,
      });
      setSummary(res.data.data);
      setError("");
    } catch (err) {
      setError("Unable to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  // ------------------- Export Handlers -------------------
  const exportJSON = () => {
    if (!summary) return;
    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_${filters.month || "all"}_${filters.year || "all"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!summary) return;
    const transactions = summary.transactions || [];

    const headers = ["Date", "Category", "Type", "Amount", "Description"];
    const rows = transactions.map((t) => [
      t.date,
      t.category__name,
      t.category__type,
      t.amount,
      t.description,
    ]);

    const csvContent =
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${filters.month || "all"}_${filters.year || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">📊 Dashboard Summary</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-4 justify-center">
          <select
            name="month"
            onChange={handleChange}
            value={filters.month}
            className="border rounded-lg p-2"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            name="year"
            onChange={handleChange}
            value={filters.year}
            className="border rounded-lg p-2"
          >
            <option value="">All Years</option>
            {[2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <input
            type="text"
            name="search"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={handleChange}
            className="border rounded-lg p-2 w-48"
          />

          <select
            name="sort_by"
            onChange={handleChange}
            value={filters.sort_by}
            className="border rounded-lg p-2"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>

          <select
            name="order"
            onChange={handleChange}
            value={filters.order}
            className="border rounded-lg p-2"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <button
            onClick={fetchSummary}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            ⬇ Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            ⬇ Export JSON
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Summary Cards */}
        {!summary ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1 → Summary Cards */}
                <div className="space-y-6">
                  <SummaryCard title="Total Income" value={summary.total_income} color="green" />
                  <SummaryCard title="Total Expenses" value={summary.total_expenses} color="red" />
                  <SummaryCard title="Balance" value={summary.balance} color="blue" />
                </div>

                {/* Column 2 → Budget */}
                <div className="bg-white p-6 rounded-xl shadow h-full">
                  <h2 className="text-xl font-semibold mb-3">💰 Budget Overview</h2>
                  <p>Budget Amount: ₹{summary.budget_amount}</p>
                  <p>Used: {summary.budget_utilized_percent}%</p>
                  <p
                    className={`font-semibold ${summary.budget_status === "under_budget"
                        ? "text-green-600"
                        : "text-red-600"
                      }`}
                  >
                    Status: {summary.budget_status.replace("_", " ")}
                  </p>
                </div>

                {/* Column 3 → Chart */}
                <div className="bg-white p-6 rounded-xl shadow h-full">
                  <DashboardChart summary={summary} />
                </div>

              </div>
            </div>



            {/* Transactions Table */}
            <div className="bg-white mt-10 p-6 rounded-xl shadow max-w-5xl mx-auto overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">🧾 Recent Transactions</h2>
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-2 px-3 border">Date</th>
                    <th className="py-2 px-3 border">Category</th>
                    <th className="py-2 px-3 border">Type</th>
                    <th className="py-2 px-3 border">Amount</th>
                    <th className="py-2 px-3 border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border">{t.date}</td>
                      <td className="py-2 px-3 border">{t.category__name}</td>
                      <td
                        className={`py-2 px-3 border ${t.category__type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {t.category__type}
                      </td>
                      <td className="py-2 px-3 border">₹{t.amount}</td>
                      <td className="py-2 px-3 border">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Logout */}
        <div className="text-center mt-10">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

function SummaryCard({ title, value, color }) {
  const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>₹{value}</p>
    </div>
  );
}

function DashboardChart({ summary }) {
  useEffect(() => {
    if (!summary) return;
    d3.select("#chart").selectAll("*").remove();

    const data = [
      { label: "Income", value: summary.total_income },
      { label: "Expenses", value: summary.total_expenses },
    ];

    const width = 400;
    const height = 250;
    const margin = { top: 30, right: 20, bottom: 40, left: 50 };

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", (d) => (d.label === "Income" ? "#22c55e" : "#ef4444"));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text("Income vs Expenses");
  }, [summary]);

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow max-w-4xl mx-auto text-center">
      {/* <div id="chart" className="flex justify-center"></div> */}
      <div id="chart" ></div>
    </div>
  );
}

export default Dashboard;
