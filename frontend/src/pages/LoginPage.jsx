import { useState } from "react"
import { handleLogin, handleCreateUserTable } from "@/utils/linkDB";
import Header from "@/component/Header"
import { data, useNavigate } from "react-router-dom";
import mainPageImg from '../assets/image/mainPage.png'

import { Eye, EyeOff, CircleX, Asterisk } from 'lucide-react';

export default function LoginPage({ setUser }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [status, setStatus] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    //Error messages
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmpasswordError, setConfirmPasswordError] = useState('');
    const [agreed, setAgreed] = useState(false);

    const Login = async (e) => {
        e.preventDefault();
        const loginData = { email, password };
        await handleLogin(loginData, setUser, navigate);
    };
    const SignIn = async (e) => {
        e.preventDefault();
        const userData = { name, email, password };
        await handleCreateUserTable(userData);
        setStatus(0);
    };

    //input check
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // 清空 confirmPassword 與錯誤訊息
        setConfirmPassword('');
        setConfirmPasswordError('');

        if (!value) {
            setPasswordError("請輸入你的密碼");
        } else if (value.length < 8) {
            setPasswordError("密碼長度必須大於8個字元");
        } else if (!/[a-z]/.test(value)) {
            setPasswordError("需包含至少一個小寫字母");
        } else if (!/\d/.test(value)) {
            setPasswordError("需包含至少一個數字");
        } else if (!/^[a-zA-Z0-9@._-]+$/.test(value)) {
            setPasswordError("請輸入合法字元");
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (value != password && password != '') {
            setConfirmPasswordError("與輸入密碼不符");
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!value) {
            setEmailError("請輸入你的email");
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            setEmailError("email格式不符");
        } else {
            setEmailError('');
        }
    };

    const isDisabled =
        !email ||
        !password ||
        !confirmPassword ||
        emailError !== '' ||
        passwordError !== '' ||
        confirmpasswordError !== '' ||
        password !== confirmPassword ||
        !agreed;

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <Header page={4} />
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%', overflow: 'hidden' }}>
                    <img src={mainPageImg} alt="裝飾圖片" />
                </div>
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {status === 0 &&
                        <div style={{ width: '50%' }}>
                            <div className="title1" style={{ marginBottom: 30 }}>登入</div>
                            <form onSubmit={Login} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <input
                                    className="frameInput"
                                    type="text"
                                    placeholder="請輸入Email"
                                    onChange={handleEmailChange}
                                />
                                <input
                                    className="frameInput"
                                    style={{ marginBottom: 40 }}
                                    type="password"
                                    placeholder="請輸入密碼"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button className="normalBtn" type="submit">
                                    登入
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                    <div className="content1">還沒有帳號？</div>
                                    <button className="smallfontBtn" onClick={(e) => setStatus(1)}>
                                        註冊
                                    </button>
                                </div>
                            </form>
                        </div>
                    }
                    {status === 1 &&
                        <div style={{ width: '50%' }}>
                            <div className="title1" style={{ marginBottom: 30 }}>註冊</div>
                            <form onSubmit={SignIn} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 20 }}>
                                    <div className="title2">基本資料</div>
                                    <input
                                        className="frameInput"
                                        type="name"
                                        placeholder="請輸入使用者名稱"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                    <div className="title2">帳號設定</div>
                                    <div>
                                        <input
                                            style={{ width: '100%' }}
                                            className="frameInput"
                                            type="email"
                                            placeholder="請輸入Email"
                                            onChange={handleEmailChange}
                                        />
                                        <div style={{ marginTop: 5 }}>
                                            {emailError &&
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <CircleX size={18} color="red" />
                                                    <p className="errorMessage">{emailError}</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <input
                                                style={{ width: '100%' }}
                                                className="frameInput"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="請輸入密碼"
                                                onChange={handlePasswordChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ position: 'absolute' }}
                                            >
                                                {showPassword ?
                                                    <EyeOff />
                                                    :
                                                    <Eye />
                                                }
                                            </button>
                                        </div>
                                        <div style={{ marginTop: 5 }}>
                                            {passwordError &&
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <CircleX size={18} color="red" />
                                                    <p className="errorMessage">{passwordError}</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: 40 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <input
                                                style={{ width: '100%' }}
                                                className="frameInput"
                                                type={showPassword2 ? "text" : "password"}
                                                placeholder="請再次輸入密碼"
                                                onChange={handleConfirmPasswordChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword2(!showPassword2)}
                                                style={{ position: 'absolute' }}
                                            >
                                                {showPassword2 ?
                                                    <EyeOff />
                                                    :
                                                    <Eye />
                                                }
                                            </button>
                                        </div>
                                        <div style={{ marginTop: 5 }}>
                                            {confirmpasswordError &&
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <CircleX size={18} color="red" />
                                                    <p className="errorMessage">{confirmpasswordError}</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={{ display: 'flex', gap: 5 }}
                                >
                                    <input type="checkbox" id="privacy" onClick={() => setAgreed(!agreed)} />
                                    <label for="agreement">
                                        <div style={{ display: 'flex', gap: 2 }}>
                                            <p className="content1">我已閱讀並同意</p>
                                            <p className="smallfontBtn" style={{ textDecorationLine: 'underline' }}>
                                                隱私條款
                                            </p>
                                            <Asterisk size={10} color="red"/>
                                        </div>
                                    </label>
                                </div>
                                <button
                                    className={`${isDisabled ? "disableNormalBtn" : "normalBtn"}`}
                                    type="submit"
                                    disabled={isDisabled}
                                >
                                    註冊
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                    <div className="content1">已有帳號？</div>
                                    <button className="smallfontBtn" onClick={(e) => setStatus(0)}>
                                        返回登入
                                    </button>
                                </div>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}