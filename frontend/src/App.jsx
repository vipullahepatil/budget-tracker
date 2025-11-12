// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  const API_BASE_URL = import.meta.env.VITE_API_URL
    // "https://budget-tracker-bvrx.onrender.com"; // use full Render URL

  useEffect(() => {
    fetch(`${API_BASE_URL}/health/`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setMessage(`Backend says: ${data.status}`))
      .catch(() => setMessage("Backend not reachable"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>Personal Budget Tracker</h1>
      <h2>Frontend Health Check</h2>
      <p>{message}</p>
    </div>
  );
}

export default App;
