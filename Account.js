//import to load environment variables from .env file
require('dotenv').config();

//bcrypt library for hashing passwords
const bcrypt = require('bcrypt');

//mssql for connecting with the database
const sql = require('mssql');

//configuring the database connection
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

//TODO: Connect to the account/register HTML pages functionally

//START TESTING FUNCTIONS:
//devResetTable();

// console.log("Starting emailStored...");
// emailStored('test user again');

console.log("Starting validLogin...");
validLogin('test user again', '123456789012345678901234567890123456789012345678901234567890');

//console.log("Starting newUser...");
//newUser('first', 'last', 'test user again', '123456789012345678901234567890123456789012345678901234567890');

//console.log("Starting deleteUser...");
//deleteUser('test user', 9912);

//console.log("All done!");
//END TESTING FUNCTIONS


async function emailStored(email){
    let rowExists = false;
    try{
        console.log("Reading rows from the Table...");

        var poolConnection = await sql.connect(config);

        var sqlQuery = 'SELECT TOP 1 * FROM [dbo].[Account] WHERE [Email]=@email';

        const ps = new sql.PreparedStatement(poolConnection)
        ps.input('email', sql.VarChar(255))
        //create prepared statement
        ps.prepare(sqlQuery, err => {
            if(err){
                console.log(err);
                poolConnection.close();
                console.log("Connection closed.");
            }

            //execute prepared statement with values entered
            ps.execute({email: email}, (err, result) => {
                if(err){
                    console.log(err);
                    poolConnection.close();
                    console.log("Connection closed.");
                }

                rowExists = result.recordset.length !== 0;
                console.log(result);

                // release the connection after queries are executed
                ps.unprepare(err => {
                    if(err){
                        console.log(err);
                    }
                    poolConnection.close();
                    console.log("Success. Connection closed.");
                })
            })
        })
    }
    catch(err){
        //log error message and close connection
        console.log(err.message);
        poolConnection.close();
        console.log("Connection closed.");
    }
    finally{
        //return true if at least one column matches the email
        console.log("Row Exists: " + rowExists);
        return rowExists;
    }
}

//TODO: Move password encryption to a preliminary step before calling this function in other files
//TODO: Still needs a fix to return the correct value, or could be refactored if we want
async function validLogin(email,password){
    let rowExists = false, validPass = false, fullName = "", storedPassword = "";
    try{
        console.log("Reading rows from the Table...");
        
        var poolConnection = await sql.connect(config);

        var sqlQuery = `SELECT TOP 1 * FROM [dbo].[Account] WHERE [Email]=@email`;

        const ps = new sql.PreparedStatement(poolConnection)
        ps.input('email', sql.VarChar(255))
        //create prepared statement
        ps.prepare(sqlQuery, err => {
            if(err){
                console.log(err);
                poolConnection.close();
                console.log("Connection closed.");
            }

            //execute prepared statement with values entered
            ps.execute({email: email}, (err, result) => {
                if(err){
                    console.log(err);
                    poolConnection.close();
                    console.log("Connection closed.");
                }
                console.log(result);
                rowExists = result.recordset.length !== 0;
                fullName = result.recordset[0].FirstName + " " + result.recordset[0].LastName;
                storedPassword = result.recordset[0].EncryptedPassword;

                // release the connection after queries are executed
                ps.unprepare(err => {
                    if(err){
                        console.log(err);
                    }
                    // console.log('re ' + rowExists);
                    bcrypt.compare(password, storedPassword, (err, result) => {
                        if (err){
                            console.log(err)
                        }

                        //password match
                        if (result) {
                            validPass = true;
                        }
                    });
                    // console.log('fn ' + fullName);
                    poolConnection.close();
                    console.log("Success. Connection closed.");
                })
            })
        })
    }
    catch(err){
        //log error message and close connection
        console.log(err.message);
        poolConnection.close();
        console.log("Connection closed.");
    }
    finally{
        //Testing
        console.log(rowExists);
        console.log(validPass);
        console.log(storedPassword);
        console.log(fullName);
        //return true if at least one column matches the email and password, and the user's name to use in the site
        if(rowExists && validPass){
            return fullName;
        }
        else{
            return null;
        }
    }
}

