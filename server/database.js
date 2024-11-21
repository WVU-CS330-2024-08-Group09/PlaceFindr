require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use if connecting to Azure SQL
    trustServerCertificate: false // Change to true for local dev/self-signed certs
  }
};

async function queryDatabase(query, params = []) {
  try {
    // Create a new connection pool
    const pool = await sql.connect(config);
    const request = pool.request();

    // Handle params as objects with name and value properties
    params.forEach(param => {
      request.input(param.name, param.value);
    });

    // Execute the query
    const result = await request.query(query);
    return result.recordset;  // Return the data as an array
  } catch (err) {
    console.error("SQL Query Error:", err);
    throw err;
  } finally {
  await sql.close(); // Close the connection pool
  }
}

module.exports = { queryDatabase };

