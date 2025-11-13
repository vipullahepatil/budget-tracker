function BudgetSection({ summary }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-5xl mx-auto mb-8">
      <h2 className="text-xl font-semibold mb-3">💰 Budget Overview</h2>

      <p>Budget Amount: ₹{summary.budget_amount}</p>
      <p>Used: {summary.budget_utilized_percent}%</p>

      <p
        className={`font-semibold mt-2 ${
          summary.budget_status === "under_budget" ? "text-green-600" : "text-red-600"
        }`}
      >
        Status: {summary.budget_status.replace("_", " ")}
      </p>
    </div>
  );
}

export default BudgetSection;
