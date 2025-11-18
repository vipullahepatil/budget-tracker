
function CategoryList({
  categories,
  filters,
  setFilters,
  page,
  setPage,
  totalPages,
  onEdit,
  onRefresh
}) {
  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Category List</h2>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">

        <input
          type="text"
          className="input"
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
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
          className="bg-blue-600 text-white px-3 rounded"
          onClick={() => {
            setPage(1);
            onRefresh();
          }}
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-b">
              <td className="p-2">{cat.name}</td>
              <td className="p-2 capitalize">{cat.type}</td>

              <td className="p-2 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => onEdit(cat)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={async () => {
                    await api.deleteCategory(cat.id);
                    onRefresh();
                  }}
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

export default CategoryList;
