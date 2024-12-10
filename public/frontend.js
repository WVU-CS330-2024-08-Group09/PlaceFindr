//simple setup to run frontend on port 3000
const express = require('express'); 
const path = require('path'); 

const app = express(); 
const PORT = 3000; 

//Basic setup to serve static public files (frontend)
app.use('/', express.static(__dirname));
 
app.listen(PORT, () => { 
    console.log(`Frontend server is running on http://localhost:${PORT}`); 
}); 