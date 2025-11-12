import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between">
      <h1 className="font-semibold text-lg">Budget Tracker</h1>
      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/budget">Budget</Link>
      </div>
    </nav>
  );
}

export default Navbar;
