import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [sqlQuery, setSqlQuery] = useState("SHOW TABLES;");
  const [error, setError] = useState("");
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
    } catch (err) {
      setError("無法連線到 Node.js 後端伺服器，請確認 server.js 是否有啟動。");
    }
  };

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
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
        <h2>🕵️‍♂️ 串流平台異常帳號查詢 (React + MySQL)</h2>
        <p>請輸入 SQL 指令：</p>

        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          style={{ width: '100%', height: '120px', padding: '10px', fontSize: '16px', background: '#222', color: '#fff' }}
        />
        <br />
        <button
          onClick={handleExecuteSQL}
          style={{ marginTop: '10px', padding: '10px 20px', background: '#E50914', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          執行 SQL
        </button>

        {error && <div style={{ color: '#ff5555', marginTop: '10px', fontWeight: 'bold' }}>{error}</div>}

        {renderTable()}
      </div>
    </>
  )
}

export default App;
