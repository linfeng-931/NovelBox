import { useState, useEffect } from 'react'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';

import Header from '@/component/Header';
import { handleGetChapterDetail, handleUpdateChapterViewCount } from '@/utils/linkDB'
import { ChevronLeft } from 'lucide-react';

export default function Chapter({ user }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { chapterId, allChapters } = location.state || {};

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

    const currentIdx = allChapters ? allChapters.findIndex(c => c.chapter_id === chapterId) : -1;

    const prevChapter = currentIdx > 0 ? allChapters[currentIdx - 1] : null;
    const nextChapter = allChapters && currentIdx < allChapters.length - 1 ? allChapters[currentIdx + 1] : null;

    const handleSwitchChapter = async (targetChapterId) => {
        try {
            const currentUserId = user?.user_id || 0;        
            await handleUpdateChapterViewCount(targetChapterId, currentUserId);
        } catch (error) {
            console.error("更新點閱率或經驗值失敗：", error);
        }
        
        navigate('/chapterDetail', { state: { chapterId: targetChapterId, allChapters } });
    };

    return (
        <div>
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
                                <p className="tag1">發佈時間：{new Date(chapter?.time).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div></div>
                    </div>

                    <hr style={{ opacity: 0.2, marginBottom: 30 }} />

                    <div className="content1" style={{ fontSize: '18px', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: 100 }}>
                        {chapter?.content || "（本章無內容）"}
                    </div>

                    <div style={{display:'flex', width:'100%', justifyContent:'space-between', flexWrap:'wrap', gap:10}}>
                        <button 
                            style={{ 
                                width: '40%', 
                                minWidth: 300, 
                            }} 
                            className={prevChapter ? 'normalBtn2':'disableNormalBtn2'}
                            disabled={!prevChapter}
                            onClick={() => handleSwitchChapter(prevChapter.chapter_id)}
                        >
                            {prevChapter ? '上一章' : '已是第一章'}
                        </button>

                        <button 
                            style={{ 
                                width: '40%', 
                                minWidth: 300, 
                            }}
                            className={nextChapter ? 'normalBtn':'disableNormalBtn'}
                            disabled={!nextChapter}
                            onClick={() => handleSwitchChapter(nextChapter.chapter_id)}
                        >
                            {nextChapter ? '下一章' : '已是最新章節'}
                        </button>
                    </div>
                </div>
            ) : (
                <p style={{ textAlign: 'center', marginTop: 40 }} className="tag1">章節載入中...</p>
            )}
        </div>
    )
}