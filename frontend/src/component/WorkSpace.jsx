import { useEffect, useState } from 'react'
import '../App.css'
import { handleGetBookChapters } from '@/utils/linkDB';
import WorkCard2 from './WorkCard2';
import { Plus } from 'lucide-react';
import ChapterEdit from './ChapterEdit';

export default function WorkSpace({ data, setChapterTitle, setFrame, createChapter, handleReturnPage, refreshTrigger, setRefreshTrigger}) {
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [page, setPage] = useState(1);

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

    const handleGoToEdit = (chapter) =>{
        setPage(2);
        setCurrentChapter(chapter);
    };
    
    return (
        <>
        {page === 1 &&
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
                <p>編輯作品</p>
                <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ height: 200, width: 140, borderRadius: 5, backgroundColor: '#ddd' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <p className='title2'>{data.name}</p>
                        <p className='tag1'>{data.status}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <p className='title2'>小說章節</p>
                    {chapters.length >0 ? chapters.map((chapter, index) => {
                        return <WorkCard2 key={chapter.chapter_id} data={chapter} action={() => handleGoToEdit(chapter)}/>
                    }):
                    <p className='tag1' style={{width: '100%', textAlign:'center'}}>還沒有章節喔！</p>
                    }
                    <button 
                    className='normalBtn' 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, maxWidth: 400 }}
                    onClick={()=>setFrame(true)}
                    ><Plus size={18} />新增章節</button>
                </div>
            </div>
        }
        {page === 2 && <ChapterEdit data={currentChapter} setRefreshTrigger={setRefreshTrigger} setPage2={setPage}/>}
        </>
    )
}