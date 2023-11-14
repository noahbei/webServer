import express from "express";
import mysql from "mysql2"
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const port = 3000

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function getData() {
    const [rows] = await pool.query("SELECT * FROM account")
    return rows
}

// prepared statement: sending sql and values separately
async function getAccount(userID) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM account 
    WHERE userID = ? 
    `, [userID])
    return rows[0]
}

async function createAccount(a = NULL, b = NULL, c = NULL, d = NULL, e = NULL, f = NULL, g = NULL, h = NULL) {
    const result = await pool.query(`
    INSERT INTO account (userID, username, password, age, email, birthdate, gender, name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [a, b, c, d, e, f, g, h])
    return result
}

//const data = await getData();
//console.log(data);
//const account = getAccount(1)
//console.log(account)
const result = await createAccount('2', 'jane', 'password', '13', 'this2@email.com', '2010-12-03', 'female', 'jane doe')
console.log(result)


app.get("/", (req, res) => {
    res.send("server");
})

// app.get("/data", async (req, res) => {
//     try {
//         const [rows, fields] = await pool.query("SELECT * FROM your_table_name");
//         res.json({ data: rows });
//       } catch (error) {
//         console.error("Error querying the database:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
// })

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
