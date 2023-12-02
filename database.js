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

export async function createAccount(Username, Password, FName, LName, Age, Gender, Email, ProfileID) {
    const result = await pool.query(`
    INSERT INTO account (Username, Password, FName, LName, Age, Gender, Email, ProfileID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `, [Username, Password, FName, LName, Age, Gender, Email, ProfileID])
    return result
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

export async function getProfileID(username, password) {
    const [rows] = await pool.query(`
    SELECT
        p.ProfileID
    FROM
        account a
    JOIN
        profile p ON a.ProfileID = p.ProfileID
    WHERE
        a.Username = ? AND
        a.Password = ?
    `, [username, password])
    return rows[0]
}