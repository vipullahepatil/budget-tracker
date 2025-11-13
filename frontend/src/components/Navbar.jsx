import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const linkClasses = (path) =>
    `px-4 py-2 rounded-md transition-all duration-200 ${location.pathname === path
      ? "bg-white text-blue-600 font-semibold shadow-sm"
      : "hover:bg-blue-500 text-white"
    }`;

  return (
    <nav className="bg-blue-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Logo / App Name */}
          <Link
            to="/dashboard"
            className="text-white font-bold text-xl tracking-wide hover:opacity-90"
          >
            💰 Budget Tracker
          </Link>

          <div className="flex space-x-2">
            <Link to="/dashboard" className={linkClasses("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/transactions" className={linkClasses("/transactions")}>
              Transactions
            </Link>
            <Link to="/budget" className={linkClasses("/budget")}>
              Budget
            </Link>
          </div>


          {/* Mobile Menu (Optional Future Enhancement) */}
          {/* You can add a menu icon toggle here for small screens if needed */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
