import SummaryCard from "./SummaryCard";

function SummarySection({ summary }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-5xl mx-auto mb-8">
      <h2 className="text-xl font-semibold mb-4">📊 Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Income" value={summary.total_income} color="green" />
        <SummaryCard title="Total Expenses" value={summary.total_expenses} color="red" />
        <SummaryCard title="Balance" value={summary.balance} color="blue" />
      </div>
    </div>
  );
}

export default SummarySection;
