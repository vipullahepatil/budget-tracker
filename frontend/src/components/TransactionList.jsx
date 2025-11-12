import axios from "axios";

function TransactionList({ transactions, onDelete, onEdit }) {
  if (!transactions.length)
    return <p className="text-gray-500 text-center">No transactions found</p>;

  return (
    <div className="overflow-x-auto w-full max-w-3xl">
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t">
              <td className="p-3">{tx.title}</td>
              <td className="p-3">{tx.category}</td>
              <td className="p-3">₹{tx.amount}</td>
              <td className="p-3">{tx.date}</td>
              <td
                className={`p-3 font-semibold ${
                  tx.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.type}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => onEdit(tx)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(tx.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
