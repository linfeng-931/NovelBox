import { useState } from "react"
import { handleUpdateProfile, handleGetUserData } from "@/utils/linkDB";

export default function UserSetting({ user, setUser }) {
    const [name, setName] = useState(user.name);
    const [introduction, setIntroduction] = useState(user.introduction);

    const handleSave = async () => {
        const result = await handleUpdateProfile(user.user_id, name, introduction);
        if (result?.success) {
            handleGetUserData(setUser);
        }
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
            <p>個人設定</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 400 }}>
                <p className='title2'>暱稱</p>
                <input
                    className="frameInput"
                    type="text"
                    placeholder="請輸入暱稱"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    style={{ height: 49 }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 400 }}>
                <p className='title2'>電子信箱</p>
                <p className="tag1">{user.email}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 400 }}>
                <p className='title2'>簡介</p>
                <div style={{ display: 'flex', gap: 20 }}>
                    <textarea
                        className="contentInput2"
                        placeholder="還沒有自我介紹？ 開始編輯新增個人簡介"
                        onChange={(e) => setIntroduction(e.target.value)}
                        value={introduction}
                        style={{ height: 200, fontSize: 14, border: '1px solid #ddd' }}
                    />
                </div>
            </div>
            <button
                className={(name && name.trim()) ? 'normalBtn' : 'disableNormalBtn'}
                style={{ width: 400, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}
                disabled={!(name && name.trim())}
                onClick={handleSave}
            >儲存變更</button>
        </div>
    )
}