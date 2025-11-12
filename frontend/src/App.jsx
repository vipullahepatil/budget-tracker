// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";


function App() {
  const token = localStorage.getItem("access_token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/transactions"
          element={token ? <Transactions /> : <Navigate to="/" />}
        />
        <Route
          path="/budget"
          element={token ? <Budget /> : <Navigate to="/" />}
        />

      </Routes>
    </Router>
  );
}

export default App;
