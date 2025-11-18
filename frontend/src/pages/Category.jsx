import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";

function Category() {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await api.getCategories({
        page,
        page_size: pageSize,
        search: filters.search,
        type: filters.type,
      });

      const items = res.data.results?.data || [];
      const count = res.data.count || 0;

      setCategories(items);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (err) {
      console.log("Category fetch error:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Category Manager</h1>

        {/* FORM */}
        <CategoryForm
          category={selectedCategory}
          onSaved={() => {
            setSelectedCategory(null);
            loadCategories();
          }}
        />

        {/* LIST */}
        <CategoryList
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          onEdit={(cat) => setSelectedCategory(cat)}
          onRefresh={loadCategories}
        />
      </div>
    </div>
  );
}

export default Category;