//TODO: Move password encryption to a preliminary step before calling this function in other files
async function newUser(firstName,lastName,email,password){
    try{
        //hashing the password for security
        const salt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(password, salt);

        console.log("Inserting rows into the Table...");

        var poolConnection = await sql.connect(config);

        var sqlQuery = `INSERT INTO [dbo].[Account] (FirstName, LastName, Email, EncryptedPassword) VALUES (@firstName, @lastName, @email, @encryptedPassword)`;
        const ps = new sql.PreparedStatement(poolConnection)
        ps.input('firstName', sql.VarChar(255))
        ps.input('lastName', sql.VarChar(255))
        ps.input('email', sql.VarChar(255))
        ps.input('encryptedPassword', sql.Char(60))
        //create prepared statement
        ps.prepare(sqlQuery, err => {
            if(err){
                console.log(err);
                poolConnection.close();
                console.log("Connection closed.");
            }

            //execute prepared statement with values entered
            ps.execute({firstName: firstName, lastName: lastName, email: email, encryptedPassword: encryptedPassword}, (err, result) => {
                if(err){
                    console.log(err);
                    poolConnection.close();
                    console.log("Connection closed.");
                }

                // release the connection after queries are executed
                ps.unprepare(err => {
                    if(err){
                        console.log(err);
                    }
                    poolConnection.close();
                    console.log("Success. Connection closed.");
                })
            })
        })
    }
    catch(err){
        //log error message and close connection
        console.log(err.message);
        poolConnection.close();
        console.log("Connection closed.");
    }
}

//TODO: Move password encryption to a preliminary step before calling this function in other files
async function deleteUser(email,password){
    try{
        //hashing the password for security
        const salt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(password, salt);

        console.log("Deleting row from the Table...");

        var poolConnection = await sql.connect(config);

        var sqlQuery = `DELETE FROM [dbo].[Account] WHERE Email=@email AND EncryptedPassword=@encryptedPassword`;

        ps.input('email', sql.VarChar(255))
        ps.input('encryptedPassword', sql.Char(60))
        //create prepared statement
        ps.prepare(sqlQuery, err => {
            if(err){
                console.log(err);
                poolConnection.close();
                console.log("Connection closed.");
            }

            //execute prepared statement with values entered
            ps.execute({firstName: firstName, lastName: lastName, email: email, encryptedPassword: encryptedPassword}, (err, result) => {
                if(err){
                    console.log(err);
                    poolConnection.close();
                    console.log("Connection closed.");
                }

                // release the connection after queries are executed
                ps.unprepare(err => {
                    if(err){
                        console.log(err);
                    }
                    poolConnection.close();
                    console.log("Success. Connection closed.");
                })
            })
        })
    }
    catch(err){
        //log error message and close connection
        console.log(err.message);
        poolConnection.close();
        console.log("Connection closed.");
    }
}

async function devResetTable() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("DEVELOPER ONLY: Resetting the Table...");
        await poolConnection.request().query(
            `DELETE FROM [dbo].[Account]`
        );
        await poolConnection.request().query(
            `DBCC CHECKIDENT('Account', RESEED, 0)`
        );

        // close connection only when we're certain application is finished
        poolConnection.close();
        console.log("Connection closed.");
    } catch (err) {
        console.error(err.message);
        poolConnection.close();
        console.log("Connection closed.");
    }
}

async function connectAndQuery() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(
            `SELECT *
            FROM [dbo].[testing]`);

        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // ouput row contents from default record set
        resultSet.recordset.forEach(row => {
            console.log("%s\t%s", row.num, row.word);
        });

        // close connection only when we're certain application is finished
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {emailStored, validLogin, newUser};