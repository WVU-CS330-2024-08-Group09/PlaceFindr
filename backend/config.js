require('dotenv').config();
const sql = require('mssql');

// Database configuration object using environment variables for security
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Enables encryption for Azure SQL
    enableArithAbort: true,
  },
};

/**
 * Establishes a connection to the Azure SQL database.
 * Logs a success or error message depending on the connection status.
 */
const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("Connected to Azure SQL Database");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

module.exports = { sql, connectDB };