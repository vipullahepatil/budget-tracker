import api from "../services/api";

function TransactionList({
  transactions,
  filters,
  setFilters,
  page,
  setPage,
  totalPages,
  onRefresh,
  onEdit,
}) {
  const deleteTx = async (id) => {
    await api.deleteTransaction(id);
    onRefresh();
  };

  const clearFilters = () => {
    setFilters({
      date: "",
      category: "",
      type: "",
      min_amount: "",
      max_amount: "",
    });
    onRefresh();
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Transaction List</h2>

      {/* Filters */}
      <div className="grid md:grid-cols-5 gap-4 mb-4">

        {/* Date filter (mapped to start_date and end_date) */}
        <input
          type="date"
          className="input"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />

        <input
          type="text"
          className="input"
          placeholder="Category name"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />

        <select
          className="input"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <button
          className="bg-green-600 text-white px-3 rounded"
          onClick={onRefresh}
        >
          Apply
        </button>

        <button
          className="bg-gray-500 text-white px-3 rounded"
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>

      <table className="w-full text-left border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Category</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b">
              <td className="p-2">{tx.date}</td>
              <td className="p-2">{tx.category?.name}</td>
              <td className="p-2">₹{tx.amount}</td>
              <td className="p-2 capitalize">{tx.category?.type}</td>

              <td className="p-2 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 rounded"
                  onClick={() => onEdit(tx)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-2 rounded"
                  onClick={() => deleteTx(tx.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default TransactionList;



// import api from "../services/api";

// function TransactionList({
//   transactions,
//   filters,
//   setFilters,
//   page,
//   setPage,
//   totalPages,
//   onRefresh,
//   onEdit,
// }) {
//   const deleteTx = async (id) => {
//     await api.deleteTransaction(id);
//     onRefresh();
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow mt-6">
//       <h2 className="text-xl font-semibold mb-4">Transaction List</h2>

//       {/* Filters */}
//       <div className="grid md:grid-cols-4 gap-4 mb-4">
//         <input
//           type="date"
//           className="input"
//           value={filters.date}
//           onChange={(e) => setFilters({ ...filters, date: e.target.value })}
//         />

//         <input
//           type="text"
//           className="input"
//           placeholder="Category"
//           value={filters.category}
//           onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//         />

//         <select
//           className="input"
//           value={filters.type}
//           onChange={(e) => setFilters({ ...filters, type: e.target.value })}
//         >
//           <option value="">All</option>
//           <option value="income">Income</option>
//           <option value="expense">Expense</option>
//         </select>

//         <button
//           className="bg-green-600 text-white px-3 rounded"
//           onClick={onRefresh}
//         >
//           Apply
//         </button>
//       </div>

//       <table className="w-full text-left border">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="p-2">Date</th>
//             <th className="p-2">Category</th>
//             <th className="p-2">Amount</th>
//             <th className="p-2">Type</th>
//             <th className="p-2">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {transactions.map((tx) => (
//             <tr key={tx.id} className="border-b">
//               <td className="p-2">{tx.date}</td>
//               <td className="p-2">{tx.category?.name}</td>
//               <td className="p-2">₹{tx.amount}</td>
//               <td className="p-2 capitalize">{tx.category?.type}</td>

//               <td className="p-2 flex gap-2">
//                 <button
//                   className="bg-yellow-500 text-white px-2 rounded"
//                   onClick={() => onEdit(tx)} // 🔥 fill form for edit
//                 >
//                   Edit
//                 </button>

//                 <button
//                   className="bg-red-600 text-white px-2 rounded"
//                   onClick={() => deleteTx(tx.id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>

//       </table>

//       {/* Pagination */}
//       <div className="flex justify-between mt-4">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//           className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
//         >
//           Prev
//         </button>

//         <span>
//           Page {page} / {totalPages}
//         </span>

//         <button
//           disabled={page === totalPages}
//           onClick={() => setPage(page + 1)}
//           className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default TransactionList;

