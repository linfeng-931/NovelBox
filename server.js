require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key_123';

//前端讀取後端
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

//連線資訊
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('雲端資料庫連線失敗：' + err.stack);
        return;
    }
    console.log('雲端資料庫連線成功！');
});

//token
function generateToken(userId) {
    return jwt.sign({ user_id: userId }, SECRET_KEY, { expiresIn: '24h' });
}

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}

//api接口，前端傳sql語法進來
app.post('/api/run-sql', (req, res) => {
    const { sqlQuery } = req.body; //前端來的字串

    db.query(sqlQuery, (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        res.json({ success: true, data: results });
    });
});

app.listen(PORT, () => {
    console.log(`後端已啟動！網址為：http://localhost:${PORT}`);
});

//creat user
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        //加密密碼
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `
            INSERT INTO users (name, email, role, password)
            VALUES (?, ?, 'reader', ?);
        `;

        //執行sql
        db.query(sql, [name, email, hashedPassword], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            res.json({ success: true, data: results });
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

//login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ?;`;

    //驗證使用者
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        if (results.length === 0) {
            return res.status(400).json({ success: false, error: "該 Email 尚未註冊！" });
        }

        const user = results[0];
        try {
            const isMatch = bcrypt.compareSync(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ success: false, error: "密碼輸入錯誤！" });
            }

            //紀錄登入資訊
            const token = generateToken(user.USER_ID);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });

            //return
            return (
                res.json({
                    success: true,
                    message: "登入成功！",
                    user: {
                        user_id: user.USER_ID,
                        name: user.NAME,
                        email: user.email,
                        role: user.role,
                        reader_exp: user.READER_EXP,
                        writer_exp: user.writer_exp,
                        introduction: user.introduction,
                        point: user.point
                    }
                })
            );
        } catch (err) {
            res.status(500).json({ success: false, error: "密碼比對出錯：" + err.message });
        }
    });
});

// 更新使用者個人資料（名字、簡介）
app.post('/api/updateProfile', (req, res) => {
    const { userId, name, introduction } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, error: "缺少使用者 ID" });
    }

    const sql = `
        UPDATE \`users\` 
        SET \`NAME\` = ?, \`introduction\` = ? 
        WHERE \`USER_ID\` = ?;
    `;

    db.query(sql, [name, introduction, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: "更新個人資料失敗：" + err.message });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "找不到該名使用者" });
        }

        return res.json({
            success: true,
            message: "個人資料更新成功！"
        });
    });
});

//增減使用者的代幣點數
app.post('/api/updateUserPoint', (req, res) => {
    const { userId, action, pointAmount } = req.body; 

    if (!userId || !action || pointAmount === undefined || pointAmount <= 0) {
        return res.status(400).json({ success: false, error: "缺少參數或點數異動量不合法" });
    }

    let sql = "";
    let params = [];

    if (action === 'add') {
        sql = `
            UPDATE \`users\` 
            SET \`point\` = \`point\` + ? 
            WHERE \`USER_ID\` = ?;
        `;
        params = [pointAmount, userId];
    } else if (action === 'deduct') {
        sql = `
            UPDATE \`users\` 
            SET \`point\` = \`point\` - ? 
            WHERE \`USER_ID\` = ? AND \`point\` >= ?;
        `;
        params = [pointAmount, userId, pointAmount];
    } else {
        return res.status(400).json({ success: false, error: "不合法的操作類型 (action)" });
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: "更新使用者點數失敗：" + err.message });
        }

        if (results.affectedRows === 0) {
            const errorMsg = action === 'deduct' ? "點數餘額不足或使用者不存在" : "找不到該名使用者";
            return res.status(400).json({ success: false, error: errorMsg });
        }

        return res.json({
            success: true,
            message: `點數${action === 'add' ? '儲值' : '扣除'}成功！`
        });
    });
});

//logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

