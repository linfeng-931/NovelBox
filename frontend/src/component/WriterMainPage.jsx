import { useEffect, useState } from 'react'
import { handleGetWriterLevel } from '@/utils/linkDB'
import WriterLevelLabel from './WriterLevelLabel';

export default function WriterMainPage({ user, amount, viewCount, chapterCount }) {
    const [level, setLevel] = useState([]);
    useEffect(() => {
        handleGetWriterLevel(setLevel);
    }, []);

    const currentLevel = () => {
        if (!level || level.length < 3) return 0;

        const exp = user?.writer_exp || 0;

        if (exp >= level[2].min_exp) {
            return 2;
        } else if (exp >= level[1].min_exp) {
            return 1;
        } else {
            return 0;
        }
    };

    if (!level || level.length === 0) {
        return <p className="tag1">計算中...</p>;
    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 40, alignItems:'center'}}>
            {/* 資訊總覽 */}
            <div style={{display:'flex', flexDirection:'column', gap: 30, borderRadius: 5, border:'1px solid #ecececff', padding:25, maxWidth: 1100, width:'100%'}}>
                <div style={{display:'flex', gap:20, alignItems:'center'}}>
                    <p className="title3">{user.name}</p>
                    <WriterLevelLabel currentLevel={currentLevel()} level={level} />
                </div>

                <div>
                    {currentLevel() < 2 ?
                        <p className='content1' style={{marginBottom: 5}}> 距離下一等級</p>
                        :
                        <p className='content1' style={{marginBottom: 5}}> 已是最高等級</p>
                    }
                    <div style={{ width: '100%', height: 12, backgroundColor: '#fbfbfbff', borderRadius: 50, border: '1px solid #e0e0e0ff', overflow: 'hidden' }}>
                        {currentLevel() < 2 ?
                            <div
                                style={{
                                    backgroundColor: '#FF7269',
                                    height: 13,
                                    width: `${(user.writer_exp / level[currentLevel() + 1]?.min_exp) * 100}%`
                                }}
                            ></div>
                            :
                            <div
                                style={{
                                    backgroundColor: '#FF7269',
                                    height: 13,
                                    opacity: .5
                                }}
                            ></div>
                        }
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                    <div style={{ borderRadius: 5, border: '.5px solid #ddd', padding: '10px 20px 15px 20px', width: '100%' }}>
                        <p className='tag1' style={{ marginBottom: 5 }}>累積章節數</p>
                        <p className='title3'>{chapterCount}</p>
                    </div>
                    <div style={{ borderRadius: 5, border: '.5px solid #ddd', padding: '10px 20px 15px 20px', width: '100%' }}>
                        <p className='tag1' style={{ marginBottom: 5 }}>累積閱覽數</p>
                        <p className='title3'>{viewCount}</p>
                    </div>
                    <div style={{ borderRadius: 5, border: '.5px solid #ddd', padding: '10px 20px 15px 20px', width: '100%' }}>
                        <p className='tag1' style={{ marginBottom: 5 }}>累計收益</p>
                        <p className='title3'>{amount}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}