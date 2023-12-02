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

app.get("/profiles/:pid/cards", async (req, res) => {
    try {
        const pid = req.params.id;
        const cards = await database.getProfileCards(pid);
        res.send(cards);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get("/profiles/:pid", async (req, res) => {
    try {
        const pid = req.params.id;
        const profile = await database.getProfile(pid);
        res.send(profile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get("/accounts-all", async (req, res) => {
    try {
        const accounts = await database.getAccounts();
        res.send(accounts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get("/accounts/:id", async (req, res) => {
    try {
        const aid = req.params.id;
        const account = await database.getAccount(aid);
        res.send(account);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post("/account-data", async (req, res) => {
    try {
        //'your_username', 'your_password', 'John', 'Doe', 25, 'Male', 'john.doe@example.com', 1
        const {Username, Password, FName, LName, Age, Gender, Email, ProfileID} = req.body
        const result = await database.createAccount(Username, Password, FName, LName, Age, Gender, Email, ProfileID)
        console.log(result);
        res.send(result)
    } catch (error) {
        console.error("Error posting account data: " + error)
        res.send("Error")
    }
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