//確認使用者與是否登入
app.get('/api/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ loggedIn: false });

    try {
        const decoded = verifyToken(token);
        return res.json({ loggedIn: true, user: decoded.user });
    } catch (err) {
        return res.status(401).json({ loggedIn: false });
    }
});

//存取使用者個人資料
app.get('/api/getUserData', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false });
    try {
        const decoded = verifyToken(token);
        const userId = decoded.user_id;

        if (!userId) {
            return res.status(400).json({ success: false, error: "Token 資訊無效" });
        }

        const sql = `SELECT * FROM users WHERE USER_ID = ?;`;

        db.query(sql, [userId], (dbErr, results) => {
            if (dbErr) {
                return res.status(500).json({ success: false, error: "使用者資料存取失敗" + dbErr.message });
            }
            if (!results || results.length === 0) {
                return res.status(404).json({ success: false, error: "找不到該使用者資料" });
            }
            const user = results[0];
            return (
                res.json({
                    success: true,
                    message: "登入成功！",
                    user: {
                        user_id: user.USER_ID,
                        name: user.NAME,
                        email: user.email,
                        role: user.role,
                        reader_exp: user.READER_EXP,
                        writer_exp: user.writer_exp,
                        introduction: user.introduction,
                        point: user.point
                    }
                })
            );
        });
    } catch (err) {
        return res.status(401).json({ success: false, error: "Token 驗證失敗" });
    }
});

//存取其他使用者資料
app.get('/api/getOtherUserData', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ success: false, error: "缺少使用者 ID" });
    }

    try {
        const sql = `
            SELECT * FROM users WHERE USER_ID = ?;
        `;
        db.query(sql, [userId], (dbErr, results) => {
            if (dbErr) {
                return res.status(500).json({ success: false, error: "使用者資料存取失敗" + dbErr.message });
            }
            if (!results || results.length === 0) {
                return res.status(404).json({ success: false, error: "找不到該使用者資料" });
            }
            const user = results[0];
            return res.json({
                success: true,
                user: {
                    user_id: user.USER_ID || user.user_id,
                    name: user.NAME || user.name,
                    email: user.EMAIL || user.email,
                    role: user.ROLE || user.role,
                    reader_exp: user.READER_EXP || user.reader_exp,
                    writer_exp: user.WRITER_EXP || user.writer_exp,
                    introduction: user.INTRODUCTION || user.introduction
                }
            });
        });
    } catch (err) {
        return res.status(401).json({ success: false, error: err.message });
    }
});

//成為作家
app.post('/api/writer', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ changeRole: false });

    try {
        const decoded = verifyToken(token);
        const userId = decoded.user_id;

        if (!userId) {
            return res.status(400).json({ changeRole: false, error: "Token 資訊無效" });
        }

        const sql = `UPDATE users SET role = 'writer'  WHERE USER_ID = ?;`;

        db.query(sql, [userId], (dbErr, result) => {
            if (dbErr) {
                return res.status(500).json({ changeRole: false, error: "資料庫更新失敗" + dbErr.message });
            }
            return res.json({ changeRole: true, user: decoded.user });
        });
    } catch (err) {
        return res.status(401).json({ changeRole: false });
    }
});

