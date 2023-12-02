import mysql from "mysql2"
import dotenv from 'dotenv'

dotenv.config()

// prepared statement: sending sql and values separately
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getAccounts() {
    const [rows] = await pool.query("SELECT * FROM account")
    return rows
}

export async function getProfiles() {
    const [rows] = await pool.query("SELECT * FROM profile")
    return rows
}

export async function getCards() {
    const [rows] = await pool.query("SELECT * FROM cards")
    return rows
}

export async function getAccount(aid) {
    const [rows] = await pool.query(`
    SELECT
        *
    FROM
        account 
    WHERE
        AccountID = ? 
    `, [aid])
    return rows[0]
}

export async function createAccount(Username, Password, FName, LName, Age, Gender, Email) {
    const result = await pool.query(`
    INSERT INTO account (Username, Password, FName, LName, Age, Gender, Email)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `, [Username, Password, FName, LName, Age, Gender, Email])
    // return the AID
    return [result[0].insertId];
}

// need to make sure there isn't already a profile named the same under the account
export async function createProfile(ProfileName, aid, Currency = 0, Exp = 0) {
    const result = await pool.query(`
        INSERT INTO profile (ProfileName, AccountID, Currency, Exp)
        VALUES (?, ?, ?, ?);
    `, [ProfileName, aid, Currency, Exp]);
    // returns the PID
    return [result[0].insertId];
}

export async function appendPIdToAccount(AccountID, ProfileID) {
    const result = await pool.query(`
        UPDATE account
        SET ProfileID = ?
        WHERE AccountID = ?;
    `, [ProfileID, AccountID]);
    return result;
}

export async function getProfile(profileID) {
    const [rows] = await pool.query(`
    SELECT
        *
    FROM
        profile
    WHERE
        ProfileID = ?
    `, [profileID])
    return rows[0]
}

export async function getProfileCards(profileID) {
    const [rows] = await pool.query(`
    SELECT pc.ProfileID, pc.CardID, pc.CardCount, c.Name, c.Description
    FROM profile_cards pc
    LEFT JOIN cards c ON pc.CardID = c.CardID
    WHERE pc.ProfileID = ?
    `, [profileID]);
    return rows
}

export async function initializeCards(pid, cardsJSON) {
    const results = []
    const testObj = {
        //cardID : count
        "1234": "3",
        "1235": "2",
        "1236": "7",
    }
    for (const cardID in cardsJSON) {
        const cardCount = Number(cardsJSON[cardID])
        const result = await pool.query(`
            INSERT INTO profile_cards (ProfileID, CardID, CardCount)
            VALUES (?, ?, ?);
        `, [pid, cardID, cardCount]);
        results.push(result)
    }
    
    return results;
}

export async function addDefaultCards(pid) {
    const cardsJSON = {
      //cid: card count
        "1": "3",
        "2": "2",
        "3": "7"
    }
    const newCardsJSON = {
        '17275': '3',
        '13208': '3',
        '11865': '3',
        '18362': '3',
        '10247': '3',
        '19843': '3',
        '25858': '5',
        '26836': '5',
        '24487': '5',
        '28100': '5',
        '25734': '5',
        '25281': '5',
        '25902': '5',
        '25991': '5'
    }
    await initializeCards(pid, cardsJSON)
}

export async function addCard(pid, cardID) {
    const existingRow = await pool.query(`
      SELECT CardCount
      FROM profile_cards
      WHERE ProfileID = ? AND CardID = ?
    `, [pid, cardID]);

    if (existingRow[0].length > 0) {
        const CardCount = Number(existingRow[0][0].CardCount)
        const updatedCount = CardCount + 1;
        const result = await pool.query(`
            UPDATE profile_cards
            SET CardCount = ?
            WHERE ProfileID = ? AND CardID = ?
        `, [updatedCount, pid, cardID]);
        return result;
    }
    else {
      const result = await pool.query(`
        INSERT INTO profile_cards (ProfileID, CardID, CardCount)
        VALUES (?, ?, 1);
      `, [pid, cardID]);
      return result;
    }
}

// what if mulitple people have same prof name
export async function getProfileID(profileName, aid) {
    const [rows] = await pool.query(`
    SELECT
        ProfileID
    FROM
        profile
    WHERE
        ProfileName = ? AND AccountID = ?
    `, [profileName, aid])
    return rows[0]
}

// what if multiple people have same account username
export async function getAccountID(username) {
    const [rows] = await pool.query(`
    SELECT
        AccountID
    FROM
        account
    WHERE
        Username = ?
    `, [username])
    return rows[0]
}

