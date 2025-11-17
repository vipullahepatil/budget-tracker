import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

// FIXED LOGIN ENDPOINT
export default {
  login: (data) => api.post("/auth/login/", data),

  getSummary: (params) => api.get("/dashboard/", { params }),

  getTransactions: (params) => api.get("/transactions/", { params }),
  createTransaction: (data) => api.post("/transactions/", data),
  updateTransaction: (id, data) => api.put(`/transactions/${id}/`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}/`),

  getCategories: () => api.get("/categories/"),
  createCategory: (data) => api.post("/categories/", data),

  saveBudget: (data) => api.post("/budgets/", data),
  getBudget: (params) => api.get("/budgets/", { params }),
  updateBudget: (id, data) => api.put(`/budgets/${id}/`, data),
  deleteBudget: (id) => api.delete(`/budgets/${id}/`),

};

