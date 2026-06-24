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

// 更新使用者個人資料明細
export const handleUpdateProfile = async (userId, name, introduction) => {
    try {
        const response = await fetch(`${host}/api/updateProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, name, introduction }),
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            alert("修改成功！");
        } else {
            alert("修改失敗：" + data.error);
        }
        return data;
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

// 更新使用者代幣點數
export const handleUpdateUserPoint = async (userId, action, pointAmount) => {
    try {
        const response = await fetch(`${host}/api/updateUserPoint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //action ('add'/'deduct')
            body: JSON.stringify({ userId, action, pointAmount }),
            credentials: 'include',
        });

        const data = await response.json();
        
        if (!data.success) {
            alert("點數異動失敗：" + data.error);
        }
        return data; 
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

//存取其他使用者資料
export const handleGetOtherUserData = async (setOtherUser, userId) => {
    try {
        const response = await fetch(`${host}/api/getOtherUserData?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setOtherUser(data.user);
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

export const handleGetBookDetail = async (setBook, novelId) => {
    try {
        const response = await fetch(`${host}/api/getNovel?novelId=${novelId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setBook(data.novel);
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
        } else {
            alert("取得資料失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//存取章節資料(單個)
export const handleGetChapterDetail = async (setChapter, chapterId) => {
    try {
        const response = await fetch(`${host}/api/getChapterDetail?chapterId=${chapterId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setChapter(data.chapter);
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
export const handleUpdateChapterViewCount = async (chapterId, userId) => {
    try {
        const response = await fetch(`${host}/api/updateChapterViewCount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chapterId, userId })
        });

        const resData = await response.json();

        if (!resData.success) {
            alert("閱讀量更新失敗：" + resData.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//更新小說
export const handleUpdateBookSetting = async (data) => {
    try {
        const response = await fetch(`${host}/api/updateBookSetting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( data )
        });

        const resData = await response.json();

        if (resData.success) {
            alert(`小說更新成功！`);
        } else {
            alert("小說更新失敗：" + resData.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//全部小說, 是否排行
export const handleGetNovels = async (setNovels, isRank = false) => {
    try {
        const sortParam = isRank ? 'view' : 'latest';
        
        const response = await fetch(`${host}/api/getNovels?sort=${sortParam}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setNovels(data.novels);
        } else {
            alert("取得小說列表失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//分類小說, 是否排行
export const handleGetNovelsByTags = async (setNovels, selectedTags, isRank = false) => {
    try {
        if (!selectedTags || selectedTags.length === 0) {
            return handleGetNovels(setNovels, isRank);
        }

        const tagString = selectedTags.join(',');
        const sortParam = isRank ? 'view' : 'latest';

        const url = `${host}/api/getNovels?tag=${encodeURIComponent(tagString)}&sort=${sortParam}`;

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setNovels(data.novels);
        } else {
            alert("篩選小說失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

/* ------------ 關聯表格 ------------ */
//創建閱讀紀錄
export const handleCreateReadData = async (novelId, userId, chapterId) => {
    try {
        const response = await fetch(`${host}/api/createReadData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ novelId, userId, chapterId }),
            credentials: 'include',
        });

        const data = await response.json();

        if (!data.success) {
            alert("創建閱讀紀錄失敗：" + data.error);
        }
        return data;
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//創建購買紀錄
export const handleCreateTransactionData = async (userId, chapterId, amount) => {
    try {
        const response = await fetch(`${host}/api/createTransactionData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, chapterId, amount }),
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            alert("購買成功！");
        } else {
            alert("購買失敗：" + data.error);
        }
        return data;
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//檢查章節是否已解鎖/購買過
export const handleCheckTransactionData = async (userId, chapterId) => {
    try {
        const response = await fetch(`${host}/api/checkTransactionData?userId=${userId}&chapterId=${chapterId}`, {
            method: 'GET',
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        console.error("檢查購買紀錄失敗：", error);
        return { success: false, purchased: false };
    }
};

// 創建儲值點數紀錄明細
export const handleCreateTransactionPoint = async (userId, point, price) => {
    try {
        const response = await fetch(`${host}/api/createTransactionPoint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, point, price }),
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            alert("儲值成功！");
        } else {
            alert("儲值失敗：" + data.error);
        }
        return data;
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//存取使用者閱讀紀錄
export const handleGetReadData = async (setRecords, userId) => {
    try {
        const response = await fetch(`${host}/api/getReadData?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setRecords(data.records);
        } else {
            alert("取得閱讀紀錄失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//存取使用者購買紀錄
export const handleGetUserTransactionData = async (setRecords, userId) => {
    try {
        const response = await fetch(`${host}/api/getUserTransactionData?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setRecords(data.records);
        } else {
            alert("取得購買紀錄失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//存取使用者點數購買紀錄
export const handleGetUserPointTransactionData = async (setRecords, userId) => {
    try {
        const response = await fetch(`${host}/api/getUserPointTransactionData?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setRecords(data.records);
        } else {
            alert("取得購買紀錄失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

//存取購買紀錄（作家）
export const handleGetCreatorTransactionData = async (setRecords, userId) => {
    try {
        const response = await fetch(`${host}/api/getCreatorTransactionData?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setRecords(data.records);
        } else {
            alert("取得作家營收紀錄失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

/* ------------ 固定資料 ------------ */
export const handleGetWriterLevel = async (setRule) => {
    try {
        const response = await fetch(`${host}/api/getWriterLevel`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setRule(data.rule);
        } else {
            alert("取得作家等級失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

export const handleGetReaderLevel = async (setRule) => {
    try {
        const response = await fetch(`${host}/api/getReaderLevel`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setRule(data.rule);
        } else {
            alert("取得讀者等級失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};

export const handleGetPointRule = async (setRule) => {
    try {
        const response = await fetch(`${host}/api/getPoint`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            setRule(data.rule);
        } else {
            alert("點數資料存取失敗：" + data.error);
        }
    } catch (error) {
        alert("連結後端失敗：" + error.message);
    }
};