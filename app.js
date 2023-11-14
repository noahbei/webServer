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

const data = await getData();
console.log(data);


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
