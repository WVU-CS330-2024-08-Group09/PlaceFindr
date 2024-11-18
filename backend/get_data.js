//import to load environment variables from .env file
require('dotenv').config();

//mssql for connecting with the database
const sql = require('mssql');

async function fetchData(email){
    var sqlQuery = `SELECT TOP 10 * FROM [dbo].[weather_grid_data]`;
    const ps = new sql.PreparedStatement(poolConnection)
    //create prepared statement
    ps.prepare(sqlQuery, err => {
        if(err){
            console.error(err.message);
        }

        //execute prepared statement with values entered
        ps.execute({email: email}, (err, result) => {
            if(err){
                console.error(err.message);
                return res.status(500).json({
                    error: 'Failed to execute data retrieval query',
                    details: err.message
                });
            }
            console.log(result);
            res.json(result);
        })
    })
}

export default fetchData;