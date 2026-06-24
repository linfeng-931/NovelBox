export default function MyProfit({ profit, amount }) {
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
            <p>我的收益</p>
            <div style={{ maxWidth: 1100, width: '100%', display: 'flex', flexDirection: 'column', gap: 15 }}>
                <p className="title2">累積收益</p>
                <p className="title3">$ {amount}</p>
            </div>
            <div style={{ maxWidth: 1100, width: '100%', display: 'flex', flexDirection: 'column', gap: 15 }}>
                <p className="title2">收益紀錄</p>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', borderBottom: '1px solid #ddd' }}>
                    <p className="content1" style={{ width: '25%' }}>日期</p>
                    <p className="content1" style={{ width: '25%' }}>作品名稱</p>
                    <p className="content1" style={{ width: '25%' }}>章節名稱</p>
                    <p className="content1" style={{ width: '25%', textAlign: 'right' }}>解鎖點數</p>
                </div>
                {profit && profit.length > 0 ? (
                    profit.map((p, index) => {
                        return (
                            <div key={index} style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '10px 0' }}>
                                <p className="tag1" style={{ width: '25%' }}>
                                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : '未知時間'}
                                </p>
                                <p className="tag1" style={{ width: '25%' }}>
                                    {p.novel_name?.length > 5
                                        ? `${p.novel_name.slice(0, 5)}...`
                                        : p.novel_name}
                                </p>
                                <p className="tag1" style={{ width: '25%' }}>
                                    {p.chapter_title?.length > 5
                                        ? `${p.chapter_title.slice(0, 5)}...`
                                        : p.chapter_title}
                                </p>
                                <p className="tag1" style={{ width: '25%', textAlign: 'right' }}>{p.amount} 元</p>
                            </div>
                        )
                    })
                ) : (
                    <div style={{ width: '100%', textAlign: 'center', padding: '40px 0' }}>
                        <p className="tag1">目前無收益紀錄</p>
                    </div>
                )}
            </div>
        </div>
    )
}