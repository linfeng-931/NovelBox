import { useState, useEffect } from "react";
import { handleGetReadData } from "@/utils/linkDB";
import '../App.css'
import { useNavigate } from "react-router-dom";

function WorkCard({ data, action }) {
    return (
        <div
            style={{
                backgroundColor: '#f5f5f5ff',
                width: '100%',
                borderRadius: 5,
                overflow: "hidden",
                display: 'flex',
                gap: 10,
                cursor: 'pointer'
            }}
            onClick={action}
        >
            <div style={{ backgroundColor: '#ddd', width: 100, minHeight: 120 }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 15, justifyContent: 'center' }}>
                <p className='title2'>{data.name}</p>
                <p className='tag1'>{data.status}</p>
            </div>
        </div>
    )
}

export default function NovelRecord({ user }) {
    const [record, setRecord] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.user_id) {
            handleGetReadData(setRecord, user.user_id);
        }
    }, [user]);

    const handleGoToChapter = (recordItem) => {
        navigate('/chapterDetail', {
            state: {
                chapterId: recordItem.chapter_id,
                allChapters: null
            }
        });
    };

    //取最大一章
    const uniqueRecords = record ? Object.values(
        record.reduce((acc, item) => {
            const currentNovelId = item.novel_id;
            if (!acc[currentNovelId] || item.chapter_number > acc[currentNovelId].chapter_number) {
                acc[currentNovelId] = item;
            }
            return acc;
        }, {})
    ) : [];

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center', padding: '20px 0' }}>
            <p className="title1" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>閱讀紀錄</p>

            <div style={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 15 }}>
                {uniqueRecords.length > 0 ? uniqueRecords.map((item, index) => {
                    const fullNovelName = item.novel_name || "未知小說";
                    const fullChapterTitle = item.chapter_title || "無章節名稱";

                    const cardData = {
                        name: fullNovelName,
                        status: `第 ${item.chapter_number} 章 ${fullChapterTitle}`,
                        view_count: 0
                    };

                    return (
                        <WorkCard
                            key={item.record_id || index}
                            data={cardData}
                            action={() => handleGoToChapter(item)}
                        />
                    );
                }) : (
                    <p className="tag1" style={{ textAlign: 'center', marginTop: 20 }}>沒有任何閱讀紀錄</p>
                )}
            </div>
        </div>
    )
}