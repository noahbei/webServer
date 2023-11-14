import express from "express";
import mysql from "mysql2"

const app = express();
const port = 3000

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'test_database'
}).promise()

const result = await pool.query("SELECT * FROM table1")
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
