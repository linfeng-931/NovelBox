import '../App.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import novelBoxLogo from '../assets/image/novelBoxLogo.png'
import CenterUnderline from '@/components/fancy/text/underline-center'
import { Search } from 'lucide-react'

export default function Header() {
    const [inputValue, changeInputValue] = useState("");
    return (
        <div style={{
            width: '100%',
            height: '4.2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingLeft: '5rem',
            paddingRight: '5rem',
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

            <nav style={{ display: 'flex', gap: '20px', padding: '10px', alignItems:'center', gap:'3rem'}}>
                <Link to="/" className="content1" style={{ textDecoration: 'none'}}>
                    <CenterUnderline>首頁</CenterUnderline>
                </Link>
                <Link to="/novels" className="content1" style={{ textDecoration: 'none' }}>
                    <CenterUnderline>書庫</CenterUnderline>
                </Link>
                <Link to="/profile" className="content1" style={{ textDecoration: 'none' }}>
                    <CenterUnderline>書架</CenterUnderline>
                </Link>
                <div style={{display: 'flex', backgroundColor:'rgba(0, 0, 0, 0.1)', padding: 8, borderRadius: 20, width: '15rem', gap: 10, alignItems:'center'}}>
                    <Search size={18}/>
                    <input
                        type='text'
                        value={inputValue}
                        onChange={(e) => changeInputValue(e.target.value)}
                        placeholder="請輸入書名或作者名"
                        style={{fontSize: 14, backgroundColor: 'rgba(0, 0, 0, 0)', border:'none', outline: 'none'}}
                    />
                </div>
                <Link to="/profile" className="content1" style={{ textDecoration: 'none' }}>
                    <CenterUnderline>登入</CenterUnderline>
                </Link>
            </nav>

        </div>
    );
}