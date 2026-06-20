import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
const host = 'http://localhost:3000';

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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${host}/api/me`, {
          credentials: 'include'
        });
        const data = await res.json();

        if (data.loggedIn) {
          setUser(data.user);
        }
      } catch (err) {
        console.log("未登入");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if(isLoading){
    return <div>驗證登入狀態中...</div>
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage setUser={setUser}/>} />
        <Route path="/login" element={user ? <Navigate to="/"/> : <LoginPage setUser={setUser}/>} />
      </Routes>
    </>
  )
}

export default App;
