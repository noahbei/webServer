import express from "express";
import * as database from "./database.js";

const app = express();
const port = 3000

app.use(express.json())

app.get("/", (req, res) => {
    res.send("server running");
})

app.get("/error", (req, res) => {
    res.send("There was an error connecting to the database")
})

app.get("/account-data", async (req, res) => {
    try {
        const accounts = await database.getData();
        res.send(accounts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get("/account-data/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const account = await database.getAccount(id);
        res.send(account);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post("/account-data", async (req, res) => {
    try {
        //'2', 'jane', 'password', '13', 'this2@email.com', '2010-12-03', 'female', 'jane doe'
        const {userID, username, password, age, email, birthdate, gender, name} = req.body
        const result = await database.createAccount(userID, username, password, age, email, birthdate, gender, name)
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
