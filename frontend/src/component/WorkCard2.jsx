import '../App.css'
import { Eye } from 'lucide-react';

export default function WorkCard2({ data, action, isReader = false }) {
    return (
        <div
            style={{
                backgroundColor: '#f5f5f5ff',
                width: '100%',
                borderRadius: 5,
                cursor: 'pointer'
            }}
            onClick={action}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                padding: 15
            }}>
                <div style={{ display: 'flex', gap: 10 }}> <p className='title2'>第 {data.number} 章</p> <p className='title2'>{data.title}</p> </div>
                {!isReader ?
                    <p className='tag1'>{data.status === 'draft' ? '未發佈' : '已發佈'}</p>
                    :
                    <p className='tag1'>
                        {data?.content
                            ? (data.content.length > 50
                                ? `${data.content.substring(0, 50)}...`
                                : data.content)
                            : '（本章無內容）'
                        }
                    </p>
                }
                <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <Eye size={20} /><p className='content1'>{data.view_count}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}