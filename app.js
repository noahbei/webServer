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

// handles getting all the cards available in the game
app.get("/cards", async (req, res) => {
    try {
        const cards = await database.getCards();
        res.send(cards);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

// handles getting all the cards that a profile owns this
app.get("/profiles/:pid/cards", async (req, res) => {
    try {
        const pid = req.params.pid;
        const cards = await database.getProfileCards(pid);
        res.send(cards);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

// given a card id and profile id, add a single card to a profile
app.post("/profiles/:pid/add-card", async (req, res) => {
    try {
        const pid = req.params.pid;
        const { cardID } = req.body;
        const result = await database.addCard(pid, cardID);
        console.log(result);
        res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// given a list of cards and a profile id, add all the cards into the profile
// only use once if we want to insert card values into a user's profile
app.post("/profiles/:pid/initialize-cards", async (req, res) => {
    try {
        const pid = req.params.pid;
        const cardsJSON = req.body;
        const result = await database.initializeCards(pid, cardsJSON);
        console.log(result);
        res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// handles getting information about a profile given its profile id
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

// gets all of the accounts in the database and their associated information
app.get("/accounts-all", async (req, res) => {
    try {
        const accounts = await database.getAccounts();
        res.send(accounts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

// given an account id, gets the information associated with the account
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

// given the username and password of an account, creates the account
app.post("/account/login", async (req, res) => {
    try {
        const {Username, Password} = req.body
        console.log("User", Username, "pass", Password)
        const aid = await database.getAccountIDWithAuth(Username, Password);
        console.log(aid)
        if (aid !== undefined) {
            res.send(aid);
        }
        else {
            res.send([-1])
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

// will need to adapt depending on account-profile relationship
// probably make it so that each username is unique
app.post("/accounts", async (req, res) => {
    try {
        //'your_username', 'your_password', 'John', 'Doe', 25, 'Male', 'john.doe@example.com', 1
        const {Username, Password, FName, LName, Age, Gender, Email} = req.body
        const [aid] = await database.createAccount(Username, Password, FName, LName, Age, Gender, Email)
        console.log(aid);
        res.send([{"AccountID":aid}])
    } catch (error) {
        console.error("Error posting account data: " + error)
        res.send("Error")
    }
})

// need to cap number of profiles to 3 in future
// make sure that there is not already a profile of the same name belonging to the same account
app.post("/profiles", async (req, res) => {
    try {
        const { ProfileName, AccountID, Currency, Exp } = req.body;
        const [pid] = await database.createProfile(ProfileName, AccountID, Currency, Exp);
        const defaultCards = await database.addDefaultCards(pid);
        console.log(pid);
        res.send([{"ProfileID":pid}]);
    } catch (error) {
        console.error("Error posting profile data: " + error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// gets all of the profiles in the database and associated information
app.get("/profiles-all", async (req, res) => {
    try {
        const profiles = await database.getProfiles();
        res.send(profiles);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

// gets the profiles that are associated with the account given an aid
app.get("/profiles/accountid/:aid", async (req, res) => {
    try {
        const aid = req.params.aid;
        const profile = await database.getProfileID(aid);
        res.send(profile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

