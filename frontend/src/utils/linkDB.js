const host = 'http://localhost:3000';

/* --------- USERS --------- */
//create user
export const handleCreateUserTable = async (userData) => {
    const { name, email, password } = userData;

    try {
        const response = await fetch(`${host}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //資料打包json傳給後端程式碼
            body: JSON.stringify({name, email, password})
        });

        //等待後端回應
        const data = await response.json();

        if (data.success) {
            alert(`新使用者${name}建立成功！`);
            console.log("資料庫回傳結果：", data.data);
        } else {
            alert("建立使用者失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//login
export const handleLogin = async (loginData, setUser, navigate) => {
    const { email, password } = loginData;
    
    try {
        const response = await fetch(`${host}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            alert(`登入成功！歡迎回來，${data.user.name}！`);
            setUser(data.user);
            navigate('/');
        } else {
            alert("登入失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//logout
export const handleLogout = async (setUser, navigate) => {
    try{
        await fetch(`${host}/api/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        setUser(null);
        alert("已成功登出！");
        navigate('/');
    } catch (err){
        alert("登出失敗："+err.message);
    }
}

//成為作家
export const handleBecomeWriter = async () => {
    try{
        const response = await fetch(`${host}/api/writer`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.error || `伺服器請求失敗(狀態碼: ${response.status})`);
        }
        alert("已成為NovelBox創作者！");
    } catch(err){
        alert("操作失敗："+err.message);
    }
}