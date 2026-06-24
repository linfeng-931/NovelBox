import { useState, useEffect } from 'react'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';

import Header from '@/component/Header';
import { 
    handleGetChapterDetail, 
    handleUpdateChapterViewCount, 
    handleUpdateUserPoint, 
    handleCreateReadData,
    handleCreateTransactionData,
    handleCheckTransactionData
} from '@/utils/linkDB'
import { ChevronLeft } from 'lucide-react';

export default function Chapter({ user, fetchUserData }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { chapterId, allChapters } = location.state || {};

    const [alert, setAlert] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);

    const [chapter, setChapter] = useState(null);

    useEffect(() => {
        if (chapterId) {
            handleGetChapterDetail(setChapter, chapterId);
        }
    }, [chapterId]);

    const handleBackToBook = () => {
        if (chapter?.novel_id) {
            navigate('/bookDetail', { state: { novelId: chapter.novel_id } });
        } else {
            navigate('/');
        }
    };

    const publishedChapters = allChapters ? allChapters.filter(c => c.status !== 'draft') : [];
    const currentIdx = publishedChapters.findIndex(c => c.chapter_id === chapterId);

    const prevChapter = currentIdx > 0 ? publishedChapters[currentIdx - 1] : null;
    const nextChapter = currentIdx !== -1 && currentIdx < publishedChapters.length - 1 ? publishedChapters[currentIdx + 1] : null;

    const handleSwitchChapter = async (targetChapter) => {
        if (!targetChapter) return;
        if (!user?.user_id) return window.alert("請先登入帳號！");

        if (targetChapter.price === 0) {
            await proceedToChapter(targetChapter.chapter_id);
            return; 
        }

        const check = await handleCheckTransactionData(user.user_id, targetChapter.chapter_id);
        
        if (check?.success && check.purchased) {
            await proceedToChapter(targetChapter.chapter_id);
        } else {
            setSelectedChapter(targetChapter);
            setAlert(true);
        }
    };

    const proceedToChapter = async (targetChapterId) => {
        try {
            const currentUserId = user?.user_id || 0;        
            await handleUpdateChapterViewCount(targetChapterId, currentUserId);
            await handleCreateReadData(chapter?.novel_id, currentUserId, targetChapterId);
            
            setAlert(false);
            navigate('/chapterDetail', { state: { chapterId: targetChapterId, allChapters } });
        } catch (error) {
            console.error("更新點閱率或經驗值失敗：", error);
        }
    };

    const clickAlertBtn = async () => {
        if (!user?.user_id) return window.alert("請先登入帳號！");
        if (!selectedChapter) return;

        const result = await handleUpdateUserPoint(user.user_id, 'deduct', selectedChapter.price);
        
        const result2 = await handleCreateTransactionData(user.user_id, selectedChapter.chapter_id, selectedChapter.price);
        
        if (result?.success && result2?.success) {
            if (typeof fetchUserData === 'function') fetchUserData();

            await proceedToChapter(selectedChapter.chapter_id);
        }
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <Header page={0} user={user} />
            {chapter ? (
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, width: '100%', marginBottom:40}}>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <ChevronLeft className='fontBtn' onClick={handleBackToBook}/>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                            <h1 className="title1" style={{ textAlign: 'center', marginBottom: 10 }}>
                                第 {chapter?.number} 章：{chapter?.title}
                            </h1>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
                                <p className="tag1">點閱率：{chapter?.view_count || 0}</p>
                                <p className="tag1">發佈時間：{chapter?.time ? new Date(chapter?.time).toLocaleDateString() : ''}</p>
                            </div>
                        </div>
                        <div></div>
                    </div>

                    <hr style={{ opacity: 0.2, marginBottom: 30 }} />

                    <div className="content1" style={{ fontSize: '18px', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: 100 }}>
                        {chapter?.content || "（本章無內容）"}
                    </div>

                    {/* 按鈕控制區 */}
                    <div style={{display:'flex', width:'100%', justifyContent:'space-between', flexWrap:'wrap', gap:10}}>
                        <button 
                            style={{ width: '40%', minWidth: 300 }} 
                            className={prevChapter ? 'normalBtn2':'disableNormalBtn2'}
                            disabled={!prevChapter}
                            onClick={() => handleSwitchChapter(prevChapter)}
                        >
                            {prevChapter ? '上一章' : '已是第一章'}
                        </button>

                        <button 
                            style={{ width: '40%', minWidth: 300 }}
                            className={nextChapter ? 'normalBtn':'disableNormalBtn'}
                            disabled={!nextChapter}
                            onClick={() => handleSwitchChapter(nextChapter)}
                        >
                            {nextChapter ? '下一章' : '已是最新章節'}
                        </button>
                    </div>
                </div>
            ) : (
                <p style={{ textAlign: 'center', marginTop: 40 }} className="tag1">章節載入中...</p>
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
                            下一章為付費章節：<br />
                            <strong style={{ color: '#000' }}>第 {selectedChapter?.number} 章：{selectedChapter?.title}</strong><br />
                            需要扣除：<span className='tag3'>{selectedChapter?.price} 點</span>
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