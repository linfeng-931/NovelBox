import { useState, useEffect } from "react";
import { CircleDollarSign } from 'lucide-react';
import { handleGetPointRule, handleCreateTransactionPoint, handleUpdateUserPoint, handleGetUserData, handleGetUserPointTransactionData, handleGetUserTransactionData } from "@/utils/linkDB";

export default function Accounting({ user, setUser }) {
    const [pointRule, setPointRule] = useState([]);
    const [record, setRecord] = useState([]);
    const [bookRecord, setBookRecord] = useState([]);
    const [name, setName] = useState(user?.name || '');
    const [introduction, setIntroduction] = useState(user?.introduction || '');

    const [getPointAmount, setGetPointAmount] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        handleGetPointRule(setPointRule);
        handleGetUserPointTransactionData(setRecord, user.user_id);
        handleGetUserTransactionData(setBookRecord, user.user_id);
    }, []);

    const GetPoint = (amount, pr) => {
        setGetPointAmount(amount);
        setPrice(pr);
    }

    const handleBuySubmit = async () => {
        if (!user?.user_id) return window.alert("請先登入帳號！");
        if (price === 0 || getPointAmount === 0) return window.alert("請先選擇一個儲值方案！");

        const isConfirm = window.confirm(`確定要花費 ${price} TWD 購買 ${getPointAmount} 點數嗎？`);
        if (!isConfirm) return;

        const transactionResult = await handleCreateTransactionPoint(user.user_id, getPointAmount, price);

        if (transactionResult?.success) {
            const pointResult = await handleUpdateUserPoint(user.user_id, 'add', getPointAmount);

            if (pointResult?.success) {
                setGetPointAmount(0);
                setPrice(0);
                window.alert(`儲值成功！已匯入 ${getPointAmount} 點數。`);
                handleGetUserData(setUser);
            }
        }
    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
            <p>帳務</p>
            <div style={{ display: 'flex', gap: 10, width: 400, border: '1px solid #ddd', padding: 50, borderRadius: 5, alignItems: 'center', justifyContent: 'space-between' }}>
                <p className='title2'>當前點數</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <CircleDollarSign size={36} />
                    <p className="title1">{user?.point || 0}</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, width: 400, flexDirection: 'column' }}>
                <p className='title2'>購買點數</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pointRule?.map((rule, index) => {
                        const isSelected = getPointAmount === rule.amount;

                        return (
                            <div
                                key={rule.id || index}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 0' }}
                                onClick={() => GetPoint(
                                    isSelected ? 0 : rule.amount,
                                    price === rule.price ? 0 : rule.price
                                )}
                            >
                                <input
                                    type="radio"
                                    name="option"
                                    checked={price === rule.price && getPointAmount === rule.amount}
                                    readOnly
                                    style={{ pointerEvents: 'none' }}
                                />

                                <p className='content1' style={{ margin: 0 }}>{rule.amount} 點</p>
                                <p className='tag3' style={{ margin: 0 }}>（{rule.price} TWD）</p>
                            </div>
                        )
                    })}
                </div>

                <button
                    className={price !== 0 ? 'normalBtn' : 'disableNormalBtn'}
                    style={{ width: 400, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginTop: 10 }}
                    disabled={price === 0}
                    onClick={handleBuySubmit}
                >
                    確認購買
                </button>
            </div>
            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', gap: 40, width: 400, flexDirection: 'column', bordr: '1px solid #ddd', borderRadius: 5 }}>
                <div style={{ display: 'flex', gap: 10, width: 400, flexDirection: 'column' }}>
                    <p className="title2">購買記錄</p>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', borderBottom: '1px solid #ddd' }}>
                        <p className="content1" style={{ width: '25%' }}>日期</p>
                        <p className="content1" style={{ width: '25%' }}>點數</p>
                        <p className="content1" style={{ width: '25%', textAlign: 'right' }}>價格</p>
                    </div>
                    {record && record.length > 0 ? (
                        record.map((p, index) => {
                            return (
                                <div key={index} style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '10px 0' }}>
                                    <p className="tag1" style={{ width: '25%' }}>
                                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : '未知時間'}
                                    </p>
                                    <p className="tag1" style={{ width: '25%' }}>{p.amount}</p>
                                    <p className="tag1" style={{ width: '25%', textAlign: 'right' }}>{p.price} 元</p>
                                </div>
                            )
                        })
                    ) : (
                        <div style={{ width: '100%', textAlign: 'center', padding: '40px 0' }}>
                            <p className="tag1">目前無收益紀錄</p>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 10, width: 400, flexDirection: 'column' }}>
                    <p className="title2">消費紀錄</p>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', borderBottom: '1px solid #ddd' }}>
                        <p className="content1" style={{ width: '25%' }}>日期</p>
                        <p className="content1" style={{ width: '25%' }}>作品名稱</p>
                        <p className="content1" style={{ width: '25%' }}>章節名稱</p>
                        <p className="content1" style={{ width: '25%', textAlign: 'right' }}>解鎖點數</p>
                    </div>
                    {bookRecord && bookRecord.length > 0 ? (
                        bookRecord.map((p, index) => {
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
                        <div style={{ width: '100%', textAlign: 'center', padding: '10px 0' }}>
                            <p className="tag1">目前無消費紀錄</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}