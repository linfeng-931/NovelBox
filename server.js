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
                        introduction: user.introduction
                    }
                })
            );
        } catch (err) {
            res.status(500).json({ success: false, error: "密碼比對出錯：" + err.message });
        }
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
                        introduction: user.introduction
                    }
                })
            );
        });
    } catch (err) {
        return res.status(401).json({ success: false, error: "Token 驗證失敗" });
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

//存取小說資料
app.get('/api/getNovel', (req, res) => {
    const { novelId } = req.body;

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
            const tagArray = novel.TAGS ? novel.TAGS.split(',') : [];

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
                    }
                })
            );
        });
        return res.json({ success: true });
    } catch (err) {
        return res.status(401).json({ success: false, error: err.message });
    }
});

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
                    introduction: novel.introduction
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

//創建章節
app.post('/api/createChapter', async (req, res) => {
    const { novelId, title } = req.body;

    try {
        const sql = `
            INSERT INTO chapter (novel_id, title)
            VALUES (?, ?);
        `;

        db.query(sql, [novelId, title], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            return res.json({ success: true, data: results });
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
})

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
                    price: chapter.price
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
    const { chapterId } = req.body; 

    if (!chapterId) {
        return res.status(400).json({ success: false, error: "缺少章節 ID" });
    }

    try {
        const sql = `
            UPDATE chapter
            SET view_count = view_count + 1
            WHERE id = ?; 
        `;

        db.query(sql, [chapterId], (err, results) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }
            return res.json({ success: true, message: "閱讀量已成功 +1", data: results });
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});