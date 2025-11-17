import { useState, useEffect } from "react";
import api from "../services/api";

function BudgetForm({ budget, onSaved }) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [amount, setAmount] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (budget) {
      setMonth(budget.month);
      setYear(budget.year);
      setAmount(budget.amount);
    } else {
      setMonth("");
      setYear("");
      setAmount("");
    }
  }, [budget]);

  const saveBudget = async () => {
    setError("");
    setMsg("");

    try {
      if (budget) {
        await api.updateBudget(budget.id, { month, year, amount });
        setMsg("Budget updated successfully!");
      } else {
        await api.saveBudget({ month, year, amount });
        setMsg("Budget added successfully!");
      }

      setTimeout(() => setMsg(""), 1500);

      // Reset input fields
      setMonth("");
      setYear("");
      setAmount("");

      onSaved();
    } catch (err) {
      console.log("BACKEND ERROR:", err.response?.data);

      const backend = err.response?.data;

      const errMsg =
        backend?.data?.amount?.[0] ||
        backend?.data?.month?.[0] ||
        backend?.data?.year?.[0] ||
        backend?.message ||
        "Something went wrong";

      setError(errMsg);

      // Hide after 3 seconds
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">

      {/* ERROR ALERT */}
      {error && (
        <div className="p-3 mb-3 rounded bg-red-200 border border-red-600 text-red-800 font-bold">
          {error}
        </div>
      )}

      {/* SUCCESS ALERT */}
      {msg && (
        <div className="p-3 mb-3 rounded bg-green-200 border border-green-600 text-green-800 font-bold">
          {msg}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">
        {budget ? "Update Budget" : "Add Budget"}
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          type="number"
          className="input"
          placeholder="Month (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />

        <input
          type="number"
          className="input"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />

        <input
          type="number"
          className="input"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={saveBudget}
      >
        {budget ? "Update" : "Save"}
      </button>
    </div>
  );
}

export default BudgetForm;






// import { useState, useEffect } from "react";
// import api from "../services/api";

// function BudgetForm({ budget, onSaved }) {
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
//   const [amount, setAmount] = useState("");
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     if (budget) {
//       setMonth(budget.month);
//       setYear(budget.year);
//       setAmount(budget.amount);
//     } else {
//       setMonth("");
//       setYear("");
//       setAmount("");
//     }
//   }, [budget]);

//   const saveBudget = async () => {
//     try {
//       if (budget) {
//         await api.updateBudget(budget.id, { month, year, amount });
//         setMsg("Budget updated successfully!");
//       } else {
//         await api.saveBudget({ month, year, amount });
//         setMsg("Budget added successfully!");
//       }

//       // Show success then hide
//       setTimeout(() => setMsg(""), 1500);

//       // Reset fields after save
//       setMonth("");
//       setYear("");
//       setAmount("");

//       onSaved();
//     } catch (err) {
//       setMsg("Error saving budget");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow mb-6">

//       {msg && (
//         <div className="p-3 mb-3 rounded bg-green-200 border border-green-600 text-green-800 font-bold">
//           {msg}
//         </div>
//       )}

//       <h2 className="text-xl font-semibold mb-4">
//         {budget ? "Update Budget" : "Add Budget"}
//       </h2>

//       <div className="grid grid-cols-3 gap-4 mb-4">
//         <input
//           type="number"
//           className="input"
//           placeholder="Month (1-12)"
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//           required
//         />

//         <input
//           type="number"
//           className="input"
//           placeholder="Year"
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//           required
//         />

//         <input
//           type="number"
//           className="input"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           required
//         />
//       </div>

//       <button
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//         onClick={saveBudget}
//       >
//         {budget ? "Update" : "Save"}
//       </button>
//     </div>
//   );
// }

// export default BudgetForm;


// import { useState, useEffect } from "react";
// import api from "../services/api";

// function BudgetForm({ budget, onSaved }) {
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
//   const [amount, setAmount] = useState("");
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     if (budget) {
//       setMonth(budget.month);
//       setYear(budget.year);
//       setAmount(budget.amount);
//     } else {
//       setMonth("");
//       setYear("");
//       setAmount("");
//     }
//   }, [budget]);

//   const saveBudget = async () => {
//     try {
//       if (budget) {
//         await api.updateBudget(budget.id, { month, year, amount });
//         setMsg("Budget updated!");
//       } else {
//         await api.saveBudget({ month, year, amount });
//         setMsg("Budget added!");
//       }

//       setTimeout(() => setMsg(""), 1500);
//       onSaved();
//     } catch (err) {
//       setMsg("Error saving budget");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow mb-6">
//       {msg && (
//         <div className="p-3 mb-3 bg-green-200 border border-green-500 text-green-800 rounded">
//           {msg}
//         </div>
//       )}

//       <h2 className="text-xl font-semibold mb-4">
//         {budget ? "Update Budget" : "Add Budget"}
//       </h2>

//       <div className="grid grid-cols-3 gap-4 mb-4">
//         <input
//           type="number"
//           className="input"
//           placeholder="Month (1-12)"
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//         />

//         <input
//           type="number"
//           className="input"
//           placeholder="Year"
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//         />

//         <input
//           type="number"
//           className="input"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />
//       </div>

//       <button
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//         onClick={saveBudget}
//       >
//         {budget ? "Update" : "Save"}
//       </button>
//     </div>
//   );
// }

// export default BudgetForm;
