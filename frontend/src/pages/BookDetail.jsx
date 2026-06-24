import { useState, useEffect } from 'react'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

import Header from '@/component/Header';
import WorkCard2 from '@/component/WorkCard2';

import {
    handleGetBookDetail,
    handleGetBookChapters,
    handleUpdateChapterViewCount,
    handleGetOtherUserData,
    handleCreateReadData,
    handleUpdateUserPoint,
    handleCreateTransactionData,
    handleCheckTransactionData
} from '@/utils/linkDB'

export default function BookDetail({ user, fetchUserData }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { novelId } = location.state || {};

    const [book, setBook] = useState(null);
    const [chapters, setChapters] = useState(null);
    const [auth, setAuth] = useState(null);

    const [alert, setAlert] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);

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

    const clickChapter = async (chapter) => {
        if (!user?.user_id) return window.alert("請先登入帳號！");

        if (chapter.price === 0) {
            handleGoToDetail(chapter.chapter_id);
            return;
        }

        const check = await handleCheckTransactionData(user.user_id, chapter.chapter_id);
        
        if (check?.success && check.purchased) {
            handleGoToDetail(chapter.chapter_id);
        } else {
            setSelectedChapter(chapter);
            setAlert(true);
        }
    }

    const clickAlertBtn = async () => {
        if (!user?.user_id) return window.alert("請先登入帳號！");
        if (!selectedChapter) return;

        const result = await handleUpdateUserPoint(user.user_id, 'deduct', selectedChapter.price);
        
        const result2 = await handleCreateTransactionData(user.user_id, selectedChapter.chapter_id, selectedChapter.price);

        if (result?.success && result2?.success) {
            setAlert(false);

            if (typeof fetchUserData === 'function') fetchUserData();
            handleGoToDetail(selectedChapter.chapter_id);
        }
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <Header page={0} user={user} />
            <div style={{ position: 'absolute', zIndex: -1, backgroundColor: '#f5f5f5ff', width: '100%', height: 400 }}></div>
            {book ? (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 50, width: '100%', maxWidth: 1000 }}>
                        {/* 小說基本資料區塊 */}
                        <div style={{ display: 'flex', gap: 20, width: '50%', minWidth: 700, marginBottom: 60 }}>
                            <div style={{ width: 223, height: 301, backgroundColor: '#ddd', borderRadius: 5 }}></div>
                            <div style={{ display: 'flex', gap: 10, flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: 10, flexDirection: 'column', width: 400 }}>
                                    <h1 className="title1">{book?.name}</h1>
                                    <div style={{ display: 'flex', gap: 10 }}><p className='title2'>作者</p><p className='title2'>{auth?.name}</p></div>
                                    <p className="tag1" style={{ display: 'flex', flexDirection: 'center', alignItems: 'center', gap: 10 }}><Eye size={18} />{book?.view_count}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                    {book?.tag.map((t, idx) => <span key={idx} className="tag1" style={{ backgroundColor: '#eee', padding: '2px 8px', borderRadius: 4 }}>{t}</span>)}
                                </div>
                            </div>
                        </div>

                        {/* 簡介區塊 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                            <p className='title2' style={{ width: '100%' }}>簡介</p>
                            <p className="content1">{book?.introduction || "暫無簡介"}</p>
                        </div>

                        {/* 章節列表區塊 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                            <p className='title2' style={{ width: '100%' }}>小說章節</p>
                            <div style={{ width: '100%', maxHeight: '600px', overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {chapters?.length > 0 ? chapters?.map((chapter, index) => {
                                    if (chapter.status !== 'draft') {
                                        return <WorkCard2 isReader={true} key={chapter.chapter_id} data={chapter} action={() => clickChapter(chapter)} />
                                    }
                                    return null;
                                }) :
                                    <p className='tag1' style={{ width: '100%', textAlign: 'center' }}>還沒有章節喔！</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p style={{ textAlign: 'center', marginTop: 40 }} className="tag1">資料載入中...</p>
            )}

            {alert && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: '#ff3f3f20',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 999
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '30px', borderRadius: 5,
                        width: '90%', maxWidth: '400px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px'
                    }}>
                        <h3 className="title1" style={{ marginBottom: 10 }}>解鎖付費章節</h3>
                        <p className="content1">
                            本次閱讀需要扣除：<span className='tag3'>{selectedChapter?.price} 點</span>
                        </p>

                        <p className="tag1">目前您剩餘的點數：{user?.point || 0} 點</p>

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
                            <button
                                onClick={() => setAlert(false)}
                                className='normalBtn2'
                                style={{ width: 100 }}
                            >
                                取消
                            </button>
                            <button
                                onClick={clickAlertBtn}
                                className={user?.point < (selectedChapter?.price || 0) ? 'disableNormalBtn' : 'normalBtn'}
                                style={{ width: 100 }}
                                disabled={user?.point < (selectedChapter?.price || 0)}
                            >
                                {user?.point < (selectedChapter?.price || 0) ? '點數不足' : '確認付費'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}