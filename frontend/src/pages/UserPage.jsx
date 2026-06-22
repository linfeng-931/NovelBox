import { useState } from 'react'
import '../App.css'
import Header from '@/component/Header';
import { handleLogout, handleBecomeWriter } from '@/utils/linkDB';
import { useNavigate } from "react-router-dom";

export default function UserPage({ setUser, user }) {
    const navigate = useNavigate();
    const Logout = async (e) => {
        handleLogout(setUser, navigate);
    }
    const [status, setStatus] = useState(1);
    const [writerPage, setWriterPage] = useState(false);
    const [agreed, setAgreed] = useState(false);

    return (
        <div>
            <Header page={4} user={user} />
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <button className="fontBtn" onClick={(e) => setStatus(1)}>個人設定</button>
                    <button className="fontBtn" onClick={(e) => setStatus(2)}>帳務與訂閱</button>
                    <button className="fontBtn" onClick={(e) => setStatus(3)}>我的收藏</button>
                    <button className="fontBtn" onClick={(e) => setStatus(4)}>閱覽紀錄</button>
                    <button className="fontBtn" onClick={(e) => setWriterPage(true)}>成為作家</button>
                    <button className="normalBtn" onClick={Logout}>登出</button>
                </div>
                <div>
                    {status === 1 &&
                        <div></div>
                    }
                    {status === 2 &&
                        <div></div>
                    }
                    {status === 3 &&
                        <div></div>
                    }
                    {status === 4 &&
                        <div></div>
                    }
                </div>
            </div>

            {/* 成為作家 */}
            {writerPage &&
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100vh',
                        backgroundColor: '#ff3f3f20',
                        backdropFilter: 'blur(8px)',
                        top: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            width: '30rem',
                            backgroundColor: '#ffffffff',
                            borderRadius: 8,
                            padding: 30,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 25
                        }}>
                        <p className='title1'> 加入 NovelBox 創作者行列 </p>
                        <p className='content1'> 加入我們，讓好的作品被看見！ </p>
                        <div
                            style={{
                                width: '100%',
                                height: '10rem',
                                backgroundColor: '#f6f6f6ff',
                                borderRadius: 4,
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                padding: '20px'
                            }}
                        >
                            <p className='content1' style={{ marginBottom: 30 }}>歡迎您加入 NovelBox（以下簡稱「本平台」）。本創作者服務條款（以下簡稱「本條款」）旨在規範創作者（以下簡稱「您」）與本平台之間的權利與義務。當您在平台點擊確認、勾選同意或開始發布作品時，即視為您已閱讀、理解並同意接受本條款之所有內容。</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 30 }}>
                                <p className='title2'>第一條：創作者資格與帳號安全</p>
                                <p className='content1'>
                                    您必須具備完全行為能力。若您為限制行為能力人（未滿法定成年年齡），應取得法定代理人之允許或同意方得加入。
                                </p>
                                <p className='content1'>
                                    您保證註冊時所提供之個人資料（包括但不限於真實姓名、身分證字號/統一編號、聯絡電話、電子信箱及匯款帳戶）均為真實且正確。若因資料錯誤導致收益無法結算，本平台不承擔任何責任。
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 30 }}>
                                <p className='title2'>第二條：作品智慧財產權（著作權）歸屬</p>
                                <p className='content1'>
                                    著作權保留：您在本平台發布之所有原創作品（包括小說正文、大綱、角色設定、封面圖文等），其著作權（包括著作人格權與著作財產權）仍完全歸屬於您本人所有。
                                </p>
                                <p className='content1'>
                                    非專屬授權：為了讓作品能被讀者閱讀與推廣，您同意授予 NovelBox 全球性、非專屬（Non-exclusive）、免授權費、可轉授權的權利，允許本平台在營運期間內對作品進行以下利用：
                                </p>
                                <p className='content1'>
                                    於本平台（網頁端、App 端、官方社群媒體等）進行數位化發布、展示、傳播、重製與排版。
                                </p>
                                <p className='content1'>
                                    用於本平台之行銷推廣、廣告宣傳（如擷取部分章節或文案）。
                                </p>
                                <p className='content1'>
                                    第三方授權（可選）：若有第三方提出改編（如影視、漫畫、遊戲、實體出版）之意願，未經您明示之書面同意，本平台不得逕行代理簽約。
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <p className='title2'>第三條：創作者之保證與承諾（違規與侵權處理）</p>
                                <p className='content1'>
                                    您發布於 NovelBox 的作品必須遵守相關法律法規，並嚴格遵守以下承諾：
                                </p>
                                <p className='content1'>
                                    原創保證：作品須為您本人原創，或已取得合法授權。嚴禁抄襲、剽竊、冒名頂替或使用未經授權之 AI 生成內容（如涉及版權爭議）。
                                </p>
                                <p className='content1'>
                                    禁止違法與不良內容：作品不得包含色情、血腥暴力、鼓勵犯罪、煽動仇恨、政治敏感或誹謗他人之內容。
                                </p>
                                <p className='content1'>
                                    一稿多投限制（視平台政策而定）：若該作品已與其他平台簽署「獨家/專屬協議」，您不得將該作品發布於本平台。因版權衝突導致之法律責任由您自行承擔。
                                </p>
                            </div>
                        </div>
                        <div
                            style={{ display: 'flex', gap: 5 }}
                        >
                            <input 
                                type="checkbox" 
                                id="privacy" 
                                onClick={() => setAgreed(!agreed)} 
                                className='checkBox'
                            />
                            <label htmlFor="agreement">
                                <div style={{ display: 'flex', gap: 2 }}>
                                    <p className="content1">我已詳細閱讀並同意上述</p>
                                    <p className="smallfontBtn" style={{ textDecorationLine: 'underline' }}>
                                        創作者條款
                                    </p>
                                </div>
                            </label>
                        </div>

                        <div style={{ display: 'flex', width: '100%', gap: 20 }}>
                            <button
                                className='normalBtn2'
                                style={{ width: '100%' }}
                                onClick={(e) => setWriterPage(false)}
                            >返回</button>
                            <button
                                className={agreed ? 'normalBtn' : 'disableNormalBtn'}
                                style={{ width: '100%' }}
                                disabled={!agreed}
                                onClick={handleBecomeWriter}
                            >成為創作者</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
