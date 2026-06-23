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
            body: JSON.stringify({ name, email, password })
        });

        //等待後端回應
        const data = await response.json();

        if (data.success) {
            alert(`新使用者${name}建立成功！`);
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
            body: JSON.stringify({ email, password }),
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
    try {
        await fetch(`${host}/api/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        setUser(null);
        alert("已成功登出！");
        navigate('/');
    } catch (err) {
        alert("登出失敗：" + err.message);
    }
}

//成為作家
export const handleBecomeWriter = async () => {
    try {
        const response = await fetch(`${host}/api/writer`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `伺服器請求失敗(狀態碼: ${response.status})`);
        }
        alert("已成為NovelBox創作者！");
    } catch (err) {
        alert("操作失敗：" + err.message);
    }
}

/* ---------- 存取資料 ---------- */

//存取使用者資料
export const handleGetUserData = async (setUser) => {
    try {
        const response = await fetch(`${host}/api/getUserData`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            setUser(data.user);
        } else {
            alert("取得資料失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

/* ----------- 創作空間 ----------- */
//創建小說
export const handleCreateNovelTable = async (novelData) => {
    const { name, tag, authId } = novelData;

    try {
        const response = await fetch(`${host}/api/createBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, tag, authId })
        });

        const data = await response.json();

        if (data.success) {
            alert(`新作品${name}建立成功！`);
        } else {
            alert("建立作品失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//創建章節
export const handleCreateChapterTable = async (data) => {
    const { novelId, title } = data;
    try {
        const response = await fetch(`${host}/api/createChapter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ novelId, title })
        });

        const resData = await response.json();

        if (resData.success) {
            alert(`新章節${title}建立成功！`);
        } else {
            alert("建立作品失敗：" + resData.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//存取Tag資料
export const handleGetTags = async (setTag) => {
    try {
        const response = await fetch(`${host}/api/getTag`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            setTag(data.tags);
        } else {
            alert("取得資料失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//存取小說資料
export const handleGetBooksByAuth = async (setBooks, authId) => {
    try {
        const response = await fetch(`${host}/api/getNovelByAuth?authId=${authId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setBooks(data.novel);
            console.log(data.novel[0]);
        } else {
            alert("取得資料失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//存取章節資料
export const handleGetBookChapters = async (setChapters, novelId) => {
    try {
        const response = await fetch(`${host}/api/getChapter?novelId=${novelId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setChapters(data.chapter);
            console.log(data.chapter[0]);
        } else {
            alert("取得資料失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//更新章節內容
export const handleUpdateChapterContent = async (data) => {
    const { chapterId, content } = data;
    try {
        const response = await fetch(`${host}/api/updateChapterContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chapterId, content })
        });

        const resData = await response.json();

        if (resData.success) {
            alert(`章節內容更新成功！`);
        } else {
            alert("章節內容更新失敗：" + resData.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//更新章節設定
export const handleUpdateChapterSetting = async (data) => {
    const { chapterId, title, status, price } = data;
    try {
        const response = await fetch(`${host}/api/updateChapterSetting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chapterId, title, status, price })
        });

        const resData = await response.json();

        if (resData.success) {
            alert(`章節設定更新成功！`);
        } else {
            alert("章節設定更新失敗：" + resData.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//更新章節設定
export const handleUpdateChapterViewCount = async (chapterId) => {
    try {
        const response = await fetch(`${host}/api/updateChapterViewCount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chapterId })
        });

        const resData = await response.json();

        if (resData.success) {
            alert(`閱讀量更新成功！`);
        } else {
            alert("閱讀量更新失敗：" + resData.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};