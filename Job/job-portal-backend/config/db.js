const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

pool.getConnection((error, connection) => {
  if (error) console.error("MySQL connection failed:", error.message);
  else {
    console.log("MySQL database connected successfully");
    connection.release();
  }
});

module.exports = pool.promise();
