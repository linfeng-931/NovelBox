import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {

  /*const [error, setError] = useState("");
  const [dbData, setDbData] = useState([]);
  const handleExecuteSQL = async () => {
    setError("");
    setDbData([]);

    try {
      const response = await fetch('http://localhost:3000/api/run-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sqlQuery: sqlQuery })
      });

      const result = await response.json();

      if (!result.success) {
        setError("SQL錯誤: " + result.error);
        return;
      }

      setDbData(result.data);
    } catch (error) {
      setError("無法連線到 Node.js 後端伺服器，請確認 server.js 是否有啟動。");
    }
  };*/

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </>
  )
}

export default App;
