import { useState } from 'react'
import '../App.css'
import CarouselBar from '@/component/CarouselBar';
import Header from '@/component/Header';
import { handleLogout } from '@/utils/linkDB';

export default function HomePage({setUser}) {
  const [count, setCount] = useState(0);

  const Logout = async (e) => {
    handleLogout(setUser);
  }
  const renderTable = () => {
    if (dbData.length === 0) return <p>目前沒有資料</p>;

    const header = Object.keys(dbData[0]);

    return (
      <table>
        <thead>
          <tr>
            {header.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {dbData.map((row, idx) => (
            <tr key={idx}>
              {header.map(h => <td>{String(row[h])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      <Header page={1}/>
      <CarouselBar/>
      <button onClick={Logout}>登出測試鈕</button>
    </>
  )
}
