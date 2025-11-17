import api from "../services/api";

function BudgetList({
  budgets,
  filters,
  setFilters,
  page,
  setPage,
  totalPages,
  onEdit,
  onRefresh,
}) {
  const clearFilters = () => {
    setFilters({ month: "", year: "" });
    setPage(1);
    onRefresh();
  };

  const deleteBudget = async (id) => {
    await api.deleteBudget(id);
    onRefresh();
  };

  return (
    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-semibold mb-4">Budget List</h2>

      {/* FILTERS */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          type="number"
          className="input"
          placeholder="Month"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        />

        <input
          type="number"
          className="input"
          placeholder="Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        />

        <button
          className="bg-green-600 text-white px-3 rounded"
          onClick={onRefresh}
        >
          Apply
        </button>
      </div>

      <button
        className="bg-gray-500 text-white px-3 py-1 rounded mb-4"
        onClick={clearFilters}
      >
        Clear Filters
      </button>

      <table className="w-full text-left border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Month</th>
            <th className="p-2">Year</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {budgets.map((b) => (
            <tr key={b.id} className="border-b">
              <td className="p-2">{b.month}</td>
              <td className="p-2">{b.year}</td>
              <td className="p-2">₹{b.amount}</td>

              <td className="p-2 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-3 rounded"
                  onClick={() => onEdit(b)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-3 rounded"
                  onClick={() => deleteBudget(b.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>Page {page} / {totalPages}</span>

        <button
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BudgetList;





// import api from "../services/api";

// function BudgetList({
//   budgets,
//   filters,
//   setFilters,
//   page,
//   setPage,
//   totalPages,
//   onEdit,
//   onRefresh,
// }) {
//   const clearFilters = () => {
//     setFilters({ month: "", year: "" });
//     setPage(1);
//     onRefresh();
//   };

//   const deleteBudget = async (id) => {
//     await api.deleteBudget(id);
//     onRefresh();
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow">

//       <h2 className="text-xl font-semibold mb-4">Budget List</h2>

//       {/* FILTERS */}
//       <div className="grid grid-cols-3 gap-4 mb-4">
//         <input
//           type="number"
//           className="input"
//           placeholder="Month"
//           value={filters.month}
//           onChange={(e) => setFilters({ ...filters, month: e.target.value })}
//         />

//         <input
//           type="number"
//           className="input"
//           placeholder="Year"
//           value={filters.year}
//           onChange={(e) => setFilters({ ...filters, year: e.target.value })}
//         />

//         <button
//           className="bg-green-600 text-white px-3 rounded"
//           onClick={onRefresh}
//         >
//           Apply
//         </button>
//       </div>

//       <button
//         className="bg-gray-400 text-white px-3 py-1 mb-4 rounded"
//         onClick={clearFilters}
//       >
//         Clear Filter
//       </button>

//       {/* LIST TABLE */}
//       <table className="w-full text-left border">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="p-2">Month</th>
//             <th className="p-2">Year</th>
//             <th className="p-2">Amount</th>
//             <th className="p-2">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {budgets.map((b) => (
//             <tr key={b.id} className="border-b">
//               <td className="p-2">{b.month}</td>
//               <td className="p-2">{b.year}</td>
//               <td className="p-2">₹{b.amount}</td>

//               <td className="p-2 flex gap-2">
//                 <button
//                   className="bg-yellow-500 text-white px-3 rounded"
//                   onClick={() => onEdit(b)}
//                 >
//                   Edit
//                 </button>

//                 <button
//                   className="bg-red-600 text-white px-3 rounded"
//                   onClick={() => deleteBudget(b.id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* PAGINATION */}
//       <div className="flex justify-between mt-4">
//         <button
//           className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//         >
//           Prev
//         </button>

//         <span>
//           Page {page} / {totalPages}
//         </span>

//         <button
//           className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
//           disabled={page === totalPages}
//           onClick={() => setPage(page + 1)}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default BudgetList;
