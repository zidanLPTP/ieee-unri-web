
require("dotenv").config();

const mysql = require("mysql2/promise");

async function testDB() {
  console.log("Testing DB connection...");
  console.log("Host:", process.env.DB_HOST);
  console.log("User:", process.env.DB_USER);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 5000,
    });

    const [rows] = await connection.query("SELECT 1 + 1 AS result");
    console.log("DB CONNECTED", rows);

    await connection.end();
  } catch (error) {
    console.error("DB FAILED ");
    console.error("Message:", error.message);
  }
}

testDB();
