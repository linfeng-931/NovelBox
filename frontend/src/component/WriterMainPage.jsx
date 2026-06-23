import { useEffect, useState } from 'react'
import { handleGetWriterLevel } from '@/utils/linkDB'
import WriterLevelLabel from './WriterLevelLabel';

export default function WriterMainPage({user}){
    const [level, setLevel] = useState([]);
    useEffect(() => {
        handleGetWriterLevel(setLevel);
    }, []);

    return(
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div>
                <p className="title3">{user.name}</p>
                <WriterLevelLabel user={user} level={level}/>
                <p>當前經驗值：{user.writer_exp}</p>
            </div>
        </div>
    )
}