import { useEffect, useState } from 'react'
import '../App.css'
import { handleGetBookChapters } from '@/utils/linkDB';
import WorkCard2 from './WorkCard2';
import { Plus, EllipsisVertical, BookOpenCheck, Settings, Trash2, ChevronLeft } from 'lucide-react';
import ChapterEdit from './ChapterEdit';
import BookEdit from './BookEdit';

export default function WorkSpace({ setPage2, data, tags, setChapterTitle, setFrame, createChapter, handleReturnPage, refreshTrigger, setRefreshTrigger }) {
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [page, setPage] = useState(1);
    const [subPage, setSubPage] = useState(false);

    useEffect(() => {
        handleGetBookChapters(setChapters, data.novel_id)
            .catch(err => console.log("撈取作品失敗：", err));
    }, [data.novel_id, refreshTrigger]);

    useEffect(() => {
        if (currentChapter && chapters.length > 0) {
            const updated = chapters.find(ch => ch.chapter_id === currentChapter.chapter_id);
            if (updated) {
                setCurrentChapter(updated);
            }
        }
    }, [chapters]);

    const handleGoToEdit = (chapter) => {
        setPage(2);
        setCurrentChapter(chapter);
    };

    return (
        <>
            {page === 1 &&
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
                        <button className='fontBtn' style={{ display: 'flex', alignItems: 'center' }} onClick={() => setPage2(1)}><ChevronLeft /></button>
                        <p>編輯作品</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 20 }}>
                            <div style={{ height: 200, width: 140, borderRadius: 5, backgroundColor: '#ddd' }}></div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <p className='title2'>{data.name}</p>
                                <p className='tag1'>{data.status}</p>
                            </div>
                        </div>
                        <div>
                            <EllipsisVertical size={18} className='fontBtn' onClick={() => setSubPage(!subPage)} />
                            {subPage &&
                                <div style={{
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    borderRadius: 5,
                                    padding: 20,
                                    position: 'absolute',
                                    right: 40,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 15
                                }}
                                >
                                    <button onClick={()=>setPage(3)} className='fontBtn' style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Settings size={18} />作品設定</button>
                                    <button className='fontBtn' style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Trash2 size={18} />刪除作品</button>
                                    <button className='fontBtn1' style={{ display: 'flex', gap: 10, alignItems: 'center' }}><BookOpenCheck size={18} />發佈作品</button>
                                </div>
                            }
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                        <p className='title2' style={{ width: '100%' }}>小說章節</p>
                        {chapters.length > 0 ? chapters.map((chapter, index) => {
                            return <WorkCard2 key={chapter.chapter_id} data={chapter} action={() => handleGoToEdit(chapter)} />
                        }) :
                            <p className='tag1' style={{ width: '100%', textAlign: 'center' }}>還沒有章節喔！</p>
                        }
                        <button
                            className='normalBtn'
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: 400 }}
                            onClick={() => setFrame(true)}
                        ><Plus size={18} />新增章節</button>
                    </div>
                </div>
            }
            {page === 2 && <ChapterEdit data={currentChapter} setRefreshTrigger={setRefreshTrigger} setPage2={setPage} />}
            {page === 3 && <BookEdit tags={tags} data={data} setRefreshTrigger={setRefreshTrigger} setPage={setPage}/>}
        </>
    )
}