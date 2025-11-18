import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 mb-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate("/dashboard")}>
          Budget Tracker
        </h1>

        <div className="flex gap-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/budget"
            className={({ isActive }) =>
              `font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
          >
            Budget
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
          >
            Transactions
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`
            }
          >
            Categories
          </NavLink>



          <button
            onClick={logout}
            className="font-medium text-red-600 ml-4"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
