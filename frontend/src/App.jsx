import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import CreatorPage from './pages/CreatorPage';
import { handleGetTags } from './utils/linkDB';
const host = 'http://localhost:3000';

function App() {
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleGetTags(setTags).catch(err => console.log("單獨撈取標籤失敗：", err));

    const initAuth = async () => {
      try {
        const res = await fetch(`${host}/api/getUserData`, {
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error(`HTTP 錯誤！狀態碼: ${res.status}`);
        }

        const data = await res.json();

        if (data.success && data.user) {
          setUser(data.user);
          console.log("登入成功，使用者資料：", data.user);
        } else {
          console.log("驗證失敗：", data.error);
          setUser(null);
        }
      } catch (err) {
        console.log("連線或驗證失敗：", err.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  if (isLoading) {
    return <div>驗證登入狀態中...</div>
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage setUser={setUser} user={user} />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage setUser={setUser} />} />
        <Route path="/user" element={user ? <UserPage setUser={setUser} user={user} /> : <Navigate to="/" replace />} />
        <Route path="/creator" element={user ? <CreatorPage setUser={setUser} user={user} tags={tags}/> : <Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App;
