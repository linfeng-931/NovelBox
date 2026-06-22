import { useState } from 'react'
import '../App.css'
import Header2 from '@/component/Header2';
import { Link } from 'react-router-dom'
import { handleLogout, handleCreateNovelTable } from '@/utils/linkDB';
import { useNavigate } from "react-router-dom";
import { House, ChartColumn, CircleDollarSign, PenLine, LogOut, Undo2, Book, CircleX } from 'lucide-react';

export default function CreatorPage({ setUser, user, tags }) {
    const navigate = useNavigate();
    const Logout = async (e) => {
        handleLogout(setUser, navigate);
    }
    const [page, setPage] = useState(1);

    const [creat, setCreat] = useState(false);
    const [novelName, setNovelName] = useState('');
    const [novelTag, setNovelTag] = useState([]);

    //Error messages
    const [novelNameError, setNovelNameError] = useState('');
    const [novelTagError, setNovelTagError] = useState('');

    const handleNovelNameChange = (e) => {
        const value = e.target.value;
        setNovelName(value);

        if (!value) {
            setNovelNameError("請輸入書名");
        } else {
            setNovelNameError('');
        }
    };

    const handleTagChange = (e, currentTag) => {
        const isChecked = e.target.checked;

        let updatedTags;
        if (isChecked) {
            updatedTags = [...novelTag, currentTag];
        } else {
            updatedTags = novelTag.filter(t => t !== currentTag);
        }
        
        setNovelTag(updatedTags);

        if(updatedTags.length === 0){
            setNovelTagError("請勾選至少一項標籤");
        }else {
            setNovelTagError('');
        }
    };

    const handleReturnPage = () =>{
        setNovelName('')
        setNovelNameError('');
        setNovelTagError('');
        setNovelTag([]);
        setCreat(false);
    }

    const isDisabled =
        novelName == '' ||
        novelTag.length == 0 ||
        novelTagError !== '' ||
        novelNameError !== '';

    const CreateBook = async() =>{
        const novelData = {
            name: novelName,
            tag: novelTag,
            authId: user.user_id
        };
        handleCreateNovelTable(novelData);
    }

    const newBook = (
        <div
            style={{
                position: 'absolute',
                width: '100%',
                height: '100vh',
                backgroundColor: '#ff3f3f20',
                backdropFilter: 'blur(8px)',
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div
                style={{
                    width: '30rem',
                    backgroundColor: '#ffffffff',
                    borderRadius: 8,
                    padding: 30,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 25
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 10 }}>
                    <p className='title2'>作品名稱</p>
                    <input
                        className="frameInput"
                        type="text"
                        placeholder="請輸入書名"
                        onChange={handleNovelNameChange}
                    />
                    <div style={{ marginTop: 5 }}>
                        {novelNameError &&
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <CircleX size={18} color="red" />
                                <p className="errorMessage">{novelNameError}</p>
                            </div>
                        }
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <p className='title2'>作品標籤</p>
                        <p className='tag1'>（請至少選擇一項）</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between' }}>
                        {tags.map((tag, index) => {
                            return (
                                <div key={index} style={{ display: 'flex', gap: 5, width: '75px', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        id="privacy"
                                        className='checkBox'
                                        onClick={(e) => handleTagChange(e,tag)}
                                    />
                                    <p className='content1'>{tag}</p>
                                </div>
                            )
                        }
                        )}
                    </div>
                    <div style={{ marginTop: 5 }}>
                        {novelTagError &&
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <CircleX size={18} color="red" />
                                <p className="errorMessage">{novelTagError}</p>
                            </div>
                        }
                    </div>
                </div>
                <div style={{ display: 'flex', width: '100%', gap: 20 }}>
                    <button
                        className='normalBtn2'
                        style={{ width: '100%' }}
                        onClick={handleReturnPage}
                    >返回</button>
                    <button
                        className={!isDisabled ? 'normalBtn' : 'disableNormalBtn'}
                        style={{ width: '100%' }}
                        disabled={isDisabled}
                        onClick={CreateBook}
                    >創建作品</button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Header2 />
            <div style={{
                marginTop: 20,
                width: '16rem',
                boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.1)',
                padding: 30,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 20,
                height: '85vh'
            }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                    }}
                >
                    <button onClick={() => setCreat(true)} className='normalBtn' style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><PenLine size={18} />開新書</button>

                    {page === 1 ?
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ff7474ff', display: 'flex', alignItems: 'center', gap: 20 }}>
                            <House size={18} />主頁
                        </div>
                        :
                        <button onClick={() => setPage(1)} className='fontBtn' style={{ display: 'flex', alignItems: 'center', gap: 20 }}><House size={18} />主頁</button>
                    }
                    {page === 2 ?
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ff7474ff', display: 'flex', alignItems: 'center', gap: 20 }}>
                            <Book size={18} />我的作品
                        </div>
                        :
                        <button onClick={() => setPage(2)} className='fontBtn' style={{ display: 'flex', alignItems: 'center', gap: 20 }}><Book size={18} />我的作品</button>
                    }
                    <hr style={{ opacity: 0.3, marginTop: 10, marginBottom: 10 }} />
                    {page === 3 ?
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ff7474ff', display: 'flex', alignItems: 'center', gap: 20 }}>
                            <ChartColumn size={18} />數據中心
                        </div>
                        :
                        <button onClick={() => setPage(3)} className='fontBtn' style={{ display: 'flex', alignItems: 'center', gap: 20 }}><ChartColumn size={18} />數據中心</button>
                    }
                    {page === 4 ?
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ff7474ff', display: 'flex', alignItems: 'center', gap: 20 }}>
                            <CircleDollarSign size={18} />我的收益
                        </div>
                        :
                        <button onClick={() => setPage(4)} className='fontBtn' style={{ display: 'flex', alignItems: 'center', gap: 20 }}><CircleDollarSign size={18} />我的收益</button>
                    }
                    <hr style={{ opacity: 0.3, marginTop: 10, marginBottom: 10 }} />
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                    }}
                >
                    <hr style={{ opacity: 0.3, marginTop: 10, marginBottom: 10 }} />
                    <Link to="/" className="fontBtn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 20 }}>
                        <Undo2 size={18} />返回讀書區
                    </Link>
                    <button className="fontBtn" onClick={Logout} style={{ display: 'flex', alignItems: 'center', gap: 20 }}><LogOut size={18} />登出</button>
                </div>
            </div>
            {creat && newBook}
        </div>
    )
}