/* ----------- 創作空間 ----------- */
//創建小說資料
app.post('/api/createBook', async (req, res) => {
    const { name, tag, authId } = req.body;

    try {
        const sql = `
            INSERT INTO novels (name, view_count, author_id)
            VALUES (?, 0, ?);
        `;
        const sqlInsertNovelTags = `INSERT INTO novel_tags (novel_id, tag_id) VALUES ?;`;
        const sqlFindTagIds = `SELECT id FROM tags WHERE name IN (?);`;

        db.query(sql, [name, authId], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }

            const novelId = results.insertId;
            db.query(sqlFindTagIds, [tag], (findErr, tagRows) => {
                if (findErr) {
                    return res.status(500).json({ success: false, error: "查詢標籤 ID 失敗: " + findErr.message });
                }
                if (tagRows.length === 0) {
                    return res.json({ success: true, message: "小說建立成功，但找不到對應的標籤 ID", novelId });
                }
                const novelTagValues = tagRows.map(row => [novelId, row.id]);

                db.query(sqlInsertNovelTags, [novelTagValues], (insertErr) => {
                    if (insertErr) {
                        return res.status(500).json({ success: false, error: "綁定小說標籤失敗: " + insertErr.message });
                    }

                    return res.json({ success: true, message: "小說與標籤成功綁定！", novelId });
                });
            });
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

//存取小說資料(單本詳細)
app.get('/api/getNovel', (req, res) => {
    const { novelId } = req.query;

    if (!novelId) {
        return res.status(400).json({ success: false, error: "缺少小說 ID" });
    }

    try {
        const sql = `
            SELECT n.*, GROUP_CONCAT(t.name) AS tags
            FROM novels n
            LEFT JOIN novel_tags nt ON n.id = nt.novel_id
            LEFT JOIN tags t ON nt.tag_id = t.id
            WHERE n.id = ?
            GROUP BY n.id;
        `;
        db.query(sql, [novelId], (dbErr, results) => {
            if (dbErr) {
                return res.status(500).json({ success: false, error: "小說資料存取失敗" + dbErr.message });
            }
            if (results.length === 0) return res.status(404).json({ success: false, error: "找不到小說" });

            const novel = results[0];
            const tagArray = novel.tags ? novel.tags.split(',') : [];

            return (
                res.json({
                    success: true,
                    novel: {
                        novel_id: novel.ID,
                        name: novel.NAME,
                        auth: novel.AUTHOR_ID,
                        tag: tagArray,
                        view_count: novel.VIEW_COUNT,
                        status: novel.status,
                        introduction: novel.introduction,
                        progress: novel.progress,
                        chapter_count: novel.chapter_count
                    }
                })
            );
        });
    } catch (err) {
        return res.status(401).json({ success: false, error: err.message });
    }
});

//存取小說資料(該作者所有)
app.get('/api/getNovelByAuth', (req, res) => {
    const { authId } = req.query;

    try {
        const sql = `
            SELECT n.*, GROUP_CONCAT(t.name) AS tags
            FROM novels n
            LEFT JOIN novel_tags nt ON n.id = nt.novel_id
            LEFT JOIN tags t ON nt.tag_id = t.id
            WHERE n.author_id = ?
            GROUP BY n.id;
        `;
        db.query(sql, [authId], (dbErr, results) => {
            if (dbErr) {
                return res.status(500).json({ success: false, error: "小說資料存取失敗" + dbErr.message });
            }
            if (results.length === 0) return res.status(404).json({ success: false, error: "找不到小說" });

            const novelList = results.map(novel => {
                const tagArray = novel.tags ? novel.tags.split(',') : [];
                return {
                    novel_id: novel.ID,
                    name: novel.NAME,
                    auth: novel.AUTHOR_ID,
                    tag: tagArray,
                    view_count: novel.VIEW_COUNT,
                    status: novel.status,
                    introduction: novel.introduction,
                    progress: novel.progress,
                    chapter_count: novel.chapter_count
                };
            });

            return res.json({
                success: true,
                novel: novelList
            })
        });
    } catch (err) {
        return res.status(401).json({ success: false, error: err.message });
    }
});

//複合存取小說
app.get('/api/getNovels', (req, res) => {
    //tag: 傳入多個標籤，可用逗號隔開（例如：'刑偵,懸疑靈異'）
    //sort: 排序方式（傳入 'view' 代表依閱讀量排行）
    const { tag, sort } = req.query;

    try {
        let sql = `
            SELECT n.*, GROUP_CONCAT(t.name) AS tags
            FROM novels n
            LEFT JOIN novel_tags nt ON n.id = nt.novel_id
            LEFT JOIN tags t ON nt.tag_id = t.id
        `;

        const queryParams = [];

        //分類標籤
        if (tag) {
            const tagIdsArray = tag.split(',');

            sql += ` WHERE t.name IN (?) `;
            queryParams.push(tagIdsArray);

            sql += ` GROUP BY n.id HAVING COUNT(DISTINCT t.name) = ? `;
            queryParams.push(tagIdsArray.length);
        } else {
            sql += ` GROUP BY n.id`;
        }

        //排序邏輯
        if (sort === 'view') {
            sql += ` ORDER BY n.VIEW_COUNT DESC`;
        } else {
            sql += ` ORDER BY n.id DESC`;
        }

        db.query(sql, queryParams, (dbErr, results) => {
            if (dbErr) {
                return res.status(500).json({ success: false, error: "撈取小說列表失敗：" + dbErr.message });
            }

            const novelList = results.map(novel => {
                const tagArray = novel.tags ? novel.tags.split(',') : [];
                return {
                    novel_id: novel.ID,
                    name: novel.NAME,
                    auth: novel.AUTHOR_ID,
                    tag: tagArray,
                    view_count: novel.VIEW_COUNT,
                    status: novel.status,
                    introduction: novel.introduction,
                    progress: novel.progress,
                    chapter_count: novel.chapter_count
                };
            });

            return res.json({
                success: true,
                novels: novelList
            });
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// 創建章節
app.post('/api/createChapter', async (req, res) => {
    const { novelId, title } = req.body;

    if (!novelId || !title) {
        return res.status(400).json({ success: false, error: "缺少小說 ID 或章節標題" });
    }

    try {
        const sql = `
            INSERT INTO chapter (novel_id, TITLE, CHAPTER_NUMBER)
            SELECT ?, ?, IFNULL(MAX(CHAPTER_NUMBER), 0) + 1
            FROM chapter
            WHERE novel_id = ?;
        `;

        const sqlUpdateChapterCount = `
            UPDATE novels, chapter
            SET novels.chapter_count = COALESCE(novels.chapter_count, 0) + 1
            WHERE novel_id = ?;
        `;

        db.query(sql, [novelId, title, novelId], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: "創建章節失敗：" + err.message });
            }

            //更新小說總章節數
            db.query(sqlUpdateChapterCount, [novelId], (errNovel, novelResults) => {
                if (errNovel) {
                    return res.status(400).json({ success: false, error: "更新小說總章節失敗: " + errNovel.message });
                }
                return res.json({
                    success: true,
                    message: "章節創建成功！",
                    insertId: results.insertId
                });
            });
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

//存取章節資料
app.get('/api/getChapter', (req, res) => {
    const { novelId } = req.query;

    try {
        const sql = `
            SELECT *
            FROM chapter
            WHERE novel_id = ?
        `;
        db.query(sql, [novelId], (dbErr, results) => {
            if (dbErr) {
                return res.status(500).json({ success: false, error: "小說資料存取失敗" + dbErr.message });
            }
            if (results.length === 0) return res.json({
                success: true,
                chapter: []
            });

            const chapterList = results.map(chapter => {
                return {
                    chapter_id: chapter.ID,
                    number: chapter.CHAPTER_NUMBER,
                    title: chapter.TITLE,
                    content: chapter.CONTENT,
                    status: chapter.status,
                    time: chapter.PUBLISH_AT,
                    price: chapter.price,
                    view_count: chapter.view_count
                };
            });

            return res.json({
                success: true,
                chapter: chapterList
            })
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

//存取單個章節資料
app.get('/api/getChapterDetail', (req, res) => {
    const { chapterId } = req.query;

    if (!chapterId) {
        return res.status(400).json({ success: false, error: "缺少章節 ID" });
    }

    try {
        const sql = `
            SELECT *
            FROM chapter
            WHERE ID = ?
        `;
        db.query(sql, [chapterId], (dbErr, results) => {
            if (dbErr) {
                return res.status(500).json({ success: false, error: "章節資料存取失敗：" + dbErr.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, error: "找不到該章節" });
            }

            const chapter = results[0];

            return (
                res.json({
                    success: true,
                    chapter: {
                        chapter_id: chapter.ID,
                        novel_id: chapter.novel_id,
                        number: chapter.CHAPTER_NUMBER,
                        title: chapter.TITLE,
                        content: chapter.CONTENT,
                        status: chapter.status,
                        time: chapter.PUBLISH_AT,
                        price: chapter.price,
                        view_count: chapter.view_count
                    }
                })
            );
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

//更新章節內容
app.post('/api/updateChapterContent', async (req, res) => {
    const { chapterId, content } = req.body;

    try {
        const sql = `
            UPDATE chapter
            SET CONTENT = ?
            WHERE ID = ?;
        `;

        db.query(sql, [content, chapterId], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            return res.json({ success: true, data: results });
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
})

//更新章節設定
app.post('/api/updateChapterSetting', async (req, res) => {
    const { chapterId, title, status, price } = req.body;
    const publish_at = status === 'published' ? new Date().toLocaleString('sv-SE') : null;

    try {
        const sql = `
            UPDATE chapter
            SET TITLE = ?, status = ?, PUBLISH_AT = ?, price = ?
            WHERE ID = ?;
        `;

        db.query(sql, [title, status, publish_at, price, chapterId], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            return res.json({ success: true, data: results });
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
})

//更新章節閱讀量設定
app.post('/api/updateChapterViewCount', async (req, res) => {
    const { chapterId, userId } = req.body;

    if (!chapterId || !userId) {
        return res.status(400).json({ success: false, error: "缺少章節 ID 或使用者 ID" });
    }

    try {
        const sql = `
            UPDATE chapter
            SET view_count = view_count + 1
            WHERE ID = ?; 
        `;

        const sqlNovel = `
            UPDATE novels, chapter
            SET novels.view_count = COALESCE(novels.view_count, 0) + 1
            WHERE chapter.ID = ? AND novels.id = chapter.novel_id;
        `;

        const sqlCreatorExp = `
            UPDATE users, novels, chapter
            SET writer_exp = COALESCE(writer_exp, 0) + 1
            WHERE chapter.ID = ? AND novels.id = chapter.novel_id AND novels.author_id = users.user_id;
        `;

        const sqlUserExp = `
            UPDATE users
            SET reader_exp = COALESCE(reader_exp, 0) + 1
            WHERE users.user_id = ?;
        `;

        //更新章節點閱
        db.query(sql, [chapterId], (err, chapterResults) => {
            if (err) {
                return res.status(400).json({ success: false, error: "更新章節閱讀量失敗: " + err.message });
            }

            //更新小說總點閱
            db.query(sqlNovel, [chapterId], (errNovel, novelResults) => {
                if (errNovel) {
                    return res.status(400).json({ success: false, error: "更新小說總閱讀量失敗: " + errNovel.message });
                }

                //增加作家的作家經驗值
                db.query(sqlCreatorExp, [chapterId], (errCreator, creatorResults) => {
                    if (errCreator) {
                        return res.status(400).json({ success: false, error: "增加作家經驗值失敗: " + errCreator.message });
                    }

                    //增加讀者的閱讀經驗值
                    db.query(sqlUserExp, [userId], (errUser, userResults) => {
                        if (errUser) {
                            return res.status(400).json({ success: false, error: "增加讀者經驗值失敗: " + errUser.message });
                        }

                        //回傳
                        return res.json({
                            success: true,
                            message: "閱讀量更新成功！"
                        });
                    });
                });
            });
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// 更新小說設定
app.post('/api/updateBookSetting', async (req, res) => {
    const { novelId, introduction, name, status, tags, progress } = req.body;

    if (!novelId) {
        return res.status(400).json({ success: false, error: "缺少小說 ID" });
    }

    try {
        let tagIds = [];
        if (tags && tags.length > 0) {
            const sqlFindTagIds = `SELECT id FROM tags WHERE name IN (?);`;

            const tagRows = await new Promise((resolve, reject) => {
                db.query(sqlFindTagIds, [tags], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            tagIds = tagRows.map(row => row.id);
        }

        db.beginTransaction((err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });

            const sqlUpdateNovel = `
                UPDATE novels
                SET introduction = ?, status = ?, NAME = ?, progress = ?
                WHERE ID = ?; 
            `;

            db.query(sqlUpdateNovel, [introduction, status, name, progress, novelId], (err1) => {
                if (err1) {
                    return db.rollback(() => res.status(400).json({ success: false, error: err1.message }));
                }

                const sqlDeleteTags = `DELETE FROM novel_tags WHERE novel_id = ?;`;

                db.query(sqlDeleteTags, [novelId], (err2) => {
                    if (err2) {
                        return db.rollback(() => res.status(400).json({ success: false, error: err2.message }));
                    }

                    if (tagIds.length > 0) {
                        const bulkValues = tagIds.map(id => [novelId, id]);
                        const sqlInsertTags = `INSERT INTO novel_tags (novel_id, tag_id) VALUES ?;`;

                        db.query(sqlInsertTags, [bulkValues], (err3) => {
                            if (err3) {
                                return db.rollback(() => res.status(400).json({ success: false, error: err3.message }));
                            }

                            db.commit((errCommit) => {
                                if (errCommit) return db.rollback(() => res.status(500).json({ success: false, error: errCommit.message }));
                                return res.json({ success: true, message: "小說資料與標籤全部更新成功！" });
                            });
                        });
                    } else {
                        db.commit((errCommit) => {
                            if (errCommit) return db.rollback(() => res.status(500).json({ success: false, error: errCommit.message }));
                            return res.json({ success: true, message: "小說資料已更新（標籤已清空）" });
                        });
                    }
                });
            });
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

/* ------------ 關聯表格 ------------ */
//創建閱讀紀錄
app.post('/api/createReadData', async (req, res) => {
    const { novelId, userId, chapterId } = req.body;

    if (!userId || !chapterId || !novelId) {
        return res.status(400).json({ success: false, error: "缺少使用者 ID、章節 ID 或小說 ID" });
    }

    try {
        const sql = `
            INSERT INTO BOOKSHELVES (novel_id, user_id, recent_read_chapter)
            VALUES (?, ?, ?);
        `;

        db.query(sql, [novelId, userId, chapterId], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: "閱讀紀錄創建失敗：" + err.message });
            }
            return res.json({
                success: true,
                message: "閱讀紀錄創建成功！",
                insertId: results.insertId
            });
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

//創建購買紀錄
app.post('/api/createTransactionData', async (req, res) => {
    const { userId, chapterId, amount } = req.body;
    const created_at = new Date().toLocaleString('sv-SE');

    if (!userId || !chapterId || amount === undefined) {
        return res.status(400).json({ success: false, error: "缺少使用者 ID、章節 ID 或金額" });
    }

    try {
        const sql = `
            INSERT INTO TRANSACTION (buyer_id, chapter_id, amount, created_at)
            VALUES (?, ?, ?, ?);
        `;

        db.query(sql, [userId, chapterId, amount, created_at], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: "購買紀錄創建失敗：" + err.message });
            }
            return res.json({
                success: true,
                message: "購買紀錄創建成功！",
                insertId: results.insertId
            });
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

// 創建代幣儲值紀錄
app.post('/api/createTransactionPoint', (req, res) => {
    const { userId, point, price } = req.body;

    if (!userId || point === undefined || price === undefined) {
        return res.status(400).json({ success: false, error: "缺少使用者 ID、點數或金額" });
    }

    const sql = `
        INSERT INTO transaction_point (buyer_id, point, price)
        VALUES (?, ?, ?);
    `;

    db.query(sql, [userId, point, price], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: "儲值紀錄創建失敗：" + err.message });
        }
        
        return res.json({
            success: true,
            message: "儲值紀錄創建成功！",
            insertId: results.insertId
        });
    });
});

// 存取使用者閱讀紀錄
app.get('/api/getReadData', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ success: false, error: "缺少使用者 ID" });
    }

    const sql = `
        SELECT 
            b.id AS record_id,
            b.novel_id,
            b.user_id,
            b.recent_read_chapter AS chapter_id,
            n.name AS novel_name,
            c.chapter_number AS chapter_number,
            c.title AS chapter_title
        FROM BOOKSHELVES b
        LEFT JOIN novels n ON b.novel_id = n.id
        LEFT JOIN chapter c ON b.recent_read_chapter = c.id
        WHERE b.user_id = ?;
    `;

    db.query(sql, [userId], (dbErr, results) => {
        if (dbErr) {
            return res.status(500).json({ success: false, error: "閱讀紀錄存取失敗：" + dbErr.message });
        }

        if (!results || results.length === 0) {
            return res.json({ success: true, records: [] });
        }

        const recordsList = results.map(record => ({
            record_id: record.record_id,
            novel_id: record.novel_id,
            user_id: record.user_id,
            chapter_id: record.chapter_id,
            novel_name: record.novel_name || "未知小說",
            chapter_number: record.chapter_number || 0,
            chapter_title: record.chapter_title || "未知章節"
        }));

        return res.json({
            success: true,
            records: recordsList
        });
    });
});

//存取使用者購買紀錄
app.get('/api/getUserTransactionData', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ success: false, error: "缺少使用者 ID" });
    }

    const sql = `
        SELECT t.*, c.TITLE AS chapter_title, n.NAME AS novel_name
        FROM TRANSACTION t
        JOIN chapter c ON t.chapter_id = c.ID
        JOIN novels n ON c.novel_id = n.ID
        WHERE t.BUYER_ID = ?
        ORDER BY t.CREATED_AT DESC;
    `;

    db.query(sql, [userId], (dbErr, results) => {
        if (dbErr) {
            return res.status(500).json({ success: false, error: "讀者購買紀錄存取失敗：" + dbErr.message });
        }

        if (!results || results.length === 0) {
            return res.json({ success: true, records: [] });
        }

        const recordsList = results.map(record => ({
            record_id: record.id || record.ID,
            chapter_id: record.CHIPTER_ID,
            novel_name: record.novel_name,
            chapter_title: record.chapter_title || "未知章節",
            amount: record.AMOUNT,
            created_at: record.CREATED_AT
        }));

        return res.json({
            success: true,
            records: recordsList
        });
    });
});

//存取使用者點數購買紀錄
app.get('/api/getUserPointTransactionData', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ success: false, error: "缺少使用者 ID" });
    }

    const sql = `
        SELECT t.*
        FROM transaction_point t
        WHERE t.buyer_id = ?
        ORDER BY t.created_at DESC;
    `;

    db.query(sql, [userId], (dbErr, results) => {
        if (dbErr) {
            return res.status(500).json({ success: false, error: "讀者購買紀錄存取失敗：" + dbErr.message });
        }

        if (!results || results.length === 0) {
            return res.json({ success: true, records: [] });
        }

        const recordsList = results.map(record => ({
            record_id: record.id || record.ID,
            amount: record.point,
            price: record.price,
            created_at: record.created_at
        }));

        return res.json({
            success: true,
            records: recordsList
        });
    });
});

//存取購買紀錄(作家)
app.get('/api/getCreatorTransactionData', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ success: false, error: "缺少使用者 ID" });
    }

    const sql = `
        SELECT t.*, c.TITLE AS chapter_title, n.NAME AS novel_name
        FROM TRANSACTION t
        JOIN chapter c ON t.chapter_id = c.ID
        JOIN novels n ON c.novel_id = n.ID
        WHERE n.AUTHOR_ID = ?
        ORDER BY t.created_at DESC;
    `;

    db.query(sql, [userId], (dbErr, results) => {
        if (dbErr) {
            return res.status(500).json({ success: false, error: "作家交易紀錄存取失敗：" + dbErr.message });
        }

        if (!results || results.length === 0) {
            return res.json({ success: true, records: [] });
        }

        const recordsList = results.map(record => ({
            record_id: record.id || record.ID,
            chapter_id: record.CHIPTER_ID,
            novel_name: record.novel_name,
            chapter_title: record.chapter_title || "未知章節",
            amount: record.AMOUNT,
            created_at: record.CREATED_AT
        }));

        return res.json({
            success: true,
            records: recordsList
        });
    });
});

//檢查讀者是否購買過該章節
app.get('/api/checkTransactionData', (req, res) => {
    const { userId, chapterId } = req.query;

    if (!userId || !chapterId) {
        return res.status(400).json({ success: false, error: "缺少參數" });
    }

    const sql = `SELECT id FROM TRANSACTION WHERE buyer_id = ? AND chapter_id = ?;`;

    db.query(sql, [userId, chapterId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: "伺服器錯誤：" + err.message });
        }
        return res.json({ success: true, purchased: results.length > 0 });
    });
});

/* ------------ 固定資料 ------------ */
//存取Tag資料
app.get('/api/getTag', (req, res) => {
    try {
        const sql = `
            SELECT *
            FROM tags;
        `;
        db.query(sql, (dbErr, results) => {
            if (dbErr) {
                return res.status(500).json({ success: false, error: "Tag存取失敗" + dbErr.message });
            }
            if (!results || results.length === 0) return res.status(404).json({ success: false, error: "找不到Tag" });

            const tagArray = results.map(row => row.name);

            return (
                res.json({
                    success: true,
                    tags: tagArray,
                })
            );
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

//存取作家等級資料
app.get('/api/getWriterLevel', (req, res) => {
    const sql = `
        SELECT *
        FROM WRITER_LEVEL_RULE;
    `;

    db.query(sql, (dbErr, results) => {
        if (dbErr) {
            return res.status(500).json({ success: false, error: "作家等級資料存取失敗：" + dbErr.message });
        }

        if (!results || results.length === 0) {
            return res.json({ success: true, rule: [] });
        }

        const rules = results.map(rule => ({
            name: rule.name || rule.NAME,
            min_exp: rule.min_exp || rule.MIN_EXP
        }));

        return res.json({
            success: true,
            rule: rules
        });
    });
});

//存取讀者等級資料
app.get('/api/getReaderLevel', (req, res) => {
    const sql = `
        SELECT *
        FROM READER_LEVEL_RULE;
    `;

    db.query(sql, (dbErr, results) => {
        if (dbErr) {
            return res.status(500).json({ success: false, error: "讀者等級資料存取失敗：" + dbErr.message });
        }

        if (!results || results.length === 0) {
            return res.json({ success: true, rule: [] });
        }

        const rules = results.map(rule => ({
            name: rule.name || rule.NAME,
            min_exp: rule.min_exp || rule.MIN_EXP
        }));

        return res.json({
            success: true,
            rule: rules
        });
    });
});

//存取點數價格資料
app.get('/api/getPoint', (req, res) => {
    const sql = `
        SELECT *
        FROM point;
    `;

    db.query(sql, (dbErr, results) => {
        if (dbErr) {
            return res.status(500).json({ success: false, error: "點數資料存取失敗：" + dbErr.message });
        }

        if (!results || results.length === 0) {
            return res.json({ success: true, rule: [] });
        }

        const rules = results.map(rule => ({
            amount: rule.amount,
            price: rule.price
        }));

        return res.json({
            success: true,
            rule: rules
        });
    });
});