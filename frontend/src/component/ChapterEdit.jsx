import { useEffect, useState } from 'react'
import '../App.css'
import { handleUpdateChapterSetting, handleUpdateChapterContent } from '@/utils/linkDB';
import { Save, EllipsisVertical, ChevronLeft, CircleAlert } from 'lucide-react';

export default function ChapterEdit({ data, setRefreshTrigger, setPage2 }) {
    const [content, setContent] = useState(data.content);
    const [title, setTitle] = useState(data.title)
    const [page, setPage] = useState(1);
    const [price, setPrice] = useState(data.price || 0);
    const [isVip, setIsVip] = useState(data.price > 0);
    const [status, setStatus] = useState(data.status);

    useEffect(() => {
        if (data) {
            setContent(data.content);
            setTitle(data.title);
            setStatus(data.status);
            setPrice(data.price || 0);
            setIsVip(data.price > 0);
        }
    }, [data]);

    const isDisabled = 
        title === '' ||
        (isVip && (price === '' || price === 0))
    ;

    const SaveSetting = async () =>{
        const newData = {
            chapterId: data.chapter_id,
            title: title,
            price: price,
            status: status,
        }
        await handleUpdateChapterSetting(newData);

        setPage(1);
        setRefreshTrigger(prev => prev + 1); 
    }
    const SaveContent = async () =>{
        const newData = {
            chapterId: data.chapter_id,
            content: content
        }
        await handleUpdateChapterContent(newData);

        setRefreshTrigger(prev => prev + 1); 
    }
    const Publish = async () =>{
        setStatus('published');
        const newData = {
            chapterId: data.chapter_id,
            title: title,
            price: price,
            status: 'published',
        }
        await handleUpdateChapterSetting(newData);

        setPage2(1);
        setRefreshTrigger(prev => prev + 1); 
    }
    return (
        <>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {page === 1 &&
                    <>
                        <div style={{ width: '100%', display: 'flex', gap: 20, justifyContent: 'space-between', alignItems: 'center' }}>

                            <button className='fontBtn' style={{ display: 'flex', alignItems: 'center' }} onClick={() => setPage2(1)}><ChevronLeft /></button>
                            <p className='title1'>{title}</p>

                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <button
                                    className={title !== '' ? 'normalBtn' : 'disableNormalBtn'}
                                    style={{ width: 150, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}
                                    disabled={title === ''}
                                    onClick={SaveContent}
                                ><Save size={18} />儲存</button>
                                <button className='fontBtn' onClick={() => setPage(2)}><EllipsisVertical size={18} /></button>
                            </div>
                        </div>
                        <textarea
                            className="contentInput2"
                            placeholder="開始寫書..."
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                            style={{ height: 669 }}
                        />
                    </>
                }
                {page === 2 &&
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: 400, justifyContent: 'space-between' }}>
                            <button className='fontBtn' style={{ display: 'flex', alignItems: 'center' }} onClick={() => setPage(1)}><ChevronLeft /></button>
                            <p className='title1'>章節設定</p>
                            <div style={{ color: 'transparent' }}><ChevronLeft /></div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 400 }}>
                            <p className='title2'>章節標題</p>
                            <input
                                className="frameInput"
                                type="text"
                                placeholder="請輸入標題"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                style={{ height: 49 }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 400 }}>
                            <p className='title2'>付費設定</p>
                            <div style={{ display: 'flex', gap: 20 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="novelStatus"
                                        checked={isVip === false}
                                        onChange={(e) => setIsVip(false)}
                                    />
                                    <p className='content1'>免費</p>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="novelStatus"
                                        checked={isVip === true}
                                        onChange={(e) => setIsVip(true)}
                                    />
                                    <p className='content1'>付費</p>
                                </label>
                            </div>
                            {isVip &&
                                <>
                                    <input
                                        type="number"
                                        placeholder="請輸入點數"
                                        className='contentInput'
                                        style={{ height: 49 }}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                    />
                                    <p className='tag1' style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CircleAlert size={18} />請輸入1~99的半形數字</p>
                                </>
                            }
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 400 }}>
                            <p className='title2'>發布狀態</p>
                            {status === 'draft' ?
                                <>
                                    <p className='tag1'>未發佈</p>
                                    <button
                                        className= 'normalBtn2'
                                        style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}
                                        onClick={Publish}
                                    >立即發布</button>
                                </>
                                :
                                <p className='tag1'>已發佈</p>
                            }
                        </div>
                        <button
                            className={!isDisabled ? 'normalBtn' : 'disableNormalBtn'}
                            style={{ width:400, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}
                            disabled={isDisabled}
                            onClick={SaveSetting}
                        >儲存變更</button>
                    </div>
                }
            </div>
        </>
    )
}