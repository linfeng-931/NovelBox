import { useState, useEffect } from 'react'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

import Header from '@/component/Header';
import WorkCard2 from '@/component/WorkCard2';

import { handleGetBookDetail, handleGetBookChapters, handleUpdateChapterViewCount, handleGetOtherUserData, handleCreateReadData } from '@/utils/linkDB'
//handleCreateReadData = async (novelId, userId, chapterId)
export default function BookDetail({ user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { novelId } = location.state || {};

    const [book, setBook] = useState(null);
    const [chapters, setChapters] = useState(null);
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        if (novelId) {
            handleGetBookDetail(setBook, novelId);
            handleGetBookChapters(setChapters, novelId);
        }
    }, [novelId]);

    useEffect(() => {
        if (book && book.auth) {
            handleGetOtherUserData(setAuth, book?.auth);
        }
    }, [book]);

    const handleGoToDetail = async (chapterId) => {
        await handleUpdateChapterViewCount(chapterId, user.user_id);
        await handleCreateReadData(novelId, user.user_id, chapterId);
        navigate('/chapterDetail', { state: { chapterId, allChapters: chapters } });
    };

    return (
        <div>
            <Header page={0} user={user} />
            <div style={{ position: 'absolute', zIndex: -1, backgroundColor: '#f5f5f5ff', width: '100%', height: 400 }}></div>
            {book ? (
                <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
                    <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 50, width:'100%', maxWidth: 1000 }}>
                        <div style={{ display: 'flex', gap: 20, width: '50%', minWidth: 700, marginBottom:60 }}>
                            <div style={{ width: 223, height: 301, backgroundColor: '#ddd', borderRadius: 5 }}></div>
                            <div style={{ display: 'flex', gap: 10, flexDirection: 'column', justifyContent:'space-between'}}>
                            <div style={{ display: 'flex', gap: 10, flexDirection: 'column', width: 400 }}>
                                <h1 className="title1">{book?.name}</h1>
                                <div style={{display:'flex', gap: 10}}><p className='title2'>作者</p><p className='title2'>{auth?.name}</p></div>
                                <p className="tag1" style={{ display: 'flex', flexDirection: 'center', alignItems: 'center', gap: 10 }}><Eye size={18} />{book?.view_count}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                {book?.tag.map((t, idx) => <span key={idx} className="tag1" style={{ backgroundColor: '#eee', padding: '2px 8px', borderRadius: 4 }}>{t}</span>)}
                            </div>
                            </div> 
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                            <p className='title2' style={{ width: '100%' }}>簡介</p>
                            <p className="content1">{book?.introduction || "暫無簡介"}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                            <p className='title2' style={{ width: '100%' }}>小說章節</p>
                            {chapters?.length > 0 ? chapters?.map((chapter, index) => {
                                return <WorkCard2 isReader={true} key={chapter.chapter_id} data={chapter} action={() => handleGoToDetail(chapter.chapter_id)} />
                            }) :
                                <p className='tag1' style={{ width: '100%', textAlign: 'center' }}>還沒有章節喔！</p>
                            }
                        </div>
                    </div>
                </div>
            ) : (
                <p style={{ textAlign: 'center', marginTop: 40 }} className="tag1">資料載入中...</p>
            )}
        </div>
    )
}
