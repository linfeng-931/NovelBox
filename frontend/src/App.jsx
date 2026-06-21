import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
const host = 'http://localhost:3000';

function App() {
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
          console.log(data);
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
        <Route path="/" element={<HomePage setUser={setUser} user={user}/>} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage setUser={setUser} />} />
        <Route path="/user" element={user ? <UserPage setUser={setUser} user={user}/> : <Navigate to="/" replace />}/>
      </Routes>
    </>
  )
}

export default App;
