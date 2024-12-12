/**
 * frontend.js
 * 
 * This file handles running the frontend on port 3000 using Node.js
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

//Basic setup to serve static public files (frontend)
app.use('/', express.static(__dirname));

//Starts the frontend server
app.listen(PORT, () => {
  console.log(`Frontend server is running on http://localhost:${PORT}`);
});