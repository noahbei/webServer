# WebServer for Untitled Card Game

## Overview

This repository contains the web server for a card game made in Unity. The server is built using Node.js and Express.js, and it utilizes the dotenv library for environment variable management. The core functionalities for handling database operations are encapsulated in the `database.js` file, which is then utilized by the `app.js` file for various route handlers.

## Technologies Used

- Node.js
- Express.js
- dotenv

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/webServer.git
cd webServer
```
Install dependencies:
```bash
npm i
```
Rename the `.env-template` to `.env`. Add the required environment variables, for example:
```plaintext
DB_HOST=localhost
DB_USER=username
DB_PASSWORD=password
DB_DATABASE=cardgame_db
```
Usage
To start the web server, run:

```bash
npm start
```
This will launch the server on the specified port (default is 3000). You can access the API at http://localhost:3000 or the configured port.

# Structure
- app.js: Main file containing route handlers and server setup.
- database.js: File with functions for handling database operations.

# Database Configuration
Ensure that you have a MySQL database set up with the credentials specified in your .env file.
