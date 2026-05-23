require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3000;

//html讀取後端
app.use(express.json());
app.use(cors());

//連線資訊
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//api接口，前端傳sql語法進來
app.post('/api/run-sql', (req, res) =>{
    const {sqlQuery} = req.body; //前端來的字串

    db.query(sqlQuery, (err, results) =>{
        if(err){
            return res.status(400).json({success: false, error: err.message});
        }
        res.json({success: true, data:results});
    });
});

app.listen(PORT, () => {
    console.log(`後端已啟動！網址為：http://localhost:${PORT}`);
});