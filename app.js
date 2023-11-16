import express from "express";
import * as database from "./database.js";

const app = express();
const port = 3000


app.get("/", (req, res) => {
    res.send("server running");
})

app.post("/account-data", async (req, res) => {
    try {
        const result = await database.createAccount('2', 'jane', 'password', '13', 'this2@email.com', '2010-12-03', 'female', 'jane doe')
        console.log(result);
        res.send(result)
    } catch (error) {
        console.error("Error posting account data: " + error)
        res.send("Error")
    }
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
