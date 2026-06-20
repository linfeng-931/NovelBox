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
export const handleLogin = async (loginData) => {
    const { email, password } = loginData;

    try {
        const response = await fetch(`${host}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();

        if (data.success) {
            alert(`登入成功！歡迎回來，${data.user.name}！`);
            console.log("登入的使用者資訊:", data.user);
        } else {
            alert("登入失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};