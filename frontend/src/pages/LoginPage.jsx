import { useState } from "react"
import { handleLogin, handleCreateUserTable } from "@/utils/linkDB";
import Header from "@/component/Header"
import { data } from "react-router-dom";

export default function LoginPage({setUser}){
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const [status, setStatus] = useState(0);

    const Login = async (e) =>{
        e.preventDefault();
        const loginData = {email, password};
        await handleLogin(loginData, setUser);
    };
    const SignIn = async (e) =>{
        e.preventDefault();
        const userData = {name, email, password};
        await handleCreateUserTable(userData);
    };

    return(
        <div>
            {status === 0 &&
                <form onSubmit={Login}>
                    <Header page={4}/>
                    <input
                        type="email"
                        placeholder="請輸入Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="請輸入密碼"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">
                        登入
                    </button>
                    <button onClick={(e) => setStatus(1)}>
                        註冊
                    </button>
                </form>
            }
            {status === 1 &&
                <form onSubmit={SignIn}>
                    <Header page={4}/>
                    <input
                        type="name"
                        placeholder="請輸入使用者名稱"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="請輸入Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="請輸入密碼"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">
                        註冊
                    </button>
                    <button onClick={(e) => setStatus(0)}>
                        返回登入
                    </button>
                </form>
            }
        </div>
    )
}