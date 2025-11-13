import DashboardChart from "./DashboardChart";

function ChartSection({ summary }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-5xl mx-auto mb-8">
      <h2 className="text-xl font-semibold mb-4">📈 Expense & Income Chart</h2>
      <DashboardChart summary={summary} />
    </div>
  );
}

export default ChartSection;
