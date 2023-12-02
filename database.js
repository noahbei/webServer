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
    return result
}

export async function createProfile(ProfileName, aid, Currency = 0, Exp = 0) {
    const result = await pool.query(`
        INSERT INTO profile (ProfileName, AccountID, Currency, Exp)
        VALUES (?, ?, ?, ?);
    `, [ProfileName, aid, Currency, Exp]);
    return result;
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
    SELECT
        pc.CardID,
        c.Name AS CardName,
        c.Description AS CardDescription,
        pc.CardCount
    FROM
        profile_cards pc
    JOIN
        cards c ON pc.CardID = c.CardID
    WHERE
        pc.ProfileID = ?
    `, [profileID])
    return rows
}

/* export async function addCards(pid, cardsJSON) {
    const results = []
    
    const testObj = {
        //cardID : count
        "1234": "3",
        "1235": "2",
        "1236": "7",
    }
    
    const result = await pool.query(`
        INSERT INTO profile_cards (ProfileID, CardID, CardCount)
        VALUES (?, ?, ?);
    `, [pid, cardList, cardCount]);
    results.push(result)
    return results;
} */

export async function addCard(pid, cardID) {
    const existingRow = await pool.query(`
      SELECT CardCount
      FROM profile_cards
      WHERE ProfileID = ? AND CardID = ?
    `, [pid, cardID]);
  
    if (existingRow.length > 0) {
      const updatedCount = existingRow[0].CardCount + 1;
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
export async function getProfileID(profileName) {
    const [rows] = await pool.query(`
    SELECT
        ProfileID
    FROM
        profile
    WHERE
        ProfileName = ?
    `, [profileName])
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

