import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';

export default function SlideBar({ data }) {
    const navigate = useNavigate();

    const handleGoToDetail = (novelId) => {
        navigate('/bookDetail', { state: { novelId } });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 30 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p className='title1'>綜合排行榜</p>
                <p className='tag1'>根據總閱讀量進行排行</p>
            </div>
            <div style={{ display: 'flex', gap: 40 }}>
                {data.map((novel, index) => {
                    if(novel.status === '已發佈')
                    return (
                        <div
                            style={{
                                position: 'relative',
                                width: 223,
                                cursor: 'pointer'
                            }}
                            onClick={() => handleGoToDetail(novel.novel_id)}
                        >
                            <div style={{ width: 223, height: 301, backgroundColor: '#ddd', borderRadius: 5, marginBottom: 20 }}></div>
                            <p
                                className='specialNum'
                                style={{
                                    position: 'absolute',
                                    top: 285,
                                }}
                            >{index + 1}</p>
                            <p className='title2' style={{ marginBottom: 10 }}>{novel.name}</p>
                            <p className='tag1' style={{ display: 'flex', gap: 10 }}>
                                {(novel.tag).map((tag, index) => {
                                    return (
                                        <div>{tag}</div>
                                    )
                                })
                                }
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}