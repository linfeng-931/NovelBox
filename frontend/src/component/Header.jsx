import '../App.css'
import { Link } from 'react-router-dom';
import novelBoxLogo from '../assets/image/novelBoxLogo.png'
// 💡 關鍵：改成整包引入，這樣就能 100% 透過 Tabs.XXX 的方式呼叫，絕對不會漏掉任何元件

export default function Header() {
    return (
        <div style={{
            width: '100%',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingLeft: 30,
            paddingRight: 30,
            boxSizing: 'border-box'
        }}>
            <div style={{ gap: 12, display: 'flex', alignItems: 'center' }}>
                <img
                    src={novelBoxLogo}
                    alt="logo"
                    style={{ width: '45px', height: '45px' }}
                />
                <h1 className='title0'>NOVEL BOX</h1>
            </div>

            <nav style={{ display: 'flex', gap: '20px', padding: '10px' }}>
                <Link to="/" className='content1' style={{ textDecoration: 'none' }}>首頁</Link>
                <Link to="/novels" style={{ textDecoration: 'none' }}>書庫</Link>
                <Link to="/profile" style={{ textDecoration: 'none' }}>書櫃</Link>
                <Link to="/profile" style={{ textDecoration: 'none' }}>登入</Link>
            </nav>

        </div>
    );
}