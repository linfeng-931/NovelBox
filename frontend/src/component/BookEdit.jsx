import { useEffect, useState } from 'react'
import '../App.css'
import { handleUpdateBookSetting } from '@/utils/linkDB';
import { Save, EllipsisVertical, ChevronLeft, CircleAlert } from 'lucide-react';

export default function BookEdit({ data, tags, setRefreshTrigger, setPage }) {
    const [name, setName] = useState(data.name);
    const [novelTag, setNovelTag] = useState(data.tag);
    const [introduction, setIntroduction] = useState(data.introduction);
    const [status, setStatus] = useState(data.status);
    const [progress, setProgress] = useState(data.progress);

    //Error messages
    const [novelNameError, setNovelNameError] = useState('');
    const [novelTagError, setNovelTagError] = useState('');

    useEffect(() => {
        if (data) {
            setIntroduction(data.introduction);
            setName(data.name);
            setStatus(data.status);
            setNovelTag(data.tag);
            setProgress(data.progress);
        }
    }, [data]);

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
        setName('')
        setNovelNameError('');
        setNovelTagError('');
        setNovelTag([]);
        setPage(1);
    }

    const isDisabled =
        name === '' ||
        novelTag.length == 0 ||
        novelTagError !== '' ||
        novelNameError !== '';

    const SaveSetting = async () => {
        const newData = {
            novelId: data.novel_id,
            introduction: introduction,
            name: name,
            tags: novelTag,
            status: status,
            progress: progress,
        }
        await handleUpdateBookSetting(newData);

        setPage(1);
        setRefreshTrigger(prev => prev + 1);
    }
    console.log(data.novel_id);

    const Publish = async () => {
        const newData = {
            novelId: data.novel_id,
            introduction: introduction,
            name: name,
            tags: novelTag,
            status: '已發佈',
            progress: progress,
        }
        await handleUpdateBookSetting(newData);

        setPage(1);
        setRefreshTrigger(prev => prev + 1);
    }


    return (
        <>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: 400, justifyContent: 'space-between' }}>
                        <button className='fontBtn' style={{ display: 'flex', alignItems: 'center' }} onClick={() => setPage(1)}><ChevronLeft /></button>
                        <p className='title1'>作品設定</p>
                        <div style={{ color: 'transparent' }}><ChevronLeft /></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 400 }}>
                        <p className='title2'>章節標題</p>
                        <input
                            className="frameInput"
                            type="text"
                            placeholder="請輸入標題"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            style={{ height: 49 }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 400 }}>
                        <p className='title2'>作品簡介</p>
                        <div style={{ display: 'flex', gap: 20 }}>
                            <textarea
                                className="contentInput2"
                                placeholder="請輸入作品簡介"
                                onChange={(e) => setIntroduction(e.target.value)}
                                value={introduction}
                                style={{ height: 300, fontSize: 14 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: 400, gap: 10 }}>
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
                                            checked={novelTag.includes(tag)}
                                            onClick={(e) => handleTagChange(e, tag)}
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

                    <div style={{ display: 'flex', gap: 10, width: 400, flexDirection:'column' }}>
                        <p className='title2'>連載狀態</p>
                        <div style={{ display: 'flex', gap: 20 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="novelStatus"
                                    checked={progress === '預收'}
                                    onChange={(e) => setProgress('預收')}
                                />
                                <p className='content1'>預收</p>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="novelStatus"
                                    checked={progress === '連載中'}
                                    onChange={(e) => setProgress('連載中')}
                                />
                                <p className='content1'>連載中</p>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="novelStatus"
                                    checked={progress === '已完結'}
                                    onChange={(e) => setProgress('已完結')}
                                />
                                <p className='content1'>已完結</p>
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 400 }}>
                        <p className='title2'>發佈狀態</p>
                        {status === '未發佈' ?
                            <>
                                <p className='tag1'>未發佈</p>
                                <button
                                    className='normalBtn2'
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
                        style={{ width: 400, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}
                        disabled={isDisabled}
                        onClick={SaveSetting}
                    >儲存變更</button>
                </div>
            </div>
        </>
    )
}